import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { validateRequest } from '../middleware/validation.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { aiClient } from '../lib/ai-client.js'

const router: RouterType = Router()
const MAX_JOBS_TO_EVALUATE = 50

// Helper function to generate skills gap analysis
interface Skill {
  name: string
  status: 'matched' | 'missing'
}

function generateSkillsAnalysis(
  userSkills: string[],
  jobRequirements: string[],
): Skill[] {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim())

  return jobRequirements.map((requirement) => {
    const normalizedReq = requirement.toLowerCase().trim()
    const isMatched = normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(normalizedReq) || normalizedReq.includes(userSkill),
    )

    return {
      name: requirement,
      status: isMatched ? 'matched' : 'missing',
    }
  })
}

// Helper function to calculate simple match score
function calculateMatchScore(
  userSkills: string[],
  jobRequirements: string[],
): number {
  if (!jobRequirements || jobRequirements.length === 0) return 0

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim())

  const matchedCount = jobRequirements.filter((requirement) => {
    const normalizedReq = requirement.toLowerCase().trim()
    return normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(normalizedReq) || normalizedReq.includes(userSkill),
    )
  }).length

  return Math.round((matchedCount / jobRequirements.length) * 100)
}

const sanitizeFilterValue = (value: string) => value.replace(/[%_]/g, '').trim()

export interface FormattedSkillGap {
  userSkills: string[]
  requiredSkills: string[]
  missingSkills: string[]
}

export async function fetchSkillsGapForJob(
  userSkills: string[] = [],
  jobRequirements: string[] = [],
): Promise<FormattedSkillGap | undefined> {
  if (!jobRequirements.length) {
    return undefined
  }

  const response = await aiClient.getSkillGap(userSkills, jobRequirements)
  if (!response) {
    return undefined
  }

  return {
    userSkills: response.user_skills,
    requiredSkills: response.required_skills,
    missingSkills: response.missing_skills,
  }
}

// Schema for job matching request
const findMatchesSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().min(1).max(20).default(6),
  filters: z
    .object({
      location: z.string().optional(),
      workType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
      salaryMin: z.number().optional(),
    })
    .optional(),
})

// GET /api/jobs - Get all jobs
router.get('/', async (_req, res, next) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return res.json({ jobs })
  } catch (error) {
    return next(error)
  }
})

