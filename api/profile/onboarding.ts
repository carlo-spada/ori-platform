import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../services/core-api/src/middleware/auth.js'

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // @ts-ignore
  await authMiddleware(req, res, async () => {
    // @ts-ignore
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

    // Basic validation from the original route
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

    try {
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

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        // @ts-ignore
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
}

export default handler
