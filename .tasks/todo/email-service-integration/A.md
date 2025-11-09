---
Task ID: A
Feature: Email Service Integration
Title: Set up SendGrid/AWS SES for Email Notifications
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: Medium
---

### Objective

Integrate a production-grade email service (SendGrid or AWS SES) to replace the placeholder email notification system currently implemented in the core-api.

### Context

The payment notification system (`services/core-api/src/utils/notifications.ts`) currently creates in-app notifications but doesn't send actual emails. This task will add real email sending capabilities for critical user notifications like payment failures and payment method expiration warnings.

### Files to Modify/Create

- `services/core-api/src/utils/notifications.ts` - Update with actual email sending
- `services/core-api/.env` - Add email service credentials
- `services/core-api/package.json` - Add email service SDK
- `docs/EMAIL_SETUP.md` - Document setup process

### Implementation Steps

1. **Choose Email Provider**:
   - Evaluate SendGrid vs AWS SES based on:
     - Cost (SendGrid: 100 emails/day free; AWS SES: $0.10/1000 emails)
     - Ease of setup
     - Deliverability features
   - Recommended: SendGrid for simplicity

2. **Set up SendGrid Account** (if chosen):
   - Create SendGrid account
   - Verify sender domain (getori.app)
   - Create API key with Mail Send permissions
   - Set up email templates for:
     - Payment failure
     - Payment method expiring
     - Welcome email (future use)

3. **Install Dependencies**:
   ```bash
   cd services/core-api
   pnpm add @sendgrid/mail
   ```

4. **Update Environment Variables**:
   Add to `services/core-api/.env`:
   ```env
   SENDGRID_API_KEY=your_api_key_here
   SENDGRID_FROM_EMAIL=notifications@getori.app
   SENDGRID_FROM_NAME=Ori Platform
   ```

5. **Update notifications.ts**:
   - Import SendGrid SDK
   - Create email client singleton
   - Update `sendNotification()` to actually send emails
   - Add HTML email templates inline or use SendGrid templates
   - Implement retry logic for failed sends
   - Add proper error logging

6. **Create Email Templates**:
   - Design HTML templates for payment notifications
   - Include branding (logo, colors from brand guidelines)
   - Add clear call-to-action buttons
   - Ensure mobile responsiveness

7. **Testing**:
   - Test payment failure email locally
   - Test payment method expiring email
   - Verify emails land in inbox (not spam)
   - Test error handling when SendGrid is unavailable

8. **Documentation**:
   - Create `docs/EMAIL_SETUP.md` with:
     - How to set up SendGrid account
     - How to configure environment variables
     - How to test emails locally
     - Troubleshooting guide

### Acceptance Criteria

- SendGrid (or AWS SES) is properly configured with verified domain
- Real emails are sent when payment failures occur
- Real emails are sent when payment methods expire
- Emails are well-designed and mobile-responsive
- Fallback behavior exists if email service is unavailable
- Documentation is complete and tested
- No emails are sent in test environment (use mock/sandbox mode)

### Technical Notes

- Use environment variable to toggle between real emails and mock mode
- Consider rate limiting to prevent email spam
- Log all email sends for monitoring
- Use SendGrid's dynamic templates feature for easier template updates
- Ensure compliance with email best practices (unsubscribe link, etc.)

### Estimated Effort

2-3 hours (including setup, implementation, and testing)
