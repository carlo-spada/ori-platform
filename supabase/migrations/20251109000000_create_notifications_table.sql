-- Create notifications table for tracking sent emails
-- Stores record of all notifications sent to users

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  -- Types: welcome, payment_failure, card_expiring, trial_ending, subscription_confirmation, recommendations, application_status
  subject TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  -- Statuses: pending, sent, failed, bounced, complained
  sent_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  -- Resend-specific fields
  resend_email_id TEXT,
  -- Reference to external event that triggered this notification
  triggered_by_event TEXT,
  -- For idempotency - prevent duplicate notifications
  idempotency_key TEXT UNIQUE,
  -- Metadata for debugging/analytics
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_idempotency_key ON public.notifications(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON public.notifications;
CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Only server can insert notifications (via service role)
CREATE POLICY "Service can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Only server can update notifications (via service role)
CREATE POLICY "Service can update notifications"
  ON public.notifications FOR UPDATE
  USING (true);

-- Users cannot delete notifications (data retention)
-- (no DELETE policy = default deny for users)

COMMENT ON TABLE public.notifications IS 'Tracks all email notifications sent to users, including delivery status and error information';
COMMENT ON COLUMN public.notifications.type IS 'Email type: welcome, payment_failure, card_expiring, trial_ending, subscription_confirmation, recommendations, application_status';
COMMENT ON COLUMN public.notifications.status IS 'Delivery status: pending, sent, failed, bounced, complained';
COMMENT ON COLUMN public.notifications.idempotency_key IS 'Unique key for idempotency - prevents duplicate notifications for same event';
COMMENT ON COLUMN public.notifications.resend_email_id IS 'ID returned by Resend API for tracking purposes';
COMMENT ON COLUMN public.notifications.triggered_by_event IS 'Name of the event that triggered this notification (e.g., checkout.session.completed)';
