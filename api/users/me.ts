import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../services/core-api/src/middleware/auth.js'

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // @ts-ignore
  await authMiddleware(req, res, async () => {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      // @ts-ignore
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        // @ts-ignore
        .eq('user_id', req.user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return res.status(404).json({ error: 'User profile not found.' })
      }

      return res.status(200).json(profile)
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
}

export default handler
