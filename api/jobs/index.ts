import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../services/core-api/src/lib/supabase.js'

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return res.json({ jobs })
  } catch (error) {
    // @ts-ignore
    return res.status(500).json({ error: error.message })
  }
}

export default handler
