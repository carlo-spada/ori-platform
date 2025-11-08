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

## Monorepo Structure

This is a pnpm workspace. The key directories are:

- **`api/`**: **Vercel Serverless Functions**. This is the production backend API.
- **`src/`**: The **Next.js** frontend application.
- **`services/`**: Supporting backend services.
  - `core-api`: A local-only Express server that mirrors the serverless API for development.
  - `ai-engine`: The Python/FastAPI service for all AI features.
- **`shared/`**: Cross-service packages for types and utilities.

## Development Commands

### Frontend Development

```bash
pnpm dev                    # Start Next.js at http://localhost:3000
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint (next/core-web-vitals config)
```

### Backend Development
The production API runs as serverless functions in the `api/` directory and is served by `pnpm dev`. The following command is for running the local-only Express server for development and debugging.

```bash
pnpm dev:api                           # Start local-only core-api at http://localhost:3001
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

### UI/UX Development with v0.dev
For any task that requires creating a new React component or UI element, you must follow this workflow:

1.  **Generate with v0.dev**: Your first step is to navigate to v0.dev. Use a descriptive text prompt to generate the component. Iterate on the prompt until the generated component closely matches the task requirements.
2.  **Copy Code**: Copy the generated JSX and code from v0.dev.
3.  **Integrate**: Create a new component file in the appropriate directory (e.g., `src/components/feature-name/NewComponent.tsx`).
4.  **Adapt**: Modify the pasted code as necessary. This may include:
    *   Connecting it to our application's state management (React Query, hooks).
    *   Passing the correct props.
    *   Adjusting types to match our `shared/types`.
    *   Refining styles to ensure perfect consistency with our design system.

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

## Development Patterns

- **Error handling**: React Query error states on frontend, `{ error: string }` from API
- **Loading states**: React Query `isLoading` and `isFetching`
- **Form validation**: React Hook Form + Zod resolvers
- **Date handling**: date-fns library
- **Toast notifications**: sonner via `toast()` function
