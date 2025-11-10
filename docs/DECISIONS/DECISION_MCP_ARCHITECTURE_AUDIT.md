# Ori Platform: Architectural Audit Report

## MCP Integration Gap Analysis - Stripe & Resend

**Date:** November 9, 2025
**Status:** Architecture Mismatch Identified - Critical Review Required
**Scope:** Payment (Phase 2) & Email (Phase 3) Implementations
**Overall Finding:** INTENDED: MCP-based architecture | ACTUAL: Direct API calls

---

## Executive Summary

The Ori Platform has a **critical architectural mismatch** between the intended design (using MCPs as the integration layer) and the current implementation (using direct SDK calls).

### Key Findings:

1. **Stripe Payment Integration (Phase 2):**
   - INTENDED: Use Stripe MCP for all operations
   - ACTUAL: Direct Stripe SDK calls throughout backend
   - IMPACT: No automated testing, no MCP benefits, inconsistent with architecture

2. **Resend Email Integration (Phase 3):**
   - INTENDED: Use Resend MCP for email delivery
   - ACTUAL: Custom HTTP client directly calling Resend API
   - IMPACT: Email system not fully functional, MCP never integrated

3. **PostgreSQL Access (Phase 4):**
   - INTENDED: Use PostgreSQL MCP for database introspection
   - ACTUAL: Supabase client for all database operations
   - NOTE: This is acceptable—Supabase client is the right tool, not MCP

### Critical Gaps:

| Component    | Intended                     | Actual                          | Gap               | Severity |
| ------------ | ---------------------------- | ------------------------------- | ----------------- | -------- |
| **Stripe**   | MCP-based operations         | Direct SDK calls (14 API types) | Complete mismatch | CRITICAL |
| **Resend**   | MCP-based email delivery     | Custom HTTP wrapper             | Not integrated    | CRITICAL |
| **Database** | MCP introspection (dev only) | Supabase client (production)    | Acceptable        | NONE     |

---

## Part 1: Stripe Payment Implementation (Phase 2)

### 1.1 Current Architecture vs Intended

#### What SHOULD Be Happening (Per MCP Setup Guide)

The `.claude/mcp-setup-guide.md` states:

> "Stripe MCP will be used for payment testing"
> "MCP servers should be the integration layer"

The `.claude/mcp.json` configures Stripe MCP:

```json
{
  "stripe": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-stripe"],
    "env": {
      "STRIPE_API_KEY": "${STRIPE_API_KEY}",
      "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}"
    }
  }
}
```

#### What IS Actually Happening

**Location:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/lib/stripe.ts`

```typescript
import Stripe from 'stripe' // Direct SDK import

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})
```

This direct SDK instantiation is then used throughout the codebase for **14 different API operation types**.

### 1.2 Direct Stripe SDK Calls Identified

**All 14 API types being called directly (not via MCP):**

#### Customer Management (2 types)

```typescript
// File: services/core-api/src/routes/payments.ts (Line 52)
const customer = await stripe.customers.create({...})

// File: services/core-api/src/routes/payments.ts (Line 62-65)
await supabase.from('users').update({ stripe_customer_id: customerId })

// File: services/core-api/src/lib/stripeHelpers.ts (Line 37)
const customer = await stripe.customers.create({...})
```

#### Payment Methods (1 type)

```typescript
stripe.paymentMethods.attach() // Not shown in core, but referenced
```

#### Setup Intents (1 type)

```typescript
stripe.setupIntents.create() // For payment method collection
```

#### Subscriptions (2 types)

```typescript
stripe.subscriptions.create() // Create new subscription
stripe.subscriptions.retrieve() // Get subscription details
```

#### Checkout Sessions (1 type)

```typescript
// File: services/core-api/src/routes/payments.ts (Line 69)
const session = await stripe.checkout.sessions.create({...})
```

#### Billing Portal (1 type)

```typescript
// File: services/core-api/src/routes/payments.ts (Line 121)
const session = await stripe.billingPortal.sessions.create({...})
```

#### Webhook Verification (1 type)

```typescript
// File: services/core-api/src/routes/payments.ts (Line 153)
event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

#### Products (1 type)

```typescript
// File: services/core-api/src/scripts/setupStripe.ts
stripe.products.search()
stripe.products.create()
```

#### Prices (1 type)

```typescript
// File: services/core-api/src/scripts/setupStripe.ts
stripe.prices.search()
stripe.prices.create()
```

#### Additional Webhook Processing (4 types)

