from typing import Optional
from sqlalchemy.orm import Session
from datetime import timedelta
from ..models.user import User
from ..core.security import authenticate_user, create_access_token, get_password_hash
from ..schemas.user import UserCreate


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user"""
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create the user
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user

    def login_user(self, email: str, password: str) -> Optional[str]:
        """Login a user and return access token"""
        user = authenticate_user(self.db, email, password)
        if not user:
            return None
        
        # Create access token
        access_token_expires = timedelta(minutes=30)  # Use value from settings
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        
        return access_token

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()