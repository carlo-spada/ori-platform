import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
// In production, this should come from environment variables
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51234567890' // Placeholder - replace with your actual key
);