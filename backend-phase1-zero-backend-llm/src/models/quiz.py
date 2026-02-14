from sqlalchemy import Column, Integer, String, Text, DateTime, Float
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
        from_attributes = True