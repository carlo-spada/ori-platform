# Resend MCP Readiness Assessment

**Status**: 🟡 YELLOW - Greenfield Implementation Required
**Readiness Score**: 2/5
**Priority**: HIGH - Critical for user engagement
**Effort for Phase 3**: 60-80 hours (2-3 weeks)

---

## Executive Summary

The email and notification system is currently a **greenfield implementation** - the infrastructure exists only as UI and placeholder code with zero actual email sending capability. This is an **opportunity** to build a production-ready system cleanly with Resend MCP from the ground up.

### Key Findings
- ❌ **No email sending capability** - notifications.ts is placeholder only
- ❌ **No email provider configured** - Resend/SendGrid/SES integration missing
- ✅ **Preferences UI exists** - But no backend persistence
- ✅ **Stripe webhook hooks ready** - Payment events can trigger emails
- ❌ **No templates** - Need to create 6+ email templates
- ❌ **Database tables missing** - notifications and preferences tables needed

### Recommendation
**Proceed with Phase 3.** Building email system from scratch is actually cleaner than migrating existing implementation. Resend MCP is ideal for this greenfield approach.

---

## Current Implementation Status

### Email Infrastructure: Status = NOT IMPLEMENTED

**Primary File**: `services/core-api/src/utils/notifications.ts`
- 119 lines of skeleton code
- Comments showing old SendGrid integration (removed, not active)
- Two functions exist but **don't actually send emails**:
  - `sendNotification()` - tries to save to non-existent DB table
  - `sendPaymentFailureNotification()` - called from Stripe webhooks
  - `sendPaymentMethodExpiringNotification()` - called from Stripe webhooks

**Problem**: All functions call `supabase.from('notifications').insert()` but the `notifications` table **doesn't exist** in migrations. This will fail silently.

### Email Provider Configuration: NOT CONFIGURED

**Environment Variables**: Missing entirely
- ❌ No `RESEND_API_KEY` in `.env` or `.env.example`
- ❌ No `RESEND_FROM_EMAIL` configured
- ❌ No other email provider configuration

