"""
Pydantic models for AI Engine API.
Aligned with TypeScript types in shared/types.
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from enum import Enum


class ExperienceLevel(str, Enum):
    """Experience level enumeration."""
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    EXECUTIVE = "executive"


class WorkType(str, Enum):
    """Work type enumeration."""
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"
    FLEXIBLE = "flexible"


# Request/Response Models
class UserProfile(BaseModel):
    """User profile for matching and analysis."""
    user_id: str
    skills: List[str] = Field(default_factory=list, description="User's skills")
    experience_level: Optional[ExperienceLevel] = None
    years_of_experience: Optional[int] = None
    roles: List[str] = Field(default_factory=list, description="Desired roles")
    work_style: Optional[WorkType] = WorkType.REMOTE
    industries: List[str] = Field(default_factory=list)
    location: Optional[str] = None
    willing_to_relocate: bool = False
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    goal: Optional[str] = None
    cv_text: Optional[str] = Field(None, description="Full CV text for deep analysis")


class Job(BaseModel):
    """Job posting for matching."""
    job_id: str
    title: str
    company: str
    description: str
    requirements: List[str] = Field(default_factory=list)
    location: Optional[str] = "Remote"
    work_type: Optional[WorkType] = WorkType.REMOTE
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    posted_date: Optional[str] = None


class MatchRequest(BaseModel):
    """Request for job matching."""
    profile: UserProfile
    jobs: List[Job]
    limit: int = Field(default=10, ge=1, le=100, description="Max matches to return")


class MatchResult(BaseModel):
    """Job match result with scoring and reasoning."""
    job_id: str
    match_score: float = Field(..., ge=0, le=100, description="Overall match score 0-100")
    semantic_score: float = Field(..., ge=0, le=100, description="Semantic similarity score")
    skill_match_score: float = Field(..., ge=0, le=100, description="Skill overlap score")
    experience_score: float = Field(..., ge=0, le=100, description="Experience alignment score")
    location_score: float = Field(..., ge=0, le=100, description="Location preference score")
    reasoning: str = Field(..., description="Human-readable match explanation")
    key_matches: List[str] = Field(default_factory=list, description="Key matching factors")
    missing_skills: List[str] = Field(default_factory=list, description="Skills gap")


class SkillGap(BaseModel):
    """Individual skill gap with learning recommendations."""
    skill: str
    importance: Literal["critical", "important", "nice-to-have"]
    current_level: Optional[int] = Field(None, ge=0, le=10, description="Current skill level 0-10")
    target_level: int = Field(..., ge=0, le=10, description="Required skill level 0-10")
    learning_resources: List[str] = Field(default_factory=list)
    estimated_learning_time: Optional[str] = None  # e.g., "2-3 months"


class SkillAnalysisResult(BaseModel):
    """Comprehensive skill gap analysis."""
    user_id: str
    target_role: Optional[str] = None
    current_skills: List[str]
    skill_gaps: List[SkillGap]
    strengths: List[str] = Field(default_factory=list, description="User's strong skills")
    recommendations: List[str] = Field(default_factory=list, description="Strategic recommendations")
    overall_readiness: float = Field(..., ge=0, le=100, description="Overall readiness score")


class LearningPath(BaseModel):
    """Personalized learning path recommendation."""
    skill: str
    priority: int = Field(..., ge=1, le=5, description="Learning priority (1=highest)")
    resources: List[Dict[str, str]] = Field(
        default_factory=list,
        description="Learning resources with title and url"
    )
    milestones: List[str] = Field(default_factory=list)
    estimated_duration: str  # e.g., "3 months"


class CVAnalysisResult(BaseModel):
    """CV analysis result."""
    skills: List[str]
    experience_level: ExperienceLevel
    years_of_experience: int
    industries: List[str]
    summary: str
    suggested_roles: List[str]


class HealthResponse(BaseModel):
    """Health check response."""
    status: Literal["healthy", "degraded", "unhealthy"]
    service: str
    version: str
    model_loaded: bool
    checks: Dict[str, bool] = Field(default_factory=dict)


class SkillGapRequest(BaseModel):
    """Simple skill gap analysis request."""
    user_skills: List[str] = Field(..., description="Skills the user currently has")
    required_skills: List[str] = Field(..., description="Skills required for the target role/job")


class SkillGapResponse(BaseModel):
    """Simple skill gap analysis response."""
    user_skills: List[str] = Field(..., description="Skills the user has")
    required_skills: List[str] = Field(..., description="Skills required")
    missing_skills: List[str] = Field(..., description="Skills the user needs to acquire")