// POST /api/jobs/find-matches - Find job matches for a user
router.post(
  '/find-matches',
  authMiddleware,
  validateRequest(findMatchesSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { userId, limit, filters } = req.body

      // Validate user can only request their own matches
      if (req.user?.id !== userId) {
        return res
          .status(403)
          .json({ error: 'Forbidden - Can only request your own matches' })
      }

      // Get user profile and preferences
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError

      // Get user data for comprehensive profile
      const { error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // Fetch available jobs
      let jobQuery = supabase.from('jobs').select('*')

      if (filters?.workType) {
        jobQuery = jobQuery.eq('work_type', filters.workType)
      }

      if (filters?.location) {
        const sanitizedLocation = sanitizeFilterValue(filters.location)
        if (sanitizedLocation) {
          jobQuery = jobQuery.ilike('location', `%${sanitizedLocation}%`)
        }
      }

      if (typeof filters?.salaryMin === 'number') {
        const salaryMin = filters.salaryMin
        jobQuery = jobQuery.or(
          `salary_min.gte.${salaryMin},salary_max.gte.${salaryMin}`,
        )
      }

      const { data: jobs, error: jobsError } = await jobQuery
        .order('created_at', { ascending: false })
        .limit(MAX_JOBS_TO_EVALUATE) // Fetch more jobs for better matching

      if (jobsError) throw jobsError

      // Check if AI engine is available
      const aiHealthy = await aiClient.healthCheck()

      let jobsWithScores

      if (aiHealthy && jobs.length > 0) {
        // Use AI matching for intelligent results
        try {
          const matches = await aiClient.generateMatches({
            profile: {
              user_id: userId,
              skills: userProfile.skills || [],
              experience_level: userProfile.experience_level,
              years_of_experience: userProfile.years_of_experience,
              roles: userProfile.roles || [],
              work_style: userProfile.work_style,
              industries: userProfile.industries || [],
              location: userProfile.location,
              willing_to_relocate: userProfile.willing_to_relocate,
              salary_min: filters?.salaryMin,
              goal: userProfile.goal,
            },
            jobs: jobs.map((job) => ({
              job_id: job.id,
              title: job.title,
              company: job.company,
              description: job.description || '',
              requirements: job.requirements || [],
              location: job.location,
              work_type: job.work_type,
              salary_min: job.salary_min,
              salary_max: job.salary_max,
              tags: job.tags || [],
              posted_date: job.posted_date,
            })),
            limit: limit,
          })

          // Map AI results back to job objects with scores
          // Also fetch skill gap analysis for each match
          const matchesWithSkillGaps = await Promise.all(
            matches.map(async (match) => {
              const job = jobs.find((j) => j.id === match.job_id)
              const skillsAnalysis = generateSkillsAnalysis(
                userProfile.skills || [],
                job?.requirements || [],
              )

              // Fetch skill gap analysis from AI Engine
              const skillsGap = await fetchSkillsGapForJob(
                userProfile.skills || [],
                job?.requirements || [],
              )

              return {
                ...job,
                matchScore: Math.round(match.match_score),
                semanticScore: Math.round(match.semantic_score),
                skillMatchScore: Math.round(match.skill_match_score),
                experienceScore: Math.round(match.experience_score),
                reasoning: match.reasoning,
                keyMatches: match.key_matches,
                missingSkills: match.missing_skills,
                skills_analysis: skillsAnalysis,
                skillsGap,
              }
            }),
          )

          jobsWithScores = matchesWithSkillGaps
        } catch (aiError) {
          console.error(
            'AI matching failed, falling back to basic scoring:',
            aiError,
          )
          // Fallback to simple skill-based scoring
          const userSkills = userProfile.skills || []

          // Get skill gaps for fallback matches too
          const jobsWithSkillGaps = await Promise.all(
            jobs.map(async (job) => {
              const matchScore = calculateMatchScore(
                userSkills,
                job.requirements || [],
              )
              const skillsAnalysis = generateSkillsAnalysis(
                userSkills,
                job.requirements || [],
              )
              const matchedSkills = skillsAnalysis.filter(
                (s) => s.status === 'matched',
              )

              // Try to get skill gap even in fallback mode
              const skillsGap = await fetchSkillsGapForJob(
                userSkills,
                job.requirements || [],
              )

              return {
                ...job,
                matchScore,
                keyMatches: matchedSkills.slice(0, 3).map((s) => s.name),
                skills_analysis: skillsAnalysis,
                skillsGap,
              }
            }),
          )

          jobsWithScores = jobsWithSkillGaps
            .filter((job) => job.matchScore > 0) // Only show jobs with at least some skill match
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit)
        }
      } else {
        // AI engine not available, use fallback skill-based scoring
        console.warn('AI engine not available, using fallback matching')
        const userSkills = userProfile.skills || []

        const jobsWithBasicMatching = jobs.map((job) => {
          const matchScore = calculateMatchScore(
            userSkills,
            job.requirements || [],
          )
          const skillsAnalysis = generateSkillsAnalysis(
            userSkills,
            job.requirements || [],
          )
          const matchedSkills = skillsAnalysis.filter(
            (s) => s.status === 'matched',
          )

          return {
            ...job,
            matchScore,
            keyMatches: matchedSkills.slice(0, 3).map((s) => s.name),
            skills_analysis: skillsAnalysis,
            skillsGap: undefined, // No AI Engine available
          }
        })

        jobsWithScores = jobsWithBasicMatching
          .filter((job) => job.matchScore > 0) // Only show jobs with at least some skill match
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, limit)
      }

      // Update usage tracking
      await supabase
        .from('users')
        .update({
          monthly_job_matches_used: userProfile.monthly_job_matches_used + 1,
        })
        .eq('id', userId)

      return res.json({
        matches: jobsWithScores,
        usage: {
          used: userProfile.monthly_job_matches_used + 1,
          limit: userProfile.monthly_job_matches_limit,
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)

// POST /api/jobs/initial-search - Initial job search with validation
const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Query too short')
    .max(100, 'Query too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters in query'),
  location: z.string().trim().max(100, 'Location too long').optional(),
})

router.post(
  '/initial-search',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      // Validate and sanitize input
      const validated = searchSchema.parse(req.body)
      const { query, location: _location } = validated

      // Additional sanitization: remove SQL wildcards
      const sanitizedQuery = query.replace(/[%_]/g, '').substring(0, 100)

      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .ilike('title', `%${sanitizedQuery}%`)
        .limit(20)

      if (error) throw error

      return res.json({ jobs })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: 'Invalid input', details: error.errors })
      }
      return next(error)
    }
  },
)

export { router as jobRoutes }
