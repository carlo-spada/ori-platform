---
Task ID: A
Feature: Stripe Webhook Documentation
Title: Create Comprehensive Stripe Webhook Setup and Testing Guide
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: Low
---

### Objective

Create detailed documentation for setting up, testing, and troubleshooting Stripe webhooks in both development and production environments.

### Context

While CLAUDE.md mentions that the webhook must be placed before `express.json()` middleware, there's no comprehensive guide on:
- Setting up webhooks locally with Stripe CLI
- Registering webhooks in Stripe dashboard
- Testing webhook events
- Troubleshooting common issues
- Managing webhook secrets

This documentation will help developers (and future you) set up the payment system quickly and correctly.

### Files to Create

- `docs/STRIPE_WEBHOOK_SETUP.md` - Main documentation file
- `scripts/test-webhook.sh` - Script to test webhooks locally (optional)
- `.env.example` - Update with webhook secret variable

### Documentation Structure

The guide should cover:

1. **Overview**
   - What are Stripe webhooks
   - Why they're important
   - Events we handle

2. **Local Development Setup**
   - Installing Stripe CLI
   - Logging in to Stripe
   - Forwarding webhooks to localhost
   - Testing webhook events

3. **Production Setup**
   - Creating webhook endpoint in Stripe dashboard
   - Configuring endpoint URL
   - Selecting events to monitor
   - Managing webhook secrets

4. **Testing Guide**
   - Testing payment success flow
   - Testing payment failure
   - Testing subscription updates
   - Using Stripe test cards

5. **Troubleshooting**
   - Common errors and solutions
   - Webhook signature verification failures
   - Missing webhook secret
   - Timeout issues

### Implementation Steps

#### 1. Create Main Documentation File

`docs/STRIPE_WEBHOOK_SETUP.md`:

```markdown
# Stripe Webhook Setup Guide

## Overview

Stripe webhooks notify our application when events occur in Stripe (payments, subscriptions, etc.). This guide covers setup for both development and production.

### Events We Handle

- `checkout.session.completed` - Payment successful
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_failed` - Payment failed
- `customer.source.expiring` - Payment method expiring

## Local Development Setup

### 1. Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget -qO- https://github.com/stripe/stripe-cli/releases/download/vX.X.X/stripe_X.X.X_linux_x86_64.tar.gz | tar xz
```

**Windows:**
Download from: https://github.com/stripe/stripe-cli/releases

### 2. Login to Stripe CLI

```bash
stripe login
```

This opens a browser to authorize the CLI with your Stripe account.

### 3. Start Webhook Forwarding

```bash
stripe listen --forward-to localhost:3001/api/v1/payments/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 4. Update Environment Variables

Copy the webhook secret to `services/core-api/.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 5. Start Your Application

```bash
# Terminal 1: Keep webhook forwarding running
stripe listen --forward-to localhost:3001/api/v1/payments/webhook

# Terminal 2: Start core-api
cd services/core-api
pnpm dev

# Terminal 3: Start frontend
pnpm dev
```

## Testing Webhooks Locally

### Test Payment Success

```bash
stripe trigger checkout.session.completed
```

Check your terminal - you should see webhook handling logs.

### Test Payment Failure

```bash
stripe trigger invoice.payment_failed
```

### Test with Real Checkout Flow

1. Go to http://localhost:3000/select-plan
2. Choose a plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Use any future expiry date and CVC
5. Complete checkout
6. Check terminal for webhook event

### Stripe Test Cards

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155
- **Insufficient funds:** 4000 0000 0000 9995

Full list: https://stripe.com/docs/testing

## Production Setup

### 1. Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Switch to **Live mode** (toggle in sidebar)
3. Navigate to **Developers → Webhooks**

### 2. Add Endpoint

1. Click **Add endpoint**
2. Enter endpoint URL: `https://getori.app/api/v1/payments/webhook`
3. Click **Select events**
4. Add these events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
   - customer.source.expiring
5. Click **Add endpoint**

### 3. Get Webhook Secret

1. Click on your newly created endpoint
2. Click **Reveal** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### 4. Update Production Environment

Add to your production environment variables (Vercel, Railway, etc.):

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Important:** Use the LIVE mode secret for production!

### 5. Verify Endpoint

1. In Stripe dashboard, click **Send test webhook**
2. Select `checkout.session.completed`
3. Click **Send test webhook**
4. Check response status (should be 200)

