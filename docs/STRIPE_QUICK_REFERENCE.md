# Stripe Implementation Overview - Quick Reference

## At a Glance

| Metric | Status |
|--------|--------|
| **Total Code** | 1,122 LOC across 9 files |
| **Test Coverage** | 0% (no tests) |
| **Webhook Events Handled** | 7 of 15+ |
| **Environment Variables** | 8 required |
| **Pricing Tiers** | 2 (Plus, Premium) × 2 billing (Monthly, Yearly) |
| **MCP Readiness** | 4/5 stars (high) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (src/)                      │
├─────────────────────────────────────────────────────────────┤
│  PaymentForm.tsx (131 LOC)                                  │
│  ├─ Displays Stripe PaymentElement                          │
│  ├─ Creates Setup Intent on mount                           │
│  └─ Confirms payment and creates subscription               │
│                                                              │
│  api/payments.ts (76 LOC)                                   │
│  ├─ createSetupIntent(planId)                              │
│  └─ createSubscription(planId, paymentMethodId)            │
│                                                              │
│  lib/stripe.ts (29 LOC)                                     │
│  └─ Lazy loads Stripe.js in browser only                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (core-api)                   │
├─────────────────────────────────────────────────────────────┤
│  lib/stripe.ts (72 LOC) - Stripe client + plan config      │
│                                                              │
│  lib/stripeHelpers.ts (81 LOC)                             │
│  ├─ ensureStripeCustomer()                                 │
│  └─ getUserEmail()                                          │
│                                                              │
│  routes/setupIntent.ts (65 LOC)                            │
│  └─ POST /api/v1/setup-intent → Creates Setup Intent      │
│                                                              │
│  routes/subscriptions.ts (99 LOC)                          │
│  └─ POST /api/v1/subscriptions → Creates Subscription     │
│                                                              │
│  routes/payments.ts (308 LOC)                              │
│  ├─ POST /api/v1/payments/checkout → Checkout session     │
│  ├─ POST /api/v1/payments/portal → Billing portal         │
│  └─ POST /api/v1/payments/webhook → Webhook handler (7 events)
│                                                              │
│  scripts/setupStripe.ts (261 LOC)                          │
│  └─ Creates products and prices (idempotent)               │
│                                                              │
│  utils/notifications.ts (119 LOC)                          │
│  ├─ sendPaymentFailureNotification()                       │
│  └─ sendPaymentMethodExpiringNotification()                │
└──────────────────────┬──────────────────────────────────────┘
                       │ Stripe API
                       ↓
          ┌────────────────────────────┐
          │   Stripe API                │
          │ (api.stripe.com)            │
          │                             │
          │ - Customers                 │
          │ - Subscriptions             │
          │ - Setup Intents             │
          │ - Checkout Sessions         │
          │ - Billing Portal            │
          │ - Webhooks                  │
          └────────────────┬────────────┘
                           │ Webhooks
                           ↓
┌──────────────────────────────────────┐
│  Webhook Handler (payments.ts)       │
├──────────────────────────────────────┤
│  Events:                             │
│  ✅ checkout.session.completed       │
│  ✅ customer.subscription.created    │
│  ✅ customer.subscription.updated    │
│  ✅ customer.subscription.deleted    │
│  ⚠️  invoice.payment_succeeded       │
│  ✅ invoice.payment_failed           │
│  ✅ customer.source.expiring         │
└──────────────────────┬───────────────┘
                       │
                       ↓
          ┌────────────────────────────┐
          │   Supabase Database        │
          │ user_profiles table        │
          │ - stripe_customer_id       │
          │ - stripe_subscription_id   │
          │ - subscription_status      │
          └────────────────────────────┘
