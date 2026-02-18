"""
MCP Server (L6) for Course Companion FTE.

Exposes four tools matching the four ChatGPT skills:
  1. explain_course_content  — search + explain grounded in course material
  2. guide_quiz              — retrieve questions + provide guidance
  3. socratic_tutor          — generate Socratic follow-up questions
  4. celebrate_progress      — check progress + generate celebration

Transport: stdio (for local integration with Claude Desktop, etc.)
"""

import json
import sys
import os

# Ensure the project root is on sys.path so `src.*` imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from src.database.database import SessionLocal
from src.services.content_service import ContentService
from src.services.quiz_service import QuizService
from src.services.progress_service import ProgressService


app = Server("course-companion-mcp")


# ---------------------------------------------------------------------------
# Tool definitions
# ---------------------------------------------------------------------------

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="explain_course_content",
            description=(
                "Search course content by keyword and return matching sections. "
                "Use this to ground explanations in actual course material."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The topic or keyword to search for",
                    },
                    "course_id": {
                        "type": "string",
                        "description": "Optional course ID to narrow the search",
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results (1-10)",
                        "default": 5,
                    },
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="guide_quiz",
            description=(
                "Retrieve quiz questions for a given content section. "
                "Returns question text, type, and options so you can guide the student."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "content_id": {
                        "type": "integer",
                        "description": "The content ID whose quiz questions to retrieve",
                    },
                },
                "required": ["content_id"],
            },
        ),
        Tool(
            name="socratic_tutor",
            description=(
                "Given a student's question or misconception, retrieve related "
                "course content and generate Socratic follow-up questions."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "student_question": {
                        "type": "string",
                        "description": "The student's question or statement",
                    },
                    "course_id": {
                        "type": "string",
                        "description": "Optional course ID for context",
                    },
                },
                "required": ["student_question"],
            },
        ),
        Tool(
            name="celebrate_progress",
            description=(
                "Check a user's progress and generate a celebration message "
                "with statistics and encouragement."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The user ID to check progress for",
                    },
                },
                "required": ["user_id"],
            },
        ),
    ]


# ---------------------------------------------------------------------------
# Tool handlers
# ---------------------------------------------------------------------------

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    db = SessionLocal()
    try:
        if name == "explain_course_content":
            return _explain_course_content(db, arguments)
        elif name == "guide_quiz":
            return _guide_quiz(db, arguments)
        elif name == "socratic_tutor":
            return _socratic_tutor(db, arguments)
        elif name == "celebrate_progress":
            return _celebrate_progress(db, arguments)
        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]
    finally:
        db.close()


def _explain_course_content(db, args: dict) -> list[TextContent]:
    service = ContentService(db)
    query = args["query"]
    course_id = args.get("course_id")
    max_results = min(args.get("max_results", 5), 10)

    results = service.search_content(query, course_id=course_id, skip=0, limit=max_results)

    if not results:
        return [TextContent(type="text", text=f"No content found for query: {query}")]

    sections = []
    for r in results:
        sections.append({
            "id": r.id,
            "title": r.title,
            "chapter": r.chapter_number,
            "content": r.content_data[:2000] if r.content_data else "",
        })

    return [TextContent(
        type="text",
        text=json.dumps({"query": query, "results": sections}, indent=2),
    )]


def _guide_quiz(db, args: dict) -> list[TextContent]:
    service = QuizService(db)
    content_id = args["content_id"]
    questions = service.get_questions_by_content_id(content_id)

    if not questions:
        return [TextContent(type="text", text=f"No quiz questions found for content {content_id}")]

    q_list = []
    for q in questions:
        q_list.append({
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "options": q.options,
            "difficulty_level": q.difficulty_level,
        })

    return [TextContent(
        type="text",
        text=json.dumps({"content_id": content_id, "questions": q_list}, indent=2),
    )]


def _socratic_tutor(db, args: dict) -> list[TextContent]:
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
        f"What do you already know about the concepts in '{results[0].title}'?" if results else "What have you tried so far?",
        "Can you break the problem into smaller parts?",
        "What would happen if you approached it from a different angle?",
    ]

    return [TextContent(
        type="text",
        text=json.dumps({
            "student_question": question,
            "related_content": context_sections,
            "suggested_socratic_questions": socratic_prompts,
        }, indent=2),
    )]


def _celebrate_progress(db, args: dict) -> list[TextContent]:
    service = ProgressService(db)
    user_id = args["user_id"]
    progress = service.get_all_progress_for_user(user_id)

    completed = sum(1 for p in progress if p.status == "completed")
    in_prog = sum(1 for p in progress if p.status == "in_progress")
    total_seconds = sum(p.time_spent_seconds or 0 for p in progress)

    return [TextContent(
        type="text",
        text=json.dumps({
            "user_id": user_id,
            "completed_sections": completed,
            "in_progress_sections": in_prog,
            "total_hours_learned": round(total_seconds / 3600, 1),
            "celebration": (
                f"Amazing work! You've completed {completed} sections "
                f"and spent {round(total_seconds / 3600, 1)} hours learning. "
                "Keep up the great momentum!"
            ),
        }, indent=2),
    )]


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
