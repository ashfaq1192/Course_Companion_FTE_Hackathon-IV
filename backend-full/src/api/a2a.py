"""
A2A Protocol (L7) — HTTP endpoints for agent-to-agent communication.

Endpoints:
  GET  /.well-known/agent.json     — Agent Card discovery (mounted at app level)
  POST /a2a/tasks/send             — Submit a task for processing
  GET  /a2a/tasks/{task_id}        — Check task status / retrieve result
  GET  /a2a/tasks                  — List all tasks
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..core.a2a import get_agent_card, handle_task, get_task, list_tasks


router = APIRouter()


class TaskSendRequest(BaseModel):
    task: str
    skill_id: Optional[str] = None
    provider: str = "auto"  # "claude", "openai", or "auto"


@router.post("/a2a/tasks/send", response_model=dict, tags=["A2A Protocol"])
async def send_task(request: TaskSendRequest):
    """Submit a task to the Course Companion agent via A2A protocol (JSON-RPC 2.0 style)."""
    result = await handle_task(
        task_input=request.task,
        skill_id=request.skill_id,
        provider=request.provider,
    )
    return result.model_dump()


@router.get("/a2a/tasks/{task_id}", response_model=dict, tags=["A2A Protocol"])
async def get_task_status(task_id: str):
    """Check the status of an A2A task."""
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task.model_dump()


@router.get("/a2a/tasks", response_model=list, tags=["A2A Protocol"])
async def list_all_tasks():
    """List all A2A tasks."""
    return [t.model_dump() for t in list_tasks()]
