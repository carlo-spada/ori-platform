# Source Tree Analysis - Ori Platform

**Generated**: 2025-01-13
**Project**: Ori Platform Monorepo
**Scan Type**: Exhaustive Structure Analysis

---

## Directory Structure Overview

```
ori-platform/                    # Repository root
├── src/                         # Frontend source (Next.js 16)
├── services/                    # Backend microservices
│   ├── core-api/               # Express.js backend
│   └── ai-engine/              # Python FastAPI AI service
├── shared/                      # Shared packages (types, utils)
├── public/                      # Static assets, translations, PWA
├── docs/                        # Technical documentation
├── bmad/                        # BMAD AI development framework
├── branding/                    # Brand identity guidelines
├── scripts/                     # Build, dev, translation scripts
├── .tasks/                      # Task-based workflow tracker
└── [config files]              # Root-level configuration
```

---

## Part 1: Frontend (`/src/`) - Next.js Application

### Directory Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (marketing)/           # Marketing site routes (getori.app)
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/           # Pricing page
│   │   ├── features/          # Features showcase
│   │   ├── about/             # About page
│   │   ├── blog/              # Blog (planned)
│   │   ├── contact/           # Contact page
│   │   └── legal/             # Terms, Privacy Policy
│   ├── (app)/                 # Authenticated app routes (app.getori.app)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── profile/           # User profile management
│   │   ├── recommendations/   # Job recommendations
│   │   ├── applications/      # Application tracker
│   │   └── settings/          # User settings
│   ├── auth/                  # Authentication routes
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── callback/         # OAuth callback
│   ├── onboarding/            # Multi-step onboarding flow
│   ├── select-plan/           # Subscription plan selection
│   ├── layout.tsx             # Root layout with providers
│   ├── middleware.ts          # Subdomain routing logic
│   └── not-found.tsx          # 404 page
│
├── components/                 # React components
│   ├── ui/                    # shadcn/ui primitives (50+ components)
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card component
│   │   ├── dialog.tsx        # Modal dialog
│   │   ├── form.tsx          # Form primitives
│   │   ├── input.tsx         # Input field
│   │   ├── toast.tsx         # Toast notifications
│   │   └── ...               # 40+ more UI primitives
│   ├── layout/                # Layout components
│   │   ├── header.tsx        # Site header
│   │   ├── footer.tsx        # Site footer
│   │   ├── sidebar-nav.tsx   # App sidebar navigation
│   │   └── bottom-nav.tsx    # Mobile bottom nav
│   ├── auth/                  # Authentication components
│   │   ├── onboarding-guard.tsx  # Protected route wrapper
│   │   ├── social-auth-buttons.tsx  # Google/Apple OAuth
│   │   └── auth-forms.tsx    # Login/signup forms
│   ├── dashboard/             # Dashboard feature components
│   │   ├── header.tsx        # Dashboard header
│   │   ├── quick-stats.tsx   # Stats cards
│   │   ├── chat.tsx          # AI chat interface
│   │   ├── activity-feed.tsx # Recent activity
│   │   └── next-steps.tsx    # Recommended actions
│   ├── profile/               # Profile management
│   │   ├── profile-form.tsx  # Basic info form
│   │   ├── experience-form.tsx  # Work experience
│   │   ├── education-form.tsx   # Education history
│   │   ├── skills-manager.tsx   # Skills editor
│   │   └── cv-upload.tsx     # CV upload component
│   ├── recommendations/       # Job recommendations UI
│   │   ├── job-card.tsx      # Individual job card
│   │   ├── match-score.tsx   # Match score display
│   │   ├── skills-gap.tsx    # Skills gap indicator
│   │   └── filters.tsx       # Job filters
│   ├── applications/          # Application tracking
│   │   ├── applications-table.tsx  # Responsive table
│   │   ├── status-badge.tsx  # Application status
│   │   └── application-details.tsx  # Detail view
│   ├── onboarding/            # Onboarding flow components
│   │   ├── steps/            # Individual step components
│   │   ├── progress-bar.tsx  # Step progress indicator
│   │   └── navigation.tsx    # Step navigation
│   ├── payments/              # Stripe payment components
│   │   ├── stripe-wrapper.tsx  # Stripe Elements wrapper
│   │   ├── payment-form.tsx  # Payment method form
│   │   └── subscription-card.tsx  # Current subscription display
│   ├── landing/               # Landing page sections
│   │   ├── hero-section.tsx  # Hero with CTA
│   │   ├── features-section.tsx  # Feature highlights
│   │   ├── how-it-works.tsx  # Process explanation
│   │   ├── testimonials.tsx  # Social proof
│   │   ├── faq-section.tsx   # FAQ accordion
│   │   └── cta-section.tsx   # Bottom CTA
│   ├── pricing/               # Pricing page components
│   │   ├── pricing-cards.tsx  # Plan comparison
│   │   └── features-table.tsx  # Feature matrix
│   └── settings/              # Settings page components
│       ├── account-settings.tsx  # Account management
│       ├── billing-settings.tsx  # Billing & subscription
│       ├── notification-settings.tsx  # Notification preferences
│       └── danger-zone.tsx   # Account deletion
│
├── hooks/                      # Custom React hooks (React Query)
│   ├── use-profile.ts         # useQuery for user profile
│   ├── use-recommendations.ts  # useQuery for job matches
│   ├── use-applications.ts    # useQuery for applications
│   ├── use-chat.ts            # useQuery for chat history
│   ├── use-onboarding.ts      # useQuery for onboarding state
│   ├── use-subscription.ts    # useQuery for subscription
│   └── use-notifications.ts   # useQuery for notifications
│
├── contexts/                   # React Context providers
│   ├── auth-provider.tsx      # Authentication context
│   ├── onboarding-provider.tsx  # Onboarding state
│   └── theme-provider.tsx     # Dark/light mode
│
├── integrations/               # External service integrations
│   ├── api/                   # Backend API clients
│   │   ├── profile.ts        # Profile API calls
│   │   ├── auth.ts           # Auth API calls
│   │   ├── recommendations.ts  # Recommendations API
│   │   ├── applications.ts   # Applications API
│   │   ├── chat.ts           # Chat API
│   │   ├── onboarding.ts     # Onboarding API
│   │   └── payments.ts       # Stripe/payments API
│   └── supabase/              # Supabase client
│       ├── client.ts         # Singleton Supabase client
│       └── auth.ts           # Auth helpers
│
├── lib/                        # Utility functions
│   ├── utils.ts               # Tailwind cn(), general utils
│   ├── types/                 # Type definitions
│   │   ├── api.ts            # API request/response types
│   │   ├── database.ts       # Supabase table types
│   │   └── components.ts     # Component prop types
│   ├── validations/           # Zod validation schemas
│   │   ├── profile.ts        # Profile form schemas
│   │   ├── auth.ts           # Auth form schemas
│   │   └── onboarding.ts     # Onboarding schemas
│   └── constants.ts           # App constants
│
├── styles/                     # Global styles
│   └── globals.css            # Tailwind directives, CSS variables
│
└── __tests__/                  # Test files
    ├── components/            # Component tests
    ├── hooks/                 # Hook tests
    └── utils/                 # Utility tests
