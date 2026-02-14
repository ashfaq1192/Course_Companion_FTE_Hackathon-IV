from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..models.course_content import CourseContent, CourseContentSchema
from ..services.content_service import ContentService
from ..api.deps import get_current_active_user, require_premium_access
from ..models.user import User


router = APIRouter()


@router.get("/content/{content_id}", response_model=CourseContentSchema)
def get_content(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve specific course content by its ID"""
    content_service = ContentService(db)
    content = content_service.get_content_by_id(content_id)

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # Check if content is available
    if not content.is_available:
        raise HTTPException(status_code=404, detail="Content not available")

    return content


@router.get("/content/by-course/{course_id}", response_model=List[CourseContentSchema])
def get_content_by_course(
    course_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100, ge=1),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve all content for a specific course, ordered by chapter and section.
    Use course_id='all' to retrieve content across all courses."""
    content_service = ContentService(db)
    if course_id == "all":
        contents = db.query(CourseContent).filter(
            CourseContent.is_available == True
        ).order_by(CourseContent.course_id, CourseContent.chapter_number).offset(skip).limit(limit).all()
        return contents
    contents = content_service.get_content_by_course(course_id, skip=skip, limit=limit)
    return contents


@router.get("/content/search", response_model=List[CourseContentSchema])
def search_content(
    q: str = Query(..., min_length=1),
    course_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50, ge=1),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Search course content by keywords"""
    content_service = ContentService(db)
    results = content_service.search_content(q, course_id=course_id, skip=skip, limit=limit)
    return results


@router.get("/content/{content_id}/next", response_model=CourseContentSchema)
def get_next_content(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get the next content in the course sequence.
    This enables ChatGPT to suggest optimal learning paths.
    """
    content_service = ContentService(db)
    current_content = content_service.get_content_by_id(content_id)

    if not current_content:
        raise HTTPException(status_code=404, detail="Current content not found")

    next_content = content_service.get_next_content(current_content)

    if not next_content:
        raise HTTPException(status_code=404, detail="No next content available")

    return next_content


@router.get("/content/{content_id}/prev", response_model=CourseContentSchema)
def get_prev_content(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get the previous content in the course sequence.
    This enables navigation backwards through the course.
    """
    content_service = ContentService(db)
    current_content = content_service.get_content_by_id(content_id)

    if not current_content:
        raise HTTPException(status_code=404, detail="Current content not found")

    prev_content = content_service.get_prev_content(current_content)

    if not prev_content:
        raise HTTPException(status_code=404, detail="No previous content available")

    return prev_content


@router.post("/content/grounded-qna", response_model=List[CourseContentSchema])
def grounded_qna(
    query: str = Query(..., min_length=1, description="Question to find relevant content for"),
    course_id: str = Query(None),
    max_results: int = Query(5, ge=1, le=10, description="Maximum number of content sections to return"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Grounded Q&A endpoint - finds relevant content sections based on the query.
    This returns content sections that ChatGPT can use to answer the question,
    ensuring ChatGPT only uses provided content to answer.
    """
    content_service = ContentService(db)
    results = content_service.search_content(query, course_id=course_id, skip=0, limit=max_results)
    return results