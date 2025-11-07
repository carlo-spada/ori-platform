"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const supabase_js_1 = require("../lib/supabase.js");
const router = (0, express_1.Router)();
exports.applicationRoutes = router;
// Schema for creating application
const createApplicationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    jobId: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['saved', 'applied', 'interviewing', 'offer', 'rejected']).default('saved')
});
// GET /api/applications/:userId - Get user's applications
router.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        // Validate user can only view their own applications
        if (req.user?.id !== userId) {
            return res.status(403).json({ error: 'Forbidden - Can only view your own applications' });
        }
        const { data: applications, error } = await supabase_js_1.supabase
            .from('applications')
            .select(`
        *,
        job:jobs(*)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return res.json({ applications });
    }
    catch (error) {
        return next(error);
    }
});
// POST /api/applications - Create new application
router.post('/', (0, validation_js_1.validateRequest)(createApplicationSchema), async (req, res, next) => {
    try {
        const { userId, jobId, status } = req.body;
        // Validate user can only create applications for themselves
        if (req.user?.id !== userId) {
            return res.status(403).json({ error: 'Forbidden - Can only create applications for yourself' });
        }
        const { data: application, error } = await supabase_js_1.supabase
            .from('applications')
            .insert({
            user_id: userId,
            job_id: jobId,
            status,
            applied: status === 'applied'
        })
            .select()
            .single();
        if (error)
            throw error;
        return res.json({ application });
    }
    catch (error) {
        return next(error);
    }
});
// PATCH /api/applications/:id - Update application status
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // First verify the application belongs to the user
        const { data: existingApp } = await supabase_js_1.supabase
            .from('applications')
            .select('user_id')
            .eq('id', id)
            .single();
        if (!existingApp || existingApp.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden - Can only update your own applications' });
        }
        const { data: application, error } = await supabase_js_1.supabase
            .from('applications')
            .update({
            status,
            applied: status === 'applied'
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return res.json({ application });
    }
    catch (error) {
        return next(error);
    }
});
//# sourceMappingURL=applications.js.map