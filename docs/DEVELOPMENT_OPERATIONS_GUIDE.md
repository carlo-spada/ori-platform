# Development & Operations Guide - Ori Platform

**Generated**: 2025-01-13
**Project**: Ori Platform Monorepo
**Purpose**: Complete guide for local development, testing, deployment, and operations

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Running the Application](#running-the-application)
3. [Testing](#testing)
4. [Git Workflow & Branching](#git-workflow--branching)
5. [Task Management](#task-management)
6. [Translation Workflow](#translation-workflow)
7. [Deployment](#deployment)
8. [Monitoring & Debugging](#monitoring--debugging)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Operational Procedures](#operational-procedures)

---

## 1. Local Development Setup

### Prerequisites

**Required**:
- **Node.js**: 20+ (LTS)
- **pnpm**: 8+ (Package manager)
- **Python**: 3.11+ (for AI Engine)
- **Git**: Latest version

**Optional**:
- **Docker**: For containerized services
- **PostgreSQL**: If running Supabase locally (not recommended)

### Initial Setup

#### 1. Clone Repository

```bash
git clone https://github.com/carlo-spada/ori-platform.git
cd ori-platform
```

#### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This installs:
- Frontend dependencies (Next.js, React, etc.)
- Core API dependencies (Express, Stripe, etc.)
- Shared package dependencies
- Development tools (ESLint, Prettier, etc.)

**Time**: 2-5 minutes (depending on internet speed)

#### 3. Environment Variables

Create environment files for each service:

##### **Frontend** (`.env.local` in root):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zvngsecxzcgxafbzjewh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_<key>

# Optional: PWA
NEXT_ENABLE_PWA=false
```

##### **Core API** (`services/core-api/.env`):

```bash
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://zvngsecxzcgxafbzjewh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Stripe
STRIPE_SECRET_KEY=sk_test_<key>
STRIPE_WEBHOOK_SECRET=whsec_<secret>

# Service URLs
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002

# Email (Resend)
RESEND_API_KEY=re_<key>
```

##### **AI Engine** (`services/ai-engine/.env`):

```bash
# Server
PORT=3002
ENVIRONMENT=development

# Model Configuration
EMBEDDING_MODEL=all-MiniLM-L6-v2

# Service URLs
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Optional: LLM APIs
OPENAI_API_KEY=sk-<key>
ANTHROPIC_API_KEY=sk-ant-<key>

# Logging
LOG_LEVEL=INFO
```

**Getting API Keys**:
- **Supabase**: Dashboard → Settings → API
- **Stripe**: Dashboard → Developers → API keys (use test mode)
- **Resend**: Dashboard → API Keys
- **OpenAI/Anthropic**: Optional, not required for core functionality

#### 4. Python Setup (AI Engine)

```bash
cd services/ai-engine

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**First run downloads embedding model (~80MB)**

---

## 2. Running the Application

### Development Mode (3 Terminal Windows)

#### Terminal 1: Frontend (Next.js)

```bash
pnpm dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Uses webpack (not Turbopack) for stability

**Output**:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 3.2s
```

#### Terminal 2: Core API (Express)

```bash
pnpm dev:api
# OR equivalently:
pnpm --filter @ori/core-api dev
```

- Runs on `http://localhost:3001`
- Hot reload with `tsx watch`
- Logs all HTTP requests

**Output**:
```
[INFO] Core API server listening on port 3001
[INFO] Supabase client initialized
[INFO] Stripe client initialized
```

#### Terminal 3: AI Engine (Python)

```bash
cd services/ai-engine
source venv/bin/activate  # If using venv
python main.py
```

- Runs on `http://localhost:3002`
- Loads embedding model on startup (~2-3s)
- Auto-reload with Uvicorn

**Output**:
```
INFO:     Started server process
INFO:     Waiting for application startup.
✓ Embedding service ready (dimension: 384)
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:3002
```

### Verify Services

```bash
# Frontend
curl http://localhost:3000

# Core API health check
curl http://localhost:3001/health

# AI Engine health check
curl http://localhost:3002/health
```

### One-Command Development (Optional)

Using `concurrently` (if configured):

```bash
pnpm dev:all  # If this script exists
```

Or use Docker Compose:

```bash
docker-compose up
```

---

## 3. Testing

### Frontend Tests (Vitest)

#### Run All Tests

```bash
pnpm test
```

#### Watch Mode

```bash
pnpm test:watch
```

#### Coverage Report

```bash
pnpm test:coverage
```

**Coverage Output**: `coverage/index.html`

#### Test Structure

```
src/__tests__/
├── components/        # Component tests
│   ├── dashboard/
│   ├── profile/
│   └── ...
├── hooks/             # React Query hook tests
└── utils/             # Utility function tests
```

**Example Component Test**:

```typescript
// src/components/dashboard/__tests__/QuickStats.test.tsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QuickStats from '../QuickStats'

describe('QuickStats', () => {
  it('renders stats correctly', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <QuickStats />
      </QueryClientProvider>
    )
    expect(screen.getByText(/applications/i)).toBeInTheDocument()
  })
})
```

---

### Core API Tests (Jest)

#### Run All Tests

```bash
pnpm --filter @ori/core-api test
```

#### Watch Mode

```bash
pnpm --filter @ori/core-api test:watch
```

#### Coverage

```bash
pnpm --filter @ori/core-api test:coverage
```

#### Test Structure

```
services/core-api/src/__tests__/
├── setup.ts           # Jest setup (CRITICAL: loads env vars)
├── routes/            # Route handler tests
│   ├── auth.test.ts
│   ├── profile.test.ts
│   └── ...
├── services/          # Service layer tests
└── fixtures/          # Test data & mocks
```

**Critical**: Env vars must load in `setupFiles`, not `setupFilesAfterEnv`

**Example Route Test**:

```typescript
// services/core-api/src/__tests__/routes/profile.test.ts
import request from 'supertest'
import app from '../../index'

describe('Profile Routes', () => {
  it('GET /api/v1/profile requires auth', async () => {
    const response = await request(app).get('/api/v1/profile')
    expect(response.status).toBe(401)
  })

  it('GET /api/v1/profile returns profile', async () => {
    const response = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${mockToken}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user_id')
  })
})
```

---

### AI Engine Tests (pytest)

#### Run All Tests

```bash
cd services/ai-engine
pytest
```

#### Verbose Output

```bash
pytest -v
```

#### Coverage

```bash
pytest --cov=models --cov=services --cov=utils
```

#### Test Structure

```
services/ai-engine/tests/
├── test_matching.py      # Matching algorithm tests
├── test_skill_gap.py     # Skill gap calculation tests
└── fixtures/             # Test data
```

**Example Test**:

```python
# services/ai-engine/tests/test_matching.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_match_jobs():
    response = client.post("/api/v1/match", json={
        "profile": {...},
        "jobs": [{...}],
        "limit": 10
    })
    assert response.status_code == 200
    assert len(response.json()) <= 10
```

---

### Pre-Commit Testing

Before committing, run:

```bash
pnpm lint             # ESLint + TypeScript checks
pnpm format:check     # Prettier formatting
pnpm test             # Frontend tests
pnpm --filter @ori/core-api test  # Backend tests
cd services/ai-engine && pytest   # AI Engine tests
```

**Or use a pre-commit hook** (recommended):

```bash
# .husky/pre-commit
#!/bin/sh
pnpm lint && pnpm test && pnpm --filter @ori/core-api test
```

---

## 4. Git Workflow & Branching

### Branch Structure

```
main                # Production branch (protected)
  └── dev           # Development branch (default)
       └── feature/* # Feature branches
       └── fix/*    # Bug fix branches
```

### Branch Protection

**`main` branch**:
- ❌ Direct pushes blocked
- ✅ Requires pull request
- ✅ Requires 1 approval
- ✅ All checks must pass

**`dev` branch**:
- ✅ Direct pushes allowed
- ✅ All development happens here

### Workflow

#### 1. Start New Feature

```bash
git checkout dev
git pull origin dev
git checkout -b feature/job-matching-ui
```

#### 2. Work on Feature

```bash
# Make changes
git add .
git commit -m "feat: add job matching UI component"
git push origin feature/job-matching-ui
```

#### 3. Create Pull Request

```bash
# Using GitHub CLI
gh pr create --base dev --head feature/job-matching-ui \
  --title "Add job matching UI" \
  --body "Implements job card component with match scores"
```

**Or**: Use GitHub web interface

#### 4. After PR Approval

```bash
# PR is merged to dev by reviewer
git checkout dev
git pull origin dev
git branch -d feature/job-matching-ui  # Delete local branch
```

#### 5. Release to Production

```bash
# Create PR from dev to main
gh pr create --base main --head dev \
  --title "Release: Sprint 15" \
  --body "Production deployment for Sprint 15"
```

**Automated**:
- All tests run
- Lint checks pass
- Build succeeds
- Vercel deployment preview

**After merge to `main`**:
- Automatic deployment to production
- Vercel deployment
- Google Cloud Run deployment (AI Engine)

---

### Commit Message Convention

**Format**: `<type>(<scope>): <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(dashboard): add quick stats widget
fix(auth): resolve JWT validation issue
docs(readme): update installation instructions
refactor(api): simplify profile route handler
test(matching): add edge case tests
chore(deps): upgrade React to 19.2.0
```

---

## 5. Task Management

### Task-Based Workflow

Ori uses a **task-as-file** system in `.tasks/` directory:

```
.tasks/
├── todo/              # Unclaimed tasks
├── in-progress/       # Currently being worked on
├── done/              # Completed tasks
├── blocked/           # Blocked/paused tasks
└── TASK_GOVERNANCE.md # Task workflow rules
```

### Task Lifecycle

#### 1. Find a Task

```bash
ls .tasks/todo/
```

**Example**:
```
add-job-filters-ui.md
implement-chat-persistence.md
stripe-production-migration.md
```

#### 2. Claim a Task

```bash
git mv .tasks/todo/add-job-filters-ui.md .tasks/in-progress/
git commit -m "chore(tasks): claim add-job-filters-ui"
git push
```

#### 3. Work on Task

- Implement the feature
- Write tests
- Update documentation
- Commit and push frequently

#### 4. Complete Task

```bash
git mv .tasks/in-progress/add-job-filters-ui.md .tasks/done/
git commit -m "chore(tasks): complete add-job-filters-ui"
git push
```

### Task File Format

```markdown
# Add Job Filters UI

**Priority**: High
**Estimate**: 3-5 hours
**Dependencies**: None

## Description

Add filtering controls to the job recommendations page:
- Work type (remote, hybrid, onsite)
- Experience level
- Salary range

## Acceptance Criteria

- [ ] Filter controls in sidebar
- [ ] Filters update URL params
- [ ] Filtered results load from API
- [ ] Tests pass

## Technical Notes

- Use shadcn/ui Select component
- Store filters in URL search params
- Debounce API calls (500ms)
```

### Important Rules

1. **Commit after moving tasks** (todo → in-progress → done)
2. **Push immediately after task moves**
3. **Only one person works on a task at a time**
4. **Update task file with notes/blockers if needed**

---

## 6. Translation Workflow

Ori supports 5 languages with 100% translation coverage.

### Languages

- **en**: English (base language)
- **de**: German (Deutsch)
- **es**: Spanish (Español)
- **fr**: French (Français)
- **it**: Italian (Italiano)

### Translation Files

Located in `public/locales/<lang>/`:

```
common.json          # Common UI strings
auth.json            # Authentication pages
dashboard.json       # Dashboard
profile.json         # Profile management
onboarding.json      # Onboarding flow
recommendations.json # Job recommendations
applications.json    # Application tracker
settings.json        # Settings page
legal-terms.json     # Legal pages
```

### Adding New Translations

#### 1. Add English Text

```json
// public/locales/en/dashboard.json
{
  "greeting": "Welcome back, {{name}}!",
  "quickStats": {
    "applications": "Applications",
    "matches": "Matches"
  }
}
```

#### 2. Run Translation Script

```bash
pnpm translate --lang all
# OR translate specific language:
pnpm translate --lang de
```

**Uses**: DeepL API (professional quality)

#### 3. Review Translations

```bash
# Check generated translations
cat public/locales/de/dashboard.json
```

#### 4. Commit Translations

```bash
git add public/locales/
git commit -m "chore(i18n): add dashboard greeting translations"
git push
```

### Using Translations in Code

**React Component**:

```typescript
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation('dashboard')

  return (
    <h1>{t('greeting', { name: user.name })}</h1>
  )
}
```

**Server Component (Next.js)**:

```typescript
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['dashboard'])),
    },
  }
}
```

### Translation API Quota

**DeepL Plan**: 1M characters/month
**Current Usage**: ~174k (17%)
**Monitoring**: Check `DEEPL_API_KEY` usage in DeepL dashboard

---

## 7. Deployment

### Deployment Architecture

```
GitHub (main branch)
  ↓
GitHub Actions CI/CD
  ├─→ Vercel (Frontend + Core API)
  └─→ Google Cloud Run (AI Engine)
```

### Vercel Deployment (Frontend + Core API)

**Automatic**:
- Push to `main` → Production deployment
- Pull request → Preview deployment

**Manual**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

**Environment Variables**: Set in Vercel Dashboard
- Project Settings → Environment Variables
- Add all vars from `.env.local` and `services/core-api/.env`
- Mark production-only vars appropriately

**Vercel Configuration** (`vercel.json`):

```json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/next" },
    { "src": "services/core-api/api/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/v1/(.*)", "dest": "/services/core-api/api/index.js" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

**Custom Domains**:
- `getori.app` → Production
- `app.getori.app` → Production (subdomain)

---

### Google Cloud Run (AI Engine)

**Docker Build**:

```bash
cd services/ai-engine
docker build -t ori-ai-engine .
```

**Push to Container Registry**:

```bash
docker tag ori-ai-engine gcr.io/<project-id>/ori-ai-engine
docker push gcr.io/<project-id>/ori-ai-engine
```

**Deploy to Cloud Run**:

```bash
gcloud run deploy ori-ai-engine \
  --image gcr.io/<project-id>/ori-ai-engine \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3002 \
  --memory 2Gi \
  --cpu 2
```

**Environment Variables**: Set in Cloud Run console
- Add all vars from `services/ai-engine/.env`
- Exclude development-only vars

**Automatic Deployment** (GitHub Actions):

```yaml
# .github/workflows/deploy-ai-engine.yml
on:
  push:
    branches: [main]
    paths: ['services/ai-engine/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and deploy
        # ... deployment steps
```

---

### Database Migrations (Supabase)

**Manual Migration**:

```bash
# 1. Write SQL migration
vim supabase/migrations/20250113_add_new_column.sql

# 2. Apply migration (via Supabase Dashboard)
# OR use Supabase CLI:
npx supabase db push
```

**Automated** (on main merge):

```bash
# GitHub Actions runs:
npx supabase db push --db-url $SUPABASE_DB_URL
```

**Migration Files**:

```
supabase/migrations/
├── 20241101_initial_schema.sql
├── 20241110_add_onboarding_v2.sql
├── 20241115_add_applications_table.sql
└── ...
```

**Best Practices**:
- ✅ Test migrations on staging first
- ✅ Include rollback SQL in comments
- ✅ Never delete/rename tables directly
- ✅ Use ALTER TABLE for schema changes

---

## 8. Monitoring & Debugging

### Production Monitoring

**Vercel Analytics**:
- Web Vitals (LCP, FID, CLS)
- Page views, unique visitors
- API response times

**Access**: Vercel Dashboard → Project → Analytics

**Supabase Dashboard**:
- Database performance
- Query logs (slow queries highlighted)
- Auth events
- API usage

**Access**: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh

**Stripe Dashboard**:
- Payment events
- Subscription status
- Webhook logs

**Access**: https://dashboard.stripe.com/webhooks

---

### Logging

**Frontend**: Browser console
```javascript
console.log('[Profile]', data)
console.error('[API Error]', error)
```

**Core API**: Winston logger
```typescript
import logger from './lib/logger'

logger.info('Profile updated', { userId, changes })
logger.error('Stripe webhook failed', { error, event })
```

**Log Levels**: error, warn, info, debug

**AI Engine**: Python logging
```python
import logging
logger = logging.getLogger(__name__)

logger.info(f"Match requested: {len(jobs)} jobs")
logger.error(f"Embedding failed: {error}")
```

---

### Debugging

#### Frontend (Next.js)

**VSCode Launch Config** (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

**Browser DevTools**:
- React DevTools extension
- Network tab for API calls
- Console for errors

#### Core API (Express)

**Attach Debugger**:

```bash
# Start with inspect flag
node --inspect services/core-api/src/index.ts
```

**VSCode**: Attach to process (F5)

**Postman/Insomnia**: Test API endpoints manually

#### AI Engine (Python)

**PDB Debugger**:

```python
import pdb; pdb.set_trace()
```

**VSCode Python Debugger**:

```json
{
  "name": "Python: FastAPI",
  "type": "python",
  "request": "launch",
  "module": "uvicorn",
  "args": ["main:app", "--reload", "--port", "3002"]
}
```

---

## 9. Common Issues & Solutions

### Issue: `pnpm install` fails

**Symptoms**: Dependency resolution errors

**Solutions**:
```bash
# 1. Clear pnpm cache
pnpm store prune

# 2. Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# 3. Reinstall
pnpm install
```

---

### Issue: Frontend can't reach core-api

**Symptoms**: Network errors, CORS errors

**Check**:
1. Core API is running on port 3001
2. `FRONTEND_URL` in core-api `.env` is correct
3. CORS middleware is configured

**Solution**:
```bash
# Restart core API with correct env vars
pnpm dev:api
```

---

### Issue: Stripe webhook not working locally

**Symptoms**: Webhook events not received

**Solution**: Use Stripe CLI for local testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3001/api/v1/stripe/webhook
```

**Get webhook signing secret from output, add to `.env`**

---

### Issue: AI Engine model download fails

**Symptoms**: Timeout during first run

**Solutions**:
1. **Pre-download manually**:
   ```python
   from sentence_transformers import SentenceTransformer
   model = SentenceTransformer('all-MiniLM-L6-v2')
   ```

2. **Use alternative model**:
   ```bash
   # In .env
   EMBEDDING_MODEL=all-mpnet-base-v2
   ```

3. **Check firewall/proxy settings**

---

### Issue: TypeScript "Cannot find module" errors

**Symptoms**: Path alias not resolving

**Solutions**:
1. **Restart TypeScript server** (VSCode: Cmd+Shift+P → "Restart TS Server")
2. **Check `tsconfig.json` paths**:
   ```json
   {
     "paths": {
       "@/*": ["./src/*"],
       "@ori/types": ["./shared/types/src/index.ts"]
     }
   }
   ```
3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   pnpm dev
   ```

---

### Issue: Tests failing with "Cannot find module"

**Core API Tests**:

**Problem**: env vars not loaded

**Solution**: Ensure `setupFiles` (not `setupFilesAfterEnv`) loads env:

```javascript
// jest.config.js
module.exports = {
  setupFiles: ['./src/__tests__/setup.ts'],  // ← CORRECT
}
```

```typescript
// src/__tests__/setup.ts
import dotenv from 'dotenv'
dotenv.config()
```

---

## 10. Operational Procedures

### Weekly Maintenance

#### Monday: Sprint Planning
1. Review `.tasks/todo/` for new tasks
2. Prioritize tasks for the week
3. Assign tasks to team members
4. Update DOC_INDEX.md with sprint goals

#### Daily: Development
- Commit and push frequently (min 1x per task move)
- Run tests before pushing
- Keep PRs small (<500 lines)

#### Friday: Code Review & Release
1. Review all open PRs
2. Merge approved PRs to `dev`
3. Test `dev` branch thoroughly
4. Create PR from `dev` → `main` for weekly release
5. Monitor production deployment

---

### Monthly Maintenance

#### Documentation Audit
- Run `pnpm find-docs` to verify all docs findable
- Update DOC_INDEX.md with new docs
- Archive outdated docs to `docs/archive/`

#### Dependency Updates
```bash
pnpm update --latest --interactive
```

**Review breaking changes before updating**

#### Database Cleanup
```bash
# Run SQL script to clean test data
psql $SUPABASE_DB_URL < scripts/clear-test-users.sql
```

#### Translation Sync
```bash
# Ensure all languages have latest keys
pnpm translate --lang all --mode update
```

---

### Incident Response

#### Production Error Detected

1. **Check Logs**:
   - Vercel: Dashboard → Functions → Logs
   - Supabase: Dashboard → Logs
   - Stripe: Dashboard → Developers → Events

2. **Identify Issue**:
   - User-facing error?
   - API failure?
   - Database issue?
   - Third-party service down?

3. **Hot Fix** (if critical):
   ```bash
   git checkout main
   git checkout -b hotfix/critical-bug
   # Fix bug
   git commit -m "fix(critical): resolve payment processing error"
   git push
   gh pr create --base main --title "HOTFIX: Critical bug"
   ```

4. **Monitor Fix**:
   - Deploy to production
   - Verify error resolved
   - Monitor for 1 hour

5. **Post-Mortem**:
   - Document incident in `docs/DECISIONS/`
   - Update tests to prevent regression
   - Share learnings with team

---

### Backup & Recovery

#### Database Backups

**Automated**: Supabase automatic daily backups (7-day retention)

**Manual Backup**:

```bash
pg_dump $SUPABASE_DB_URL > backup_$(date +%Y%m%d).sql
```

**Restore**:

```bash
psql $SUPABASE_DB_URL < backup_20250113.sql
```

#### Code Backups

**Primary**: Git repository (GitHub)

**Secondary**: Local backups recommended

```bash
# Clone with full history
git clone --mirror https://github.com/carlo-spada/ori-platform.git
```

---

## Conclusion

This guide covers the complete development and operational workflow for Ori Platform. Key takeaways:

✅ **Local Setup**: 15-minute setup with clear env var guide
✅ **Testing**: Comprehensive test suite across all services
✅ **Git Workflow**: Protected branches, clear commit conventions
✅ **Task Management**: Task-as-file system for transparency
✅ **Translation**: Automated DeepL translation for 5 languages
✅ **Deployment**: Automated CI/CD to Vercel and Cloud Run
✅ **Monitoring**: Multiple dashboards for production health
✅ **Debugging**: Tools and techniques for each service
✅ **Incident Response**: Clear procedures for handling issues

**For quick reference**: Bookmark this doc and `CLAUDE.md` for day-to-day development.

**Need help?**: Check DOC_INDEX.md for topic-specific documentation.

