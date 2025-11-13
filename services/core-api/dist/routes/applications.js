"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const auth_js_1 = require("../middleware/auth.js");
const supabase_js_1 = require("../lib/supabase.js");
const router = (0, express_1.Router)();
exports.applicationRoutes = router;
// Validation schemas
const createApplicationSchema = zod_1.z.object({
    job_title: zod_1.z.string().min(1, 'Job title is required'),
    company: zod_1.z.string().min(1, 'Company is required'),
    location: zod_1.z.string().optional().nullable(),
    job_url: zod_1.z.string().url().optional().nullable(),
    status: zod_1.z
        .enum(['applied', 'interviewing', 'offer', 'rejected', 'paused'])
        .default('applied'),
    notes: zod_1.z.string().optional().nullable(),
});
const updateApplicationSchema = zod_1.z.object({
    job_title: zod_1.z.string().min(1).optional(),
    company: zod_1.z.string().min(1).optional(),
    location: zod_1.z.string().optional().nullable(),
    job_url: zod_1.z.string().url().optional().nullable(),
    status: zod_1.z
        .enum(['applied', 'interviewing', 'offer', 'rejected', 'paused'])
        .optional(),
    notes: zod_1.z.string().optional().nullable(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['applied', 'interviewing', 'offer', 'rejected', 'paused']),
});
/**
 * GET /api/v1/applications
 * Get all applications for the authenticated user
 * Query params: status (optional filter)
 */
router.get('/', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { status } = req.query;
        let query = supabase_js_1.supabase
            .from('applications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('application_date', { ascending: false });
        // Filter by status if provided
        if (status && typeof status === 'string') {
            query = query.eq('status', status);
        }
        const { data: applications, error } = await query;
        if (error) {
            console.error('Error fetching applications:', error);
            return res.status(500).json({ error: 'Failed to fetch applications' });
        }
        return res.status(200).json({ applications });
    }
    catch (error) {
        console.error('Unexpected error fetching applications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/v1/applications/stats
 * Get application statistics for dashboard
 */
router.get('/stats', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { data: applications, error } = await supabase_js_1.supabase
            .from('applications')
            .select('status')
            .eq('user_id', req.user.id);
        if (error) {
            console.error('Error fetching application stats:', error);
            return res
                .status(500)
                .json({ error: 'Failed to fetch application stats' });
        }
        // Calculate stats
        const stats = {
            total: applications.length,
            applied: applications.filter((a) => a.status === 'applied').length,
            interviewing: applications.filter((a) => a.status === 'interviewing')
                .length,
            offers: applications.filter((a) => a.status === 'offer').length,
            rejected: applications.filter((a) => a.status === 'rejected').length,
            paused: applications.filter((a) => a.status === 'paused').length,
        };
        return res.status(200).json(stats);
    }
    catch (error) {
        console.error('Unexpected error fetching stats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/v1/applications
 * Create a new job application
 */
router.post('/', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(createApplicationSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { job_title, company, location, job_url, status, notes } = req.body;
        const { data: application, error } = await supabase_js_1.supabase
            .from('applications')
            .insert({
            user_id: req.user.id,
            job_title,
            company,
            location,
            job_url,
            status: status || 'applied',
            notes,
        })
            .select()
            .single();
        if (error) {
            console.error('Error creating application:', error);
            return res.status(500).json({ error: 'Failed to create application' });
        }
        return res.status(201).json(application);
    }
    catch (error) {
        console.error('Unexpected error creating application:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * PUT /api/v1/applications/:id
 * Update an existing application
 */
router.put('/:id', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(updateApplicationSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { id } = req.params;
        // RLS will ensure user can only update their own applications
        const { data: application, error } = await supabase_js_1.supabase
            .from('applications')
            .update(req.body)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Application not found' });
            }
            console.error('Error updating application:', error);
            return res.status(500).json({ error: 'Failed to update application' });
        }
        return res.status(200).json(application);
    }
    catch (error) {
        console.error('Unexpected error updating application:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * PATCH /api/v1/applications/:id/status
 * Update only the status of an application (quick update)
 */
router.patch('/:id/status', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(updateStatusSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { data: application, error } = await supabase_js_1.supabase
            .from('applications')
            .update({ status })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Application not found' });
            }
            console.error('Error updating application status:', error);
            return res
                .status(500)
                .json({ error: 'Failed to update application status' });
        }
        return res.status(200).json(application);
    }
    catch (error) {
        console.error('Unexpected error updating status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * DELETE /api/v1/applications/:id
 * Delete an application
 */
router.delete('/:id', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { id } = req.params;
        const { error } = await supabase_js_1.supabase
            .from('applications')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);
        if (error) {
            console.error('Error deleting application:', error);
            return res.status(500).json({ error: 'Failed to delete application' });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error('Unexpected error deleting application:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=applications.js.map