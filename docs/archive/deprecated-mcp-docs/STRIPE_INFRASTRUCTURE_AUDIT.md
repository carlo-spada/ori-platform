# Ori Platform Stripe Payment System Integration Audit

**Date:** November 9, 2025
**Codebase Location:** `/Users/carlo/Desktop/Projects/ori-platform`
**Current Branch:** dev
**Report Purpose:** Infrastructure audit for Stripe MCP integration planning

---

## Executive Summary

The Ori Platform has a **partially implemented Stripe payment system** with basic subscription management. The implementation includes:

- **Direct Stripe API integration** via the `stripe` Node.js library (v16.12.0)
- **Frontend payment UI** using Stripe Elements and React Stripe.js (v5.3.0, v8.3.0)
- **Backend webhook handling** for subscription lifecycle events
- **Supabase integration** for storing Stripe customer IDs and subscription status
- **Setup scripts** for creating Stripe products and prices programmatically
- **~1,122 lines of Stripe-related code** across 9 files

**Current State:** The system works but has **no test coverage** and limited error handling. Webhook handling is incomplete and manual testing via Stripe dashboard is required.

**MCP Integration Readiness:** HIGH - The codebase is well-structured for MCP migration with clear separation of concerns and dependency injection patterns.

---

## File Inventory

### Total Stripe-Related Code: 1,122 Lines of Code (LOC)

| File Path                                        | Type         | LOC      | Purpose                                             |
| ------------------------------------------------ | ------------ | -------- | --------------------------------------------------- |
| `/src/lib/stripe.ts`                             | Frontend     | 29       | Stripe.js initialization and lazy loading           |
| `/services/core-api/src/lib/stripe.ts`           | Backend      | 72       | Stripe client initialization and plan configuration |
| `/services/core-api/src/lib/stripeHelpers.ts`    | Backend      | 81       | Customer creation and utility functions             |
| `/services/core-api/src/routes/payments.ts`      | Backend      | 308      | Checkout sessions, billing portal, webhooks         |
| `/src/integrations/api/payments.ts`              | Frontend API | 76       | API client for payment endpoints                    |
| `/src/components/payments/PaymentForm.tsx`       | Frontend UI  | 131      | React component for payment form                    |
| `/services/core-api/src/routes/setupIntent.ts`   | Backend      | 65       | Setup Intent creation for payment collection        |
| `/services/core-api/src/routes/subscriptions.ts` | Backend      | 99       | Subscription creation and management                |
| `/services/core-api/src/scripts/setupStripe.ts`  | Setup Script | 261      | Idempotent product/price setup                      |
| **Database Migration**                           | SQL          | 32 lines | Stripe fields in user_profiles table                |
| **Configuration Documentation**                  | Task         | Pending  | Webhook setup guide (see tasks)                     |

---

## Current Implementation Details

### 1. Frontend Stripe Configuration

**File:** `/src/lib/stripe.ts` (29 lines)

```typescript
// Client-side Stripe initialization with lazy loading
const getStripe = (): Promise<Stripe | null> => {
  // Only loads in browser, returns null on server
  if (_stripePromise) return _stripePromise

  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  _stripePromise = loadStripe(key)
  return _stripePromise
}

// Backward compatible export
export const stripePromise =
  typeof window !== 'undefined' ? getStripe() : Promise.resolve(null)
```

**Status:** ✅ IMPLEMENTED

- Lazy loads Stripe.js only in browser
- Properly handles SSR/build environments
- Configurable via environment variable

---

### 2. Backend Stripe Initialization

**File:** `/services/core-api/src/lib/stripe.ts` (72 lines)

```typescript
// Server-side Stripe client with API version pinning
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Plan definitions (embedded, not loaded from Stripe)
export const STRIPE_PLANS = {
  plus_monthly: { price: 500, interval: 'month' },
  plus_yearly: { price: 4800, interval: 'year' },
  premium_monthly: { price: 1000, interval: 'month' },
  premium_yearly: { price: 9600, interval: 'year' },
}
```

**Configuration:**

- API Version: `2024-06-20` (pinned)
- Plans: 2 tiers × 2 billing intervals = 4 price variations
- Plan pricing: $5/mo Plus, $48/yr Plus (20% discount), $10/mo Premium, $96/yr Premium

