# Email & Notification Infrastructure Documentation Index

**Generated**: November 10, 2025
**Status**: Comprehensive Audit Complete

---

## Documents Overview

### 1. EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md (24 KB)

**Comprehensive deep-dive into email/notification system**

- 15 major sections
- Current implementation status for each component
- Complete database schema designs
- Stripe webhook integration details
- Frontend component analysis
- User journey mappings
- Test coverage assessment
- Architecture & data flow diagrams
- Risk assessment and mitigations

**Best For**: Understanding the complete system, making architectural decisions, identifying all gaps

**Key Content**:

- Sections 1-7: Current state analysis
- Sections 8-9: User journeys and test setup
- Sections 10-13: Integration points and architecture
- Sections 14-15: Readiness assessment and file references

---

### 2. EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md (11 KB)

**Quick lookup guide for implementation**

- Status-at-a-glance table
- Key file quick links with line numbers
- What's NOT working (with code examples)
- Where emails should be triggered
- Database table SQL templates
- API endpoints list
- Environment variables needed
- Stripe integration checklist
- Effort estimates
- Priority implementation order
- Phase 3 checklist

**Best For**: Day-to-day reference during implementation, finding specific files, quick answers

**Key Content**:

- Components status table
- File locations with line numbers
- Database schema templates
- API endpoint list
- Quick checklists for implementation

---

### 3. RESEND_MCP_READINESS.md (17 KB - Pre-existing)

**Phase 3 implementation plan from earlier audit**

- Readiness assessment (2/5 score)
- Key findings
- Current implementation status
- User journeys requiring email
- Database schema gaps
- API endpoints needed
- Integration points summary
- Files requiring changes (prioritized)
- Testing gaps
- Risk mitigations
- Implementation effort (60-80 hours estimate)

**Best For**: Understanding what Phase 3 should accomplish, identifying dependencies

---

## Quick Navigation

### If You're...

**Building the Email Service**:

1. Start: EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md → Status table & Environment variables
2. Plan: RESEND_MCP_READINESS.md → Files requiring changes section
3. Implement: EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md → Email service files section

**Adding to Stripe Webhooks**:

1. Reference: EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md → Stripe Integration Points
2. Details: EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md → Section 6: Stripe Webhook Integration

**Creating Database Tables**:

1. Templates: EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md → Database Tables Needed
2. Context: EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md → Section 3: Database Schema Status

**Integrating Frontend**:

1. Overview: EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md → Frontend Preference Storage
2. Details: EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md → Section 7: Frontend Components

**Writing Tests**:

1. Gaps: EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md → Section 9: Test Setup
2. Plan: RESEND_MCP_READINESS.md → Testing Gaps section

---

## Key Findings Summary

### Current State

