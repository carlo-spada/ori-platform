import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { supabase } from '../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../services/core-api/src/middleware/auth.js'
import { validateRequest } from '../../services/core-api/src/middleware/validation.js'

const createApplicationSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    jobId: z.string().uuid(),
    status: z
      .enum(['saved', 'applied', 'interviewing', 'offer', 'rejected'])
      .default('saved'),
  }),
})

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  // @ts-ignore
  await authMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      return handleGet(req, res)
    }
    if (req.method === 'POST') {
      // @ts-ignore
      return validateRequest(createApplicationSchema)(req, res, () =>
        handlePost(req, res),
      )
    }
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  })
}

// @ts-ignore
const handleGet = async (req: VercelRequest, res: VercelResponse) => {
  const { userId } = req.query
  if (typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId query parameter is required' })
  }

  try {
    // @ts-ignore
    if (req.user?.id !== userId) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Can only view your own applications' })
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*, job:jobs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return res.json({ applications })
  } catch (error) {
    // @ts-ignore
    return res.status(500).json({ error: error.message })
  }
}

// @ts-ignore
const handlePost = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { userId, jobId, status } = req.body

    // @ts-ignore
    if (req.user?.id !== userId) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Can only create applications for yourself' })
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        status,
        applied: status === 'applied',
      })
      .select()
      .single()

    if (error) throw error
    return res.json({ application })
  } catch (error) {
    // @ts-ignore
    return res.status(500).json({ error: error.message })
  }
}

export default handler
