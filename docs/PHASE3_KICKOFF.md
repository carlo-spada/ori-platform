# Phase 3: Resend MCP Email Integration - Kickoff Document

**Status**: 🚀 STARTING
**Phase Duration**: 2-3 weeks (60-80 hours)
**Target Date**: Complete by Week 7

## Executive Summary

Phase 3 will build comprehensive email notification infrastructure using **Resend MCP**, enabling the platform to send transactional and marketing emails triggered by Stripe webhooks, user actions, and scheduled jobs.

**Current State**: Placeholder code, no functional email sending
**Target State**: Production-ready email system with 7 email types and complete test coverage

## Phase 3 Breakdown

### 3.1: Email Test Infrastructure & Fixtures ✅ DONE
**Status**: Complete - 4 documentation files created
- `EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md` (comprehensive 1500+ line audit)
- `EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md` (implementation checklist)
- `EMAIL_NOTIFICATION_INDEX.md` (navigation guide)
- `RESEND_MCP_READINESS.md` (existing roadmap)

**Deliverables**:
- Complete audit of current email system
- Database schema designs (SQL ready to use)
- API endpoint specifications
- Resend email template documentation
- Implementation priorities

### 3.2: Database Schema & Migrations (Starting Now)
**Goal**: Create notification and preference tables
**Effort**: 4-6 hours
**Files to Create**:
- `supabase/migrations/TIMESTAMP_create_notifications_table.sql`
- `supabase/migrations/TIMESTAMP_create_notification_preferences_table.sql`
- `shared/types/src/index.ts` - Add notification types

**What We'll Build**:
```sql
-- notifications table (tracks sent emails)
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- notification_preferences table (user opt-ins)
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_failure_emails BOOLEAN DEFAULT true,
  card_expiring_emails BOOLEAN DEFAULT true,
  subscription_emails BOOLEAN DEFAULT true,
  recommendation_emails BOOLEAN DEFAULT true,
  application_status_emails BOOLEAN DEFAULT true,
  insight_emails BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3: Resend Email Service Layer
**Goal**: Implement email sending with Resend MCP
**Effort**: 8-10 hours
**Files to Create**:
- `services/core-api/src/lib/resend.ts` - Resend client wrapper
- `services/core-api/src/lib/email-templates.ts` - Email template generators

**Email Types to Implement** (7 total):
1. **Welcome Email** - New user signup
2. **Payment Failure Email** - Failed recurring charge
3. **Card Expiring Email** - Payment method expiring soon
4. **Trial Ending Email** - Subscription trial ending
5. **Subscription Confirmation Email** - Successful subscription
6. **Recommendations Email** - Weekly job recommendations
7. **Application Status Email** - Job application status updates

**Pattern**:
```typescript
// Resend integration
export async function sendWelcomeEmail(email: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: 'welcome@getori.app',
    to: email,
    subject: 'Welcome to Ori',
    html: generateWelcomeTemplate(name),
  });

  if (error) throw new Error(`Failed to send welcome email: ${error.message}`);
  return data;
}

