from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
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
    # Hybrid Intelligence relationships
    adaptive_learning_paths = relationship("AdaptiveLearningPath", back_populates="adaptive_learning_path")


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
        from_attributes = True