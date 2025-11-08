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
]
