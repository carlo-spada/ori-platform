# MCP Refactoring Plan

**Status**: Planning Phase
**Priority**: High (Blocks Phase 3.4 completion)
**Last Updated**: November 9, 2025

## Executive Summary

This document outlines the refactoring needed to transition from direct API integrations (Stripe SDK, custom Resend HTTP wrapper) to proper MCP (Model Context Protocol) integrations. The change affects:

- **Phase 2**: Payment processing (currently using Stripe SDK directly)
- **Phase 3**: Email notifications (currently using custom HTTP wrapper)

**Key Principle**: Instead of backend directly calling service APIs, backend calls MCP servers which wrap service APIs. This provides:

- ✅ Better credential isolation (env vars to MCP server, not backend)
- ✅ Service abstraction (can swap implementations without changing backend)
- ✅ Testing capabilities (MCP provides mock/simulation modes)
- ✅ Consistency (same pattern across all external services)

## Current Architecture (Problematic)

```
Frontend → Core API → Stripe SDK → Stripe API
Frontend → Core API → Custom HTTP Wrapper → Resend API
```

**Issues**:

- API keys stored in backend environment
- Direct dependency on service SDKs
- No abstraction layer for testing
- Mock-based tests don't reflect real behavior

## Target Architecture (MCP-Based)

```
Frontend → Core API → Stripe MCP Server → Stripe API
Frontend → Core API → Resend MCP Server → Resend API
Frontend → Core API → PostgreSQL MCP Server → Supabase
```

**Benefits**:

- Credentials isolated in MCP server environment
- Backend agnostic to service implementation details
- MCP servers provide tool definitions (schema)
- Tests can use MCP mock/simulation modes
- Database access through MCP tool protocol

## Implementation Plan

### Phase 1: Resend MCP Integration (Phase 3 Email System)

**Why First**:

- Phase 3 is newest and least integrated with rest of system
- Email system is not yet critical path (notifications endpoints just created)
- Smaller scope than Stripe refactoring
- Will establish MCP pattern for Phase 2 to follow

#### 1.1 Create Resend MCP Client Service

**File**: `services/core-api/src/lib/resend-mcp.ts`

Replace the current custom HTTP wrapper with an MCP client:

```typescript
/**
 * Resend MCP Client
 *
 * Communicates with Resend MCP server via HTTP to send emails.
 * The MCP server handles Resend API credentials and HTTP details.
 */

import fetch from 'node-fetch'

interface MCPEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

interface MCPEmailResponse {
  id: string
  from: string
  to: string
  created_at: string
  status: 'sent' | 'failed'
  error?: string
}

class ResendMCPClient {
  private mcpServerUrl: string

  constructor() {
    // MCP server runs on fixed port when configured in .claude/mcp.json
    this.mcpServerUrl = process.env.RESEND_MCP_URL || 'http://localhost:3003'
  }

  /**
   * Call Resend MCP tool: send_email
   */
  async sendEmail(params: MCPEmailParams): Promise<MCPEmailResponse> {
    try {
      const response = await fetch(`${this.mcpServerUrl}/tools/send_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`MCP Error: ${response.statusText}`)
      }

      return response.json() as Promise<MCPEmailResponse>
    } catch (error) {
      console.error('Resend MCP call failed:', error)
      throw error
    }
  }

  /**
   * Get email delivery status (via MCP tool)
   */
  async getEmailStatus(emailId: string): Promise<{
    id: string
    status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'failed'
  }> {
    const response = await fetch(
      `${this.mcpServerUrl}/tools/get_email_status`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: emailId }),
      },
    )

    if (!response.ok) {
      throw new Error(`MCP Error: ${response.statusText}`)
    }

    return response.json()
  }
}

export const resendMCP = new ResendMCPClient()
```

**Changes from Current**:

- Remove direct Resend API calls
- Replace with MCP tool calls
- MCP server handles credential management
- Credentials NOT in backend env

#### 1.2 Create Email Template Service

**File**: `services/core-api/src/lib/email-templates.ts` (refactor from resend.ts)

Keep template functions separate from API client:

```typescript
/**
 * Email Template Generator
 *
 * Pure functions that generate HTML email templates.
 * Decoupled from API/MCP implementation.
 */

