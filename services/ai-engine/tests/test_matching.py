"""
Integration tests for matching service.
"""
import pytest
from models.schemas import UserProfile, Job, ExperienceLevel, WorkType
from services.matching import MatchingService


@pytest.fixture
def matching_service():
    """Create matching service instance."""
    return MatchingService()


@pytest.fixture
def sample_profile():
    """Create sample user profile."""
    return UserProfile(
        user_id="test-user-1",
        skills=["Python", "FastAPI", "PostgreSQL", "React"],
        experience_level=ExperienceLevel.MID,
        years_of_experience=5,
        roles=["Backend Engineer", "Full Stack Developer"],
        work_style=WorkType.REMOTE,
        industries=["Technology", "SaaS"],
        salary_min=80000,
        salary_max=120000,
        goal="Build scalable backend systems for innovative products"
    )


@pytest.fixture
def sample_jobs():
    """Create sample job postings."""
    return [
        Job(
            job_id="job-1",
            title="Senior Backend Engineer",
            company="Tech Corp",
            description="We're looking for an experienced backend engineer to build scalable APIs using Python and FastAPI.",
            requirements=["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
            location="Remote",
            work_type=WorkType.REMOTE,
            salary_min=100000,
            salary_max=140000,
            tags=["backend", "python", "remote"]
        ),
        Job(
            job_id="job-2",
            title="Full Stack Developer",
            company="Startup Inc",
            description="Join our team to build both frontend and backend features using React and Node.js.",
            requirements=["React", "Node.js", "TypeScript", "MongoDB"],
            location="San Francisco",
            work_type=WorkType.HYBRID,
            salary_min=90000,
            salary_max=130000,
            tags=["fullstack", "react", "nodejs"]
        ),
        Job(
            job_id="job-3",
            title="Junior Frontend Developer",
            company="Design Studio",
            description="Entry-level position for frontend development with React.",
            requirements=["React", "JavaScript", "CSS", "HTML"],
            location="New York",
            work_type=WorkType.ONSITE,
            salary_min=60000,
            salary_max=80000,
            tags=["frontend", "entry-level"]
        )
    ]


def test_matching_basic(matching_service, sample_profile, sample_jobs):
    """Test basic matching functionality."""
    matches = matching_service.match_profile_to_jobs(
        sample_profile,
        sample_jobs,
        limit=10
    )

    # Should return matches
    assert len(matches) == 3

    # Matches should be sorted by score
    assert matches[0].match_score >= matches[1].match_score >= matches[2].match_score

    # All matches should have required fields
    for match in matches:
        assert match.job_id
        assert 0 <= match.match_score <= 100
        assert match.reasoning
        assert isinstance(match.key_matches, list)


def test_matching_relevance(matching_service, sample_profile, sample_jobs):
    """Test that matching prioritizes relevant jobs."""
    matches = matching_service.match_profile_to_jobs(
        sample_profile,
        sample_jobs,
        limit=10
    )

    # Job 1 (Senior Backend Engineer) should score highest due to:
    # - Python, FastAPI, PostgreSQL match
    # - Remote work match
    # - Salary alignment
    # - Experience level match (mid->senior is reasonable)
    assert matches[0].job_id == "job-1"

    # Job 3 (Junior Frontend) should score lowest due to:
    # - Limited skill overlap (only React)
    # - Experience level mismatch (mid vs entry)
    # - Salary below expectations
    assert matches[2].job_id == "job-3"


def test_skill_matching(matching_service, sample_profile, sample_jobs):
    """Test skill matching accuracy."""
    matches = matching_service.match_profile_to_jobs(
        sample_profile,
        sample_jobs,
        limit=10
    )

    # Find the backend engineer job match
    backend_match = next(m for m in matches if m.job_id == "job-1")

    # Should identify matching skills
    assert len(backend_match.key_matches) > 0

    # Should identify missing skills
    assert "Docker" in backend_match.missing_skills or "AWS" in backend_match.missing_skills


def test_empty_jobs(matching_service, sample_profile):
    """Test handling of empty job list."""
    matches = matching_service.match_profile_to_jobs(
        sample_profile,
        [],
        limit=10
    )

    assert len(matches) == 0


def test_limit_respected(matching_service, sample_profile, sample_jobs):
    """Test that match limit is respected."""
    matches = matching_service.match_profile_to_jobs(
        sample_profile,
        sample_jobs,
        limit=2
    )

    assert len(matches) == 2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