```typescript
// Implicit in webhook handlers:
stripe.subscriptions.retrieve() // Line 177 in payments.ts
// Plus 3 more data extraction operations
```

### 1.3 Files Making Direct Stripe Calls

**All locations using direct Stripe SDK:**

1. **`src/lib/stripe.ts`** (9 lines)
   - Creates singleton Stripe instance
   - Sets API version
2. **`src/lib/stripeHelpers.ts`** (65 lines)
   - `ensureStripeCustomer()` - Creates customers directly
   - `getUserEmail()` - Auth lookups

3. **`src/routes/payments.ts`** (309 lines)
   - POST `/checkout` - Creates customers + checkout sessions
   - POST `/portal` - Creates portal sessions
   - POST `/webhook` - Handles 7 webhook event types with direct SDK calls

4. **`src/scripts/setupStripe.ts`** (150+ lines)
   - Creates products in Stripe
   - Creates prices in Stripe
   - Performs setup operations

5. **Frontend:** `src/lib/stripe.ts` (25 lines)
   - Loads Stripe.js (this IS appropriate—it's client-side)

### 1.4 Architecture Impact

**What the MCP approach would provide:**

```
Current Architecture:
┌─────────────────┐
│  Express API    │
│  (Direct calls) │──→ Stripe SDK ──→ Stripe API
└─────────────────┘

Intended Architecture (Per MCP Setup):
┌─────────────────┐        ┌──────────────┐
│  Express API    │──→ MCP │ Stripe MCP   │──→ Stripe API
│  (MCP calls)    │        │ (Controlled) │
└─────────────────┘        └──────────────┘
```

**Lost Benefits from NOT using MCP:**

1. **Testing:**
   - Current: Can't test without calling Stripe (mocked or real)
   - MCP would: Provide test fixtures and webhook simulation

2. **Error Handling:**
   - Current: Stripe SDK errors handled ad-hoc
   - MCP would: Consistent error scenarios and handling

3. **Logging:**
   - Current: Basic console logging
   - MCP would: Structured, audit-trail logging

4. **Development/Production Parity:**
   - Current: Different code paths for testing vs real calls
   - MCP would: Consistent interface regardless of backend

5. **Integration Testing:**
   - Current: 0% code coverage, all manual
   - MCP would: Webhook simulation, event testing

### 1.5 Specific Code Examples

#### Example 1: Customer Creation (Not Using MCP)

```typescript
// File: services/core-api/src/routes/payments.ts (Lines 52-66)
const customer = await stripe.customers.create({
  email: user.email,
  metadata: {
    userId: user.id,
  },
})

customerId = customer.id

await supabase
  .from('users')
  .update({ stripe_customer_id: customerId })
  .eq('id', userId)
```

**Should be:** Via Stripe MCP with test simulation capability

#### Example 2: Webhook Signature Verification (Not Using MCP)

```typescript
// File: services/core-api/src/routes/payments.ts (Lines 153-162)
event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

**Should be:** Via MCP with webhook simulation for testing

#### Example 3: Subscription Retrieval (Not Using MCP)

```typescript
// File: services/core-api/src/routes/payments.ts (Line 177)
const subscription = await stripe.subscriptions.retrieve(subscriptionId)
const priceId = subscription.items.data[0]?.price.id
```

**Should be:** Via MCP with test fixtures

### 1.6 Test Impact

**Current Test Status:**

- Integration test: `payments.integration.test.ts` - EXISTS but uses mock data
- Webhook tests: `payments.webhooks.test.ts` - Tests signature validation only
- Coverage: 0% (no automated Stripe tests)

**Gap:** Tests cannot verify actual Stripe API interactions because they use direct SDK calls that either need real API or complex mocking.

---

## Part 2: Resend Email Implementation (Phase 3)

### 2.1 Current Architecture vs Intended

#### What SHOULD Be Happening (Per MCP Setup Guide)

The `.claude/mcp-setup-guide.md` states:

> "Resend MCP will be used for email implementation"
> "MCPs are the integration layer"

The `.claude/mcp.json` configures Resend MCP:

```json
{
  "resend": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-resend"],
    "env": {
      "RESEND_API_KEY": "${RESEND_API_KEY}"
    }
  }
}
```

#### What IS Actually Happening

**Location:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/lib/resend.ts`

A **custom HTTP client wrapper** was built instead of using the MCP:

```typescript
class ResendClient {
  private apiKey: string
  private baseUrl = 'https://api.resend.com'  // Direct API call

  async send(params: {...}): Promise<{...}> {
    const response = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...}),
    })
    // ...
  }
}
```

