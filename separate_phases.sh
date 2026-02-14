#!/bin/bash

# Script to separate Hackathon IV phases into distinct working directories
# This creates separate, functional directories for each phase

set -e  # Exit on any error

PROJECT_ROOT="/mnt/d/projects/hackathon-iv"
BACKEND_COMPLETE="$PROJECT_ROOT/backend"
PHASE1_DIR="$PROJECT_ROOT/phase1-zero-backend-llm"
PHASE2_DIR="$PROJECT_ROOT/phase2-hybrid-intelligence"
PHASE3_DIR="$PROJECT_ROOT/phase3-web-app"

echo "Creating Phase 1: Zero-Backend-LLM directory..."

# Create Phase 1 directory and copy backend
rm -rf "$PHASE1_DIR"
cp -r "$BACKEND_COMPLETE" "$PHASE1_DIR"

# Remove Phase 2 specific files from Phase 1
rm -f "$PHASE1_DIR/src/core/llm_client.py"
rm -f "$PHASE1_DIR/src/services/hybrid_intelligence_service.py"
rm -f "$PHASE1_DIR/src/api/hybrid_intelligence.py"

# Update requirements.txt to remove LLM dependencies for Phase 1
sed -i '/openai/d' "$PHASE1_DIR/requirements.txt"

# Update config to remove LLM settings (keeping only Phase 1 settings)
PHASE1_CONFIG='from pydantic_settings import BaseSettings
from typing import Optional
import os
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # API Configuration
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "Course Companion FTE Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./course_companion.db")

    # Cloud Storage (Cloudflare R2)
    CLOUDFLARE_ACCOUNT_ID: Optional[str] = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    CLOUDFLARE_ACCESS_KEY_ID: Optional[str] = os.getenv("CLOUDFLARE_ACCESS_KEY_ID")
    CLOUDFLARE_SECRET_ACCESS_KEY: Optional[str] = os.getenv("CLOUDFLARE_SECRET_ACCESS_KEY")
    CLOUDFLARE_R2_BUCKET: Optional[str] = os.getenv("CLOUDFLARE_R2_BUCKET")

    # CORS
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost,http://localhost:3000,http://localhost:8080")

    # Performance
    CONTENT_API_TIMEOUT_MS: int = 200
    PROGRESS_API_TIMEOUT_MS: int = 500

    # Server Configuration
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    """
    Cached function to get settings instance.
    Using lru_cache ensures that settings are only loaded once per application lifecycle.
    """
    return Settings()


# Create a global settings instance
settings = get_settings()'

echo "$PHASE1_CONFIG" > "$PHASE1_DIR/src/core/config.py"

# Update main.py to remove hybrid intelligence router
PHASE1_MAIN='from fastapi import FastAPI
from src.api.auth import router as auth_router
from src.api.content import router as content_router
from src.api.progress import router as progress_router
from src.api.quiz import router as quiz_router
from src.api.subscriptions import router as subscriptions_router
from src.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Include API routers
    app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Authentication"])
    app.include_router(content_router, prefix=settings.API_V1_STR, tags=["Content"])
    app.include_router(progress_router, prefix=settings.API_V1_STR, tags=["Progress"])
    app.include_router(quiz_router, prefix=settings.API_V1_STR, tags=["Quiz"])
    app.include_router(subscriptions_router, prefix=settings.API_V1_STR, tags=["Subscriptions"])

    @app.get("/")
    def read_root():
        return {"message": "Course Companion FTE Backend API"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG
    )'

echo "$PHASE1_MAIN" > "$PHASE1_DIR/src/main.py"

# Remove hybrid intelligence models
rm -f "$PHASE1_DIR/src/models/hybrid_intelligence.py"

# Update models/__init__.py to remove hybrid intelligence imports
PHASE1_MODELS_INIT='from sqlalchemy import Integer
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column, DateTime, func


@as_declarative()
class Base:
    __allow_unmapped__ = True  # Allow unmapped attributes for datetime columns

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Import all models to ensure they are registered with SQLAlchemy
from .user import User  # noqa: F401
from .course_content import CourseContent  # noqa: F401
from .progress import ProgressRecord  # noqa: F401
from .quiz import QuizQuestion, QuizAttempt  # noqa: F401
from .subscription import Subscription  # noqa: F401
'

echo "$PHASE1_MODELS_INIT" > "$PHASE1_DIR/src/models/__init__.py"

