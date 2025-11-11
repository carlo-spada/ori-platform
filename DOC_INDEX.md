---
type: navigation-index
role: master-index
scope: all
audience: all-agents, developers, stakeholders
last-updated: 2025-11-10
relevance: navigation, index, onboarding, status, overview
priority: critical
quick-read-time: 8min
deep-dive-time: 20min
---

# 🗺️ Ori Platform - Agent Navigation Map

**Last Updated**: 2025-11-10
**Status**: Production-ready with active development
**Purpose**: Master index for rapid agent onboarding and context discovery

---

## 🎯 CURRENT FOCUS (Read This First!)

**Current Sprint**: Documentation consolidation and production deployment
**Active Status**: ✅ Documentation cleanup complete, MCP setup guides consolidated
**Next Priority**: Production deployment, monitoring, and Stripe production verification

### 🎉 Recent Wins (Last 7)
- ✅ Consolidate MCP setup guides into single authoritative guide
- ✅ Archive legacy Phase 1 documentation with clear supersession notices
- ✅ Eliminate 85 duplicate files across the repository
- ✅ Create comprehensive API endpoints documentation (41 endpoints)
- ✅ Create operations runbook for deployment procedures
- ✅ Add automated Notion sync system via MCP
- ✅ Implement Phase 3 documentation search tool


