from sqlalchemy import Column, String, Boolean, DateTime
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
    # Hybrid Intelligence relationships
    adaptive_learning_paths = relationship("AdaptiveLearningPath", back_populates="user", cascade="all, delete-orphan")
    llm_grade_assessments = relationship("LLMGradeAssessment", back_populates="user", cascade="all, delete-orphan")
    hybrid_feature_usage = relationship("HybridFeatureUsage", back_populates="user", cascade="all, delete-orphan")
    cost_metrics = relationship("CostMetric", back_populates="user", cascade="all, delete-orphan")


class UserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True