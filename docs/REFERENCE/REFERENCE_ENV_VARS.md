# Environment Variables Reference

Complete guide to all environment variables used across the Ori Platform.

---

## Table of Contents

1. [Frontend (.env.local)](#frontend-envlocal)
2. [Core API (.env)](#core-api-env)
3. [AI Engine (.env)](#ai-engine-env)
4. [DeepL MCP Service (.env)](#deepl-mcp-service-env)
5. [CI/CD Secrets (GitHub Actions)](#cicd-secrets-github-actions)
6. [Vercel Environment Variables](#vercel-environment-variables)
7. [Quick Setup Guide](#quick-setup-guide)
8. [Security Best Practices](#security-best-practices)

---

## Frontend (.env.local)

Location: `/` (root directory)
File: `.env.local` (copy from `.env.example`)

### Required Variables

| Variable | Type | Description | Example | Where to Get |
|----------|------|-------------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | string | Supabase project URL | `https://abc123.supabase.co` | [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` | [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | string | Stripe publishable key (test mode) | `pk_test_51A...` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | string | `/api` | Core API URL (dev: `http://localhost:3001`) |
| `NEXT_PUBLIC_AI_ENGINE_URL` | string | - | AI Engine URL (dev: `http://localhost:3002`) |
| `NEXT_PUBLIC_APP_URL` | string | Auto-detected | App URL for canonical URLs |
| `NEXT_ENABLE_PWA` | boolean | `false` (dev) / `true` (prod) | Enable PWA features |
| `DEEPL_API_KEY` | string | - | DeepL translation API key (for automated translations) |
| `STRIPE_API_KEY` | string | - | Stripe test key for MCP server (dev only) |
| `STRIPE_WEBHOOK_SECRET` | string | - | Stripe webhook secret for MCP (dev only) |
| `RESEND_API_KEY` | string | - | Resend email API key for MCP (dev only) |
| `DATABASE_URL` | string | - | PostgreSQL connection for MCP (dev only) |
| `NEXT_BUILD_MODE` | string | `turbopack` | Build mode (`webpack` or `turbopack`) |

### Subdomain Configuration

The platform uses subdomain-based routing:

- **Marketing**: `https://getori.app` (landing, pricing, about)
- **Application**: `https://app.getori.app` (dashboard, profile)

**Important**: Add `https://app.getori.app/**` to Supabase redirect URLs:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to "Redirect URLs": `https://app.getori.app/**`
3. Add to "Site URL": `https://app.getori.app`

---

## Core API (.env)

Location: `services/core-api/`
File: `.env` (copy from `.env.example`)

### Required Variables

| Variable | Type | Description | Example | Where to Get |
|----------|------|-------------|---------|--------------|
| `PORT` | number | Server port | `3001` | Choose any available port |
| `NODE_ENV` | string | Node environment | `development` / `production` | Auto-set in production |
| `SUPABASE_URL` | string | Supabase project URL | `https://abc123.supabase.co` | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | string | **Service role key** (bypasses RLS) | `eyJhbGciOiJIUzI1NiIs...` | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API (⚠️ Keep secret!) |
| `STRIPE_SECRET_KEY` | string | Stripe secret key (test mode) | `sk_test_51A...` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | string | Webhook signature verification | `whsec_...` | [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks) → Add endpoint |
| `FRONTEND_URL` | string | Frontend origin for CORS | `http://localhost:3000` | Your frontend URL |
| `AI_ENGINE_URL` | string | AI Engine service URL | `http://localhost:3002` | Your AI Engine URL |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ALLOWED_ORIGINS` | string | `FRONTEND_URL` | Comma-separated CORS origins |
| `AI_ENGINE_TIMEOUT` | number | `30000` | AI Engine request timeout (ms) |
| `DATABASE_URL` | string | Uses Supabase | Direct PostgreSQL connection (if needed) |
| `LOG_LEVEL` | string | `info` | Logging level (`error`, `warn`, `info`, `debug`) |
| `RATE_LIMIT_MAX` | number | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | number | `900000` | Rate limit window (15 min) |
| `JWT_SECRET` | string | - | Custom JWT secret (if not using Supabase) |
| `JWT_EXPIRATION` | string | `7d` | JWT expiration time |

### MCP Development Variables (Optional)

For local MCP server development only:

| Variable | Type | Description |
|----------|------|-------------|
| `STRIPE_API_KEY` | string | Stripe test key for MCP |
| `RESEND_API_KEY` | string | Resend test key for MCP |

**Important**:
- Use **SERVICE_ROLE_KEY** (not anon key) for backend - it bypasses Row Level Security
- Never commit this key or expose it in frontend code
- Rotate immediately if accidentally exposed

---

## AI Engine (.env)

Location: `services/ai-engine/`
File: `.env` (copy from `.env.example`)

### Required Variables

| Variable | Type | Description | Example | Where to Get |
|----------|------|-------------|---------|--------------|
| `PORT` | number | Server port | `3002` | Choose any available port |
| `ENVIRONMENT` | string | Environment name | `development` / `production` | Manual configuration |
| `EMBEDDING_MODEL` | string | Sentence transformer model | `all-MiniLM-L6-v2` | [Hugging Face Models](https://huggingface.co/models) |
| `CORE_API_URL` | string | Core API URL for callbacks | `http://localhost:3001` | Your Core API URL |
| `FRONTEND_URL` | string | Frontend URL for CORS | `http://localhost:3000` | Your frontend URL |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `LOG_LEVEL` | string | `INFO` | Logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`) |
| `DEBUG_MODE` | boolean | `false` | Enable detailed request/response logging |
| `MAX_BATCH_SIZE` | number | `32` | Max batch size for embeddings |
| `WORKERS` | number | CPU cores | Number of worker processes |
| `API_TIMEOUT` | number | `30` | Timeout for external API calls (seconds) |
| `ENABLE_CACHE` | boolean | `true` | Enable embedding caching |
| `CACHE_TTL` | number | `3600` | Cache TTL (seconds) |
| `HEALTH_CHECK_INTERVAL` | number | `60` | Health check interval (seconds) |
| `ALLOWED_ORIGINS` | string | - | Additional CORS origins (comma-separated) |

### Model Configuration

**Available Models**:
- `all-MiniLM-L6-v2` (default) - Fast, lightweight, ~80MB
- `all-mpnet-base-v2` - Higher quality, ~420MB
- `multi-qa-mpnet-base-dot-v1` - Q&A optimized, ~420MB

**Model Storage**: Models are auto-downloaded on first run to `~/.cache/huggingface/`

### Google Cloud Run Configuration (Production)

When deployed to Cloud Run, these are automatically set:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | Auto-set by Cloud Run | Automatically configured |
| `ENVIRONMENT` | `production` | Set in deployment |
| `LOG_LEVEL` | `WARNING` or `ERROR` | Reduce log verbosity |

**Recommended Cloud Run Settings**:
- Memory: 2GB
- CPU: 2 vCPU
- Min instances: 0 (scale to zero)
- Max instances: 10
- Timeout: 300s (5 minutes)

---

## DeepL MCP Service (.env)

Location: `services/deepl-mcp/`
File: `.env` (copy from `.env.example`)

### Required Variables

| Variable | Type | Description | Example | Where to Get |
|----------|------|-------------|---------|--------------|
| `DEEPL_API_KEY` | string | DeepL API key | `c6ce738f-...-bd00` (Pro) or `...:fx` (Free) | [DeepL Pro API](https://www.deepl.com/pro-api) |
| `PORT` | number | Server port | `3002` | Choose any available port |

**DeepL API Key Formats**:
- **Pro Plan**: UUID format (e.g., `c6ce738f-0b82-4af0-85d7-47c36f95bd00`)
- **Free Plan**: UUID with `:fx` suffix (e.g., `f1cd8f03-4003-4873-9367-917bf22b0ab8:fx`)

---

## CI/CD Secrets (GitHub Actions)

Required secrets for GitHub Actions workflows. Configure at:
**Repository → Settings → Secrets and variables → Actions**

### Production Deployment Secrets

| Secret Name | Description | Used In Workflow |
|-------------|-------------|------------------|
| `VERCEL_TOKEN` | Vercel authentication token | `deploy-production.yml` |
| `VERCEL_ORG_ID` | Vercel organization ID | `deploy-production.yml` |
| `VERCEL_PROJECT_ID` | Vercel project ID | `deploy-production.yml` |
| `SUPABASE_DB_PASSWORD` | Supabase database password | `deploy-production.yml` (migrations) |
| `SUPABASE_PROJECT_ID` | Supabase project ID | `deploy-production.yml` (migrations) |

### Google Cloud Run Secrets (AI Engine)

These are configured via Workload Identity Federation (no secrets needed):

| Configuration | Value |
|---------------|-------|
| Workload Identity Provider | `projects/749683311533/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| Service Account | `github-actions-deployer@gen-lang-client-0437962165.iam.gserviceaccount.com` |
| GCP Project | `gen-lang-client-0437962165` |
| Region | `us-central1` |
| Image | `gcr.io/gen-lang-client-0437962165/ai-engine` |

### PR CI/CD Secrets

| Secret Name | Description | Used In Workflow |
|-------------|-------------|------------------|
| `SUPABASE_URL` | Test Supabase URL | `pull-request-ci.yml` (tests) |
| `SUPABASE_SERVICE_ROLE_KEY` | Test service role key | `pull-request-ci.yml` (tests) |

**Note**: PR tests use hardcoded test values (`https://test.supabase.co`) to avoid real DB access.

---

## Vercel Environment Variables

Configure in Vercel Dashboard: **Project → Settings → Environment Variables**

### Production Environment Variables

| Variable | Value | Environments | Description |
|----------|-------|--------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zvngsecxzcgxafbzjewh.supabase.co` | Production | Production Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Your anon key) | Production | Production Supabase anon key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production | **Production** Stripe key |
| `NEXT_PUBLIC_APP_URL` | `https://app.getori.app` | Production | Canonical app URL |
| `SUPABASE_SERVICE_ROLE_KEY` | (Your service role key) | Production | For serverless API routes |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production | **Production** Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production | Production webhook secret |
| `AI_ENGINE_URL` | `https://ai-engine-...-uc.a.run.app` | Production | Cloud Run AI Engine URL |

### Preview/Development Environment Variables

| Variable | Value | Environments | Description |
|----------|-------|--------------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Preview, Development | Test Stripe key |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Preview, Development | Test Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Preview, Development | Test webhook secret |

### Automatic Vercel Features

These are automatically enabled (no configuration needed):
- **Vercel Analytics**: Automatically enabled when `@vercel/analytics` is installed
- **Speed Insights**: Automatically enabled when `@vercel/speed-insights` is installed
- **Image Optimization**: Automatically configured for Next.js Image component
- **Edge Network**: Automatic CDN distribution

---

## Quick Setup Guide

### 1. Local Development Setup (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/carlo-spada/ori-platform.git
cd ori-platform

# 2. Copy environment files
cp .env.example .env.local
cp services/core-api/.env.example services/core-api/.env
cp services/ai-engine/.env.example services/ai-engine/.env

# 3. Fill in required values
# Edit .env.local, services/core-api/.env, services/ai-engine/.env
# Minimum required:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (test mode)
# - Core API: SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY
# - AI Engine: PORT=3002, EMBEDDING_MODEL=all-MiniLM-L6-v2

# 4. Install dependencies
pnpm install
cd services/ai-engine && pip install -r requirements.txt

# 5. Start services
# Terminal 1: Frontend
pnpm dev

# Terminal 2: Core API
pnpm dev:api

# Terminal 3: AI Engine
cd services/ai-engine && python main.py
```

### 2. Production Deployment Setup (10 minutes)

#### Vercel (Frontend + Core API)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Framework: Next.js
   - Root Directory: `.` (root)

2. **Add Environment Variables**:
   - Go to Project → Settings → Environment Variables
   - Add all production variables from table above
   - Use **production** Stripe keys (not test keys)

3. **Configure Domains**:
   - Add custom domains: `getori.app`, `app.getori.app`
   - Vercel automatically handles SSL certificates

#### Google Cloud Run (AI Engine)

1. **Enable Workload Identity** (one-time setup):
   ```bash
   # Already configured for this project:
   # - Workload Identity Pool: github-pool
   # - Provider: github-provider
   # - Service Account: github-actions-deployer
   ```

2. **Set Environment Variables in Cloud Run**:
   ```bash
   gcloud run services update ai-engine \
     --set-env-vars="ENVIRONMENT=production,LOG_LEVEL=WARNING,CORE_API_URL=https://app.getori.app/api,FRONTEND_URL=https://app.getori.app"
   ```

#### GitHub Actions (CI/CD)

1. **Add Repository Secrets**:
   - Repository → Settings → Secrets and variables → Actions
   - Add all secrets from "CI/CD Secrets" table above

2. **Verify Workflows**:
   - `.github/workflows/deploy-production.yml` - Deploys on merge to `main`
   - `.github/workflows/deploy-ai-engine.yml` - AI Engine deployment
   - `.github/workflows/pull-request-ci.yml` - PR checks

#### Supabase (Database)

1. **Configure Authentication URLs**:
   - Dashboard → Authentication → URL Configuration
   - Site URL: `https://app.getori.app`
   - Redirect URLs: `https://app.getori.app/**`

2. **Set Up Migrations**:
   ```bash
   # Migrations run automatically in GitHub Actions
   # Manual run:
   supabase db push
   ```

### 3. MCP Server Setup (Optional - Development Only)

See [`MCP-QUICK-SETUP.md`](../../MCP-QUICK-SETUP.md) and [`docs/MCP_REFERENCE.md`](../MCP_REFERENCE.md) for complete MCP configuration.

**Required for**:
- Stripe integration testing (Phase 2)
- Email service development (Phase 3)
- Database exploration (Phase 4)

---

## Security Best Practices

### 🔒 Critical Rules

1. **Never commit secrets to git**:
   - All `.env*` files are in `.gitignore`
   - Use `.env.example` for documentation only
   - Never hardcode API keys in code

2. **Separate test and production keys**:
   - Development: Use `pk_test_*` and `sk_test_*` (Stripe)
   - Production: Use `pk_live_*` and `sk_live_*` (Stripe)
   - Test keys are safe to use in MCP servers

3. **Service Role Key Protection**:
   - **Backend only** - Never expose in frontend
   - Bypasses Row Level Security (RLS)
   - Rotate immediately if exposed
   - Never log or print this key

4. **Environment-specific configuration**:
   - Development: `.env.local` (git-ignored)
   - Production: Vercel environment variables
   - CI/CD: GitHub Secrets

### 🔐 Key Rotation Procedure

If a key is compromised:

1. **Immediate actions**:
   ```bash
   # Revoke compromised key immediately
   # For Supabase: Dashboard → Settings → API → Reset service role key
   # For Stripe: Dashboard → Developers → API keys → Roll keys
   # For Vercel: Dashboard → Settings → Environment Variables → Delete + Re-add
   ```

2. **Update all instances**:
   - Local `.env` files
   - Vercel environment variables
   - GitHub Actions secrets
   - Team members' local environments

3. **Verify functionality**:
   ```bash
   # Test all services after rotation
   pnpm dev
   pnpm dev:api
   cd services/ai-engine && python main.py
   ```

### 🛡️ Access Control

| Key Type | Access Level | Where to Use |
|----------|--------------|--------------|
| Supabase Anon Key | Public | Frontend (NEXT_PUBLIC_*) |
| Supabase Service Role | Admin | Backend only (.env) |
| Stripe Publishable | Public | Frontend (NEXT_PUBLIC_*) |
| Stripe Secret | Private | Backend only (.env) |
| Vercel Token | Admin | CI/CD only (GitHub Secrets) |
| Google Cloud SA | Admin | CI/CD only (Workload Identity) |

### 📋 Environment Variables Checklist

Before deploying:

- [ ] All `.env.example` files are up to date
- [ ] No secrets in git history
- [ ] Production uses live keys (not test keys)
- [ ] Development uses test keys (not live keys)
- [ ] Vercel environment variables configured
- [ ] GitHub Actions secrets configured
- [ ] Supabase redirect URLs configured
- [ ] Stripe webhooks configured for production domain
- [ ] Team members have access to secret management

---

## Troubleshooting

### Common Issues

**Issue**: "Invalid JWT" or "Anonymous sign-ins are disabled"
- **Solution**: Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches your project
- Verify in Supabase Dashboard → Settings → API

**Issue**: Stripe webhook signature verification failed
- **Solution**:
  1. Check `STRIPE_WEBHOOK_SECRET` matches webhook endpoint
  2. Verify webhook endpoint URL matches your domain
  3. Check webhook is sending to correct environment (test vs live)

**Issue**: CORS errors in development
- **Solution**: Check `FRONTEND_URL` in Core API `.env` matches frontend URL
- Verify `ALLOWED_ORIGINS` includes all necessary origins

**Issue**: AI Engine not accessible
- **Solution**:
  1. Check `AI_ENGINE_URL` in Core API `.env`
  2. Verify AI Engine is running on correct port
  3. Check firewall/network settings

**Issue**: Environment variables not updating in Vercel
- **Solution**:
  1. Redeploy after changing environment variables
  2. Check variable is set for correct environment (Production/Preview/Development)
  3. Clear build cache: Project → Settings → General → Clear Build Cache

### Verification Commands

```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Verify Supabase connection
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"

# Test Stripe API key
curl https://api.stripe.com/v1/customers \
  -u sk_test_your_key:

# Check AI Engine health
curl http://localhost:3002/health
```

---

## Environment Variable Summary

| Service | Required Vars | Optional Vars | Total |
|---------|---------------|---------------|-------|
| Frontend | 3 | 8 | 11 |
| Core API | 8 | 8 | 16 |
| AI Engine | 5 | 9 | 14 |
| DeepL MCP | 2 | 0 | 2 |
| GitHub Actions | 5 | 2 | 7 |
| Vercel | 8 | 3 | 11 |
| **Total Unique** | **~25** | **~15** | **~40** |

---

## Additional Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **DeepL API**: https://www.deepl.com/pro-api

**Related Documentation**:
- [`CLAUDE.md`](../../CLAUDE.md) - Implementation patterns and setup
- [`MCP_REFERENCE.md`](../MCP_REFERENCE.md) - MCP server configuration
- [`MCP-QUICK-SETUP.md`](../../MCP-QUICK-SETUP.md) - 5-minute MCP setup
- [`CORE_DATABASE_SCHEMA.md`](../CORE/CORE_DATABASE_SCHEMA.md) - Database schema

---

**Last Updated**: 2025-11-10
**Version**: 1.0
**Maintainer**: Ori Platform Team