```

### Key Patterns

**Routing**: File-system based with App Router
- `/app/page.tsx` → `getori.app/`
- `/app/app/dashboard/page.tsx` → `app.getori.app/dashboard`

**Data Fetching**: React Query hooks wrap API clients
- Components call hooks (`useProfile()`)
- Hooks use API clients (`fetchProfile()`)
- API clients make authenticated HTTP calls to core-api

**State Management**:
- **Server State**: React Query (caching, refetching)
- **Global Client State**: React Context (auth, theme)
- **Local State**: useState, useReducer

**Styling**: Tailwind CSS + shadcn/ui
- Utility-first approach
- Theme variables in `globals.css`
- Dark mode via `next-themes`

---

## Part 2: Core API (`/services/core-api/`) - Express Backend

### Directory Structure

```
services/core-api/
├── src/
│   ├── routes/                # API route handlers
│   │   ├── auth.ts           # POST /api/v1/auth/* (login, signup, logout)
│   │   ├── users.ts          # GET /api/v1/users/me
│   │   ├── profile.ts        # GET/PUT /api/v1/profile
│   │   ├── onboarding.ts     # POST /api/v1/onboarding/* (6 endpoints)
│   │   ├── recommendations.ts  # GET /api/v1/recommendations
│   │   ├── applications.ts   # CRUD /api/v1/applications
│   │   ├── chat.ts           # GET/POST /api/v1/chat/*
│   │   ├── experience.ts     # CRUD /api/v1/experience
│   │   ├── education.ts      # CRUD /api/v1/education
│   │   ├── dashboard.ts      # GET /api/v1/dashboard/stats
│   │   ├── stripe-webhooks.ts  # POST /api/v1/stripe/webhook
│   │   ├── subscriptions.ts  # GET /api/v1/subscriptions/*
│   │   ├── notifications.ts  # GET/PUT /api/v1/notifications
│   │   └── beta-testers.ts   # POST /api/v1/beta/signup
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts           # JWT validation
│   │   ├── error-handler.ts  # Global error handling
│   │   └── validation.ts     # Zod schema validation
│   │
│   ├── services/              # Business logic layer
│   │   ├── stripe.ts         # Stripe service (plans, helpers)
│   │   ├── ai-engine.ts      # AI Engine HTTP client
│   │   ├── email.ts          # Resend email service
│   │   └── analytics.ts      # Analytics tracking
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── supabase.ts       # Supabase client factory
│   │   ├── stripe-client.ts  # Stripe client singleton
│   │   ├── resend.ts         # Resend client
│   │   └── logger.ts         # Winston logger
│   │
│   ├── types/                 # TypeScript types
│   │   ├── api.ts            # API types
│   │   ├── database.ts       # Database types
│   │   └── stripe.ts         # Stripe types
│   │
│   ├── templates/             # Email templates
│   │   ├── welcome.html      # Welcome email
│   │   ├── application-update.html  # Application status change
│   │   ├── match-found.html  # New job match notification
│   │   ├── weekly-digest.html  # Weekly summary
│   │   ├── subscription-created.html
│   │   ├── subscription-cancelled.html
│   │   └── payment-failed.html
│   │
│   ├── scripts/               # Utility scripts
│   │   └── setupStripe.ts    # Initialize Stripe products/prices
│   │
│   ├── __tests__/             # Test files
│   │   ├── setup.ts          # Jest setup (env vars)
│   │   ├── routes/           # Route tests
│   │   │   ├── auth.test.ts
│   │   │   ├── profile.test.ts
│   │   │   └── ...
│   │   ├── services/         # Service tests
│   │   └── fixtures/         # Test data/mocks
│   │
│   └── index.ts               # Express app entry point
│
├── api/                        # Vercel serverless adapter
│   └── index.js               # Vercel function wrapper
│
├── public/                     # Public assets (if any)
│
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript config (NodeNext modules)
├── package.json                # Dependencies, scripts
└── vercel.json                 # Vercel deployment config
```

### Key Patterns

**Architecture**: Layered API
```
Request → Middleware → Route Handler → Service Layer → Database/External API
```

**Authentication**: JWT validation middleware
- Extracts token from `Authorization: Bearer <token>`
- Validates with Supabase
- Attaches `userId` to `req.user`

**Database Access**: Per-request Supabase clients
```typescript
const supabase = getSupabaseClient(req.user.accessToken)
const { data } = await supabase.from('profiles').select('*')
```

**Error Handling**: Centralized error middleware
- Catches all thrown errors
- Returns consistent JSON responses
- Logs errors with Winston

**Testing**: Jest + Supertest
- Mock Supabase, Stripe, AI Engine
- Test route handlers end-to-end
- Load env vars in `setupFiles`

---

## Part 3: AI Engine (`/services/ai-engine/`) - Python FastAPI

### Directory Structure

```
services/ai-engine/
├── models/                     # Data models & ML
│   ├── embeddings.py          # EmbeddingService (Sentence Transformers)
│   └── schemas.py             # Pydantic models (UserProfile, Job, etc.)
│
├── services/                   # Business logic
│   ├── matching.py            # MatchingService (job matching algorithm)
│   ├── skill_analysis.py      # SkillAnalyzer (gap analysis, learning paths)
│   └── recommendations.py     # RecommendationEngine (role suggestions)
│
├── utils/                      # Utilities
│   └── logging.py             # Logging setup (JSON/text formats)
│
├── tests/                      # pytest test suite
│   ├── test_matching.py       # Matching algorithm tests
│   ├── test_skill_gap.py      # Skill gap calculation tests
│   └── fixtures/              # Test fixtures
│
├── docs/                       # Additional documentation
│
├── main.py                     # FastAPI app entry point
├── config.py                   # Configuration management
├── requirements.txt            # Python dependencies
├── pytest.ini                  # pytest configuration
├── Dockerfile                  # Docker container definition
└── README.md                   # Service documentation
```

### Key Patterns

**Architecture**: Service-oriented FastAPI
```
Request → FastAPI Endpoint → Service Layer → ML Model/Algorithm → Response
```

**ML Model**: Singleton pattern
- `EmbeddingService` loads model once at startup
- Shared across all requests
- Thread-safe for concurrent requests

**Async-First**: All endpoints are async
```python
@app.post("/api/v1/match")
async def match_jobs(request: MatchRequest):
    # Async processing
