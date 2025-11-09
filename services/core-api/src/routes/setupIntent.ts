import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { validateRequest } from '../middleware/validation.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { stripe } from '../lib/stripe.js'
import { ensureStripeCustomer, getUserEmail } from '../lib/stripeHelpers.js'

const router: RouterType = Router()

// Schema for creating setup intent
const createSetupIntentSchema = z.object({
  planId: z.enum([
    'plus_monthly',
    'plus_yearly',
    'premium_monthly',
    'premium_yearly',
  ]),
})

/**
 * POST /api/v1/setup-intent
 * Create a Stripe Setup Intent for collecting payment method details
 *
 * This endpoint is used for embedded payment flows with Stripe Elements.
 * It creates a Setup Intent that can be confirmed on the frontend with payment details.
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(createSetupIntentSchema),
  async (req: AuthRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      const { planId } = req.body
      const userId = req.user.id

      // Get user email and ensure Stripe customer exists
      const userEmail = await getUserEmail(userId)
      const customerId = await ensureStripeCustomer(userId, userEmail)

      // Create Setup Intent
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      })

      return res.status(200).json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      })
    } catch (error) {
      console.error('Error creating setup intent:', error)
      return res.status(500).json({ error: 'Failed to create setup intent' })
    }
  },
)

export default router
