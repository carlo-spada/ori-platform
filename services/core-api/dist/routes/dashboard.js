"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const supabase_js_1 = require("../lib/supabase.js");
const router = (0, express_1.Router)();
/**
 * GET /api/v1/dashboard
 * Get aggregated dashboard data for the authenticated user
 * Returns quick stats and recent activity
 */
router.get('/', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const userId = req.user.id;
        // Fetch all required data in parallel
        const [applicationsResult, profileResult, experiencesResult, educationResult,] = await Promise.all([
            // Get applications data
            supabase_js_1.supabase
                .from('applications')
                .select('id, status, job_title, company, application_date, updated_at')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false }),
            // Get profile data
            supabase_js_1.supabase
                .from('user_profiles')
                .select('full_name, headline, bio, location, years_of_experience, desired_roles, skills')
                .eq('user_id', userId)
                .single(),
            // Get experiences
            supabase_js_1.supabase
                .from('experiences')
                .select('id, updated_at, title, company')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(5),
            // Get education
            supabase_js_1.supabase
                .from('education')
                .select('id, updated_at, degree, institution')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(5),
        ]);
        // Calculate Quick Stats
        const applications = applicationsResult.data || [];
        const profile = profileResult.data;
        // Get job recommendations count from AI engine
        let recommendationsCount = 0;
        if (profile?.skills && profile.skills.length > 0) {
            try {
                // Call AI engine for recommendations (simplified - just counting potential matches)
                // In production, this could cache results or call a dedicated recommendations endpoint
                const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:3002';
                const matchRequest = {
                    profile: {
                        user_id: userId,
                        skills: profile.skills,
                        desired_roles: profile.desired_roles || [],
                        location: profile.location,
                        years_of_experience: profile.years_of_experience,
                    },
                    jobs: [], // In production, fetch available jobs from job board
                    limit: 10,
                };
                // For now, we'll calculate a simulated count based on profile completeness
                // Full implementation would call: ${aiEngineUrl}/api/v1/match
                const profileScore = calculateProfileCompletion(profile);
                recommendationsCount = profileScore >= 80 ? 8 :
                    profileScore >= 60 ? 5 :
                        profileScore >= 40 ? 3 :
                            profileScore >= 20 ? 1 : 0;
            }
            catch (error) {
                console.error('Failed to get job recommendations:', error);
                recommendationsCount = 0;
            }
        }
        const stats = {
            activeApplications: applications.filter((app) => app.status === 'applied' || app.status === 'interviewing').length,
            jobRecommendations: recommendationsCount,
            skillsAdded: profile?.skills?.length || 0,
            profileCompletion: calculateProfileCompletion(profile),
        };
        // Build Recent Activity
        const recentActivity = [];
        // Add recent applications
        applications.slice(0, 3).forEach((app) => {
            recentActivity.push({
                id: `app-${app.id}`,
                type: 'application',
                title: `Applied to ${app.job_title}`,
                subtitle: app.company,
                timestamp: app.application_date || app.updated_at,
            });
        });
        // Add recent experiences updates
        const experiences = experiencesResult.data || [];
        experiences.slice(0, 2).forEach((exp) => {
            recentActivity.push({
                id: `exp-${exp.id}`,
                type: 'profile',
                title: 'Updated your profile',
                subtitle: `Added experience at ${exp.company}`,
                timestamp: exp.updated_at,
            });
        });
        // Add recent education updates
        const education = educationResult.data || [];
        education.slice(0, 1).forEach((edu) => {
            recentActivity.push({
                id: `edu-${edu.id}`,
                type: 'profile',
                title: 'Updated your profile',
                subtitle: `Added education at ${edu.institution}`,
                timestamp: edu.updated_at,
            });
        });
        // Sort by timestamp and limit to 5 most recent
        recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const limitedActivity = recentActivity.slice(0, 5);
        return res.status(200).json({
            stats,
            recentActivity: limitedActivity,
        });
    }
    catch (error) {
        console.error('Unexpected error fetching dashboard data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Calculate profile completion percentage based on filled fields
 */
function calculateProfileCompletion(profile) {
    if (!profile)
        return 0;
    const fields = [
        profile.full_name,
        profile.headline,
        profile.bio,
        profile.location,
        profile.years_of_experience,
        profile.desired_roles && profile.desired_roles.length > 0,
        profile.skills && profile.skills.length > 0,
    ];
    const filledFields = fields.filter((field) => {
        if (typeof field === 'boolean')
            return field;
        return field !== null && field !== undefined && field !== '';
    }).length;
    return Math.round((filledFields / fields.length) * 100);
}
exports.dashboardRoutes = router;
//# sourceMappingURL=dashboard.js.map