**Required Environment Variables:**

- `STRIPE_SECRET_KEY` - Server-side secret (sk_test_xxx for sandbox)
- `STRIPE_PRODUCT_PLUS_ID` - Created by setupStripe.ts
- `STRIPE_PRODUCT_PREMIUM_ID` - Created by setupStripe.ts
- `STRIPE_PRICE_PLUS_MONTHLY_ID` - Created by setupStripe.ts
- `STRIPE_PRICE_PLUS_YEARLY_ID` - Created by setupStripe.ts
- `STRIPE_PRICE_PREMIUM_MONTHLY_ID` - Created by setupStripe.ts
- `STRIPE_PRICE_PREMIUM_YEARLY_ID` - Created by setupStripe.ts
- `STRIPE_WEBHOOK_SECRET` - For webhook signature verification

**Status:** ✅ IMPLEMENTED

- Proper client initialization with error handling
- Typed plan configuration
- Helper functions for plan lookups

---

### 3. Helper Functions

**File:** `/services/core-api/src/lib/stripeHelpers.ts` (81 lines)

**Key Functions:**

1. **`ensureStripeCustomer(userId, email, fullName)`** - Creates or retrieves Stripe customer
   - Checks if Stripe customer ID exists in database
   - Creates new customer if needed
   - Stores customer ID in Supabase
   - Sets default subscription status to 'free'

2. **`getUserEmail(userId)`** - Fetches email from Supabase Auth
   - Uses admin API to get user by ID
   - Required for customer creation

**Status:** ✅ IMPLEMENTED

- Idempotent customer creation
- Database synchronization
- Error handling with descriptive messages

---

### 4. Payment Routes

**File:** `/services/core-api/src/routes/payments.ts` (308 lines)

**Implemented Endpoints:**

#### A. `POST /api/v1/payments/checkout` - Create Checkout Session

```typescript
// Body: { userId, priceId, successUrl, cancelUrl }
// Returns: { url: string }
```

**Flow:**

1. Validates user authorization
2. Fetches user from database
3. Creates/retrieves Stripe customer
4. Creates checkout session with subscription mode
5. Returns redirect URL

**Critical Detail:** This uses `checkout.sessions` which is a **one-time payment/subscription initiation** - different from the Setup Intent flow below.

#### B. `POST /api/v1/payments/portal` - Billing Portal Session

```typescript
// Body: { userId }
// Returns: { url: string }
```

**Flow:**

1. Validates user authorization
2. Retrieves Stripe customer ID
3. Creates billing portal session
4. Returns portal URL for subscription management

**Features:** Users can:

- Update payment methods
- View invoices
- Cancel subscriptions
- Change plans

#### C. `POST /api/v1/payments/webhook` - Stripe Webhook Handler (Raw Body, BEFORE express.json())

**Critical Implementation Detail:**

```typescript
// In index.ts - MUST be before express.json()
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhookRoutes,
)
app.use(express.json()) // ← Other routes get JSON middleware
```

**Webhook Signature Verification:**

