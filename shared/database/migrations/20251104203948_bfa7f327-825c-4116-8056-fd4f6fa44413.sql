-- Add status enum type for applications
CREATE TYPE application_status AS ENUM ('saved', 'applied', 'interviewing', 'offer', 'rejected');

-- Add status column to applications table
ALTER TABLE public.applications 
ADD COLUMN status application_status NOT NULL DEFAULT 'saved';

-- Add name and avatar_url to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN name text,
ADD COLUMN avatar_url text;

-- Create index on status for faster queries
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_user_status ON public.applications(user_id, status);