## Webhook Implementation Details

### Why Before express.json()?

The Stripe webhook endpoint MUST be registered before `express.json()` middleware because:

1. Stripe sends webhooks with `raw` body
2. Signature verification requires the raw request body
3. `express.json()` parses the body, breaking verification

Our implementation in `services/core-api/src/index.ts`:

```typescript
// ✅ CORRECT ORDER
app.use('/api/v1/payments/webhook', paymentWebhookRoutes)
app.use(express.json())
app.use('/api/v1', router)
```

### Signature Verification

We verify webhooks using:

```typescript
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  webhookSecret
)
```

This prevents attackers from sending fake webhook events.

## Troubleshooting

### Error: "No signatures found matching the expected signature"

**Cause:** Webhook secret mismatch or body parsing issue

**Solutions:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard
2. Ensure webhook route is BEFORE `express.json()`
3. Check that you're using the correct secret (test vs live mode)

### Error: "Webhook signing secret not configured"

**Cause:** Missing environment variable

**Solution:** Add `STRIPE_WEBHOOK_SECRET` to `.env`

### Webhooks Not Arriving Locally

**Cause:** Stripe CLI not running or wrong port

**Solutions:**
1. Restart `stripe listen` command
2. Verify port matches your server (3001)
3. Check firewall settings

### Production Webhooks Failing

**Cause:** URL unreachable, timeout, or secret mismatch

**Solutions:**
1. Verify your production URL is publicly accessible
2. Check Vercel/Railway logs for errors
3. Ensure correct LIVE mode webhook secret
4. Test endpoint with Stripe dashboard "Send test webhook"

### Checking Webhook Logs in Stripe

1. Go to **Developers → Webhooks**
2. Click on your endpoint
3. View **Recent events** tab
4. Click on individual events to see request/response

## Security Best Practices

1. **Always verify signatures** - Never trust webhook data without verification
2. **Use HTTPS in production** - Stripe requires HTTPS for webhooks
3. **Keep secrets secure** - Never commit webhook secrets to git
4. **Rotate secrets regularly** - Update webhook secrets periodically
5. **Log webhook events** - Keep audit trail of all webhook processing
6. **Handle idempotency** - Same event may be sent multiple times

## Event Handling Checklist

For each webhook event, ensure:
- [ ] Event signature is verified
- [ ] Event is parsed correctly
- [ ] Database is updated
- [ ] User is notified (if applicable)
- [ ] Response is sent quickly (<500ms)
- [ ] Errors are logged
- [ ] Idempotency is handled

## Useful Commands

```bash
# List all webhook events
stripe events list

# View specific event
stripe events retrieve evt_xxxxxxxxxxxxx

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted

# View webhook endpoint logs
stripe logs tail --filter-event checkout.session.completed
```

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Event Types Reference](https://stripe.com/docs/api/events/types)

## Support

If you encounter issues not covered here:
1. Check Stripe dashboard webhook logs
2. Review server logs for errors
3. Test with Stripe CLI triggers
4. Contact Stripe support (dashboard chat)
```

#### 2. Update .env.example

Add webhook secret to `.env.example`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### 3. Create Quick Setup Script (Optional)

`scripts/setup-stripe-webhooks.sh`:

```bash
#!/bin/bash
echo "🔧 Setting up Stripe webhooks for local development..."

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found. Install it first:"
    echo "   brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Login to Stripe
echo "📝 Logging in to Stripe..."
stripe login

# Get webhook secret
echo "🔐 Starting webhook forwarding..."
echo ""
echo "Copy the webhook secret (whsec_xxx) to services/core-api/.env"
echo ""

stripe listen --forward-to localhost:3001/api/v1/payments/webhook
```

### Acceptance Criteria

- Documentation covers both development and production setup
- Step-by-step instructions with code examples
- Troubleshooting section addresses common issues
- Testing guide with example commands
- Security best practices included
- Links to official Stripe resources
- Screenshots or diagrams (optional but helpful)
- Tested by following the guide from scratch

### Technical Notes

- Keep documentation up-to-date when webhook events change
- Include version info for Stripe CLI
- Document any platform-specific quirks (Vercel, Railway)
- Consider adding video walkthrough for complex parts

### Estimated Effort

2-3 hours (including writing, testing, and refinement)
