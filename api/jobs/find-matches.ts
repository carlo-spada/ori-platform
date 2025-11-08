import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { supabase } from '../../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../../services/core-api/src/middleware/auth.js'
import { validateRequest } from '../../../services/core-api/src/middleware/validation.js'
import { aiClient } from '../../../services/core-api/src/lib/ai-client.js'
import { fetchSkillsGapForJob } from '../../../services/core-api/src/routes/jobs.js'

const findMatchesSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    limit: z.number().min(1).max(20).default(6),
    filters: z
      .object({
        location: z.string().optional(),
        workType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
        salaryMin: z.number().optional(),
      })
      .optional(),
  }),
})

const MAX_JOBS_TO_EVALUATE = 50

// Helper functions from original file (unused but kept for reference)
function _generateSkillsAnalysis(
  userSkills: string[],
  jobRequirements: string[],
): Array<{ name: string; status: string }> {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim())
  return jobRequirements.map((requirement) => {
    const normalizedReq = requirement.toLowerCase().trim()
    const isMatched = normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(normalizedReq) || normalizedReq.includes(userSkill),
    )
    return { name: requirement, status: isMatched ? 'matched' : 'missing' }
  })
}

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

const _sanitizeFilterValue = (value: string) => value.replace(/[%_]/g, '').trim()

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  await authMiddleware(req, res, async () => {
    validateRequest(findMatchesSchema)(req, res, async () => {
      try {
        const { userId, limit, filters } = req.body

        if (req.user?.id !== userId) {
          return res
            .status(403)
            .json({ error: 'Forbidden - Can only request your own matches' })
        }

        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        if (profileError) throw profileError

        let jobQuery = supabase.from('jobs').select('*')
        if (filters?.workType) {
          jobQuery = jobQuery.eq('work_type', filters.workType)
        }
        // ... (add other filters)

        const { data: jobs, error: jobsError } = await jobQuery
          .order('created_at', { ascending: false })
          .limit(MAX_JOBS_TO_EVALUATE)
        if (jobsError) throw jobsError

        const aiHealthy = await aiClient.healthCheck()
        let jobsWithScores

        if (aiHealthy && jobs.length > 0) {
          // AI Matching Logic (simplified for brevity)
          const matches = await aiClient.generateMatches({
            profile: {
              user_id: userId,
              skills: userProfile.skills || [],
              roles: userProfile.roles || [],
              // ... other profile fields
            },
            jobs: jobs.map((job) => ({
              job_id: job.id,
              title: job.title,
              description: job.description || '',
              requirements: job.requirements || [],
              // ... other job fields
            })),
            limit: limit,
          })

          jobsWithScores = await Promise.all(
            matches.map(async (match) => {
              const job = jobs.find((j) => j.id === match.job_id)
              const skillsGap = await fetchSkillsGapForJob(
                userProfile.skills || [],
                job?.requirements || [],
              )
              return { ...job, ...match, skillsGap }
            }),
          )
        } else {
          // Fallback Logic
          const userSkills = userProfile.skills || []
          jobsWithScores = jobs
            .map((job) => ({
              ...job,
              matchScore: calculateMatchScore(userSkills, job.requirements || []),
            }))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit)
        }

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
        return res.status(500).json({ error: error.message })
      }
    })
  })
}

export default handler
