# Deploy Core API to Production

**Status**: IN PROGRESS
**Priority**: CRITICAL BLOCKER
**Estimated**: 2 hours
**Owner**: Claude
**Blocks**: Stripe verification, payment flow, production launch

## Problem

The Core API backend (`services/core-api`) is not deployed to production. This breaks:
- ❌ Stripe payment flow (Setup Intent, Subscription endpoints)
- ❌ Webhook processing (payment confirmations)
- ❌ All API endpoints (jobs, applications, profiles)
- ❌ Frontend API calls return 404/CORS errors

**Current State**:
- Frontend deployed: ✅ https://ori-platform-b57ndkgou-carlo-spada.vercel.app
- Backend deployed: ❌ NOT DEPLOYED

## Platform Options Analysis

### Option A: DigitalOcean App Platform ⭐ RECOMMENDED

**Pros**:
- Always-on Node.js server (no cold starts)
- Perfect for webhooks (long-running connections)
- Affordable: $5-12/month
- Easy deployment from GitHub
- Auto-scaling available
- Built-in metrics/logs
- Can colocate with managed PostgreSQL if needed

**Cons**:
- Separate platform to manage
- Need to configure CORS for frontend
- Requires payment method

**Pricing**:
- Basic: $5/month (512MB RAM, 1 vCPU)
- Professional: $12/month (1GB RAM, 1 vCPU) ← Recommended
- Free $200 credit for new accounts

**Deployment Steps**:
1. Connect GitHub repository
2. Select `services/core-api` as source
3. Set build command: `pnpm install && pnpm build`
4. Set run command: `node dist/index.js`
5. Configure environment variables
6. Deploy

**Time to Deploy**: 30-45 minutes

### Option B: Railway

**Pros**:
- Modern platform, great DX
- Free tier: $5/month credit
- GitHub integration
- Auto-deploy on push
- Good for Node.js/Express

**Cons**:
- Can get expensive quickly (usage-based)
- Free tier limited ($5 credit)

**Pricing**:
- Starter: $5/month credit (usage-based after)
- Developer: $20/month minimum

**Time to Deploy**: 20-30 minutes

### Option C: Fly.io

**Pros**:
- Edge deployment (low latency)
- Free tier available
- Good for containerized apps
- Global deployment

**Cons**:
- Learning curve (Dockerfiles)
- Free tier has sleep behavior
- Complex pricing model

**Pricing**:
- Free tier: 3 shared-cpu VMs, 3GB storage
- Paid: ~$2-10/month for always-on

**Time to Deploy**: 45-60 minutes (need Dockerfile)

### Option D: Vercel Serverless Functions ❌ NOT RECOMMENDED

**Pros**:
- Same platform as frontend
- Zero config deployment
- Auto-scaling

**Cons**:
- ❌ 10-second timeout limit (breaks long webhooks)
- ❌ Cold starts (bad for webhooks)
- ❌ Not ideal for Express apps
- ❌ Stateless (no background jobs)

**Verdict**: Not suitable for our use case (webhooks, background jobs)

## Recommendation: DigitalOcean App Platform

**Why**:
1. **Webhook-friendly**: Always-on, no timeouts
2. **Affordable**: $5-12/month predictable pricing
3. **Easy setup**: GitHub integration, minimal config
4. **Reliable**: Built for production workloads
5. **Scalable**: Can upgrade as we grow

## Deployment Plan (DigitalOcean)

### Phase 1: Preparation (15 minutes)

#### 1. Create DigitalOcean Account
- Go to: https://cloud.digitalocean.com/registrations/new
- Use GitHub to sign up (easier)
- Get $200 free credit (new accounts)

