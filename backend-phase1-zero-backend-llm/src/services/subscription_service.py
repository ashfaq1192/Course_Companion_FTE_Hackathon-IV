from typing import Optional
from sqlalchemy.orm import Session
from datetime import date
from ..models.subscription import Subscription
from ..models.user import User


class SubscriptionService:
    def __init__(self, db: Session):
        self.db = db

    def get_subscription_by_user_id(self, user_id: int) -> Optional[Subscription]:
        """Get subscription information for a specific user"""
        return (
            self.db.query(Subscription)
            .filter(Subscription.user_id == user_id)
            .first()
        )

    def get_current_subscription(self, user_id: int) -> Optional[Subscription]:
        """Get the current active subscription for a user"""
        return (
            self.db.query(Subscription)
            .filter(Subscription.user_id == user_id)
            .filter(Subscription.is_active == True)
            .first()
        )

    def create_subscription(self, user_id: int, subscription_type: str, 
                          start_date: date, end_date: Optional[date] = None,
                          payment_status: str = "pending") -> Subscription:
        """Create a new subscription for a user"""
        # Check if user already has an active subscription
        existing_sub = self.get_current_subscription(user_id)
        if existing_sub:
            # Deactivate the existing subscription
            existing_sub.is_active = False
            self.db.commit()
        
        # Create new subscription
        subscription = Subscription(
            user_id=user_id,
            subscription_type=subscription_type,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            payment_status=payment_status
        )
        
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription

    def update_subscription_status(self, user_id: int, is_active: bool) -> bool:
        """Update the active status of a user's subscription"""
        subscription = self.get_current_subscription(user_id)
        if not subscription:
            return False
        
        subscription.is_active = is_active
        self.db.commit()
        
        return True

    def check_access_permission(self, user_id: int, required_subscription_type: str = "premium") -> bool:
        """Check if a user has the required subscription level for access"""
        subscription = self.get_current_subscription(user_id)
        
        if not subscription:
            # User has no subscription, only allow access to free content
            return required_subscription_type.lower() == "free"
        
        # If the required subscription is free, all users have access
        if required_subscription_type.lower() == "free":
            return True
        
        # Check if user has the required subscription type or higher
        return subscription.subscription_type.lower() in [required_subscription_type.lower(), "premium"]

    def get_subscription_type(self, user_id: int) -> Optional[str]:
        """Get the subscription type for a user"""
        subscription = self.get_current_subscription(user_id)
        if subscription:
            return subscription.subscription_type
        return None