- Zero functional email/notification infrastructure
- Placeholder code in place (calls but doesn't send)
- Frontend UI exists with no backend
- Stripe webhooks ready but not delivering emails
- No database tables for notifications
- No email templates
- No email provider integration (Resend/SendGrid/SES)

### What Works

- Stripe webhook infrastructure (receiving events)
- Frontend UI for notification preferences
- Type definitions
- Test framework
- User email lookup via Stripe+Auth

### What's Missing

- Email service integration
- Email templates (7 needed)
- Database tables (2-3 missing)
- API endpoints (5 needed)
- Preference persistence
- Welcome/recommendation/status email triggers

### Blockers

None - can be built independently

### Timeline

60-80 hours (2-3 weeks) for full implementation

---

## File Locations Quick Reference

### Backend Files

| File                                            | Purpose                                  | Status                  |
| ----------------------------------------------- | ---------------------------------------- | ----------------------- |
| `/services/core-api/src/utils/notifications.ts` | Email/notification functions             | Placeholder (119 lines) |
| `/services/core-api/src/routes/payments.ts`     | Stripe webhooks with email hooks         | Partial (306 lines)     |
| `/services/core-api/src/routes/applications.ts` | App status updates (needs email trigger) | No email yet            |
| `/services/core-api/.env.example`               | Configuration template                   | Needs RESEND\_\* vars   |
| `/services/core-api/src/index.ts`               | App setup with webhook middleware        | Complete                |

### Frontend Files

| File                                                | Purpose            | Status                       |
| --------------------------------------------------- | ------------------ | ---------------------------- |
| `/src/components/settings/NotificationSettings.tsx` | Preference toggles | UI only, no save             |
| `/src/app/app/settings/page.tsx`                    | Settings page      | Component rendered, no hooks |
| `/src/lib/types.ts`                                 | Type definitions   | Complete (lines 95-99)       |

### Database Files

| File                    | Purpose         | Status                      |
| ----------------------- | --------------- | --------------------------- |
| `/supabase/migrations/` | Database schema | Missing notification tables |

### Test Files

| File                                                                | Purpose       | Status                                 |
| ------------------------------------------------------------------- | ------------- | -------------------------------------- |
| `/services/core-api/src/routes/__tests__/payments.webhooks.test.ts` | Webhook tests | 457 lines, documents expected behavior |

---

## Implementation Priority

### Phase 3 MVP (Minimum Viable Product)

1. Create `notifications` and `notification_preferences` tables
2. Implement Resend email service layer
3. Create payment failure & card expiring email templates
4. Update Stripe webhook handlers (lines 281, 293 in payments.ts)
5. Implement preference API endpoints
6. Add frontend preference save functionality

### Phase 3+ Extensions

7. Welcome email on signup
8. Job recommendation notifications
9. Application status update emails
10. Email logs table for compliance/debugging

### Future Enhancements

- Digest emails (daily/weekly aggregation)
- Advanced preference management
- Email preference frequency control
- Unsubscribe links and compliance

---

## Database Schema Summary

### Table 1: notifications (REQUIRED)

Stores in-app notification records

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'payment', 'recommendation', 'application'
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

### Table 2: notification_preferences (REQUIRED)

Stores user email notification preferences

Option A: Separate table

```sql
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  new_job_recommendations BOOLEAN DEFAULT TRUE,
  application_status_updates BOOLEAN DEFAULT TRUE,
  insights_and_tips BOOLEAN DEFAULT TRUE,
  email_frequency TEXT DEFAULT 'immediate'
);
```

Option B: Add to user_profiles

```sql
ALTER TABLE user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{"newJobRecommendations": true, ...}'::jsonb;
```

### Table 3: email_logs (OPTIONAL)

Tracks sent emails for debugging/compliance

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY,
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

All should be implemented in new file: `/services/core-api/src/routes/notifications.ts`

### Notification Management

- `GET /api/v1/notifications` - Fetch notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

### Preference Management

- `GET /api/v1/notifications/preferences` - Fetch user preferences
- `PUT /api/v1/notifications/preferences` - Update preferences

---

## Email Templates Needed

All should be created in: `/services/core-api/src/templates/`

1. `welcome-email.html` - Signup confirmation
2. `payment-failure-email.html` - Payment failed alert
3. `payment-expiring-email.html` - Card expiring warning
4. `subscription-confirmation-email.html` - Order receipt
5. `job-recommendation-email.html` - New recommendations
6. `application-status-email.html` - Application update
7. `insights-digest-email.html` - Weekly tips (optional)

Each: 50-150 lines of HTML with plain text fallback

---

## Environment Variables to Configure

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx        # From: https://resend.com/home → API Keys
RESEND_FROM_EMAIL=noreply@getori.app   # Sender address
RESEND_REPLY_TO=support@getori.app     # Reply-to address (optional)
```

---

## Test Coverage Checklist

### Unit Tests Needed

- [ ] Email service functions
- [ ] Preference checking logic
- [ ] Email template rendering
- [ ] API endpoint controllers

### Integration Tests Needed

- [ ] Stripe webhook → email flow
- [ ] Preference loading and saving
- [ ] Database constraint validation

### Component Tests Needed

- [ ] NotificationSettings component
- [ ] Preference toggle behavior
- [ ] Save/error states

### Mocking Needed

- [ ] Resend API calls
- [ ] Supabase database operations
- [ ] Stripe webhook events

---

## Key Code Locations

### Email Sending Hooks (Currently Not Sending)

**File**: `/services/core-api/src/routes/payments.ts`

Line 281:

```typescript
await sendPaymentFailureNotification(supabase, customerId)
```

Line 293:

```typescript
await sendPaymentMethodExpiringNotification(supabase, customerId)
```

Both need to call actual Resend API via new email service layer.

### Webhook Handler Template

Location: Lines 267-282 (payment_failed event) and 286-295 (source_expiring event)

Pattern:

```typescript
case 'invoice.payment_failed': {
  // ... get data ...
  await sendPaymentFailureNotification(supabase, customerId)
  break
}
```

---

## Implementation Effort Breakdown

| Task                  | Hours     | Week          | Notes                         |
| --------------------- | --------- | ------------- | ----------------------------- |
| Resend setup + config | 4-6       | 1             | API keys, env vars, testing   |
| Email service layer   | 12-16     | 1-2           | Core sending logic, templates |
| API endpoints         | 10-15     | 2             | CRUD for notifications        |
| Database migrations   | 4-6       | 1             | Create tables, RLS, indexes   |
| Email templates       | 8-12      | 1-2           | 7 templates, HTML + text      |
| Frontend integration  | 10-15     | 2             | Hooks, components, mutations  |
| Testing               | 8-12      | 2             | Unit + integration tests      |
| Documentation         | 4-6       | 1             | Update docs, comments         |
| **TOTAL**             | **60-80** | **2-3 weeks** | Parallel work possible        |

---

## Related Documentation

- **PHASE2_COMPLETION_SUMMARY.md** - Stripe integration completion
- **STRIPE_CODE_LOCATIONS.md** - Where Stripe code lives
- **STRIPE_INFRASTRUCTURE_AUDIT.md** - Stripe webhook details
- **API_ENDPOINTS.md** - API documentation template
- **DATABASE_SCHEMA.md** - Database design overview

---

## Getting Started

### For Quick Answers

Use **EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md** with Ctrl+F

### For Implementation

1. Read: **EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md** sections 1-3
2. Plan: **RESEND_MCP_READINESS.md** files section
3. Reference: **EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md** checklists

### For Architecture

Review: **EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md** section 13 (data flow diagram)

---

## Questions Answered by Document

### "What email functionality currently exists?"

→ EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md, Section 1

### "What's the database schema I need?"

→ EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md, Database Tables Needed

### "Where do I add the Resend integration?"

→ EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md, Section 12 (file summary)

### "What API endpoints do I need?"

→ EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md, API Endpoints Needed

### "How do Stripe webhooks trigger emails?"

→ EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md, Section 10 (email delivery triggers)

### "What frontend work is needed?"

→ EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md, Section 7

### "How long will this take?"

→ EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md, Effort Estimate Table

### "What's my implementation priority?"

→ EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md, Priority Order section

---

## Contact & Updates

**Audit Date**: November 10, 2025
**Audit Version**: 1.0
**Status**: Complete

All findings are current and accurate as of audit date. Will require updates after Phase 3 implementation.

---

**Next Step**: Begin Phase 3 implementation using the provided checklists and schema templates.
