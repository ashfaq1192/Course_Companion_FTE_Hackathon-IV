"""
MCP HTTP Integration (L6) — Exposes MCP tools via REST endpoints within FastAPI.

The standalone mcp_server.py provides stdio transport for Claude Desktop.
This module adds HTTP-based access to the same tool functionality.

Endpoints:
  GET  /mcp/tools                   — List available MCP tools
  POST /mcp/tools/{tool_name}       — Call an MCP tool
"""

import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Optional

from ..database.session import SessionLocal
from ..services.content_service import ContentService
from ..services.quiz_service import QuizService
from ..services.progress_service import ProgressService


router = APIRouter()


# ---------------------------------------------------------------------------
# Tool registry — mirrors mcp_server.py tool definitions
# ---------------------------------------------------------------------------

TOOLS = [
    {
        "name": "explain_course_content",
        "description": (
            "Search course content by keyword and return matching sections. "
            "Use this to ground explanations in actual course material."
        ),
        "parameters": {
            "query": {"type": "string", "required": True, "description": "The topic or keyword to search for"},
            "course_id": {"type": "string", "required": False, "description": "Optional course ID to narrow search"},
            "max_results": {"type": "integer", "required": False, "description": "Maximum results (1-10)", "default": 5},
        },
    },
    {
        "name": "guide_quiz",
        "description": "Retrieve quiz questions for a given content section.",
        "parameters": {
            "content_id": {"type": "integer", "required": True, "description": "Content ID whose quiz questions to retrieve"},
        },
    },
    {
        "name": "socratic_tutor",
        "description": "Given a student question, retrieve related content and generate Socratic follow-ups.",
        "parameters": {
            "student_question": {"type": "string", "required": True, "description": "The student's question"},
            "course_id": {"type": "string", "required": False, "description": "Optional course ID for context"},
        },
    },
    {
        "name": "celebrate_progress",
        "description": "Check user progress and generate a celebration message.",
        "parameters": {
            "user_id": {"type": "integer", "required": True, "description": "User ID to check progress for"},
        },
    },
]


class ToolCallRequest(BaseModel):
    """Request body for calling an MCP tool."""
    query: Optional[str] = None
    course_id: Optional[str] = None
    max_results: Optional[int] = 5
    content_id: Optional[int] = None
    student_question: Optional[str] = None
    user_id: Optional[int] = None


# ---------------------------------------------------------------------------
# Tool handlers (reuse logic from mcp_server.py)
# ---------------------------------------------------------------------------

def _explain_course_content(args: dict) -> dict:
    db = SessionLocal()
    try:
        service = ContentService(db)
        query = args["query"]
        course_id = args.get("course_id")
        max_results = min(args.get("max_results", 5), 10)

        results = service.search_content(query, course_id=course_id, skip=0, limit=max_results)

        sections = []
        for r in results:
            sections.append({
                "id": r.id,
                "title": r.title,
                "chapter": r.chapter_number,
                "content": r.content_data[:2000] if r.content_data else "",
            })

        return {"query": query, "results": sections}
    finally:
        db.close()


def _guide_quiz(args: dict) -> dict:
    db = SessionLocal()
    try:
        service = QuizService(db)
        content_id = args["content_id"]
        questions = service.get_questions_by_content_id(content_id)

        q_list = []
        for q in questions:
            q_list.append({
                "id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "options": q.options,
                "difficulty_level": q.difficulty_level,
            })

        return {"content_id": content_id, "questions": q_list}
    finally:
        db.close()


def _socratic_tutor(args: dict) -> dict:
    db = SessionLocal()
    try:
        service = ContentService(db)
        question = args["student_question"]
        course_id = args.get("course_id")

        results = service.search_content(question, course_id=course_id, skip=0, limit=3)

        context_sections = []
        for r in results:
            context_sections.append({
                "id": r.id,
                "title": r.title,
                "content_preview": (r.content_data[:500] if r.content_data else ""),
            })

        socratic_prompts = [
            f"What do you already know about '{results[0].title}'?" if results else "What have you tried so far?",
            "Can you break the problem into smaller parts?",
            "What would happen if you approached it from a different angle?",
        ]

        return {
            "student_question": question,
            "related_content": context_sections,
            "suggested_socratic_questions": socratic_prompts,
        }
    finally:
        db.close()


def _celebrate_progress(args: dict) -> dict:
    db = SessionLocal()
    try:
        service = ProgressService(db)
        user_id = args["user_id"]
        progress = service.get_all_progress_for_user(user_id)

        completed = sum(1 for p in progress if p.status == "completed")
        in_prog = sum(1 for p in progress if p.status == "in_progress")
        total_seconds = sum(p.time_spent_seconds or 0 for p in progress)

        return {
            "user_id": user_id,
            "completed_sections": completed,
            "in_progress_sections": in_prog,
            "total_hours_learned": round(total_seconds / 3600, 1),
            "celebration": (
                f"Amazing work! You've completed {completed} sections "
                f"and spent {round(total_seconds / 3600, 1)} hours learning. "
                "Keep up the great momentum!"
            ),
        }
    finally:
        db.close()


_HANDLERS = {
    "explain_course_content": _explain_course_content,
    "guide_quiz": _guide_quiz,
    "socratic_tutor": _socratic_tutor,
    "celebrate_progress": _celebrate_progress,
}


# ---------------------------------------------------------------------------
# HTTP endpoints
# ---------------------------------------------------------------------------

@router.get("/mcp/tools", response_model=list, tags=["MCP"])
async def list_mcp_tools():
    """List all available MCP tools with their schemas."""
    return TOOLS


@router.post("/mcp/tools/{tool_name}", response_model=dict, tags=["MCP"])
async def call_mcp_tool(tool_name: str, request: ToolCallRequest):
    """Call an MCP tool by name and return the result."""
    handler = _HANDLERS.get(tool_name)
    if not handler:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown tool: {tool_name}. Available: {list(_HANDLERS.keys())}",
        )

    args = {k: v for k, v in request.model_dump().items() if v is not None}

    try:
        return handler(args)
    except KeyError as e:
        raise HTTPException(status_code=422, detail=f"Missing required parameter: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool error: {str(e)}")
