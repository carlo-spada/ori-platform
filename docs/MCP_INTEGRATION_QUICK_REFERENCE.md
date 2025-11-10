# MCP Integration Quick Reference

## At a Glance

**Ori Platform** is a production-ready AI career platform using:
- **Frontend**: Next.js 16 + React 19 (Vercel)
- **Core API**: Express.js with TypeScript (Vercel serverless)
- **AI Engine**: FastAPI Python service (Google Cloud Run)
- **Database**: Supabase PostgreSQL with RLS
- **Payments**: Stripe (webhook integration)
- **Testing**: Jest, pytest, Vitest
- **CI/CD**: GitHub Actions with existing MCP (Gemini)

---

## High-Value Integration Opportunities

### 1. Email Service MCP (HIGHEST PRIORITY)
- **Status**: Placeholder implementation exists
- **File**: `services/core-api/src/utils/notifications.ts`
- **Opportunity**: Connect to SendGrid/Resend/AWS SES
- **Current Hooks**: 
  - Payment failure notifications
  - Payment method expiring warnings
- **Impact**: Immediate production value

### 2. Stripe API MCP
- **Status**: Webhook handling in place
- **File**: `services/core-api/src/routes/payments.ts`
- **Opportunities**:
  - Automate product/price creation
  - Real-time subscription analytics
  - Webhook logging and retry logic
- **Webhook Events Already Handled**: 7 event types
- **Impact**: Operational efficiency

### 3. GitHub Enhancement MCP
- **Status**: Gemini MCP already configured (Docker)
- **File**: `.github/workflows/gemini-invoke.yml`
- **Current Tools**: 20 tools (GitHub MCP server v0.18.0)
- **Opportunity**: Add specialized automation on top
- **Impact**: Development workflow improvement

### 4. Supabase/Database MCP
- **Status**: Manual migrations via CLI
- **File**: `supabase/migrations/`
- **Opportunities**:
  - Automate migration creation from specs
  - Schema introspection and validation
  - Real-time monitoring
- **Impact**: Development speed

### 5. Deployment Orchestration MCP
- **Status**: Sequential manual orchestration
- **Current Flow**: Frontend → AI Engine → Database migrations
- **Opportunities**:
  - Coordinate multi-service deployments
  - Environment variable management
  - Health check automation
- **Impact**: Reliability improvement

---

## Critical Implementation Details

### Stripe Webhook Handling
**CRITICAL**: Webhook route MUST be before `express.json()`
```typescript
app.use('/api/v1/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentWebhookRoutes)
app.use(express.json())
```

### Test Setup Pattern
**Use `setupFiles` NOT `setupFilesAfterEnv`** - Must load env vars before module imports
```javascript
// jest.config.js
setupFiles: ['<rootDir>/src/__tests__/setup.ts']
```

### Service Communication
- Frontend (3000) → Core API (3001) → AI Engine (3002)
- AI Engine cannot be called directly from frontend
- Health checks: AI engine returns `{ status: 'healthy' | 'degraded' }`

### Authentication
- Frontend: JWT from Supabase auth
- Backend: Service role key for internal operations
- RLS Policy: `auth.uid() = user_id` on all user data

---

## Key Files Reference

| Layer | Critical Files | Lines |
|-------|---|---|
| **Payment** | `services/core-api/src/routes/payments.ts` | 309 |
| **Stripe Config** | `services/core-api/src/lib/stripe.ts` | 73 |
| **AI Client** | `services/core-api/src/lib/ai-client.ts` | 349 |
| **Notifications** | `services/core-api/src/utils/notifications.ts` | 119 |
| **CI/CD** | `.github/workflows/deploy-production.yml` | 79 |
| **PR CI** | `.github/workflows/pull-request-ci.yml` | 169 |
| **Gemini MCP** | `.github/workflows/gemini-invoke.yml` | ~300 |
| **Database** | `docs/DATABASE_SCHEMA.md` | - |
| **API Specs** | `docs/API_ENDPOINTS.md` | - |

