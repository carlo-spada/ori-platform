import { loadStripe, Stripe } from '@stripe/stripe-js';

// Lazy initialization - only load Stripe when needed
let _stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (_stripePromise) {
    return _stripePromise;
  }

  // Get the Stripe publishable key from environment variables
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  // If the key is not set, throw an error only when Stripe is actually needed
  if (!stripePublishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in .env.local or deployment environment.');
  }

  // Load Stripe.js asynchronously with the validated key
  _stripePromise = loadStripe(stripePublishableKey);
  return _stripePromise;
};

// Keep backward compatibility with existing code that uses stripePromise
// This will be null during SSR/build and only initialized when accessed in browser
export const stripePromise = typeof window !== 'undefined'
  ? getStripe()
  : Promise.resolve(null);