### ⚠️ Known Issues
- 1 high-severity dependency vulnerability (Dependabot #5)
- DeepL API quota at 17% (174k/1M characters used)

### 📍 Quick Stats
- **Translation Coverage**: 100% of user-facing pages
- **Languages**: English, German, Spanish, French, Italian
- **Architecture**: Next.js 14 (frontend) + Express (core-api) + Supabase (database)
- **Deployment**: Vercel (frontend + serverless API), pending production

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Map
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Core API       │────▶│   Supabase      │
│   (Next.js 14)  │     │   (Express.js)   │     │   (PostgreSQL)  │
│   Port: 3000    │     │   Port: 3001     │     │   Cloud-hosted  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│   Stripe        │     │   AI Engine      │
│   (Payments)    │     │   (Python/FastAPI)│
│   Production    │     │   Port: 3002     │
└─────────────────┘     └──────────────────┘
```

### Key Technologies
- **Frontend**: Next.js 14, React Query, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Zod validation, Supabase client
- **Database**: Supabase PostgreSQL with Row Level Security
- **i18n**: react-i18next, DeepL API for translations
- **Payments**: Stripe (test mode active, production pending)
- **Deployment**: Vercel (all services), GitHub Actions (CI/CD)

---

## 📚 ESSENTIAL READING (Start Here)

### For Implementation Work

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[CLAUDE.md](./CLAUDE.md)** | Claude's implementation guide, MCP tools, patterns | Every task - your primary reference |
| **[GEMINI.md](./GEMINI.md)** | Gemini's planning and architecture role | Before planning features |
| **[AGENTS.md](./AGENTS.md)** | How Claude & Gemini collaborate | When unsure about workflow |
| **[.tasks/TASK_GOVERNANCE.md](./.tasks/TASK_GOVERNANCE.md)** | Task workflow rules (claim→implement→complete) | Before starting any task |

### For Context & Understanding

| Document | Purpose | One-Sentence Summary |
|----------|---------|---------------------|
| **[README.md](./README.md)** | Project overview and setup | Quick start guide for new developers |
| **[ORI_MANIFESTO.md](./ORI_MANIFESTO.md)** | Product vision and philosophy | Why Ori exists and what we're building |
| **[SECURITY.md](./SECURITY.md)** | Security policies and reporting | How to report vulnerabilities |

---

## 🎨 FRONTEND DEVELOPMENT

### Quick Reference
- **Entry Point**: `src/app/` (Next.js App Router)
- **Components**: `src/components/` (organized by feature)
- **Styles**: TailwindCSS with custom design system
- **State**: React Query for server state, Context for UI state

### Critical Docs

**Design & Branding**
- `branding/BRAND_IDENTITY.md` - Logo usage, colors, typography, voice
- `branding/BRAND_ESSENTIALS.md` - Quick brand reference
- `docs/REFERENCE/REFERENCE_DESIGN_SYSTEM.md` - Component patterns and Tailwind usage

**i18n System**
- `CLAUDE.md#MCP Tools → Context7` - How to use translation MCP
- `public/locales/en/translation.json` - Source language (English)
- `scripts/translate.ts` - DeepL translation script
- **Command**: `DEEPL_API_KEY=xxx pnpm exec tsx scripts/translate.ts --sync`

**Component Architecture**
- `src/components/layout/` - SharedHeader, SharedFooter, PublicLayout
- `src/components/landing/` - Homepage sections (all i18n-enabled)
- `src/components/auth/` - Authentication components
- `src/components/ui/` - shadcn/ui components (button, card, dialog, etc.)

**Data Fetching**
- `src/integrations/api/` - API client functions (typed)
- `src/hooks/` - React Query hooks (useProfile, useApplications, etc.)
- **Pattern**: API client → React Query hook → Component (NO mock data)

---

## ⚙️ BACKEND DEVELOPMENT

### Quick Reference
- **Entry Point**: `services/core-api/src/index.ts`
- **Routes**: `services/core-api/src/routes/` (feature-based)
- **Tests**: `services/core-api/src/routes/__tests__/`
- **Important**: All imports must have `.js` extensions (ES modules)

### Critical Docs

**API Reference**
- `docs/API_ENDPOINTS.md` - Complete API documentation
- `docs/API_SUMMARY.md` - Quick API overview

**Database**
- `docs/CORE/CORE_DATABASE_SCHEMA.md` - PostgreSQL schema and RLS policies
- `supabase/migrations/` - All database migrations (timestamped)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh

**Patterns & Architecture**
- `CLAUDE.md#Architecture Patterns` - Adding API endpoints, auth, validation
- `services/core-api/src/middleware/` - Auth, validation, error handling

**Testing**
- Setup: `services/core-api/src/__tests__/setup.ts` (loads env vars FIRST)
- Pattern: Mock Supabase completely, never hit real database
- Run: `pnpm test` (runs all tests)

---

## 💳 STRIPE INTEGRATION

### Status
- **Test Mode**: ✅ Fully configured and working
- **Production Mode**: 🚧 In progress (task: `.tasks/in-progress/02-verify-stripe-production.md`)

### Docs & Tools
- **MCP Server**: Use `mcp__MCP_DOCKER__*` tools for Stripe operations
- **Webhook Setup**: Core API `/api/v1/stripe/webhook` endpoint
- **Test Cards**: Use Stripe test mode cards for development

### Critical Files
- `services/core-api/src/routes/payments.ts` - Payment endpoints
- `services/core-api/src/routes/subscriptions.ts` - Subscription management
- `services/core-api/src/lib/stripe.ts` - Stripe client initialization

---

## 🤖 MCP (MODEL CONTEXT PROTOCOL)

### What is MCP?
MCP servers provide tools that agents can use without bash commands. They're already configured and ready to use.

### Available MCP Servers

| Server | Status | Primary Use | Documentation |
|--------|--------|-------------|---------------|
| **Filesystem** | ✅ Active | File operations (Read/Write/Edit/Glob/Grep) | `CLAUDE.md#📂 Filesystem` |
| **Stripe** | ✅ Active | All Stripe operations (customers, payments, subscriptions) | `CLAUDE.md#💳 Stripe` |
| **Context7** | ✅ Active | Library documentation (resolve ID → get docs) | `CLAUDE.md#📚 Context7` |
| **Web Fetch** | ✅ Active | Fetch web content, API calls | `CLAUDE.md#🌐 Web Fetch` |
| **Email (Resend)** | ✅ Active | Send emails (onboarding, notifications) | `CLAUDE.md#📧 Email` |
| **Postgres** | ⚠️ Needs config | Read-only SQL queries | `CLAUDE.md#🗄️ Database` |
| **GitHub** | ⚠️ Needs token | PR management, issues | `CLAUDE.md#🐙 GitHub` |
| **Notion** | ⚠️ Needs token | Documentation sync, workspace search | `CLAUDE.md#📝 Notion` |
| **Playwright** | ✅ Active | Browser automation, screenshots | `CLAUDE.md#🎭 Playwright` |

### Setup & Reference
- **[Complete Setup Guide](docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md)** - Comprehensive guide for all MCP servers (authoritative)
- **[MCP-QUICK-SETUP.md](MCP-QUICK-SETUP.md)** - 5-minute quick start for essential MCPs
- **[MCP Protocol Reference](docs/MCP_REFERENCE.md)** - Deep dive into MCP architecture and usage
- `CLAUDE.md#MCP Tools Available` - Quick MCP tool reference with examples

---

## 🚀 DEPLOYMENT & OPERATIONS

### Deployment Pipeline
```
Git Push → GitHub Actions → Vercel Deploy
         ↓
   Formatting Check
   Linter
   Build Test
   (on main: deploy to production)
```

### Critical Workflows
- `.github/workflows/deploy-production.yml` - Main production deploy
- `.github/workflows/pull-request-ci.yml` - PR checks
- `.github/workflows/translate.yml` - Auto-translate on doc changes

### Operations Docs
- **[OPS_DEPLOYMENT_RUNBOOK.md](docs/OPERATIONS/OPS_DEPLOYMENT_RUNBOOK.md)** - Step-by-step deployment procedures
- **[OPS_MCP_SETUP_GUIDE.md](docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md)** - Complete MCP server setup (all servers)
- **[OPS_BRANCH_PROTECTION_SETUP.md](docs/OPERATIONS/OPS_BRANCH_PROTECTION_SETUP.md)** - Branch rules and protection
- **[OPS_AUTO_PR_REVIEW.md](docs/OPERATIONS/OPS_AUTO_PR_REVIEW.md)** - Automated PR review system
- **[OPS_GIT_NOTION_DOCUMENTATION_STRATEGY.md](docs/OPERATIONS/OPS_GIT_NOTION_DOCUMENTATION_STRATEGY.md)** - Documentation sync strategy

### Pre-Deploy Checklist
```bash
pnpm lint       # Must pass
pnpm build      # Must pass
pnpm test       # Must pass (or skip with --skip-tests)
```

---

## 📝 TASK MANAGEMENT

### Workflow (CRITICAL - Always Follow This)

1. **Find Task**: Check `.tasks/todo/` for prioritized work
2. **Claim Task**: `git mv .tasks/todo/[task].md .tasks/in-progress/` then commit/push
3. **Implement**: Code → commit → push (commit after EVERY logical unit)
4. **Complete**: `git mv .tasks/in-progress/[task].md .tasks/done/` then commit/push

### Task Directories
- `.tasks/todo/` - Prioritized backlog (pick from here)
- `.tasks/in-progress/` - Active work (limit 3 tasks max)
- `.tasks/done/` - Completed tasks (archive)
- `.tasks/in-review/` - Needs review before completion

### Governance
- **Rules**: `.tasks/TASK_GOVERNANCE.md` - Complete task workflow rules
- **Minimum Commits**: 1 per task move (claim/complete), more for code is better
- **Never**: Push directly to `main` (branch protection blocks it)

---

## 🔍 FINDING INFORMATION

### Common Questions & Where to Look

| Question | Document | Section |
|----------|----------|---------|
| How do I add a new API endpoint? | `CLAUDE.md` | "Adding API Endpoints" |
| How do I translate new text? | `CLAUDE.md` | "MCP Tools → Context7" |
| What's the database schema? | `docs/CORE/CORE_DATABASE_SCHEMA.md` | Full schema |
| How do auth flows work? | `CLAUDE.md` | "Authentication" |
| What are the code standards? | `CLAUDE.md` | "Code Standards" table |
| How do agents collaborate? | `AGENTS.md` | Full workflow |
| Where are Stripe webhooks? | `CLAUDE.md` | "Critical Technical Constraints" |
| How do I run the dev server? | `README.md` | "Getting Started" |

### Documentation Search Tool

**New in Phase 3**: Use the `find-docs` command to search across all documentation:

```bash
# Search by keyword
pnpm find-docs "authentication"
pnpm find-docs "mcp setup"
pnpm find-docs "stripe payment" --limit 5
pnpm find-docs "database schema"

# View help
pnpm find-docs --help
```

**How it works**:
- Searches titles, YAML frontmatter, headings, file paths, and content
- Ranks results by relevance (title matches score highest)
- Shows document metadata (type, role, reading time)
- Displays contextual snippets
- Prioritizes CRITICAL and HIGH priority docs

**Search Coverage**: 300+ markdown files across the entire codebase

### Search Strategy
1. **Start here**: DOC_INDEX.md (you are here!)
2. **Quick search**: `pnpm find-docs "<keyword>"` for instant results
3. **Implementation questions**: CLAUDE.md
4. **Planning questions**: GEMINI.md or AGENTS.md
4. **Specific feature**: Search `docs/` by topic
5. **API details**: `docs/API_ENDPOINTS.md`
6. **When stuck**: `.tasks/TASK_GOVERNANCE.md` or `AGENTS.md`

---

## 🧩 SPECIALIZED TOPICS

### .claude Directory (Claude Code Configuration)

The `.claude/` directory contains Claude Code-specific configuration and documentation.

**Purpose**: Configuration files for Claude Desktop and MCP servers that are committed to git for team sharing.

**Contents**:
- **`mcp.json`** - MCP server configurations (Docker-based: Stripe, Resend, Web Fetch, Context7)
- **`commands/`** - Custom slash commands for Claude Code (future)
- **`prompts/`** - Reusable prompts for common tasks (future)

**Key Files**:
- `.claude/mcp.json` - Docker MCP gateway configuration (✅ committed to git)
- `~/Library/Application Support/Claude/claude_desktop_config.json` - User-specific MCP config (❌ NOT in git)

**Setup Instructions**:
- **Quick**: [MCP-QUICK-SETUP.md](MCP-QUICK-SETUP.md) - 5 minutes
- **Complete**: [docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md](docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md) - 15-30 minutes

**What's the difference?**
- `.claude/mcp.json` = Team-shared Docker MCP config (Stripe, Resend, etc.)
- `claude_desktop_config.json` = Your personal config (tokens, file paths, GitHub, Postgres, Notion)

### Onboarding System
- `docs/CORE/CORE_ONBOARDING_ARCHITECTURE.md` - Full onboarding flow architecture
- `src/app/onboarding/` - Onboarding pages (v1 and v2)
- `src/components/onboarding/v2/` - Latest onboarding components
- `supabase/migrations/20251112000000_onboarding_v2_enhancement.sql` - Latest schema

### Skills Gap Analysis
- `docs/REFERENCE/REFERENCE_SKILLS_GAP_QUICK_REF.md` - Quick reference
- Implementation: Part of recommendations system

### Environment Variables
- `docs/REFERENCE/REFERENCE_ENV_VARS.md` - Complete env var reference
- `.env.example` - Example configuration
- **Never commit**: `.env`, `.env.local` (in .gitignore)

### OAuth & Social Auth
- `docs/OAUTH_SETUP_GUIDE.md` - Setting up social providers
- Status: Not yet implemented (future work)

---

## 📦 PROJECT STRUCTURE QUICK MAP

```
ori-platform/
├── src/                          # Frontend (Next.js 14)
│   ├── app/                      # Pages (App Router)
│   │   ├── page.tsx              # Landing page (/) ✅ i18n
│   │   ├── login/                # Auth pages ✅ i18n
│   │   ├── signup/               # Auth pages ✅ i18n
│   │   ├── select-plan/          # Plan selection ✅ i18n
│   │   ├── app/                  # Authenticated app pages
│   │   └── legal/                # Legal pages (Privacy, Terms, Cookies)
│   ├── components/               # React components
│   │   ├── layout/               # Header, Footer, layouts
│   │   ├── landing/              # Homepage sections
│   │   ├── auth/                 # Auth components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   └── [feature]/            # Feature-specific components
│   ├── integrations/
│   │   ├── api/                  # API client functions
│   │   └── supabase/             # Supabase client
│   ├── hooks/                    # React Query hooks
│   └── contexts/                 # React Context providers
│
├── services/
│   ├── core-api/                 # Express.js backend (Port 3001)
│   │   ├── src/
│   │   │   ├── index.ts          # Entry point
│   │   │   ├── routes/           # API endpoints
│   │   │   ├── middleware/       # Auth, validation, errors
│   │   │   └── lib/              # Utilities (stripe, supabase)
│   │   └── __tests__/            # Jest tests
│   └── ai-engine/                # Python FastAPI (Port 3002)
│
├── supabase/
│   └── migrations/               # Database migrations (timestamped)
│
├── public/
│   └── locales/                  # i18n translations (en, de, es, fr, it)
│
├── docs/                         # Documentation
│   ├── CORE/                     # Core architecture docs
│   ├── OPERATIONS/               # Operations & deployment
│   └── REFERENCE/                # Quick references
│
├── .tasks/                       # Task management
│   ├── todo/                     # Prioritized backlog
│   ├── in-progress/              # Active work
│   └── done/                     # Completed
│
├── CLAUDE.md                     # Claude implementation guide
├── GEMINI.md                     # Gemini planning guide
├── AGENTS.md                     # Agent collaboration workflow
└── DOC_INDEX.md                  # This file!
```

---

## 🆘 TROUBLESHOOTING

### Build/Deploy Issues
- **Formatting errors**: Run `pnpm prettier --write .`
- **Lint errors**: Run `pnpm lint --fix`
- **Build fails**: Check console for specific errors, ensure all imports have `.js` extensions in core-api
- **Deployment blocked**: Check GitHub Actions logs, ensure tests pass

### Development Issues
- **Page not translating**: Check if `useTranslation()` is imported, verify key exists in `public/locales/en/translation.json`
- **API not working**: Check if core-api is running on port 3001, verify env vars
- **Supabase errors**: Check RLS policies, verify user is authenticated

### Getting Unstuck
1. Read the relevant section in this DOC_INDEX
2. Check CLAUDE.md for implementation patterns
3. Search `docs/` for specific topics
4. Review similar existing code
5. Check `.tasks/` for related completed work

---

## 📞 QUICK COMMANDS

```bash
# Development
pnpm dev                  # Start frontend (3000)
pnpm dev:api              # Start core-api (3001)
pnpm dev:all              # Start both concurrently

# Code Quality
pnpm lint                 # Check for lint errors
pnpm lint --fix           # Fix lint errors
pnpm prettier --write .   # Format all files
pnpm build                # Build for production
pnpm test                 # Run all tests

# i18n
DEEPL_API_KEY=xxx pnpm exec tsx scripts/translate.ts --sync

# Task Management
git mv .tasks/todo/[task].md .tasks/in-progress/  # Claim task
git mv .tasks/in-progress/[task].md .tasks/done/  # Complete task

# Git
git status                # Check status
git add -A                # Stage all changes
git commit -m "..."       # Commit with message
git push                  # Push to remote
```

---

## 🔄 KEEPING THIS DOC UPDATED

**When to Update This Doc:**
- After completing major features
- When changing architecture or adding new services
- After major dependency updates
- When adding new critical documentation
- Monthly review (first Monday of each month)

**Update Process:**
1. Update "Last Updated" date at top
2. Update "Current Focus" section
3. Add new docs to appropriate sections
4. Update "Recent Wins" (keep last 5)
5. Commit: `docs: update DOC_INDEX with [what changed]`

---

**🎯 Remember**: This document is your navigation system. When lost, start here. When helping others, point them here first.
