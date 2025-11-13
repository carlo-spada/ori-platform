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

**Last Updated**: 2025-01-13
**Status**: Production-ready with active development
**Purpose**: Master index for rapid agent onboarding and context discovery

**⭐ NEW**: Brownfield documentation now available - comprehensive AI-ready codebase analysis (75k+ words)

---

## 🎯 CURRENT FOCUS (Read This First!)

**Current Sprint**: Brownfield documentation complete, single source of truth established
**Active Status**: ✅ Exhaustive codebase analysis complete (570+ files, 75k+ words)
**Next Priority**: Leverage brownfield docs for AI-assisted development

### 🎉 Recent Wins (Last 7)
- ✅ Complete exhaustive brownfield documentation (75,000+ words)
- ✅ Generate comprehensive architecture documentation (15k words)
- ✅ Document all 41 API endpoints with examples
- ✅ Analyze 100+ React components and data flows
- ✅ Create AI-ready development operations guide
- ✅ Consolidate into single source of truth (brownfield docs)
- ✅ Archive pre-brownfield documentation


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

### Brownfield Documentation (Primary Source of Truth)

**⭐ NEW**: Comprehensive AI-ready documentation generated from exhaustive codebase analysis.

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[docs/BROWNFIELD_DOCUMENTATION_INDEX.md](./docs/BROWNFIELD_DOCUMENTATION_INDEX.md)** | Master navigation for all brownfield docs | Start here for complete system understanding |
| **[docs/BROWNFIELD_ARCHITECTURE.md](./docs/BROWNFIELD_ARCHITECTURE.md)** | Complete system architecture (15k words) | Planning features, understanding data flows |
| **[FRONTEND_CODEBASE_ANALYSIS.md](./FRONTEND_CODEBASE_ANALYSIS.md)** | Exhaustive frontend documentation (12k words) | Frontend development, component reference |
| **[CORE_API_ANALYSIS.md](./CORE_API_ANALYSIS.md)** | Exhaustive backend documentation (10k words) | Backend development, API reference |
| **[docs/DEVELOPMENT_OPERATIONS_GUIDE.md](./docs/DEVELOPMENT_OPERATIONS_GUIDE.md)** | Complete operational procedures (10k words) | Setup, testing, deployment |

**Quick Stats**: 75,000+ words, 570+ files analyzed, 41 API endpoints documented, 100+ components documented

### For Implementation Work

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[CLAUDE.md](./CLAUDE.md)** | Claude's implementation guide, MCP tools, patterns | Every task - your primary reference |
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
- `FRONTEND_CODEBASE_ANALYSIS.md` - Complete component patterns and architecture

**i18n System**
- `CLAUDE.md#MCP Tools → Context7` - How to use translation MCP
- `public/locales/en/translation.json` - Source language (English)
- `scripts/translate.ts` - DeepL translation script
- **Command**: `DEEPL_API_KEY=xxx pnpm exec tsx scripts/translate.ts --sync`

**For Complete Frontend Reference**
- See `FRONTEND_CODEBASE_ANALYSIS.md` for:
  - Component architecture (100+ components)
  - Data fetching patterns (React Query hooks)
  - API client integration
  - Authentication flows
  - Routing structure

---

## ⚙️ BACKEND DEVELOPMENT

### Quick Reference
- **Entry Point**: `services/core-api/src/index.ts`
- **Routes**: `services/core-api/src/routes/` (feature-based)
- **Tests**: `services/core-api/src/routes/__tests__/`
- **Important**: All imports must have `.js` extensions (ES modules)

### Critical Docs

**For Complete Backend Reference**
- See `CORE_API_ANALYSIS.md` for:
  - Complete API documentation (41 endpoints with examples)
  - Database schema and RLS policies
  - Business logic and services
  - Middleware stack (auth, validation, errors)
  - Integration patterns (Supabase, Stripe, AI Engine)
  - Testing infrastructure

**Quick Reference**
- `CLAUDE.md#Architecture Patterns` - Adding API endpoints, auth, validation
- `supabase/migrations/` - All database migrations (timestamped)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh

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
- **`CLAUDE.md#MCP Tools Available`** - Complete MCP tool reference with examples and setup instructions
- **`.claude/mcp.json`** - Docker MCP gateway configuration (team-shared)
- **`~/Library/Application Support/Claude/claude_desktop_config.json`** - Personal MCP config (tokens, paths)

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

### Operations Reference

**For Complete Operational Guide**
- See `docs/DEVELOPMENT_OPERATIONS_GUIDE.md` for:
  - Local development setup (step-by-step)
  - Running the application (3 services)
  - Testing (Vitest, Jest, pytest)
  - Git workflow & branching strategy
  - Deployment procedures (Vercel, Cloud Run)
  - Monitoring & debugging
  - Common issues & solutions

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
| What's the database schema? | `docs/BROWNFIELD_ARCHITECTURE.md` | Database Schema section |
| How do auth flows work? | `docs/BROWNFIELD_ARCHITECTURE.md` | Authentication & Authorization |
| What are the code standards? | `CLAUDE.md` | "Code Standards" table |
| What API endpoints exist? | `CORE_API_ANALYSIS.md` | Complete API reference |
| Where are Stripe webhooks? | `CLAUDE.md` | "Critical Technical Constraints" |
| How do I run the dev server? | `docs/DEVELOPMENT_OPERATIONS_GUIDE.md` | Local Development Setup |

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
2. **Brownfield docs**: Start with `docs/BROWNFIELD_DOCUMENTATION_INDEX.md` for complete system understanding
3. **Quick search**: `pnpm find-docs "<keyword>"` for instant results
4. **Implementation questions**: CLAUDE.md
5. **API details**: CORE_API_ANALYSIS.md
6. **Architecture questions**: docs/BROWNFIELD_ARCHITECTURE.md
7. **When stuck**: `.tasks/TASK_GOVERNANCE.md`

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
- See `CLAUDE.md#MCP Tools Available` for complete setup and usage

**What's the difference?**
- `.claude/mcp.json` = Team-shared Docker MCP config (Stripe, Resend, etc.)
- `claude_desktop_config.json` = Your personal config (tokens, file paths, GitHub, Postgres, Notion)

### BMAD Workflows

The `.claude/commands/bmad/` directory contains the BMAD (Better Method for Agentic Development) framework:

**Modules**:
- **BMM (BMAD Method)** - Complete software development lifecycle workflows
- **BMB (BMAD Builder)** - Tools for creating agents, workflows, and modules
- **CIS (Creative Intelligence Suite)** - Innovation, design thinking, problem-solving workflows
- **Core** - Foundation tools and utilities

**Key Workflows**:
- `/bmad:bmm:workflows:document-project` - Generate brownfield documentation
- `/bmad:bmm:workflows:prd` - Create Product Requirements Document
- `/bmad:bmm:workflows:architecture` - Design system architecture
- `/bmad:bmm:workflows:dev-story` - Implement user stories

See `.claude/commands/bmad/` for complete workflow catalog.

### For Complete System Reference

All specialized topics (onboarding, skills gap, environment variables, OAuth) are comprehensively documented in the brownfield documentation:
- **Architecture**: `docs/BROWNFIELD_ARCHITECTURE.md`
- **Frontend Details**: `FRONTEND_CODEBASE_ANALYSIS.md`
- **Backend Details**: `CORE_API_ANALYSIS.md`
- **Operations**: `docs/DEVELOPMENT_OPERATIONS_GUIDE.md`

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
