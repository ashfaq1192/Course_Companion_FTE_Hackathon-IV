from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from ..database.session import get_db
from ..models.quiz import QuizAttempt, QuizAttemptSchema, QuizQuestion
from ..services.quiz_service import QuizService
from ..api.deps import get_current_active_user
from ..models.user import User


router = APIRouter()


@router.post("/quiz/{content_id}/start")
def start_quiz(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Initialize a quiz attempt and return the questions"""
    quiz_service = QuizService(db)
    quiz_attempt = quiz_service.create_quiz_attempt(current_user.id, content_id)
    questions = quiz_service.get_questions_by_content_id(content_id)

    return {
        "attempt_id": quiz_attempt.id,
        "questions": [
            {
                "id": q.id,
                "content_id": q.content_id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "options": q.options,
                "difficulty_level": q.difficulty_level,
            }
            for q in questions
        ],
    }


class AnswerItem(BaseModel):
    question_id: int
    selected_answer: str


class SubmitRequest(BaseModel):
    answers: List[AnswerItem]


@router.post("/quiz/{content_id}/submit")
def submit_quiz(
    content_id: int,
    body: SubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Submit answers for a quiz and receive grading"""
    quiz_service = QuizService(db)

    # Convert to the format the service expects
    answers = [
        {"question_id": a.question_id, "answer": a.selected_answer}
        for a in body.answers
    ]

    try:
        result = quiz_service.submit_quiz_answers(current_user.id, content_id, answers)
        return {
            "score": result["correct_answers"],
            "total": result["total_questions"],
            "percentage": result["score"],
            "results": result["results"],
        }
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