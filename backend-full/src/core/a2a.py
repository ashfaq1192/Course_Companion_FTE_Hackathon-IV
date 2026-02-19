"""
A2A Protocol (L7) — Agent-to-Agent communication models and task handler.

Implements the Google A2A specification (lightweight):
  - Agent Card: discovery metadata at /.well-known/agent.json
  - Task lifecycle: submitted -> working -> completed / failed
  - JSON-RPC 2.0 style task send/receive
"""

from __future__ import annotations

import uuid
import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field

from ..core.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Agent Card (A2A spec: /.well-known/agent.json)
# ---------------------------------------------------------------------------

class AgentSkill(BaseModel):
    id: str
    name: str
    description: str
    tags: list[str] = []
    examples: list[str] = []


class AgentCard(BaseModel):
    name: str = "Course Companion FTE"
    description: str = (
        "An AI-powered course companion that explains concepts, guides quizzes, "
        "tutors via Socratic method, and tracks learning progress."
    )
    url: str = f"http://localhost:{settings.SERVER_PORT}"
    version: str = settings.APP_VERSION
    protocol_version: str = "0.1"
    capabilities: dict[str, Any] = {
        "streaming": False,
        "pushNotifications": False,
    }
    authentication: dict[str, Any] = {
        "schemes": ["bearer"],
        "credentials": "JWT token from /api/v1/auth/login",
    }
    skills: list[AgentSkill] = [
        AgentSkill(
            id="explain_concept",
            name="Explain Course Content",
            description="Search and explain course material grounded in actual content.",
            tags=["education", "explanation", "content"],
            examples=["Explain what LLMs are", "What is prompt engineering?"],
        ),
        AgentSkill(
            id="guide_quiz",
            name="Quiz Guidance",
            description="Retrieve quiz questions and provide guided learning.",
            tags=["education", "quiz", "assessment"],
            examples=["Show me quiz questions for chapter 3"],
        ),
        AgentSkill(
            id="socratic_tutor",
            name="Socratic Tutor",
            description="Generate Socratic follow-up questions to deepen understanding.",
            tags=["education", "socratic", "tutoring"],
            examples=["Help me understand transformers", "Guide me through attention mechanisms"],
        ),
        AgentSkill(
            id="celebrate_progress",
            name="Progress Celebration",
            description="Check learning progress and generate encouragement.",
            tags=["education", "progress", "gamification"],
            examples=["Show my progress", "How am I doing?"],
        ),
    ]


def get_agent_card() -> dict[str, Any]:
    """Return the agent card as a dictionary."""
    return AgentCard().model_dump()


# ---------------------------------------------------------------------------
# Task lifecycle models
# ---------------------------------------------------------------------------

class TaskState(str, Enum):
    SUBMITTED = "submitted"
    WORKING = "working"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskMessage(BaseModel):
    role: str  # "user" or "agent"
    parts: list[dict[str, Any]]  # [{"type": "text", "text": "..."}]


class A2ATask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    state: TaskState = TaskState.SUBMITTED
    messages: list[TaskMessage] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: dict[str, Any] = {}


# In-memory task store (sufficient for hackathon demo)
_task_store: dict[str, A2ATask] = {}


def get_task(task_id: str) -> Optional[A2ATask]:
    return _task_store.get(task_id)


def list_tasks() -> list[A2ATask]:
    return list(_task_store.values())


# ---------------------------------------------------------------------------
# Task handler — routes incoming A2A tasks to agents
# ---------------------------------------------------------------------------

async def handle_task(task_input: str, skill_id: str | None = None, provider: str = "auto") -> A2ATask:
    """Process an incoming A2A task.

    Args:
        task_input: The natural language task text.
        skill_id: Optional skill to target directly.
        provider: LLM provider — 'claude', 'openai', or 'auto' (tries Claude first).

    Returns:
        A2ATask with the result.
    """
    task = A2ATask(
        messages=[TaskMessage(
            role="user",
            parts=[{"type": "text", "text": task_input}],
        )],
    )
    task.state = TaskState.WORKING
    _task_store[task.id] = task

    try:
        result = await _route_to_agent(task_input, skill_id, provider)

        task.messages.append(TaskMessage(
            role="agent",
            parts=[{"type": "text", "text": (
                result if isinstance(result, str) else
                result.get("explanation", result.get("response", str(result)))
            )}],
        ))
        task.metadata["result"] = result if isinstance(result, dict) else {"response": result}
        task.state = TaskState.COMPLETED
    except Exception as e:
        logger.error(f"A2A task {task.id} failed: {e}")
        task.messages.append(TaskMessage(
            role="agent",
            parts=[{"type": "text", "text": f"Task failed: {str(e)}"}],
        ))
        task.state = TaskState.FAILED
        task.metadata["error"] = str(e)

    task.updated_at = datetime.now(timezone.utc).isoformat()
    _task_store[task.id] = task
    return task


async def _route_to_agent(task_input: str, skill_id: str | None, provider: str) -> Any:
    """Route to the best agent based on skill_id and provider preference."""

    # If provider is explicitly Claude or auto, try Claude agents first
    if provider in ("claude", "auto"):
        try:
            from ..core.claude_agents import run_claude_agent
            return await run_claude_agent(task_input)
        except Exception as e:
            if provider == "claude":
                raise
            logger.warning(f"Claude agent failed, falling back to OpenAI: {e}")

    # Fall back to OpenAI orchestrator
    from ..core.agents import run_orchestrator
    result = await run_orchestrator(task_input)
    return {
        "agent": result.last_agent.name if result.last_agent else "unknown",
        "response": result.final_output,
    }
