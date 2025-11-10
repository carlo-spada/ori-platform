# Ori Platform: Comprehensive Codebase Analysis for MCP Integration

## Executive Summary

The Ori Platform is a sophisticated AI-powered career companion built as a **pnpm workspace monorepo** with a polyglot architecture spanning Next.js 16 frontend, Node.js/Express backend, and Python/FastAPI AI services. This document provides a thorough inventory of all systems that would be affected by Model Context Protocol (MCP) server integration.

**Key Insight**: The codebase already uses Docker-containerized MCP servers in GitHub Actions workflows for Gemini integration, providing a foundation for expanding MCP capabilities.

---

## 1. Project Architecture Overview

### 1.1 Monorepo Structure

```
ori-platform/
├── src/                          # Next.js 16 frontend (App Router)
│   ├── app/                      # Route pages
│   ├── components/               # React components (ui/, profile/, dashboard/)
│   ├── contexts/                 # Auth, global state
│   ├── hooks/                    # React Query hooks for API data
│   ├── integrations/api/         # API client layer
│   ├── lib/                      # Utilities (stripe, react-query, supabase)
│   ├── __tests__/                # Frontend tests
│   ├── i18n.ts                   # i18next configuration
│   └── proxy.ts                  # Subdomain routing middleware
│
├── services/
│   ├── core-api/                 # Node.js/Express backend
│   │   ├── src/
│   │   │   ├── routes/           # API endpoints (auth, profile, payments, etc.)
│   │   │   ├── middleware/       # Auth, validation, error handling
│   │   │   ├── lib/              # Stripe, Supabase, AI client
│   │   │   ├── utils/            # Notifications, helpers
│   │   │   ├── __tests__/        # Jest tests with mocking
│   │   │   └── index.ts          # Express app setup
│   │   ├── jest.config.js        # Test configuration
│   │   └── package.json          # Express, Stripe, Supabase deps
│   │
│   └── ai-engine/                # Python/FastAPI service
│       ├── main.py               # FastAPI app with semantic matching
│       ├── services/             # Skill gap, matching, learning paths
│       ├── models/               # ML models and embeddings
│       ├── tests/                # pytest test suite
│       ├── config.py             # Configuration
│       ├── requirements.txt      # Python dependencies
│       ├── Dockerfile            # Container image
│       └── pytest.ini            # Test configuration
│
├── shared/
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Shared utilities
│
├── docs/                         # Technical documentation
├── supabase/                     # Database migrations
├── public/                       # Static assets, PWA icons, locales
├── .github/workflows/            # GitHub Actions CI/CD
├── scripts/                      # Build and utility scripts
├── branding/                     # Brand guidelines
└── .tasks/                       # Task management (todo, in-progress, done, etc.)
```

### 1.2 Technology Stack

| Layer | Technology | Version | Key Files |
|-------|-----------|---------|-----------|
| **Frontend** | Next.js | 16 | `next.config.ts`, `src/app/**` |
| | React | 19 | `src/components/**` |
| | TypeScript | 5.9.3 | `tsconfig.json` |
| | Tailwind CSS | 3.4 | Styling system |
| | shadcn/ui + Radix UI | Latest | Component library |
| | React Query | TanStack Query | State/caching |
| | React Hook Form | Latest | Form management |
| **Backend (Core)** | Express.js | 4.19 | `services/core-api/src/index.ts` |
| | Node.js | 20 | Runtime |
| | TypeScript | 5.9.3 | Backend types |
| | Zod | 4.1.12 | Schema validation |
| **Backend (AI)** | FastAPI | Latest | `services/ai-engine/main.py` |
| | Python | 3.11 | Runtime |
| | Sentence-Transformers | Latest | Embeddings/semantic matching |
| **Database** | Supabase PostgreSQL | Latest | JWT auth, RLS |
| **Payment** | Stripe | 16.12.0 | `services/core-api/src/routes/payments.ts` |
| **Monorepo** | pnpm | 10 | `pnpm-workspace.yaml` |
| **Testing** | Jest | 30.2 | Backend tests |
| | Vitest | Latest | Frontend tests |
| | pytest | Latest | AI engine tests |
| **CI/CD** | GitHub Actions | - | `.github/workflows/` |
| **Deployment** | Vercel | - | Frontend + serverless API |
| | Google Cloud Run | - | AI engine container |

---

## 2. Payment & Stripe Integration

### 2.1 Current Stripe Implementation

**File**: `/services/core-api/src/routes/payments.ts` (309 lines)

**Key Components**:

```typescript
// Payment routes
POST /api/v1/payments/checkout         # Create checkout session
POST /api/v1/payments/portal          # Customer portal access
POST /api/v1/payments/webhook         # Stripe webhook handler (raw body)

// Related routes
POST /api/v1/subscriptions            # Subscription management
POST /api/v1/setup-intent             # Payment method setup
```

