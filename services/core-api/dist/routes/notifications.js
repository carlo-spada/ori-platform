"use strict";
/**
 * Notification API Routes
 *
 * Endpoints for managing email notifications and preferences
 * - Get/update notification preferences
 * - View notification history
 * - Handle unsubscribe via token
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_js_1 = require("../middleware/auth.js");
const supabase_js_1 = require("../lib/supabase.js");
const router = (0, express_1.Router)();
exports.notificationsRouter = router;
// Validation schemas
const updatePreferencesSchema = zod_1.z.object({
    payment_failure_emails: zod_1.z.boolean().optional(),
    card_expiring_emails: zod_1.z.boolean().optional(),
    trial_ending_emails: zod_1.z.boolean().optional(),
    subscription_emails: zod_1.z.boolean().optional(),
    recommendation_emails: zod_1.z.boolean().optional(),
    application_status_emails: zod_1.z.boolean().optional(),
    security_emails: zod_1.z.boolean().optional(),
    weekly_digest: zod_1.z.boolean().optional(),
});
/**
 * GET /api/v1/notifications/preferences
 * Retrieve user's notification preferences
 */
router.get('/preferences', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { data, error } = await supabase_js_1.supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                // User has no preferences - create defaults
                const { data: newPrefs, error: createError } = await supabase_js_1.supabase
                    .from('notification_preferences')
                    .insert({
                    user_id: userId,
                    payment_failure_emails: true,
                    card_expiring_emails: true,
                    trial_ending_emails: true,
                    subscription_emails: true,
                    recommendation_emails: true,
                    application_status_emails: true,
                    security_emails: true,
                    weekly_digest: false,
                    unsubscribed: false,
                })
                    .select()
                    .single();
                if (createError) {
                    return res.status(500).json({ error: 'Failed to create preferences' });
                }
                return res.status(200).json(newPrefs);
            }
            return res.status(500).json({ error: 'Failed to fetch preferences' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching preferences:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * PUT /api/v1/notifications/preferences
 * Update user's notification preferences
 */
router.put('/preferences', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        // Validate request body
        const validationResult = updatePreferencesSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: validationResult.error.issues,
            });
        }
        const updates = validationResult.data;
        // Update preferences
        const { data, error } = await supabase_js_1.supabase
            .from('notification_preferences')
            .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ error: 'Failed to update preferences' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Error updating preferences:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/v1/notifications/history
 * Retrieve user's notification history
 */
router.get('/history', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        const { data, count, error } = await supabase_js_1.supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch notification history' });
        }
        return res.status(200).json({
            data: data || [],
            total: count || 0,
            limit,
            offset,
        });
    }
    catch (error) {
        console.error('Error fetching notification history:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/v1/notifications/by-type/:type
 * Retrieve notifications of specific type
 */
router.get('/by-type/:type', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type } = req.params;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        const { data, count, error } = await supabase_js_1.supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .eq('type', type)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch notifications' });
        }
        return res.status(200).json({
            data: data || [],
            total: count || 0,
            type,
            limit,
            offset,
        });
    }
    catch (error) {
        console.error('Error fetching notifications by type:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/v1/notifications/unsubscribe
 * Unsubscribe from emails (authenticated endpoint)
 */
router.post('/unsubscribe', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { data, error } = await supabase_js_1.supabase
            .from('notification_preferences')
            .update({
            unsubscribed: true,
            unsubscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ error: 'Failed to unsubscribe' });
        }
        return res.status(200).json({
            message: 'Successfully unsubscribed from all emails',
            data,
        });
    }
    catch (error) {
        console.error('Error unsubscribing:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/v1/notifications/unsubscribe/:token
 * Unsubscribe via unauthenticated token link
 */
router.post('/unsubscribe/:token', async (req, res) => {
    try {
        const { token } = req.params;
        // Find preferences by unsubscribe token
        const { data: preferences, error: fetchError } = await supabase_js_1.supabase
            .from('notification_preferences')
            .select('*')
            .eq('unsubscribe_token', token)
            .single();
        if (fetchError || !preferences) {
            return res.status(404).json({ error: 'Invalid or expired unsubscribe link' });
        }
        // Update to unsubscribed
        const { data, error: updateError } = await supabase_js_1.supabase
            .from('notification_preferences')
            .update({
            unsubscribed: true,
            unsubscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq('unsubscribe_token', token)
            .select()
            .single();
        if (updateError) {
            return res.status(500).json({ error: 'Failed to unsubscribe' });
        }
        return res.status(200).json({
            message: 'Successfully unsubscribed from all emails',
            data,
        });
    }
    catch (error) {
        console.error('Error processing unsubscribe:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/v1/notifications/resubscribe
 * Re-subscribe to emails
 */
router.post('/resubscribe', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { data, error } = await supabase_js_1.supabase
            .from('notification_preferences')
            .update({
            unsubscribed: false,
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
        })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ error: 'Failed to resubscribe' });
        }
        return res.status(200).json({
            message: 'Successfully resubscribed to emails',
            data,
        });
    }
    catch (error) {
        console.error('Error resubscribing:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/v1/notifications/stats
 * Get notification statistics for user
 */
router.get('/stats', auth_js_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        // Get all notifications
        const { data: allNotifications, error } = await supabase_js_1.supabase
            .from('notifications')
            .select('type, status')
            .eq('user_id', userId);
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch statistics' });
        }
        // Count by type and status
        const typeCounts = {};
        const statusCounts = {};
        (allNotifications || []).forEach((notif) => {
            typeCounts[notif.type] = (typeCounts[notif.type] || 0) + 1;
            statusCounts[notif.status] = (statusCounts[notif.status] || 0) + 1;
        });
        return res.status(200).json({
            byType: typeCounts,
            byStatus: statusCounts,
            total: (allNotifications || []).length,
        });
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=notifications.js.map