"""
Intelligent job matching service.
Combines semantic similarity with structured data scoring.
"""
import logging
from typing import List, Dict, Set
from models.schemas import UserProfile, Job, MatchResult
from models.embeddings import embedding_service

logger = logging.getLogger(__name__)


class MatchingService:
    """
    Multi-factor job matching engine.

    Scoring components:
    - Semantic similarity (40%): Deep understanding of fit
    - Skill match (30%): Explicit skill overlap
    - Experience alignment (15%): Career level fit
    - Location/work style (10%): Lifestyle preferences
    - Salary fit (5%): Compensation alignment
    """

    # Scoring weights
    SEMANTIC_WEIGHT = 0.40
    SKILL_WEIGHT = 0.30
    EXPERIENCE_WEIGHT = 0.15
    LOCATION_WEIGHT = 0.10
    SALARY_WEIGHT = 0.05

    def __init__(self):
        """Initialize matching service."""
        self.embedder = embedding_service

    def match_profile_to_jobs(
        self,
        profile: UserProfile,
        jobs: List[Job],
        limit: int = 10
    ) -> List[MatchResult]:
        """
        Generate intelligent job matches for a user profile.

        Args:
            profile: User profile to match
            jobs: Available jobs to match against
            limit: Maximum number of matches to return

        Returns:
            Ranked list of job matches with scores and reasoning
        """
        if not jobs:
            return []

        logger.info(f"Matching profile {profile.user_id} against {len(jobs)} jobs")

        # Generate embeddings
        profile_embedding = self.embedder.embed_profile(profile.dict())
        job_embeddings = [self.embedder.embed_job(job.dict()) for job in jobs]

        # Score each job
        matches = []
        for job, job_embedding in zip(jobs, job_embeddings):
            match = self._score_job_match(profile, job, profile_embedding, job_embedding)
            matches.append(match)

        # Sort by overall match score
        matches.sort(key=lambda x: x.match_score, reverse=True)

        return matches[:limit]

    def _score_job_match(
        self,
        profile: UserProfile,
        job: Job,
        profile_embedding,
        job_embedding
    ) -> MatchResult:
        """
        Calculate comprehensive match score for a single job.

        Args:
            profile: User profile
            job: Job posting
            profile_embedding: Profile embedding vector
            job_embedding: Job embedding vector

        Returns:
            Match result with detailed scoring
        """
        # 1. Semantic similarity (0-100)
        semantic_score = self.embedder.cosine_similarity(
            profile_embedding,
            job_embedding
        ) * 100

        # 2. Skill match score (0-100)
        skill_result = self._score_skills(profile.skills, job.requirements)
        skill_score = skill_result['score']
        matching_skills = skill_result['matching']
        missing_skills = skill_result['missing']

        # 3. Experience alignment (0-100)
        experience_score = self._score_experience(profile, job)

        # 4. Location/work style fit (0-100)
        location_score = self._score_location(profile, job)

        # 5. Salary fit (0-100)
        salary_score = self._score_salary(profile, job)

        # Calculate weighted overall score
        overall_score = (
            semantic_score * self.SEMANTIC_WEIGHT +
            skill_score * self.SKILL_WEIGHT +
            experience_score * self.EXPERIENCE_WEIGHT +
            location_score * self.LOCATION_WEIGHT +
            salary_score * self.SALARY_WEIGHT
        )

        # Generate human-readable reasoning
        reasoning = self._generate_reasoning(
            profile,
            job,
            semantic_score,
            skill_score,
            matching_skills,
            missing_skills
        )

        # Identify key matching factors
        key_matches = self._identify_key_matches(
            matching_skills,
            semantic_score,
            experience_score,
            location_score
        )

        return MatchResult(
            job_id=job.job_id,
            match_score=round(overall_score, 1),
            semantic_score=round(semantic_score, 1),
            skill_match_score=round(skill_score, 1),
            experience_score=round(experience_score, 1),
            location_score=round(location_score, 1),
            reasoning=reasoning,
            key_matches=key_matches,
            missing_skills=missing_skills
        )

    def _score_skills(
        self,
        user_skills: List[str],
        job_requirements: List[str]
    ) -> Dict:
        """
        Score skill overlap between user and job.

        Args:
            user_skills: User's skills
            job_requirements: Job requirements

        Returns:
            Dict with score, matching skills, and missing skills
        """
        if not job_requirements:
            return {'score': 100.0, 'matching': [], 'missing': []}

        if not user_skills:
            return {'score': 0.0, 'matching': [], 'missing': job_requirements}

        # Normalize for comparison (lowercase, strip whitespace)
        user_skills_norm = {s.lower().strip() for s in user_skills}
        job_reqs_norm = {r.lower().strip() for r in job_requirements}

        # Find exact matches
        matching = user_skills_norm & job_reqs_norm
        missing = job_reqs_norm - user_skills_norm

        # Fuzzy matching for partial overlaps (e.g., "React" in "React.js")
        fuzzy_matches = set()
        remaining_missing = set()

        for req in missing:
            matched = False
            for skill in user_skills_norm:
                if req in skill or skill in req:
                    fuzzy_matches.add(req)
                    matched = True
                    break
            if not matched:
                remaining_missing.add(req)

        # Calculate score
        total_matched = len(matching) + len(fuzzy_matches)
        total_required = len(job_reqs_norm)
        score = (total_matched / total_required) * 100 if total_required > 0 else 100

        # Return original-case skills for display
        matching_display = [
            req for req in job_requirements
            if req.lower().strip() in matching or req.lower().strip() in fuzzy_matches
        ]
        missing_display = [
            req for req in job_requirements
            if req.lower().strip() in remaining_missing
        ]

        return {
            'score': score,
            'matching': matching_display,
            'missing': missing_display
        }

    def _score_experience(self, profile: UserProfile, job: Job) -> float:
        """
        Score experience level alignment.

        Args:
            profile: User profile
            job: Job posting

        Returns:
            Experience score (0-100)
        """
        if not profile.experience_level:
            return 70.0  # Neutral score if unknown

        # Experience level hierarchy
        levels = {
            'entry': 1,
            'mid': 2,
            'senior': 3,
            'executive': 4
        }

        # Extract level from job description/requirements (simplified)
        job_text = f"{job.title} {job.description}".lower()
        job_level = None

        if any(term in job_text for term in ['junior', 'entry', 'graduate', 'early career']):
            job_level = 'entry'
        elif any(term in job_text for term in ['senior', 'lead', 'staff', 'principal']):
            job_level = 'senior'
        elif any(term in job_text for term in ['executive', 'director', 'vp', 'chief', 'head of']):
            job_level = 'executive'
        else:
            job_level = 'mid'  # Default assumption

        user_level = levels.get(profile.experience_level.value, 2)
        inferred_job_level = levels.get(job_level, 2)

        # Score based on alignment (perfect = 100, adjacent = 80, 2+ apart = 50)
        diff = abs(user_level - inferred_job_level)
        if diff == 0:
            return 100.0
        elif diff == 1:
            return 80.0
        else:
            return 50.0

    def _score_location(self, profile: UserProfile, job: Job) -> float:
        """
        Score location and work style fit.

        Args:
            profile: User profile
            job: Job posting

        Returns:
            Location score (0-100)
        """
        # Work style match
        if profile.work_style and job.work_type:
            if profile.work_style == job.work_type:
                return 100.0
            elif profile.work_style.value == 'flexible' or job.work_type.value == 'flexible':
                return 90.0
            elif 'remote' in [profile.work_style.value, job.work_type.value]:
                return 80.0  # Remote is generally flexible
            else:
                return 60.0  # Hybrid/onsite mismatch

        # If location data exists, could add geographic matching here
        # For now, default to good score
        return 85.0

    def _score_salary(self, profile: UserProfile, job: Job) -> float:
        """
        Score salary alignment.

        Args:
            profile: User profile
            job: Job posting

        Returns:
            Salary score (0-100)
        """
        if not profile.salary_min and not profile.salary_max:
            return 100.0  # No preference = perfect fit

        if not job.salary_min and not job.salary_max:
            return 75.0  # Unknown salary = uncertain but possible

        # Check if ranges overlap
        profile_min = profile.salary_min or 0
        profile_max = profile.salary_max or float('inf')
        job_min = job.salary_min or 0
        job_max = job.salary_max or float('inf')

        # Calculate overlap
        overlap_start = max(profile_min, job_min)
        overlap_end = min(profile_max, job_max)

        if overlap_end >= overlap_start:
            # Ranges overlap
            overlap_size = overlap_end - overlap_start
            profile_range = profile_max - profile_min if profile_max != float('inf') else 100000
            overlap_ratio = overlap_size / profile_range if profile_range > 0 else 1.0
            return min(100.0, 70.0 + (overlap_ratio * 30))
        else:
            # No overlap - how close are they?
            if job_max < profile_min:
                # Job pays too little
                gap = profile_min - job_max
                return max(0.0, 50.0 - (gap / 1000))  # Decreases with gap
            else:
                # Job pays more than user expects (good problem!)
                return 80.0

    def _generate_reasoning(
        self,
        profile: UserProfile,
        job: Job,
        semantic_score: float,
        skill_score: float,
        matching_skills: List[str],
        missing_skills: List[str]
    ) -> str:
        """
        Generate human-readable match reasoning.

        Args:
            profile: User profile
            job: Job posting
            semantic_score: Semantic similarity score
            skill_score: Skill match score
            matching_skills: Skills that match
            missing_skills: Skills gap

        Returns:
            Reasoning text
        """
        reasons = []

        # Semantic fit
        if semantic_score >= 80:
            reasons.append("Strong alignment with your career profile and goals")
        elif semantic_score >= 60:
            reasons.append("Good fit based on your background and aspirations")
        else:
            reasons.append("Some alignment with your profile")

        # Skill match
        if skill_score >= 80:
            reasons.append(f"you possess most required skills ({len(matching_skills)} matched)")
        elif skill_score >= 50:
            reasons.append(f"you have {len(matching_skills)} of the key skills")
        else:
            reasons.append(f"opportunity to develop new skills")

        # Missing skills context
        if missing_skills and len(missing_skills) <= 2:
            reasons.append(f"upskilling in {', '.join(missing_skills[:2])} would strengthen your candidacy")
        elif missing_skills and len(missing_skills) > 2:
            reasons.append(f"developing skills in {len(missing_skills)} areas could help")

        # Combine into natural sentence
        reasoning = ". ".join([r.capitalize() for r in reasons]) + "."
        return reasoning

    def _identify_key_matches(
        self,
        matching_skills: List[str],
        semantic_score: float,
        experience_score: float,
        location_score: float
    ) -> List[str]:
        """
        Identify top 3-5 key matching factors.

        Args:
            matching_skills: Matched skills
            semantic_score: Semantic similarity
            experience_score: Experience alignment
            location_score: Location fit

        Returns:
            List of key match factors
        """
        key_matches = []

        # Top skills
        key_matches.extend(matching_skills[:3])

        # Add context factors
        if experience_score >= 90:
            key_matches.append("Experience level match")

        if location_score >= 90:
            key_matches.append("Work style preference")

        if semantic_score >= 85:
            key_matches.append("Strong profile alignment")

        return key_matches[:5]  # Limit to top 5
