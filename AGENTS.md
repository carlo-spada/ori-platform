# Repository Guidelines

**Repository State**: Living, evolving system. Every change is an act of careful architecture. Favor clarity, safety, and long-term adaptability.

---

## Quick Reference

**Workflow**: Claude (research → implement → review) → PR → `main` → Deploy

**Mode Switching** (within same Claude session):
- Research: `"Research: [what to find]"`
- Implement: `"Implement: [feature]"` (default)
- Review: `"Review: [what to check]"`
- Consult: `"Consult [Gemini/Codex]: [question]"` (rare)

**Task Management** (AGENTIC WORKFLOW - 10x Speed):
```bash
./scripts/task health         # Check WIP and bottlenecks (stale = >30hr)
./scripts/task claim X        # Claim task (enforces WIP limit)
./scripts/task complete X     # Mark task done (target: <30hr)
./scripts/task list wip       # Show current work with hours tracking
./scripts/task archive X      # Move to backlog if blocked
```

**⚡ AGENTIC EXPECTATIONS**:
- Tasks stale after **30 hours** (not 14 days)
- Health checks run **every 4 hours** (not weekly)
- Commit every **15-30 minutes** during work
- PRs reviewed within **4 hours**
- Daily velocity: **5-10 tasks/day** (not 3/week)

**Task Governance**: See `.tasks/TASK_GOVERNANCE.md` (single source of truth for all agents)

**Branch Rules**:
- `main`: Production (auto-deploy Vercel). Direct pushes BLOCKED.
- `dev`: Working branch. All work here first.

---

## Git Workflow

### Day-to-Day
1. Work on `dev`: `git checkout dev && git pull`
2. Commit frequently: `git commit -m "feat: description"` (conventional commits)
3. Push after each logical unit: `git push origin dev`
4. Before PR: `pnpm lint && pnpm build`

### PR to Production
1. Create PR `dev` → `main` with clear description
2. Link issues: `Closes #123`
3. PR gates: 1 approval, checks pass, conversations resolved, Vercel deploy succeeds
4. Merge (squash recommended) → auto-deploy

**Why frequent commits**: Prevents work loss, keeps team synchronized, enables easy rollbacks.

---

## Project Structure

**Monorepo (pnpm workspace)**:
- `src/`: Next.js 16 frontend
- `services/core-api/`: Express.js backend (port 3001)
- `services/ai-engine/`: Python FastAPI (port 3002, semantic job matching)
- `shared/types/`: Shared TypeScript definitions
- `docs/`: Technical documentation
- `supabase/migrations/`: Database schema

**Subdomains**:
- `getori.app`: Marketing (landing, pricing, blog, legal)
- `app.getori.app`: Authenticated app (dashboard, profile, applications)
- Routing handled by middleware (`src/proxy.ts`)

---

## Essential Commands

```bash
# Frontend
pnpm dev                              # Start Next.js (3000)
pnpm build && pnpm start             # Production
pnpm lint                            # ESLint check

# Backend
pnpm dev:api                         # Start core-api (3001)
pnpm --filter @ori/core-api build    # Build TypeScript

# AI Engine
cd services/ai-engine
pip install -r requirements.txt      # First setup
python main.py                       # Start (3002)
pytest tests/ -v                     # Tests

# Database
supabase db pull                      # Sync migrations locally
```

---

## Task Governance (CRITICAL)

**Every agent MUST follow `.tasks/TASK_GOVERNANCE.md`**

| Phase | Owner | Action |
|-------|-------|--------|
| Creation | Gemini | Create in `.tasks/todo/` (large: folder+A.md/B.md/C.md, small: file) |
| Claiming | Claude | Move to `.tasks/in-progress/` + commit |
| Implementation | Claude | Code + frequent commits |
| Completion | Claude | Move to `.tasks/done/` + commit |
| Review | Codex | Move to `.tasks/in-review/` → `.tasks/reviewed/` |
| Release | Carlo | Merge `.tasks/reviewed/` to `main` |

**Commit discipline**:
- After EVERY task move: `git commit && git push`
- After EVERY logical code unit: `git commit && git push`
- Minimum: Once per task in `.tasks/`

**Quality gates** (before task completion):
- Code passes linting/build
- Tests cover new logic (80%+ core-api, 70%+ frontend)
- Breaking changes have migration plans
- Documentation updated (README, AGENTS.md, CLAUDE.md)

---

## Agent Workflow (Claude-Primary)

### Primary Agent: Claude (All Modes)
Claude now handles the complete development cycle in different modes:

#### 🔍 Research Mode (replaces Gemini)
- **Trigger**: "Research: [what to find]"
- **Do**: Find code, analyze patterns, understand architecture
- **Tools**: Task with Explore, Grep, Glob, Read

#### 💻 Implementation Mode (default)
- **Trigger**: "Implement: [what to build]" or default
- **Do**: Claim tasks → code → test → commit → complete
- **Rules**: Commit every 15-30 min, use v0.dev for UI, no mock data

#### ✅ Review Mode (replaces Codex)
- **Trigger**: "Review: [what to check]"
- **Do**: Run tests, trigger specialized agents, validate quality
- **Tools**: Bash (tests/lint), specialized agents

### External Consultants (On-Demand Only)

#### Gemini (Creative Consultant)
- **When**: Need creative ideas, UX design, architecture decisions
- **How**: "Consult Gemini about: [specific question]"
- **Not for**: Daily coding tasks

