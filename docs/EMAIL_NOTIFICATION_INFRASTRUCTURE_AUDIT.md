# Ori Platform: Email & Notification Infrastructure Overview

**Date**: November 10, 2025
**Status**: Greenfield Implementation Required
**Readiness**: 2/5 - No blockers, clean slate for implementation

---

## Executive Summary

The Ori Platform has **zero functional email/notification infrastructure** currently deployed. The system contains:
- Placeholder code for email sending (`sendNotification`, `sendPaymentFailureNotification`, `sendPaymentMethodExpiringNotification`)
- Stripe webhook hooks ready to trigger notifications (but no actual email delivery)
- Frontend UI for notification preferences (but no backend persistence)
- Missing database tables for storing notifications and preferences
- No email templates
- No email provider integration

This is actually a **greenfield opportunity** to build a clean, production-ready email system from scratch using Resend MCP.

---

## 1. Current Email/Notification Service Files

### Primary Implementation File
**Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/utils/notifications.ts`

**Status**: Placeholder only (119 lines)

**Functions Defined**:
```typescript
// 1. Generic notification sender (placeholder)
export async function sendNotification(
  supabase: SupabaseClient,
  userId: string,
  options: NotificationOptions,
): Promise<void>

// 2. Payment failure notification (called from Stripe webhooks)
export async function sendPaymentFailureNotification(
  supabase: SupabaseClient,
  customerId: string,
): Promise<void>

// 3. Payment method expiring notification (called from Stripe webhooks)
export async function sendPaymentMethodExpiringNotification(
  supabase: SupabaseClient,
  customerId: string,
): Promise<void>
```

**Current Behavior**:
- Attempts to insert into non-existent `notifications` table
- Has SendGrid code as comments (removed, legacy)
- Includes placeholder for email sending
- Logs to console instead of actually sending emails
- Called from Stripe webhook handler but doesn't deliver

**Interfaces Defined**:
```typescript
export interface NotificationOptions {
  to: string              // Email address
  subject: string         // Email subject line
  message: string         // Email message body
  type?: 'email' | 'in_app' | 'both'  // Delivery method
}
```

---

## 2. Environment Configuration

### File Location
`/Users/carlo/Desktop/Projects/ori-platform/services/core-api/.env.example`

### Current Email-Related Configuration
**MISSING**: All email provider configuration

### What Should Be Added
```env
# Resend Configuration (Phase 3)
RESEND_API_KEY=re_xxxxxxxxxxxxx        # Get from: https://resend.com/home → API Keys
RESEND_FROM_EMAIL=noreply@getori.app   # Sender email address
RESEND_REPLY_TO=support@getori.app     # Reply-to address (optional)
```

**Status in .env.example**: 
- Lines 81-83: Comments reference Resend MCP but values are placeholders
- These are listed under "MCP (Model Context Protocol) Configuration" section
- Marked as development-only for local testing

---

## 3. Database Schema Status

### Current Schema: INCOMPLETE

The application has **NO** notification-related tables created yet.

#### Missing Table 1: `notifications`

**Purpose**: Store in-app notifications for users

**Proposed Schema**:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'payment', 'recommendation', 'application', 'general'
  read BOOLEAN DEFAULT FALSE,
  data JSONB,          -- Additional context
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

**Status**: Referenced in code but table doesn't exist → will fail silently

#### Missing Table 2: `notification_preferences`

**Purpose**: Store user email notification preferences

**Proposed Schema** (Option A - Separate Table):
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  new_job_recommendations BOOLEAN DEFAULT TRUE,
  application_status_updates BOOLEAN DEFAULT TRUE,
  insights_and_tips BOOLEAN DEFAULT TRUE,
  email_frequency TEXT DEFAULT 'immediate',  -- 'immediate', 'daily', 'weekly', 'never'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Proposed Schema** (Option B - JSONB Column in user_profiles):
```sql
ALTER TABLE user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{
  "newJobRecommendations": true,
  "applicationStatusUpdates": true,
  "insightsAndTips": true,
  "emailFrequency": "immediate"
}'::jsonb;
```

**Status**: UI exists for preferences but no backend storage

#### Optional Table 3: `email_logs`

**Purpose**: Track sent emails for debugging and compliance

**Proposed Schema**:
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'sent', 'failed', 'bounced', 'complained'
  resend_id TEXT,        -- Resend API response ID
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

**Status**: Not created yet but useful for compliance/debugging

### Existing Related Tables

**user_profiles table** (currently has):
- `stripe_customer_id` - Links to Stripe for payment emails
- `stripe_subscription_id` - Tracks subscription status
- `subscription_status` - For subscription-related notifications

These provide the foundation for payment-related emails.

---

## 4. API Endpoints

### Current Status: NOT IMPLEMENTED

**Endpoints Needed** (Phase 3):

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

**Implementation Location**: 
- New file needed: `services/core-api/src/routes/notifications.ts`
- Updates needed: `services/core-api/src/routes/payments.ts` (email triggers)

---

## 5. Email Templates

### Current Status: NONE EXIST

**Email Templates Needed**:

1. **Welcome Email** (signup confirmation)
   - Personalized greeting
   - Quick start guide
   - Features overview
   - CTA: Complete profile

2. **Payment Failure Alert**
   - Alert about failed payment
   - How to update payment method
   - Next steps

3. **Payment Method Expiring Warning**
   - Card expiring soon notice
   - How to update payment information
   - Deadline information

4. **Subscription Confirmation/Receipt**
   - Order confirmation
   - Invoice/receipt details
   - Plan details

5. **Job Recommendation Notification**
   - Job preview (title, company, match score)
   - Why recommended (skills match, career fit)
   - CTA: View in app

6. **Application Status Update**
   - Application status change
   - Next steps
   - Timeline information

7. **Insights Digest** (optional/future)
   - Weekly career tips
   - Market trends
   - Skill recommendations

**Location**: Should be created in `services/core-api/src/templates/`

**Format**: HTML with fallback plain text (50-150 lines each)

---

## 6. Stripe Webhook Integration

### Current Status: PARTIAL - Framework ready, email sending missing

**Integration Points**:

File: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/payments.ts`

