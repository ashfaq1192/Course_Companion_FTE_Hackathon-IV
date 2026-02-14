from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from . import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProgressRecord(Base):
    __tablename__ = "progress_records"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign key reference
    content_id = Column(Integer, ForeignKey("course_contents.id"), nullable=False)  # Foreign key reference
    status = Column(String(20), nullable=False)  # not_started, in_progress, completed
    completion_percentage = Column(Float, default=0.0)  # Between 0 and 100
    time_spent_seconds = Column(Integer, default=0)  # Time spent on content in seconds
    last_accessed_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)  # Time when content was completed

    # Relationships
    user = relationship("User", back_populates="progress_records")
    content = relationship("CourseContent", back_populates="progress_records")


class ProgressRecordSchema(BaseModel):
    id: int
    user_id: int
    content_id: int
    status: str  # not_started, in_progress, completed
    completion_percentage: float = 0.0  # Between 0 and 100
    time_spent_seconds: int = 0  # Time spent on content in seconds
    last_accessed_at: datetime
    completed_at: Optional[datetime] = None  # Time when content was completed
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True