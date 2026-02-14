from typing import Optional
from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import get_password_hash, verify_password


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by their email address"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Retrieve a user by their ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, email: str, password: str, full_name: str) -> User:
        """Create a new user with hashed password"""
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password"""
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def update_user_subscription(self, user_id: str, subscription_type: str) -> User:
        """Update a user's subscription type"""
        user = self.get_user_by_id(user_id)
        if user:
            user.subscription_type = subscription_type
            self.db.commit()
            self.db.refresh(user)
        return user

    def is_premium_user(self, user_id: str) -> bool:
        """Check if a user has premium subscription"""
        user = self.get_user_by_id(user_id)
        if user:
            return user.subscription_type in ['premium', 'admin']
        return False