**Webhook Event Handlers** (Lines 141-306):

1. **checkout.session.completed** (Line 169)
   - Triggers after successful checkout
   - Currently: Updates subscription status
   - Could trigger: Subscription confirmation email

2. **customer.subscription.created** (Line 194)
   - New subscription created
   - Currently: Updates subscription status
   - Could trigger: Subscription welcome email

3. **customer.subscription.updated** (Line 214)
   - Subscription changed/plan upgraded
   - Currently: Updates subscription status
   - Could trigger: Plan change confirmation email

4. **customer.subscription.deleted** (Line 239)
   - Subscription cancelled
   - Currently: Marks as cancelled
   - Could trigger: Cancellation email with retention offer

5. **invoice.payment_succeeded** (Line 256)
   - Recurring payment succeeded
   - Currently: Logs only
   - Could trigger: Invoice/receipt email

6. **invoice.payment_failed** (Line 267) - ACTIVELY CALLED
   - Recurring payment failed
   - **Currently calls**: `sendPaymentFailureNotification()` (Line 281)
   - **Problem**: Email not actually sent (placeholder code)
   - **Should do**: Send payment failure alert email

7. **customer.source.expiring** (Line 286) - ACTIVELY CALLED
   - Payment method expiring soon
   - **Currently calls**: `sendPaymentMethodExpiringNotification()` (Line 293)
   - **Problem**: Email not actually sent (placeholder code)
   - **Should do**: Send expiration warning email

### Test Coverage

