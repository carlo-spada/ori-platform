# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guide Maintenance

Always keep this guide synchronized with `AGENTS.md`. After landing a major feature, infrastructure change, or new workflow: update this file AND the relevant sections in `AGENTS.md`, referencing the PR. This is crucial for multi-agent collaboration.

## Agent Responsibilities

**As Claude (Implementer & Builder), I must:**

### 🚨 Task Governance (CRITICAL)

**See `.tasks/TASK_GOVERNANCE.md` for complete task management rules.**

Key points:
- Follow task lifecycle (claiming, implementing, completing)
- Move entire folders as units, not partial files
- Commit and push immediately after each task move
- Archive abandoned tasks, don't delete them
- Track dependencies and blockers in task files

Failure to follow governance rules breaks task board integrity and blocks team collaboration.

### Version Control Discipline

- **Commit and push immediately** after completing each task
- **After moving task files** in `.tasks/`: commit and push
- **After implementing features**: commit and push
- **Minimum**: Push at least once per task/file edit in `.tasks/` folder

### Documentation Updates

After every major change, update:

- `README.md` (if affects setup, structure, or features)
- `AGENTS.md` (if affects workflows or processes)
- `CLAUDE.md` (if implementation patterns change)

### Commit Message Format

```bash
# When claiming a task
git add .tasks/
git commit -m "chore(tasks): claim task A.md for implementation"
git push origin dev

# When implementing changes
git add .
git commit -m "feat: implement feature X as per task A.md"
git push origin dev

# When completing a task
git add .tasks/
git commit -m "chore(tasks): move A.md to done"
git push origin dev
```

## Branching & GitHub Workflow

**IMPORTANT:** This repository uses a strict two-branch workflow:

- **`main`**: Production branch (deployed to Vercel). **Direct pushes are BLOCKED.**
- **`dev`**: Working branch where all development happens

**Workflow:**

1. Always work on `dev` branch: `git checkout dev && git pull`
2. Make changes and commit regularly: `git commit -m "feat: description"`
3. Push to dev: `git push origin dev`
4. Create PR from `dev` → `main` when ready to deploy
5. PR requires: 1 approval, passing checks, conversation resolution, successful deployment
6. After merge, Vercel automatically deploys to production

**Never attempt to push directly to `main`** - it will be rejected by branch protection rules.

## Project Overview

Ori Platform is an AI-powered career companion built as a pnpm workspace monorepo. The project combines a Next.js 16 frontend with backend microservices, designed to help users discover and pursue fulfilling professional roles through personalized career guidance, up-skilling paths, and real-time market intelligence.

## Subdomain Architecture

The application uses subdomain-based routing to separate marketing and application experiences:

- **Marketing Site** (`getori.app`): Public pages (landing, pricing, about, blog, features, legal)
- **Application** (`app.getori.app`): Authenticated app (dashboard, profile, applications, login, signup)

**Routing is handled automatically by middleware** (`src/proxy.ts`):
- Marketing pages on main domain redirect to app subdomain when accessing `/login`, `/signup`, `/app/*`
- App subdomain root (`/`) rewrites to dashboard
- Clean URLs on app subdomain: `/dashboard` instead of `/app/dashboard`
- PWA configured to open directly to `app.getori.app`

**File Structure** remains unchanged - subdomain routing is handled by middleware:
```
src/app/
├── page.tsx              # Landing page → getori.app
├── about/                # Marketing → getori.app
├── pricing/              # Marketing → getori.app
├── blog/                 # Marketing → getori.app
├── features/             # Marketing → getori.app
├── legal/                # Marketing → getori.app
├── login/                # Auth → app.getori.app (middleware redirects here)
├── signup/               # Auth → app.getori.app (middleware redirects here)
├── onboarding/           # Onboarding → app.getori.app
├── select-plan/          # Plan selection → app.getori.app
└── app/                  # Authenticated app → app.getori.app
    ├── dashboard/        # Served as /dashboard on app subdomain
    ├── profile/          # Served as /profile on app subdomain
    ├── applications/     # Served as /applications on app subdomain
    ├── recommendations/  # Served as /recommendations on app subdomain
    └── settings/         # Served as /settings on app subdomain
```

