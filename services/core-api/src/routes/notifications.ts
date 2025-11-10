/**
 * Notification API Routes
 *
 * Endpoints for managing email notifications and preferences
 * - Get/update notification preferences
 * - View notification history
 * - Handle unsubscribe via token
 */

import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const router = Router()

// Validation schemas
const updatePreferencesSchema = z.object({
  payment_failure_emails: z.boolean().optional(),
  card_expiring_emails: z.boolean().optional(),
  trial_ending_emails: z.boolean().optional(),
  subscription_emails: z.boolean().optional(),
  recommendation_emails: z.boolean().optional(),
  application_status_emails: z.boolean().optional(),
  security_emails: z.boolean().optional(),
  weekly_digest: z.boolean().optional(),
})

/**
 * GET /api/v1/notifications/preferences
 * Retrieve user's notification preferences
 */
router.get('/preferences', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // User has no preferences - create defaults
        const { data: newPrefs, error: createError } = await supabase
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
          .single()

        if (createError) {
          return res.status(500).json({ error: 'Failed to create preferences' })
        }

        return res.status(200).json(newPrefs)
      }

      return res.status(500).json({ error: 'Failed to fetch preferences' })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * PUT /api/v1/notifications/preferences
 * Update user's notification preferences
 */
router.put('/preferences', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    // Validate request body
    const validationResult = updatePreferencesSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: validationResult.error.issues,
      })
    }

    const updates = validationResult.data

    // Update preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to update preferences' })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error updating preferences:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/v1/notifications/history
 * Retrieve user's notification history
 */
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
    const offset = parseInt(req.query.offset as string) || 0

    const { data, count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch notification history' })
    }

    return res.status(200).json({
      data: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching notification history:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/v1/notifications/by-type/:type
 * Retrieve notifications of specific type
 */
router.get('/by-type/:type', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const { type } = req.params
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
    const offset = parseInt(req.query.offset as string) || 0

    const { data, count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' })
    }

    return res.status(200).json({
      data: data || [],
      total: count || 0,
      type,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching notifications by type:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/v1/notifications/unsubscribe
 * Unsubscribe from emails (authenticated endpoint)
 */
router.post('/unsubscribe', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('notification_preferences')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to unsubscribe' })
    }

    return res.status(200).json({
      message: 'Successfully unsubscribed from all emails',
      data,
    })
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/v1/notifications/unsubscribe/:token
 * Unsubscribe via unauthenticated token link
 */
router.post('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params

    // Find preferences by unsubscribe token
    const { data: preferences, error: fetchError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('unsubscribe_token', token)
      .single()

    if (fetchError || !preferences) {
      return res.status(404).json({ error: 'Invalid or expired unsubscribe link' })
    }

    // Update to unsubscribed
    const { data, error: updateError } = await supabase
      .from('notification_preferences')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({ error: 'Failed to unsubscribe' })
    }

    return res.status(200).json({
      message: 'Successfully unsubscribed from all emails',
      data,
    })
  } catch (error) {
    console.error('Error processing unsubscribe:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/v1/notifications/resubscribe
 * Re-subscribe to emails
 */
router.post('/resubscribe', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('notification_preferences')
      .update({
        unsubscribed: false,
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to resubscribe' })
    }

    return res.status(200).json({
      message: 'Successfully resubscribed to emails',
      data,
    })
  } catch (error) {
    console.error('Error resubscribing:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/v1/notifications/stats
 * Get notification statistics for user
 */
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    // Get all notifications
    const { data: allNotifications, error } = await supabase
      .from('notifications')
      .select('type, status')
      .eq('user_id', userId)

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch statistics' })
    }

    // Count by type and status
    const typeCounts: Record<string, number> = {}
    const statusCounts: Record<string, number> = {}

    ;(allNotifications || []).forEach((notif: any) => {
      typeCounts[notif.type] = (typeCounts[notif.type] || 0) + 1
      statusCounts[notif.status] = (statusCounts[notif.status] || 0) + 1
    })

    return res.status(200).json({
      byType: typeCounts,
      byStatus: statusCounts,
      total: (allNotifications || []).length,
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as notificationsRouter }