const brandColors = {
  primary: '#3b82f6',
  secondary: '#1f2937',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  // ... rest of colors
}

function generateWelcomeTemplate(name: string): string {
  // Same template HTML as current resend.ts
  return `...`
}

function generatePaymentFailureTemplate(
  name: string,
  amount: string,
  currency: string,
): string {
  // Same template HTML as current resend.ts
  return `...`
}

// ... other template functions

export const emailTemplates = {
  welcome: generateWelcomeTemplate,
  paymentFailure: generatePaymentFailureTemplate,
  cardExpiring: generateCardExpiringTemplate,
  trialEnding: generateTrialEndingTemplate,
  subscriptionConfirmation: generateSubscriptionConfirmationTemplate,
  recommendations: generateRecommendationsTemplate,
  applicationStatus: generateApplicationStatusTemplate,
}
```

#### 1.3 Create Email Service Abstraction

**File**: `services/core-api/src/services/email.service.ts`

Orchestrate templates + MCP client:

```typescript
/**
 * Email Service
 *
 * High-level interface for sending emails.
 * Combines templates + MCP client + database tracking.
 */

import { resendMCP } from '../lib/resend-mcp.js'
import { emailTemplates } from '../lib/email-templates.js'
import { supabase } from '../lib/supabase.js'

class EmailService {
  async sendWelcome(email: string, name: string): Promise<void> {
    const html = emailTemplates.welcome(name)

    const response = await resendMCP.sendEmail({
      to: email,
      subject: 'Welcome to Ori',
      html,
    })

    // Track in database
    await supabase.from('notifications').insert({
      user_id: null, // Handle lookup
      type: 'welcome',
      status: 'sent',
      resend_email_id: response.id,
    })
  }

  async sendPaymentFailure(
    email: string,
    name: string,
    amount: string,
    currency: string,
  ): Promise<void> {
    const html = emailTemplates.paymentFailure(name, amount, currency)

    const response = await resendMCP.sendEmail({
      to: email,
      subject: 'Payment Failed - Action Required',
      html,
    })

    // Track in database
    await supabase.from('notifications').insert({
      type: 'payment_failure',
      status: 'sent',
      resend_email_id: response.id,
    })
  }

  // ... other methods
}

export const emailService = new EmailService()
```

**Key Difference**: EmailService doesn't know about Resend API details - calls MCP client which knows.

#### 1.4 Update Notification Routes to Use MCP

**File**: `services/core-api/src/routes/notifications.ts`

Update routes to use emailService instead of direct Resend calls:

```typescript
import { emailService } from '../services/email.service.js'

// In route handlers, use:
await emailService.sendPaymentFailure(email, name, amount, currency)
// instead of:
// await resendClient.send({ ... })
```

#### 1.5 Create/Migrate Database Migrations

**Problem**: Migrations created but never executed.

**Action**:

```bash
# Execute migrations to create tables
supabase db push

# Verify tables exist
supabase db list-tables
```

#### 1.6 Update Tests to Use MCP

**Files**:

- `emails.sending.test.ts`
- `emails.webhooks.test.ts`
- `emails.preferences.test.ts`
- `emails.integration.test.ts`

**Pattern Change**:

```typescript
// Before (mock the custom HTTP wrapper):
jest.mock('../lib/resend', () => ({
  emailService: {
    sendWelcome: jest.fn().mockResolvedValue({ id: 'test' }),
  },
}))

// After (mock the MCP client):
jest.mock('../lib/resend-mcp', () => ({
  resendMCP: {
    sendEmail: jest.fn().mockResolvedValue({
      id: 'test',
      status: 'sent',
    }),
  },
}))
```

### Phase 2: Stripe MCP Integration (Phase 2 Payment System)

**Why Second**:

- More complex (webhooks, subscriptions, customers)
- Currently deeply integrated throughout codebase
- Phase 1 establishes MCP pattern to follow
- Can run in parallel with Phase 1 once pattern is clear

#### 2.1 Create Stripe MCP Client Service

**File**: `services/core-api/src/lib/stripe-mcp.ts`

```typescript
/**
 * Stripe MCP Client
 *
 * Communicates with Stripe MCP server via HTTP to process payments.
 * MCP server handles Stripe API credentials.
 */

