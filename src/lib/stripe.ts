import { loadStripe } from '@stripe/stripe-js';

// Get the Stripe publishable key from environment variables.
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// If the key is not set, throw an error to fail fast during startup.
if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in .env.local or deployment environment.');
}

// Load Stripe.js asynchronously with the validated key.
export const stripePromise = loadStripe(stripePublishableKey);