// Track in database
await supabase.from('notifications').insert({
  user_id: userId,
  type: 'welcome',
  subject: 'Welcome to Ori',
  status: 'sent',
  sent_at: new Date(),
});
```

### 3.4: Webhook Integration
**Goal**: Trigger emails from Stripe webhooks
**Effort**: 6-8 hours
**Files to Modify**:
- `services/core-api/src/routes/payments.ts` (update webhook handlers)

**Webhook Triggers**:
- `checkout.session.completed` → Send subscription confirmation
- `customer.subscription.created` → Send subscription confirmation
- `invoice.payment_succeeded` → Update subscription status (optional notification)
- `invoice.payment_failed` → Send payment failure email + alert
- `customer.source.expiring` → Send card expiring alert

**Pattern**:
```typescript
// In payments.ts webhook handler
export async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  // 1. Update subscription in database
  await updateSubscriptionStatus(session.customer, session.subscription, 'active');

  // 2. Get user email
  const user = await getUserByStripeId(session.customer);

  // 3. Send confirmation email
  await sendSubscriptionConfirmationEmail(user.email, {
    plan: session.subscription.items.data[0].price.nickname,
    amount: session.amount_total / 100,
  });

  // 4. Track notification
  await trackNotification(user.id, 'subscription_confirmation', 'sent');

  return { success: true };
}
```

### 3.5: API Endpoints for Notification Management
**Goal**: Allow users to manage email preferences
**Effort**: 4-6 hours
**Endpoints to Create**:
- `GET /api/v1/notifications/preferences` - Get user preferences
- `PATCH /api/v1/notifications/preferences` - Update preferences
- `GET /api/v1/notifications` - List sent notifications
- `POST /api/v1/notifications/unsubscribe` - Unsubscribe link handling
- `POST /api/v1/notifications/test` - Send test email (dev only)

### 3.6: Frontend Integration
**Goal**: Connect UI to notification preference API
**Effort**: 4-6 hours
**Files to Modify**:
- `src/components/settings/NotificationSettings.tsx` - Save preferences
- `src/hooks/useNotifications.ts` - New hook for preference management

### 3.7: Comprehensive Test Suite
**Goal**: 100+ tests for email functionality
**Effort**: 12-16 hours
**Test Files to Create**:
- `services/core-api/src/routes/__tests__/emails.fixture.ts` - Email test fixtures
- `services/core-api/src/routes/__tests__/emails.sending.test.ts` - Email sending tests
- `services/core-api/src/routes/__tests__/emails.webhooks.test.ts` - Webhook → email tests
- `services/core-api/src/routes/__tests__/emails.preferences.test.ts` - Preference tests
- `services/core-api/src/routes/__tests__/emails.integration.test.ts` - End-to-end tests

**Test Coverage**:
- ✅ All 7 email types with proper rendering
- ✅ Resend MCP integration (mock)
- ✅ Email triggered by webhooks
- ✅ Notification tracking in database
- ✅ Preference management (CRUD)
- ✅ Unsubscribe handling
- ✅ Duplicate prevention
- ✅ Error recovery
- ✅ User journey scenarios

## Implementation Order (Recommended)

### Week 1: Foundation (20 hours)
1. **Day 1-2**: Database migrations (4 hours)
   - Create notifications table
   - Create preferences table
   - Add RLS policies
   - Add database fixtures to test-setup.ts

2. **Day 2-3**: Resend service layer (6 hours)
   - Set up Resend client
   - Create email template generators
   - Implement test fixtures

3. **Day 4**: Email sending tests (5 hours)
   - Test each email type rendering
   - Test Resend API integration
   - Test error handling

4. **Day 5**: API endpoints (5 hours)
   - GET/PATCH preferences endpoint
   - GET notifications endpoint
   - Unsubscribe endpoint

### Week 2: Integration (25 hours)
1. **Day 1-2**: Webhook integration (8 hours)
   - Update payment webhook handlers
   - Trigger emails from events
   - Track notifications

2. **Day 2-3**: Webhook tests (8 hours)
   - Test each webhook → email flow
   - Test database updates
   - Test error scenarios

3. **Day 4**: Frontend integration (5 hours)
   - Update NotificationSettings component
   - Create useNotifications hook
   - Connect to backend API

4. **Day 5**: Integration tests (4 hours)
   - End-to-end user flows
   - Preference persistence
   - Email delivery verification

### Week 3: Polish & Testing (15 hours)
1. **Day 1-2**: Additional test scenarios (6 hours)
   - Rate limiting
   - Duplicate prevention
   - Notification preferences enforcement

2. **Day 2-3**: Documentation (5 hours)
   - Email system architecture doc
   - Testing guide
   - Troubleshooting guide

3. **Day 4**: Monitoring & observability (3 hours)
   - Email delivery tracking
   - Error alerting
   - Analytics setup

4. **Day 5**: Final testing & polish (1 hour)
   - Full integration test
   - Manual testing
   - Code review

## Dependencies

### Required
- ✅ Stripe webhook infrastructure (Phase 2) - READY
- ✅ Database access (Supabase) - READY
- ✅ Test framework (Jest) - READY
- 🔲 Resend MCP server (external setup)

### Setup Required
```bash
# Environment variables needed
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@getori.app
RESEND_FROM_NAME="Ori Career Companion"

# Test environment
RESEND_API_KEY_TEST=re_test_xxx (for tests)
```

## Success Criteria

✅ **100% Test Coverage**
- 100+ tests created
- All email types tested
- All webhook flows tested
- All error scenarios covered

✅ **Production Readiness**
- Zero hardcoded email addresses
- Environment variable configuration
- Error logging and alerting
- Graceful degradation if service fails

✅ **User Features Working**
- Users can opt-in/out of email types
- Preference persistence
- Unsubscribe links work
- No duplicate emails

✅ **Documentation Complete**
- Email system architecture documented
- Testing patterns documented
- Troubleshooting guide created
- Integration guide for developers

## Key Files to Create

```
services/core-api/
├── src/
│   ├── lib/
│   │   ├── resend.ts (NEW - Resend client wrapper)
│   │   └── email-templates.ts (NEW - Email generators)
│   ├── routes/
│   │   ├── notifications.ts (NEW - Preference endpoints)
│   │   └── __tests__/
│   │       ├── emails.fixtures.ts (NEW)
│   │       ├── emails.sending.test.ts (NEW)
│   │       ├── emails.webhooks.test.ts (NEW)
│   │       ├── emails.preferences.test.ts (NEW)
│   │       └── emails.integration.test.ts (NEW)

supabase/
└── migrations/
    ├── TIMESTAMP_create_notifications_table.sql (NEW)
    └── TIMESTAMP_create_notification_preferences_table.sql (NEW)

src/
├── hooks/
│   └── useNotifications.ts (NEW)
└── components/
    └── settings/
        └── NotificationSettings.tsx (MODIFY)
```

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Resend API rate limits | Low | Medium | Implement queue, batch processing |
| Email deliverability issues | Medium | High | Test with real emails early, use Resend analytics |
| Database migration errors | Low | High | Test migrations thoroughly, have rollback plan |
| Missing email templates | Low | Medium | Create templates early, test rendering |
| Stripe webhook timing | Low | Medium | Implement retry logic, idempotent processing |

## Next Immediate Steps

1. ✅ Audit complete (Phase 3.1)
2. 🎯 **CREATE DATABASE MIGRATIONS** (Phase 3.2 - Starting Now!)
3. 📧 Create Resend service layer
4. ✉️ Implement email tests
5. 🔗 Integrate with webhooks
6. 🎨 Update frontend

---

**Ready to Begin Phase 3.2: Database Migrations**

The foundation is set. Next I'll create the database schema migrations and notification tables, then build out the Resend email service layer.

**Estimated Time for 3.2**: 4-6 hours
**Target**: Database tables + Resend client + Email test fixtures
