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
    """Retrieve all content for a specific course, ordered by chapter and section"""
    content_service = ContentService(db)
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