```

**Stateless Design**: No database, no sessions
- Pure computation service
- Can scale horizontally

**Testing**: pytest with `TestClient`
- Tests use real embedding model (fast enough)
- Future: Mock for CI/CD speed

---

## Part 4: Shared Packages (`/shared/`)

### Directory Structure

```
shared/
├── types/                      # Shared TypeScript types
│   ├── src/
│   │   ├── index.ts           # Exported types
│   │   ├── api.ts             # API types
│   │   ├── user.ts            # User types
│   │   ├── job.ts             # Job types
│   │   └── common.ts          # Common types
│   ├── package.json
│   └── tsconfig.json
│
└── utils/                      # Shared utilities (future)
    ├── src/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

### Usage

Frontend import:
```typescript
import { UserProfile } from '@ori/types'
```

Core API import:
```typescript
import { UserProfile } from '@ori/types'
```

---

## Part 5: Public Assets (`/public/`)

### Directory Structure

```
public/
├── locales/                    # i18n translation files
│   ├── en/                    # English
│   │   ├── common.json        # Common translations
│   │   ├── auth.json          # Auth pages
│   │   ├── dashboard.json     # Dashboard
│   │   ├── profile.json       # Profile
│   │   ├── onboarding.json    # Onboarding flow
│   │   └── legal-terms.json   # Legal pages
│   ├── de/                    # German (Deutsch)
│   ├── es/                    # Spanish (Español)
│   ├── fr/                    # French (Français)
│   └── it/                    # Italian (Italiano)
│
├── fonts/                      # Custom fonts
│   ├── Inter-roman.var.woff2  # Inter font (roman)
│   └── Inter-italic.var.woff2 # Inter font (italic)
│
├── icons/                      # PWA icons
│   ├── icon-192x192.png       # App icon (small)
│   └── icon-512x512.png       # App icon (large)
│
├── screenshots/                # PWA screenshots
│   ├── desktop-wide.png       # Desktop screenshot
│   └── mobile.png             # Mobile screenshot
│
├── manifest.webmanifest        # PWA manifest
├── robots.txt                  # SEO robots file
├── favicon.ico                 # Browser favicon
├── ori-logo.svg                # Ori logo
└── [other SVG icons]          # UI icons
```