```typescript
const event = stripe.webhooks.constructEvent(
  req.body, // Raw body (NOT parsed)
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

**Handled Events:**

| Event                           | Action                       | Database Impact                                              |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `checkout.session.completed`    | Session completed            | Updates subscription_id, subscription_status                 |
| `customer.subscription.created` | Subscription created         | Updates subscription_id, subscription_status                 |
| `customer.subscription.updated` | Plan change, renewal, etc.   | Updates subscription_status                                  |
| `customer.subscription.deleted` | User canceled                | Sets subscription_status='cancelled', clears subscription_id |
| `invoice.payment_succeeded`     | Recurring payment successful | Logged for analytics                                         |
| `invoice.payment_failed`        | Payment failed               | Updates subscription_status='past_due', sends notification   |
| `customer.source.expiring`      | Card expiring soon           | Sends notification                                           |

**Status:** ✅ PARTIALLY IMPLEMENTED

- Signature verification working
- Core subscription events handled
- Missing: invoices, payment intents, disputes
- Missing: Webhook delivery retry logic (handled server-side by Stripe)

---

### 5. Setup Intent Route

**File:** `/services/core-api/src/routes/setupIntent.ts` (65 lines)

**Purpose:** Create a Stripe Setup Intent for collecting payment methods without immediate charge

```typescript
POST /api/v1/setup-intent
Body: { planId: 'plus_monthly' | 'plus_yearly' | 'premium_monthly' | 'premium_yearly' }
Returns: { clientSecret: string, setupIntentId: string }
```

**Flow:**

1. Validates authentication
2. Gets user email
3. Ensures Stripe customer exists
4. Creates Setup Intent with card payment method type
5. Returns client secret for frontend confirmation

**Status:** ✅ IMPLEMENTED

- Used by PaymentForm component
- Properly scoped metadata

---

### 6. Subscription Creation Route

**File:** `/services/core-api/src/routes/subscriptions.ts` (99 lines)

**Purpose:** Create subscription after payment method is confirmed

```typescript
POST /api/v1/subscriptions
Body: { planId: string, paymentMethodId: string }
Returns: { subscriptionId: string, status: string }
```

**Flow:**

1. Validates plan configuration
2. Ensures Stripe customer exists
3. Attaches payment method to customer
4. Sets as default payment method
5. Creates subscription with the price ID
6. Updates Supabase with subscription info
7. Returns subscription details

**Status:** ✅ IMPLEMENTED

- Full subscription creation logic
- Proper payment method attachment
- Database synchronization

---

### 7. Setup Script

**File:** `/services/core-api/src/scripts/setupStripe.ts` (261 lines)

**Purpose:** Idempotent product and price creation

**Run with:** `pnpm run setup:stripe`

**Features:**

- Searches for existing products by name
- Creates products if missing (Ori Plus, Ori Premium)
- Creates monthly and yearly prices
- 20% discount on yearly plans ($48/year, $96/year)
- Idempotent - safe to run multiple times
- Outputs environment variable configuration

**Example Output:**

```
STRIPE_PRODUCT_PLUS_ID=prod_xxxxx
STRIPE_PRICE_PLUS_MONTHLY_ID=price_xxxxx
STRIPE_PRICE_PLUS_YEARLY_ID=price_xxxxx
STRIPE_PRODUCT_PREMIUM_ID=prod_xxxxx
STRIPE_PRICE_PREMIUM_MONTHLY_ID=price_xxxxx
STRIPE_PRICE_PREMIUM_YEARLY_ID=price_xxxxx
```

**Status:** ✅ IMPLEMENTED

- Comprehensive product/price setup
- Idempotent (won't duplicate)
- Uses product metadata for tier identification

---

### 8. Frontend Payment Form

**File:** `/src/components/payments/PaymentForm.tsx` (131 lines)

**Purpose:** React component for collecting payment details using Stripe Elements

```typescript
<PaymentForm
  planId="plus_monthly"
  onSuccess={() => { /* redirect */ }}
  onCancel={() => { /* go back */ }}
/>
```

**Flow:**

1. Component mounts → Creates Setup Intent via API
2. Displays `PaymentElement` (Stripe's embedded payment form)
3. User submits → Confirms Setup Intent with payment details
4. Gets payment method ID from confirmation result
5. Calls `/api/subscriptions` with payment method
6. On success: toasts success and calls onSuccess callback
7. On error: toasts error and keeps form active

**State Management:**

- `clientSecret` - Setup Intent secret for payment confirmation
- `isLoading` - Initial setup
- `isProcessing` - Payment submission
- Proper loading skeleton with animated dots

**Status:** ✅ IMPLEMENTED

- Clean, modern UI with Tailwind
- Proper error handling with sonner toasts
- Loading states
- Disabled states during processing

---

### 9. API Client

**File:** `/src/integrations/api/payments.ts` (76 lines)

**Exposed Functions:**

1. **`createSetupIntent(planId: string)`**
   - POST `/api/v1/setup-intent`
   - Returns: `{ clientSecret, setupIntentId }`

2. **`createSubscription(planId: string, paymentMethodId: string)`**
   - POST `/api/v1/subscriptions`
   - Returns: `{ subscriptionId }`

**Status:** ✅ IMPLEMENTED

- Proper authentication header injection
- Error handling with descriptive messages
- Full type safety

---

### 10. Database Schema

**File:** `/supabase/migrations/20251108235959_add_stripe_fields_to_user_profiles.sql` (32 lines)

**Added Columns:**

```sql
-- Stripe customer ID (unique constraint for lookups)
stripe_customer_id TEXT UNIQUE

