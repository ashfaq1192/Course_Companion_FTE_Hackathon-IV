from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.subscription import Subscription, SubscriptionSchema
from ..services.subscription_service import SubscriptionService
from ..api.deps import get_current_active_user
from ..models.user import User


router = APIRouter()


@router.get("/subscriptions/current", response_model=SubscriptionSchema)
def get_current_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription information"""
    subscription_service = SubscriptionService(db)
    subscription = subscription_service.get_current_subscription(current_user.id)

    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")

    return subscription