### Key Assets

**Translations**: 100% coverage across 5 languages
**PWA**: Manifest, icons, screenshots for app-like experience
**Fonts**: Inter variable font (self-hosted for performance)

---

## Part 6: Documentation (`/docs/`)

### Directory Structure

```
docs/
├── CORE/                       # Core technical docs
│   ├── CORE_DATABASE_SCHEMA.md  # Complete database schema
│   ├── CORE_ONBOARDING_ARCHITECTURE.md  # Onboarding system
│   └── architecture/          # Architecture diagrams
│       └── CORE_ARCHITECTURE_OVERVIEW.md
│
├── OPERATIONS/                 # Operational guides
│   ├── OPS_DEPLOYMENT_RUNBOOK.md  # Deployment procedures
│   ├── OPS_MCP_SETUP_GUIDE.md  # MCP server setup
│   ├── OPS_TRANSLATION_WORKFLOW.md  # Translation process
│   ├── OPS_AUTO_PR_REVIEW.md  # PR review automation
│   └── ...                    # 5 more ops guides
│
├── REFERENCE/                  # Quick references
│   ├── REFERENCE_DESIGN_SYSTEM.md  # UI component library
│   ├── REFERENCE_ENV_VARS.md  # Environment variables
│   ├── REFERENCE_ONBOARDING_FIELDS.md  # Onboarding data fields
│   └── ...                    # 7 more references
│
├── CURRENT_PHASE/              # Current sprint status
│   ├── STATUS_NEXT_STEPS.md   # Next priorities
│   ├── STATUS_CODEBASE_AUDIT_2024-11-10.md  # Latest audit
│   └── ...                    # 5 status docs
│
├── DECISIONS/                  # Architecture decision records
│   └── DECISION_MCP_ARCHITECTURE_AUDIT.md
│
├── archive/                    # Archived/legacy docs
│   ├── 2024-phase1/           # Phase 1 docs
│   ├── deprecated-mcp-docs/   # Old MCP docs
│   └── ...
│
├── sprint-artifacts/           # Sprint planning artifacts
│
├── API_ENDPOINTS.md            # Complete API documentation
├── API_SUMMARY.md              # API quick reference
├── MCP_REFERENCE.md            # MCP protocol reference
├── OAUTH_SETUP_GUIDE.md        # OAuth integration guide
├── NOTION_MCP_SETUP.md         # Notion integration
├── NOTION_SYNC_GUIDE.md        # Notion sync workflow
├── QUICK_START_NOTION_SYNC.md  # Quick Notion setup
├── DOC_POLICY.md               # Documentation standards
├── GOVERNANCE_DOCUMENTATION.md  # Doc governance
├── project-scan-report.json    # This document project scan state
└── technology-stack-analysis.md  # Technology analysis (just generated)
```

