from pydantic_settings import BaseSettings
from typing import Optional
import os
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # API Configuration
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "Course Companion FTE Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./course_companion.db")

    # Cloud Storage (Cloudflare R2)
    CLOUDFLARE_ACCOUNT_ID: Optional[str] = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    CLOUDFLARE_ACCESS_KEY_ID: Optional[str] = os.getenv("CLOUDFLARE_ACCESS_KEY_ID")
    CLOUDFLARE_SECRET_ACCESS_KEY: Optional[str] = os.getenv("CLOUDFLARE_SECRET_ACCESS_KEY")
    CLOUDFLARE_R2_BUCKET: Optional[str] = os.getenv("CLOUDFLARE_R2_BUCKET")

    # CORS
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost,http://localhost:3000,http://localhost:3001,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080")

    # Performance
    CONTENT_API_TIMEOUT_MS: int = 200
    PROGRESS_API_TIMEOUT_MS: int = 500

    # Server Configuration
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    """
    Cached function to get settings instance.
    Using lru_cache ensures that settings are only loaded once per application lifecycle.
    """
    return Settings()


# Create a global settings instance
settings = get_settings()