-- Stripe subscription ID (unique, null if no active subscription)
stripe_subscription_id TEXT UNIQUE

-- Subscription status (with CHECK constraint)
subscription_status TEXT DEFAULT 'free'
```

**Valid subscription_status values:**

- `free` - No subscription
- `plus_monthly` - Plus tier, monthly billing
- `plus_yearly` - Plus tier, yearly billing
- `premium_monthly` - Premium tier, monthly billing
- `premium_yearly` - Premium tier, yearly billing
- `past_due` - Payment failed
- `cancelled` - User cancelled

**Indexes:**

- `idx_user_profiles_stripe_customer_id` - Fast lookup by customer
- `idx_user_profiles_stripe_subscription_id` - Fast lookup by subscription
- `idx_user_profiles_subscription_status` - Analytics/segmentation

**Status:** ✅ IMPLEMENTED

- Proper constraints and indexes
- Clear documentation via COMMENTs

---

## Integration Points

### 1. Frontend to Backend

```
Frontend (src/)
├── PaymentForm.tsx (UI)
├── api/payments.ts (API client)
└── lib/stripe.ts (Stripe.js loader)
    ↓ (HTTPS REST)
Backend (services/core-api/src/)
├── routes/setupIntent.ts (POST /api/v1/setup-intent)
├── routes/subscriptions.ts (POST /api/v1/subscriptions)
├── routes/payments.ts (POST /api/v1/payments/checkout, /portal, /webhook)
├── lib/stripe.ts (Stripe client)
├── lib/stripeHelpers.ts (Helpers)
└── middleware/auth.ts (JWT validation)
    ↓ (Stripe API)
