import { Router, type Router as RouterType } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const router: RouterType = Router()

/**
 * GET /api/v1/dashboard
 * Get aggregated dashboard data for the authenticated user
 * Returns quick stats and recent activity
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  try {
    const userId = req.user.id

    // Fetch all required data in parallel
    const [
      applicationsResult,
      profileResult,
      experiencesResult,
      educationResult,
    ] = await Promise.all([
      // Get applications data
      supabase
        .from('applications')
        .select('id, status, job_title, company, application_date, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false }),

      // Get profile data
      supabase
        .from('user_profiles')
        .select(
          'full_name, headline, bio, location, years_of_experience, desired_roles, skills',
        )
        .eq('user_id', userId)
        .single(),

      // Get experiences
      supabase
        .from('experiences')
        .select('id, updated_at, title, company')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5),

      // Get education
      supabase
        .from('education')
        .select('id, updated_at, degree, institution')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5),
    ])

    // Calculate Quick Stats
    const applications = applicationsResult.data || []
    const profile = profileResult.data

    const stats = {
      activeApplications: applications.filter(
        (app) => app.status === 'applied' || app.status === 'interviewing',
      ).length,
      jobRecommendations: 0, // TODO: Implement job recommendations feature
      skillsAdded: profile?.skills?.length || 0,
      profileCompletion: calculateProfileCompletion(profile),
    }

    // Build Recent Activity
    const recentActivity: Array<{
      id: string
      type: 'application' | 'skill' | 'favorite' | 'profile'
      title: string
      subtitle: string
      timestamp: string
    }> = []

    // Add recent applications
    applications.slice(0, 3).forEach((app) => {
      recentActivity.push({
        id: `app-${app.id}`,
        type: 'application',
        title: `Applied to ${app.job_title}`,
        subtitle: app.company,
        timestamp: app.application_date || app.updated_at,
      })
    })

    // Add recent experiences updates
    const experiences = experiencesResult.data || []
    experiences.slice(0, 2).forEach((exp) => {
      recentActivity.push({
        id: `exp-${exp.id}`,
        type: 'profile',
        title: 'Updated your profile',
        subtitle: `Added experience at ${exp.company}`,
        timestamp: exp.updated_at,
      })
    })

    // Add recent education updates
    const education = educationResult.data || []
    education.slice(0, 1).forEach((edu) => {
      recentActivity.push({
        id: `edu-${edu.id}`,
        type: 'profile',
        title: 'Updated your profile',
        subtitle: `Added education at ${edu.institution}`,
        timestamp: edu.updated_at,
      })
    })

    // Sort by timestamp and limit to 5 most recent
    recentActivity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    const limitedActivity = recentActivity.slice(0, 5)

    return res.status(200).json({
      stats,
      recentActivity: limitedActivity,
    })
  } catch (error) {
    console.error('Unexpected error fetching dashboard data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Calculate profile completion percentage based on filled fields
 */
function calculateProfileCompletion(
  profile: {
    full_name?: string | null
    headline?: string | null
    bio?: string | null
    location?: string | null
    years_of_experience?: number | null
    desired_roles?: string[] | null
    skills?: string[] | null
  } | null,
): number {
  if (!profile) return 0

  const fields = [
    profile.full_name,
    profile.headline,
    profile.bio,
    profile.location,
    profile.years_of_experience,
    profile.desired_roles && profile.desired_roles.length > 0,
    profile.skills && profile.skills.length > 0,
  ]

  const filledFields = fields.filter((field) => {
    if (typeof field === 'boolean') return field
    return field !== null && field !== undefined && field !== ''
  }).length

  return Math.round((filledFields / fields.length) * 100)
}

export const dashboardRoutes = router
