"""
AI Engine data models and schemas.
"""
from .schemas import (
    UserProfile,
    Job,
    MatchRequest,
    MatchResult,
    SkillGap,
    SkillAnalysisResult,
    SkillGapRequest,
    SkillGapResponse,
    LearningPath,
    HealthResponse,
    AIRequest,
    AIResponse,
)
from .embeddings import EmbeddingService

__all__ = [
    "UserProfile",
    "Job",
    "MatchRequest",
    "MatchResult",
    "SkillGap",
    "SkillAnalysisResult",
    "SkillGapRequest",
    "SkillGapResponse",
    "LearningPath",
    "HealthResponse",
    "EmbeddingService",
    "AIRequest",
    "AIResponse",
]