#### 2. Prepare Environment Variables
Create `.env.production` locally (DON'T commit):

```bash
# Server
NODE_ENV=production
PORT=8080

# Supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key  # or sk_live_ for production
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend (for CORS)
FRONTEND_URL=https://ori-platform-b57ndkgou-carlo-spada.vercel.app
# OR custom domain: https://app.getori.app

# AI Engine (optional)
AI_ENGINE_URL=http://localhost:3002  # Update when AI engine deployed
```

#### 3. Verify Build Works Locally
```bash
cd services/core-api
pnpm install
pnpm build
node dist/index.js
# Should start without errors
```

### Phase 2: Deployment (30 minutes)

#### Step 1: Create App on DigitalOcean (10 min)

1. Go to: https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Choose "GitHub" as source
4. Select repository: `carlo-spada/ori-platform`
5. Branch: `main` (or `dev` for testing first)
6. **Source Directory**: `services/core-api` ← IMPORTANT
7. App type: Web Service
8. Environment: Node.js

#### Step 2: Configure Build Settings (5 min)

**Build Command**:
```bash
pnpm install && pnpm build
```

**Run Command**:
```bash
node dist/index.js
```

**Port**: 8080 (DigitalOcean default)

**Dockerfile**: Not needed (use Node.js buildpack)

#### Step 3: Add Environment Variables (10 min)

In DigitalOcean dashboard, add all env vars from `.env.production`:
- NODE_ENV
- PORT
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- FRONTEND_URL

**Security**: Mark sensitive vars as "encrypted" in DigitalOcean

#### Step 4: Deploy (5 min)

1. Click "Create Resources"
2. Wait for deployment (~3-5 minutes)
3. Get deployment URL: `https://your-app-name.ondigitalocean.app`
4. Test health endpoint: `curl https://your-app-name.ondigitalocean.app/health`

### Phase 3: Configuration Updates (15 minutes)

#### 1. Update Frontend Environment Variables in Vercel

Go to Vercel Dashboard → ori-platform → Settings → Environment Variables

Update:
```bash
NEXT_PUBLIC_API_URL=https://your-app-name.ondigitalocean.app
```

**IMPORTANT**: Must redeploy frontend after this change!

```bash
git commit --allow-empty -m "chore: trigger frontend redeploy after API URL update"
git push origin main
```

#### 2. Update Stripe Webhook URL

Go to Stripe Dashboard → Webhooks:
1. Edit existing webhook OR create new one
2. URL: `https://your-app-name.ondigitalocean.app/api/payments/webhook`
3. Events: Select all subscription and payment events
4. Copy webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in DigitalOcean

#### 3. Update CORS Configuration (if needed)

In `services/core-api/src/index.ts`, verify CORS allows frontend:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Should already be correct, but verify.

### Phase 4: Verification (20 minutes)

#### Test 1: Health Check
```bash
curl https://your-app-name.ondigitalocean.app/health
# Expected: {"status":"ok"}
```

#### Test 2: API Endpoints
```bash
# Get Stripe Setup Intent (requires auth token)
curl -X POST https://your-app-name.ondigitalocean.app/api/v1/setup-intent \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"planId":"plus_monthly"}'
```

#### Test 3: Webhook Endpoint
```bash
# Use Stripe CLI to test webhook
stripe listen --forward-to https://your-app-name.ondigitalocean.app/api/payments/webhook
stripe trigger checkout.session.completed
# Check DigitalOcean logs for webhook processing
```

#### Test 4: Frontend Integration
1. Open frontend: https://ori-platform-b57ndkgou-carlo-spada.vercel.app
2. Login
3. Go to /select-plan
4. Try to select a plan
5. Should see Stripe payment form load
6. (Don't complete payment yet - just verify form loads)

## Acceptance Criteria

- [ ] Core API deployed to DigitalOcean
- [ ] Health endpoint returns 200 OK
- [ ] All environment variables configured
- [ ] Frontend updated with new API_URL
- [ ] Frontend redeployed with new env vars
- [ ] Stripe webhook URL updated
- [ ] Webhook test successful
- [ ] CORS configured correctly
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Payment form loads in production
- [ ] Logs show no errors

## Monitoring & Debugging

### View Logs
- DigitalOcean Dashboard → App → Runtime Logs
- Look for startup messages, errors, webhook events

### Common Issues

**1. "Cannot connect to database"**
- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- Verify Supabase allows connections from DigitalOcean IPs
- Check RLS policies

**2. "CORS error" in frontend**
- Verify FRONTEND_URL matches actual frontend URL
- Check CORS configuration in core-api
- Ensure frontend API_URL is correct

**3. "Webhook signature verification failed"**
- Ensure STRIPE_WEBHOOK_SECRET matches Stripe dashboard
- Check webhook URL is correct
- Verify raw body parsing is enabled

**4. "Module not found" errors**
- Check build command includes `pnpm install`
- Verify `dist/` folder is created
- Check tsconfig.json paths are correct

## Cost Estimate

**Monthly Costs** (production-ready):
- DigitalOcean App Platform: $12/month (Professional tier)
- Supabase: $0 (free tier) or $25/month (Pro)
- Vercel: $0 (Hobby tier) or $20/month (Pro)
- **Total**: $12-57/month depending on tier choices

**Development Costs**: $5-10/month (basic tiers)

## Next Steps After Deployment

1. ✅ Resume Stripe verification (Task 02)
2. Test full payment flow end-to-end
3. Set up custom domain (app.getori.app)
4. Configure production Stripe keys (when ready to go live)
5. Set up error monitoring (Sentry or Bugsnag)
6. Configure auto-deployment from `main` branch

## Security Checklist

- [ ] All sensitive env vars marked as encrypted
- [ ] Supabase service role key not exposed
- [ ] Stripe secret keys secure
- [ ] CORS only allows trusted origins
- [ ] RLS policies enabled on Supabase tables
- [ ] Webhook signatures verified
- [ ] Rate limiting configured (if needed)
- [ ] HTTPS only (DigitalOcean does this automatically)

## Rollback Plan

If deployment fails:
1. Check logs in DigitalOcean dashboard
2. Revert to previous deployment (DigitalOcean keeps history)
3. Or: Delete app and redeploy from scratch
4. Frontend will fall back to 404s (graceful degradation)

## Documentation to Update

After successful deployment:
- [ ] Update README.md with production API URL
- [ ] Update .env.example with DigitalOcean placeholders
- [ ] Document deployment process in DEPLOYMENT.md
- [ ] Add DigitalOcean credentials to team password manager

## Status Tracking

- [ ] DigitalOcean account created
- [ ] Environment variables prepared
- [ ] App created and deployed
- [ ] Environment variables configured
- [ ] Frontend API_URL updated
- [ ] Frontend redeployed
- [ ] Stripe webhook updated
- [ ] Verification tests passed
- [ ] Production monitoring set up
- [ ] Documentation updated
