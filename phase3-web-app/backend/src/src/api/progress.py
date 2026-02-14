from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..models.progress import ProgressRecord, ProgressRecordSchema
from ..services.progress_service import ProgressService
from ..api.deps import get_current_active_user
from ..models.user import User


router = APIRouter()


@router.get("/progress/{content_id}", response_model=ProgressRecordSchema)
def get_progress(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user progress for specific content"""
    progress_service = ProgressService(db)
    progress = progress_service.get_progress_by_user_and_content(current_user.id, content_id)

    if not progress:
        raise HTTPException(status_code=404, detail="Progress record not found")

    return progress


@router.put("/progress/{content_id}", response_model=ProgressRecordSchema)
def update_progress(
    content_id: int,
    status: str = Query(..., pattern="^(not_started|in_progress|completed)$"),
    completion_percentage: float = Query(0, ge=0, le=100),
    time_spent_seconds: int = Query(0, ge=0),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user progress for specific content"""
    progress_service = ProgressService(db)
    progress = progress_service.create_or_update_progress(
        current_user.id,
        content_id,
        status,
        completion_percentage,
        time_spent_seconds
    )
    return progress


@router.get("/progress/user/{user_id}", response_model=List[ProgressRecordSchema])
def get_all_progress(
    user_id: int,
    course_id: str = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all progress records for a specific user"""
    # Allow users to only access their own progress records
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's progress")

    progress_service = ProgressService(db)
    progress_list = progress_service.get_all_progress_for_user(user_id, course_id=course_id)
    return progress_list