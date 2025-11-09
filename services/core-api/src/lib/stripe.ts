import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Stripe Product and Price IDs (will be set programmatically)
export const STRIPE_PLANS = {
  plus_monthly: {
    name: 'Ori Plus',
    price: 500, // $5.00 in cents
    interval: 'month' as const,
    productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
    priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY_ID || '',
  },
  plus_yearly: {
    name: 'Ori Plus',
    price: 4800, // $48.00 in cents (20% discount)
    interval: 'year' as const,
    productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
    priceId: process.env.STRIPE_PRICE_PLUS_YEARLY_ID || '',
  },
  premium_monthly: {
    name: 'Ori Premium',
    price: 1000, // $10.00 in cents
    interval: 'month' as const,
    productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID || '',
  },
  premium_yearly: {
    name: 'Ori Premium',
    price: 9600, // $96.00 in cents (20% discount)
    interval: 'year' as const,
    productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
    priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID || '',
  },
}

/**
 * Get plan key from subscription status
 */
export function getPlanKeyFromStatus(
  status: string,
): keyof typeof STRIPE_PLANS | null {
  if (
    status === 'plus_monthly' ||
    status === 'plus_yearly' ||
    status === 'premium_monthly' ||
    status === 'premium_yearly'
  ) {
    return status as keyof typeof STRIPE_PLANS
  }
  return null
}

/**
 * Get subscription status from Stripe price ID
 */
export function getStatusFromPriceId(
  priceId: string,
): string {
  for (const [key, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) {
      return key
    }
  }
  return 'free'
}