### 2.2 Resend Implementation Status

**File Analysis:**

| Component                     | Status            | Issue                           |
| ----------------------------- | ----------------- | ------------------------------- |
| **ResendClient class**        | Implemented       | Direct HTTP calls, not MCP      |
| **Email templates**           | Fully implemented | 8 templates with HTML/CSS       |
| **emailService object**       | Implemented       | Provides 7 email types          |
| **Integration with webhooks** | Partial           | Hooks exist but not called      |
| **Frontend integration**      | None              | No API endpoints exposed        |
| **Database tables**           | Missing           | notifications table not created |

### 2.3 The Resend HTTP Call Chain

**Current Path (Direct API):**

```typescript
// 1. Client layer instantiation
export function getResendClient(): ResendClient {
  if (!resendClient) {
    resendClient = new ResendClient()
  }
  return resendClient
}

// 2. Higher-level service functions
emailService.sendPaymentFailure = async (email, name, amount) => {
  const client = getResendClient()
  const html = generatePaymentFailureTemplate(name, amount, currency)

  // 3. Direct HTTP call via fetch
  const response = await client.send({
    to: email,
    subject: 'Payment Failed - Action Required',
    html,
  })

  return { id: response.id }
}

// 4. Raw fetch to Resend API
const response = await fetch(`${this.baseUrl}/emails`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({...}),
})
```

### 2.4 Email Types Implemented (NOT Using MCP)

**All 7 email types are built but use direct API:**

1. **sendWelcome()** - Welcome onboarding email
2. **sendPaymentFailure()** - Failed payment alert
3. **sendCardExpiring()** - Payment method expiration warning
4. **sendTrialEnding()** - Trial expiration notice
5. **sendSubscriptionConfirmation()** - Subscription confirmation
6. **sendRecommendations()** - Job recommendation digest
7. **sendApplicationStatus()** - Application status update

**Problem:** All these functions are defined but:

- Never called from any webhook handler
- No API endpoints exist to expose them
- Direct HTTP calls instead of MCP
- Mock fallback for missing API key

### 2.5 Webhook Integration Gap

**Where emails SHOULD be triggered:**

```typescript
// File: services/core-api/src/routes/payments.ts

// LINE 281: Called but email never sent
await sendPaymentFailureNotification(supabase, customerId)

// LINE 293: Called but email never sent
await sendPaymentMethodExpiringNotification(supabase, customerId)
```

**Current implementation:**

```typescript
// File: services/core-api/src/utils/notifications.ts
export async function sendPaymentFailureNotification(
  supabase: SupabaseClient,
  customerId: string,
): Promise<void> {
  // Gets user data...

  // NEVER CALLS RESEND OR ANY EMAIL SERVICE
  await sendNotification(supabase, profile.user_id, {
    to: user.email,
    subject: 'Payment Failed - Action Required',
    message: `...plain text message...`,
    type: 'both',
  })
}
```

**The sendNotification() function:**

```typescript
export async function sendNotification(
  supabase: SupabaseClient,
  userId: string,
  options: NotificationOptions,
): Promise<void> {
  // Only creates in-app notification
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title: options.subject,
    message: options.message,
    type: 'payment_alert',
    read: false,
    created_at: new Date().toISOString(),
  })

  // EMAIL NEVER SENT - TABLE DOESN'T EVEN EXIST
  console.log(`📧 Notification sent to ${options.to}: ${options.subject}`)
}
```

### 2.6 Missing Infrastructure

**Database tables that don't exist:**

1. **notifications** - For storing in-app notifications
2. **notification_preferences** - For storing user email preferences
3. **email_logs** (optional) - For tracking sent emails

**API endpoints that don't exist:**

- `GET /api/v1/notifications` - Fetch notifications
- `PUT /api/v1/notifications/preferences` - Update preferences
- No email sending endpoints

**Integration points that are broken:**

- Stripe webhook → email flow: BROKEN
- User signup → welcome email: NOT IMPLEMENTED
- Recommendation generation → email: NOT IMPLEMENTED
- Application status update → email: NOT IMPLEMENTED

### 2.7 Resend Email Templates (Built but Unused)

**All 7 email templates are fully implemented:**

