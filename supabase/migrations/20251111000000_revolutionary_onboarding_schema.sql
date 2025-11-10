-- Revolutionary Onboarding Schema
-- Complete reset for a fresh start with progressive disclosure

-- Drop existing tables and start fresh (as requested)
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.beta_testers CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create the new progressive user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity (Step 0) - REQUIRED
  full_name VARCHAR(200),
  preferred_name VARCHAR(100),
  profile_photo_url TEXT,

  -- Context (Step 1) - REQUIRED
  current_status VARCHAR(50) CHECK (current_status IN ('student', 'professional', 'transitioning', 'exploring')),
  years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 50),
  location TEXT,
  is_remote_open BOOLEAN DEFAULT true,

  -- Professional Import (Optional)
  cv_url TEXT,
  linkedin_url TEXT,
  imported_data JSONB, -- Store parsed CV/LinkedIn data

  -- Expertise (Step 2) - PARTIALLY REQUIRED
  skills TEXT[], -- Simple array for now
  skill_levels JSONB, -- {"React": 8, "Python": 6, ...}
  hidden_talents TEXT[],

  -- Aspirations (Step 3) - OPTIONAL BUT VALUABLE
  dream_role VARCHAR(200),
  timeline_months INTEGER CHECK (timeline_months IN (6, 12, 24, 36, 60)),
  success_metrics JSONB,
  long_term_vision TEXT,
  target_roles TEXT[],

  -- Preferences (Step 4) - OPTIONAL
  work_styles JSONB, -- {"remote": 10, "async": 8, "collaborative": 6}
  culture_values TEXT[], -- Ordered by preference
  deal_breakers TEXT[],
  industries TEXT[],

  -- Subscription & Features
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trialing')),

  -- Progressive disclosure tracking
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_version INTEGER DEFAULT 2,
  profile_completeness INTEGER DEFAULT 0, -- 0-100 score
  features_unlocked TEXT[] DEFAULT '{}', -- Track which features user has access to

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Onboarding sessions for persistence and recovery
CREATE TABLE public.onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session state
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  form_data JSONB DEFAULT '{}', -- Stores all form data for auto-save

  -- Tracking
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,

  -- Recovery & Analytics
  device_info JSONB,
  browser_info JSONB,
  referrer TEXT,
  utm_params JSONB,

  -- Email reminder tracking
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,

  CONSTRAINT unique_active_session EXCLUDE USING btree (user_id WITH =) WHERE (completed_at IS NULL)
);

-- Analytics for optimization
CREATE TABLE public.onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.onboarding_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event tracking
  event_type VARCHAR(50) NOT NULL, -- step_started, step_completed, field_changed, abandoned, etc.
  step_name VARCHAR(50),
  field_name VARCHAR(50),

  -- Timing
  time_on_step INTEGER, -- seconds
  total_session_time INTEGER, -- seconds

  -- Data
  old_value JSONB,
  new_value JSONB,
  validation_errors JSONB,

  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table for matching (rebuilt)
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Core fields
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  remote_type VARCHAR(50) CHECK (remote_type IN ('onsite', 'remote', 'hybrid')),

  -- Details
  description TEXT,
  requirements TEXT[],
  nice_to_haves TEXT[],
  highlights TEXT[] DEFAULT '{}',

  -- Matching
  required_skills TEXT[],
  required_experience INTEGER, -- years
  industries TEXT[],

  -- Metadata
  external_url TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'USD',

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Applications tracking
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User actions
  saved_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,

  -- Matching
  match_score FLOAT CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB,

  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  UNIQUE(job_id, user_id)
);

-- Skill suggestions (for AI-powered suggestions)
CREATE TABLE public.skill_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50),
  suggested_skills TEXT[] NOT NULL,
  industry VARCHAR(100),
  relevance_score FLOAT DEFAULT 1.0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(role, experience_level, industry)
);

-- Insert common skill suggestions
INSERT INTO public.skill_suggestions (role, experience_level, suggested_skills) VALUES
  ('frontend', 'junior', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design']),
  ('frontend', 'mid', ARRAY['React', 'TypeScript', 'Next.js', 'Testing', 'Performance', 'State Management']),
  ('frontend', 'senior', ARRAY['Architecture', 'TypeScript', 'Performance', 'Leadership', 'System Design', 'Mentoring']),
  ('backend', 'junior', ARRAY['Python', 'SQL', 'REST APIs', 'Git', 'PostgreSQL', 'Testing']),
  ('backend', 'mid', ARRAY['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices', 'Redis']),
  ('backend', 'senior', ARRAY['Architecture', 'Distributed Systems', 'Security', 'Leadership', 'DevOps', 'Mentoring']),
  ('fullstack', 'mid', ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS']),
  ('data', 'junior', ARRAY['Python', 'SQL', 'Pandas', 'Statistics', 'Jupyter', 'Excel']),
  ('data', 'mid', ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics', 'Scikit-learn', 'Data Visualization']),
  ('product', 'any', ARRAY['Product Strategy', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management', 'Agile']);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for onboarding_sessions
CREATE POLICY "Users can manage their own sessions"
  ON public.onboarding_sessions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for onboarding_analytics
CREATE POLICY "Users can view their own analytics"
  ON public.onboarding_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
  ON public.onboarding_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Authenticated users can view jobs"
  ON public.jobs FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policies for applications
CREATE POLICY "Users can manage their own applications"
  ON public.applications FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for skill_suggestions
CREATE POLICY "Anyone can view skill suggestions"
  ON public.skill_suggestions FOR SELECT
  USING (true);

-- Functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate profile completeness
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

-- Triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_sessions_updated_at
  BEFORE UPDATE ON public.onboarding_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    preferred_name,
    full_name
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'preferred_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name'
  );

  -- Also create an onboarding session
  INSERT INTO public.onboarding_sessions (
    user_id,
    device_info,
    browser_info
  ) VALUES (
    new.id,
    new.raw_user_meta_data->'device_info',
    new.raw_user_meta_data->'browser_info'
  );

  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(current_status);
CREATE INDEX idx_user_profiles_experience ON public.user_profiles(years_experience);
CREATE INDEX idx_user_profiles_skills ON public.user_profiles USING GIN(skills);
CREATE INDEX idx_user_profiles_target_roles ON public.user_profiles USING GIN(target_roles);
CREATE INDEX idx_user_profiles_completeness ON public.user_profiles(profile_completeness);

CREATE INDEX idx_onboarding_sessions_user_id ON public.onboarding_sessions(user_id);
CREATE INDEX idx_onboarding_sessions_active ON public.onboarding_sessions(user_id) WHERE completed_at IS NULL;

CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(required_skills);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_remote ON public.jobs(remote_type);

CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Progressive user profiles with unlockable features based on completeness';
COMMENT ON TABLE public.onboarding_sessions IS 'Persistent onboarding state for recovery and analytics';
COMMENT ON COLUMN public.user_profiles.profile_completeness IS 'Calculated 0-100 score of profile completion';
COMMENT ON COLUMN public.user_profiles.features_unlocked IS 'Array of feature flags unlocked based on profile completeness';