import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { supabase } from '../../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../../services/core-api/src/middleware/auth.js'

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Query too short')
    .max(100, 'Query too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters in query'),
  location: z.string().trim().max(100, 'Location too long').optional(),
})

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // @ts-ignore
  await authMiddleware(req, res, async () => {
    try {
      const validated = searchSchema.parse(req.body)
      const { query } = validated

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
      // @ts-ignore
      return res.status(500).json({ error: error.message })
    }
  })
}

export default handler
