-- Create notification_preferences table for user email opt-ins
-- Stores user preferences for which email types they want to receive

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Email type preferences (boolean opt-ins)
  payment_failure_emails BOOLEAN NOT NULL DEFAULT true,
  -- Critical: Payment failed, action required

  card_expiring_emails BOOLEAN NOT NULL DEFAULT true,
  -- Reminder: Payment method expiring soon

  trial_ending_emails BOOLEAN NOT NULL DEFAULT true,
  -- Reminder: Free trial ending soon

  subscription_emails BOOLEAN NOT NULL DEFAULT true,
  -- Informational: Subscription confirmation, upgrade/downgrade

  recommendation_emails BOOLEAN NOT NULL DEFAULT true,
  -- Marketing: Weekly job recommendations, insights

  application_status_emails BOOLEAN NOT NULL DEFAULT true,
  -- Informational: Job application status updates

  security_emails BOOLEAN NOT NULL DEFAULT true,
  -- Critical: Security alerts, login notifications (cannot be disabled)

  weekly_digest BOOLEAN NOT NULL DEFAULT false,
  -- Summary: Weekly digest of activity and recommendations

  unsubscribed BOOLEAN NOT NULL DEFAULT false,
  -- Global unsubscribe flag (from unsubscribe link)

  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  -- When user unsubscribed globally

  unsubscribe_token TEXT UNIQUE,
  -- Token for unsubscribe links

  metadata JSONB DEFAULT '{}',
  -- Additional preference data

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_unsubscribe_token ON public.notification_preferences(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_created_at ON public.notification_preferences(created_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER trigger_update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Generate unsubscribe token on insert
CREATE OR REPLACE FUNCTION generate_unsubscribe_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unsubscribe_token IS NULL THEN
    NEW.unsubscribe_token = encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_unsubscribe_token ON public.notification_preferences;
CREATE TRIGGER trigger_generate_unsubscribe_token
  BEFORE INSERT ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION generate_unsubscribe_token();

-- Enable Row Level Security
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own preferences
CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Service can insert preferences (for new users)
CREATE POLICY "Service can insert preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (true);

-- Only service can view via unsubscribe token (for unauthenticated unsubscribe links)
-- This is handled via service role in application code

COMMENT ON TABLE public.notification_preferences IS 'User email notification preferences - controls which email types they receive';
COMMENT ON COLUMN public.notification_preferences.payment_failure_emails IS 'Critical: Payment failed notification';
COMMENT ON COLUMN public.notification_preferences.card_expiring_emails IS 'Payment method expiration reminder';
COMMENT ON COLUMN public.notification_preferences.trial_ending_emails IS 'Trial ending reminder';
COMMENT ON COLUMN public.notification_preferences.subscription_emails IS 'Subscription confirmation and updates';
COMMENT ON COLUMN public.notification_preferences.recommendation_emails IS 'Job recommendations and insights';
COMMENT ON COLUMN public.notification_preferences.application_status_emails IS 'Job application status updates';
COMMENT ON COLUMN public.notification_preferences.security_emails IS 'Security alerts (cannot be disabled)';
COMMENT ON COLUMN public.notification_preferences.weekly_digest IS 'Weekly activity and recommendation summary';
COMMENT ON COLUMN public.notification_preferences.unsubscribed IS 'Global unsubscribe - user opted out of all emails';
COMMENT ON COLUMN public.notification_preferences.unsubscribe_token IS 'Token for unauthenticated unsubscribe links';