**Webhook Events Handled**:
- `checkout.session.completed` - Initial subscription creation
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Plan changes, status updates
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful recurring payment
- `invoice.payment_failed` - Failed payment (triggers notification)
- `customer.source.expiring` - Payment method expiration warning

**Stripe Configuration** (`/services/core-api/src/lib/stripe.ts`):

```typescript
export const STRIPE_PLANS = {
  plus_monthly: { price: 500, priceId: env.STRIPE_PRICE_PLUS_MONTHLY_ID },
  plus_yearly: { price: 4800, priceId: env.STRIPE_PRICE_PLUS_YEARLY_ID },
  premium_monthly: { price: 1000, priceId: env.STRIPE_PRICE_PREMIUM_MONTHLY_ID },
  premium_yearly: { price: 9600, priceId: env.STRIPE_PRICE_PREMIUM_YEARLY_ID },
}
```

**Database Integration**:
- Stripe customer ID stored in `user_profiles.stripe_customer_id`
- Subscription ID stored in `user_profiles.stripe_subscription_id`
- Status tracked in `user_profiles.subscription_status`

**Critical Implementation Detail**:
- Webhook route **MUST** be before `express.json()` middleware (raw body requirement)
- Line 30-35 in `index.ts`: Routes webhook with `express.raw({ type: 'application/json' })`

### 2.2 Payment Testing

**Location**: No dedicated Stripe tests yet
**Environment Setup** (`services/core-api/src/__tests__/setup.ts`):

```typescript
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock'
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_mock'
```

**Impact for MCP Integration**:
- MCP webhooks could automate Stripe API calls (create products, update prices)
- Could enable automated payment failure notifications via MCP services
- Could provide real-time subscription analytics querying

---

## 3. Email & Notification System

### 3.1 Current Implementation

**File**: `/services/core-api/src/utils/notifications.ts` (119 lines)

**Status**: **Placeholder implementation** - ready for production email service integration

```typescript
export interface NotificationOptions {
  to: string
  subject: string
  message: string
  type?: 'email' | 'in_app' | 'both'
}

export async function sendNotification(
  supabase: SupabaseClient,
  userId: string,
  options: NotificationOptions
): Promise<void>
```

**Current Behavior**:
- Creates in-app notifications in database
- Logs to console
- **Does NOT send actual emails yet**

**Supported Notification Types**:

1. **Payment Failure** (`sendPaymentFailureNotification`)
   - Triggered by `invoice.payment_failed` webhook
   - User: "We were unable to process your recent payment"

2. **Payment Method Expiring** (`sendPaymentMethodExpiringNotification`)
   - Triggered by `customer.source.expiring` webhook
   - User: "Your payment method on file is expiring soon"

**Integration Points**:
- Both notifications query user profile + auth email
- Both call `sendNotification()` internally

**Production Comments in Code**:

```typescript
// For production, integrate with an email service like SendGrid, AWS SES, or Resend
// Example: await sendgrid.send({ to, from, subject, html })
```

**Impact for MCP Integration**:
- MCP could connect to SendGrid, Resend, or AWS SES
- Could automate email template management
- Could provide email delivery tracking and analytics

---

## 4. Database Architecture & Testing

### 4.1 Database Schema

**Supabase PostgreSQL** with Row Level Security (RLS) enabled on all tables.

**Core Tables**:

| Table | Purpose | User Isolation | Indexes |
|-------|---------|-----------------|---------|
| `user_profiles` | Profile, billing, subscription data | `auth.uid() = user_id` | `stripe_customer_id`, `subscription_status` |
| `experiences` | Work experience history | `auth.uid() = user_id` | `user_id` |
| `education` | Education records | `auth.uid() = user_id` | `user_id` |
| `applications` | Job applications tracking | `auth.uid() = user_id` | `user_id`, `status`, `application_date` |
| `conversations` | Chat threads | `auth.uid() = user_id` | - |
| `messages` | Chat messages | User can only access own conversations | - |

**Stripe Integration Columns**:
```sql
-- user_profiles table
stripe_customer_id TEXT UNIQUE      -- Stripe Customer ID
stripe_subscription_id TEXT UNIQUE  -- Stripe Subscription ID
subscription_status TEXT            -- free, plus_monthly, plus_yearly, premium_monthly, premium_yearly, past_due, cancelled
```

### 4.2 Database Testing Patterns

**Location**: `/services/core-api/src/routes/__tests__/`

**Test File Structure**:
- `skills-gap.test.ts` - Example test mocking AI client
- Pattern: Jest with `ts-jest` preset

**Example Test Pattern** (from `skills-gap.test.ts`):

