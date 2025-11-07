-- Fix 1: Move roles to secure table
-- Fix 3: Make CV bucket private

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create secure user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS (users cannot modify their own roles)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Migrate existing roles data (best effort - skip nulls)
INSERT INTO public.user_roles (user_id, role)
SELECT 
  user_id,
  'user'::app_role
FROM public.user_profiles
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Create secure function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Remove the insecure roles column from user_profiles
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS roles;

-- Make cv-uploads bucket private
UPDATE storage.buckets
SET public = false
WHERE id = 'cv-uploads';