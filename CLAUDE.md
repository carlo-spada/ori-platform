# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guide Maintenance

Whenever you land a major feature, infrastructure change, or new workflow, not just update this .md file but also update the relevant sections in the AGENTS.md file and reference the PR so every agent stays in sync at all times.

## GitHub Considerations

Always keep the repository synchronized across all platforms and servers. After completing a set of changes, follow GitHub’s standard workflow: add, commit, and push your updates using clear messages and consistent practices. This ensures version integrity and collaboration reliability across environments.

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
    - Integrates with Supabase and Stripe
  - `services/ai-engine/`: Python-based AI service (structure TBD)

- **Shared (`shared/`)**: Cross-service packages
  - `shared/types/`: TypeScript type definitions (User, Job, Application, etc.)
  - `shared/utils/`: Shared utility functions
  - `shared/database/`: Database-related shared code

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
```

### Package Management
```bash
pnpm install                # Install all workspace dependencies
pnpm --filter <package> add <dep>  # Add dependency to specific package
```

## Architecture & Data Flow

### Authentication Flow
1. Frontend uses `AuthProvider` context (src/contexts/AuthProvider.tsx) wrapping the app
2. Supabase client is a singleton via `getSupabaseClient()` (src/integrations/supabase/client.ts)
3. Auth state managed through Supabase auth listener + React context
4. Protected routes in `/app/*` should check auth state before rendering
5. Sign up redirects to `/app/dashboard` after email confirmation

### API Integration Pattern
- Frontend queries core-api via React Query (TanStack Query)
- React Query client configured in `src/lib/react-query.ts`
- API base URL should be configurable for local vs. production environments
- Core-api expects CORS from frontend origin

### Payment Flow
1. Stripe integration via `@stripe/react-stripe-js` on frontend (src/lib/stripe.ts)
2. Payment routes in core-api: `/api/v1/payments/*`
3. Webhook endpoint MUST be before `express.json()` middleware (uses raw body)
4. Three subscription tiers: free, plus, premium (see shared/types for limits)

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
1. Create route handler in `services/core-api/src/routes/`
2. Import and mount in `services/core-api/src/index.ts`
3. Add types to `shared/types/src/index.ts` if needed
4. Build core-api: `pnpm --filter @ori/core-api build`

### Creating a New Protected Page
1. Add route under `src/app/app/` (nested under authenticated section)
2. Check auth state in page component using `useAuth()` hook
3. Redirect to `/login` if not authenticated
4. Add navigation item to `src/lib/navConfig.ts` if needed

### Adding Shared Types
1. Define in `shared/types/src/index.ts`
2. Export from package
3. Import in consuming packages as `@ori/types` (may need workspace setup)

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

## Important Notes

1. The project was previously called "Aura" and is being rebranded to "Ori" - you may see references to both names
2. Always use pnpm, never npm or yarn (workspace configuration depends on it)
3. The core-api imports use `.js` extensions despite being TypeScript (ES module compatibility)
4. Stripe webhook route MUST be registered before `express.json()` to receive raw body
5. Supabase client is a singleton - always use `getSupabaseClient()`, never create new instances
6. All Radix UI components are pre-installed via shadcn/ui
7. The `@/` path alias only works in the frontend package, not in services/

## Known Patterns to Follow

- Error handling: Use React Query's error states on frontend, return `{ error: string }` from API
- Loading states: React Query provides `isLoading` and `isFetching` states
- Form validation: React Hook Form + Zod resolvers (@hookform/resolvers)
- Date handling: date-fns library
- Toast notifications: Use sonner via `toast()` function
