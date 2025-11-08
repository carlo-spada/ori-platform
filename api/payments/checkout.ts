import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { z } from 'zod'
import { supabase } from '../../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../../services/core-api/src/middleware/auth.js'
import { validateRequest } from '../../../services/core-api/src/middleware/validation.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const createCheckoutSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    priceId: z.string(),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
  }),
})

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // @ts-ignore
  await authMiddleware(req, res, async () => {
    // @ts-ignore
    validateRequest(createCheckoutSchema)(req, res, async () => {
      try {
        const { userId, priceId, successUrl, cancelUrl } = req.body

        // @ts-ignore
        if (req.user?.id !== userId) {
          return res.status(403).json({
            error: 'Forbidden - Can only create checkout for yourself',
          })
        }

        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (userError) throw userError

        let customerId = user.stripe_customer_id
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: { userId: user.id },
          })
          customerId = customer.id
          await supabase
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId)
        }

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: { userId },
        })

        return res.json({ url: session.url })
      } catch (error) {
        // @ts-ignore
        return res.status(500).json({ error: error.message })
      }
    })
  })
}

export default handler