File: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/__tests__/payments.webhooks.test.ts`

**Current Tests**: 
- Webhook signature validation (Lines 394-432)
- Event structure validation (Lines 435-501)
- Database updates documentation (Lines 529-571)
- Payment failure notification test comment (Line 329-343)
- Payment method expiring notification test comment (Line 380-390)

**Status**: Tests document what *should* happen but don't test actual email sending

---

## 7. Frontend Notification Components

### Notification Preferences UI

**File**: `src/components/settings/NotificationSettings.tsx`

**Current Implementation**:
- Shows toggles for:
  - New job recommendations
  - Application status updates
  - Insights and tips
- Uses mock data
- No backend save functionality

**Status**: UI complete, backend integration missing

### Settings Page Integration

**File**: `src/app/app/settings/page.tsx`

**Status**: 
- Notification preferences component rendered
- No API integration for loading/saving preferences
- No loading/error states

### Type Definitions

**File**: `src/lib/types.ts` (Lines 95-99)

```typescript
export interface NotificationPreferences {
  newJobRecommendations: boolean
  applicationStatusUpdates: boolean
  insightsAndTips: boolean
}
```

**Status**: Types defined but not enforced with backend

---

## 8. User Journeys Requiring Email

### Journey 1: User Signup (Priority: HIGH)

**Current Flow**:
```
1. User signs up
2. Supabase Auth sends email verification (Supabase-branded)
3. User clicks confirmation link
4. Redirected to dashboard
```

**Missing**:
- Welcome email from Ori (after confirmation)
- Personalized onboarding guidance
- Feature overview

### Journey 2: Job Recommendations (Priority: HIGH)

**Current Flow**:
```
1. AI Engine generates recommendations
2. Frontend displays in dashboard
```

**Missing**:
- Email notification when new recommendations available
- Job preview in email
- CTA to view in app

**Integration Point**: 
- Recommendation endpoint (likely `/api/v1/chat` or `/api/v1/jobs`)
- User preference: `newJobRecommendations`

### Journey 3: Application Status Updates (Priority: MEDIUM)

**Current Flow**:
```
1. User updates application status
2. Status visible in dashboard
```

**Missing**:
- Email notification on status change
- Next steps guidance
- Timeline information

**Integration Point**:
- File: `services/core-api/src/routes/applications.ts`
- User preference: `applicationStatusUpdates`

### Journey 4: Payment Events (Priority: HIGH - Partially Implemented)

**Current Flow**:
```
1. Stripe event occurs (payment success/failure, card expiring)
2. Webhook sent to `/api/v1/payments/webhook`
3. Handler calls `sendPaymentFailureNotification()` or `sendPaymentMethodExpiringNotification()`
4. Notification function attempts to save to (non-existent) database table
5. Email: NEVER SENT
```

**Status**: Framework complete, email delivery missing

### Journey 5: Insights and Tips (Priority: LOW - Future)

**Current Flow**: Not implemented

**UI Exists**: Yes - preference toggle in settings

**What's Missing**:
- Scheduled job to send weekly/monthly emails
- Personalized content
- Optional AI Engine integration

---

## 9. Current Test Setup for Email

### Status: MINIMAL

**Files with Email-Related Tests**:

1. **payments.webhooks.test.ts** (457 lines)
   - Tests webhook signature validation
   - Tests event structure
   - Documents database updates needed
   - Comments about email notification (not tested)
   - No actual email sending tests

**Gap**: 
- No unit tests for `sendNotification()`
- No integration tests for Stripe → email flow
- No preference checking logic tests
- No email template rendering tests

**What's Needed**:
- Tests for email service functions
- Mocked Resend API calls
- Integration tests for webhook → email
- Preference permission tests

---

## 10. How Email Delivery Is Triggered

### Trigger Point 1: Stripe Webhooks (ACTIVE)

**Flow**:
```
Stripe Event → API POST to /api/v1/payments/webhook
  ↓ (signature verified)
Event Router (switch statement)
  ↓
Specific handler (e.g., invoice.payment_failed)
  ↓
