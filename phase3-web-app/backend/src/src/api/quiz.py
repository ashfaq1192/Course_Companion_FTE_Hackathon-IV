from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database.session import get_db
from ..models.quiz import QuizAttempt, QuizAttemptSchema
from ..services.quiz_service import QuizService
from ..api.deps import get_current_active_user
from ..models.user import User


router = APIRouter()


@router.post("/quiz/{content_id}/start", response_model=QuizAttemptSchema)
def start_quiz(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Initialize a quiz attempt for the user"""
    quiz_service = QuizService(db)
    quiz_attempt = quiz_service.create_quiz_attempt(current_user.id, content_id)
    return quiz_attempt


@router.post("/quiz/{content_id}/submit", response_model=Dict[str, Any])
def submit_quiz(
    content_id: int,
    answers: List[Dict[str, str]],  # List of {question_id: str, answer: str}
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Submit answers for a quiz and receive grading"""
    quiz_service = QuizService(db)

    try:
        result = quiz_service.submit_quiz_answers(current_user.id, content_id, answers)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/quiz/attempts/{attempt_id}", response_model=Dict[str, Any])
def get_quiz_attempt(
    attempt_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific quiz attempt"""
    quiz_service = QuizService(db)
    attempt = quiz_service.get_quiz_attempt(attempt_id)

    if not attempt:
        raise HTTPException(status_code=404, detail="Quiz attempt not found")

    # Ensure user can only access their own attempts
    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this quiz attempt")

    # For simplicity, we'll return just the attempt object
    # In a real implementation, you might want to return more detailed information
    return {"attempt": attempt}