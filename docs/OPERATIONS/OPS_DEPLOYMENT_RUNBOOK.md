---
type: operational-guide
role: guide
scope: all
audience: devops
last-updated: 2025-11-10
relevance: operations, deployment, runbook.md, runbook, table, contents, overview
priority: medium
quick-read-time: 13min
deep-dive-time: 22min
---

# Deployment Runbook

Comprehensive guide for deploying the Ori Platform to production.

---

## Table of Contents

1. [Overview](#overview)
2. [Deployment Architecture](#deployment-architecture)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Deployment Procedures](#deployment-procedures)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Rollback Procedures](#rollback-procedures)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Deployment Configuration](#deployment-configuration)
9. [Monitoring & Observability](#monitoring--observability)

---

## Overview

### Current Deployment Status

**⚠️ Important Notes**:
- Vercel auto-deploys are currently **over-configured** - too many triggers waste resources
- Google Cloud Run for AI Engine is **not fully implemented** yet
- Deployments should be **explicit** (on-demand), not automatic on every push/PR/commit
- See [Deployment Configuration](#deployment-configuration) for controlling auto-deploys

### Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Development Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Local Dev ─→ Feature Branch ─→ PR to dev ─→ Merge to dev  │
│                                                              │
│  dev branch ─→ PR to main ─→ Approval ─→ Merge to main     │
│                                      │                       │
│                                      ↓                       │
│                          GitHub Actions Triggered            │
│                                      │                       │
│                  ┌───────────────────┴───────────────┐      │
│                  ↓                   ↓               ↓      │
│             Verify Code         Deploy Frontend   Deploy    │
│           (lint, build)         (Vercel)          AI Engine │
│                  │                   │               │      │
│                  └───────────────────┴───────────────┘      │
│                              ↓                               │
│                    Run Database Migrations                   │
│                    (Supabase)                                │
│                              ↓                               │
│                    ✅ Production Deployed                    │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Targets

| Service | Platform | Trigger | URL | Status |
|---------|----------|---------|-----|--------|
| Frontend (Next.js) | Vercel | Merge to `main` | https://app.getori.app | ✅ Automated |
| Marketing Site | Vercel | Merge to `main` | https://getori.app | ✅ Automated |
| Core API | Vercel Serverless | Merge to `main` | https://app.getori.app/api | ✅ Automated |
| AI Engine | Google Cloud Run | Merge to `main` | (Cloud Run URL) | ⚠️ Not fully implemented |
| Database | Supabase | Manual or CI | N/A (managed) | ✅ Automated migrations |

---

## Deployment Architecture

### Production Stack

```
┌────────────────────────────────────────────────────────────┐
│                         Internet                            │
└────────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    Marketing                         Application
  getori.app                       app.getori.app
        │                                 │
        └────────────┬────────────────────┘
                     │
            ┌────────▼─────────┐
            │  Vercel CDN      │
            │  (Next.js 16)    │
            └────────┬─────────┘
                     │
        ┌────────────┴────────────────┐
        │                             │
   ┌────▼──────┐            ┌─────────▼────────┐
   │  Frontend │            │   Serverless API │
   │  (React)  │◄───────────┤   (Core API)     │
   └────┬──────┘            └─────────┬────────┘
        │                             │
        │                   ┌─────────┴─────────┐
        │                   │                   │
   ┌────▼──────┐     ┌──────▼─────┐    ┌───────▼────────┐
   │ Supabase  │     │  Stripe    │    │  Google Cloud  │
   │  (Auth +  │     │  (Payments)│    │  Run           │
   │   DB)     │     └────────────┘    │  (AI Engine)   │
   └───────────┘                       └────────────────┘
```

### Subdomain Routing

- `getori.app` → Marketing pages (landing, pricing, about, blog)
- `app.getori.app` → Application pages (dashboard, profile, applications)
- Routing handled by Next.js middleware (`src/middleware.ts`)
- No manual DNS configuration needed after initial setup

---

## Pre-Deployment Checklist

### Code Quality Checks

Run these locally **before** creating a PR:

```bash
# 1. Format check
pnpm format:check

# 2. Lint all code
pnpm lint

# 3. Build all packages
pnpm build

# 4. Run tests (when available)
pnpm test

# 5. Verify types
pnpm typecheck  # If available
```

### Required Verifications

- [ ] All tests passing locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Code formatted with Prettier
- [ ] Environment variables documented in `.env.example`
- [ ] Breaking changes documented
- [ ] Database migrations tested locally (if applicable)
- [ ] Stripe webhooks tested (if payment changes)

### Branch Status

- [ ] All changes committed and pushed
- [ ] PR created from `dev` to `main`
- [ ] PR approved by reviewer
- [ ] All CI checks passing (GitHub Actions)
- [ ] No merge conflicts

### Environment Variables

- [ ] All new env vars added to Vercel
- [ ] Environment variables match across all environments
- [ ] Secrets rotated if needed
- [ ] `.env.example` files updated

---

## Deployment Procedures

### 1. Standard Production Deployment

**Trigger**: Merge PR from `dev` to `main`

**Steps**:

1. **Create Pull Request**:
   ```bash
   # Ensure you're on dev branch
   git checkout dev
   git pull origin dev

   # Create PR via GitHub UI or gh CLI
   gh pr create --base main --head dev --title "Deploy: [Brief description]" --body "Production deployment for [features/fixes]"
   ```

2. **Wait for CI Checks**:
   - GitHub Actions will run automatically
   - Workflow: `.github/workflows/pull-request-ci.yml`
   - Checks:
     - ✓ Linting
     - ✓ Build
     - ✓ Tests (when available)
   - **Do not proceed** if checks fail

3. **Get PR Approval**:
   - Request review from team member
   - Wait for approval (required by branch protection)
   - Address any review feedback

4. **Merge to Main**:
   ```bash
   # Via GitHub UI (recommended) or CLI
   gh pr merge --auto --squash
   ```

5. **Automatic Deployment** (GitHub Actions runs):
   - Workflow: `.github/workflows/deploy-production.yml`
   - Steps:
     1. Verify code quality (lint, build)
     2. Deploy frontend to Vercel
     3. Deploy AI Engine to Cloud Run (⚠️ not fully implemented)
     4. Run database migrations (Supabase)
   - Duration: ~5-10 minutes

6. **Verify Deployment**:
   - See [Post-Deployment Verification](#post-deployment-verification)

### 2. Hotfix Deployment

For urgent production fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix-name

# 2. Make the fix
# ... edit files ...

# 3. Commit and push
git add .
git commit -m "hotfix: [description of fix]"
git push origin hotfix/critical-fix-name

# 4. Create PR directly to main
gh pr create --base main --head hotfix/critical-fix-name \
  --title "HOTFIX: [description]" \
  --body "Urgent fix for [issue]"

# 5. Get expedited review and merge
# 6. Deployment triggers automatically

# 7. Backport to dev
git checkout dev
git merge main
git push origin dev
```

### 3. Manual Vercel Deployment

If you need to deploy without merging to main:

```bash
# Install Vercel CLI (if not already installed)
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy to preview (doesn't affect production)
vercel

# Deploy to production (use with caution!)
vercel --prod
```

### 4. Database Migration Deployment

**Automated** (via GitHub Actions):
- Migrations run automatically after frontend/backend deployment
- Workflow: `.github/workflows/deploy-production.yml` (line 77-94)

**Manual** (if needed):

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link to project
supabase link --project-ref zvngsecxzcgxafbzjewh

# 4. Create new migration (optional)
supabase migration new migration_name

# 5. Apply migrations to production
supabase db push

# 6. Verify migration
supabase db diff
```

**⚠️ Migration Best Practices**:
- Always test migrations locally first
- Create backups before major schema changes
- Use `IF NOT EXISTS` clauses when possible
- Avoid breaking changes (drop columns, change types)
- Use separate migrations for up/down operations

### 5. AI Engine Deployment (⚠️ Not Fully Implemented)

**Current Status**: Not fully implemented

**When implemented**, deployment will be:

```bash
# Automatic via GitHub Actions
# Workflow: .github/workflows/deploy-ai-engine.yml

# Manual deployment (if needed):
gcloud auth login
gcloud config set project gen-lang-client-0437962165

# Build and push image
gcloud builds submit --region us-central1 \
  --tag gcr.io/gen-lang-client-0437962165/ai-engine \
  services/ai-engine

# Deploy to Cloud Run
gcloud run deploy ai-engine \
  --image gcr.io/gen-lang-client-0437962165/ai-engine \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production,LOG_LEVEL=WARNING,CORE_API_URL=https://app.getori.app/api,FRONTEND_URL=https://app.getori.app"
```

---

## Post-Deployment Verification

### Automated Checks

GitHub Actions automatically verifies:
- ✓ Build succeeded
- ✓ Lint passed
- ✓ Tests passed (when available)

### Manual Verification (5 minutes)

**1. Vercel Deployment Status**:
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Check deployment status is "Ready"
- Note deployment URL and time

**2. Frontend Health Check**:
```bash
# Check site is accessible
curl -I https://getori.app
curl -I https://app.getori.app

# Should return: HTTP/2 200
```

**3. Core API Health Check**:
```bash
# Test API endpoint
curl https://app.getori.app/api/health

# Expected response:
# {"status": "ok", "timestamp": "..."}
```

**4. Authentication Test**:
- Navigate to https://app.getori.app/login
- Attempt to sign in with test account
- Verify successful authentication
- Check dashboard loads correctly

**5. Database Connectivity**:
- Go to [Supabase Dashboard](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh)
- Check "Database" → "Connections" for active connections
- Verify no error logs in "Logs" section

**6. Stripe Integration** (if payment changes):
```bash
# Test checkout endpoint
curl -X POST https://app.getori.app/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"priceId": "price_test_..."}'

# Verify webhook endpoint
# Go to Stripe Dashboard → Webhooks
# Check recent events are being received
```

**7. Browser Testing**:
- Clear browser cache
- Test on multiple browsers (Chrome, Safari, Firefox)
- Test on mobile device
- Verify:
  - Landing page loads
  - Authentication works
  - Dashboard displays data
  - Navigation functions correctly
  - No console errors

### Performance Checks

```bash
# Run Lighthouse audit
npx lighthouse https://app.getori.app --view

# Check key metrics:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 90
# - SEO: > 90
```

### Error Monitoring

**Vercel Logs**:
- Dashboard → Project → Logs
- Filter: "Errors" in last 1 hour
- Verify no new errors after deployment

**Supabase Logs**:
- Dashboard → Logs → API Logs
- Check for authentication errors
- Verify no database errors

---

## Rollback Procedures

### Automatic Rollback (Vercel)

**Vercel automatically promotes the last successful deployment** if a new deployment fails. No manual intervention needed.

**If a deployment succeeds but has bugs**:

1. **Instant Rollback via Vercel UI** (Recommended):
   ```
   1. Go to Vercel Dashboard → Project → Deployments
   2. Find the last working deployment
   3. Click "..." menu → "Promote to Production"
   4. Confirm promotion
   5. Deployment is live in ~30 seconds
   ```

2. **Git Revert + Redeploy**:
   ```bash
   # Revert the problematic merge commit
   git checkout main
   git pull origin main
   git revert HEAD  # Or specific commit SHA
   git push origin main

   # GitHub Actions will automatically deploy the revert
   ```

3. **Hotfix Branch**:
   ```bash
   # Create hotfix from last working commit
   git checkout main
   git pull origin main
   git checkout -b hotfix/rollback-[issue]
   git revert [problematic-commit-sha]
   git push origin hotfix/rollback-[issue]

   # Create PR to main, merge, auto-deploy
   ```

### Database Rollback

**⚠️ Warning**: Database rollbacks are complex and risky.

**For schema changes**:
```bash
# 1. Create down migration
supabase migration new revert_[original_migration_name]

# 2. Write SQL to revert changes
# Example: ALTER TABLE users DROP COLUMN new_column;

# 3. Test locally
supabase db reset

# 4. Apply to production
supabase db push
```

**For data changes**:
- Use Supabase's Time Travel feature (Point-in-Time Recovery)
- Go to Dashboard → Database → Backups
- Restore from backup before problematic change

**Best Practice**: Avoid schema changes in hotfixes. Use feature flags instead.

### AI Engine Rollback (When Implemented)

```bash
# Roll back to previous Cloud Run revision
gcloud run services update-traffic ai-engine \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region us-central1
```

---

## Common Issues & Solutions

### Issue 1: Build Timeout

**Symptoms**:
- Vercel build exceeds 15-minute limit
- GitHub Actions timeout after 10 minutes

**Solutions**:
```bash
# 1. Clear Vercel build cache
# Dashboard → Settings → General → Clear Build Cache

# 2. Optimize dependencies
pnpm prune

# 3. Use Turbo cache
# Already configured in project

# 4. Split large files
# Move heavy dependencies to dynamic imports
```

### Issue 2: Environment Variable Issues

**Symptoms**:
- "Environment variable not defined" errors
- API calls fail with 401/403
- Stripe/Supabase connection errors

**Solutions**:
```bash
# 1. Verify env vars in Vercel
# Dashboard → Settings → Environment Variables
# Check "Production" environment specifically

# 2. Redeploy after env var changes
vercel --prod

# 3. Check .env.example matches actual usage
grep -r "process.env" src/ services/

# 4. Verify GitHub Secrets
# Repository → Settings → Secrets and variables → Actions
```

### Issue 3: Database Migration Failure

**Symptoms**:
- Migration fails in CI/CD
- Database schema out of sync
- SQL errors in Supabase logs

**Solutions**:
```bash
# 1. Check migration syntax locally
supabase db reset
supabase db push

# 2. Check for missing dependencies
# Ensure migrations run in correct order

# 3. Manual migration
supabase db push --debug

# 4. Check Supabase connection
# Verify SUPABASE_DB_PASSWORD and SUPABASE_PROJECT_ID secrets
```

### Issue 4: CORS Errors

**Symptoms**:
- API calls fail with CORS errors in browser console
- "Access-Control-Allow-Origin" errors

**Solutions**:
```bash
# 1. Verify FRONTEND_URL in Core API .env
# Should match production URL: https://app.getori.app

# 2. Check Supabase CORS settings
# Dashboard → Settings → API → CORS Allowed Origins

# 3. Update Vercel headers (if needed)
# In next.config.js, add headers configuration
```

### Issue 5: Stripe Webhook Failures

**Symptoms**:
- Payments succeed but not reflected in app
- Webhook signature verification fails

**Solutions**:
```bash
# 1. Verify webhook endpoint URL
# Stripe Dashboard → Webhooks
# Should be: https://app.getori.app/api/v1/webhooks/stripe

# 2. Check STRIPE_WEBHOOK_SECRET
# Must match webhook endpoint secret in Stripe

# 3. Test webhook locally
stripe listen --forward-to localhost:3001/api/v1/webhooks/stripe

# 4. Check webhook logs in Stripe
# Dashboard → Webhooks → Click endpoint → Logs
```

### Issue 6: Next.js Build Errors

**Symptoms**:
- TypeScript errors in build
- Module not found errors
- Build succeeds locally but fails in CI

**Solutions**:
```bash
# 1. Clear all caches
rm -rf .next
rm -rf node_modules/.cache
pnpm install

# 2. Verify all dependencies installed
pnpm install --frozen-lockfile

# 3. Check for missing dependencies
pnpm list

# 4. Build with verbose logging
pnpm build --verbose
```

---

## Deployment Configuration

### Controlling Vercel Auto-Deploys

**⚠️ Current Issue**: Vercel auto-deploys are over-configured, wasting resources.

**To Control Auto-Deploys**:

1. **Disable Auto-Deploy on Push** (Recommended):
   - Vercel Dashboard → Project → Settings → Git
   - Under "Production Branch": Uncheck "Automatically deploy"
   - Deploy only on-demand via CLI: `vercel --prod`

2. **Configure Branch Deployments**:
   ```json
   // vercel.json
   {
     "git": {
       "deploymentEnabled": {
         "main": true,      // Auto-deploy main branch
         "dev": false,      // Don't auto-deploy dev
         "*": false         // Don't auto-deploy other branches
       }
     },
     "github": {
       "autoJobCancelation": true,  // Cancel outdated deployments
       "silent": true               // Don't comment on PRs
     }
   }
   ```

3. **Disable Preview Deployments**:
   - Settings → Git → "Deploy Previews"
   - Set to "Disabled" or "Only for Production Branch"

4. **Manual Deployment Workflow**:
   ```bash
   # Option 1: Via Vercel UI
   # Dashboard → Deployments → "Redeploy" button

   # Option 2: Via CLI
   vercel --prod

   # Option 3: Via GitHub Actions (current setup)
   # Merge PR to main → Automatic deployment
   ```

### GitHub Actions Configuration

**Current Workflows**:

| Workflow | Trigger | Purpose | Should Keep? |
|----------|---------|---------|--------------|
| `deploy-production.yml` | Merge to `main` | Deploy to production | ✅ Yes |
| `pull-request-ci.yml` | PR to `main` | Verify code quality | ✅ Yes |
| `deploy-ai-engine.yml` | Called by deploy-production | Deploy AI Engine | ⚠️ Not implemented yet |

**Recommended Changes**:

1. **Keep GitHub Actions for production deployment**:
   - Only triggers on merge to `main`
   - Provides quality checks before deployment
   - Automates migrations

2. **Disable Vercel's automatic deployments**:
   - Prevents duplicate deployments
   - Saves build minutes
   - More control over when deployments happen

3. **Configuration**:
   ```yaml
   # .github/workflows/deploy-production.yml (current setup)
   on:
     push:
       branches:
         - main  # Only deploy when main is updated
   ```

---

## Monitoring & Observability

### Current Monitoring Setup

**Status**: Minimal monitoring in place

**What's Available**:
- ✅ Vercel deployment status page
- ✅ Vercel function logs (basic)
- ✅ Supabase dashboard (auth, database logs)
- ❌ No formal error tracking (Sentry, etc.)
- ❌ No uptime monitoring
- ❌ No performance monitoring (beyond Vercel Analytics)

### Recommended Monitoring Stack

**Phase 1: Basic Monitoring** (0 cost):
1. **Vercel Logs**: Check for function errors
2. **Supabase Logs**: Monitor database and auth issues
3. **Stripe Dashboard**: Payment and webhook logs
4. **Browser Console**: Check for client-side errors

**Phase 2: Enhanced Monitoring** (when needed):
1. **Error Tracking**: Sentry (free tier)
2. **Uptime Monitoring**: UptimeRobot or BetterStack (free tier)
3. **Performance**: Vercel Analytics (included)
4. **Logs**: Logtail or Papertrail (free tier)

### Monitoring Checklist

**Daily**:
- [ ] Check Vercel deployment page for failed builds
- [ ] Scan Supabase logs for auth errors
- [ ] Review Stripe dashboard for payment issues

**After Deployment**:
- [ ] Verify deployment status is "Ready"
- [ ] Check for new errors in Vercel logs (last 1 hour)
- [ ] Test critical user flows (login, dashboard)
- [ ] Verify API health endpoints

**Weekly**:
- [ ] Review Vercel Analytics for traffic patterns
- [ ] Check Supabase database size and connections
- [ ] Review Stripe reports for payment trends

### Key Metrics to Monitor

| Metric | Target | How to Check |
|--------|--------|--------------|
| Uptime | > 99.9% | Manual checks (for now) |
| API Response Time | < 500ms | Vercel function logs |
| Error Rate | < 1% | Vercel logs / Supabase logs |
| Build Time | < 5 min | Vercel deployment page |
| Lighthouse Score | > 90 | Run manually: `npx lighthouse <url>` |

---

## Emergency Contacts

| Role | Contact | When to Contact |
|------|---------|-----------------|
| Platform Owner | Carlo | Critical production issues |
| Vercel Support | [Vercel Support](https://vercel.com/support) | Deployment failures, billing issues |
| Supabase Support | [Supabase Support](https://supabase.com/support) | Database issues, auth failures |
| Stripe Support | [Stripe Support](https://support.stripe.com/) | Payment processing issues |
| Google Cloud Support | [GCP Support](https://cloud.google.com/support) | AI Engine deployment (when implemented) |

---

## Deployment Decision Tree

```
Need to deploy changes?
│
├─ Is it a critical hotfix?
│  ├─ Yes → Create hotfix branch → PR to main → Merge → Auto-deploy
│  └─ No → Continue to next question
│
├─ Are changes tested locally?
│  ├─ Yes → Continue to next question
│  └─ No → Test locally first! (pnpm build, pnpm lint, pnpm test)
│
├─ Are environment variables needed?
│  ├─ Yes → Add to Vercel dashboard → Continue
│  └─ No → Continue to next question
│
├─ Does it include database migrations?
│  ├─ Yes → Test migration locally first → Continue
│  └─ No → Continue to next question
│
├─ Ready to deploy?
│  ├─ Yes → Create PR dev→main → Get approval → Merge → Auto-deploy
│  └─ No → Return to development
│
└─ Deployment complete!
   └─ Run post-deployment verification checklist
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All code changes tested locally
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` completes successfully
- [ ] `pnpm test` passes (when available)
- [ ] Environment variables added to Vercel (if new ones)
- [ ] Database migrations tested locally (if applicable)
- [ ] `.env.example` files updated
- [ ] PR created and approved
- [ ] All CI checks passing

### During Deployment

- [ ] GitHub Actions workflow started
- [ ] Verify step completed
- [ ] Frontend deployment succeeded
- [ ] AI Engine deployment succeeded (when implemented)
- [ ] Database migrations applied
- [ ] No errors in workflow logs

### Post-Deployment

- [ ] Vercel deployment status is "Ready"
- [ ] Frontend loads at https://app.getori.app
- [ ] Marketing site loads at https://getori.app
- [ ] API health check passes
- [ ] Authentication works
- [ ] Database connectivity verified
- [ ] No new errors in logs
- [ ] Critical user flows tested
- [ ] Team notified of deployment

---

## Additional Resources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Google Cloud Console**: https://console.cloud.google.com (for AI Engine when implemented)

**Related Documentation**:
- [`REFERENCE_ENV_VARS.md`](../REFERENCE/REFERENCE_ENV_VARS.md) - Environment variables reference
- [`CLAUDE.md`](../../CLAUDE.md) - Implementation guide
- [`AGENTS.md`](../../AGENTS.md) - Development workflow

---

**Last Updated**: 2025-11-10
**Version**: 1.0
**Maintainer**: Ori Platform Team