```

---

## File Map

### Frontend Files (236 LOC)
- `src/lib/stripe.ts` - Stripe.js loader
- `src/integrations/api/payments.ts` - API client
- `src/components/payments/PaymentForm.tsx` - Payment UI

### Backend Files (886 LOC)
- `services/core-api/src/lib/stripe.ts` - Stripe client
- `services/core-api/src/lib/stripeHelpers.ts` - Helpers
- `services/core-api/src/routes/payments.ts` - Webhooks, checkout, portal
- `services/core-api/src/routes/setupIntent.ts` - Setup Intent
- `services/core-api/src/routes/subscriptions.ts` - Subscription creation
- `services/core-api/src/scripts/setupStripe.ts` - Setup script
- `services/core-api/src/utils/notifications.ts` - Notifications

---

## Payment Flow

### Happy Path: User Subscribes

```
1. User clicks "Subscribe" button
   └─> Go to /select-plan page

2. Frontend loads PaymentForm component
   └─> ComponentDidMount → POST /api/v1/setup-intent
       ├─ Get user email
       ├─ Create/get Stripe customer
       ├─ Create Setup Intent
       └─ Return clientSecret to frontend

3. Display Stripe PaymentElement
   └─> User enters payment details

4. User clicks "Subscribe" button
   └─> Confirm Setup Intent with payment details
       ├─ Get paymentMethodId from response
       └─ POST /api/v1/subscriptions { planId, paymentMethodId }

5. Backend creates subscription
   ├─ Attach payment method to customer
   ├─ Create Stripe Subscription
   ├─ Update user_profiles table
   └─ Return subscriptionId

6. Frontend receives success
   ├─ Toast success message
   └─ Redirect to /app/dashboard

7. Stripe sends webhook events (async)
   ├─ checkout.session.completed OR customer.subscription.created
   └─ Backend updates subscription_status
```

### Webhook Handling

```
Stripe API sends event → HTTPS POST to /api/v1/payments/webhook

1. Raw body received (NOT parsed by express.json)
2. Verify signature using STRIPE_WEBHOOK_SECRET
3. Extract event type
4. Process based on event:
   ✅ checkout.session.completed
      └─ Retrieve subscription details, update DB
   ✅ customer.subscription.created
      └─ Record subscription in DB
   ✅ customer.subscription.updated
      └─ Handle plan changes, status updates
   ✅ customer.subscription.deleted
      └─ Mark as cancelled
   ⚠️  invoice.payment_succeeded
      └─ Logged (no DB update)
   ✅ invoice.payment_failed
      └─ Mark as past_due, send notification
   ✅ customer.source.expiring
      └─ Send expiration warning notification
5. Return 200 OK to Stripe
```

---

## Key Configuration

### Stripe Plans Configuration

```typescript
STRIPE_PLANS = {
  plus_monthly: {
    price: 500,          // $5.00
    interval: 'month',
    productId: 'prod_xxx',
    priceId: 'price_xxx'
  },
  plus_yearly: {
    price: 4800,         // $48.00 (20% discount)
    interval: 'year',
    productId: 'prod_xxx',
    priceId: 'price_xxx'
  },
  premium_monthly: {
    price: 1000,         // $10.00
    interval: 'month',
    productId: 'prod_xxx',
    priceId: 'price_xxx'
  },
  premium_yearly: {
    price: 9600,         // $96.00 (20% discount)
    interval: 'year',
    productId: 'prod_xxx',
    priceId: 'price_xxx'
  }
}
```

### Database Schema

```sql
ALTER TABLE user_profiles ADD COLUMN:
  - stripe_customer_id TEXT UNIQUE
  - stripe_subscription_id TEXT UNIQUE
  - subscription_status TEXT (CHECK IN ('free', 'plus_monthly', 'plus_yearly', 
                                        'premium_monthly', 'premium_yearly', 
                                        'past_due', 'cancelled'))

