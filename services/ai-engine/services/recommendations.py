"""
Personalized recommendation engine for career guidance.
"""
import logging
from typing import List, Dict, Optional
from models.schemas import (
    UserProfile,
    Job,
    LearningPath,
    SkillGap
)
from services.skill_analysis import SkillAnalyzer

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Generates personalized career and learning recommendations.
    """

    def __init__(self):
        """Initialize recommendation engine."""
        self.skill_analyzer = SkillAnalyzer()

    def recommend_learning_paths(
        self,
        profile: UserProfile,
        target_jobs: List[Job],
        max_paths: int = 5
    ) -> List[LearningPath]:
        """
        Recommend prioritized learning paths based on career goals.

        Args:
            profile: User profile
            target_jobs: Jobs user is targeting
            max_paths: Maximum paths to recommend

        Returns:
            List of learning paths
        """
        # Analyze skill gaps
        analysis = self.skill_analyzer.analyze_skill_gaps(profile, target_jobs)

        # Generate learning paths from gaps
        paths = self.skill_analyzer.generate_learning_paths(
            analysis.skill_gaps,
            max_paths=max_paths
        )

        return paths

    def recommend_next_steps(
        self,
        profile: UserProfile,
        current_applications: Optional[int] = None
    ) -> List[str]:
        """
        Recommend next career actions based on profile state.

        Args:
            profile: User profile
            current_applications: Number of active applications

        Returns:
            List of actionable next steps
        """
        recommendations = []

        # Onboarding state
        if not profile.cv_text:
            recommendations.append(
                "Upload your CV to unlock personalized job matching and skill analysis"
            )

        # Skills development
        if len(profile.skills) < 5:
            recommendations.append(
                "Add more skills to your profile to improve match accuracy"
            )

        # Goal setting
        if not profile.goal:
            recommendations.append(
                "Define your career goal to receive more targeted recommendations"
            )

        # Application strategy
        if current_applications is not None:
            if current_applications == 0:
                recommendations.append(
                    "Start applying! Aim for 3-5 quality applications per week"
                )
            elif current_applications > 20:
                recommendations.append(
                    "Focus on following up with existing applications before adding more"
                )

        # Continuous improvement
        recommendations.append(
            "Review your matches weekly and refine your preferences based on what resonates"
        )

        return recommendations[:5]

    def suggest_roles(
        self,
        profile: UserProfile,
        job_market_data: Optional[List[Job]] = None
    ) -> List[str]:
        """
        Suggest relevant roles based on user profile.

        Args:
            profile: User profile
            job_market_data: Optional market data for context

        Returns:
            List of suggested role titles
        """
        suggested_roles = []

        # If user already has role preferences, enhance them
        if profile.roles:
            suggested_roles.extend(profile.roles)

        # Skill-based role suggestions
        skill_role_map = {
            'python': ['Python Developer', 'Data Scientist', 'Backend Engineer'],
            'javascript': ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
            'react': ['React Developer', 'Frontend Engineer', 'UI Developer'],
            'data': ['Data Analyst', 'Data Engineer', 'Business Analyst'],
            'aws': ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
            'machine learning': ['ML Engineer', 'AI Researcher', 'Data Scientist'],
            'product': ['Product Manager', 'Product Owner', 'Product Analyst'],
            'design': ['UX Designer', 'UI/UX Designer', 'Product Designer'],
        }

        for skill in profile.skills:
            skill_lower = skill.lower()
            for key, roles in skill_role_map.items():
                if key in skill_lower:
                    suggested_roles.extend(roles)

        # Remove duplicates while preserving order
        seen = set()
        unique_roles = []
        for role in suggested_roles:
            if role not in seen:
                seen.add(role)
                unique_roles.append(role)

        return unique_roles[:10]  # Top 10 suggestions

    def personalize_job_descriptions(
        self,
        profile: UserProfile,
        job: Job,
        match_score: float
    ) -> Dict[str, str]:
        """
        Generate personalized insights about a job.

        Args:
            profile: User profile
            job: Job posting
            match_score: Match score from matching service

        Returns:
            Dict with personalized insights
        """
        insights = {
            'headline': '',
            'why_good_fit': '',
            'what_to_highlight': '',
            'preparation_tips': ''
        }

        # Headline based on match score
        if match_score >= 85:
            insights['headline'] = "Excellent match for your profile!"
        elif match_score >= 70:
            insights['headline'] = "Strong fit with room to grow"
        elif match_score >= 50:
            insights['headline'] = "Promising opportunity with some gaps to bridge"
        else:
            insights['headline'] = "Stretch opportunity - consider as a learning goal"

        # Why good fit
        matching_skills = [
            skill for skill in profile.skills
            if any(skill.lower() in req.lower() for req in job.requirements)
        ]
        if matching_skills:
            insights['why_good_fit'] = (
                f"Your expertise in {', '.join(matching_skills[:3])} directly aligns "
                f"with what {job.company} is looking for."
            )

        # What to highlight
        if profile.experience_level:
            insights['what_to_highlight'] = (
                f"Emphasize your {profile.experience_level.value}-level expertise "
                f"and relevant project outcomes."
            )

        # Preparation tips
        insights['preparation_tips'] = (
            f"Research {job.company}'s recent work and prepare examples "
            f"demonstrating your {matching_skills[0] if matching_skills else 'key skills'}."
        )

        return insights
