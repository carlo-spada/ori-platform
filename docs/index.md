# Ori Platform - Documentation Index

**Generated:** 2025-11-13
**Scan Level:** Exhaustive
**Documentation Type:** AI-Ready Brownfield Analysis

---

## Project Overview

**Ori Platform** is an AI-powered career companion designed to guide every person toward the work that truly fits them. The platform combines real-time labor-market intelligence with personalized up-skilling and preference modeling to create an intelligent bridge between human potential and opportunity.

### Quick Reference

| Attribute | Value |
|-----------|-------|
| **Repository Type** | Monorepo (pnpm workspace) |
| **Parts** | 4 (Frontend, Core API, AI Engine, DeepL MCP) |
| **Primary Language** | TypeScript, Python |
| **Architecture** | Microservices with subdomain routing |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel (Frontend + Core API), Google Cloud Run (AI Engine) |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     Ori Platform Monorepo                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │   Frontend   │   │   Core API   │   │  AI Engine   │       │
│  │  (Next.js 16)│◄──┤  (Express.js)│◄──┤  (FastAPI)   │       │
│  │              │   │              │   │              │       │
│  │  Port: 3000  │   │  Port: 3001  │   │  Port: 3002  │       │
│  └──────┬───────┘   └──────┬───────┘   └──────────────┘       │
│         │                  │                                    │
│         │                  │                                    │
│  ┌──────▼──────────────────▼─────────────────┐                 │
│  │         Supabase (PostgreSQL)              │                 │
│  │   Auth + Database + Real-time + Storage   │                 │
│  └────────────────────────────────────────────┘                 │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐                           │
│  │    Stripe    │   │  DeepL MCP   │                           │
│  │  (Payments)  │   │(Translation) │                           │
│  └──────────────┘   └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Generated Documentation

### Part-Specific Analysis

1. **[Frontend Analysis](./frontend-analysis.md)** - Next.js 16 Web Application
   - API Integration Architecture
   - State Management (React Query, Context)
   - UI Component Inventory (45+ shadcn/ui components)
   - Routing Structure (App Router with subdomain routing)
   - Branding & Design System
   - i18n Implementation

2. **[Core API Analysis](./core-api-analysis.md)** - Express.js Backend
   - Complete API Endpoint Reference (40+ endpoints)
   - Domain-Driven Route Organization
   - Supabase Integration Patterns
   - Stripe Payment & Webhook Handling
   - AI Engine Integration with Fallback
   - Authentication & Authorization

3. **[AI Engine Analysis](./ai-engine-analysis.md)** - Python/FastAPI ML Service
   - Multi-Factor Job Matching Algorithm
   - Semantic Embeddings (sentence-transformers)
   - Skill Gap Analysis with Importance Detection
   - Learning Path Generation
   - Career Recommendation Engine
   - Service Architecture & Data Models

4. **[DeepL MCP Analysis](./deepl-mcp-analysis.md)** - Translation Microservice
   - MCP Protocol Implementation
   - DeepL API Integration
   - Service Discovery Manifest

### Cross-Cutting Documentation

5. **[Source Tree Analysis](./source-tree-analysis.md)** - Complete Directory Structure
   - Annotated directory tree with purpose descriptions
   - Critical folders by part
   - Integration points between services
   - Deployment architecture diagram
   - Notable patterns and conventions

### Project State

6. **[Project Scan Report](./project-scan-report.json)** - Workflow State Tracking
   - Scan metadata (timestamps, mode, level)
   - Project classification (4 parts, monorepo)
   - Completed steps log
   - Resume instructions

---

## 🎨 Branding & Design

The Ori Platform has a comprehensive brand identity system centered around **Ori the Firefly**, an empathetic AI guide.

### Brand Documentation

- **[Brand Identity](../branding/BRAND_IDENTITY.md)** (89KB) - Comprehensive brand guide
  - Visual identity (colors, typography, logo)
  - Voice & tone guidelines
  - Component & UI patterns
  - Motion & interaction principles

- **[Brand Essentials](../branding/BRAND_ESSENTIALS.md)** - Quick reference
  - Brand promise: "Your career, continuously aligned."
  - Color palette (dark mode primary)
  - Typography system
  - Key messaging dos & don'ts

- **[Ori Manifesto](../branding/ORI_MANIFESTO.md)** - Brand philosophy
  - Core purpose & vision
  - Emotional core & principles
  - Future evolution roadmap

### Design System Highlights

**Colors (Dark Mode):**
- Background: `#0D1B2A` (deep navy)
- Primary: `#3EDBF0` (electric blue)
- Warm Accent: `#F9A72B` (amber)
- Success: `#3EE8A0` (teal-green)

**Voice:**
- Empathetic, Clear, Encouraging, Personal
- Never: Manipulative, Patronizing, Generic

**Mascot:**
- Ori the Firefly: Futuristic, whimsical, pearlescent orb with blue/amber glow
- Minimal digital eyes (kind, calm expression)

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js 20+
Python 3.11+
pnpm
Supabase account

# Optional
Docker (for AI Engine containerization)
```

### Installation

```bash
# Clone repository
git clone https://github.com/carlo-spada/ori-platform.git
cd ori-platform

# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local in root (see root README.md for required vars)
# Create .env in services/core-api/ and services/ai-engine/
```

### Running Development Servers

```bash
# Terminal 1: Frontend (Next.js)
pnpm dev
# → http://localhost:3000

# Terminal 2: Core API (Express)
pnpm dev:api
# → http://localhost:3001

# Terminal 3: AI Engine (Python)
cd services/ai-engine
pip install -r requirements.txt
python main.py
# → http://localhost:3002
```

### Deployment

- **Frontend & Core API:** Vercel (automatic from `main` branch)
- **AI Engine:** Google Cloud Run (containerized via Dockerfile)
- **Database:** Supabase (migrations in `/supabase/migrations`)

---

## 🏗️ Technology Stack Summary

### Frontend (Part 1)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16 (App Router) |
| UI Library | React | 19 |
| Language | TypeScript | 5.x |
| Components | shadcn/ui | Latest |
| CSS | Tailwind CSS | Latest |
| State | TanStack Query | v5 |
| Auth/DB | Supabase Client | 2.80.0+ |
| Payments | Stripe | Latest |
| i18n | i18next | Latest |

### Core API (Part 2)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Express.js | 4.19.2 |
| Language | TypeScript | 5.9.3 |
| Runtime | Node.js | 20+ |
| Database | Supabase JS | 2.80.0 |
| Payments | Stripe | 16.12.0 |
| Validation | Zod | 4.1.12 |
| Testing | Jest + Supertest | 30.x |

### AI Engine (Part 3)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | FastAPI | 0.115.0 |
| Language | Python | 3.11+ |
| ML/Embeddings | sentence-transformers | 3.1.0 |
| Validation | Pydantic | 2.9.0 |
| Numerical | NumPy | 1.26.4 |
| LLM (optional) | OpenAI, Anthropic | Latest |
| Testing | pytest | 8.3.0 |

### DeepL MCP (Part 4)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Express.js | 5.1.0 |
| Language | TypeScript | 5.9.3 |
| Translation | deepl-node | 1.21.0 |

---

## 📖 Key Features by Part

### Frontend Features

- ✅ Subdomain-based routing (`getori.app` marketing, `app.getori.app` application)
- ✅ 6-step onboarding with session persistence & auto-save
- ✅ AI-powered job recommendations with skills gap analysis
- ✅ Real-time conversational AI chat
- ✅ Application tracking & management
- ✅ Stripe payment integration (subscriptions)
- ✅ Multi-language support (5 languages)
- ✅ PWA-ready (manifest, icons, offline support)
- ✅ Dark mode design system
- ✅ Responsive (desktop sidebar, mobile bottom nav)

### Core API Features

- ✅ 40+ REST endpoints (domain-organized)
- ✅ Supabase integration with RLS
- ✅ Stripe webhook handling (subscription lifecycle)
- ✅ AI Engine integration with graceful fallback
- ✅ JWT authentication
- ✅ Comprehensive error handling
- ✅ Notification system
- ✅ Beta tester waitlist management

### AI Engine Features

- ✅ Multi-factor job matching (semantic 40%, skills 30%, experience 15%, location 10%, salary 5%)
- ✅ Semantic embeddings (offline, no API keys required)
- ✅ Skill gap analysis with importance detection
- ✅ Learning path generation with resources
- ✅ Role recommendations
- ✅ Career guidance
- ✅ Stateless, horizontally scalable

### DeepL MCP Features

- ✅ MCP v0.1 protocol compliance
- ✅ Auto language detection
- ✅ 25+ target languages
- ⚠️ Not yet integrated with main platform

---

## 🗂️ File Locations Reference

### Configuration Files

```
/package.json                              # Monorepo root (pnpm workspace)
/pnpm-workspace.yaml                       # Workspace config
/next.config.js                            # Next.js config
/tailwind.config.ts                        # Tailwind config
/tsconfig.json                             # Root TypeScript config
/.env.local                                # Environment variables (not in repo)
```

### Frontend Entry Points

```
/src/app/layout.tsx                        # Root layout with providers
/src/app/page.tsx                          # Landing page
/src/proxy.ts                              # Subdomain routing middleware
/src/i18n.ts                               # i18n configuration
```

### Core API Entry Points

```
/services/core-api/src/index.ts            # Express app
/services/core-api/src/routes/*.ts         # API endpoints
/services/core-api/api/index.ts            # Vercel serverless handler
```

### AI Engine Entry Points

```
/services/ai-engine/main.py                # FastAPI app
/services/ai-engine/services/*.py          # Business logic services
/services/ai-engine/models/schemas.py      # Data models
```

### Database

```
/supabase/migrations/*.sql                 # SQL migration files (14 migrations)
/supabase/config.toml                      # Supabase config
```

### Branding Assets

```
/branding/*.md                             # Brand documentation
/public/ori-logo.svg                       # Logo
/public/icons/*.png                        # PWA icons
```

---

## 🔗 Integration Architecture

### Frontend → Core API

- **Protocol:** HTTP/REST
- **Auth:** Supabase JWT (`Authorization: Bearer {token}`)
- **Endpoints:** `/api/v1/*` (8 API modules)
- **Client Files:** `/src/integrations/api/*.ts`

### Core API → AI Engine

- **Protocol:** HTTP/REST
- **Auth:** Internal trust (no auth)
- **Client:** `/services/core-api/src/clients/aiEngineClient.ts`
- **Endpoints:** `/api/v1/match`, `/api/v1/analyze-skills`, etc.
- **Fallback:** Simple skill matching if AI unavailable

### Core API → Supabase

- **Protocol:** PostgreSQL (Supabase JS SDK)
- **Auth:** Service role key + RLS policies
- **Tables:** user_profiles, experiences, education, applications, conversations, messages, notifications, beta_testers

### Core API → Stripe

- **Protocol:** Stripe SDK + Webhooks
- **Integration:** Payment intents, subscriptions, webhook events
- **Endpoints:** `/api/v1/setup-intent`, `/api/v1/subscriptions`, `/api/v1/webhooks/stripe`

### Frontend → Supabase

- **Protocol:** Supabase JS Client
- **Auth:** Session-based (OAuth + email/password)
- **Client:** `/src/integrations/supabase/client.ts`

---

## 🧪 Testing

### Frontend

```bash
# No test configuration found in scan
# Likely uses Playwright or Jest + React Testing Library (data-testid present)
```

### Core API

```bash
cd services/core-api
pnpm test                    # Jest
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report
```

### AI Engine

```bash
cd services/ai-engine
pytest tests/ -v             # All tests
pytest --cov                 # With coverage
```

---

## 📦 Deployment Commands

### Frontend & Core API (Vercel)

```bash
# Automatic deployment from main branch
# Manual deployment:
vercel --prod
```

### AI Engine (Google Cloud Run)

```bash
cd services/ai-engine

# Build Docker image
docker build -t ori-ai-engine .

# Deploy to Cloud Run
gcloud run deploy ori-ai-engine \
  --source . \
  --region us-central1 \
  --platform managed
```

---

## 🎯 Development Workflow

### Branching Strategy

Per `README.md`:
- `main` - Production branch
- `dev` - Development branch (all PRs target this)
- Feature branches → `dev` → `main`

### Task Management

- **Task-as-File system** in `.tasks/` directory
- Organized by status: `todo/`, `in-progress/`, `done/`
- See `AGENTS.md` for workflow details

### Git Workflow

```bash
# Start feature
git checkout dev
git pull
git checkout -b feature/your-feature

# Develop with frequent commits
git add .
git commit -m "feat: description"

# Push and create PR to dev
git push origin feature/your-feature
# Create PR: feature/your-feature → dev

# After approval, merge to dev
# Then create PR: dev → main for production deployment
```

---

## 📊 Database Schema Overview

**14 migrations** from Nov 4-12, 2025

### Core Tables

- `user_profiles` - User profile data + onboarding state + Stripe fields
- `experiences` - Work experience history
- `education` - Education history
- `applications` - Job application tracking
- `conversations` - Chat conversation threads
- `messages` - Chat messages
- `notifications` - User notifications
- `notification_preferences` - Notification settings per user
- `beta_testers` - Waitlist/early access management

### Security

- **Row Level Security (RLS)** enabled on all tables
- Policies enforce user data isolation
- Service role bypasses RLS for admin operations

---

## 🚨 Known Gaps & Future Enhancements

### DeepL MCP Service

- ⚠️ **Not yet integrated** with Core API or Frontend
- ⚠️ **Port conflict:** Defaults to 3002 (same as AI Engine) - recommend 3003
- ⚠️ **Missing tests**, monitoring, health checks
- ✅ Ready for multi-language feature implementation

### AI Engine

- 🔮 **Future:** Vector database integration (Pinecone/Qdrant)
- 🔮 **Future:** Fine-tuned models on career data
- 🔮 **Future:** LLM integration for richer reasoning (GPT-4/Claude)
- 🔮 **Future:** Real-time learning path updates from market data
- 🔮 **Future:** A/B testing framework

### Frontend

- 🔮 **Planned:** Aura Analysis (components exist but not wired)
- 🔮 **Planned:** Advanced Ori Analysis reasoning display
- 🔮 **Planned:** Mobile native app (PWA foundation ready)

---

## 🤝 Contributing

Before contributing, read:

- **[README.md](../README.md)** - Project overview and setup
- **[AGENTS.md](../AGENTS.md)** (likely exists) - Agent roles and workflow

All development happens on `dev` branch. Pull Requests from `dev` → `main` for production.

---

## 📄 License

Proprietary software. All rights reserved.

---

## 🆘 Support & Resources

- **Issues:** [GitHub Issues](https://github.com/carlo-spada/ori-platform/issues)
- **Website:** [getori.app](https://getori.app)
- **App:** [app.getori.app](https://app.getori.app)

---

**Generated by:** BMAD Document Project Workflow (Exhaustive Scan)
**For:** AI-assisted brownfield development
**Last Updated:** 2025-11-13

This index serves as the primary entry point for AI agents and developers working with the Ori Platform codebase.
