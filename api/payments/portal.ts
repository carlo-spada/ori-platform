import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { supabase } from '../../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../../services/core-api/src/middleware/auth.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
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
      const { userId } = req.body

      // @ts-ignore
      if (req.user?.id !== userId) {
        return res
          .status(403)
          .json({ error: 'Forbidden - Can only access your own portal' })
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      if (!user.stripe_customer_id) {
        return res.status(400).json({ error: 'No subscription found' })
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: `${process.env.FRONTEND_URL}/app/settings`,
      })

      return res.json({ url: session.url })
    } catch (error) {
      // @ts-ignore
      return res.status(500).json({ error: error.message })
    }
  })
}

export default handler
