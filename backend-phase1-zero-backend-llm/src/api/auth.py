from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from ..database.session import get_db
from ..schemas.user import UserCreate, UserResponse, LoginRequest
from ..schemas.token import Token
from ..services.auth_service import AuthService
from ..core.security import authenticate_user, create_access_token, get_current_user
from datetime import timedelta
from ..core.config import settings


router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: Any = Depends(get_current_user),
):
    """Get the current authenticated user's profile"""
    return current_user


@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    auth_service = AuthService(db)
    
    # Check if user already exists
    existing_user = auth_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Register the new user
    user = auth_service.register_user(user_data)
    return user


@router.post("/login", response_model=Token)
def login_user(user_credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}