---

## Database Schema (Critical for MCP)

**Core Tables with Stripe Integration**:
```sql
user_profiles (RLS enabled)
  - stripe_customer_id TEXT UNIQUE
  - stripe_subscription_id TEXT UNIQUE
  - subscription_status TEXT (free, plus_monthly, plus_yearly, premium_monthly, premium_yearly, past_due, cancelled)
  - Indexes: stripe_customer_id, subscription_status

experiences (RLS enabled)
  - user_id, company, role, start_date, end_date

education (RLS enabled)
  - user_id, institution, degree, start_date, end_date

applications (RLS enabled)
  - user_id, job_title, company, status
  - Indexes: user_id, status, application_date

conversations/messages (RLS enabled)
  - Chat history with user isolation
```

---

## GitHub Actions MCP Foundation

**Already Configured**:
- Docker-containerized MCP server runs in GitHub Actions
- Server: `ghcr.io/github/github-mcp-server:v0.18.0`
- Environment: `GITHUB_PERSONAL_ACCESS_TOKEN` passed via env
- Pattern: Can be extended with additional MCP services

**Current Tools** (20 included):
- Issue/PR management
- Code search and file operations
- Branch and commit management
- Fork management

---

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (services/core-api/.env)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=...
AI_ENGINE_URL=http://localhost:3002
```

### AI Engine (services/ai-engine/.env)
```env
EMBEDDING_MODEL=all-MiniLM-L6-v2
CORE_API_URL=http://localhost:3001
```

---

## Development Workflow

### Running Services
```bash
# Terminal 1: Frontend
pnpm dev                          # http://localhost:3000

# Terminal 2: Backend API
pnpm dev:api                      # http://localhost:3001

# Terminal 3: AI Engine
cd services/ai-engine
python main.py                    # http://localhost:3002
```

### Testing
```bash
pnpm test                         # Frontend (Vitest)
pnpm --filter @ori/core-api test  # Backend (Jest)
cd services/ai-engine && pytest   # AI Engine
```

### Build & Deploy
```bash
pnpm lint                         # Check all
pnpm build                        # Build all
git push origin dev               # Push to dev
# PR from dev → main triggers CI/CD
```

---

## Existing Integrations Already in Place

1. **Stripe Integration** - Payments, webhooks, subscriptions
2. **Supabase Auth** - JWT-based authentication
3. **i18next** - 5 languages (en, de, es, fr, it)
4. **Gemini AI** - GitHub Actions workflows
5. **Vercel** - Frontend deployment
6. **Google Cloud Run** - AI engine deployment
7. **React Query** - Server state management
8. **Zod** - Request validation

---

## Documentation Standards

When implementing MCP integration:

1. **Update CLAUDE.md** if implementation patterns change
2. **Update AGENTS.md** if workflows are affected
3. **Create new docs in docs/** for MCP service specs
4. **Commit messages**: `feat: integrate MCP service`
5. **Keep docs/MCP_INTEGRATION_ANALYSIS.md synchronized**

---

## Recommended Implementation Order

1. **Week 1**: Email service MCP (quick win, high value)
2. **Week 2**: Stripe API MCP (builds on existing integration)
3. **Week 3**: Database/Supabase MCP (enables schema automation)
4. **Week 4**: Deployment orchestration MCP (reliability improvement)
5. **Week 5+**: Documentation automation, monitoring dashboards

---

## Contact Points for MCP Integration

- **Lead Developer**: Carlo Spada
- **Repository**: https://github.com/carlo-spada/ori-platform
- **Main Branch**: Production (Vercel deployed)
- **Dev Branch**: Development (all feature work)
- **Documentation**: Comprehensive in `/docs` directory
- **Task Management**: File-based system in `/.tasks/`

---

**Last Updated**: 2025-11-10
**Analysis Confidence**: HIGH (comprehensive codebase review)
**Ready for Integration**: YES
