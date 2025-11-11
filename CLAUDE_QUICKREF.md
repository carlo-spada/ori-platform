---
type: quick-reference
role: command-reference
scope: all
audience: claude
last-updated: 2025-11-11
relevance: commands, quick-reference, workflows, shortcuts
priority: high
quick-read-time: 1min
deep-dive-time: 3min
---

# CLAUDE QUICK REFERENCE CARD

**⚠️ IMPORTANT: Always read [DOC_INDEX.md](./DOC_INDEX.md) first for current project status and navigation.**

> Copy-paste commands for immediate action. No reading required.

## TASK MANAGEMENT

```bash
# Claim task (auto-enforces WIP limit)
./scripts/task claim feature-x

# Complete task
./scripts/task complete feature-x

# Check health
./scripts/task health

# List tasks
./scripts/task list wip      # Current work
./scripts/task list todo     # Available tasks
./scripts/task list done     # Awaiting review
```

## ADD API ENDPOINT (5 steps)

```bash
# 1. Create handler
touch services/core-api/src/routes/new-endpoint.js

# 2. Add types
echo "export interface NewEndpoint { ... }" >> shared/types/src/index.ts

# 3. Create API client
touch src/integrations/api/new-endpoint.ts

# 4. Create hook
touch src/hooks/useNewEndpoint.ts

# 5. Use in component (NO MOCK DATA - use React Query hook)
```

## BEFORE COMMIT

```bash
pnpm lint --fix && pnpm build && pnpm test
```

## BEFORE PR

```bash
# Run all checks
pnpm lint && pnpm build && pnpm test

# Create PR
gh pr create --title "feat: description" --body "## Summary
- Change 1
- Change 2

## Test Plan
- [ ] Tests pass
- [ ] Manual testing complete"
```

## SPECIALIZED AGENTS (Auto-triggered on PR)

| File Change             | Agent Triggered          | Purpose                  |
| ----------------------- | ------------------------ | ------------------------ |
| `supabase/migrations/*` | schema-contract-sentinel | Prevent breaking changes |
| `services/*/routes/*`   | test-architect           | Ensure test coverage     |
| Multi-service changes   | flow-orchestrator        | Integration safety       |
| Any PR                  | code-guardian            | Code quality review      |
| `*.md` files            | docs-dx-curator          | Documentation quality    |

## GIT WORKFLOW

```bash
# Start work
git checkout dev && git pull

# During work (commit often!)
git add . && git commit -m "feat: what changed" && git push

# Create branch for PR
git checkout -b feat/branch-name
```

## REACT QUERY PATTERN

```typescript
// API Client (src/integrations/api/endpoint.ts)
export async function fetchData(): Promise<DataType> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/v1/endpoint`, { headers })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

// Hook (src/hooks/useEndpoint.ts)
export function useData() {
  return useQuery({
    queryKey: ['data-key'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000  // 5 min
  })
}

// Component (NO MOCK DATA!)
const { data, isLoading, error } = useData()
if (isLoading) return <Spinner />
if (error) return <Error />
```

## COMMON PATHS

```
Frontend:       src/
├── app/                  # Next.js pages (App Router)
├── components/           # React components + tests
├── integrations/api/     # API client functions
├── hooks/               # React Query hooks
└── contexts/            # React Context (auth, UI)

Backend:        services/
├── core-api/            # Express.js (port 3001)
│   ├── routes/          # API endpoints
│   └── __tests__/       # Jest tests
└── ai-engine/           # Python FastAPI (port 3002)

Shared:         shared/types/    # TypeScript interfaces
Database:       supabase/migrations/   # Schema changes
```

## ENV FILES

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Core API (services/core-api/.env)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Engine (services/ai-engine/.env)
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

## PORTS

- Frontend: `http://localhost:3000`
- Core API: `http://localhost:3001`
- AI Engine: `http://localhost:3002`

## TEST PATTERNS

```typescript
// Frontend Mock (vitest)
import { vi } from 'vitest'
vi.mock('@/integrations/api/profile', () => ({
  fetchProfile: vi.fn().mockResolvedValue({ id: '1', name: 'Test' }),
}))

// Backend Mock (jest - mock Supabase completely)
jest.mock('@supabase/supabase-js')
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue({ data: [], error: null }),
}
```

## CRITICAL RULES (AGENTIC WORKFLOW - 10x SPEED)

1. **WIP Limit**: Max 5 tasks in progress (enforced by CLI)
2. **Task Velocity**: Complete tasks within 30 hours (stale after 30hr)
3. **Commit Frequency**: Every 15-30 minutes during active work
4. **Review Cycle**: PRs should be reviewed within 4 hours
5. **Health Checks**: Run every 4 hours automatically
6. **No Mock Data**: Always use React Query hooks in components
7. **Test First**: Write tests before implementation
8. **Use Agents**: They auto-review PRs for quality

## QUICK FIXES

| Problem            | Solution                                                  |
| ------------------ | --------------------------------------------------------- |
| WIP limit exceeded | `./scripts/task list wip` then complete/archive           |
| Type errors        | `pnpm tsc --noEmit` to check                              |
| Lint errors        | `pnpm lint --fix`                                         |
| Tests fail         | Check env vars in `setupFiles` (not `setupFilesAfterEnv`) |
| Build fails        | `pnpm build` locally before push                          |

## TASK WORKFLOW (FAST PATH)

```bash
# 1. Check what's available
./scripts/task list todo

# 2. Claim it
./scripts/task claim feature-x

# 3. Implement & commit often
git add . && git commit -m "feat: progress" && git push

# 4. Complete when done
./scripts/task complete feature-x

# 5. Create PR (agents auto-review)
gh pr create --title "feat: feature-x"
```