sendPaymentFailureNotification(supabase, customerId)
  ↓
[MISSING] Email sending code
  ↓
Notification inserted to database (or fails silently)
```

**Events Sending Notifications**:
- `invoice.payment_failed` → Payment failure email
- `customer.source.expiring` → Card expiring email

### Trigger Point 2: User Signup (NOT YET IMPLEMENTED)

**Potential Flow**:
```
User confirms email → Backend detects confirmation (needs hook)
  ↓
sendWelcomeEmail(supabase, userId)
  ↓
[NOT IMPLEMENTED] Email sending code
```

### Trigger Point 3: Recommendations (NOT YET IMPLEMENTED)

**Potential Flow**:
```
New recommendation generated → Check user preference
  ↓
If enabled: sendRecommendationEmail(supabase, userId, recommendation)
  ↓
[NOT IMPLEMENTED] Email sending code
```

### Trigger Point 4: Application Status Update (NOT YET IMPLEMENTED)

**Potential Flow**:
```
User updates application status → Check user preference
  ↓
If enabled: sendApplicationStatusEmail(supabase, userId, application)
  ↓
[NOT IMPLEMENTED] Email sending code
```

---

## 11. Integration Points with Stripe

### Stripe Webhook Endpoint

**Path**: `POST /api/v1/payments/webhook`

**Raw Body Handling**: 
- Special middleware in `src/index.ts` (Lines 31-35)
- `express.raw({ type: 'application/json' })` applied before JSON parsing
- Required for Stripe signature verification

**Webhook Events Handled** (7 types):
1. `checkout.session.completed` - Initial subscription
2. `customer.subscription.created` - New subscription
3. `customer.subscription.updated` - Changes/upgrades
4. `customer.subscription.deleted` - Cancellation
5. `invoice.payment_succeeded` - Successful payment
6. `invoice.payment_failed` - Failed payment (sends notification)
7. `customer.source.expiring` - Card expiring (sends notification)

### Data Linkage

**Stripe Customer ↔ User Profile**:
- User profile has `stripe_customer_id` column
- Used to look up user when webhook received
- Used to fetch user email from Supabase auth

**Current Email Lookup**:
```typescript
// From sendPaymentFailureNotification()
const { data: profile } = await supabase
  .from('user_profiles')
  .select('user_id, full_name')
  .eq('stripe_customer_id', customerId)
  .single()

