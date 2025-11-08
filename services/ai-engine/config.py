"""
Configuration management for AI Engine.
Validates environment variables at startup with helpful error messages.
"""
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration with validation."""

    # Server
    PORT: int = int(os.getenv("PORT", "3002"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # API Keys (optional for basic matching)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")

    # Model Configuration
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "384"))
    MAX_SEQUENCE_LENGTH: int = int(os.getenv("MAX_SEQUENCE_LENGTH", "256"))

    # Service URLs
    CORE_API_URL: str = os.getenv("CORE_API_URL", "http://localhost:3001")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Performance
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "32"))
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "3600"))
    MAX_WORKERS: int = int(os.getenv("MAX_WORKERS", "4"))

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "json")

    @classmethod
    def validate(cls) -> None:
        """Validate configuration at startup."""
        errors = []

        # No strict requirements for MVP - all have defaults
        # Future: Add validation for production deployment

        if errors:
            raise ValueError(
                f"Configuration validation failed:\n" + "\n".join(f"  - {e}" for e in errors)
            )

    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production."""
        return cls.ENVIRONMENT.lower() == "production"

# Validate on import
Config.validate()
