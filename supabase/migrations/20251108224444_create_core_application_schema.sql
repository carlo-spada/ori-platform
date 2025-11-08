-- Core Application Schema Migration
-- Creates experiences, education, and applications tables
-- Adds missing profile fields for complete user data capture

-- ============================================================================
-- UPDATE PROFILES TABLE
-- ============================================================================

-- Add remaining profile fields needed for the application
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS long_term_vision TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.full_name IS 'User''s full name for display and professional purposes';
COMMENT ON COLUMN public.user_profiles.about IS 'User''s bio or "about me" section';
COMMENT ON COLUMN public.user_profiles.long_term_vision IS 'User''s long-term career vision and goals';

-- ============================================================================
-- CREATE EXPERIENCES TABLE
-- ============================================================================

CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiences
CREATE POLICY "Users can view their own experiences"
  ON public.experiences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences"
  ON public.experiences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences"
  ON public.experiences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences"
  ON public.experiences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for efficient user lookups
CREATE INDEX idx_experiences_user_id ON public.experiences(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- CREATE EDUCATION TABLE
-- ============================================================================

CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- RLS Policies for education
CREATE POLICY "Users can view their own education"
  ON public.education
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education"
  ON public.education
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education"
  ON public.education
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education"
  ON public.education
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for efficient user lookups
CREATE INDEX idx_education_user_id ON public.education(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- CREATE APPLICATION STATUS ENUM
-- ============================================================================

CREATE TYPE application_status AS ENUM (
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'paused'
);

-- ============================================================================
-- CREATE APPLICATIONS TABLE
-- ============================================================================

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_url TEXT,
  application_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status application_status NOT NULL DEFAULT 'applied',
  notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications"
  ON public.applications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.applications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for efficient queries
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_user_status ON public.applications(user_id, status);
CREATE INDEX idx_applications_date ON public.applications(application_date DESC);

-- Trigger for updated_at and last_updated
CREATE TRIGGER update_applications_last_updated
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Additional trigger to sync last_updated
CREATE OR REPLACE FUNCTION public.update_application_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_applications_last_updated
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_last_updated();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.experiences IS 'User work experience and employment history';
COMMENT ON TABLE public.education IS 'User education history and qualifications';
COMMENT ON TABLE public.applications IS 'Job applications tracked by users';

COMMENT ON COLUMN public.applications.status IS 'Current status of the job application';
COMMENT ON COLUMN public.applications.last_updated IS 'Timestamp of last status or notes update';
COMMENT ON COLUMN public.applications.job_url IS 'URL to the original job posting';