const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id)
// user.email is available here
```

---

## 12. Comprehensive File Summary

### Core API Files (Backend)

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| notifications.ts | `services/core-api/src/utils/` | Placeholder | Email/notification sending (non-functional) |
| payments.ts | `services/core-api/src/routes/` | Partial | Stripe webhooks with email hooks |
| .env.example | `services/core-api/` | Config | Environment variable template |
| index.ts | `services/core-api/src/` | Active | Express app setup with webhook middleware |
| payments.webhooks.test.ts | `services/core-api/src/routes/__tests__/` | Tests | Webhook event tests |

### Frontend Files

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| NotificationSettings.tsx | `src/components/settings/` | UI Only | Notification preference toggles |
| settings/page.tsx | `src/app/app/` | Partial | Settings page with notification component |
| types.ts | `src/lib/` | Defined | NotificationPreferences interface |

### Database Files

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| migrations/ | `supabase/migrations/` | Incomplete | Database schema (notifications table missing) |

### Documentation Files

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| RESEND_MCP_READINESS.md | `docs/` | Comprehensive | Phase 3 email implementation plan |

---

## 13. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                              │
│  NotificationSettings.tsx ──→ [Toggles for preferences]     │
│         ↑                                                    │
│    React Hook (MISSING)                                     │
│         ↓                                                    │
│  API Call to: PUT /api/v1/notifications/preferences         │
│         (ENDPOINT NOT IMPLEMENTED)                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
                   HTTP Request
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  CORE API (Express.js)                      │
│                                                              │
│  routes/notifications.ts (NOT CREATED)                      │
│    ├─ GET /notifications                                   │
│    ├─ PATCH /notifications/:id/read                        │
│    ├─ GET /notifications/preferences  (NOT IMPLEMENTED)    │
│    └─ PUT /notifications/preferences  (NOT IMPLEMENTED)    │
│                                                              │
│  routes/payments.ts (PARTIAL)                              │
│    ├─ Receives Stripe webhooks                             │
│    ├─ Calls sendPaymentFailureNotification()               │
│    └─ Calls sendPaymentMethodExpiringNotification()        │
│              ↓                                               │
│         utils/notifications.ts (PLACEHOLDER)               │
│         ├─ sendNotification()          [Doesn't send]      │
│         ├─ sendPaymentFailureNotification()                │
│         └─ sendPaymentMethodExpiringNotification()         │
│              ↓                                               │
│         [MISSING] Email Service                            │
│         (would call Resend API)                            │
│              ↓                                               │
│         Database Insert (notifications table MISSING)      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Supabase)                       │
│                                                              │
│  user_profiles ✓                                            │
│    ├─ stripe_customer_id                                   │
│    ├─ notification_preferences (MISSING)                   │
│                                                              │
│  notifications (MISSING TABLE)                             │
│  notification_preferences (MISSING TABLE)                  │
│  email_logs (OPTIONAL)                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              EMAIL SERVICE (NOT INTEGRATED)                 │
│                                                              │
│  Resend MCP (NOT CONNECTED)                                │
│    → Email sending                                         │
│    → Template rendering                                    │
│    → Delivery tracking                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. Readiness Assessment

### What's Complete ✓
- Stripe webhook infrastructure (receiving events)
- Frontend UI for notification preferences
- Type definitions for notifications
- Test framework for webhooks
- User email available from Supabase auth + Stripe

### What's Missing ❌
- Email service integration
- Email templates
- Database tables for notifications & preferences
- API endpoints for managing notifications
- Email sending logic
- Preference persistence
- Frontend preference save functionality
- Welcome/recommendation email triggers

### Blockers: NONE
- No blocking dependencies
- Can be built independently
- Clean greenfield opportunity

### Timeline Estimate: 60-80 hours
- Resend MCP setup: 4-6 hours
- Email service implementation: 12-16 hours
- API endpoints: 10-15 hours
- Database migrations: 4-6 hours
- Email templates: 8-12 hours
- Frontend integration: 10-15 hours
- Testing & validation: 8-12 hours
- Documentation: 4-6 hours

---

## 15. Key Files to Reference

**Absolute Paths**:
1. `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/utils/notifications.ts` - Primary placeholder
2. `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/payments.ts` - Stripe webhook integration
3. `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/.env.example` - Configuration template
4. `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/index.ts` - App setup with webhook middleware
5. `/Users/carlo/Desktop/Projects/ori-platform/docs/RESEND_MCP_READINESS.md` - Implementation roadmap
6. `/Users/carlo/Desktop/Projects/ori-platform/src/components/settings/NotificationSettings.tsx` - Frontend UI

---

## Summary

The Ori Platform has **zero functional email/notification infrastructure**. The code skeleton exists with:
- Placeholder notification functions that don't send emails
- Stripe webhook hooks ready to trigger notifications
- Frontend UI for preferences (no backend)
- Missing database tables and templates
- No email provider integration

This is a **greenfield opportunity** to build a clean system from scratch using Resend MCP, starting with payment notifications and expanding to recommendations and onboarding emails.

**Next Steps** (Phase 3):
1. Create notification database tables
2. Build email service layer with Resend MCP
3. Create email templates (payment, welcome, recommendations)
4. Implement API endpoints for notifications & preferences
5. Add Resend email triggers to Stripe webhook handlers
6. Integrate preference saving in frontend settings
7. Add welcome email to signup flow
8. Add recommendation email triggers

