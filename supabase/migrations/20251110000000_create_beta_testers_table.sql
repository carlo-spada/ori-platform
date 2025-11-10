-- Create beta_testers table for capturing early signup emails
CREATE TABLE IF NOT EXISTS public.beta_testers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  source TEXT DEFAULT 'signup', -- 'signup', 'login', 'landing', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_beta_testers_email ON public.beta_testers(email);
CREATE INDEX IF NOT EXISTS idx_beta_testers_created_at ON public.beta_testers(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.beta_testers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for beta signup form)
CREATE POLICY "Anyone can join beta waitlist"
  ON public.beta_testers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can view beta testers (service_role)
-- No SELECT policy for anon/authenticated users to protect privacy

-- Add comment
COMMENT ON TABLE public.beta_testers IS 'Stores email addresses of users interested in beta testing';
