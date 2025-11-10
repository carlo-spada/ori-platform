# Claude: Implementer & Builder

My role: Execute plans from Gemini with precision, speed, and elegance. Implement features, maintain code quality, push frequently.

---

## Task Workflow (CRITICAL)

See `.tasks/TASK_GOVERNANCE.md` for complete rules. Quick version:

1. **Claim**: Find task in `.tasks/todo/` → `git mv` to `.tasks/in-progress/` → `git commit && git push`
2. **Implement**: Code → `git commit && git push` after EVERY logical unit
3. **Complete**: `git mv` to `.tasks/done/` → `git commit && git push`

**Rule**: Commit/push at minimum once per `.tasks/` move. Multiple times for code is better.

---

## Git Discipline

- **After task move**: `git commit -m "chore(tasks): claim/complete [feature]" && git push`
- **After code unit**: `git commit -m "feat: [what was done]" && git push`
- **Before PR**: `pnpm lint && pnpm build && pnpm test` (must pass)
- **Never**: Push directly to `main` (branch protection blocks it)

---

## Monorepo Quick Map

```
src/                    # Next.js 16 frontend (3000)
  app/                  # App Router pages
  components/           # React components + tests
  integrations/api/     # API client functions
  hooks/                # React Query hooks (data fetching)
  contexts/             # React Context (auth, UI state)

services/
  core-api/             # Express.js backend (3001)
    routes/             # Endpoint handlers
    __tests__/          # Jest tests (setupFiles for env vars)
  ai-engine/            # Python FastAPI (3002)
    tests/              # pytest tests

shared/types/           # Shared TypeScript types

supabase/migrations/    # Database schema
```

---

## Architecture Patterns

### Authentication
```typescript
// Frontend: Use AuthProvider context
import { useAuth } from '@/contexts/AuthProvider'
const { user, isLoading } = useAuth()
```

### Data Fetching (React Query)
```typescript
// API Client: src/integrations/api/
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/v1/profile`, { method: 'GET', headers })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// Hook: src/hooks/
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

// Component: Use hook, NO mock data
const { data: profile, isLoading, error } = useProfile()
```

### Adding API Endpoints
1. Create handler in `services/core-api/src/routes/`
2. Define Zod validation schemas
3. Mount in `services/core-api/src/index.ts`
4. Add types to `shared/types/src/index.ts`
5. Create API client in `src/integrations/api/`
6. Create hook in `src/hooks/`
7. Use hook in component (never mock data)
8. Document in `docs/API_ENDPOINTS.md`

---

## UI Development (v0.dev First)

For any new component or UI:
1. Go to v0.dev
2. Describe component: "I need a [description] that [functionality] with [style]"
3. Iterate prompt until generated code matches task
4. Copy JSX → create file in `src/components/[feature]/`
5. Adapt: Connect to React Query hooks, adjust types, refine styles

---

## Testing

**Frontend** (`src/**/*.test.tsx`):
- React Testing Library (test behavior, not implementation)
- Vitest test runner
- Mock API clients (never real network calls)
```typescript
import { vi } from 'vitest'
vi.mock('@/integrations/api/profile', () => ({
  fetchProfile: vi.fn().mockResolvedValue({ id: '1', name: 'Test' })
}))
```

**Backend** (`services/core-api/src/routes/__tests__/`):
- Jest + supertest
- Mock Supabase completely (no real DB)
- Mock Stripe (use test keys)
- **CRITICAL**: Load env vars in `setupFiles` (not `setupFilesAfterEnv`)
```typescript
// services/core-api/jest.config.js
module.exports = {
  setupFiles: ['./src/__tests__/setup.ts'],  // ← Load env first
}
```

**AI Engine** (`services/ai-engine/tests/`):
- pytest
- Mock embedding model responses
- Test API contracts with core-api

---

## Code Standards

| Item | Standard |
|------|----------|
| TypeScript | Strict mode, no implicit `any` |
| Components | PascalCase, functional + hooks |
| Functions | camelCase, async/await |
| Env Vars | SCREAMING_SNAKE_CASE |
| Indentation | 2 spaces |
| Strings | Single quotes |
| Tailwind | `layout → color → state` order |

**Before commit**: `pnpm lint --fix`

---

## Environment Setup

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Core API (`services/core-api/.env`)
```env
PORT=3001
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002
```

### AI Engine (`services/ai-engine/.env`)
```env
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2  # No API keys needed
LOG_LEVEL=INFO
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

---

## Critical Technical Constraints

1. **pnpm only** (not npm/yarn)
2. **Core-api `.js` extensions** (ES module compatibility)
3. **Stripe webhook before `express.json()`** (raw body requirement)
4. **Supabase singleton**: `getSupabaseClient()` (src/integrations/supabase/client.ts)
5. **`@/` path alias**: Frontend only (not in services/)
6. **AI Engine graceful fallback**: Core-api works if AI engine is down
7. **No mock data in frontend**: React Query only
8. **Service ports**: Frontend 3000, core-api 3001, ai-engine 3002

---

## Subdomain Architecture

- `getori.app`: Marketing (landing, pricing, blog)
- `app.getori.app`: Authenticated app (dashboard, profile)
- Routing: Middleware (`src/proxy.ts`) handles subdomains automatically
- File structure unchanged; middleware rewrites URLs internally

---

## Development Checklist

- [ ] Task moved to `.tasks/in-progress/`
- [ ] Code passes `pnpm lint`
- [ ] Code passes `pnpm build`
- [ ] Tests written and passing
- [ ] API client + hook created (if backend change)
- [ ] No mock data in frontend
- [ ] No implicit `any` types
- [ ] Stripe webhook before middleware (if payment)
- [ ] Task moved to `.tasks/done/`
- [ ] Commits pushed (min 1, ideally after each unit)

---

## Documentation to Update (If Major Change)

After landing a significant feature:
- `README.md`: Setup, structure, new features
- `AGENTS.md`: If workflow changed
- `CLAUDE.md` (this file): If implementation patterns changed
- `docs/API_ENDPOINTS.md`: If new endpoints
- `docs/DATABASE_SCHEMA.md`: If schema changed

---

## Quick Reference

**Start work**: `git checkout dev && git pull`

**During work**: `git commit -m "feat: [description]" && git push` (after each logical unit)

**Before PR**: `pnpm lint && pnpm build && pnpm test`

**Finish task**: Move to done, commit, push

**Create PR**: `dev` → `main` (requires 1 approval, all checks pass)

---

## When Stuck

- Check `.tasks/TASK_GOVERNANCE.md` (task rules)
- Check `AGENTS.md` (workflow, architecture)
- Check `docs/DATABASE_SCHEMA.md` (if database question)
- Check `docs/API_ENDPOINTS.md` (if endpoint question)
- Check relevant component test for pattern example