```typescript
describe('fetchSkillsGapForJob', () => {
  afterEach(() => jest.restoreAllMocks())
  
  it('formats AI response data', async () => {
    jest.spyOn(aiClient, 'getSkillGap').mockResolvedValue({
      user_skills: ['React'],
      required_skills: ['React', 'TypeScript'],
      missing_skills: ['TypeScript'],
    })
    
    const result = await fetchSkillsGapForJob(['React'], ['React', 'TypeScript'])
    expect(result).toEqual({ /* expected */ })
  })
})
```

**Setup Pattern** (`setup.ts`):

```typescript
// Loads environment variables BEFORE module imports
dotenv.config({ path: '.env.test' })
process.env.NODE_ENV = 'test'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
// ... suppress console during tests
```

**Critical Note**: Uses `setupFiles` (not `setupFilesAfterEnv`) for loading env vars before module imports.

### 4.3 Query Patterns

**Frontend** (`src/hooks/`):
- React Query hooks with auto-caching
- `staleTime: 1000 * 60 * 5` (5 minutes default)
- No mock data - all data from API

**Backend** (`services/core-api/src/routes/`):
- Supabase client (singleton via `getSupabaseClient()`)
- Zod validation on all endpoints
- Auth middleware on protected routes

**Example Pattern** (from `profile.ts`):

```typescript
router.put('/', authMiddleware, validateRequest(updateProfileSchema), async (req: AuthRequest, res) => {
  const { data: profile } = await supabase
    .from('user_profiles')
    .update(req.body)
    .eq('user_id', req.user.id)
    .single()
  // ...
})
```

**Impact for MCP Integration**:
- MCP could automate database migrations
- Could provide schema introspection and real-time monitoring
- Could enable dynamic query generation from API specs

---

## 5. GitHub Workflow Automation

### 5.1 CI/CD Pipeline

**Files**: `.github/workflows/*.yml`

**Workflow Files**:

| File | Trigger | Purpose |
|------|---------|---------|
| `pull-request-ci.yml` | PR opened/sync/reopen | Lint, build, test verification |
| `deploy-production.yml` | Push to main | Production deployment |
| `gemini-invoke.yml` | Workflow call | AI agent workflow execution |
| `gemini-review.yml` | Auto-triggered | Automated code review |
| `gemini-triage.yml` | Issue open/edit | Issue classification |
| `deploy-ai-engine.yml` | Production build | Container to Cloud Run |
| `verify.yml` | Called by others | Code quality checks |

### 5.2 Pull Request CI Workflow

**File**: `pull-request-ci.yml` (169 lines)

**Key Jobs**:

1. **verify** (single source of truth for all checks):
   - Checkout, setup Node/pnpm/Python
   - Install dependencies
   - Run linter (eslint)
   - Run build (next build --webpack)
   - Run tests (pnpm test || echo "No tests configured")
   - Output: `verification_passed=true/false`

2. **review** (depends on verify):
   - Analyzes changed files
   - Flags risky changes (.github/workflows/, AGENTS.md, package.json, pnpm-lock.yaml)
   - Outputs: `review_approved=true/false`

3. **auto-merge** (depends on review):
   - Auto-approves + squash merges if review approved
   - Only runs if all checks pass

**Concurrency**: Cancels in-progress runs for same PR (`pr-ci-${{ number }}`)

**Permissions**:
```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
  checks: read
```

### 5.3 Production Deployment Workflow

**File**: `deploy-production.yml` (79 lines)

**Sequential Jobs**:

1. **verify** - Code quality checks (lint, format, build)
2. **deploy-frontend** - Wait for Vercel deployment via amondnet/vercel-action
3. **deploy-ai-engine** - Calls deploy-ai-engine.yml (Cloud Run)
4. **run-migrations** - Waits for all deployments, then runs `supabase db push`

**Critical Ordering**: AI engine must deploy before database migrations run.