interface MCPCreateCustomerParams {
  email: string
  name: string
  metadata?: Record<string, string>
}

interface MCPCreateSubscriptionParams {
  customer_id: string
  price_id: string
  metadata?: Record<string, string>
}

class StripeMCPClient {
  private mcpServerUrl: string

  constructor() {
    this.mcpServerUrl = process.env.STRIPE_MCP_URL || 'http://localhost:3003'
  }

  /**
   * Call Stripe MCP tool: create_customer
   */
  async createCustomer(
    params: MCPCreateCustomerParams,
  ): Promise<{ id: string; email: string }> {
    const response = await fetch(`${this.mcpServerUrl}/tools/create_customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Stripe MCP Error: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Call Stripe MCP tool: create_subscription
   */
  async createSubscription(
    params: MCPCreateSubscriptionParams,
  ): Promise<{ id: string; customer_id: string; status: string }> {
    const response = await fetch(
      `${this.mcpServerUrl}/tools/create_subscription`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      },
    )

    if (!response.ok) {
      throw new Error(`Stripe MCP Error: ${response.statusText}`)
    }

    return response.json()
  }

  // ... other Stripe operations
}

export const stripeMCP = new StripeMCPClient()
```

#### 2.2 Refactor Payment Routes

**File**: `services/core-api/src/routes/payments.ts`

Replace all Stripe SDK calls with MCP client calls:

```typescript
// Before (direct SDK):
const customer = await stripe.customers.create({
  email: req.body.email,
  name: req.body.name,
})

// After (MCP):
const customer = await stripeMCP.createCustomer({
  email: req.body.email,
  name: req.body.name,
})
```

#### 2.3 Refactor Subscription Routes

**File**: `services/core-api/src/routes/subscriptions.ts`

Replace Stripe SDK calls with MCP client calls.

#### 2.4 Refactor Setup Intent Routes

**File**: `services/core-api/src/routes/setupIntent.ts`

Replace Stripe SDK calls with MCP client calls.

#### 2.5 Update Payment Tests

Replace Stripe SDK mocks with Stripe MCP mocks.

### Phase 3: Webhook Integration Refactoring

**Current Issue**: Webhooks exist but don't trigger emails because:

1. Email templates aren't called
2. Database tables don't exist
3. Webhook processing incomplete

#### 3.1 Implement Webhook Email Triggers

In payment webhook handler, trigger email sends:

```typescript
// When charge.failed webhook received
if (event.type === 'charge.failed') {
  const charge = event.data.object

  // Send payment failure email via MCP
  await emailService.sendPaymentFailure(
    customerEmail,
    customerName,
    charge.amount_captured,
    charge.currency,
  )
}
```

#### 3.2 Implement Resend Webhook Handler

When Resend sends webhook (bounce, complaint), update notification status:

```typescript
router.post('/webhooks/resend', async (req, res) => {
  const event = req.body

  if (event.type === 'email.bounced') {
    await supabase
      .from('notifications')
      .update({ status: 'bounced' })
      .eq('resend_email_id', event.data.email_id)
  }

  if (event.type === 'email.complained') {
    await supabase
      .from('notifications')
      .update({ status: 'complained' })
      .eq('resend_email_id', event.data.email_id)
  }

  res.json({ ok: true })
})
```

## Implementation Checklist

### Phase 1: Resend MCP (Week 1)

- [ ] Create `resend-mcp.ts` with MCP client
- [ ] Create `email-templates.ts` with template functions
- [ ] Create `email.service.ts` with service layer
- [ ] Update `notifications.ts` routes to use service
- [ ] Execute database migrations
- [ ] Update all 4 email test files with MCP mocks
- [ ] Test email sending end-to-end
- [ ] Commit: `refactor: migrate Phase 3 email system to Resend MCP`

### Phase 2: Stripe MCP (Week 2)

- [ ] Create `stripe-mcp.ts` with MCP client
- [ ] Refactor `payments.ts` routes to use MCP
- [ ] Refactor `subscriptions.ts` routes to use MCP
- [ ] Refactor `setupIntent.ts` routes to use MCP
- [ ] Update all 182 payment tests with Stripe MCP mocks
- [ ] Test payment flow end-to-end
- [ ] Commit: `refactor: migrate Phase 2 payment system to Stripe MCP`

### Phase 3: Webhook Integration (Week 3)

- [ ] Implement webhook email triggers
- [ ] Implement Resend webhook handler
- [ ] Update payment webhook handler
- [ ] Test complete flow: payment failure → webhook → email sent
- [ ] Commit: `feat: complete webhook-to-email integration with MCP`

### Validation & Testing

- [ ] All 134 email tests passing
- [ ] All 182 payment tests passing
- [ ] Email sending tested end-to-end
- [ ] Payment flow tested end-to-end
- [ ] Webhook integration tested
- [ ] No direct API calls in production code (only in MCP clients)

## File Deletions (After Refactoring)

Once refactored, these files can be removed:

- `services/core-api/src/lib/resend.ts` (replaced by resend-mcp.ts + email-templates.ts)
- `services/core-api/src/lib/stripe.ts` (replaced by stripe-mcp.ts)
- `services/core-api/src/lib/stripeHelpers.ts` (helper functions absorbed into stripe-mcp.ts)

## Environment Variables

After refactoring, environment variables should change:

**Before (problematic)**:

```env
RESEND_API_KEY=re_test_...        # Stored in backend
STRIPE_API_KEY=sk_test_...        # Stored in backend
STRIPE_WEBHOOK_SECRET=whsec_...   # Stored in backend
```

**After (secure)**:

```env
# Backend doesn't see these!
# MCP servers read from their own environment:
# - Resend MCP reads: RESEND_API_KEY
# - Stripe MCP reads: STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
# - PostgreSQL MCP reads: DATABASE_URL, READ_ONLY

# Backend only needs MCP server URLs:
RESEND_MCP_URL=http://localhost:3003
STRIPE_MCP_URL=http://localhost:3003
POSTGRES_MCP_URL=http://localhost:3003
```

## Success Criteria

**Phase 1 (Resend MCP)**:

- ✅ All email tests pass
- ✅ Email service only calls resendMCP
- ✅ No direct Resend API calls in production code
- ✅ resend.ts deleted or empty
- ✅ Database migrations executed and tables exist

**Phase 2 (Stripe MCP)**:

- ✅ All payment tests pass
- ✅ All subscription tests pass
- ✅ Payment routes only call stripeMCP
- ✅ No direct Stripe SDK calls in production code
- ✅ stripe.ts and stripeHelpers.ts deleted

**Phase 3 (Webhooks)**:

- ✅ Payment failure → email sent (end-to-end)
- ✅ Card expiring → email sent (end-to-end)
- ✅ Trial ending → email sent (end-to-end)
- ✅ Subscription confirmed → email sent (end-to-end)
- ✅ Resend webhook updates notification status

## Risk Assessment

### Low Risk

- Email template refactoring (pure functions)
- Creating MCP client wrappers

### Medium Risk

- Database migration execution (ensure backup first)
- Updating payment routes (critical path)
- Webhook integration (timing-sensitive)

### Mitigation

- Branch protection: test in dev branch, PR to main
- Gradual rollout: refactor one service at a time
- Comprehensive test coverage: 100% tests before merging
- Backup: export database before migrations

## Timeline

| Phase     | Scope                  | Effort        | Timeline    |
| --------- | ---------------------- | ------------- | ----------- |
| 1         | Resend MCP             | 8-12 hours    | 1 day       |
| 2         | Stripe MCP             | 16-20 hours   | 2 days      |
| 3         | Webhooks               | 8-12 hours    | 1 day       |
| **Total** | **Full MCP migration** | **~40 hours** | **~4 days** |

## References

- [MCP Setup Guide](../claude/mcp-setup-guide.md)
- [MCP Configuration](../.claude/mcp.json)
- [Stripe MCP Spec](https://modelcontextprotocol.io/docs/tools/stripe)
- [Resend MCP Spec](https://modelcontextprotocol.io/docs/tools/resend)