**How it works:**
- Files remain in their original locations
- Middleware detects subdomain and redirects/rewrites accordingly
- On `app.getori.app`, `/dashboard` rewrites to `/app/dashboard` internally
- Users see clean URLs: `app.getori.app/dashboard` not `app.getori.app/app/dashboard`

See `docs/SUBDOMAIN_MIGRATION.md` for complete setup and deployment details.

## Monorepo Structure

This is a pnpm workspace. The key directories are:

- **`src/`**: The **Next.js 16** frontend application.
  - `src/app/`: Next.js App Router pages
  - `src/components/`: React components (ui/, profile/, applications/, etc.)
  - `src/integrations/api/`: API client functions for backend communication
  - `src/hooks/`: React Query hooks for data fetching and mutations
- **`services/`**: Backend services.
  - `core-api`: Node.js/Express backend API for user profiles, authentication, and business logic.
  - `ai-engine`: Python/FastAPI service for all AI-powered features.
- **`shared/`**: Cross-service packages for types and utilities.
  - `shared/types/`: TypeScript type definitions shared across frontend and backend
- **`supabase/`**: Database migrations and Supabase configuration.
- **`docs/`**: Technical documentation (API_ENDPOINTS.md, DATABASE_SCHEMA.md)

## Development Commands

### Frontend Development

```bash
pnpm dev                    # Start Next.js at http://localhost:3000
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint (next/core-web-vitals config)
```

### Backend Development

```bash
pnpm dev:api                           # Start core-api at http://localhost:3001
pnpm --filter @ori/core-api dev        # Equivalent command
pnpm --filter @ori/core-api build      # Build core-api TypeScript

# AI Engine (Python/FastAPI)
cd services/ai-engine
pip install -r requirements.txt        # First time setup
python main.py                         # Start AI engine at http://localhost:3002
pytest tests/ -v                       # Run AI engine tests
```

### Package Management

```bash
pnpm install                # Install all workspace dependencies
pnpm --filter <package> add <dep>  # Add dependency to specific package
```

## Architecture & Data Flow

### Authentication Flow

Frontend uses `AuthProvider` context (src/contexts/AuthProvider.tsx) wrapping the app

1. Supabase client is a singleton via `getSupabaseClient()` (src/integrations/supabase/client.ts)
2. Auth state managed through Supabase auth listener + React context
3. Protected routes in `/app/*` should check auth state before rendering
4. Sign up redirects to `/app/dashboard` after email confirmation

### API Integration Pattern

**Architecture:**

- Frontend → API Client Layer → Backend API
- API clients in `src/integrations/api/` (profile.ts, applications.ts)
- React Query hooks in `src/hooks/` (useProfile.ts, useApplications.ts)
- React Query client configured in `src/lib/react-query.ts`

**API Client Pattern:**

```typescript
// Example: src/integrations/api/profile.ts
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })
  if (!response.ok) throw new Error(...)
  return response.json()
}
```

**React Query Hook Pattern:**

