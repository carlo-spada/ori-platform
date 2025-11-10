---
Task ID: A
Feature: Production Email System with AI Automation
Title: Integrate Resend + React Email for Beautiful, AI-Powered Emails
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: High
---

### Objective

Implement a production-grade email system using Resend + React Email that supports:

- Beautiful, custom transactional emails
- Marketing and promotional campaigns
- AI-generated personalized content
- Automated workflows and drip campaigns

### Context

The current placeholder email system in `services/core-api/src/utils/notifications.ts` needs to be replaced with a production-ready solution. We're choosing **Resend** for its developer-first API, React Email integration, and excellent deliverability, combined with AI workflow automation for personalized campaigns.

### Technology Stack

**Email Infrastructure:**

- **Resend** - Email delivery API (transactional + marketing)
- **React Email** - Component-based email templates
- **n8n or Make.com** - AI workflow automation (Phase 2)
- **OpenAI/Anthropic API** - Content generation (Phase 2)

**Why Resend:**

- Clean, modern API perfect for Next.js/TypeScript
- Build emails with React components (maintainable, type-safe)
- 3,000 emails/month free, then $20/month for 50,000
- Excellent deliverability (built by former Postmark engineers)
- Webhook support for tracking opens, clicks, bounces
- Simple pricing with no hidden costs

### Files to Create/Modify

**Core API:**

- `services/core-api/src/emails/client.ts` - Resend client singleton
- `services/core-api/src/emails/utils.ts` - Email helpers and utilities
- `services/core-api/src/emails/templates/EarlyAccessWelcome.tsx` - React Email template
- `services/core-api/src/emails/templates/PaymentConfirmation.tsx` - React Email template
- `services/core-api/src/emails/templates/PaymentFailure.tsx` - React Email template
- `services/core-api/src/emails/templates/WeeklyInsights.tsx` - React Email template
- `services/core-api/src/routes/webhooks/resend.ts` - Email event webhooks
- `services/core-api/src/utils/notifications.ts` - Update to use Resend
- `services/core-api/package.json` - Add dependencies
- `services/core-api/.env` - Add Resend API key

**Documentation:**

- `docs/EMAIL_SYSTEM.md` - Complete email system documentation
- `docs/EMAIL_TEMPLATES.md` - Template design guide

### Implementation Steps

#### Phase 1: Core Email Infrastructure (Priority: High)

1. **Install Dependencies**:

   ```bash
   cd services/core-api
   pnpm add resend
   pnpm add react-email @react-email/components
   pnpm add -D @react-email/render
   ```

2. **Set up Resend Account**:
   - Create account at resend.com
   - Verify sender domain (getori.app)
   - Generate API key
   - Add webhook endpoint for email events

3. **Configure Environment Variables**:
   Add to `services/core-api/.env`:

   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=hello@getori.app
   RESEND_FROM_NAME=Ori
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

4. **Create Email Client** (`emails/client.ts`):

   ```typescript
   import { Resend } from 'resend'

   export const resend = new Resend(process.env.RESEND_API_KEY)

   export async function sendEmail(options: {
     to: string
     subject: string
     react: React.ReactElement
   }) {
     try {
       const { data, error } = await resend.emails.send({
         from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
         ...options,
       })

       if (error) throw error
       return { success: true, id: data?.id }
     } catch (error) {
       console.error('Email send failed:', error)
       return { success: false, error }
     }
   }
   ```

5. **Create React Email Templates**:

   **Early Access Welcome** (`templates/EarlyAccessWelcome.tsx`):

   ```tsx
   import {
     Html,
     Head,
     Body,
     Container,
     Heading,
     Text,
     Button,
     Hr,
     Img,
   } from '@react-email/components'

   interface EarlyAccessWelcomeProps {
     firstName?: string
     email: string
   }

   export default function EarlyAccessWelcome({
     firstName,
     email,
   }: EarlyAccessWelcomeProps) {
     return (
       <Html>
         <Head />
         <Body style={main}>
           <Container style={container}>
             <Img
               src="https://getori.app/logo.png"
               width="48"
               height="48"
               alt="Ori"
             />
             <Heading style={h1}>
               {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
             </Heading>
             <Text style={text}>
               You're now on the early access list for Ori, the AI-powered
               career companion.
             </Text>
             {/* Add gradient backgrounds, animations, beautiful design */}
           </Container>
         </Body>
       </Html>
     )
   }

   const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, sans-serif' }
   const container = { margin: '0 auto', padding: '20px 0 48px' }
   const h1 = { fontSize: '32px', fontWeight: '700', margin: '40px 0' }
   const text = { fontSize: '16px', lineHeight: '26px' }
   ```

   **Payment Failure** (`templates/PaymentFailure.tsx`)
   **Payment Confirmation** (`templates/PaymentConfirmation.tsx`)
   **Weekly Insights** (`templates/WeeklyInsights.tsx`)

6. **Update Notification System**:
   Modify `utils/notifications.ts` to use Resend:

   ```typescript
   import { sendEmail } from '../emails/client'
   import PaymentFailureEmail from '../emails/templates/PaymentFailure'

   export async function notifyPaymentFailure(user: User, amount: number) {
     // Create in-app notification (existing code)
     await supabase.from('notifications').insert(...)

     // Send email
     await sendEmail({
       to: user.email,
       subject: 'Payment Failed - Action Required',
       react: PaymentFailureEmail({ user, amount })
     })
   }
   ```

