---
type: documentation
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: archive, deprecated, stripe, code, locations.md, implementation, file
priority: medium
quick-read-time: 8min
deep-dive-time: 13min
---

# Stripe Implementation - File Locations & Code Map

## Frontend Files

### 1. Stripe Client Initialization

**File:** `/src/lib/stripe.ts` (29 LOC)
**Purpose:** Lazy-load Stripe.js library for browser
**Key Exports:**

- `getStripe()` - Get Stripe instance (creates promise on first call)
- `stripePromise` - Exported promise for backward compatibility

**Integration Points:**

- Used by `PaymentForm.tsx` component
- Only initialized in browser (checks `typeof window`)

---

### 2. Payment API Client

**File:** `/src/integrations/api/payments.ts` (76 LOC)
**Purpose:** API client for payment endpoints
**Exported Functions:**

- `createSetupIntent(planId: string)`
  - Endpoint: `POST /api/v1/setup-intent`
  - Returns: `{ clientSecret, setupIntentId }`
- `createSubscription(planId: string, paymentMethodId: string)`
  - Endpoint: `POST /api/v1/subscriptions`
  - Returns: `{ subscriptionId }`

**Authentication:**

- Uses `getAuthHeaders()` to inject JWT token
- Calls `getSupabaseClient()` to get session

**Error Handling:**

- Parses JSON error responses
- Throws descriptive Error objects

---

### 3. Payment Form Component

**File:** `/src/components/payments/PaymentForm.tsx` (131 LOC)
**Purpose:** React component for collecting payment details
**Props:**

- `planId: string` - Selected plan ID
- `onSuccess: () => void` - Callback on successful subscription
- `onCancel: () => void` - Callback to cancel flow

**State:**

- `clientSecret` - Setup Intent secret from API
- `isLoading` - Initial setup loading
- `isProcessing` - Payment submission processing

**Lifecycle:**

1. Mount: Creates Setup Intent via API
2. Render: Displays Stripe PaymentElement
3. Submit: Confirms payment and creates subscription
4. Cleanup: Clears state on unmount

**UI Components:**

- `PaymentElement` from `@stripe/react-stripe-js`
- `Button` component from UI library
- `toast` notifications from sonner

---

## Backend Files

### 4. Stripe Client & Configuration

**File:** `/services/core-api/src/lib/stripe.ts` (72 LOC)
**Purpose:** Server-side Stripe client initialization and plan configuration
**Key Exports:**

- `stripe` - Initialized Stripe client instance
- `STRIPE_PLANS` - Plan configuration object
- `getPlanKeyFromStatus(status)` - Convert status to plan key
- `getStatusFromPriceId(priceId)` - Convert price ID to status

**Configuration:**

- API Version: `2024-06-20` (pinned)
- Plans: Plus (monthly/yearly), Premium (monthly/yearly)
- Pricing in cents: $500, $4800, $1000, $9600

**Environment Dependency:**

- Requires `STRIPE_SECRET_KEY` environment variable
- Requires plan ID environment variables

---

### 5. Stripe Helper Functions

**File:** `/services/core-api/src/lib/stripeHelpers.ts` (81 LOC)
**Purpose:** Utility functions for customer management
**Exported Functions:**

1. **`ensureStripeCustomer(userId, email, fullName?)`**
   - Checks if Stripe customer ID exists in Supabase
   - Creates new customer if missing
   - Saves customer ID to `user_profiles.stripe_customer_id`
   - Sets `subscription_status` to 'free'
   - Returns: customer ID string

2. **`getUserEmail(userId)`**
   - Fetches user email from Supabase Auth
   - Uses admin API (`supabase.auth.admin.getUserById`)
   - Returns: email string

**Database Queries:**

- `SELECT stripe_customer_id FROM user_profiles WHERE user_id = ?`
- `UPDATE user_profiles SET stripe_customer_id = ?, subscription_status = 'free' WHERE user_id = ?`
- Supabase auth admin query

**Error Handling:**

- Throws descriptive errors
- Logs to console
- Returns 500 status on API errors

---

### 6. Setup Intent Route

**File:** `/services/core-api/src/routes/setupIntent.ts` (65 LOC)
**Purpose:** Create Setup Intent for payment method collection
**Endpoint:** `POST /api/v1/setup-intent`