### Documentation Organization

**By Category**:
- **CORE**: Technical specifications, database, architecture
- **OPERATIONS**: Runbooks, procedures, workflows
- **REFERENCE**: Quick guides, cheat sheets
- **CURRENT_PHASE**: Sprint status, next steps
- **DECISIONS**: Architecture decision records (ADRs)
- **archive**: Historical/deprecated docs

**Documentation Standards**: See `DOC_POLICY.md`
- Frontmatter with metadata
- Concise, actionable content
- Code examples with file paths
- Regular updates

---

## Part 7: BMAD Framework (`/bmad/`)

### Directory Structure

```
bmad/                           # BMAD AI development framework
├── core/                       # Core workflows & tasks
│   ├── agents/                # Core agents
│   ├── workflows/             # Core workflows
│   ├── tasks/                 # Reusable tasks
│   └── tools/                 # Utility tools
│
├── bmm/                        # BMad Method (project management)
│   ├── agents/                # Project agents
│   ├── workflows/             # Development workflows
│   ├── config.yaml            # BMM configuration
│   └── docs/                  # BMM documentation
│
├── bmb/                        # BMad Builder (agent/workflow creator)
│   ├── agents/                # Builder agents
│   └── workflows/             # Creation workflows
│
├── cis/                        # Creative Innovation System
│   ├── agents/                # Innovation agents
│   └── workflows/             # Innovation workflows
│
├── _cfg/                       # Global configuration
│   ├── manifest.yaml          # BMAD manifest
│   ├── agent-manifest.csv     # Agent registry
│   ├── workflow-manifest.csv  # Workflow registry
│   └── ...                    # Other manifests
│
└── docs/                       # BMAD documentation
    ├── claude-code-instructions.md
    ├── gemini-instructions.md
    └── codex-instructions.md
```

### Purpose

**BMAD**: AI-assisted development framework
- Agents for specific roles (planning, implementation, testing)
- Workflows for common tasks (PRD, architecture, sprint planning)
- Task management system

**Usage**: See workflow-init and document-project (currently running!)

---

## Part 8: Branding (`/branding/`)

### Files

- `BRAND_IDENTITY.md`: 200-page comprehensive brand guide
  - Voice & tone guidelines
  - Mascot design (Ori the Firefly)
  - Color palettes (dark/light mode)
  - Typography system
  - Logo usage
  - Copy samples

- `BRAND_ESSENTIALS.md`: Quick reference version

### Key Brand Elements

