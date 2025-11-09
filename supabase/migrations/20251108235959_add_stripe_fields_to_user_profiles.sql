-- Add Stripe integration fields to user_profiles table
-- These fields store Stripe customer and subscription information for billing

ALTER TABLE public.user_profiles
ADD COLUMN stripe_customer_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN subscription_status TEXT DEFAULT 'free';

-- Add indexes for faster lookups
CREATE INDEX idx_user_profiles_stripe_customer_id ON public.user_profiles (stripe_customer_id);
CREATE INDEX idx_user_profiles_stripe_subscription_id ON public.user_profiles (stripe_subscription_id);
CREATE INDEX idx_user_profiles_subscription_status ON public.user_profiles (subscription_status);

-- Add comments to document the purpose of these fields
COMMENT ON COLUMN public.user_profiles.stripe_customer_id IS 'Stripe Customer ID for billing';
COMMENT ON COLUMN public.user_profiles.stripe_subscription_id IS 'Stripe Subscription ID if user has active subscription';
COMMENT ON COLUMN public.user_profiles.subscription_status IS 'Subscription status: free, plus_monthly, plus_yearly, premium_monthly, premium_yearly, past_due, cancelled';

-- Add constraint to ensure subscription_status has valid values
ALTER TABLE public.user_profiles
ADD CONSTRAINT check_subscription_status CHECK (
  subscription_status IN (
    'free',
    'plus_monthly',
    'plus_yearly',
    'premium_monthly',
    'premium_yearly',
    'past_due',
    'cancelled'
  )
);