#### Codex (Technical Consultant)
- **When**: Complex algorithms, security audits, performance optimization
- **How**: "Get Codex opinion on: [code or approach]"
- **Not for**: Standard code reviews

#### Carlo (Decision Maker)
- **Do**: Final review → merge to `main`
- **How**: When all feature tasks in `.tasks/reviewed/`, merge to `main` → Vercel deploys

### Simplified Workflow Example
```bash
# Single Claude session, no handoffs:
./scripts/task claim feature-x
"Research: Find similar authentication implementations"
"Implement: Add OAuth provider"
"Review: Check security and test coverage"
./scripts/task complete feature-x
gh pr create
```

**Benefits**: 3x faster, no context loss, consistent style, single thread

---

## Architecture Quick Facts

**Authentication**: Supabase Auth → React Context (AuthProvider)

**Data Flow**: Frontend (React Query) → core-api (`/api/v1/*`) → Database (Supabase PostgreSQL)

**AI Integration**: core-api calls ai-engine (HTTP) → graceful fallback if unavailable

**Payments**: Stripe (test keys in `.env`) → core-api webhook handler (MUST be before `express.json()`)

**Testing**:
- Frontend: React Testing Library + Vitest (mock API clients)
- Backend: Jest + supertest (mock Supabase, Stripe)
- AI Engine: pytest (mock embeddings)

---

## Code Standards

- **TypeScript**: Strict mode enabled, no implicit `any`
- **Components**: PascalCase, functional + hooks
- **Hooks/Utils**: camelCase
- **Env Vars**: SCREAMING_SNAKE_CASE
- **Tailwind**: layout → appearance → state order
- **Indentation**: 2 spaces
- **Quotes**: Single
- **Tests**: Colocate near source (`*.test.tsx`, `*.spec.ts`)

**Before committing**: `pnpm lint --fix`

---

## When to Update Documentation

Update these after major changes:
- `README.md`: Setup, structure, user-facing features
- `AGENTS.md`: Workflows, processes, branching
- `CLAUDE.md`: Implementation patterns, tool usage
- `GEMINI.md`: Planning strategies (if changed)

---

## Key Technical Constraints

1. Always use `pnpm` (not npm/yarn)
2. Core-api uses `.js` extensions (ES module compat)
3. Stripe webhook MUST be before `express.json()` middleware
4. Supabase client: singleton via `getSupabaseClient()`
5. `@/` path alias: frontend only
6. AI Engine: ~80MB model download on first run
7. Service ports: frontend 3000, core-api 3001, ai-engine 3002

---

## Specialized Quality Agents

**Auto-triggered on Pull Requests** to ensure code quality and safety:

| Agent | Trigger Condition | Purpose | Location |
|-------|------------------|---------|----------|
| `schema-contract-sentinel` | Changes to `supabase/migrations/`, `shared/types/`, API routes | Detect breaking changes, migration safety | `.claude/agents/schema-contract-sentinel.md` |
| `test-architect` | New features, components, or routes | Ensure test coverage, identify gaps | `.claude/agents/test-architect.md` |
| `flow-orchestrator` | Multi-service changes (2+ services) | Validate integrations, API contracts | `.claude/agents/flow-orchestrator.md` |
| `code-guardian` | Every PR | Code quality, security, performance | `.claude/agents/code-guardian.md` |
| `docs-dx-curator` | Documentation changes (`*.md` files) | Documentation quality, accuracy | `.claude/agents/docs-dx-curator.md` |

### How to Use Specialized Agents

**Automatic (Preferred)**:
1. Create/update a PR
2. Relevant agents run automatically via GitHub Actions
3. Agents post review comments on the PR
4. Address feedback and push updates
5. All checks pass → Ready to merge

**Manual Invocation** (during development):
```
"Please run the schema-contract-sentinel agent to review these migration changes"
"Run test-architect to check test coverage for this new feature"
```

### Agent Workflow Integration

```
Push Code → GitHub Actions → Agent Reviews → PR Comments → Fix Issues → Merge
```

**Note**: These agents complement the main workflow agents (Gemini, Claude, Codex, Carlo).

---

## Documentation Index

**Core Guides**:
- `README.md`: Project overview & setup
- `AGENTS.md` (this file): Workflow & roles
- `CLAUDE.md`: Claude's implementation guide
- `GEMINI.md`: Gemini's planning guide
- `.tasks/TASK_GOVERNANCE.md`: Task management (CRITICAL)
- `CLAUDE_QUICKREF.md`: Quick commands for Claude (no reading)
- `GEMINI_QUICKREF.md`: Quick commands for Gemini (no reading)

**Technical Docs**:
- `docs/DATABASE_SCHEMA.md`: Schema & RLS policies
- `docs/API_ENDPOINTS.md`: Endpoint reference
- `docs/SUBDOMAIN_MIGRATION.md`: Subdomain routing setup
- `services/ai-engine/README.md`: AI Engine architecture

**Keep these synchronized**:
- AGENTS.md ↔ CLAUDE.md ↔ GEMINI.md (when workflows change)
- AGENTS.md ↔ `.tasks/TASK_GOVERNANCE.md` (when task rules change)

---

## Deployment Checklist

- [ ] All checks pass: lint, build, tests
- [ ] PR approved by reviewer
- [ ] Documentation updated
- [ ] `.tasks/reviewed/` contains all feature tasks
- [ ] Merge to `main` (squash recommended)
- [ ] Vercel deploy succeeds
- [ ] Monitor production for 30 min post-deploy