**Authentication:**

- Requires JWT token (authMiddleware)

**Request Validation:**

- Zod schema: `{ planId: enum([plus_monthly, plus_yearly, premium_monthly, premium_yearly]) }`

**Flow:**

1. Validate user is authenticated
2. Get user email via `getUserEmail(userId)`
3. Ensure customer exists via `ensureStripeCustomer()`
4. Create Setup Intent with Stripe:
   - `stripe.setupIntents.create({ customer, payment_method_types: ['card'], metadata })`
5. Return `{ clientSecret, setupIntentId }`

**Response:**

- `clientSecret` - Used by frontend to confirm payment
- `setupIntentId` - ID of the Setup Intent

---

### 7. Subscriptions Route

**File:** `/services/core-api/src/routes/subscriptions.ts` (99 LOC)
**Purpose:** Create subscription after payment method confirmed
**Endpoint:** `POST /api/v1/subscriptions`

**Authentication:**

- Requires JWT token (authMiddleware)

**Request Validation:**

- Zod schema: `{ planId: enum(...), paymentMethodId: string }`

**Flow:**

1. Validate plan ID exists in STRIPE_PLANS
2. Get price ID from plan configuration
3. Ensure customer exists
4. Attach payment method:
   - `stripe.paymentMethods.attach(paymentMethodId, { customer })`
5. Set as default:
   - `stripe.customers.update(customer, { invoice_settings: { default_payment_method } })`
6. Create subscription:
   - `stripe.subscriptions.create({ customer, items: [{ price }], payment_settings })`
7. Update Supabase:
   - `UPDATE user_profiles SET stripe_subscription_id = ?, subscription_status = ? WHERE user_id = ?`
8. Return `{ subscriptionId, status }`

**Error Handling:**

- Returns 400 for invalid plan
- Returns 500 if price not configured (suggests running setup:stripe)
- Returns 500 for Stripe API errors

---

### 8. Payments Route - Main Handler

**File:** `/services/core-api/src/routes/payments.ts` (308 LOC)
**Purpose:** Checkout sessions, billing portal, and webhook handling
**Endpoints:**

- `POST /api/v1/payments/checkout` - Create checkout session
- `POST /api/v1/payments/portal` - Create billing portal
- `POST /api/v1/payments/webhook` - Webhook handler (raw body)

#### 8A. Checkout Endpoint

```
POST /api/v1/payments/checkout
Body: { userId, priceId, successUrl, cancelUrl }
Auth: JWT
Returns: { url: string }
```

**Flow:**

1. Validate user can only create checkout for themselves
2. Fetch user from database
3. Create/retrieve Stripe customer
4. Save customer ID to database if new
5. Create checkout session:
   - Mode: 'subscription'
   - Line items: [{ price, quantity: 1 }]
   - Metadata: { userId }
6. Return checkout URL

#### 8B. Billing Portal Endpoint

```
POST /api/v1/payments/portal
Body: { userId }
Auth: JWT
Returns: { url: string }
```

**Flow:**

1. Validate user can only access own portal
2. Retrieve Stripe customer ID
3. Create billing portal session:
   - `stripe.billingPortal.sessions.create({ customer, return_url })`
4. Return portal URL

**Features Users Can:**

- Update payment methods
- View/download invoices
- Cancel subscriptions
- Change plans
- View billing history

#### 8C. Webhook Handler

```
POST /api/v1/payments/webhook
Body: Raw JSON (NOT parsed)
Headers: stripe-signature
No Auth: Verified via signature instead
```

**CRITICAL:** This route MUST be registered before `express.json()` middleware!

**Webhook Signature Verification:**