# Update user model to remove hybrid intelligence relationships
PHASE1_USER_MODEL='from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base
from sqlalchemy import Integer
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    progress_records = relationship("ProgressRecord", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True'

echo "$PHASE1_USER_MODEL" > "$PHASE1_DIR/src/models/user.py"

# Update quiz model to remove hybrid intelligence relationships
PHASE1_QUIZ_MODEL='from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from . import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    content_id = Column(Integer, ForeignKey("course_contents.id"), nullable=False)  # Foreign key reference
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False)  # multiple_choice, true_false, short_answer
    options = Column(Text, nullable=True)  # JSON string of options for multiple choice
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)  # Explanation of the correct answer
    difficulty_level = Column(String(20), default="medium")  # easy, medium, hard

    # Relationships
    content = relationship("CourseContent", back_populates="quiz_questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    __allow_unmapped__ = True  # Allow unmapped attributes for this class

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign key reference
    content_id = Column(Integer, ForeignKey("course_contents.id"), nullable=False)  # Foreign key reference
    score = Column(Float, nullable=False)  # Score achieved on the quiz (0-100)
    total_questions = Column(Integer, nullable=False)  # Total number of questions in the quiz
    correct_answers = Column(Integer, nullable=False)  # Number of correct answers
    attempt_date = Column(DateTime(timezone=True), nullable=False)  # Date and time of the attempt
    time_taken_seconds = Column(Integer, nullable=False)  # Time taken to complete the quiz
    answers = Column(Text, nullable=False)  # JSON string of user's answers

    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    content = relationship("CourseContent", back_populates="quiz_attempts")


class QuizQuestionSchema(BaseModel):
    id: int
    content_id: int
    question_text: str
    question_type: str  # multiple_choice, true_false, short_answer
    options: Optional[str] = None  # JSON string of options for multiple choice
    correct_answer: str
    explanation: Optional[str] = None  # Explanation of the correct answer
    difficulty_level: str = "medium"  # easy, medium, hard
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuizAttemptSchema(BaseModel):
    id: int
    user_id: int
    content_id: int
    score: float  # Score achieved on the quiz (0-100)
    total_questions: int  # Total number of questions in the quiz
    correct_answers: int  # Number of correct answers
    attempt_date: datetime  # Date and time of the attempt
    time_taken_seconds: int  # Time taken to complete the quiz
    answers: str  # JSON string of user's answers
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True'

echo "$PHASE1_QUIZ_MODEL" > "$PHASE1_DIR/src/models/quiz.py"

# Update course content model to remove hybrid intelligence relationships
PHASE1_CONTENT_MODEL='from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from . import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CourseContent(Base):
    __tablename__ = "course_contents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content_type = Column(String(50), nullable=False)  # text, video, quiz, exercise
    content_data = Column(Text, nullable=False)  # Markdown/JSON content
    course_id = Column(String(100), nullable=False)  # Identifier for the parent course
    chapter_number = Column(Integer, nullable=False)  # Sequential number in the course
    section_number = Column(Integer, nullable=True)  # Section number within the chapter
    is_available = Column(Boolean, default=True, nullable=False)  # Whether content is available to users
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    progress_records = relationship("ProgressRecord", back_populates="content")
    quiz_questions = relationship("QuizQuestion", back_populates="content", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="content")


class CourseContentSchema(BaseModel):
    id: int
    title: str
    content_type: str  # text, video, quiz, exercise
    content_data: str  # Markdown/JSON content
    course_id: str  # Identifier for the parent course
    chapter_number: int  # Sequential number in the course
    section_number: Optional[int] = None  # Section number within the chapter
    is_available: bool = True  # Whether content is available to users
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True'

echo "$PHASE1_CONTENT_MODEL" > "$PHASE1_DIR/src/models/course_content.py"

# Update the quiz service to remove LLM enhancement method
PHASE1_QUIZ_SERVICE='from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.quiz import QuizQuestion, QuizAttempt
from ..models.course_content import CourseContent


class QuizService:
    def __init__(self, db: Session):
        self.db = db

    def get_questions_by_content_id(self, content_id: int) -> List[QuizQuestion]:
        """Get all quiz questions for a specific content"""
        return (
            self.db.query(QuizQuestion)
            .filter(QuizQuestion.content_id == content_id)
            .all()
        )

    def create_quiz_attempt(self, user_id: int, content_id: int) -> QuizAttempt:
        """Initialize a quiz attempt for the user"""
        quiz_attempt = QuizAttempt(
            user_id=user_id,
            content_id=content_id,
            score=0.0,
            total_questions=0,
            correct_answers=0,
            attempt_date=datetime.utcnow(),
            time_taken_seconds=0,
            answers="{}"  # Empty JSON string initially
        )
        self.db.add(quiz_attempt)
        self.db.commit()
        self.db.refresh(quiz_attempt)
        return quiz_attempt

    def submit_quiz_answers(self, user_id: int, content_id: int, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Submit answers for a quiz and return grading results"""
        # Get the quiz questions
        questions = self.get_questions_by_content_id(content_id)

        if not questions:
            raise ValueError("No questions found for this quiz")

        # Create quiz attempt
        quiz_attempt = self.create_quiz_attempt(user_id, content_id)

        # Grade the quiz
        correct_answers = 0
        total_questions = len(questions)

        # Create a mapping of question_id to question for quick lookup
        question_map = {q.id: q for q in questions}

        results = []
        for answer in answers:
            question_id = answer.get('question_id')
            user_answer = answer.get('answer')

            if question_id not in question_map:
                continue  # Skip invalid question IDs

            question = question_map[question_id]

            # Check if the answer is correct
            is_correct = self._check_answer(question, user_answer)
            if is_correct:
                correct_answers += 1

            results.append({
                'question_id': question_id,
                'user_answer': user_answer,
                'is_correct': is_correct,
                'explanation': question.explanation
            })

        # Calculate score
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        # Update the quiz attempt with results
        quiz_attempt.total_questions = total_questions
        quiz_attempt.correct_answers = correct_answers
        quiz_attempt.score = score
        quiz_attempt.answers = str(answers)  # Store as string representation

        self.db.commit()
        self.db.refresh(quiz_attempt)

        return {
            'attempt': quiz_attempt,
            'questions': questions,
            'results': results,
            'score': score,
            'total_questions': total_questions,
            'correct_answers': correct_answers
        }

    def _check_answer(self, question: QuizQuestion, user_answer: str) -> bool:
        """Check if the user's answer is correct based on the question type"""
        if question.question_type == 'multiple_choice':
            # For multiple choice, compare the user's answer with the correct answer
            return user_answer.strip().lower() == question.correct_answer.strip().lower()
        elif question.question_type == 'true_false':
            # For true/false, normalize the answer and compare
            normalized_user = user_answer.strip().lower()
            normalized_correct = question.correct_answer.strip().lower()
            return normalized_user == normalized_correct
        elif question.question_type == 'short_answer':
            # For short answer, we might want to implement more sophisticated comparison
            # For now, doing a simple case-insensitive comparison
            return user_answer.strip().lower() == question.correct_answer.strip().lower()
        else:
            # Default to exact string comparison
            return user_answer == question.correct_answer

    def get_quiz_attempt(self, attempt_id: int) -> Optional[QuizAttempt]:
        """Get details of a specific quiz attempt"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id).first()

    def get_quiz_attempts_by_user(self, user_id: int) -> List[QuizAttempt]:
        """Get all quiz attempts for a user"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()'

echo "$PHASE1_QUIZ_SERVICE" > "$PHASE1_DIR/src/services/quiz_service.py"

echo "Phase 1 directory created successfully!"

echo "Creating Phase 2: Hybrid Intelligence directory..."

# Create Phase 2 directory from the complete backend
rm -rf "$PHASE2_DIR"
cp -r "$BACKEND_COMPLETE" "$PHASE2_DIR"

echo "Phase 2 directory created successfully!"

echo "Creating Phase 3: Web App directory (placeholder)..."

# Create Phase 3 directory as a placeholder
rm -rf "$PHASE3_DIR"
mkdir -p "$PHASE3_DIR"
echo "# Phase 3: Web App" > "$PHASE3_DIR/README.md"
echo "Placeholder for the standalone Web App implementation" >> "$PHASE3_DIR/README.md"

echo "Phase 3 directory created successfully!"

echo ""
echo "Phase separation completed!"
echo ""
echo "Phase 1: Zero-Backend-LLM (in $PHASE1_DIR)"
echo "  - Contains deterministic backend without LLM calls"
echo "  - Ready for ChatGPT App integration"
echo "  - Includes content, progress, quiz, auth, and subscription APIs"
echo ""
echo "Phase 2: Hybrid Intelligence (in $PHASE2_DIR)" 
echo "  - Extends Phase 1 with LLM-powered features"
echo "  - Includes adaptive learning paths and LLM-graded assessments"
echo "  - Premium feature access control and cost tracking"
echo ""
echo "Phase 3: Web App (in $PHASE3_DIR)"
echo "  - Placeholder for standalone Web App implementation"
echo ""
echo "Each phase directory contains a complete, functional backend implementation."
echo "Teachers can test each phase independently."