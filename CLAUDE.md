# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guide Maintenance

Always keep this guide synchronized with `AGENTS.md`. After landing a major feature, infrastructure change, or new workflow: update this file AND the relevant sections in `AGENTS.md`, referencing the PR. This is crucial for multi-agent collaboration.

## Agent Responsibilities

**As Claude (Implementer & Builder), I must:**

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
git push origin development

# When implementing changes
git add .
git commit -m "feat: implement feature X as per task A.md"
git push origin development

# When completing a task
git add .tasks/
git commit -m "chore(tasks): move A.md to done"
git push origin development
```

## Branching & GitHub Workflow

**IMPORTANT:** This repository uses a strict two-branch workflow:

- **`main`**: Production branch (deployed to Vercel). **Direct pushes are BLOCKED.**
- **`development`**: Working branch where all development happens

**Workflow:**
Always work on `development` branch: `git checkout development && git pull`
1. Make changes and commit regularly: `git commit -m "feat: description"`
2. Push to development: `git push origin development`
3. Create PR from `development` → `main` when ready to deploy
4. PR requires: 1 approval, passing checks, conversation resolution, successful deployment
6. After merge, Vercel automatically deploys to production

**Never attempt to push directly to `main`** - it will be rejected by branch protection rules.

## Project Overview

Ori Platform is an AI-powered career companion built as a pnpm workspace monorepo. The project combines a Next.js 16 frontend with backend microservices, designed to help users discover and pursue fulfilling professional roles through personalized career guidance, up-skilling paths, and real-time market intelligence.

## Monorepo Structure

This is a pnpm workspace with three main areas:

- **Root (`src/`)**: Next.js 16 App Router frontend with TypeScript
  - `src/app/`: App Router routes and layouts (landing pages, auth, `/app/*` authenticated routes)
  - `src/components/`: Reusable React components organized by feature (ui/, landing/, dashboard/, etc.)
  - `src/contexts/`: React contexts (AuthProvider for Supabase auth)
  - `src/hooks/`: Custom React hooks
  - `src/integrations/`: Third-party service clients (Supabase)
  - `src/lib/`: Utilities and configurations (stripe, react-query, seo, navConfig)
  - Path alias: `@/*` maps to `./src/*`

- **Services (`services/`)**: Backend microservices
  - `services/core-api/`: Express + TypeScript REST API (port 3001)
    - Routes: `/api/v1/{applications,jobs,payments,users}`
    - Integrates with Supabase, Stripe, and AI Engine
  - `services/ai-engine/`: Python FastAPI AI service (port 3002)
    - Semantic job matching using sentence-transformers
    - Skill gap analysis and learning path generation
    - Multi-factor scoring: semantic (40%), skills (30%), experience (15%), location (10%), salary (5%)
    - Endpoints: `/api/v1/{match,analyze-skills,learning-paths,recommend-roles}`

- **Shared (`shared/`)**: Cross-service packages
  - `shared/types/`: TypeScript type definitions (User, Job, Application, etc.)
  - `shared/utils/`: Shared utility functions

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
- Frontend queries core-api via React Query (TanStack Query)
- React Query client configured in `src/lib/react-query.ts`
- API base URL should be configurable for local vs. production environments
- Core-api expects CORS from frontend origin

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
- Target: ES2017 for Next.js compatibility
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
- Type definitions in `shared/types/src/index.ts`
- Core tables: users, user_profiles, jobs, applications
- Auth handled by Supabase Auth

## Testing Approach

While test infrastructure isn't fully established, follow these patterns:
- Colocate tests with source files (`*.test.tsx`, `*.spec.ts`)
- Mock Supabase and Stripe in tests to avoid external dependencies
- Core-api should use supertest for integration tests
- Frontend should use React Testing Library

## Common Development Patterns

### Adding a New API Route
Create route handler in `services/core-api/src/routes/`
1. Import and mount in `services/core-api/src/index.ts`
2. Add types to `shared/types/src/index.ts` if needed
3. Build core-api: `pnpm --filter @ori/core-api build`

### Creating a New Protected Page
Add route under `src/app/app/` (nested under authenticated section)
1. Check auth state in page component using `useAuth()` hook
2. Redirect to `/login` if not authenticated
3. Add navigation item to `src/lib/navConfig.ts` if needed

### Adding Shared Types
Define in `shared/types/src/index.ts`
1. Export from package
2. Import in consuming packages as `@ori/types` (may need workspace setup)

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
- Core-api needs PORT, Supabase, and Stripe env vars
- Stripe webhook endpoint must be registered in Stripe dashboard
- Supabase project: zkdgtofxtzqnzgncqlyc.supabase.co

## My Role: Implementer & Builder

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
6. Update documentation if major change

## Important Notes

1. Always use pnpm, never npm or yarn (workspace dependency)
2. Core-api uses `.js` extensions despite TypeScript (ES module compatibility)
3. Stripe webhook route MUST be before `express.json()` (raw body requirement)
4. Supabase client is singleton - always use `getSupabaseClient()`
6. `@/` path alias only works in frontend, not in services/
7. **AI Engine**: Core-api gracefully falls back if AI engine unavailable
8. **AI Engine First Run**: Downloads ~80MB sentence-transformer model (one-time)
9. **Service Communication**: AI engine (3002) ← core-api (3001) ← frontend (3000)

## Development Patterns

- **Error handling**: React Query error states on frontend, `{ error: string }` from API
- **Loading states**: React Query `isLoading` and `isFetching`
- **Form validation**: React Hook Form + Zod resolvers
- **Date handling**: date-fns library
- **Toast notifications**: sonner via `toast()` function
