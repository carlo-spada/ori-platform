"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experiencesRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const auth_js_1 = require("../middleware/auth.js");
const supabase_js_1 = require("../lib/supabase.js");
const router = (0, express_1.Router)();
exports.experiencesRoutes = router;
// Validation schemas
const createExperienceSchema = zod_1.z.object({
    company: zod_1.z.string().min(1, 'Company is required'),
    role: zod_1.z.string().min(1, 'Role is required'),
    start_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    end_date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .optional()
        .nullable(),
    is_current: zod_1.z.boolean().default(false),
    description: zod_1.z.string().optional().nullable(),
});
const updateExperienceSchema = zod_1.z.object({
    company: zod_1.z.string().min(1).optional(),
    role: zod_1.z.string().min(1).optional(),
    start_date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .optional(),
    end_date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .optional()
        .nullable(),
    is_current: zod_1.z.boolean().optional(),
    description: zod_1.z.string().optional().nullable(),
});
/**
 * GET /api/v1/experiences
 * Get all work experiences for the authenticated user
 */
router.get('/', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { data: experiences, error } = await supabase_js_1.supabase
            .from('experiences')
            .select('*')
            .eq('user_id', req.user.id)
            .order('start_date', { ascending: false });
        if (error) {
            console.error('Error fetching experiences:', error);
            return res.status(500).json({ error: 'Failed to fetch experiences' });
        }
        return res.status(200).json({ experiences });
    }
    catch (error) {
        console.error('Unexpected error fetching experiences:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/v1/experiences
 * Create a new work experience
 */
router.post('/', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(createExperienceSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { company, role, start_date, end_date, is_current, description } = req.body;
        const { data: experience, error } = await supabase_js_1.supabase
            .from('experiences')
            .insert({
            user_id: req.user.id,
            company,
            role,
            start_date,
            end_date,
            is_current: is_current || false,
            description,
        })
            .select()
            .single();
        if (error) {
            console.error('Error creating experience:', error);
            return res.status(500).json({ error: 'Failed to create experience' });
        }
        return res.status(201).json(experience);
    }
    catch (error) {
        console.error('Unexpected error creating experience:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * PUT /api/v1/experiences/:id
 * Update an existing work experience
 */
router.put('/:id', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(updateExperienceSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { id } = req.params;
        // RLS will ensure user can only update their own experiences
        const { data: experience, error } = await supabase_js_1.supabase
            .from('experiences')
            .update(req.body)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Experience not found' });
            }
            console.error('Error updating experience:', error);
            return res.status(500).json({ error: 'Failed to update experience' });
        }
        return res.status(200).json(experience);
    }
    catch (error) {
        console.error('Unexpected error updating experience:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * DELETE /api/v1/experiences/:id
 * Delete a work experience
 */
router.delete('/:id', auth_js_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { id } = req.params;
        const { error } = await supabase_js_1.supabase
            .from('experiences')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);
        if (error) {
            console.error('Error deleting experience:', error);
            return res.status(500).json({ error: 'Failed to delete experience' });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error('Unexpected error deleting experience:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=experiences.js.map