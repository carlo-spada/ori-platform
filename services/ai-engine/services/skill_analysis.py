"""
Skill gap analysis and learning path generation.
Identifies what users need to learn to reach their goals.
"""
import logging
from typing import List, Dict, Set
from collections import Counter
from models.schemas import (
    UserProfile,
    Job,
    SkillGap,
    SkillAnalysisResult,
    LearningPath
)

logger = logging.getLogger(__name__)


class SkillAnalyzer:
    """
    Analyzes skill gaps and generates personalized learning recommendations.
    """

    # Skill importance heuristics (can be enhanced with ML in future)
    CRITICAL_KEYWORDS = ['required', 'must have', 'essential', 'mandatory']
    IMPORTANT_KEYWORDS = ['preferred', 'desired', 'should have', 'strong']
    NICE_KEYWORDS = ['nice to have', 'bonus', 'plus', 'advantage']

    # Learning resource templates (can be expanded with real APIs)
    LEARNING_PLATFORMS = {
        'coursera': 'https://www.coursera.org/search?query=',
        'udemy': 'https://www.udemy.com/courses/search/?q=',
        'pluralsight': 'https://www.pluralsight.com/search?q=',
        'linkedin_learning': 'https://www.linkedin.com/learning/search?keywords=',
    }

    def analyze_skill_gaps(
        self,
        profile: UserProfile,
        target_jobs: List[Job]
    ) -> SkillAnalysisResult:
        """
        Analyze skill gaps between user profile and target jobs.

        Args:
            profile: User profile
            target_jobs: Jobs the user is interested in

        Returns:
            Comprehensive skill analysis with gaps and recommendations
        """
        logger.info(f"Analyzing skill gaps for user {profile.user_id}")

        # Aggregate skills from target jobs
        required_skills = self._aggregate_required_skills(target_jobs)

        # Identify current skills (normalized)
        user_skills_norm = {s.lower().strip() for s in profile.skills}

        # Find gaps
        skill_gaps = []
        for skill, metadata in required_skills.items():
            if skill.lower() not in user_skills_norm:
                # Check for fuzzy matches
                has_similar = any(
                    skill.lower() in us or us in skill.lower()
                    for us in user_skills_norm
                )
                if not has_similar:
                    gap = self._create_skill_gap(skill, metadata)
                    skill_gaps.append(gap)

        # Identify strengths (skills user has that are valuable)
        strengths = [
            s for s in profile.skills
            if any(s.lower() in req.lower() or req.lower() in s.lower()
                   for req in required_skills.keys())
        ]

        # Calculate overall readiness
        total_skills = len(required_skills)
        matched_skills = total_skills - len(skill_gaps)
        readiness_score = (matched_skills / total_skills * 100) if total_skills > 0 else 100

        # Generate strategic recommendations
        recommendations = self._generate_recommendations(
            profile,
            skill_gaps,
            strengths,
            readiness_score
        )

        return SkillAnalysisResult(
            user_id=profile.user_id,
            target_role=profile.roles[0] if profile.roles else None,
            current_skills=profile.skills,
            skill_gaps=sorted(skill_gaps, key=lambda x: self._gap_priority(x)),
            strengths=strengths[:5],  # Top 5 strengths
            recommendations=recommendations,
            overall_readiness=round(readiness_score, 1)
        )

    def generate_learning_paths(
        self,
        skill_gaps: List[SkillGap],
        max_paths: int = 5
    ) -> List[LearningPath]:
        """
        Generate prioritized learning paths for skill gaps.

        Args:
            skill_gaps: List of skill gaps to address
            max_paths: Maximum number of paths to generate

        Returns:
            List of learning paths
        """
        # Sort by priority
        sorted_gaps = sorted(skill_gaps, key=self._gap_priority)

        paths = []
        for i, gap in enumerate(sorted_gaps[:max_paths], 1):
            path = LearningPath(
                skill=gap.skill,
                priority=i,
                resources=self._find_learning_resources(gap.skill),
                milestones=self._generate_milestones(gap),
                estimated_duration=gap.estimated_learning_time or self._estimate_duration(gap)
            )
            paths.append(path)

        return paths

    def _aggregate_required_skills(self, jobs: List[Job]) -> Dict[str, Dict]:
        """
        Aggregate and rank skills from multiple job postings.

        Args:
            jobs: List of job postings

        Returns:
            Dict of skills with metadata (frequency, importance)
        """
        skill_counter = Counter()
        skill_metadata = {}

        for job in jobs:
            job_text = f"{job.description} {' '.join(job.requirements)}".lower()

            for req in job.requirements:
                skill = req.strip()
                skill_counter[skill] += 1

                # Determine importance from context
                importance = self._determine_importance(req, job_text)

                if skill not in skill_metadata:
                    skill_metadata[skill] = {
                        'frequency': 0,
                        'importance': importance,
                        'jobs': []
                    }

                skill_metadata[skill]['frequency'] += 1
                skill_metadata[skill]['jobs'].append(job.job_id)

        return skill_metadata

    def _determine_importance(self, skill: str, context: str) -> str:
        """
        Determine skill importance from context.

        Args:
            skill: Skill name
            context: Surrounding text context

        Returns:
            Importance level: critical, important, or nice-to-have
        """
        context_lower = context.lower()
        skill_lower = skill.lower()

        # Find skill in context
        if skill_lower not in context_lower:
            return 'important'  # Default

        # Look for keywords near the skill mention
        skill_index = context_lower.index(skill_lower)
        surrounding = context_lower[max(0, skill_index-50):skill_index+50]

        if any(kw in surrounding for kw in self.CRITICAL_KEYWORDS):
            return 'critical'
        elif any(kw in surrounding for kw in self.NICE_KEYWORDS):
            return 'nice-to-have'
        else:
            return 'important'

    def _create_skill_gap(self, skill: str, metadata: Dict) -> SkillGap:
        """
        Create a skill gap with learning recommendations.

        Args:
            skill: Skill name
            metadata: Skill metadata (frequency, importance)

        Returns:
            SkillGap object
        """
        importance = metadata.get('importance', 'important')
        frequency = metadata.get('frequency', 1)

        # Estimate target level based on importance
        target_level_map = {
            'critical': 8,
            'important': 6,
            'nice-to-have': 4
        }
        target_level = target_level_map.get(importance, 6)

        # Generate learning resources
        resources = [
            f"{platform.replace('_', ' ').title()}: {url}{skill.replace(' ', '+')}"
            for platform, url in list(self.LEARNING_PLATFORMS.items())[:2]
        ]

        # Estimate learning time
        time_map = {
            'critical': '3-4 months',
            'important': '2-3 months',
            'nice-to-have': '1-2 months'
        }
        estimated_time = time_map.get(importance, '2-3 months')

        return SkillGap(
            skill=skill,
            importance=importance,
            current_level=0,  # User doesn't have this skill
            target_level=target_level,
            learning_resources=resources,
            estimated_learning_time=estimated_time
        )

    def _generate_recommendations(
        self,
        profile: UserProfile,
        skill_gaps: List[SkillGap],
        strengths: List[str],
        readiness_score: float
    ) -> List[str]:
        """
        Generate strategic recommendations based on analysis.

        Args:
            profile: User profile
            skill_gaps: Identified skill gaps
            strengths: User's strengths
            readiness_score: Overall readiness score

        Returns:
            List of actionable recommendations
        """
        recommendations = []

        # Readiness-based advice
        if readiness_score >= 80:
            recommendations.append(
                "You're well-prepared! Focus on showcasing your skills and applying confidently."
            )
        elif readiness_score >= 60:
            recommendations.append(
                "You have a solid foundation. Bridging a few skill gaps will significantly strengthen your candidacy."
            )
        else:
            recommendations.append(
                "Consider a targeted learning plan to build essential skills for your target roles."
            )

        # Gap-specific advice
        critical_gaps = [g for g in skill_gaps if g.importance == 'critical']
        if critical_gaps:
            top_critical = critical_gaps[0].skill
            recommendations.append(
                f"Priority: Develop expertise in {top_critical} - it's highly sought after in your target roles."
            )

        # Strength leveraging
        if strengths:
            recommendations.append(
                f"Highlight your strong skills ({', '.join(strengths[:2])}) in your resume and interviews."
            )

        # Experience-based advice
        if profile.experience_level and profile.experience_level.value == 'entry':
            recommendations.append(
                "Consider internships or entry-level projects to build practical experience alongside learning."
            )

        # Portfolio/project advice
        if len(skill_gaps) > 3:
            recommendations.append(
                "Build a portfolio project that demonstrates multiple skills simultaneously."
            )

        return recommendations[:5]  # Top 5 recommendations

    def _gap_priority(self, gap: SkillGap) -> int:
        """
        Calculate priority score for a skill gap (lower = higher priority).

        Args:
            gap: Skill gap

        Returns:
            Priority score
        """
        importance_priority = {
            'critical': 1,
            'important': 2,
            'nice-to-have': 3
        }
        return importance_priority.get(gap.importance, 2)

    def _find_learning_resources(self, skill: str) -> List[Dict[str, str]]:
        """
        Find learning resources for a skill.

        Args:
            skill: Skill name

        Returns:
            List of resource dicts with title and url
        """
        resources = []
        skill_query = skill.replace(' ', '+')

        for platform, base_url in list(self.LEARNING_PLATFORMS.items())[:3]:
            resources.append({
                'title': f"Learn {skill} on {platform.replace('_', ' ').title()}",
                'url': f"{base_url}{skill_query}"
            })

        return resources

    def _generate_milestones(self, gap: SkillGap) -> List[str]:
        """
        Generate learning milestones for a skill gap.

        Args:
            gap: Skill gap

        Returns:
            List of milestone descriptions
        """
        milestones = [
            f"Complete introductory course on {gap.skill}",
            f"Build a small project using {gap.skill}",
            f"Contribute to an open-source project involving {gap.skill}",
        ]

        if gap.importance == 'critical':
            milestones.append(f"Earn a certification in {gap.skill}")

        return milestones

    def _estimate_duration(self, gap: SkillGap) -> str:
        """
        Estimate learning duration for a skill gap.

        Args:
            gap: Skill gap

        Returns:
            Duration estimate string
        """
        if gap.importance == 'critical':
            return "3-4 months"
        elif gap.importance == 'important':
            return "2-3 months"
        else:
            return "1-2 months"
