"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_js_1 = require("@supabase/supabase-js");
const validation_js_1 = require("../middleware/validation.js");
const router = (0, express_1.Router)();
exports.jobRoutes = router;
// Initialize Supabase client
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Schema for job matching request
const findMatchesSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    limit: zod_1.z.number().min(1).max(20).default(6),
    filters: zod_1.z.object({
        location: zod_1.z.string().optional(),
        workType: zod_1.z.enum(['remote', 'hybrid', 'onsite']).optional(),
        salaryMin: zod_1.z.number().optional(),
    }).optional()
});
// GET /api/jobs - Get all jobs
router.get('/', async (_req, res, next) => {
    try {
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        if (error)
            throw error;
        return res.json({ jobs });
    }
    catch (error) {
        return next(error);
    }
});
// POST /api/jobs/find-matches - Find job matches for a user
router.post('/find-matches', (0, validation_js_1.validateRequest)(findMatchesSchema), async (req, res, next) => {
    try {
        const { userId, limit, filters: _filters } = req.body;
        // Validate user can only request their own matches
        if (req.user?.id !== userId) {
            return res.status(403).json({ error: 'Forbidden - Can only request your own matches' });
        }
        // Get user profile and preferences
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (profileError)
            throw profileError;
        // For now, return mock matches
        // TODO: Implement actual AI matching logic
        const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .limit(limit);
        if (jobsError)
            throw jobsError;
        // Add mock match scores
        const jobsWithScores = jobs.map(job => ({
            ...job,
            matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
            keyMatches: [
                'Skills match',
                'Location preference',
                'Salary range'
            ]
        }));
        // Update usage tracking
        await supabase
            .from('users')
            .update({
            monthly_job_matches_used: userProfile.monthly_job_matches_used + 1
        })
            .eq('id', userId);
        return res.json({
            matches: jobsWithScores,
            usage: {
                used: userProfile.monthly_job_matches_used + 1,
                limit: userProfile.monthly_job_matches_limit
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
// POST /api/jobs/initial-search - Initial job search with validation
const searchSchema = zod_1.z.object({
    query: zod_1.z.string()
        .trim()
        .min(1, 'Query too short')
        .max(100, 'Query too long')
        .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters in query'),
    location: zod_1.z.string()
        .trim()
        .max(100, 'Location too long')
        .optional()
});
router.post('/initial-search', async (req, res, next) => {
    try {
        // Validate and sanitize input
        const validated = searchSchema.parse(req.body);
        const { query, location: _location } = validated;
        // Additional sanitization: remove SQL wildcards
        const sanitizedQuery = query.replace(/[%_]/g, '').substring(0, 100);
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .ilike('title', `%${sanitizedQuery}%`)
            .limit(20);
        if (error)
            throw error;
        return res.json({ jobs });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        return next(error);
    }
});
//# sourceMappingURL=jobs.js.map