-- Add onboarding fields to user_profiles table
-- These fields capture essential user information during the onboarding flow

ALTER TABLE public.user_profiles
ADD COLUMN headline TEXT,
ADD COLUMN location TEXT,
ADD COLUMN target_roles TEXT[] DEFAULT '{}';

-- Add index on target_roles for faster queries when matching jobs
CREATE INDEX idx_user_profiles_target_roles ON public.user_profiles USING GIN (target_roles);

-- Add comment to document the purpose of these fields
COMMENT ON COLUMN public.user_profiles.headline IS 'User''s professional headline or tagline';
COMMENT ON COLUMN public.user_profiles.location IS 'User''s current location or preferred work location';
COMMENT ON COLUMN public.user_profiles.target_roles IS 'Roles the user is targeting in their career (e.g., ["Software Engineer", "Backend Developer"])';
