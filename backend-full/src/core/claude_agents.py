"""
Claude Agent SDK (L5) — Anthropic-powered agent definitions for Course Companion FTE.

Two Claude-powered agent functions:
  1. claude_explain_concept  — explain a topic using course content grounding
  2. claude_socratic_tutor   — generate Socratic follow-up questions

Plus an async run_claude_agent(task) orchestrator.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from ..core.config import settings

logger = logging.getLogger(__name__)


async def _get_claude_client():
    """Lazy-import and instantiate the Anthropic async client."""
    from anthropic import AsyncAnthropic
    return AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


async def claude_explain_concept(query: str, course_id: str | None = None) -> dict[str, Any]:
    """Explain a concept using Claude, grounded in course content.

    Args:
        query: The topic or concept to explain.
        course_id: Optional course ID for context.

    Returns:
        Dict with explanation, related_topics, and model used.
    """
    from ..database.session import SessionLocal
    from ..services.content_service import ContentService

    db = SessionLocal()
    try:
        service = ContentService(db)
        results = service.search_content(query, course_id=course_id, skip=0, limit=3)

        context_text = ""
        if results:
            sections = []
            for r in results:
                sections.append(f"## {r.title}\n{r.content_data[:1500] if r.content_data else ''}")
            context_text = "\n\n".join(sections)

        client = await _get_claude_client()
        response = await client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": (
                    f"You are a helpful course tutor. Using the following course material as context, "
                    f"explain the concept: '{query}'\n\n"
                    f"--- Course Material ---\n{context_text}\n---\n\n"
                    f"Provide a clear, concise explanation suitable for a student. "
                    f"If the course material doesn't cover this topic, say so and give a general explanation."
                ),
            }],
        )

        return {
            "query": query,
            "explanation": response.content[0].text,
            "model": settings.CLAUDE_MODEL,
            "sources": [{"id": r.id, "title": r.title} for r in results] if results else [],
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }
    finally:
        db.close()


async def claude_socratic_tutor(student_question: str, course_id: str | None = None) -> dict[str, Any]:
    """Generate Socratic follow-up questions using Claude.

    Args:
        student_question: The student's question or statement.
        course_id: Optional course ID for context.

    Returns:
        Dict with follow-up questions, guidance, and model used.
    """
    from ..database.session import SessionLocal
    from ..services.content_service import ContentService

    db = SessionLocal()
    try:
        service = ContentService(db)
        results = service.search_content(student_question, course_id=course_id, skip=0, limit=3)

        context_text = ""
        if results:
            sections = []
            for r in results:
                sections.append(f"## {r.title}\n{r.content_data[:500] if r.content_data else ''}")
            context_text = "\n\n".join(sections)

        client = await _get_claude_client()
        response = await client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": (
                    f"You are a Socratic tutor. A student asked: '{student_question}'\n\n"
                    f"Related course material:\n{context_text}\n\n"
                    f"Respond with exactly 3 Socratic follow-up questions that guide the student "
                    f"toward understanding without giving the answer directly. "
                    f"Format as a JSON object with keys: 'questions' (list of 3 strings), "
                    f"'hint' (a brief nudge toward the right direction)."
                ),
            }],
        )

        raw_text = response.content[0].text
        try:
            parsed = json.loads(raw_text)
        except json.JSONDecodeError:
            parsed = {"questions": [raw_text], "hint": ""}

        return {
            "student_question": student_question,
            "socratic_response": parsed,
            "model": settings.CLAUDE_MODEL,
            "related_content": [{"id": r.id, "title": r.title} for r in results] if results else [],
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }
    finally:
        db.close()


async def run_claude_agent(task: str) -> dict[str, Any]:
    """Route a natural-language task to the appropriate Claude agent function.

    Simple keyword-based routing:
      - 'socratic' or 'question' → claude_socratic_tutor
      - anything else → claude_explain_concept
    """
    task_lower = task.lower()
    if any(kw in task_lower for kw in ("socratic", "follow-up", "guide me", "help me understand")):
        return await claude_socratic_tutor(student_question=task)
    else:
        return await claude_explain_concept(query=task)