Indexes:
  - idx_user_profiles_stripe_customer_id
  - idx_user_profiles_stripe_subscription_id
  - idx_user_profiles_subscription_status
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/setup-intent` | JWT | Create Setup Intent for payment collection |
| POST | `/api/v1/subscriptions` | JWT | Create subscription with payment method |
| POST | `/api/v1/payments/checkout` | JWT | Create checkout session |
| POST | `/api/v1/payments/portal` | JWT | Create billing portal session |
| POST | `/api/v1/payments/webhook` | Signature | Receive Stripe webhooks |

---

## Current Issues & Gaps

### Critical
- ❌ **No automated tests** - All testing manual
- ❌ **Incomplete webhook handling** - Only 7 of 15+ events
- ❌ **No webhook logging** - Hard to debug issues
- ❌ **Duplicate customer creation** - Code in two places

### Important
- ❌ **No refund processing** - Can't refund customers
- ❌ **No subscription management UI** - Users can't change plans
- ❌ **No invoice tracking** - No invoice history
- ❌ **Email not integrated** - Only in-app notifications

### Nice to Have
- ❌ **No usage-based billing** - Only fixed plans
- ❌ **No credits** - Can't give free credits
- ❌ **No dunning logic** - Don't retry failed payments
- ❌ **No analytics** - No payment metrics

---

## Direct API Calls (Must Migrate to MCP)

```
stripe.customers.create() → 2 places
stripe.customers.update() → 1 place
stripe.setupIntents.create() → 1 place
stripe.paymentMethods.attach() → 1 place
stripe.subscriptions.retrieve() → 1 place
stripe.subscriptions.create() → 1 place
stripe.checkout.sessions.create() → 1 place
stripe.billingPortal.sessions.create() → 1 place
stripe.webhooks.constructEvent() → 1 place
stripe.products.search() → 1 place
stripe.products.create() → 1 place
stripe.prices.search() → 1 place
stripe.prices.create() → 1 place
```

Total: **14 unique API call types**, many duplicated across files.

---

## Environment Variables Checklist

**Development (.env):**
```
STRIPE_SECRET_KEY=sk_test_xxxxx                   ✓
STRIPE_WEBHOOK_SECRET=whsec_xxxxx                 ✓
STRIPE_PRODUCT_PLUS_ID=prod_xxxxx                 ✓
STRIPE_PRODUCT_PREMIUM_ID=prod_xxxxx              ✓
STRIPE_PRICE_PLUS_MONTHLY_ID=price_xxxxx         ✓
STRIPE_PRICE_PLUS_YEARLY_ID=price_xxxxx          ✓
STRIPE_PRICE_PREMIUM_MONTHLY_ID=price_xxxxx      ✓
STRIPE_PRICE_PREMIUM_YEARLY_ID=price_xxxxx       ✓
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx ✓
NEXT_PUBLIC_API_URL=http://localhost:3001        ✓
```

---

## Dependencies

```json
{
  "stripe": "^16.12.0",
  "@stripe/stripe-js": "^8.3.0",
  "@stripe/react-stripe-js": "^5.3.0",
  "@supabase/supabase-js": "^2.80.0",
  "express": "^4.19.2",
  "zod": "^4.1.12",
  "sonner": "^2.0.7"
}
```

---

## MCP Integration Checklist

- [ ] Set up Stripe MCP server
- [ ] Create StripeService wrapper class
- [ ] Migrate all API calls to use MCP
- [ ] Create test suite with MCP mocks
- [ ] Verify all webhook events work
- [ ] Document MCP-based architecture
- [ ] Remove direct Stripe SDK usage from app code
- [ ] Update deployment process for MCP

---

## Next Steps

1. **Read Full Audit:** `docs/STRIPE_INFRASTRUCTURE_AUDIT.md`
2. **Understand Current Flow:** Review this quick reference
3. **Plan MCP Integration:** Follow task in `.tasks/todo/mcp-integration/1-stripe-mcp.md`
4. **Create Test Suite:** Use MCP to build comprehensive tests
5. **Document Setup:** Create `docs/STRIPE_WEBHOOK_SETUP.md`