**What's Needed** (Phase 3):
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@getori.app
RESEND_REPLY_TO=support@getori.app
```

### Email Templates: NONE EXIST

**Gap**: Zero email templates (HTML or plain text)

**Templates Needed** (Phase 3):
1. Welcome email (signup confirmation)
2. Payment failure alert
3. Payment method expiring warning
4. Subscription confirmation/receipt
5. Job recommendation notification
6. Application status update
7. Weekly insights digest

---

## User Journeys Requiring Email

### Journey 1: User Signup (Priority: HIGH)

**Current Flow**:
```
User signup → Supabase Auth email verification → Click link → Dashboard
```

**Current Issue**:
- Supabase sends confirmation email (Supabase-branded, not Ori-branded)
- No welcome email after confirmation
- Missing onboarding guidance via email

**What Needs to Happen** (Phase 3):
1. User confirms email with Supabase
2. Trigger event in backend
3. Send Ori-branded welcome email with:
   - Personalized greeting
   - Quick start guide
   - Features overview
   - CTA: Complete profile
4. Track email preference (always send, respects preferences later)

**File**: `src/app/signup/page.tsx` (Lines 50-98)
- Shows "Check your email" confirmation screen
- Needs backend hook to trigger welcome email

---

### Journey 2: Job Recommendations (Priority: HIGH)

**Current Flow**:
```
AI Engine generates recommendations → Frontend displays in dashboard
```

**Current Issue**:
- No external notification
- Users must log in to see recommendations
- Missing push/email engagement opportunity

**What Needs to Happen** (Phase 3):
1. Backend endpoint detects new recommendations (`/api/v1/chat` or recommendation routes)
2. Check user preference: `newJobRecommendations` (from settings)
3. If enabled, send email with:
   - Job preview (title, company, match score)
   - Why recommended (skills match, career fit)
   - CTA: View in app
4. Optional: Digest mode (daily/weekly) instead of individual

**File**: Frontend recommendation component
- Location: `src/components/recommendations/JobRecommendationCard.tsx`
- Backend endpoint: Needs exploration (likely `/api/v1/chat` or `/api/v1/jobs`)

**Preference**: User setting exists at `src/lib/types.ts:95` (`newJobRecommendations`)

---

### Journey 3: Application Status Updates (Priority: MEDIUM)

**Current Flow**:
```
User tracks applications in dashboard → Manual updates → Dashboard view
```

**Current Issue**:
- No external notification
- User must remember to check app
- Missed opportunity for engagement

**What Needs to Happen** (Phase 3):
1. Backend endpoint detects application status change
2. Check user preference: `applicationStatusUpdates`
3. If enabled, send email with:
   - Application status (interviewing, offer, rejected, etc.)
   - Next steps (what to do next)
   - Timeline (when to expect update)
   - CTA: View application details

**File**: `services/core-api/src/routes/applications.ts`
- Need to add email trigger on status change
- Preference: User setting exists at `src/lib/types.ts:96` (`applicationStatusUpdates`)

---

### Journey 4: Payment Events (Priority: HIGH - Partial)

**Current Flow**:
```
Stripe webhook → payments.ts webhook handler → Attempt to send notification
```

**Current Status**: 🟡 PARTIAL - Framework exists but email sending missing

**What's There**:
- Lines 267-282: `invoice.payment_failed` webhook handler
  - Calls `sendPaymentFailureNotification()`
  - Has access to user email via Stripe customer lookup
  - But email never actually sent

- Lines 293-305: `customer.source.expiring` webhook handler
  - Similar structure
  - Framework ready, implementation missing

**What Needs to Happen** (Phase 3):
1. Update `sendPaymentFailureNotification()` to use Resend MCP
2. Create payment failure email template
3. Add subscription confirmation email (new webhook event)
4. Add invoice/receipt email (on payment success)
5. Email sends automatically on Stripe webhook (not preference-based)

**File**: `services/core-api/src/routes/payments.ts`
- Lines 281: Payment failure notification call
- Lines 293: Payment method expiring notification call
- Both need implementation in notifications.ts

---

### Journey 5: Insights and Tips (Priority: LOW - Future)

**Current Flow**: Not implemented

**Current Status**: 🟡 UI exists, no backend

**What's There**:
- Frontend UI: `src/components/settings/NotificationSettings.tsx`
- Preference toggle: `insightsAndTips` (src/lib/types.ts:97)
- No backend implementation

**What Could Happen** (Phase 3 or later):
1. Scheduled job sends weekly/monthly insights
2. Personalized based on user profile
3. Career tips, market trends, skill recommendations
4. Optional: personalized from AI Engine

---

## Database Schema Gaps

### Missing Table 1: notifications

**Purpose**: Store in-app notifications

**Should Have**:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'payment', 'recommendation', 'application', 'general'
  read BOOLEAN DEFAULT FALSE,
  data JSONB, -- Additional context as JSON
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

**Why**: `notifications.ts` tries to save to this table but it doesn't exist

---

### Missing Table 2: notification_preferences

**Purpose**: Store user email notification preferences

**Should Have**:
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  new_job_recommendations BOOLEAN DEFAULT TRUE,
  application_status_updates BOOLEAN DEFAULT TRUE,
  insights_and_tips BOOLEAN DEFAULT TRUE,
  email_frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly', 'never'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Or**: Add to existing `user_profiles` table as JSONB column:
```sql
ALTER TABLE user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{
  "newJobRecommendations": true,
  "applicationStatusUpdates": true,
  "insightsAndTips": true,
  "emailFrequency": "immediate"
}'::jsonb;
```

**Why**: UI exists to set preferences, but nowhere to save them

---

### Optional Table 3: email_logs

**Purpose**: Track sent emails for debugging and compliance

**Should Have**:
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent', 'failed', 'bounced', 'complained'
  resend_id TEXT, -- Resend API response ID
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

**Why**: Helpful for debugging delivery issues, compliance, and analytics

---

## API Endpoints Needed (Phase 3)

### Current State: Missing entirely

**Endpoints to Create**:

1. **GET /api/v1/notifications**
   - Fetch user's in-app notifications
   - Pagination support
   - Filter by type/read status

2. **PATCH /api/v1/notifications/:id/read**
   - Mark single notification as read

3. **PATCH /api/v1/notifications/read-all**
   - Mark all notifications as read

4. **GET /api/v1/notifications/preferences**
   - Fetch user's email notification preferences

5. **PUT /api/v1/notifications/preferences**
   - Update user's email notification preferences
   - Validate preferences before saving

**Implementation Location**: `services/core-api/src/routes/notifications.ts` (new file)

---

## User Preference Settings Integration

### Frontend State: ✅ EXISTS (but not persistent)

**File**: `src/components/settings/NotificationSettings.tsx`
- Shows toggles for:
  - New job recommendations
  - Application status updates
  - Insights and tips
- Currently shows mock data

**File**: `src/lib/types.ts` (Lines 95-99)
```typescript
export interface NotificationPreferences {
  newJobRecommendations: boolean
  applicationStatusUpdates: boolean
  insightsAndTips: boolean
}
```

**Issue**: Settings page doesn't save preferences to backend

**What's Needed** (Phase 3):
1. Create API endpoint: `PUT /api/v1/notifications/preferences`
2. Add React Hook: `useSaveNotificationPreferences()`
3. Update component to call hook on toggle change
4. Add loading/error states
5. Show toast on successful save

**File to Update**: `src/app/app/settings/page.tsx`
- Add preference save logic
- May need to refetch preferences on load

---

## Integration Points Summary

### Current Integration Points

**1. Stripe Webhook Handler** (services/core-api/src/routes/payments.ts:267-305)
- ✅ Ready to trigger emails
- 🟡 Email functions exist but don't send
- Needs: Update `sendPaymentFailureNotification()` to use Resend

**2. User Settings** (src/components/settings/NotificationSettings.tsx)
- ✅ UI exists
- ❌ Save logic missing
- Needs: API endpoint + React hook

**3. Signup Flow** (src/app/signup/page.tsx)
- ✅ User confirms email
- ❌ Welcome email not triggered
- Needs: Backend hook to detect confirmation + send welcome

**4. Recommendations** (src/components/recommendations/JobRecommendationCard.tsx)
- ✅ Recommendations displayed
- ❌ Email trigger not implemented
- Needs: Backend endpoint to trigger email on new recommendation

**5. Applications** (services/core-api/src/routes/applications.ts)
- ✅ Application CRUD endpoints exist
- ❌ Email trigger not implemented
- Needs: Add email trigger on status change

---

## Files Requiring Changes (Phase 3)

### Backend Files (Core Implementation)

1. **REWRITE**: `services/core-api/src/utils/notifications.ts`
   - Replace placeholder with real Resend MCP integration
   - Add email sending functions
   - Add preference checking logic
   - ~150-200 lines of new code

2. **UPDATE**: `services/core-api/src/routes/payments.ts`
   - Lines 281, 293: Update to actually send emails
   - Add subscription confirmation email trigger
   - Add invoice/receipt email trigger
   - ~20-30 lines of changes

3. **CREATE**: `services/core-api/src/routes/notifications.ts`
   - New file for in-app notifications API
   - Endpoints: GET, PATCH /read, PUT /preferences
   - ~80-100 lines of new code

4. **CREATE**: `services/core-api/src/services/email.ts`
   - Email service layer using Resend MCP
   - Email sending logic with error handling
   - Template rendering
   - ~100-150 lines of new code

5. **UPDATE**: `services/core-api/.env.example`
   - Add RESEND_API_KEY
   - Add RESEND_FROM_EMAIL
   - Add email configuration options

### Frontend Files (UI Integration)

1. **UPDATE**: `src/components/settings/NotificationSettings.tsx`
   - Add mutation hook for saving preferences
   - Add loading/error states
   - Replace mock data with real API call
   - ~30-50 lines of changes

2. **UPDATE**: `src/app/app/settings/page.tsx`
   - Add preference loading on mount
   - Add save logic
   - ~15-25 lines of changes

3. **CREATE**: `src/hooks/useNotificationPreferences.ts`
   - Custom hook for fetching/saving preferences
   - ~30-40 lines of new code

### Database Files (Schema)

1. **CREATE**: `supabase/migrations/[timestamp]_add_notifications_tables.sql`
   - Create `notifications` table
   - Create `notification_preferences` table (or add to user_profiles)
   - Create indexes
   - Create RLS policies

### Email Templates (New)

Create in `services/core-api/src/templates/`:

1. `welcome-email.html` - Welcome on signup
2. `payment-failure-email.html` - Payment failed alert
3. `payment-expiring-email.html` - Card expiring warning
4. `subscription-confirmation-email.html` - Order confirmation
5. `job-recommendation-email.html` - New recommendations
6. `application-status-email.html` - Application update
7. `insights-digest-email.html` - Weekly tips (optional)

Each template: 50-150 lines of HTML

---

## Testing Gaps

### Current Tests: NONE

**What's Missing**:
- No tests for notification sending
- No tests for email preference logic
- No tests for Stripe webhook → email flow

**What's Needed** (Phase 3):
- Unit tests for email service
- Integration tests for webhook → email
- Tests for preference checking logic
- Mocked Resend API calls

**Location**: `services/core-api/src/routes/__tests__/`
- Create `notifications.test.ts`
- Update `payments.test.ts` to test email integration

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Missing notifications table | Medium | Create migration before Phase 3 |
| Email not sending silently | High | Add logging + monitoring |
| User preferences not respected | Medium | Add permission checks before sending |
| Email deliverability issues | High | Resend MCP handles this; monitor bounce rate |
| Template rendering errors | Medium | Test templates in Resend dashboard |
| Missing RLS policies | Medium | Add RLS on preferences table |

---

## Readiness Assessment

### Blockers: NONE ✅

- No breaking dependencies
- Can build independently
- Stripe webhook infrastructure ready
- User preference UI in place

### Prerequisites Met: YES ✅

- Supabase Auth working (user emails available)
- Stripe webhooks working (payment events available)
- Frontend settings UI exists
- Database ready for migrations

### Architecture Fit: EXCELLENT ✅

- Greenfield implementation is actually cleaner
- Resend MCP perfect for this use case
- Clean separation: service layer → routes → frontend hooks

---

## Recommendation

### Overall Readiness: 🟡 YELLOW (Greenfield - No Blockers)

**Proceed with Phase 3.** The lack of existing implementation is actually an **advantage** because we can design it cleanly from scratch without refactoring legacy code.

### Effort Estimate: 60-80 hours (2-3 weeks)

- Resend MCP setup: 4-6 hours
- Email service implementation: 12-16 hours
- API endpoints: 10-15 hours
- Database migrations: 4-6 hours
- Email templates: 8-12 hours
- Frontend integration: 10-15 hours
- Testing & validation: 8-12 hours
- Documentation: 4-6 hours

### Dependencies on Phase 1-2: NONE

- Email system is independent
- Could technically start in parallel with Phase 2
- Recommended: After Phase 2 for resource management

### Next Steps

1. ✅ Phase 1: Complete (you are here)
2. ➡️ Phase 2: Stripe MCP integration (Weeks 3-4)
3. ➡️ Phase 3: Resend MCP integration (Weeks 5-6)
   - Start with email service implementation
   - Create database tables
   - Implement Stripe payment email triggers
   - Add welcome email on signup
   - Add recommendation email trigger
   - Implement preferences API
   - Update frontend settings component

---

## Key Insights for Phase 3

**Build Cleanly**: Since email system is greenfield, this is opportunity to design it properly:
- Separate email service layer (reusable)
- Clean preference checking logic
- Easy to add new email types later
- Test-friendly architecture

**Leverage Existing**:
- Stripe webhooks already ready
- User emails available from Stripe/Auth
- Preference UI already designed
- Type definitions already created

**Focus on MVP First**:
- Payment emails (already have hooks)
- Welcome email on signup
- Recommendation emails
- Save preferences
- Later: Digest emails, advanced features

---

**Document Version**: 1.0
**Created**: November 2025 (Phase 1)
**Status**: Ready for Phase 3 Implementation
**Last Updated**: During Phase 1.1 Infrastructure Audit
