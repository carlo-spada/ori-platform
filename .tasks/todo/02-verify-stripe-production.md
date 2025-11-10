# Verify Stripe Payment Flow in Production

**Status**: TODO
**Priority**: HIGH
**Estimated**: 30 minutes
**Owner**: Claude

## Objective

End-to-end smoke test of Stripe payment integration in production Vercel deployment.

## Current State

- Backend: Setup Intent + Subscription endpoints implemented
- Frontend: PaymentForm with Stripe Elements implemented
- Database: Schema with Stripe fields ready
- Webhook: All event handlers implemented
- Tests: 316 passing for payments module

## Verification Steps

### 1. Environment Variables (5 min)
- [ ] Verify `STRIPE_SECRET_KEY` in Vercel env vars
- [ ] Verify `STRIPE_WEBHOOK_SECRET` in Vercel env vars
- [ ] Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel env vars
- [ ] Verify webhook endpoint URL configured in Stripe dashboard

### 2. Payment Flow Test (10 min)
- [ ] Open production site: https://ori-platform-b57ndkgou-carlo-spada.vercel.app
- [ ] Navigate to pricing/signup page
- [ ] Select a plan (use test plan if available)
- [ ] Fill Stripe test card: `4242 4242 4242 4242`
- [ ] Verify Setup Intent created
- [ ] Verify Payment Element loads
- [ ] Submit payment
- [ ] Verify subscription created
- [ ] Check user dashboard shows active subscription

### 3. Webhook Verification (10 min)
- [ ] Check Vercel logs for webhook events
- [ ] Verify database updated with subscription_status
- [ ] Test webhook with Stripe CLI: `stripe listen --forward-to https://...`
- [ ] Trigger test events: `stripe trigger checkout.session.completed`

### 4. Error Handling (5 min)
- [ ] Test with declined card: `4000 0000 0000 0002`
- [ ] Verify error message shows to user
- [ ] Verify no subscription created in database

## Acceptance Criteria

- [ ] User can complete full payment flow in production
- [ ] Database updates correctly via webhooks
- [ ] Error handling works for failed payments
- [ ] Webhook signature verification works
- [ ] User sees correct subscription status in dashboard

## Troubleshooting Checklist

If issues found:
- [ ] Check Vercel deployment logs
- [ ] Check Stripe dashboard for API errors
- [ ] Verify environment variables match between services
- [ ] Check CORS settings for API calls
- [ ] Verify subdomain routing (app.getori.app vs getori.app)

## Related Files

- `services/core-api/src/routes/setupIntent.ts`
- `services/core-api/src/routes/subscriptions.ts`
- `services/core-api/src/routes/payments.ts` (webhook)
- `src/components/payments/PaymentForm.tsx`
- `src/integrations/api/payments.ts`

## Documentation to Update

After verification:
- [ ] Document production webhook URL
- [ ] Note any production-specific gotchas
- [ ] Update deployment checklist if needed
