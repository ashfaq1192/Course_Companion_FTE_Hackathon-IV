from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..core.security import get_current_user
from ..models.user import User


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get the current active user, raising an exception if the user is inactive"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def require_premium_access(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to check if user has premium access"""
    from ..services.subscription_service import SubscriptionService
    
    subscription_service = SubscriptionService(db)
    subscription_type = subscription_service.get_subscription_type(current_user.id)
    
    if subscription_type != "premium":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required for this action"
        )
    
    return current_user