-- Onboarding V2 Enhancement Migration
-- Adds new fields and tables for progressive disclosure without dropping existing data

-- Add new fields to user_profiles if they don't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS preferred_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS current_status VARCHAR(50) CHECK (current_status IN ('student', 'professional', 'transitioning', 'exploring')),
ADD COLUMN IF NOT EXISTS years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 50),
ADD COLUMN IF NOT EXISTS is_remote_open BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS imported_data JSONB,
ADD COLUMN IF NOT EXISTS skill_levels JSONB,
ADD COLUMN IF NOT EXISTS hidden_talents TEXT[],
ADD COLUMN IF NOT EXISTS dream_role VARCHAR(200),
ADD COLUMN IF NOT EXISTS timeline_months INTEGER CHECK (timeline_months IN (6, 12, 24, 36, 60)),
ADD COLUMN IF NOT EXISTS success_metrics JSONB,
ADD COLUMN IF NOT EXISTS long_term_vision TEXT,
ADD COLUMN IF NOT EXISTS work_styles JSONB,
ADD COLUMN IF NOT EXISTS culture_values TEXT[],
ADD COLUMN IF NOT EXISTS deal_breakers TEXT[],
ADD COLUMN IF NOT EXISTS onboarding_version INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS features_unlocked TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create onboarding sessions table if not exists
CREATE TABLE IF NOT EXISTS public.onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  form_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB,
  browser_info JSONB,
  referrer TEXT,
  utm_params JSONB,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,
  CONSTRAINT unique_active_session EXCLUDE USING btree (user_id WITH =) WHERE (completed_at IS NULL)
);

-- Create analytics table if not exists
CREATE TABLE IF NOT EXISTS public.onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.onboarding_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  step_name VARCHAR(50),
  field_name VARCHAR(50),
  time_on_step INTEGER,
  total_session_time INTEGER,
  old_value JSONB,
  new_value JSONB,
  validation_errors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill suggestions table if not exists
CREATE TABLE IF NOT EXISTS public.skill_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50),
  suggested_skills TEXT[] NOT NULL,
  industry VARCHAR(100),
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, experience_level, industry)
);

-- Insert skill suggestions if not exists
INSERT INTO public.skill_suggestions (role, experience_level, suggested_skills)
VALUES
  ('frontend', 'junior', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design']),
  ('frontend', 'mid', ARRAY['React', 'TypeScript', 'Next.js', 'Testing', 'Performance', 'State Management']),
  ('frontend', 'senior', ARRAY['Architecture', 'TypeScript', 'Performance', 'Leadership', 'System Design', 'Mentoring']),
  ('backend', 'junior', ARRAY['Python', 'SQL', 'REST APIs', 'Git', 'PostgreSQL', 'Testing']),
  ('backend', 'mid', ARRAY['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices', 'Redis']),
  ('backend', 'senior', ARRAY['Architecture', 'Distributed Systems', 'Security', 'Leadership', 'DevOps', 'Mentoring']),
  ('fullstack', 'mid', ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS']),
  ('data', 'junior', ARRAY['Python', 'SQL', 'Pandas', 'Statistics', 'Jupyter', 'Excel']),
  ('data', 'mid', ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics', 'Scikit-learn', 'Data Visualization']),
  ('product', 'any', ARRAY['Product Strategy', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management', 'Agile'])
ON CONFLICT (role, experience_level, industry) DO NOTHING;

-- Enable RLS
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_sessions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own sessions' AND tablename = 'onboarding_sessions') THEN
    CREATE POLICY "Users can manage their own sessions"
      ON public.onboarding_sessions FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for onboarding_analytics
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own analytics' AND tablename = 'onboarding_analytics') THEN
    CREATE POLICY "Users can view their own analytics"
      ON public.onboarding_analytics FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own analytics' AND tablename = 'onboarding_analytics') THEN
    CREATE POLICY "Users can insert their own analytics"
      ON public.onboarding_analytics FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for skill_suggestions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view skill suggestions' AND tablename = 'skill_suggestions') THEN
    CREATE POLICY "Anyone can view skill suggestions"
      ON public.skill_suggestions FOR SELECT
      USING (true);
  END IF;
END $$;

-- Create profile completeness calculation function
CREATE OR REPLACE FUNCTION public.calculate_profile_completeness(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  profile public.user_profiles%ROWTYPE;
  completeness INTEGER := 0;
BEGIN
  SELECT * INTO profile FROM public.user_profiles WHERE id = profile_id;

  -- Required fields (60 points)
  IF profile.full_name IS NOT NULL AND profile.full_name != '' THEN completeness := completeness + 10; END IF;
  IF profile.current_status IS NOT NULL THEN completeness := completeness + 10; END IF;
  IF profile.location IS NOT NULL AND profile.location != '' THEN completeness := completeness + 10; END IF;
  IF profile.years_experience IS NOT NULL THEN completeness := completeness + 10; END IF;
  IF array_length(profile.skills, 1) >= 3 THEN completeness := completeness + 20; END IF;

  -- Valuable optional fields (30 points)
  IF profile.dream_role IS NOT NULL AND profile.dream_role != '' THEN completeness := completeness + 5; END IF;
  IF profile.timeline_months IS NOT NULL THEN completeness := completeness + 5; END IF;
  IF profile.long_term_vision IS NOT NULL AND profile.long_term_vision != '' THEN completeness := completeness + 5; END IF;
  IF array_length(profile.target_roles, 1) > 0 THEN completeness := completeness + 5; END IF;
  IF profile.cv_url IS NOT NULL OR profile.linkedin_url IS NOT NULL THEN completeness := completeness + 10; END IF;

  -- Nice to have (10 points)
  IF profile.work_styles IS NOT NULL THEN completeness := completeness + 5; END IF;
  IF array_length(profile.culture_values, 1) > 0 THEN completeness := completeness + 5; END IF;

  RETURN LEAST(completeness, 100);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(current_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience ON public.user_profiles(years_experience);
CREATE INDEX IF NOT EXISTS idx_user_profiles_completeness ON public.user_profiles(profile_completeness);

CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_user_id ON public.onboarding_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_active ON public.onboarding_sessions(user_id) WHERE completed_at IS NULL;

-- Create or update triggers
DROP TRIGGER IF EXISTS update_onboarding_sessions_updated_at ON public.onboarding_sessions;
CREATE TRIGGER update_onboarding_sessions_updated_at
  BEFORE UPDATE ON public.onboarding_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.onboarding_sessions IS 'Persistent onboarding state for recovery and analytics';
COMMENT ON COLUMN public.user_profiles.profile_completeness IS 'Calculated 0-100 score of profile completion';
COMMENT ON COLUMN public.user_profiles.features_unlocked IS 'Array of feature flags unlocked based on profile completeness';