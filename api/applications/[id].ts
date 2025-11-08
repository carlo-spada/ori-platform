import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../services/core-api/src/middleware/auth.js'

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  await authMiddleware(req, res, async () => {
    try {
      const { id } = req.query
      const { status } = req.body

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Application ID is required' })
      }

      // First verify the application belongs to the user
      const { data: existingApp } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', id)
        .single()

      if (!existingApp || existingApp.user_id !== req.user?.id) {
        return res
          .status(403)
          .json({ error: 'Forbidden - Can only update your own applications' })
      }

      const { data: application, error } = await supabase
        .from('applications')
        .update({
          status,
          applied: status === 'applied',
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return res.json({ application })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  })
}

export default handler
