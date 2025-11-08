import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { Readable } from 'node:stream'
import { supabase } from '../../../services/core-api/src/lib/supabase.js'

// Disable Vercel's default body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Helper to buffer the request
async function buffer(readable: Readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`❌ Error message: ${errorMessage}`)
    return res.status(400).send(`Webhook Error: ${errorMessage}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (userId) {
        await supabase
          .from('users')
          .update({
            subscription_status: 'active',
            // This is a simplification. A real app would map priceId to a tier.
            subscription_tier: 'plus',
          })
          .eq('id', userId)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('users')
        .update({
          subscription_status: 'canceled',
          subscription_tier: 'free',
        })
        .eq('stripe_customer_id', subscription.customer)
      break
    }
    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }

  res.status(200).json({ received: true })
}

export default handler
