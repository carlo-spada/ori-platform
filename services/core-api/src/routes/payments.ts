import { Router, type Router as RouterType } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { validateRequest } from '../middleware/validation.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router: RouterType = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for checkout session
const createCheckoutSchema = z.object({
  userId: z.string().uuid(),
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

// POST /api/payments/checkout - Create Stripe checkout session
router.post('/checkout', authMiddleware, validateRequest(createCheckoutSchema), async (req: AuthRequest, res, next) => {
  try {
    const { userId, priceId, successUrl, cancelUrl } = req.body;
    
    // Validate user can only create checkout for themselves
    if (req.user?.id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Can only create checkout for yourself' });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });

      customerId = customer.id;

      // Save customer ID to database
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId
      }
    });

    return res.json({ url: session.url });
  } catch (error) {
    return next(error);
  }
});

// POST /api/payments/portal - Create customer portal session
router.post('/portal', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.body;
    
    // Validate user can only access their own portal
    if (req.user?.id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Can only access your own portal' });
    }

    // Get user's Stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard/settings`
    });

    return res.json({ url: session.url });
  } catch (error) {
    return next(error);
  }
});

// POST /api/payments/webhook - Handle Stripe webhooks
// Note: No auth middleware - validates Stripe signature instead
// Raw body middleware applied in index.ts before json middleware
router.post('/webhook', async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update user subscription status
          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_tier: 'plus' // Determine from price ID
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Update user subscription status
        await supabase
          .from('users')
          .update({
            subscription_status: 'canceled',
            subscription_tier: 'free'
          })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
});

export { router as paymentRoutes };
