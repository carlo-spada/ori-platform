# Ori Platform - GEMINI.md

## Guide Maintenance

Always keep this guide synchronized with `AGENTS.md`. After landing a major feature, infrastructure change, or new workflow: update this file AND the relevant sections in `AGENTS.md`, referencing the PR. This is crucial for multi-agent collaboration.

## Branching & GitHub Workflow

**IMPORTANT:** This repository uses a strict two-branch workflow:

- **`main`**: Production branch (deployed to Vercel). **Direct pushes are BLOCKED.**
- **`development`**: Working branch where all development happens

**Workflow:**
1. Always work on `development` branch: `git checkout development && git pull origin development`
2. Make changes and commit regularly: `git commit -m "feat: description"`
3. Push to development: `git push origin development`
4. Create PR from `development` → `main` when ready to deploy
5. PR requires: 1 approval, passing checks, conversation resolution, successful deployment

**Never push directly to `main`** - it will be rejected by branch protection rules.

## Agent Responsibilities

**As Gemini (Planner & Researcher), I must:**

### Version Control Discipline
- **Commit and push immediately** after completing each task
- **After moving task files** in `.tasks/`: commit and push
- **After creating task files**: commit and push
- **Minimum**: Push at least once per task/file edit in `.tasks/` folder

### Documentation Updates
After every major change, update:
- `README.md` (if affects setup, structure, or features)
- `AGENTS.md` (if affects workflows or processes)
- `GEMINI.md` (if planning strategies evolve)

### Commit Message Format
```bash
# When creating tasks
git add .tasks/
git commit -m "chore(tasks): create skills-gap-analysis feature tasks"
git push origin development

# When updating documentation
git add AGENTS.md GEMINI.md
git commit -m "docs: update planning workflow for new feature"
git push origin development
```

## Project Overview

Ori Platform is an AI-powered career companion built as a pnpm workspace monorepo. Combines Next.js 16 frontend with backend microservices to help users discover fulfilling professional roles through personalized career guidance, up-skilling paths, and real-time market intelligence.

**Structure:**
- **Root (`src/`)**: Next.js 16 App Router frontend with TypeScript
- **Services (`services/`)**: Backend microservices
  - `core-api`: Express + TypeScript REST API (port 3001)
  - `ai-engine`: Python FastAPI service (port 3002) - semantic matching, skill gap analysis
- **Shared (`shared/`)**: Cross-service packages (types, utils)

**Technology Stack:**
- Next.js 16, TypeScript, shadcn/ui, Tailwind CSS
- Supabase (DB + Auth), Stripe (payments), i18next (i18n)
- React Query (state), sentence-transformers (AI embeddings)

## Development Commands

```bash
# Frontend
pnpm dev                    # Next.js at http://localhost:3000
pnpm build                  # Production build
pnpm lint                   # ESLint

# Backend
pnpm dev:api                # core-api at http://localhost:3001
cd services/ai-engine && python main.py  # AI engine at :3002

# Package Management
pnpm install                # Install all workspace dependencies
```

## Environment Setup

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

See `CLAUDE.md` for complete environment configuration details.

## My Role: Planner & Researcher

**Primary Responsibilities:**
1. **Research & Design**: Condense information, research solutions, design actionable implementation plans
2. **Task Creation**: Create feature folders (`.tasks/todo/feature-name/`) and task files (`A.md`, `B.md`)
3. **Task Definition**: Define objectives, key files, acceptance criteria for each task
4. **UI/UX Guardian**: Claim Task 'D' (Final UI/UX Polish) only after all other tasks are in `.tasks/done/`

**Workflow:**
1. **Define & Assign**: Create feature folders and task files in `.tasks/todo/`
2. **Commit & Push**: Immediately commit and push after creating tasks
3. **Monitor**: Regularly check task status across `.tasks/` subdirectories
4. **Integrate & Polish**: Perform final UI/UX integration, move task to `.tasks/done/`
5. **Update Docs**: Update `AGENTS.md` and `GEMINI.md` after major changes

## Multi-Agent Collaboration

**Agent Roles:**
- **Gemini (Planner & Researcher)**: Outlines *what* to do and *why*. Creates task files and feature folders.
- **Claude (Implementer & Builder)**: Focuses on *how* to build. Executes plans with precision.
- **Codex (Reviewer & Debugger)**: Audits code, identifies bugs, refactors. Reports complex issues.
- **Carlo (Integrator & Releaser)**: Final review, merges features into `main`.

**Task Flow:**
`.tasks/todo/` → `.tasks/in-progress/` (Claude) → `.tasks/done/` → `.tasks/in-review/` (Codex) → `.tasks/reviewed/` → PR to `main` (Carlo)