```typescript
// Example: src/hooks/useProfile.ts
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

**Usage in Components:**

- NO mock data - all data comes from API
- Use React Query hooks for data fetching
- Handle loading states with `isLoading`
- Handle errors with `error` object
- Use mutations for create/update/delete operations

### Payment Flow

Stripe integration via `@stripe/react-stripe-js` on frontend (src/lib/stripe.ts)

1. Payment routes in core-api: `/api/v1/payments/*`
2. Webhook endpoint MUST be before `express.json()` middleware (uses raw body)
3. Three subscription tiers: free, plus, premium (see shared/types for limits)

### Component Organization

- UI primitives in `src/components/ui/` (shadcn/ui components with Radix UI)
- Feature components grouped by domain: landing/, dashboard/, applications/, etc.
- Use Tailwind CSS for styling with dark mode support (defaults to dark theme)
- `NavLink` component in `src/components/NavLink.tsx` for navigation

## Environment Configuration

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Core API (`services/core-api/.env`)

```env
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002
```

### AI Engine (`services/ai-engine/.env`)

```env
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2      # No API keys needed!
LOG_LEVEL=INFO
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## Key Technical Details

### TypeScript Configuration

- Strict mode enabled across all packages
- Target: ES2022
- Module resolution: bundler (Next.js 13+ requirement)
- Each service has its own tsconfig.json extending root config

### Styling & UI

- Tailwind CSS v3.4 (configured with typography, scrollbar-hide, animate plugins)
- Dark mode default via next-themes
- Component library: shadcn/ui with Radix UI primitives
- Icons: lucide-react
- Toast notifications: sonner + Radix UI toast

### State Management

- React Query for server state and API caching
- React Context for auth and global UI state
- No Redux or Zustand currently

### Internationalization

- i18next with browser language detection
- Translation files in `public/locales/{en,de,es,fr,it}/`
- Configured in `src/i18n.ts`, initialized in providers

### Database

- Supabase PostgreSQL for data persistence
- Migrations in `supabase/migrations/`
- Type definitions in `shared/types/src/index.ts`
- Core tables:
  - `user_profiles`: User profile data (full_name, headline, location, about, skills, goals)
  - `experiences`: Work experience records (company, role, dates, description)
  - `education`: Education records (institution, degree, dates, description)
  - `applications`: Job applications tracking (job_title, company, status, dates)
- Row Level Security (RLS) enabled on all tables
- Auth handled by Supabase Auth
- Complete schema documentation: `docs/DATABASE_SCHEMA.md`

## Testing Approach

**Core API Tests:**

- Tests in `services/core-api/src/routes/__tests__/`
- Jest configuration: `services/core-api/jest.config.js`
- **IMPORTANT:** Use `setupFiles` (not `setupFilesAfterEnv`) to load env vars before module imports
- Test setup: `services/core-api/src/__tests__/setup.ts`
- Mock environment variables are pre-configured in setup file
- Run tests: `pnpm --filter @ori/core-api test`

**Frontend Tests:**

- Colocate tests with source files (`*.test.tsx`, `*.spec.ts`)
- Use React Testing Library for component tests
- Mock API clients in tests

**General Patterns:**

- Mock Supabase and Stripe in tests to avoid external dependencies
- Use supertest for integration tests in core-api
- Ensure all tests can run without real external services

## Common Development Patterns

### Adding a New API Endpoint

**Backend (core-api):**

1. Create route handler in `services/core-api/src/routes/`
2. Define Zod schemas for request/response validation
3. Import and mount in `services/core-api/src/index.ts`
4. Add types to `shared/types/src/index.ts`
5. Document in `docs/API_ENDPOINTS.md`
6. Build: `pnpm --filter @ori/core-api build`

**Frontend Integration:**

1. Create API client function in `src/integrations/api/[domain].ts`
2. Create React Query hook in `src/hooks/use[Domain].ts`
3. Use hook in component (no mock data!)

**Example:**

```typescript
// Backend: services/core-api/src/routes/profile.ts
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const profile = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single()
  res.json(profile.data)
})

// API Client: src/integrations/api/profile.ts
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}

// Hook: src/hooks/useProfile.ts
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  })
}

// Component: src/app/app/profile/page.tsx
const { data: profile, isLoading } = useProfile()
```

### Creating a New Protected Page

Add route under `src/app/app/` (nested under authenticated section)

1. Check auth state in page component using `useAuth()` hook
2. Redirect to `/login` if not authenticated
3. Use React Query hooks for data fetching (NO mock data)
4. Handle loading and error states
5. Add navigation item to `src/lib/navConfig.ts` if needed

### Adding Shared Types

Define in `shared/types/src/index.ts`

1. Export from package
2. Import in consuming packages as `@ori/types`
3. Keep frontend and backend types in sync

## Code Style Conventions

- Use TypeScript strict mode - no implicit any
- React: functional components with hooks
- Prefer composition over inheritance
- 2-space indentation (existing convention)
- Use async/await over raw promises
- Tailwind classes grouped by: layout → appearance → state
- Run `pnpm lint` before committing

## Deployment Considerations

- Frontend deploys to Vercel with Analytics and Speed Insights enabled
- Core-api (Express.js) deploys alongside frontend on Vercel
- AI Engine deploys to Google Cloud Run as a containerized service
- Core-api needs PORT, Supabase, and Stripe env vars
- Stripe webhook endpoint must be registered in Stripe dashboard
- Supabase project: zkdgtofxtzqnzgncqlyc.supabase.co

## My Role: Implementer & Builder

### UI/UX Development with v0.dev

For any task that requires creating a new React component or UI element, you must follow this workflow:

1.  **Generate with v0.dev**: Your first step is to navigate to v0.dev. Use a descriptive text prompt to generate the component. Iterate on the prompt until the generated component closely matches the task requirements.
2.  **Copy Code**: Copy the generated JSX and code from v0.dev.
3.  **Integrate**: Create a new component file in the appropriate directory (e.g., `src/components/feature-name/NewComponent.tsx`).
4.  **Adapt**: Modify the pasted code as necessary. This may include:
    - Connecting it to our application's state management (React Query, hooks).
    - Passing the correct props.
    - Adjusting types to match our `shared/types`.
    - Refining styles to ensure perfect consistency with our design system.

**Primary Responsibilities:**
**Claim Tasks**: Move task files from `.tasks/todo/` to `.tasks/in-progress/`

1. **Implement**: Execute plans defined by Gemini with precision and creativity
2. **Complete**: Move finished tasks to `.tasks/done/` after implementation
3. **Test**: Ensure code works as expected before marking complete

**Task Workflow:**
Review task file in `.tasks/todo/`

1. Move to `.tasks/in-progress/` and commit
2. Implement feature following task instructions
3. Run tests (`pnpm lint`, `pnpm build`)
4. Move to `.tasks/done/` and commit
5. Update documentation if major change

## Important Notes

1. Always use pnpm, never npm or yarn (workspace dependency)
2. Core-api uses `.js` extensions despite TypeScript (ES module compatibility)
3. Stripe webhook route MUST be before `express.json()` (raw body requirement)
4. Supabase client is singleton - always use `getSupabaseClient()`
5. `@/` path alias only works in frontend, not in services/
6. **AI Engine**: Core-api gracefully falls back if AI engine unavailable
7. **AI Engine First Run**: Downloads ~80MB sentence-transformer model (one-time)
8. **Service Communication**: AI engine (3002) ← core-api (3001) ← frontend (3000)
9. **No Mock Data**: All frontend pages must use React Query hooks - never use mock data
10. **TypeScript Strict**: Avoid `any` types - define proper interfaces instead
11. **React useEffect**: Use `useRef` to prevent cascading renders when initializing state from props
12. **Jest Tests**: Environment variables must be loaded in `setupFiles` (not `setupFilesAfterEnv`)

## Development Patterns

- **Error handling**: React Query error states on frontend, `{ error: string }` from API
- **Loading states**: React Query `isLoading` and `isFetching`
- **Form validation**: React Hook Form + Zod resolvers
- **Date handling**: date-fns library
- **Toast notifications**: sonner via `toast()` function

## MCP-First Development (Phase 1+)

As of November 2025, Ori Platform uses MCP (Model Context Protocol) servers to modernize three critical workflows. This section documents MCP integration patterns and when to use them.

### When to Use Each MCP

#### Stripe MCP - Payment Testing
**Use When**: Testing payment flows, subscription changes, webhook handling

```typescript
// Instead of:
// 1. Open Stripe dashboard
// 2. Navigate to test customers
// 3. Copy webhook manually
// 4. Paste into test

// Do This:
import { createTestCustomer, simulateWebhook } from './__tests__/stripe-helpers'

const customer = await createTestCustomer({
  email: 'test@example.com',
  planId: 'plus_monthly'
})

const webhook = await simulateWebhook('customer.subscription.updated', {
  customerId: customer.id
})
```

**Why**: 80%+ faster testing, zero context-switching, test data integrated in code

#### Resend MCP - Email Development
**Use When**: Creating or testing email templates, debugging email workflows

```typescript
// Instead of:
// 1. Copy template to Resend dashboard
// 2. Fill in sample data
// 3. Preview email
// 4. Go back to code

// Do This:
import { emailService } from '../services/email'

// Preview email with sample data
const preview = await emailService.preview('welcome', {
  name: 'John Doe'
})

// Test sending
await emailService.sendWelcome('test@example.com', 'John Doe')
```

**Why**: Templates versioned in git, testing from IDE, no manual copy/paste

#### PostgreSQL MCP - Database Development
**Use When**: Inspecting schema, testing RLS policies, validating migrations

```typescript
// Instead of:
// 1. Open psql/DBeaver
// 2. Write schema query
// 3. Review results
// 4. Go back to code

// Do This:
import { inspectSchema, testRLSPolicy } from './__tests__/database-helpers'

const schema = await inspectSchema('user_profiles')
const rlsValid = await testRLSPolicy({
  table: 'applications',
  userId: 'user-123',
  expectedAccess: 'read_own'
})
```

**Why**: Schema queries from IDE, RLS testing automated, zero external tools

### MCP Integration Checklist

When adding a new feature that involves payment, email, or database:

- [ ] **Payment Flow?** → Use Stripe MCP for testing (see `services/core-api/src/__tests__/stripe-helpers.ts`)
- [ ] **Email Trigger?** → Use `emailService` and test with Resend MCP (see `services/core-api/src/services/email.ts`)
- [ ] **Database Schema Change?** → Validate with PostgreSQL MCP (see docs/POSTGRES_MCP_WORKFLOWS.md)
- [ ] **New RLS Policy?** → Test with RLS helpers (see docs/POSTGRES_MCP_WORKFLOWS.md)
- [ ] **Migration?** → Validate before applying (use `migrationValidator`)

### MCP Environment Setup

All three MCP servers require environment variables. Never commit credentials:

```env
# .env.local or services/core-api/.env
STRIPE_API_KEY=sk_test_xxxxx           # Sandbox only
RESEND_API_KEY=re_xxxxx                # Test API
DATABASE_URL=postgresql://...          # Dev DB only
```

Configuration is in `.claude/mcp.json` (committed, no secrets):

```json
{
  "mcpServers": {
    "stripe": { "command": "npx", "args": ["@modelcontextprotocol/server-stripe"] },
    "resend": { "command": "npx", "args": ["@modelcontextprotocol/server-resend"] },
    "postgres": { "command": "npx", "args": ["@modelcontextprotocol/server-postgres"] }
  }
}
```

### Deprecations (MCP Phase 1)

The following workflows are deprecated as of Week 6, 2025:

| Old Workflow | New Workflow | Sunset Date |
|--------------|--------------|-------------|
| Manual Stripe dashboard testing | Stripe MCP helpers | Week 6 |
| Manual email setup | EmailService + Resend MCP | Week 8 |
| External database tools (psql, DBeaver) | PostgreSQL MCP queries | Week 10 |

### Documentation References

See `docs/MCP_DOCUMENTATION_INDEX.md` for the current, authoritative guide to all MCP documentation.

**Key Documents**:
- **Decision Guide**: `docs/NEXT_STEPS.md` - What's happening and options
- **Implementation Plan**: `docs/MCP_REFACTORING_PLAN.md` - Phase-by-phase strategy
- **Navigation Index**: `docs/MCP_DOCUMENTATION_INDEX.md` - All MCP docs and reading paths
- **Architecture Audit**: `docs/MCP_ARCHITECTURE_AUDIT.md` - Why we need MCP (reference)