Stripe API (https://api.stripe.com)
    ↓ (Webhooks)
Backend Webhook Handler
    ↓
Supabase (Database updates)
```

### 2. Manual Stripe API Calls

**Direct Stripe API calls made:**

| Location              | API Method                               | Purpose                      |
| --------------------- | ---------------------------------------- | ---------------------------- |
| `stripeHelpers.ts:37` | `stripe.customers.create()`              | Create customer              |
| `payments.ts:52`      | `stripe.customers.create()`              | Create customer (legacy)     |
| `payments.ts:69`      | `stripe.checkout.sessions.create()`      | Create checkout session      |
| `payments.ts:121`     | `stripe.billingPortal.sessions.create()` | Create portal session        |
| `payments.ts:153`     | `stripe.webhooks.constructEvent()`       | Verify webhook signature     |
| `payments.ts:177`     | `stripe.subscriptions.retrieve()`        | Get subscription details     |
| `setupIntent.ts:45`   | `stripe.setupIntents.create()`           | Create setup intent          |
| `subscriptions.ts:57` | `stripe.paymentMethods.attach()`         | Attach payment method        |
| `subscriptions.ts:62` | `stripe.customers.update()`              | Set default payment method   |
| `subscriptions.ts:69` | `stripe.subscriptions.create()`          | Create subscription          |
| `setupStripe.ts:42`   | `stripe.products.search()`               | Search for existing products |
| `setupStripe.ts:52`   | `stripe.products.create()`               | Create product               |
| `setupStripe.ts:98`   | `stripe.prices.search()`                 | Search for existing prices   |
| `setupStripe.ts:110`  | `stripe.prices.create()`                 | Create price                 |

**All calls are:**

- Synchronous/async-awaited ✅
- Properly error handled ✅
- Database synchronized ✅
- Tested manually (NO automated tests) ❌

---

### 3. Webhook Processing

**Webhook signature verification location:**

```typescript
// services/core-api/src/routes/payments.ts:153
const event = stripe.webhooks.constructEvent(
  req.body, // Raw body (CRITICAL - must be raw!)
  sig, // From headers['stripe-signature']
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

**Critical requirement:**

- Webhook route MUST be registered before `express.json()`
- Raw body middleware applied: `express.raw({ type: 'application/json' })`
- This is properly implemented in `services/core-api/src/index.ts:31-35`

---

## Configuration

### Environment Variables Required

**Frontend (`.env.local`):**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # Public key
NEXT_PUBLIC_API_URL=http://localhost:3001         # API base URL
```

**Backend (`.env`):**

```env
STRIPE_SECRET_KEY=sk_test_xxxxx                   # Secret key
STRIPE_WEBHOOK_SECRET=whsec_xxxxx                 # Webhook signature key
STRIPE_PRODUCT_PLUS_ID=prod_xxxxx                 # Created by setupStripe
STRIPE_PRODUCT_PREMIUM_ID=prod_xxxxx              # Created by setupStripe
STRIPE_PRICE_PLUS_MONTHLY_ID=price_xxxxx         # Created by setupStripe
STRIPE_PRICE_PLUS_YEARLY_ID=price_xxxxx          # Created by setupStripe
STRIPE_PRICE_PREMIUM_MONTHLY_ID=price_xxxxx      # Created by setupStripe
STRIPE_PRICE_PREMIUM_YEARLY_ID=price_xxxxx       # Created by setupStripe
PORT=3001                                         # Server port
FRONTEND_URL=http://localhost:3000                # For webhooks
```

### Supported Environments

**Test/Development:**

- Using Stripe test keys (prefix: `pk_test_`, `sk_test_`)
- Stripe CLI for local webhook testing
- Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (decline)

**Production:**

- Using Stripe live keys (prefix: `pk_live_`, `sk_live_`)
- Webhook endpoint registered in Stripe dashboard
- HTTPS requirement enforced by Stripe

---

## Testing

### Current Test Coverage

**Status:** ❌ NO AUTOMATED TESTS

**Why?**

- No Jest/Vitest test files for payment routes
- No mock Stripe client
- No test fixtures
- No webhook simulation

**Testing Approach (Current):**

- Manual testing via Stripe Dashboard
- Manual testing with Stripe CLI (command line)
- Real Stripe API calls in development
- No CI/CD integration

---

### Missing Test Scenarios

**Critical test gaps:**

1. **Setup Intent Creation**
   - Create setup intent for different plans
   - Verify metadata is included
   - Handle missing plan ID

2. **Subscription Creation**
   - Successful subscription creation
   - Subscription with invalid plan
   - Subscription with invalid payment method
   - Payment method attachment

3. **Webhook Events**
   - Valid signature verification
   - Invalid signature rejection
   - Signature verification with wrong secret
   - Each event type (checkout.session.completed, etc.)
   - Event idempotency
   - Missing webhook secret

4. **Customer Management**
   - Customer creation
   - Duplicate customer handling
   - Customer lookup
   - Customer update

5. **Payment Methods**
   - Payment method attachment
   - Payment method detachment
   - Invalid payment method

6. **Error Handling**
   - Network errors
   - API rate limiting
   - Database errors during webhook processing
   - Stripe API errors

---

## Webhook Event Handling

### Implemented Webhook Events (7 total)

| Event                           | Status | Action                              |
| ------------------------------- | ------ | ----------------------------------- |
| `checkout.session.completed`    | ✅     | Update subscription from session    |
| `customer.subscription.created` | ✅     | Record new subscription             |
| `customer.subscription.updated` | ✅     | Handle plan changes, status updates |
| `customer.subscription.deleted` | ✅     | Mark as cancelled                   |
| `invoice.payment_succeeded`     | ⚠️     | Logged only (no DB update)          |
| `invoice.payment_failed`        | ✅     | Mark as past_due, send notification |
| `customer.source.expiring`      | ✅     | Send expiration notification        |

### Missing Webhook Events

**Should be implemented:**

- `invoice.created` - Track new invoices
- `invoice.finalized` - Invoice ready for payment
- `customer.deleted` - Handle account deletion
- `payment_intent.succeeded` - Track one-time payments
- `payment_intent.payment_failed` - Handle failed payments
- `charge.dispute.created` - Handle chargebacks
- `charge.refunded` - Track refunds

---

## Notifications

**File:** `/services/core-api/src/utils/notifications.ts` (119 lines)

**Implemented Functions:**

1. **`sendPaymentFailureNotification(supabase, customerId)`**
   - Triggered by `invoice.payment_failed` webhook
   - Looks up user by customer ID
   - Creates in-app notification
   - Prepared for email integration

2. **`sendPaymentMethodExpiringNotification(supabase, customerId)`**
   - Triggered by `customer.source.expiring` webhook
   - Looks up user by customer ID
   - Creates in-app notification
   - Prepared for email integration

**Status:** ⚠️ PARTIALLY IMPLEMENTED

- In-app notifications working
- Email integration ready (commented placeholder)
- Missing: SMS, Slack, webhook notifications

---

## Planned Features (From Tasks)

### Task 1: Stripe MCP Server Integration

**File:** `.tasks/todo/mcp-integration/1-stripe-mcp.md`

**Goal:** Replace direct Stripe API calls with MCP server

**Requirements:**

1. Set up Stripe MCP server in Claude Code environment
2. Create `StripeService` in `services/core-api/src/services/stripe.ts`
3. Refactor existing code to use StripeService
4. Add comprehensive test coverage
5. Use MCP for all Stripe interactions

**Acceptance Criteria:**

- MCP server configured
- StripeService created and encapsulates all Stripe logic
- All payment/subscription tests refactored to use StripeService
- Tests cover: customers, subscriptions, invoices, webhooks
- All manual testing replaced with programmatic tests

---

### Task 2: Stripe Webhook Documentation

**File:** `.tasks/todo/stripe-webhook-docs/A.md`

**Goal:** Create comprehensive webhook setup guide

**Deliverables:**

- `docs/STRIPE_WEBHOOK_SETUP.md` - Complete setup guide
- Local development setup with Stripe CLI
- Production setup instructions
- Testing guide with example commands
- Troubleshooting section
- Security best practices

---

## Code Quality Assessment

### Strengths

1. **Proper Separation of Concerns**
   - API clients in `src/integrations/api/`
   - Business logic in routes and helpers
   - Configuration in lib directory
   - Clear dependency injection

2. **Security**
   - Webhook signature verification ✅
   - Authentication middleware on all user routes ✅
   - Authorization checks (user can only access own data) ✅
   - No hardcoded secrets ✅

3. **Database Synchronization**
   - Stripe customer IDs stored in Supabase ✅
   - Subscription status tracked ✅
   - Indexes for performance ✅
   - Constraints for data integrity ✅

4. **Error Handling**
   - Try-catch blocks ✅
   - Descriptive error messages ✅
   - HTTP status codes ✅
   - Console logging ✅

5. **Configuration Management**
   - Environment variables for all secrets ✅
   - API version pinning ✅
   - Plan configuration centralized ✅
   - Setup script for reproducibility ✅

### Weaknesses

1. **No Test Coverage**
   - Zero automated tests ❌
   - Manual testing required ❌
   - No CI/CD validation ❌
   - Hard to refactor safely ❌

2. **Incomplete Webhook Handling**
   - Only 7 of 15+ relevant events ❌
   - No webhook delivery retries (Stripe handles, but no app logic) ❌
   - No webhook event logging ❌
   - No webhook event deduplication ❌

3. **Limited Error Messages**
   - Generic "Failed to create subscription" ❌
   - No error codes for debugging ❌
   - No structured error logging ❌

4. **Duplicate Code**
   - Customer creation in two places (stripeHelpers and payments route) ❌
   - Plan lookup logic duplicated ❌

5. **Missing Features**
   - No invoice tracking ❌
   - No payment method management UI ❌
   - No subscription downgrade/upgrade ❌
   - No credit handling ❌
   - No usage-based billing ❌
   - No refund processing ❌
   - No dunning (retry failed payments) ❌

---

## Dependencies

### Stripe Libraries

```json
{
  "dependencies": {
    "stripe": "^16.12.0", // Server-side
    "@stripe/stripe-js": "^8.3.0", // Browser Stripe.js
    "@stripe/react-stripe-js": "^5.3.0" // React integration
  }
}
```

### Related Dependencies

- `@supabase/supabase-js` ^2.80.0 - Database
- `express` ^4.19.2 - Web framework
- `zod` ^4.1.12 - Validation
- `sonner` ^2.0.7 - Toast notifications

---

## MCP Integration Recommendations

### 1. StripeService Architecture

```typescript
// services/core-api/src/services/stripe.ts

export class StripeService {
  // Customer management
  async ensureCustomer(userId, email): Promise<string>
  async getCustomer(customerId): Promise<Customer>
  async updateCustomer(customerId, data): Promise<Customer>

  // Setup intents
  async createSetupIntent(customerId, planId): Promise<SetupIntent>
  async retrieveSetupIntent(setupIntentId): Promise<SetupIntent>

  // Subscriptions
  async createSubscription(
    customerId,
    priceId,
    paymentMethodId,
  ): Promise<Subscription>
  async getSubscription(subscriptionId): Promise<Subscription>
  async updateSubscription(subscriptionId, data): Promise<Subscription>
  async cancelSubscription(subscriptionId): Promise<Subscription>

  // Billing
  async createBillingPortalSession(
    customerId,
    returnUrl,
  ): Promise<BillingPortalSession>
  async getInvoices(customerId): Promise<Invoice[]>

  // Webhooks
  async verifyWebhookSignature(body, signature, secret): Promise<Event>
  async handleWebhookEvent(event): Promise<void>
}
```

### 2. MCP Integration Points

Replace direct Stripe API calls with MCP server:

```typescript
// Before (direct API)
const customer = await stripe.customers.create({...})

// After (MCP)
const customer = await mcpClient.callTool('stripe_create_customer', {...})
```

### 3. Test Strategy

```typescript
// Mock MCP responses instead of Stripe
const mockMcp = {
  stripe_create_customer: () => ({ id: 'cus_test123' }),
  stripe_create_subscription: () => ({ id: 'sub_test456' }),
  // ...
}
```

### 4. Configuration

```typescript
// services/core-api/.env
MCP_STRIPE_MODE = test | live
MCP_STRIPE_API_KEY = sk_test_xxxxx
// MCP server will use this instead of node_modules stripe
```

---

## Deployment Checklist

### Pre-Production Setup

- [ ] Stripe account created in live mode
- [ ] Products and prices created (or run setup:stripe with live key)
- [ ] Webhook endpoint registered in Stripe dashboard
- [ ] Webhook secret added to production environment
- [ ] API keys (live mode) added to production environment
- [ ] HTTPS enabled on webhook endpoint
- [ ] Frontend publishable key (live mode) configured
- [ ] Billing notifications tested with real email service
- [ ] All webhook events tested via Stripe dashboard
- [ ] Rate limiting configured on API endpoints
- [ ] Error monitoring/logging set up (e.g., Sentry)
- [ ] Load testing completed for payment routes

### Post-Production Monitoring

- [ ] Webhook delivery monitored in Stripe dashboard
- [ ] Failed webhooks investigated and retried
- [ ] Customer support process for billing issues defined
- [ ] Refund policy implemented
- [ ] Chargeback dispute process defined
- [ ] Payment success/failure metrics tracked
- [ ] Subscription growth metrics monitored

---

## File Structure Summary

```
ori-platform/
├── src/
│   ├── lib/
│   │   └── stripe.ts (29 LOC) - Frontend Stripe.js initialization
│   ├── integrations/
│   │   └── api/
│   │       └── payments.ts (76 LOC) - API client for payment endpoints
│   └── components/
│       └── payments/
│           └── PaymentForm.tsx (131 LOC) - Payment UI component
│
├── services/
│   └── core-api/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── stripe.ts (72 LOC) - Server Stripe client + plans
│       │   │   └── stripeHelpers.ts (81 LOC) - Customer helpers
│       │   ├── routes/
│       │   │   ├── payments.ts (308 LOC) - Checkout, portal, webhooks
│       │   │   ├── setupIntent.ts (65 LOC) - Setup intent creation
│       │   │   └── subscriptions.ts (99 LOC) - Subscription management
│       │   ├── utils/
│       │   │   └── notifications.ts (119 LOC) - Payment notifications
│       │   ├── scripts/
│       │   │   └── setupStripe.ts (261 LOC) - Product/price setup
│       │   └── index.ts - Server startup (webhook middleware)
│       └── package.json - Stripe library dependencies
│
├── supabase/
│   └── migrations/
│       └── 20251108235959_add_stripe_fields_to_user_profiles.sql (32 LOC)
│
├── shared/
│   └── types/
│       └── src/
│           └── index.ts - Includes UserProfile with Stripe fields
│
└── .tasks/
    ├── todo/
    │   ├── mcp-integration/
    │   │   └── 1-stripe-mcp.md - MCP integration task
    │   └── stripe-webhook-docs/
    │       └── A.md - Webhook documentation task
    └── in-progress/
        └── stripe-integration/ - 12 stripe setup tasks
```

---

## Summary of Findings

### What's Working

1. ✅ Frontend Stripe.js integration with lazy loading
2. ✅ Backend Stripe client initialization
3. ✅ Customer creation and Supabase synchronization
4. ✅ Checkout session creation
5. ✅ Setup Intent for payment method collection
6. ✅ Subscription creation with payment method
7. ✅ Billing portal session creation
8. ✅ Webhook signature verification
9. ✅ Core webhook event handling (7 events)
10. ✅ Payment failure/expiration notifications
11. ✅ Idempotent product/price setup script
12. ✅ Database schema with proper constraints and indexes

### What's Partially Working

1. ⚠️ Webhook event handling (only 7/15+ events)
2. ⚠️ Error handling (generic messages)
3. ⚠️ Notification system (in-app only, email not integrated)

### What's Missing

1. ❌ Automated test coverage (0%)
2. ❌ Additional webhook events
3. ❌ Webhook delivery logging and monitoring
4. ❌ Payment method management UI
5. ❌ Subscription management UI (downgrade, upgrade, cancel)
6. ❌ Invoice management
7. ❌ Refund processing
8. ❌ Dunning/retry logic
9. ❌ Usage-based billing
10. ❌ Credit handling
11. ❌ MCP server integration
12. ❌ Webhook setup documentation

### Readiness for MCP Integration

**Overall Readiness:** ⭐⭐⭐⭐☆ (4/5)

**Strengths for MCP:**

- Clean separation of concerns
- Clear API boundaries
- All direct Stripe calls in lib/routes
- Good error handling patterns
- Configuration externalized

**Challenges for MCP:**

- No existing test suite to validate against
- Multiple places with direct API calls
- Some duplicate logic to consolidate
- Need to establish test fixtures

**Next Steps:**

1. Create StripeService wrapper class
2. Set up MCP server in development environment
3. Migrate all Stripe API calls to use MCP
4. Build comprehensive test suite using MCP
5. Update webhook handling with MCP
6. Document new MCP-based architecture

---

## Recommendations

### Immediate (Pre-MCP)

1. **Add Basic Tests**
   - Mock Stripe SDK
   - Test each route with valid/invalid inputs
   - Test webhook signature verification
   - At least 80% code coverage

2. **Document Webhook Setup**
   - Create `docs/STRIPE_WEBHOOK_SETUP.md`
   - Include Stripe CLI setup for local dev
   - Include production setup steps
   - Include troubleshooting guide

3. **Consolidate Duplicate Code**
   - Use ensureStripeCustomer everywhere
   - Centralize plan lookup logic
   - Extract common validation patterns

### Medium-term (With MCP)

1. **Create StripeService**
   - Encapsulate all Stripe logic
   - Use MCP for all API calls
   - Provide high-level API to routes

2. **Expand Webhook Handling**
   - Add missing event types
   - Implement webhook delivery logging
   - Add event deduplication

3. **Add Monitoring**
   - Track payment success/failure rates
   - Monitor webhook delivery
   - Alert on Stripe API errors
   - Track subscription churn

### Long-term

1. **Subscription Management**
   - Add plan upgrade/downgrade
   - Implement proration
   - Add subscription pause/resume

2. **Advanced Features**
   - Usage-based billing
   - Coupons and discounts
   - Credits/prepayments
   - Refund processing
   - Dunning/retry logic

3. **Compliance**
   - PCI compliance audit
   - GDPR data deletion
   - SOC 2 compliance
   - Regular security audits

---

## Conclusion

The Ori Platform has a **functional but incomplete** Stripe payment system that is **ready for MCP integration**. The code is well-structured with clear separation of concerns, but lacks automated tests and comprehensive webhook handling. The primary focus should be on:

1. Adding test coverage using MCP
2. Consolidating code through a StripeService
3. Expanding webhook event handling
4. Documenting webhook setup for developers

With MCP integration, the development team will be able to:

- Test payment flows programmatically
- Avoid manual Stripe dashboard testing
- Simulate webhook events reliably
- Build with confidence
- Iterate faster on payment features
