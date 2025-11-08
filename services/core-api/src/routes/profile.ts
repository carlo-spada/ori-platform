import { Router, type Router as RouterType } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const router: RouterType = Router()

/**
 * GET /api/v1/profile
 * Fetches the authenticated user's profile.
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return res.status(500).json({ error: 'Failed to fetch profile' })
    }

    return res.status(200).json(profile)
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * PUT /api/v1/profile/onboarding
 * Creates or updates the authenticated user's profile with onboarding data.
 *
 * Request body: {
 *   headline?: string,
 *   location?: string,
 *   skills?: string[],
 *   target_roles?: string[],
 *   work_style?: string,
 *   industries?: string[],
 *   goal?: string,
 *   cv_url?: string
 * }
 */
router.put('/onboarding', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  const {
    headline,
    location,
    skills,
    target_roles,
    work_style,
    industries,
    goal,
    cv_url,
  } = req.body

  // Validate required fields (at minimum, we should have some data)
  if (
    !headline &&
    !location &&
    (!skills || skills.length === 0) &&
    (!target_roles || target_roles.length === 0) &&
    !work_style &&
    (!industries || industries.length === 0) &&
    !goal
  ) {
    return res
      .status(400)
      .json({ error: 'At least one profile field is required' })
  }

  // Validate work_style enum if provided
  if (work_style && !['Remote', 'Hybrid', 'On-site'].includes(work_style)) {
    return res.status(400).json({
      error: 'Invalid work_style. Must be one of: Remote, Hybrid, On-site',
    })
  }

  // Validate string length limits
  if (headline && headline.length > 200) {
    return res
      .status(400)
      .json({ error: 'Headline must be 200 characters or less' })
  }

  if (location && location.length > 100) {
    return res
      .status(400)
      .json({ error: 'Location must be 100 characters or less' })
  }

  if (goal && goal.length > 1000) {
    return res
      .status(400)
      .json({ error: 'Goal must be 1000 characters or less' })
  }

  try {
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }

    if (headline !== undefined) updateData.headline = headline
    if (location !== undefined) updateData.location = location
    if (skills !== undefined) updateData.skills = skills
    if (target_roles !== undefined) updateData.target_roles = target_roles
    if (work_style !== undefined) updateData.work_style = work_style
    if (industries !== undefined) updateData.industries = industries
    if (goal !== undefined) updateData.goal = goal
    if (cv_url !== undefined) updateData.cv_url = cv_url

    // Upsert the profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    return res.status(200).json(profile)
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
