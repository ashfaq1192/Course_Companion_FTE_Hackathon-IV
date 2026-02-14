from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from . import Base
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # Foreign key reference
    subscription_type = Column(String(50), nullable=False)  # free, premium
    start_date = Column(Date, nullable=False)  # Start date of the subscription
    end_date = Column(Date, nullable=True)  # End date of the subscription (null for ongoing)
    is_active = Column(Boolean, default=True, nullable=False)  # Whether the subscription is currently active
    payment_status = Column(String(20), default="pending")  # pending, paid, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscription")


class SubscriptionSchema(BaseModel):
    id: int
    user_id: int
    subscription_type: str  # free, premium
    start_date: date  # Start date of the subscription
    end_date: Optional[date] = None  # End date of the subscription (None for ongoing)
    is_active: bool = True  # Whether the subscription is currently active
    payment_status: str = "pending"  # pending, paid, failed
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True