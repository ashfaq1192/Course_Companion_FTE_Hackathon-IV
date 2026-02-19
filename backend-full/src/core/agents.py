"""
OpenAI Agents SDK (L4) — Agent definitions for Course Companion FTE.

Two agents wrap the existing hybrid-intelligence service methods:
  1. AdaptivePathAgent   — personalised learning-path generation
  2. GradingAgent        — LLM-graded free-form assessment
"""

from __future__ import annotations

import json
from typing import Any

from agents import Agent, function_tool, Runner, RunResult

from ..core.config import settings


# ---------------------------------------------------------------------------
# Tool functions (thin wrappers around HybridIntelligenceService)
# ---------------------------------------------------------------------------

@function_tool
async def generate_adaptive_path(user_id: int, learning_style: str, pace: str) -> str:
    """Generate a personalised adaptive learning path for a student.

    Args:
        user_id: The student's database ID.
        learning_style: Preferred learning style (e.g. visual, reading, hands-on).
        pace: Desired pace (e.g. slow, moderate, fast).

    Returns:
        JSON string with recommended_courses, reasoning, and cost.
    """
    from ..database.session import SessionLocal
    from ..services.hybrid_intelligence_service import HybridIntelligenceService

    db = SessionLocal()
    try:
        service = HybridIntelligenceService(db)
        path = await service.generate_adaptive_learning_path(
            user_id=user_id,
            user_preferences={"learning_style": learning_style, "pace": pace},
        )
        return json.dumps({
            "id": path.id,
            "recommended_courses": json.loads(path.recommended_courses),
            "reasoning": path.reasoning,
            "cost_usd": float(path.cost_usd) if path.cost_usd else 0.0,
        })
    finally:
        db.close()


@function_tool
async def grade_assessment(
    user_id: int,
    quiz_attempt_id: int,
    question_id: str,
    answer_text: str,
) -> str:
    """Grade a student's free-form answer using LLM analysis.

    Args:
        user_id: The student's database ID.
        quiz_attempt_id: The quiz attempt to grade against.
        question_id: The question being answered.
        answer_text: The student's free-form response.

    Returns:
        JSON string with score, feedback, strengths, and areas for improvement.
    """
    from ..database.session import SessionLocal
    from ..services.hybrid_intelligence_service import HybridIntelligenceService

    db = SessionLocal()
    try:
        service = HybridIntelligenceService(db)
        assessment = await service.grade_assessment_with_llm(
            user_id=user_id,
            quiz_attempt_id=quiz_attempt_id,
            question_id=question_id,
            answer_text=answer_text,
        )
        return json.dumps({
            "id": assessment.id,
            "llm_grade": json.loads(assessment.llm_grade),
            "cost_usd": float(assessment.cost_usd) if assessment.cost_usd else 0.0,
        })
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Agent definitions
# ---------------------------------------------------------------------------

adaptive_path_agent = Agent(
    name="AdaptivePathAgent",
    instructions=(
        "You are a learning-path advisor. When asked to create an adaptive "
        "learning path for a student, call the generate_adaptive_path tool "
        "with the student's user_id, learning_style, and pace. Return the "
        "result to the caller."
    ),
    model="gpt-4o-mini",
    tools=[generate_adaptive_path],
)

grading_agent = Agent(
    name="GradingAgent",
    instructions=(
        "You are an assessment grader. When asked to grade a student's "
        "free-form answer, call the grade_assessment tool with the "
        "user_id, quiz_attempt_id, question_id, and answer_text. "
        "Return the grading result to the caller."
    ),
    model="gpt-4o-mini",
    tools=[grade_assessment],
)


# ---------------------------------------------------------------------------
# Orchestrator (triage agent that routes to the right specialist)
# ---------------------------------------------------------------------------

orchestrator_agent = Agent(
    name="CourseCompanionOrchestrator",
    instructions=(
        "You are the Course Companion orchestrator. Based on the user's "
        "request, delegate to the appropriate specialist:\n"
        "- For learning path / adaptive path requests → hand off to AdaptivePathAgent\n"
        "- For grading / assessment requests → hand off to GradingAgent\n"
        "Always return the specialist's result verbatim."
    ),
    model="gpt-4o-mini",
    handoffs=[adaptive_path_agent, grading_agent],
)


async def run_orchestrator(task: str) -> RunResult:
    """Run the orchestrator agent with a given task string."""
    result = await Runner.run(orchestrator_agent, task)
    return result
