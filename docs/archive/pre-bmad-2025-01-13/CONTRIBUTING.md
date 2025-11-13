---
type: contribution-guide
role: governance
scope: all
audience: developers, contributors, all-agents
last-updated: 2025-11-10
relevance: contributing, workflow, standards, collaboration
priority: high
quick-read-time: 8min
deep-dive-time: 20min
---

# Contributing to Ori Platform

**Welcome!** We're building an AI-powered career guidance platform that helps users find fulfilling careers. Whether you're an external contributor or working with our AI agents (Claude, Gemini, Codex), this guide will help you contribute effectively.

**⚠️ IMPORTANT: Read [DOC_INDEX.md](./DOC_INDEX.md) first** for current project status and navigation.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Requirements](#testing-requirements)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Task Management](#task-management)
8. [Documentation](#documentation)
9. [Getting Help](#getting-help)

---

## Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm** (required)
- **Git** with repository access
- **Supabase account** (for database)
- **Stripe test account** (for payments, optional)

### Setup

```bash
# Clone repository
git clone https://github.com/carlo-spada/ori-platform.git
cd ori-platform

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev          # Frontend (localhost:3000)
pnpm dev:api      # Core API (localhost:3001)
pnpm dev:all      # Both concurrently
```

**Full setup guide**: See [README.md](./README.md)

---

## Development Workflow

### Branch Strategy

- **`main`**: Production branch (protected)
- **`dev`**: Development branch (default, where all work happens)
- **Feature branches**: Optional for complex features

### Typical Workflow

1. **Start from dev**:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Find or create a task** in `.tasks/todo/`
   - See [.tasks/TASK_GOVERNANCE.md](.tasks/TASK_GOVERNANCE.md)

3. **Claim task**:
   ```bash
   git mv .tasks/todo/feature-name.md .tasks/in-progress/
   git commit -m "chore(tasks): claim feature-name"
   git push
   ```

4. **Implement** (see [Code Standards](#code-standards))
   - Code → Test → Commit → Push
   - Commit after EVERY logical unit

5. **Complete task**:
   ```bash
   git mv .tasks/in-progress/feature-name.md .tasks/done/
   git commit -m "chore(tasks): complete feature-name"
   git push
   ```

6. **Create Pull Request** from `dev` to `main`
   - See [Pull Request Process](#pull-request-process)

### For AI Agents

- **Claude**: Implementation (claim → implement → complete)
- **Gemini**: Planning (create tasks, architecture decisions)
- **Codex**: Review (review code in `.tasks/in-review/`, approve to `done/`)

See [AGENTS.md](./AGENTS.md) for complete agent workflow.

---

## Code Standards

### Language-Specific

| Language | Standard |
|----------|----------|
| **TypeScript** | Strict mode, no implicit `any` |
| **React** | Functional components + hooks |
| **CSS** | TailwindCSS (utility-first) |
| **Node.js** | ES modules (`.js` extensions required in imports) |

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `UserProfile.tsx` |
| **Functions** | camelCase | `getUserProfile()` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| **Files** | kebab-case or PascalCase | `user-profile.ts` or `UserProfile.tsx` |
| **Env vars** | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

### Code Style

- **Indentation**: 2 spaces (never tabs)
- **Strings**: Single quotes `'text'` (except JSX)
- **Semicolons**: Required
- **Line length**: 100 characters (soft limit)
- **Imports**: Organized (React → external → internal → types)

### Formatting

**Before committing**:

```bash
pnpm prettier --write .    # Format all files
pnpm lint --fix            # Fix linting issues
```

**Auto-format in editor**: Use Prettier extension

---

## Testing Requirements

### Test Coverage Expectations

- **New features**: Must include tests
- **Bug fixes**: Add regression test
- **Refactoring**: Existing tests must pass

### Frontend Tests

Location: `src/**/*.test.tsx`

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

**Testing Stack**:
- **Framework**: Vitest
- **Library**: React Testing Library
- **Mocking**: vi.mock()

**Example**:

```typescript
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import UserProfile from './UserProfile'

vi.mock('@/integrations/api/profile', () => ({
  fetchProfile: vi.fn().mockResolvedValue({ id: '1', name: 'Test User' })
}))

describe('UserProfile', () => {
  it('displays user name', async () => {
    render(<UserProfile />)
    expect(await screen.findByText('Test User')).toBeInTheDocument()
  })
})
```

### Backend Tests

Location: `services/core-api/src/**/__tests__/`

```bash
# Run tests
cd services/core-api
pnpm test
```

**Testing Stack**:
- **Framework**: Jest
- **HTTP testing**: Supertest
- **Mocking**: Mock Supabase completely (never hit real database)

**Example**:

```typescript
import request from 'supertest'
import app from '../index'

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn()
}))

describe('GET /api/v1/profile', () => {
  it('returns user profile', async () => {
    const response = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', 'Bearer test-token')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })
})
```

### Pre-Commit Checklist

```bash
# Must pass before creating PR
pnpm lint         # ✅ No errors
pnpm build        # ✅ Builds successfully
pnpm test         # ✅ All tests pass
```

---

## Commit Guidelines

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting, missing semicolons (no code change)
- **refactor**: Code change that neither fixes bug nor adds feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Maintenance (deps, config, tasks)

### Examples

```bash
# Good
git commit -m "feat(profile): add skills section to user profile"
git commit -m "fix(auth): resolve login redirect loop"
git commit -m "docs(api): update endpoint documentation"
git commit -m "chore(tasks): claim onboarding-redesign"

# Bad
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
```

### Task-Related Commits

```bash
# Claiming task
git commit -m "chore(tasks): claim feature-name for implementation"

# Implementation
git commit -m "feat: implement API endpoints for feature-name

- POST /api/feature
- GET /api/feature/:id
- Tests added

See: .tasks/in-progress/feature-name.md"

# Completing task
git commit -m "chore(tasks): complete feature-name - moved to done"
```

### Commit Frequency

- **Minimum**: After each logical unit of work
- **Recommended**: Every 15-30 minutes during active work
- **Required**: After moving tasks between directories

**Never**: Wait until "everything is perfect" to commit

---

## Pull Request Process

### Before Creating PR

1. **Ensure all tests pass**:
   ```bash
   pnpm lint && pnpm build && pnpm test
   ```

2. **Update documentation** if needed:
   - Update API docs if adding endpoints
   - Update README if changing setup
   - Update relevant docs in `docs/`

3. **Complete checklist** (see below)

### Creating PR

1. **From `dev` to `main`** (for production deploy)
2. **Title format**: `feat: Add user profile page` (conventional commits)
3. **Description template**:

```markdown
## Summary
Brief description of what this PR does (1-3 sentences)

## Changes
- Added feature X
- Fixed bug Y
- Updated documentation Z

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Checklist
- [ ] Code follows project standards
- [ ] Self-reviewed the code
- [ ] Commented complex sections
- [ ] Updated documentation
- [ ] No breaking changes (or documented if yes)
- [ ] All tasks moved to .tasks/done/

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Tasks
- .tasks/done/feature-name.md

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### PR Review Process

1. **Automated checks** must pass:
   - Prettier formatting
   - ESLint
   - TypeScript compilation
   - All tests

2. **Code review**: At least 1 approval required

3. **Merge**: Squash and merge to keep history clean

### After Merge

1. **Archive tasks**:
   ```bash
   git mv .tasks/done/feature-name .tasks/archived/
   git commit -m "chore(tasks): archive feature-name - merged in PR #123"
   ```

2. **Deploy**: Automatic via GitHub Actions to Vercel

---

## Task Management

### Task Lifecycle

```
todo/ → in-progress/ → in-review/ → done/ → [merge to main] → archived/
```

### Task File Format

See [.tasks/TASK_GOVERNANCE.md](.tasks/TASK_GOVERNANCE.md) for complete format.

**Minimum**:

```markdown
# Feature Name

**Status**: TODO
**Priority**: HIGH
**Estimated**: 4 hours

## What to Do

Clear, step-by-step instructions.

## Acceptance Criteria

- [ ] Requirement 1
- [ ] Requirement 2

## Related Files

- `src/path/to/file.tsx`
```

### Finding Work

```bash
# See available tasks
ls .tasks/todo/

# High-priority tasks first
grep -r "Priority: HIGH" .tasks/todo/

# See what's in progress
ls .tasks/in-progress/
```

### Task Commands

We provide helper scripts:

```bash
./scripts/task list todo          # List available tasks
./scripts/task claim <task-name>  # Claim task
./scripts/task complete <task>    # Complete task
./scripts/task health             # Check task board health
```

---

## Documentation

### When to Update Docs

- **Adding feature**: Document in relevant `docs/` file
- **Adding API endpoint**: Update `docs/API_ENDPOINTS.md`
- **Changing schema**: Update `docs/CORE/CORE_DATABASE_SCHEMA.md`
- **Adding MCP server**: Update `docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md`

### Documentation Structure

```
docs/
├── CORE/                 # Core architecture docs
│   ├── CORE_DATABASE_SCHEMA.md
│   ├── CORE_ONBOARDING_ARCHITECTURE.md
│   └── architecture/
├── OPERATIONS/           # Operations & deployment
│   ├── OPS_DEPLOYMENT_RUNBOOK.md
│   ├── OPS_MCP_SETUP_GUIDE.md
│   └── OPS_BRANCH_PROTECTION_SETUP.md
└── REFERENCE/            # Quick references
    ├── REFERENCE_ENV_VARS.md
    ├── REFERENCE_DESIGN_SYSTEM.md
    └── REFERENCE_SKILLS_GAP_QUICK_REF.md
```

### Documentation Standards

- **Markdown**: All documentation in Markdown
- **Frontmatter**: Include YAML metadata at top
- **Links**: Use relative links, check they work
- **Examples**: Include code examples where helpful
- **Keep updated**: Documentation is part of the feature

**Example frontmatter**:

```yaml
---
type: api-reference
role: backend-reference
scope: backend
audience: developers
last-updated: 2025-11-10
relevance: api, endpoints, documentation
priority: critical
quick-read-time: 10min
deep-dive-time: 45min
---
```

---

## Getting Help

### Resources

1. **Start here**: [DOC_INDEX.md](./DOC_INDEX.md) - Master documentation index
2. **Implementation**: [CLAUDE.md](./CLAUDE.md) - Implementation patterns and MCP tools
3. **Architecture**: [AGENTS.md](./AGENTS.md) - How agents collaborate
4. **Tasks**: [.tasks/TASK_GOVERNANCE.md](.tasks/TASK_GOVERNANCE.md) - Task workflow

### Common Questions

| Question | Answer |
|----------|--------|
| How do I add an API endpoint? | See `CLAUDE.md` → "Adding API Endpoints" |
| How do I translate text? | See `CLAUDE.md` → "MCP Tools → DeepL" |
| How do auth flows work? | See `CLAUDE.md` → "Authentication" |
| What's the database schema? | See `docs/CORE/CORE_DATABASE_SCHEMA.md` |
| How do I run tests? | `pnpm test` (root) or `cd services/core-api && pnpm test` |
| Where are Stripe webhooks? | `services/core-api/src/routes/payments.ts` |

### Search Documentation

```bash
# Use find-docs command
pnpm find-docs "authentication"
pnpm find-docs "api endpoints" --limit 5
pnpm find-docs "stripe setup"
```

### Communication

- **Questions**: Create issue or ask in project chat
- **Bugs**: Create issue with reproduction steps
- **Features**: Discuss first, then create task
- **Security**: See [SECURITY.md](./SECURITY.md)

---

## Code Review Guidelines

### For Reviewers

**Focus on**:
- ✅ Correctness: Does it work as intended?
- ✅ Testing: Are there adequate tests?
- ✅ Security: Any vulnerabilities (SQL injection, XSS, etc.)?
- ✅ Performance: Any obvious bottlenecks?
- ✅ Readability: Is code clear and well-commented?
- ✅ Standards: Follows project conventions?

**Don't nitpick**:
- ❌ Personal style preferences (use linter)
- ❌ Minor formatting (use Prettier)
- ❌ Naming if it's clear enough

**Be kind**:
- Assume positive intent
- Phrase feedback constructively
- Approve when ready, don't block on minor issues

### For Authors

**Before requesting review**:
- Self-review your code
- Run all tests
- Update documentation
- Check diff for debug code, console.logs

**Responding to feedback**:
- Respond to all comments
- Ask for clarification if unclear
- Fix blocking issues before re-requesting review
- Thank reviewers for their time

---

## Project-Specific Notes

### Technology Constraints

1. **pnpm only**: Don't use npm or yarn
2. **ES modules in core-api**: All imports need `.js` extensions
3. **Stripe webhook before middleware**: Raw body requirement
4. **Supabase singleton**: Use `getSupabaseClient()` (don't create new instances)
5. **No mock data in frontend**: Use React Query hooks only
6. **Service ports**: Frontend 3000, Core API 3001, AI Engine 3002

### Environment Variables

**Never commit**:
- `.env`
- `.env.local`
- `.env.production`
- Secrets or API keys

**Always**:
- Add to `.env.example` (without values)
- Document in `docs/REFERENCE/REFERENCE_ENV_VARS.md`
- Use `NEXT_PUBLIC_` prefix for frontend variables

### Subdomain Architecture

- `getori.app`: Marketing (landing, pricing, blog)
- `app.getori.app`: Authenticated app (dashboard, profile)
- Middleware (`src/proxy.ts`) handles routing

---

## License

This project is proprietary and confidential. All rights reserved.

By contributing, you agree that your contributions will be licensed under the same terms.

---

## Thank You!

Thank you for contributing to Ori Platform! Your work helps users find fulfilling careers.

**Questions?** Check [DOC_INDEX.md](./DOC_INDEX.md) or create an issue.

**Ready to contribute?** See [.tasks/todo/](.tasks/todo/) for available work.

---

**Last Updated**: 2025-11-10
**Maintained By**: Ori Platform Team