7. **Create Webhook Handler** (`routes/webhooks/resend.ts`):

   ```typescript
   import { Router } from 'express'
   import { Webhook } from 'resend'

   const router = Router()

   router.post('/resend', async (req, res) => {
     const webhook = new Webhook(process.env.RESEND_WEBHOOK_SECRET!)
     const payload = webhook.verify(req.body, req.headers)

     // Handle email events: delivered, opened, clicked, bounced
     switch (payload.type) {
       case 'email.delivered':
         // Log successful delivery
         break
       case 'email.bounced':
         // Handle bounce, mark email as invalid
         break
     }

     res.json({ received: true })
   })

   export default router
   ```

8. **Testing**:
   - Test early access welcome email
   - Test payment failure/confirmation emails
   - Verify deliverability (inbox, not spam)
   - Test webhook event handling
   - Create development mode (console.log emails instead of sending)

#### Phase 2: AI-Powered Automation (Priority: Medium)

9. **Set up n8n Workflow Automation**:
   - Self-host n8n or use n8n Cloud
   - Create workflows for:
     - Welcome email sequence (Day 0, Day 3, Day 7)
     - Inactive user re-engagement
     - Weekly career insights newsletter
     - Personalized skill recommendations

10. **AI Content Generation Integration**:

    ```typescript
    // Example: AI-generated weekly insights
    async function generateWeeklyInsights(user: User) {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: `Generate 3 personalized career insights for ${user.role}
                    interested in ${user.skills.join(', ')}`,
          },
        ],
      })

      return sendEmail({
        to: user.email,
        subject: 'Your Weekly Career Insights',
        react: WeeklyInsightsEmail({ insights: response.content }),
      })
    }
    ```

11. **Marketing Campaign Builder**:
    - Create UI for building email campaigns
    - Segment users by profile, activity, subscription tier
    - A/B test subject lines with AI
    - Schedule and automate sends

### Email Templates to Create

**Transactional:**

1. ✅ Early Access Welcome - Sent when user joins waitlist
2. ✅ Payment Confirmation - Sent after successful payment
3. ✅ Payment Failure - Sent when payment fails
4. Payment Method Expiring - Warning before card expires
5. Account Verification - Email confirmation link
6. Password Reset - Secure reset link

**Marketing/Promotional:** 7. ✅ Weekly Career Insights - AI-generated personalized tips 8. Launch Announcement - When platform goes live 9. New Feature Announcements - Product updates 10. Inactive User Re-engagement - Win back dormant users 11. Upgrade Prompts - Free → Plus → Premium 12. Referral Program - Share and earn rewards

### Acceptance Criteria

**Phase 1 (Core):**

- ✅ Resend account configured with verified domain
- ✅ React Email templates are beautiful, branded, mobile-responsive
- ✅ Early access emails send successfully
- ✅ Payment notification emails work (failure, confirmation)
- ✅ Webhook handler tracks email events
- ✅ Development mode prevents accidental emails
- ✅ Error handling and logging in place
- ✅ Documentation complete

**Phase 2 (AI Automation):**

- ✅ n8n workflows automate email sequences
- ✅ AI generates personalized email content
- ✅ Marketing campaigns can be scheduled and sent
- ✅ A/B testing implemented for subject lines
- ✅ User segmentation works correctly

### Technical Notes

- Use `RESEND_API_KEY` environment variable for all environments
- In development, set `NODE_ENV=development` to log emails instead of sending
- All email templates should use design system colors (globals.css variables)
- Include unsubscribe link in all marketing emails (required by law)
- Rate limit email sends to prevent abuse
- Log all email sends with user_id, email_id, status, timestamp
- Use Resend's batch send API for bulk emails (up to 100 recipients)
- Implement exponential backoff for failed sends

### Cost Estimation

**Resend Pricing:**

- Free tier: 3,000 emails/month
- Paid: $20/month for 50,000 emails
- Expected usage: ~5,000 emails/month initially

**n8n (optional):**

- Self-hosted: Free (Docker container)
- n8n Cloud: $20/month

**Total: $20-40/month** for production-grade email system with AI automation

### Estimated Effort

**Phase 1 (Core):** 4-6 hours

- Resend setup: 1 hour
- React Email templates: 2-3 hours
- Integration & testing: 1-2 hours

**Phase 2 (AI):** 6-8 hours

- n8n workflows: 3-4 hours
- AI content generation: 2-3 hours
- Testing & refinement: 1-2 hours

**Total: 10-14 hours** for complete implementation

### Success Metrics

- Email delivery rate: >99%
- Open rate: >25% (transactional), >20% (marketing)
- Click-through rate: >10%
- Bounce rate: <2%
- Spam complaints: <0.1%
- User engagement: 30% increase in feature adoption via email

### Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email)
- [Email Best Practices Guide](https://sendgrid.com/blog/email-best-practices/)
- [n8n Workflow Automation](https://n8n.io)