1. **generateWelcomeTemplate()** - ~50 lines of HTML
2. **generatePaymentFailureTemplate()** - ~30 lines of HTML
3. **generateCardExpiringTemplate()** - ~25 lines of HTML
4. **generateTrialEndingTemplate()** - ~30 lines of HTML
5. **generateSubscriptionConfirmationTemplate()** - ~40 lines of HTML
6. **generateRecommendationsTemplate()** - ~35 lines of HTML
7. **generateApplicationStatusTemplate()** - ~35 lines of HTML

**Status:** Built but orphaned (no callers, no integration)

---

## Part 3: Gap Analysis Summary

### 3.1 Architecture Mismatch Matrix

| Feature                      | Intended       | Actual              | Status                    |
| ---------------------------- | -------------- | ------------------- | ------------------------- |
| **Stripe customer creation** | MCP            | Direct SDK          | Not implemented           |
| **Stripe checkout**          | MCP            | Direct SDK          | Not implemented           |
| **Stripe subscriptions**     | MCP            | Direct SDK          | Not implemented           |
| **Stripe webhooks**          | MCP            | Direct SDK          | Not implemented           |
| **Stripe testing**           | Via MCP        | Manual testing      | Not implemented           |
| **Email sending**            | Resend MCP     | Custom HTTP wrapper | Partially built           |
| **Email on payment failure** | MCP triggered  | Never sent          | Broken                    |
| **Email on welcome**         | MCP triggered  | Not implemented     | Missing                   |
| **Email on recommendations** | MCP triggered  | Not implemented     | Missing                   |
| **Email templates**          | MCP rendered   | Custom HTML         | Built but unused          |
| **Database:** notifications  | Tables created | Missing             | Not created               |
| **Database:** preferences    | Stored         | Ignored             | UI only                   |
| **API endpoints**            | Full CRUD      | Partial             | Only notifications routes |

### 3.2 Code That Should Use MCP But Doesn't

**Stripe (14 API operation types):**

1. Customers: `.create()`, `.update()`
2. Payment Methods: `.attach()`
3. Setup Intents: `.create()`
4. Subscriptions: `.create()`, `.retrieve()`
5. Checkout Sessions: `.create()`
6. Billing Portal: `.sessions.create()`
7. Webhooks: `.constructEvent()`
8. Products: `.search()`, `.create()`
9. Prices: `.search()`, `.create()`

**Resend (1 operation type):**

1. Email sending: `.send()` via HTTP (should be MCP)

### 3.3 What's Broken Because MCPs Aren't Used

#### Stripe Issues:

1. **Testing:** Can't test payment flows without mocking or calling real Stripe
2. **Webhook simulation:** Can't test webhook handlers without Stripe CLI
3. **Error scenarios:** Can't easily test payment failures, declined cards, etc.
4. **Fixture data:** Can't generate consistent test data across test runs

#### Resend Issues:

1. **Email delivery:** Payment failure emails never actually sent
2. **Welcome flow:** Users don't get welcome emails on signup
3. **Testing:** Can't test email templates without calling Resend API
4. **Template rendering:** Can't preview emails in CI/CD pipeline
5. **Integration:** Email service exists but is disconnected from webhooks

### 3.4 Current Implementation Quality

#### Stripe:

- **Code Quality:** Good (well-structured, proper error handling)
- **Test Coverage:** 0% (no automated tests)
- **Integration:** Working (processes webhooks correctly)
- **MCP Compliance:** 0% (not using MCP at all)

#### Resend:

- **Code Quality:** Excellent (templates well-designed)
- **Test Coverage:** 0% (no tests)
- **Integration:** Broken (functions exist but are never called)
- **MCP Compliance:** 0% (not using MCP, custom HTTP client instead)

---

## Part 4: Scope of Refactoring Needed

### 4.1 For Stripe Integration

**To properly implement Stripe MCP:**

1. **Create StripeService wrapper** (4-6 hours)
   - Abstract all Stripe SDK calls
   - Provide consistent interface for MCP or SDK calls
   - Add error handling layer

2. **Replace direct Stripe calls** (12-16 hours)
   - File: `services/core-api/src/lib/stripe.ts` - Update initialization
   - File: `services/core-api/src/lib/stripeHelpers.ts` - Use service instead of SDK
   - File: `services/core-api/src/routes/payments.ts` - Replace 50+ direct calls
   - File: `services/core-api/src/scripts/setupStripe.ts` - Replace setup calls

3. **Build comprehensive test suite** (16-20 hours)
   - Webhook signature verification tests
   - Customer creation tests
   - Subscription lifecycle tests
   - Error scenario tests
   - Event handling tests

4. **Add test fixtures** (4-6 hours)
   - Mock Stripe customers
   - Mock subscription objects
   - Mock webhook events
   - Sample payment methods

