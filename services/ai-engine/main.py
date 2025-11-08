"""
Ori AI Engine - Intelligent career matching and skill analysis service.

This service provides:
- Semantic job matching using embeddings
- Skill gap analysis and learning paths
- Personalized career recommendations
- CV analysis and profile enrichment
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List

from config import Config
from utils.logging import setup_logging
from models import (
    UserProfile,
    Job,
    MatchRequest,
    MatchResult,
    SkillAnalysisResult,
    SkillGapRequest,
    SkillGapResponse,
    LearningPath,
    HealthResponse,
    EmbeddingService,
)
from services import (
    MatchingService,
    SkillAnalyzer,
    RecommendationEngine,
)
from services.skill_analysis import calculate_skill_gap

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

# Service version
VERSION = "1.0.0"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown tasks.
    """
    # Startup
    logger.info("=" * 50)
    logger.info(f"Starting Ori AI Engine v{VERSION}")
    logger.info(f"Environment: {Config.ENVIRONMENT}")
    logger.info("=" * 50)

    # Pre-load embedding model for faster first request
    try:
        logger.info("Pre-loading embedding model...")
        embedding_service = EmbeddingService()
        test_embedding = embedding_service.embed_text("test")
        logger.info(f"✓ Embedding service ready (dimension: {len(test_embedding)})")
    except Exception as e:
        logger.error(f"✗ Failed to load embedding model: {e}")
        raise

    logger.info("AI Engine ready to serve requests")

    yield

    # Shutdown
    logger.info("Shutting down AI Engine")


# Initialize FastAPI app
app = FastAPI(
    title="Ori AI Engine",
    description="Intelligent career matching and skill analysis service",
    version=VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        Config.FRONTEND_URL,
        Config.CORE_API_URL,
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
matching_service = MatchingService()
skill_analyzer = SkillAnalyzer()
recommendation_engine = RecommendationEngine()
embedding_service = EmbeddingService()


# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unexpected errors."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred" if Config.is_production() else str(exc)
        }
    )


# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    """
    model_loaded = embedding_service.is_ready()

    return HealthResponse(
        status="healthy" if model_loaded else "degraded",
        service="ai-engine",
        version=VERSION,
        model_loaded=model_loaded,
        checks={
            "embedding_model": model_loaded,
            "matching_service": True,
            "skill_analyzer": True,
        }
    )


@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "service": "Ori AI Engine",
        "version": VERSION,
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }


# ============================================================================
# Core AI Endpoints
# ============================================================================

@app.post("/api/v1/match", response_model=List[MatchResult])
async def generate_matches(request: MatchRequest):
    """
    Generate intelligent job matches for a user profile.

    This endpoint uses semantic embeddings combined with structured data
    to produce multi-factor match scores with human-readable reasoning.

    **Algorithm:**
    - Semantic similarity (40%): Deep profile-job alignment
    - Skill match (30%): Explicit skill overlap
    - Experience alignment (15%): Career level fit
    - Location/work style (10%): Lifestyle preferences
    - Salary fit (5%): Compensation alignment
    """
    try:
        logger.info(f"Match request for user {request.profile.user_id}: {len(request.jobs)} jobs")

        if not request.jobs:
            return []

        matches = matching_service.match_profile_to_jobs(
            request.profile,
            request.jobs,
            limit=request.limit
        )

        logger.info(f"Generated {len(matches)} matches (avg score: {sum(m.match_score for m in matches) / len(matches):.1f})")

        return matches

    except Exception as e:
        logger.error(f"Match generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate matches: {str(e)}"
        )


