import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { validateRequest } from '../middleware/validation.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { stripe, STRIPE_PLANS, getPlanKeyFromStatus } from '../lib/stripe.js'
import { supabase } from '../lib/supabase.js'
import { ensureStripeCustomer, getUserEmail } from '../lib/stripeHelpers.js'

const router: RouterType = Router()

// Schema for creating subscription
const createSubscriptionSchema = z.object({
  planId: z.enum([
    'plus_monthly',
    'plus_yearly',
    'premium_monthly',
    'premium_yearly',
  ]),
  paymentMethodId: z.string(),
})

/**
 * POST /api/v1/subscriptions
 * Create a new Stripe subscription with the provided payment method
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(createSubscriptionSchema),
  async (req: AuthRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      const { planId, paymentMethodId } = req.body
      const userId = req.user.id

      // Get plan configuration
      const planKey = getPlanKeyFromStatus(planId)
      if (!planKey) {
        return res.status(400).json({ error: 'Invalid plan ID' })
      }

      const plan = STRIPE_PLANS[planKey]
      if (!plan.priceId) {
        return res.status(500).json({
          error: 'Plan price ID not configured. Run setup:stripe script.',
        })
      }

      // Ensure Stripe customer exists
      const userEmail = await getUserEmail(userId)
      const customerId = await ensureStripeCustomer(userId, userEmail)

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.priceId }],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      })

      // Update user profile with subscription info
      await supabase
        .from('user_profiles')
        .update({
          stripe_subscription_id: subscription.id,
          subscription_status: planId,
        })
        .eq('user_id', userId)

      return res.status(200).json({
        subscriptionId: subscription.id,
        status: subscription.status,
      })
    } catch (error) {
      console.error('Error creating subscription:', error)
      return res.status(500).json({ error: 'Failed to create subscription' })
    }
  },
)

export default router