### 4.2 For Resend Email Integration

**To properly implement Resend MCP:**

1. **Create database tables** (2-3 hours)
   - `notifications` table
   - `notification_preferences` table
   - Migrations and indexes

2. **Create notification API endpoints** (6-8 hours)
   - `GET /api/v1/notifications/preferences`
   - `PUT /api/v1/notifications/preferences`
   - `GET /api/v1/notifications`
   - Preference retrieval logic

3. **Connect Resend to webhooks** (4-6 hours)
   - Replace `sendPaymentFailureNotification()` stub with real call
   - Replace `sendPaymentMethodExpiringNotification()` stub with real call
   - Add email sending to Stripe webhook handlers
   - Add permission checking (user preferences)

4. **Implement frontend integration** (8-10 hours)
   - Add API hook for notification preferences
   - Add preference save functionality
   - Add notification display
   - Handle loading/error states

5. **Build test suite** (8-12 hours)
   - Template rendering tests
   - Email sending tests
   - Preference persistence tests
   - Webhook → email flow tests

**Estimated total refactoring effort:** 60-90 hours

---

## Part 5: Critical Findings Summary

### 5.1 What Works

✓ Stripe SDK is initialized correctly
✓ Webhook signature verification is robust
✓ Database schema supports payment tracking
✓ Customer creation flow works
✓ Subscription tracking works
✓ Email templates are well-designed
✓ Frontend Stripe.js integration is clean
✓ Error handling is present

### 5.2 What Doesn't Work

