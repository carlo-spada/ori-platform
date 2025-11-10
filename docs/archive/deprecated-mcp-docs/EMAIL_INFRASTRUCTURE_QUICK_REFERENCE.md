# Email & Notification Infrastructure - Quick Reference

## Current Status at a Glance

| Component | Status | Details |
|-----------|--------|---------|
| Email Sending | ❌ NOT IMPLEMENTED | Placeholder code only |
| Email Templates | ❌ NONE EXIST | 0 of 7 templates created |
| Database Tables | ❌ MISSING | notifications, notification_preferences |
| API Endpoints | ❌ NOT IMPLEMENTED | 5 endpoints needed |
| Environment Config | ⚠️ INCOMPLETE | RESEND_* vars documented but not configured |
| Stripe Webhooks | ✓ READY | Payment events receive hooks |
| Frontend UI | ✓ EXISTS | Settings component with toggles (no save) |
| Type Definitions | ✓ DEFINED | NotificationPreferences interface exists |

---

## Key Files Quick Links

**Backend (Email Logic)**:
- Primary: `/services/core-api/src/utils/notifications.ts` (119 lines, placeholder)
- Webhook: `/services/core-api/src/routes/payments.ts` (306 lines, partial)
- Config: `/services/core-api/.env.example` (95 lines)
- App: `/services/core-api/src/index.ts` (55 lines, has webhook middleware)

**Frontend (UI)**:
- Component: `/src/components/settings/NotificationSettings.tsx` (mock data)
- Page: `/src/app/app/settings/page.tsx` (renders component)
- Types: `/src/lib/types.ts` (lines 95-99)

**Documentation**:
- Full Plan: `/docs/RESEND_MCP_READINESS.md` (584 lines, comprehensive)
- This Audit: `/docs/EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md` (35 sections)

---

## What's NOT Working

### Email Sending
```typescript
// This is called from Stripe webhooks but DOESN'T SEND EMAIL
await sendPaymentFailureNotification(supabase, customerId)

// The function tries to insert to non-existent table
await supabase.from('notifications').insert({...})
// ↑ This table doesn't exist, so insert fails silently
```

### User Preferences
```typescript
// Frontend has toggles for:
newJobRecommendations = true
applicationStatusUpdates = true
insightsAndTips = true

// But there's nowhere to SAVE them!
// UI shows toggles with mock data only
```

### Email Templates
- No HTML email templates exist
- No plain text fallbacks
- 7 templates needed:
  1. Welcome email
  2. Payment failure alert
  3. Card expiring warning
  4. Subscription confirmation
  5. Job recommendations
  6. Application status updates
  7. Insights digest (optional)

---

## Where Emails Should Be Triggered

### 1. Stripe Webhooks (HOOKED BUT NOT SENDING)

**File**: `/services/core-api/src/routes/payments.ts` (Lines 141-306)

**Webhook Events**:
- `invoice.payment_failed` → Line 281: `sendPaymentFailureNotification()` called
- `customer.source.expiring` → Line 293: `sendPaymentMethodExpiringNotification()` called

**Current Problem**: Functions called but email never sent

### 2. User Signup (NOT HOOKED YET)

**Flow**:
```
User signup → Supabase Auth email confirmation → [MISSING HOOK]
                                                  sendWelcomeEmail()
```

**Where to Add**: Need backend hook for auth confirmation

### 3. Job Recommendations (NOT HOOKED YET)

**Location**: `/services/core-api/src/routes/` (need to find endpoint)

**Hook Needed**: When new recommendation generated, check user preference

### 4. Application Status Updates (NOT HOOKED YET)

**File**: `/services/core-api/src/routes/applications.ts`

**Hook Needed**: When status changes, send email if preference enabled

---

## Database Tables Needed

### Table 1: notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'payment', 'recommendation', 'application'
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

### Table 2: notification_preferences
```sql
-- Option A: Separate table
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  new_job_recommendations BOOLEAN DEFAULT TRUE,
  application_status_updates BOOLEAN DEFAULT TRUE,
  insights_and_tips BOOLEAN DEFAULT TRUE,
  email_frequency TEXT DEFAULT 'immediate'
);

-- Option B: Add to user_profiles as JSONB column
ALTER TABLE user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{...}';
```

### Table 3 (Optional): email_logs
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'sent', 'failed', 'bounced'
  resend_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT now()
);
```

---

## API Endpoints Needed

### GET /api/v1/notifications
Fetch user's in-app notifications with pagination and filtering

### PATCH /api/v1/notifications/:id/read
Mark single notification as read

### PATCH /api/v1/notifications/read-all
Mark all notifications as read

### GET /api/v1/notifications/preferences
Fetch user's email notification preferences (currently hardcoded in UI)

### PUT /api/v1/notifications/preferences
Save user's notification preference changes

**Implementation**: Create new file `/services/core-api/src/routes/notifications.ts`

---

## Environment Variables to Add

```env
# In .env and .env.example (services/core-api/)

RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@getori.app
RESEND_REPLY_TO=support@getori.app
```

**Get API Key**: https://resend.com/home → API Keys → Test API Key

---

## Stripe Integration Points

### Already Working
- Webhook endpoint: `POST /api/v1/payments/webhook`
- Signature verification: ✓
- Event routing: ✓
- Database updates: ✓
- User email lookup: ✓ (via Stripe customer → user profile → auth)

### NOT Working
- Email sending in response to webhooks
- Email templates
- Resend API calls

### Events Handled
1. `checkout.session.completed` - New subscription
2. `customer.subscription.created` - Subscription created
3. `customer.subscription.updated` - Plan changes
4. `customer.subscription.deleted` - Cancelled
5. `invoice.payment_succeeded` - Payment success
6. `invoice.payment_failed` - **Calls email function (but fails)**
7. `customer.source.expiring` - **Calls email function (but fails)**

---

## Email Delivery Flow (What Should Happen)

```
User Action
    ↓
Trigger Event (Stripe webhook, signup, recommendation, etc.)
    ↓
Check User Preference (if preference-based)
    ↓
Build Email (template + data)
    ↓
Call Resend API → Email sent
    ↓
Log to email_logs table (for tracking)
    ↓
Update notification record (optional)
```

---

## Frontend Preference Storage

### What Exists
- Component: `NotificationSettings.tsx` with toggles
- Types: `NotificationPreferences` interface
- Mock data: Hard-coded true values

### What's Missing
- GET endpoint to fetch user's actual preferences
- React hook to manage preference state
- Mutation/POST endpoint to save changes
- Toast notification on save
- Loading/error states

### How It Should Work
1. Load component
2. Call `useNotificationPreferences()` hook
3. Hook fetches from `GET /api/v1/notifications/preferences`
4. Display current values
5. User toggles preference
6. Call `saveMutation()` on click
7. POST to `PUT /api/v1/notifications/preferences`
8. Show success toast
9. Update local state

---

## Test Coverage Status

### Existing Tests
- Webhook signature validation: ✓
- Event structure: ✓
- Database updates: ✓ (documented in test comments)

### Missing Tests
- Email sending functions: ❌
- Email preferences logic: ❌
- Template rendering: ❌
- Stripe → email integration: ❌
- Resend API mocking: ❌

**Test Location**: `/services/core-api/src/routes/__tests__/`

---

## Effort Estimate to Implement

| Task | Hours | Notes |
|------|-------|-------|
| Resend MCP setup | 4-6 | API key, config, testing |
| Email service layer | 12-16 | Core email sending logic |
| API endpoints | 10-15 | CRUD for notifications |
| Database migrations | 4-6 | Create tables + RLS |
| Email templates | 8-12 | 7 templates × ~50-150 lines |
| Frontend integration | 10-15 | Hooks, component updates |
| Testing | 8-12 | Unit + integration tests |
| Documentation | 4-6 | Update docs + code comments |
| **TOTAL** | **60-80** | **2-3 weeks** |

---

## Priority Order for Implementation

### Phase 3 MVP (Must Have)
1. Create notification database tables
2. Implement Resend email service
3. Create payment failure/expiring card email templates
4. Update Stripe webhook handlers to send actual emails
5. Implement preferences API endpoints
6. Add preference UI save functionality

### Phase 3+ (Should Have)
7. Create welcome email on signup
8. Create job recommendation email trigger
9. Create application status update email

### Phase 3+ (Nice to Have)
10. Create email_logs table for tracking
11. Create insights/tips digest email
12. Add email preference frequency (daily/weekly/never)
13. Dashboard email notification history view

---

## Quick Checklist for Phase 3 Implementation

### Database
- [ ] Create notifications table migration
- [ ] Create notification_preferences table (or add to user_profiles)
- [ ] Add indexes for performance
- [ ] Add RLS policies
- [ ] Create email_logs table (optional)

### Backend
- [ ] Create email service layer (Resend integration)
- [ ] Rewrite notifications.ts with real implementation
- [ ] Create notifications.ts routes file
- [ ] Add email template files
- [ ] Update payments.ts webhook handlers
- [ ] Add email trigger to signup flow (optional)
- [ ] Add email trigger to recommendations (optional)
- [ ] Add email trigger to applications (optional)

### Frontend
- [ ] Create useNotificationPreferences hook
- [ ] Update NotificationSettings component
- [ ] Update settings page with preference loading
- [ ] Add success/error toasts
- [ ] Add loading states

### Testing
- [ ] Unit tests for email service
- [ ] Integration tests for Stripe → email
- [ ] Preference permission tests
- [ ] Component tests for settings UI

### Documentation
- [ ] Update API docs
- [ ] Document email template system
- [ ] Add environment variable guide
- [ ] Create email design guide

---

## Key Insights

1. **Greenfield Advantage**: Since nothing works yet, you can design it cleanly without refactoring
2. **No Blockers**: All dependencies (Stripe, auth, DB) are ready
3. **Test Framework**: Webhook tests already exist, just need email tests added
4. **User Emails Available**: Stripe customer records → user profiles → auth provides all emails needed
5. **Preferences UI Ready**: Frontend UI exists, just needs backend
6. **Payment Emails Are Priority**: 2 webhook handlers actively call email functions - these should work first

---

## Resources

- Resend Docs: https://resend.com/docs
- Stripe Webhook Events: https://stripe.com/docs/api/events
- Email Best Practices: https://mailtrap.io/blog/email-best-practices/
- HTML Email Templates: https://www.stripo.email/

---

**Last Updated**: November 10, 2025
**Document Version**: 1.0
**Related Documents**: 
- EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md (comprehensive)
- RESEND_MCP_READINESS.md (Phase 3 plan)