@app.post("/api/v1/skill-gap", response_model=SkillGapResponse)
async def get_skill_gap(request: SkillGapRequest):
    """
    Calculate the skill gap between user skills and required skills.

    This is a simple endpoint that performs a set difference operation
    to identify which required skills the user does not currently possess.

    **Use this endpoint for:**
    - Quick skill gap checks
    - Simple missing skill identification
    - Backend API integration

    **Use /api/v1/analyze-skills for:**
    - Comprehensive skill analysis
    - Learning recommendations
    - Strategic career guidance
    """
    try:
        logger.info(f"Simple skill gap check: {len(request.user_skills)} vs {len(request.required_skills)} skills")

        result = calculate_skill_gap(request)

        logger.info(f"Skill gap result: {len(result.missing_skills)} missing skills")

        return result

    except Exception as e:
        logger.error(f"Skill gap calculation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate skill gap: {str(e)}"
        )


@app.post("/api/v1/analyze-skills", response_model=SkillAnalysisResult)
async def analyze_skills(profile: UserProfile, target_jobs: List[Job]):
    """
    Analyze skill gaps between user profile and target jobs.

    Returns comprehensive analysis including:
    - Identified skill gaps with importance levels
    - User's strengths
    - Overall readiness score
    - Strategic recommendations
    """
    try:
        logger.info(f"Skill analysis for user {profile.user_id} against {len(target_jobs)} jobs")

        if not target_jobs:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one target job is required for analysis"
            )

        analysis = skill_analyzer.analyze_skill_gaps(profile, target_jobs)

        logger.info(
            f"Analysis complete: {len(analysis.skill_gaps)} gaps identified, "
            f"{analysis.overall_readiness:.1f}% ready"
        )

        return analysis

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Skill analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze skills: {str(e)}"
        )


@app.post("/api/v1/learning-paths", response_model=List[LearningPath])
async def get_learning_paths(
    profile: UserProfile,
    target_jobs: List[Job],
    max_paths: int = 5
):
    """
    Generate personalized learning paths based on skill gaps.

    Returns prioritized learning paths with:
    - Curated resources
    - Learning milestones
    - Estimated duration
    - Priority ranking
    """
    try:
        logger.info(f"Generating learning paths for user {profile.user_id}")

        paths = recommendation_engine.recommend_learning_paths(
            profile,
            target_jobs,
            max_paths=max_paths
        )

        logger.info(f"Generated {len(paths)} learning paths")

        return paths

    except Exception as e:
        logger.error(f"Learning path generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate learning paths: {str(e)}"
        )


@app.post("/api/v1/recommend-roles")
async def recommend_roles(profile: UserProfile):
    """
    Suggest relevant roles based on user skills and experience.
    """
    try:
        logger.info(f"Generating role recommendations for user {profile.user_id}")

        roles = recommendation_engine.suggest_roles(profile)

        return {
            "user_id": profile.user_id,
            "suggested_roles": roles,
            "based_on": {
                "skills": len(profile.skills),
                "experience_level": profile.experience_level.value if profile.experience_level else None
            }
        }

    except Exception as e:
        logger.error(f"Role recommendation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to recommend roles: {str(e)}"
        )


@app.post("/api/v1/next-steps")
async def get_next_steps(profile: UserProfile, current_applications: int = 0):
    """
    Get personalized next career action recommendations.
    """
    try:
        logger.info(f"Generating next steps for user {profile.user_id}")

        steps = recommendation_engine.recommend_next_steps(
            profile,
            current_applications=current_applications
        )

        return {
            "user_id": profile.user_id,
            "recommendations": steps,
            "timestamp": "now"  # Could use datetime if needed
        }

    except Exception as e:
        logger.error(f"Next steps generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate next steps: {str(e)}"
        )


# ============================================================================
# Development & Testing Endpoints
# ============================================================================

@app.post("/api/v1/embed")
async def generate_embedding(text: str):
    """
    Generate embedding for arbitrary text (development/testing only).
    """
    if Config.is_production():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is not available in production"
        )

    try:
        embedding = embedding_service.embed_text(text)
        return {
            "text": text,
            "embedding_dimension": len(embedding),
            "embedding_sample": embedding[:5].tolist()  # First 5 dimensions as sample
        }
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=Config.PORT,
        reload=Config.ENVIRONMENT == "development",
        log_level=Config.LOG_LEVEL.lower()
    )