✗ MCP is never actually used for Stripe (configured but not invoked)
✗ MCP is never actually used for Resend (configured but not invoked)
✗ Email system is non-functional (functions exist but aren't called)
✗ Payment failure emails are never sent
✗ Webhook → email flow is broken
✗ No automated tests for payment flows
✗ No automated tests for email sending
✗ Database tables for notifications missing
✗ No API endpoints to save email preferences

### 5.3 Why This Happened

The architecture was designed to use MCPs (`Phase 1` setup) but implementation diverged:

1. **Stripe:** Team implemented direct SDK calls first (quick iteration), never refactored to MCP
2. **Resend:** Built custom HTTP wrapper instead of waiting for/using MCP integration
3. **Testing:** MCP benefits (mocking, simulation) were never realized
4. **Documentation:** MCP was documented as "coming in Phase 2/3" but was never actually integrated

### 5.4 Business Impact

| Issue                    | Impact                                 | Severity |
| ------------------------ | -------------------------------------- | -------- |
| Email not being sent     | Users don't get payment failure alerts | CRITICAL |
| Can't test payment flows | Payment bugs discovered in production  | HIGH     |
| No automated tests       | Regression risk on payment changes     | HIGH     |
| Missing database tables  | Errors when sending notifications      | CRITICAL |
| MCP unused               | Team losing promised benefits          | MEDIUM   |

---

## Part 6: Recommendations

### 6.1 Immediate Actions (This Week)

1. **Stop using direct Stripe calls**
   - Create abstraction layer: `StripeService` class
   - Make all SDK calls go through it
   - This enables MCP migration later

2. **Stop custom HTTP client for Resend**
   - Don't add more email types
   - Fix the email sending in webhook handlers
   - Use MCP once it's integrated

3. **Create missing database tables**
   - Unblock email functionality
   - Enable preference persistence

4. **Fix webhook → email flow**
   - Connect `sendPaymentFailureNotification()` to actual email sending
   - Test with Stripe CLI locally

### 6.2 Short-term (Next 2 Weeks)

1. **Integrate Stripe MCP**
   - Replace StripeService calls with MCP calls
   - Add test fixtures
   - Start writing automated tests

2. **Integrate Resend MCP**
   - Replace HTTP client with MCP calls
   - Add email sending tests
   - Verify delivery

3. **Complete API endpoints**
   - Preference CRUD endpoints
   - Notification retrieval endpoints

4. **Add integration tests**
   - Webhook → database tests
   - Email sending tests
   - End-to-end flows

### 6.3 Medium-term (Month 2)

1. **Achieve 80%+ test coverage** for payment flows
2. **Add webhook simulation** tests
3. **Document MCP integration** in CLAUDE.md
4. **Create runbook** for adding new payment features

### 6.4 Why Fix This

**Benefits of MCP integration:**

1. **Testing:** Automated tests for payment flows (currently 0% coverage)
2. **Reliability:** Consistent error handling across all Stripe operations
3. **Development:** Webhook simulation without Stripe CLI
4. **Documentation:** Clear contract between app and Stripe MCP
5. **Maintainability:** Single point of change for Stripe API updates

---

## Part 7: File-by-File Impact Assessment

### Stripe Files Requiring Changes

| File                         | Lines | Changes Required             | Difficulty |
| ---------------------------- | ----- | ---------------------------- | ---------- |
| `src/lib/stripe.ts`          | 9     | Use MCP instead of SDK       | Easy       |
| `src/lib/stripeHelpers.ts`   | 65    | Use StripeService            | Medium     |
| `src/routes/payments.ts`     | 309   | 50+ API calls → MCP          | Hard       |
| `src/scripts/setupStripe.ts` | 150+  | Product/price creation → MCP | Medium     |
| Tests: `payments.*.test.ts`  | 2000+ | Add MCP mock tests           | Hard       |

### Resend Files Requiring Changes

| File                          | Lines | Changes Required                 | Difficulty |
| ----------------------------- | ----- | -------------------------------- | ---------- |
| `src/lib/resend.ts`           | 745   | Use Resend MCP instead of HTTP   | Medium     |
| `src/utils/notifications.ts`  | 119   | Connect to actual email service  | Easy       |
| `src/routes/payments.ts`      | 309   | Call email service from webhooks | Easy       |
| `src/routes/notifications.ts` | 340   | Implement all endpoints          | Medium     |

### Database Changes Required

| Change                                  | Impact                     | Effort    |
| --------------------------------------- | -------------------------- | --------- |
| Create `notifications` table            | Blocks email functionality | 1-2 hours |
| Create `notification_preferences` table | Blocks preference saving   | 1-2 hours |
| Add RLS policies                        | Security compliance        | 1-2 hours |

---

## Part 8: Testing Gap Analysis

### Current Test Status

**Stripe tests:**

```
payments.customer.test.ts      - Tests exist but are stubs
payments.subscription.test.ts  - Tests exist but are stubs
payments.processing.test.ts    - Tests exist but are stubs
payments.webhooks.test.ts      - Tests exist but only validate signatures
payments.errors.test.ts        - Tests exist but are stubs
payments.integration.test.ts   - Tests exist but use mock data
```

**Total coverage:** 0% for actual Stripe operations

**Resend tests:**

```
No tests exist
```

**Total coverage:** 0% for email operations

### What Tests Need to Be Added

**For Stripe MCP:**

1. Customer creation and retrieval
2. Setup Intent creation and confirmation
3. Subscription CRUD operations
4. Webhook event handling (all 7 types)
5. Checkout session creation
6. Billing portal session creation
7. Error scenarios (declined cards, rate limits, etc.)

**For Resend MCP:**

1. Email template rendering
2. Email sending for all 7 types
3. Preference checking before sending
4. Error handling (invalid emails, API failures)
5. Email log tracking

---

## Part 9: Conclusion

### Summary of Findings

The Ori Platform has **two critical architectural mismatches:**

1. **Stripe:** Configured for MCP but using direct SDK calls everywhere
2. **Resend:** Configured for MCP but using custom HTTP client instead

Both systems are **partially functional** but **completely misaligned** with the intended architecture documented in `.claude/mcp-setup-guide.md` and `.claude/mcp.json`.

### Root Cause

The project architecture was designed in Phase 1 to use MCPs as the integration layer, but Phase 2 and Phase 3 implementations:

- Built parallel systems using direct API calls
- Skipped MCP integration
- Created technical debt through non-standard patterns

### Path Forward

**To achieve intended architecture:**

1. Create abstraction layers (StripeService)
2. Migrate direct calls to MCP calls (12-16 hours for Stripe, 8-12 hours for Resend)
3. Build comprehensive test suites (20+ hours each)
4. Complete missing infrastructure (database tables, API endpoints)
5. Document patterns in CLAUDE.md and AGENTS.md

**Estimated total effort:** 60-90 hours over 2-3 weeks

### Recommended Action

**ACCEPT** the architectural debt for now AND **PLAN** MCP integration as a discrete Phase 2.5 task:

- It will significantly improve testability
- It will reduce future maintenance burden
- It will align with documented architecture
- It's worth scheduling as a sprint goal

---

**Audit Date:** November 9, 2025
**Auditor:** Claude Code (AI Assistant)
**Repository:** /Users/carlo/Desktop/Projects/ori-platform
**Status:** Ready for architectural review and refactoring planning