**Mascot**: Ori the Firefly (futuristic, luminous, empathetic guide)
**Primary Color**: Spectral blue (#3EDBF0)
**Voice**: Calm, empathetic, wise (like Demerzel from Foundation)
**Aesthetic**: Dark mode primary, cosmic/serene theme

---

## Part 9: Scripts (`/scripts/`)

### Categories

**Translation Scripts**:
- `translate.ts`: Main translation script (DeepL API)
- `find-docs.ts`: Documentation search tool
- `sync-translations.ts`: Sync translations across locales

**Documentation Scripts**:
- `update-doc-index.ts`: Update DOC_INDEX.md
- `add-frontmatter.ts`: Add YAML frontmatter to docs
- `sync-docs-to-notion.js`: Sync docs to Notion workspace

**Setup Scripts**:
- `setup-mcp-servers.sh`: Configure MCP servers
- `setup-notion-database.js`: Initialize Notion database

**Database Scripts**:
- `clear-test-users.sql`: Clean test data
- `run-onboarding-migration.sh`: Run onboarding schema migration

**Deployment Scripts**:
- `vercel-ignore-build.sh`: Vercel build skip logic
- `check-documentation.sh`: Pre-commit doc validation

---

## Part 10: Configuration Files (Root)

### Key Files

**Package Management**:
- `package.json`: Root dependencies, workspace scripts
- `pnpm-workspace.yaml`: Workspace definition
- `pnpm-lock.yaml`: Dependency lock file

**Build Configuration**:
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript config (frontend)
- `turbo.json`: Turborepo build orchestration

**Code Quality**:
- `eslint.config.mjs`: ESLint rules
- `prettier.config.js`: Prettier formatting
- `.prettierignore`: Prettier exclusions

**Styling**:
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS plugins

**Testing**:
- `vitest.config.ts`: Vitest configuration (frontend tests)

**Deployment**:
- `vercel.json`: Vercel deployment settings
- `docker-compose.yml`: Local development services

**Agent Configuration**:
- `CLAUDE.md`: Implementation guide for Claude
- `GEMINI.md`: Planning guide for Gemini
- `AGENTS.md`: Agent collaboration workflow
- `.claude/`: Claude Code settings
- `.gemini/`: Gemini settings

---

## File Count Summary

| Category | Approx File Count |
|----------|-------------------|
| **Frontend** (`src/`) | 200+ files |
| **Core API** (`services/core-api/`) | 50+ files |
| **AI Engine** (`services/ai-engine/`) | 15+ files |
| **Shared Packages** (`shared/`) | 10+ files |
| **Public Assets** (`public/`) | 100+ files (mostly translations) |
| **Documentation** (`docs/`) | 60+ markdown files |
| **BMAD Framework** (`bmad/`) | 100+ files |
| **Scripts** (`scripts/`) | 20+ files |
| **Configuration** (root) | 15+ config files |
| **Total** | **570+ files** (excluding node_modules, build artifacts) |

---

## Critical Path Map

For developers working on specific features:

### Adding a New API Endpoint

1. **Core API**: Define route in `services/core-api/src/routes/`
2. **Core API**: Add types to `services/core-api/src/types/`
3. **Shared Types**: Export types from `shared/types/src/`
4. **Frontend API Client**: Create client in `src/integrations/api/`
5. **Frontend Hook**: Create React Query hook in `src/hooks/`
6. **Frontend Component**: Use hook in component
7. **Tests**: Add tests in both frontend and backend

### Adding a New Page

1. **Frontend**: Create page in `src/app/`
2. **Frontend**: Create components in `src/components/`
3. **Frontend**: Create hooks if needed
4. **Translations**: Add i18n keys to `public/locales/*/`
5. **Navigation**: Update sidebar/header components

### Adding AI Feature

1. **AI Engine**: Create service in `services/ai-engine/services/`
2. **AI Engine**: Add endpoint to `main.py`
3. **Core API**: Create proxy route in `services/core-api/src/routes/`
4. **Frontend**: Follow "Adding a New API Endpoint" process

---

## Integration Flow Map

```
User Browser
    ↓
Next.js Frontend (Port 3000)
    ↓ HTTP /api/v1/*
Express Core API (Port 3001)
    ↓ HTTP /api/v1/* (AI features only)
FastAPI AI Engine (Port 3002)
```

```
Express Core API
    ↓ Supabase Client
Supabase PostgreSQL (Cloud)
```

```
Next.js Frontend
    ↓ Supabase Client (Auth Only)
Supabase Auth (Cloud)
```

```
Express Core API
    ↓ Stripe SDK
Stripe API (Cloud)
```

```
Express Core API
    ↓ Resend SDK
Resend Email API (Cloud)
```

---

## Conclusion

The Ori Platform monorepo is a **well-organized, scalable architecture** with clear separation of concerns:

✅ **Frontend**: Modern Next.js 16 with App Router, React Query, shadcn/ui
✅ **Backend**: Layered Express API with clear route/service separation
✅ **AI**: Isolated Python FastAPI service with local ML models
✅ **Shared**: Type-safe monorepo with shared packages
✅ **Documentation**: Comprehensive, well-organized technical docs
✅ **Tooling**: Automated scripts for translation, deployment, testing

The structure supports:
- **Team Scalability**: Clear ownership boundaries (frontend, core-api, ai-engine)
- **Feature Development**: Well-defined paths for adding features
- **Maintenance**: Easy navigation with consistent patterns
- **Testing**: Isolated testing per service
- **Deployment**: Independent deployment of each service

**Total Lines of Code**: ~50,000+ (excluding dependencies)
**Languages**: TypeScript (frontend + core-api), Python (ai-engine)
**Package Manager**: pnpm (monorepo workspaces)
**Deployment**: Vercel (frontend + core-api), Cloud Run (ai-engine)

