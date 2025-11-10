# Stripe Production Verification Log

**Date**: November 10, 2025
**Task**: 02-verify-stripe-production
**Owner**: Claude

## Pre-Verification Checklist

### Code Verification ✅
- [x] PaymentForm component exists (`src/components/payments/PaymentForm.tsx`)
- [x] Select Plan page exists (`src/app/select-plan/page.tsx`)
- [x] Setup Intent API client exists (`src/integrations/api/payments.ts`)
- [x] Backend Setup Intent endpoint exists (`services/core-api/src/routes/setupIntent.ts`)
- [x] Backend Subscription endpoint exists (`services/core-api/src/routes/subscriptions.ts`)
- [x] Webhook handler exists (`services/core-api/src/routes/payments.ts`)
- [x] Database schema has Stripe fields (migration `20251108235959_add_stripe_fields_to_user_profiles.sql`)

### Production Deployment ✅
- [x] Latest deployment successful (https://ori-platform-b57ndkgou-carlo-spada.vercel.app)
- [x] Deployment timestamp: 2025-11-10T02:03:42Z
- [ ] Environment variables verified (need to check)

## Environment Variables to Verify

These need to be set in Vercel for production:

### Frontend (Next.js)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_... or pk_live_...)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `NEXT_PUBLIC_API_URL` - Core API URL (should be production backend URL)

### Backend (core-api)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_... or sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (whsec_...)
- [ ] `SUPABASE_URL` - Supabase URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `FRONTEND_URL` - Frontend URL for CORS

## Verification Steps

### Step 1: Check Environment Variables
**Status**: PENDING
**Action Required**: Access Vercel dashboard to verify env vars

**How to check**:
```bash
# Option 1: Vercel CLI
vercel env ls

# Option 2: Vercel Dashboard
# Navigate to: https://vercel.com/carlo-spadas-projects/ori-platform/settings/environment-variables
```

**Expected**:
- All Stripe keys present
- Webhook secret configured
- API URLs pointing to correct endpoints

### Step 2: Check Stripe Dashboard Configuration
**Status**: PENDING
**Action Required**: Verify webhook endpoint in Stripe dashboard

**How to check**:
1. Go to: https://dashboard.stripe.com/webhooks
2. Verify webhook endpoint URL
3. Check subscribed events

**Expected**:
- Webhook URL: `https://<production-url>/api/payments/webhook`
- Events: checkout.session.completed, customer.subscription.*, invoice.payment_*

### Step 3: Test Payment Flow (Test Mode)
**Status**: PENDING

**Steps**:
1. [ ] Open production site: https://ori-platform-b57ndkgou-carlo-spada.vercel.app
2. [ ] Sign up or log in
3. [ ] Navigate to `/select-plan`
4. [ ] Select Plus Monthly plan
5. [ ] Payment form loads (Stripe Elements)
6. [ ] Fill test card: `4242 4242 4242 4242`
7. [ ] Expiry: any future date (e.g., 12/28)
8. [ ] CVC: any 3 digits (e.g., 123)
9. [ ] Submit payment
10. [ ] Check for success message
11. [ ] Verify redirect to `/onboarding`

**Expected Results**:
- Setup Intent created
- Payment Element renders correctly
- Payment method saved
- Subscription created
- User redirected to onboarding
- Database updated with subscription status

### Step 4: Verify Database Updates
**Status**: PENDING

**Steps**:
1. [ ] After successful payment, query user_profiles table
2. [ ] Check `stripe_customer_id` populated
3. [ ] Check `stripe_subscription_id` populated
4. [ ] Check `subscription_status` = 'plus_monthly'

**SQL Query**:
```sql
SELECT
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  subscription_status,
  updated_at
FROM user_profiles
WHERE user_id = '<test-user-id>'
ORDER BY updated_at DESC
LIMIT 1;
```

### Step 5: Verify Webhook Delivery
**Status**: PENDING

**Steps**:
1. [ ] Check Vercel logs for webhook events
2. [ ] Go to Stripe Dashboard → Webhooks
3. [ ] Find recent webhook attempts
4. [ ] Verify status = 200 OK

**Expected**:
- Webhook events received
- Signature verified
- Database updates triggered
- No errors in logs

### Step 6: Test Error Handling
**Status**: PENDING

**Steps**:
1. [ ] Try payment with declined card: `4000 0000 0000 0002`
2. [ ] Verify error message shown to user
3. [ ] Verify no subscription created in database
4. [ ] Verify no charge in Stripe dashboard

**Expected**:
- User-friendly error message
- No database changes
- Graceful failure

## Known Issues

### Issue 1: Production URL
**Description**: Current Vercel URL is temporary deployment URL (b57ndkgou-carlo-spada.vercel.app)
**Status**: BLOCKER - Need permanent production URL
**Resolution**: Need to:
1. Set up custom domain (app.getori.app) or
2. Use Vercel's production URL (ori-platform.vercel.app)

### Issue 2: Core API Deployment
**Description**: Core API (services/core-api) needs to be deployed separately
**Status**: BLOCKER - Backend not accessible from frontend
**Resolution Options**:
1. Deploy core-api to Vercel as serverless functions
2. Deploy core-api to DigitalOcean/Railway/Fly.io
3. Use Vercel API routes as proxy to backend

### Issue 3: Stripe Test vs Live Mode
**Description**: Need to decide test or live mode for production
**Status**: DECISION NEEDED
**Recommendation**: Use Test Mode until full launch, then switch to Live

## Blockers Identified

### CRITICAL BLOCKERS
1. **Core API Not Deployed**: Frontend can't reach backend endpoints
   - Impact: Payment flow completely broken
   - Solution: Deploy core-api to hosting service
   - ETA: 1-2 hours

2. **Environment Variables Unknown**: Can't verify without Vercel access
   - Impact: May have missing/incorrect configuration
   - Solution: Check Vercel dashboard
   - ETA: 5 minutes

### NON-BLOCKERS
1. **Custom Domain**: Using Vercel subdomain works for testing
   - Impact: None (cosmetic)
   - Solution: Configure app.getori.app later

## Next Steps

**IMMEDIATE**:
1. ⚠️ **Deploy Core API** - This is blocking all Stripe functionality
   - Research deployment options (Vercel vs DigitalOcean)
   - Choose platform based on cost and complexity
   - Deploy and test connectivity

2. Check Vercel Environment Variables
   - Access Vercel dashboard
   - Verify all Stripe keys present
   - Update if needed

**AFTER CORE API DEPLOYED**:
3. Run full payment flow test
4. Verify webhook delivery
5. Test error handling
6. Document any production-specific gotchas

## Decision Point: Core API Deployment

### Option A: Vercel Serverless Functions
**Pros**:
- Same platform as frontend
- Easy integration
- Auto-scaling

**Cons**:
- Serverless limitations (10-second timeout)
- Cold starts
- Not ideal for long-running processes

**Verdict**: ❌ Not recommended for webhook handlers or background jobs

### Option B: DigitalOcean App Platform
**Pros**:
- Always-on server
- Good for webhooks
- Affordable ($5-12/month)
- Database proximity (if using DO managed DB)

**Cons**:
- Separate platform to manage
- Need to configure CORS

**Verdict**: ✅ **RECOMMENDED**

### Option C: Railway / Fly.io
**Pros**:
- Modern platforms
- Easy deployment
- Good DX

**Cons**:
- Railway pricing can scale quickly
- Fly.io learning curve

**Verdict**: ✅ Viable alternative

## Recommendation

**PAUSE STRIPE VERIFICATION** until core-api is deployed. The payment flow cannot be tested without backend endpoints accessible from production.

**PIVOT TO**: Deploy core-api first, then resume Stripe verification.

**Estimated Time**:
- Core API deployment: 1-2 hours
- Stripe verification after deployment: 30 minutes
- Total: 2-2.5 hours

## Final Status

**Task Status**: BLOCKED
**Blocker**: Core API not deployed to production
**Next Task**: Create task for core-api deployment
**Recommendation**: Move to task 03 (Connect MCP servers) while deciding on backend deployment strategy, OR create new high-priority task for backend deployment.