```typescript
const event = stripe.webhooks.constructEvent(
  req.body, // Must be raw, unparsed body
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

**Handled Events:**

| Event                           | Location | Database Updates                           | Side Effects                |
| ------------------------------- | -------- | ------------------------------------------ | --------------------------- |
| `checkout.session.completed`    | Line 169 | subscription_id, subscription_status       | -                           |
| `customer.subscription.created` | Line 194 | subscription_id, subscription_status       | -                           |
| `customer.subscription.updated` | Line 214 | subscription_status                        | Handles past_due, cancelled |
| `customer.subscription.deleted` | Line 239 | subscription_id = NULL, status = cancelled | -                           |
| `invoice.payment_succeeded`     | Line 256 | None (logged)                              | -                           |
| `invoice.payment_failed`        | Line 267 | subscription_status = 'past_due'           | Sends notification          |
| `customer.source.expiring`      | Line 286 | None                                       | Sends notification          |

**Query Pattern:**

- All updates use: `UPDATE user_profiles SET ... WHERE stripe_customer_id = ?`
- This allows lookups without needing user_id

---

### 9. Stripe Setup Script

**File:** `/services/core-api/src/scripts/setupStripe.ts` (261 LOC)
**Purpose:** Idempotent product and price creation
**Run:** `pnpm run setup:stripe`

**Execution:**

1. Checks for existing products by name:
   - `stripe.products.search({ query: 'name:"Ori Plus"' })`
2. Creates product if missing:
   - `stripe.products.create({ name, description, metadata })`
3. Checks for existing prices:
   - `stripe.prices.search({ query: 'product:"xxx" AND active:true AND recurring.interval:month' })`
4. Creates price if missing:
   - `stripe.prices.create({ product, unit_amount, currency, recurring, metadata })`
5. Outputs environment variables to console

**Safe to Run Multiple Times:**

- Searches before creating
- Won't create duplicates
- Handles existing products gracefully

**Products Created:**

- "Ori Plus" - Plus tier product
- "Ori Premium" - Premium tier product

**Prices Created (per product):**

- Monthly price
- Yearly price (20% discount)

---

### 10. Notifications Utility

**File:** `/services/core-api/src/utils/notifications.ts` (119 LOC)
**Purpose:** Send notifications to users about payment events
**Exported Functions:**

1. **`sendNotification(supabase, userId, options)`**
   - Generic notification sender
   - Creates in-app notification
   - Placeholder for email integration
   - `options`: `{ to, subject, message, type }`

2. **`sendPaymentFailureNotification(supabase, customerId)`**
   - Triggered by: `invoice.payment_failed` webhook
   - Looks up user by customer ID
   - Creates notification and email
   - Instructs user to update payment method

3. **`sendPaymentMethodExpiringNotification(supabase, customerId)`**
   - Triggered by: `customer.source.expiring` webhook
   - Looks up user by customer ID
   - Creates notification and email
   - Urges user to update card before expiration

**Database Operations:**

- Insert into `notifications` table:
  - `{ user_id, title, message, type: 'payment_alert', read: false, created_at }`
- Select from `user_profiles`:
  - `WHERE stripe_customer_id = ?`
- Select from `auth.users` (via admin API):
  - `WHERE id = ?`

**Email Integration:**

- Currently commented out
- Prepared for SendGrid integration
- Placeholder shows exact format needed

---

### 11. Server Startup

**File:** `/services/core-api/src/index.ts` (55 LOC)
**Critical Section:**

```typescript
// Line 31-35: Webhook route MUST be before express.json()
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhookRoutes,
)
// Line 37: JSON parsing for all other routes
app.use(express.json())
```

**Route Mounting:**

- Line 40: `app.use('/api/v1/applications', applicationRoutes)`
- Line 41: `app.use('/api/v1/dashboard', dashboardRoutes)`
- Line 44: `app.use('/api/v1/chat', chatRouter)`
- Line 45: `app.use('/api/v1/jobs', jobRoutes)`
- Line 46: `app.use('/api/v1/payments', paymentRoutes)` - Regular payment routes
- Line 47: `app.use('/api/v1/setup-intent', setupIntentRouter)`
- Line 48: `app.use('/api/v1/subscriptions', subscriptionsRouter)`

---

## Database Files

### 12. Stripe Schema Migration

**File:** `/supabase/migrations/20251108235959_add_stripe_fields_to_user_profiles.sql` (32 LOC)
**Purpose:** Add Stripe columns to user_profiles table

**Columns Added:**

```sql
stripe_customer_id TEXT UNIQUE
stripe_subscription_id TEXT UNIQUE
subscription_status TEXT DEFAULT 'free'
```

**Constraint:**

```sql
CHECK (subscription_status IN (
  'free', 'plus_monthly', 'plus_yearly',
  'premium_monthly', 'premium_yearly',
  'past_due', 'cancelled'
))
```

**Indexes:**

```sql
idx_user_profiles_stripe_customer_id
idx_user_profiles_stripe_subscription_id
idx_user_profiles_subscription_status
```

---

## Type Definitions

### 13. Shared Types

**File:** `/shared/types/src/index.ts`
**Stripe-Related Fields:**

In `User` interface:

- `subscription_tier: 'free' | 'plus' | 'premium'`
- `subscription_status: 'active' | 'trialing' | 'canceled' | 'past_due'`
- `stripe_customer_id?: string`

In `UserProfile` interface:

- `stripe_customer_id?: string`
- `stripe_subscription_id?: string`
- `subscription_status?: 'free' | 'plus_monthly' | 'plus_yearly' | 'premium_monthly' | 'premium_yearly' | 'past_due' | 'cancelled'`

---

## Configuration Files

### 14. Core API Package

**File:** `/services/core-api/package.json`
**Dependencies:**

- `stripe`: ^16.12.0
- `@supabase/supabase-js`: ^2.80.0
- `express`: ^4.19.2
- `zod`: ^4.1.12

**Scripts:**

- `dev` - Start server with ts-node-dev
- `build` - Compile TypeScript
- `test` - Run Jest
- `setup:stripe` - Run Stripe setup script

---

### 15. Frontend Package

**File:** `/package.json`
**Stripe Dependencies:**

- `stripe`: ^16.12.0 (required for payment processing)
- `@stripe/stripe-js`: ^8.3.0
- `@stripe/react-stripe-js`: ^5.3.0

**Other Payment Dependencies:**

- `sonner`: ^2.0.7 - Toast notifications
- `@supabase/supabase-js`: ^2.80.0 - Auth & database
- `@hookform/resolvers`: ^5.2.2 - Form validation

---

## Summary Table

| Component            | File                                             | LOC       | Purpose                     |
| -------------------- | ------------------------------------------------ | --------- | --------------------------- |
| Frontend Stripe Init | `/src/lib/stripe.ts`                             | 29        | Lazy-load Stripe.js         |
| API Client           | `/src/integrations/api/payments.ts`              | 76        | API calls to backend        |
| Payment Form         | `/src/components/payments/PaymentForm.tsx`       | 131       | Payment UI                  |
| Backend Client       | `/services/core-api/src/lib/stripe.ts`           | 72        | Stripe client init          |
| Helpers              | `/services/core-api/src/lib/stripeHelpers.ts`    | 81        | Customer utilities          |
| Setup Intent Route   | `/services/core-api/src/routes/setupIntent.ts`   | 65        | Create Setup Intent         |
| Subscriptions Route  | `/services/core-api/src/routes/subscriptions.ts` | 99        | Create subscription         |
| Payments Route       | `/services/core-api/src/routes/payments.ts`      | 308       | Checkout, portal, webhooks  |
| Setup Script         | `/services/core-api/src/scripts/setupStripe.ts`  | 261       | Product/price setup         |
| Notifications        | `/services/core-api/src/utils/notifications.ts`  | 119       | Payment notifications       |
| **TOTAL**            | **10 files**                                     | **1,122** | **Full Stripe integration** |

---

## How to Navigate

**For MCP Integration:**

- Start with file #4 (`lib/stripe.ts`) - Understand Stripe client initialization
- Then file #6 (`setupIntent.ts`) - Simple endpoint to mirror
- Then file #7 (`subscriptions.ts`) - Subscription creation logic
- Then file #8 (`payments.ts`) - Complex webhook handling

**For Testing:**

- File #4 needs mocking first
- File #6 & #7 are good test subjects
- File #8 webhook handler is critical

**For Frontend Integration:**

- File #1 (`lib/stripe.ts`) - How Stripe.js loads
- File #2 (`api/payments.ts`) - API client methods
- File #3 (`PaymentForm.tsx`) - Payment UI component

**For Deployment:**

- File #4 - Set environment variables
- File #9 - Run setup script
- File #8 - Register webhook in Stripe dashboard
- File #11 - Verify middleware order