**Secrets Used**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_ID`

### 5.4 Gemini Integration (MCP Foundation)

**Files**:
- `gemini-invoke.yml` - AI agent task execution workflow
- `gemini-review.yml` - Automated PR review workflow
- `gemini-dispatch.yml` - Manual trigger workflow

**Current MCP Server Configuration** (in `gemini-invoke.yml`, lines 89-134):

```yaml
mcpServers:
  github:
    command: docker
    args:
      - run
      - -i
      - --rm
      - -e
      - GITHUB_PERSONAL_ACCESS_TOKEN
      - ghcr.io/github/github-mcp-server:v0.18.0
    includeTools:
      - add_issue_comment
      - get_issue
      - get_issue_comments
      - list_issues
      - search_issues
      - create_pull_request
      - pull_request_read
      - list_pull_requests
      - search_pull_requests
      - create_branch
      - create_or_update_file
      - delete_file
      - fork_repository
      - get_commit
      - get_file_contents
      - list_commits
      - push_files
      - search_code
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: ${GITHUB_TOKEN}
```

**Critical Pattern**: MCP server runs as Docker container, receives env vars from GitHub Actions.

**Impact for MCP Integration**:
- Existing infrastructure already supports Docker MCP servers
- Provides blueprint for integrating additional MCP services
- Gemini workflow already handles authentication and environment variable passing

---

## 6. Testing Infrastructure

### 6.1 Backend Testing (Jest)

**Configuration**: `/services/core-api/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],  // CRITICAL: setupFiles, not setupFilesAfterEnv
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: { global: { branches: 60, functions: 60, lines: 60, statements: 60 } },
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }, // Handle .js extensions
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: false, isolatedModules: true }] },
  verbose: true,
}
```

**Test Files**:
- Location: `src/routes/__tests__/*.test.ts`
- Pattern: `describe()` with mocked dependencies
- Key test: `skills-gap.test.ts` (AI client mocking example)

**Test Setup** (`src/__tests__/setup.ts`):

```typescript
// Loads .env.test BEFORE imports
dotenv.config({ path: '.env.test' })
process.env.NODE_ENV = 'test'
process.env.SUPABASE_URL = 'https://test.supabase.co'
// ... mock env vars
global.console = { ...console, log: jest.fn(), debug: jest.fn(), info: jest.fn() }
```

**Test Execution**: `pnpm --filter @ori/core-api test`

### 6.2 Frontend Testing (Vitest)

**Configuration**: `vitest.config.ts` (via package.json scripts)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Test Files**:
- Location: `src/__tests__/*.test.tsx`
- Example: `src/__tests__/example.test.tsx`
- Pattern: React Testing Library

### 6.3 AI Engine Testing (pytest)

**Configuration**: `/services/ai-engine/pytest.ini`

**Test Location**: `services/ai-engine/tests/`

**Test Execution**: `pytest tests/ -v`

### 6.4 CI/CD Test Integration

**PR CI** (`pull-request-ci.yml`, line 76-82):

```yaml
- name: 'Run Tests'
  id: test
  env:
    SUPABASE_URL: https://test.supabase.co
    SUPABASE_SERVICE_ROLE_KEY: test-service-role-key
  run: pnpm test || echo "No tests configured"
  continue-on-error: true
```

**Deployment CI** (`deploy-production.yml`):
- Test step commented out: `# pnpm test`
- Ready to uncomment when test suite is mature

**Impact for MCP Integration**:
- MCP could automate test execution across multiple services
- Could provide real-time test result notifications
- Could generate test coverage reports and analytics

---

## 7. Service Communication Patterns

### 7.1 Three-Tier Service Architecture

```
Frontend (localhost:3000)
    |
    ├── HTTP REST API (with JWT auth)
    |
Core API (localhost:3001)
    |
    ├── Supabase PostgreSQL queries
    ├── Stripe API calls
    |
    └── HTTP requests to AI Engine
         |
    AI Engine (localhost:3002)
         |
         └── Sentence-Transformer models
```

### 7.2 AI Client Implementation

**File**: `/services/core-api/src/lib/ai-client.ts` (349 lines)

**AIClient Class Methods**:

```typescript
class AIClient {
  async healthCheck(): Promise<boolean>              // GET /health
  async generateMatches(request): Promise<MatchResult[]>       // POST /api/v1/match
  async getSkillGap(userSkills, requiredSkills): Promise<SkillGapResponse>  // POST /api/v1/skill-gap
  async analyzeSkills(profile, jobs): Promise<SkillAnalysisResult>  // POST /api/v1/analyze-skills
  async getLearningPaths(profile, jobs, max): Promise<unknown[]>    // POST /api/v1/learning-paths
  async recommendRoles(profile): Promise<string[]>                  // POST /api/v1/recommend-roles
  async generateResponse(profile, history, message): Promise<AIResponse>  // POST /api/v1/generate_response
}

export const aiClient = new AIClient()  // Singleton
```

**Request/Response Patterns**:

```typescript
interface UserProfile {
  user_id: string
  skills: string[]
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  years_of_experience?: number
  roles?: string[]
  work_style?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  industries?: string[]
  location?: string
  salary_min?: number
  salary_max?: number
  goal?: string
  cv_text?: string
}

interface MatchRequest {
  profile: UserProfile
  jobs: Job[]
  limit?: number
}
```

**Error Handling**:
- Health check: Returns `false` on failure
- Skill gap: Returns `null` on error (graceful degradation)
- Others: Throw errors to be caught by route handlers

**Timeouts**:
- Health check: 5 seconds
- Skill gap: 10 seconds
- Matching/analysis/learning paths: 30 seconds

### 7.3 API Layer Pattern

**Frontend API Clients** (`src/integrations/api/`):

```typescript
// Pattern: getAuthHeaders() + fetch + error handling
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()  // JWT from Supabase
  const response = await fetch(`${API_URL}/api/v1/profile`, { headers })
  if (!response.ok) throw new Error(...)
  return response.json()
}
```

**React Query Hooks** (`src/hooks/`):

```typescript
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,  // 5 minutes
  })
}
```

**Backend Routes** (`services/core-api/src/routes/`):

```typescript
// Pattern: authMiddleware → validateRequest → supabase query → response
router.put(
  '/',
  authMiddleware,
  validateRequest(updateProfileSchema),
  async (req: AuthRequest, res) => {
    // req.user is populated by authMiddleware
    // req.body is validated by zod schema
  }
)
```

### 7.4 Environment Configuration for Service Communication

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Optional (defaults to localhost:3001 in dev)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:3002
```

**Core API** (`services/core-api/.env`):

```env
PORT=3001
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002
```

**AI Engine** (`services/ai-engine/.env`):

```env
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=INFO
```

**Impact for MCP Integration**:
- MCP could manage environment configuration across services
- Could validate service health and connectivity
- Could provide inter-service communication tracing

---

## 8. Deployment & CI/CD Pipeline

### 8.1 Production Deployment Architecture

```
GitHub Repository (main branch)
    |
    └─→ GitHub Actions (deploy-production.yml)
         |
         ├─→ Verify (lint, build, test)
         |
         ├─→ Deploy Frontend
         |    └─→ Vercel (Next.js + serverless API)
         |         └─→ Accessible at getori.app & app.getori.app
         |
         ├─→ Deploy AI Engine
         |    └─→ Google Cloud Run (Docker container)
         |         └─→ Accessible at cloud-run-url
         |
         └─→ Run Migrations
              └─→ Supabase CLI (supabase db push)
                   └─→ Apply pending migrations to production DB
```

### 8.2 Build Configuration

**Next.js** (`next.config.ts`):

```typescript
const nextConfig: NextConfig = {
  turbopack: {},  // Turbopack enabled by default
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
```

**Build Commands**:

```bash
pnpm dev                    # Dev: next dev --webpack
pnpm build                  # Production: next build --webpack
pnpm start                  # Production: next start
pnpm lint                   # ESLint checks
pnpm format                 # Prettier formatting
pnpm format:check           # Check formatting without changes
```

### 8.3 Vercel Configuration

**File**: `vercel.json`

```json
{
  "ignoreCommand": "bash scripts/vercel-ignore-build.sh",
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```

**Custom Ignore Script**: `scripts/vercel-ignore-build.sh`
- Allows selective builds based on changed files

### 8.4 Deployment Secrets Management

**Required Secrets** (GitHub → Actions/Vercel/Cloud Run):

| Service | Secrets |
|---------|---------|
| **Vercel** | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| **Cloud Run** | GCP service account, workload identity setup |
| **Supabase** | `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID` |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **GitHub** | `GEMINI_API_KEY` (for AI agent workflows) |

**Frontend Env Vars** (passed to Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Core API Env Vars** (deployed with Vercel serverless):
- All from `.env.production`
- Critical: `STRIPE_WEBHOOK_SECRET` must be exact match to Stripe dashboard

**AI Engine Env Vars** (Cloud Run):
- Set via Cloud Run environment variables UI
- Python environment uses `os.getenv()`

**Impact for MCP Integration**:
- MCP could automate secret rotation
- Could validate secrets exist before deployment
- Could manage secrets across multiple deployment targets

---

## 9. Documentation Structure & Standards

### 9.1 Key Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, setup, deployment architecture |
| `CLAUDE.md` | AI implementation guidelines, patterns, code standards |
| `AGENTS.md` | Collaborative workflow, branching strategy, agent roles |
| `docs/API_ENDPOINTS.md` | REST API specification |
| `docs/DATABASE_SCHEMA.md` | Database schema, migrations, types |
| `docs/SUBDOMAIN_MIGRATION.md` | Subdomain routing architecture |
| `docs/TRANSLATION_WORKFLOW.md` | i18n setup and process |
| `docs/BRANCH_PROTECTION_SETUP.md` | GitHub branch protection rules |
| `docs/AUTO_PR_REVIEW.md` | Auto-review workflow |
| `docs/architecture/overview.md` | System architecture diagrams |

### 9.2 Documentation Standards

**Enforced Practices** (per CLAUDE.md):

1. **Keep CLAUDE.md + AGENTS.md synchronized**
   - After major features: update both files
   - Reference PR numbers
   - Document new patterns

2. **Commit Message Format**:
   ```bash
   feat: add new feature          # New feature
   fix: resolve bug                # Bug fix
   chore: update task file         # Chores
   docs: update README              # Documentation
   refactor: restructure code       # Code reorganization
   test: add test cases             # Tests
   ```

3. **Documentation Updates**
   - `README.md`: If affects setup, structure, or features
   - `AGENTS.md`: If affects workflows or processes
   - `CLAUDE.md`: If implementation patterns change

### 9.3 Task Management Documentation

**File**: `.tasks/` directory with subdirectories

```
.tasks/
├── todo/              # New tasks and features
│   └── feature-name/  # Feature folders (epics)
│       ├── A.md       # Subtask A
│       └── B.md       # Subtask B
├── in-progress/       # Tasks being worked on
├── done/              # Completed tasks (awaiting review)
├── in-review/         # Under review/debugging
└── reviewed/          # Ready for integration
```

**File Format**:
- Markdown format
- Detailed description of work
- Status tracked by file location, not metadata

**Impact for MCP Integration**:
- MCP could automate task file movements
- Could generate project status reports from task structure
- Could provide timeline and progress analytics

---

## 10. Environment Configuration & Secrets Management

### 10.1 Environment File Structure

**Frontend** (`.env.local` in root):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Optional Service URLs (for custom backends)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PWA and Analytics
NEXT_ENABLE_PWA=false
# Vercel Analytics auto-enabled in production

# Translation
DEEPL_API_KEY=your-key-here-or-key:fx
```

**Backend Core API** (`services/core-api/.env`):

```env
PORT=3001
SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002
```

**AI Engine** (`services/ai-engine/.env`):

```env
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=INFO
```

### 10.2 Environment Variable Loading

**Precedence**:

1. Node.js/Python environment variables
2. `.env.local` or `.env` files (loaded by dotenv)
3. Defaults in code

**Frontend** (Next.js handles automatically):
- `.env.local` loaded automatically
- `.env` as fallback
- `NEXT_PUBLIC_*` exposed to browser

**Backend** (explicit loading):

```typescript
// Core API - index.ts
import dotenv from 'dotenv'
dotenv.config()  // Loads from .env file
```

**AI Engine** (explicit loading):

```python
# main.py
from dotenv import load_dotenv
load_dotenv()  # Loads from .env file
```

### 10.3 Secrets Management in CI/CD

**GitHub Actions Integration**:

1. **Organization Secrets**: Shared across workflows
2. **Repository Secrets**: Per-repo configuration
3. **Environment Secrets**: Per-environment (dev, prod, etc.)

**Vercel Integration**:
- Secrets set in Vercel project settings UI
- Auto-synced from GitHub if configured
- Available as env vars during build and runtime

**Cloud Run Integration**:
- Secrets set via Cloud Run environment variables UI
- Or via `gcloud run deploy --set-env-vars`

**Stripe Webhook Setup**:
- Webhook URL registered in Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` provided by Stripe
- **CRITICAL**: Must match exactly for signature verification

**Impact for MCP Integration**:
- MCP could validate secrets are properly configured
- Could rotate secrets on schedule
- Could audit secret usage across services

---

## 11. Internationalization (i18n)

### 11.1 Translation Infrastructure

**Frontend Setup** (`src/i18n.ts`):

```typescript
import i18next from 'i18next'
// Configuration with browser language detection
// Translation files in public/locales/{en,de,es,fr,it}/
```

**Translation File Structure**:

```
public/locales/
├── en/
│   ├── common.json          # Common translations
│   ├── landing.json         # Landing page content
│   ├── blog.json           # Blog post translations
│   └── dashboard.json      # App translations
├── de/                      # German
├── es/                      # Spanish
├── fr/                      # French
└── it/                      # Italian
```

**Supported Languages**: English, German, Spanish, French, Italian

### 11.2 Translation Automation

**Scripts Location**: `scripts/`

- `translate.ts` - Main translation script
- `extract-translatable.ts` - Extract translatable strings
- `demo-translation.ts` - Demo with actual API calls
- `test-translation.ts` - Test translation API

**Translation Service**: DeepL API

```env
DEEPL_API_KEY=your-pro-api-key-here        # Pro plan (recommended)
# OR
DEEPL_API_KEY=your-free-api-key-here:fx    # Free plan (500k chars/month)
```

**Recent Update** (per `DATABASE_SCHEMA.md`):
- Blog post data added to translation files for multilingual support
- See commit: `bdef82e fix(i18n): add blog post data to translation files`

**Impact for MCP Integration**:
- MCP could automate translation updates
- Could provide translation quality checks
- Could manage DeepL API integration

---

## 12. Systems Affected by MCP Integration

### 12.1 Summary of Integration Points

| System | Impact Level | Key Affected Components |
|--------|-------------|------------------------|
| **GitHub Workflows** | HIGH | Already uses Docker MCP (Gemini), expandable |
| **Stripe Integration** | HIGH | Webhook handling, payment notifications |
| **Email/Notifications** | HIGH | Currently placeholder, perfect for MCP email services |
| **Database** | MEDIUM | Could automate migrations, schema queries |
| **API Layer** | MEDIUM | Could validate endpoints, auto-generate clients |
| **Deployment** | MEDIUM | Vercel, Cloud Run, Supabase orchestration |
| **Testing** | MEDIUM | Jest, pytest, vitest automation |
| **Documentation** | MEDIUM | Auto-generation from code, API specs |
| **Task Management** | LOW | File-based system could be automated |
| **Secrets Management** | MEDIUM | Environment variable validation |
| **Service Communication** | MEDIUM | Inter-service monitoring, health checks |
| **Localization** | LOW | DeepL API integration already in place |

### 12.2 Integration Opportunities

**High Priority** (immediate impact):

1. **Email Service MCP**
   - Replace placeholder notification system
   - Connect to SendGrid, Resend, or AWS SES
   - Handle payment failure + expiry notifications

2. **Stripe MCP**
   - Automate product/price creation
   - Webhook processing enhancements
   - Real-time subscription analytics

3. **GitHub Enhancement MCP**
   - Extend existing Gemini MCP setup
   - Additional tools for automation
   - PR/issue management enhancement

**Medium Priority**:

4. **Database MCP**
   - Automate Supabase migrations
   - Schema introspection and validation
   - Real-time monitoring

5. **Vercel/Cloud Run MCP**
   - Orchestrate multi-service deployments
   - Environment variable management
   - Deployment status monitoring

6. **Documentation MCP**
   - Auto-generate API client code
   - Keep docs in sync with codebase
   - Generate from API specs

**Lower Priority**:

7. **Testing MCP**
   - Coordinate test execution across services
   - Generate test reports
   - Coverage analytics

8. **Task Management MCP**
   - Automate task file movements
   - Generate project status reports
   - Timeline/velocity analytics

---

## 13. Key Files for MCP Integration Reference

### 13.1 Configuration Files

| File | Purpose | Size |
|------|---------|------|
| `.github/workflows/gemini-invoke.yml` | MCP server config template | ~300 lines |
| `.github/workflows/deploy-production.yml` | Deployment orchestration | 79 lines |
| `services/core-api/jest.config.js` | Backend test configuration | 42 lines |
| `vercel.json` | Vercel deployment config | 8 lines |
| `pnpm-workspace.yaml` | Monorepo configuration | 9 lines |

### 13.2 Core Implementation Files

| File | Purpose | Lines | Key Classes/Functions |
|------|---------|-------|----------------------|
| `services/core-api/src/routes/payments.ts` | Stripe integration | 309 | Payment routes, webhook handling |
| `services/core-api/src/lib/stripe.ts` | Stripe configuration | 73 | STRIPE_PLANS, getStatusFromPriceId |
| `services/core-api/src/lib/ai-client.ts` | AI service client | 349 | AIClient class, 7 async methods |
| `services/core-api/src/utils/notifications.ts` | Email placeholder | 119 | sendNotification, payment notifications |
| `services/core-api/src/index.ts` | Express app setup | 55 | Route mounting, webhook handling |

### 13.3 Database & Types

| File | Purpose |
|------|---------|
| `docs/DATABASE_SCHEMA.md` | Complete schema reference |
| `shared/types/src/index.ts` | TypeScript types for all services |
| `supabase/migrations/` | Database migration files |

### 13.4 Testing Examples

| File | Purpose | Pattern |
|------|---------|---------|
| `services/core-api/src/__tests__/setup.ts` | Test environment setup | Load env vars before imports |
| `services/core-api/src/routes/__tests__/skills-gap.test.ts` | Example test | Jest with mocked AI client |
| `jest.config.js` | Test configuration | ts-jest preset, setupFiles pattern |

---

## 14. Critical Implementation Notes for MCP Integration

### 14.1 Stripe Webhook Handling

**CRITICAL**: The webhook route must be **BEFORE** `express.json()` middleware:

```typescript
// ✅ CORRECT: Raw body parser before express.json()
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), paymentWebhookRoutes)
app.use(express.json())

// ❌ WRONG: This would break signature verification
app.use(express.json())
app.use('/api/v1/payments/webhook', paymentWebhookRoutes)
```

**Reason**: Stripe signature verification requires the raw unparsed request body.

### 14.2 Service Communication Timeouts

**AI Engine Timeouts** (in `ai-client.ts`):
- Health check: 5 seconds
- Skill gap: 10 seconds
- Other endpoints: 30 seconds

**Production Consideration**: May need adjustment for Cloud Run cold starts.

### 14.3 Database RLS & Service Account

**Frontend** (Supabase anon key):
- Uses JWT from user login
- RLS enforces: `auth.uid() = user_id`

**Backend** (Supabase service role key):
- Bypasses RLS
- Used for internal operations
- **NEVER expose in frontend**

**AI Engine**:
- No direct Supabase access
- Communicates through core-api only

### 14.4 Supabase Auth Integration

**Auth Flow**:
1. User signs up via Supabase UI in frontend
2. Email confirmation required
3. JWT token issued on login
4. Token included in all API requests via `getAuthHeaders()`
5. Backend validates JWT, extracts `user_id`

**Files**:
- `src/contexts/AuthProvider.tsx` - Auth state management
- `src/integrations/supabase/client.ts` - Supabase singleton
- `services/core-api/src/middleware/auth.ts` - JWT validation

### 14.5 Testing Environment Variables

**Setup Pattern** (from `core-api/__tests__/setup.ts`):

```typescript
// MUST use setupFiles (not setupFilesAfterEnv) to load env before imports
dotenv.config({ path: '.env.test' })
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co'
// ...
```

**CI/CD Testing** (from `pull-request-ci.yml`):

```yaml
- name: 'Run Tests'
  env:
    SUPABASE_URL: https://test.supabase.co
    SUPABASE_SERVICE_ROLE_KEY: test-service-role-key
  run: pnpm test || echo "No tests configured"
```

### 14.6 Module Resolution in Backend

**Current Setup**:
- Core-api uses `.js` extensions despite TypeScript
- ES module compatibility via ts-jest config
- Module name mapper handles `.js` stripping

```typescript
// ✅ Can import as:
import { stripe } from '../lib/stripe.js'

// jest.config.js module mapper handles the .js extension
moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }
```

---

## 15. Recommendations for MCP Integration

### 15.1 Phased Integration Approach

**Phase 1: Email Service** (Week 1-2)
- Create Resend/SendGrid MCP server wrapper
- Replace notification placeholder
- Test with payment failure workflow
- **Impact**: Immediate production value

**Phase 2: Stripe Enhancement** (Week 2-3)
- Create Stripe API MCP wrapper
- Automate product/price management
- Webhook logging and analytics
- **Impact**: Operational efficiency

**Phase 3: Database Automation** (Week 3-4)
- Supabase migration MCP
- Schema introspection
- Real-time monitoring
- **Impact**: Development speed

**Phase 4: Deployment Orchestration** (Week 4-5)
- Multi-service deployment coordination
- Environment variable management
- Health check automation
- **Impact**: Reliability improvement

**Phase 5: Documentation & Monitoring** (Ongoing)
- Auto-generate API clients
- Keep docs synchronized
- Build dashboards for system health
- **Impact**: Documentation quality

### 15.2 Best Practices for Implementation

1. **Leverage Existing Infrastructure**
   - GitHub Actions already runs Docker MCP servers
   - Use same pattern for new MCP services
   - Environment variables passed via workflow

2. **Maintain Separation of Concerns**
   - MCP services should be isolated
   - Core API acts as orchestrator
   - Frontend never directly calls MCP services

3. **Error Handling & Graceful Degradation**
   - MCP failures should not break core functionality
   - Follow AI engine pattern: health checks + fallbacks
   - Log detailed errors for debugging

4. **Testing & Validation**
   - Mock external services in tests
   - Use test environment variables
   - Validate secrets before deployment

5. **Documentation & Monitoring**
   - Document new MCP integrations in `CLAUDE.md`
   - Add monitoring for service health
   - Update API specs when changing endpoints

### 15.3 Security Considerations

1. **Secret Management**
   - Never log secrets in MCP services
   - Use GitHub/Vercel/Cloud Run secret managers
   - Rotate secrets regularly (especially webhook secrets)

2. **Authentication**
   - Validate JWT tokens in all requests
   - Service-to-service: Use API keys or service accounts
   - MCP services in GitHub Actions: Use GITHUB_TOKEN

3. **Input Validation**
   - All external input treated as untrusted
   - Use Zod schemas for validation
   - Sanitize before logging

4. **Rate Limiting**
   - Consider rate limits for external APIs
   - Implement backoff for retries
   - Monitor quota usage

---

## Conclusion

The Ori Platform is a well-architected, production-ready system with clear separation of concerns, robust testing infrastructure, and established CI/CD automation. The existing Gemini-GitHub MCP integration provides a proven pattern for expanding MCP capabilities.

**Key Takeaways for MCP Integration**:

1. **High-Value Opportunities**: Email services, Stripe automation, database migrations
2. **Proven Pattern**: Docker-based MCP servers in GitHub Actions workflow
3. **Clear Architecture**: Three-tier service design with well-defined APIs
4. **Testing Infrastructure**: Jest, pytest, vitest with mocking patterns established
5. **Documentation**: Comprehensive guides for implementation patterns and standards

**Next Steps**:
- Identify highest-value MCP integration target (email services recommended)
- Create MCP server wrapper following existing Docker pattern
- Implement in feature branch with full test coverage
- Update CLAUDE.md + AGENTS.md with new patterns
- Deploy via existing CI/CD pipeline

---

**Document Generated**: 2025-11-10
**Codebase Status**: Production-ready, actively maintained
**Key Repository**: https://github.com/carlo-spada/ori-platform
