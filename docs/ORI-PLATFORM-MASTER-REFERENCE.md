# Ori Platform - Master Reference Document

**Generated:** 2025-11-13
**Version:** 1.0
**Status:** Comprehensive Synthesis of Research + Technical Architecture
**Prepared for:** Carlo

---

## Document Purpose

This is the **single source of truth** for the Ori Platform. It synthesizes:
- Market research (competitive landscape, pricing, positioning)
- Technical architecture (4 services: Frontend, Core API, AI Engine, DeepL MCP)
- Strategic recommendations (go-to-market, monetization, tech decisions)
- Implementation roadmap (LLM costs, scaling, optimization)

**Use this document to:**
- Onboard new team members or AI agents
- Make strategic product decisions
- Understand full-stack architecture
- Reference competitive positioning
- Validate technical implementation

---

# Table of Contents

## Part I: Strategic Overview
1. [Executive Summary](#executive-summary)
2. [Market Opportunity](#market-opportunity)
3. [Competitive Landscape](#competitive-landscape)
4. [Positioning Strategy](#positioning-strategy)
5. [Business Model & Unit Economics](#business-model--unit-economics)

## Part II: Technical Architecture
6. [System Architecture Overview](#system-architecture-overview)
7. [Frontend (Next.js 16)](#frontend-nextjs-16)
8. [Core API (Express)](#core-api-express)
9. [AI Engine (FastAPI)](#ai-engine-fastapi)
10. [DeepL MCP (Translation)](#deepl-mcp-translation)

## Part III: Implementation Details
11. [Database Schema (Supabase)](#database-schema-supabase)
12. [AI/LLM Integration Strategy](#aillm-integration-strategy)
13. [Payment Processing (Stripe)](#payment-processing-stripe)
14. [Deployment & Infrastructure](#deployment--infrastructure)

## Part IV: Roadmap & Recommendations
15. [Immediate Priorities](#immediate-priorities)
16. [Technical Roadmap](#technical-roadmap)
17. [Go-to-Market Strategy](#go-to-market-strategy)
18. [Appendices](#appendices)

---

# Part I: Strategic Overview

<a name="executive-summary"></a>
## 1. Executive Summary

### The Problem

The AI job matching space in 2025 is paradoxically **saturated yet broken**:
- **90% of employers** report spam increase from AI job tools
- **62.5% of companies** use AI recruitment, yet match quality remains poor
- Competitors optimize for **volume over value** ("Apply to 50 jobs/day!")
- Job seekers get **hundreds of irrelevant matches**, employers drown in **low-quality applications**

### Ori's Solution

**"Your AI agent that runs deep searches while you sleep—not a spam bot, but a partner that respects your whole life."**

**Core Differentiators:**
1. **Agentic framing** - Works on your behalf vs. passive job boards
2. **Quality over quantity** - Few, high-fit matches vs. spray-and-pray volume
3. **Constraint-respecting** - Matches to life context (visa, caregiving, time zones, remote needs)
4. **Geographic honesty** - LATAM as priority from day one, not an afterthought
5. **Long-term fit** - Optimizes for career health, not just speed

### Market Position

**Target:** $1.12B AI recruitment market by 2030 (92% of companies increasing AI investment)

**Pricing:**
- **Competitors:** $24-40/month (Jobright, TealHQ, JobCopilot)
- **Ori (proposed):** $5 Plus / $10 Premium (50-75% below market)
- **Alternative premium pricing:** $15-20 Plus / $35-45 Premium (market-aligned)

**Unit Economics (verified 2025 costs):**
- **LLM Cost:** $0.017/search (Gemini 1.5 Pro) - best economics
- **All-in COGS:** $1.47 (Plus), $3.83 (Premium) - includes LLM, job API, infra, overhead
- **Net Margin:** 70.6% (Plus), 61.7% (Premium) - **exceeds 60% target**

### Strategic Recommendations

**Phase 1 (MVP - Month 1-2):**
- Build with **Gemini 1.5 Pro** (50% cheaper than GPT-4o)
- Validate quality with **GPT-4o on 10% of searches**
- Launch in **LATAM + remote communities** (underserved, value pricing)

**Phase 2 (Validation - Month 2-3):**
- A/B test Gemini vs GPT-4o for quality
- Optimize prompts (target: 8k input, 1.5k output)
- Test premium pricing in US/EU markets

**Phase 3 (Scale - Month 3+):**
- Implement multi-stage pipeline (Flash-Lite + Gemini Pro) if >10k searches/month
- Employer partnerships ("signal vs. noise" solution)

---

<a name="market-opportunity"></a>
## 2. Market Opportunity

### Market Size & Growth

**AI Recruitment Software Market:**
- **2023:** $661.56M
- **2030:** $1.12B projected
- **Growth Trend:** 92% of companies increasing AI recruitment investment

**Job Seeker Segment (Ori's Focus):**
- Global, internet-native knowledge workers (tech, data, product, design, marketing)
- Segments: Early-career, career switchers, burned-out mid-levels seeking better fit
- Geographic: US/EU + **LATAM priority** (especially Mexico)

### Unmet Needs

**From User Complaints (Trustpilot Analysis):**

1. **Irrelevant Matches (#1 Complaint)**
   - "AI matching" = glorified keyword search
   - LazyApply sent users to internships instead of full-time roles
   - Sonara: 25-40% application failure rate
   - **Ori Advantage:** Semantic matching + constraint-aware filtering

2. **Spam Creates Noise**
   - JobCopilot's "50 apps/day" floods market
   - 94% of employers encountered misleading AI content
   - **Ori Advantage:** Quality over quantity messaging

3. **Geographic Limitations**
   - US-centric bias, weak LATAM/Asia coverage
   - "Remote" means "US remote" (time zone expectations)
   - **Ori Advantage:** LATAM-first, transparent about coverage

4. **Black Box AI = No Trust**
   - Users don't understand WHY they matched
   - Jobright shows percentage scores with zero explanation
   - **Ori Advantage:** Transparent reasoning in match results

5. **Over-Promise, Under-Deliver**
   - Jobright puts paying customers on waitlists for advertised features
   - Sonara shut down (acquired after failing)
   - LazyApply (2.8/5 Trustpilot) appears broken
   - **Ori Advantage:** Ship complete features, no beta-gating

6. **Billing Issues**
   - Charged after cancellation (TealHQ, JobCopilot, LazyApply)
   - LazyApply renamed Trustpilot page to hide reviews
   - **Ori Advantage:** Ethical billing practices, Stripe-standard

---

<a name="competitive-landscape"></a>
## 3. Competitive Landscape

### Competitive Matrix (12 Profiled Platforms)

| Competitor | Category | Price (Job Seekers) | Main Promise | Main Complaint | Ori's Edge |
|------------|----------|---------------------|--------------|----------------|------------|
| **Jobright** | AI Matching | $20-40/mo | AI career coach | Features on waitlist despite paying | No waitlists, ship complete |
| **TealHQ** | Resume + Tracker | Free - $29/mo | Beat ATS filters | Generic AI content, pricey | Actual job discovery vs. resume tools |
| **AIApply** | Toolkit | $12-29/mo + pay-per-apply | All-in-one toolkit | Hidden costs, Trustpilot flagged | Transparent pricing |
| **Sonara** | Auto-apply | **SHUT DOWN** | Save time | 40% fail rate, wrong matches | Survived = quality mattered |
| **JobCopilot** | Auto-apply | $39-56/mo | 20-50 apps/day | Spam, scam exposure | Quality matches vs. spray-and-pray |
| **LazyApply** | Auto-apply | $99+ lifetime | Hundreds of apps | Broken tool, billing issues | Working product, ethical practices |
| **LinkedIn** | Network + Jobs | Free (Premium varies) | Massive network | Noise, low signal | Curated quality vs. overwhelming volume |
| **Indeed** | Job board | Free | Broadest reach | Volume, variable quality | Precision vs. breadth |
| **ZipRecruiter** | Job board | Free | AI invites to apply | Employer-first experience | Job seeker-first, fit-focused |
| **Wellfound** | Startup/Tech | Free | Salary transparency | US/EU heavy despite "global" claim | True global with LATAM priority |
| **Toptal** | Elite freelance | N/A (employer pays $80-150/hr) | Top 3% talent | Different market (freelance) | Different segment (full-time employment) |
| **Turing** | Dev matching | N/A (employer pays $30-60/hr) | Top 1%, AI vetting | Different market (B2B2C) | Different segment (job seeker-direct) |

### Market Categories

1. **Auto-Apply Tools** (JobCopilot, LazyApply, Sonara*)
   - Model: Volume over precision ("spray and pray")
   - Revenue: $8-55/month subscriptions
   - **Weakness:** Spam, broken tools, irrelevant matches

2. **AI Matching + Career Tools** (Jobright, TealHQ)
   - Model: Freemium with premium features
   - Revenue: $19-39/month
   - **Weakness:** Black box AI, feature waitlists, US-centric

3. **Traditional Boards + AI** (LinkedIn, Indeed, ZipRecruiter)
   - Model: Free for job seekers, charge employers
   - Revenue: Employer-side monetization
   - **Weakness:** Employer-first optimization, overwhelming volume

4. **Tech Marketplaces** (Wellfound, Hired, Arc)
   - Model: Free for candidates, charge companies
   - Revenue: Employer subscriptions or placement fees
   - **Weakness:** False "global" claims, US/EU heavy

5. **Elite Dev Matching** (Toptal, Turing)
   - Model: High-touch matching, vetted talent
   - Revenue: Premium hourly rates ($30-150/hr)
   - **Weakness:** Different market (freelance/B2B2C)

---

<a name="positioning-strategy"></a>
## 4. Positioning Strategy

### 5 Core Differentiation Pillars

#### 1. Agentic, Not Algorithmic

**Market Gap:** No competitor positions as "your AI agent working on your behalf"

**Ori's Claim:**
> "Ori is your AI job-matching agent that runs deep searches on your behalf—not a passive job board, not a spam bot, but an agent that understands what you need and actively hunts for it."

**Messaging:**
- ✅ "Your AI agent that searches while you sleep"
- ✅ "An agent that works for you, not for employers"
- ❌ Avoid: "AI-powered job matching" (too generic)

---

#### 2. Quality Over Quantity: The Anti-Spam Positioning

**Market Gap:** Every auto-apply tool brags about volume. Nobody owns "few, perfect matches."

**Ori's Claim:**
> "We don't spam you with hundreds of mediocre matches. We run deep searches and surface only roles that truly fit your life, skills, and direction."

**Messaging:**
- ✅ "Stop drowning in bad matches. Get few, great ones."
- ✅ "Quality over noise. Always."
- ❌ Avoid: "Apply to more jobs faster" (races to bottom)

---

#### 3. Constraint-Respecting Matching

**Market Gap:** No competitor emphasizes life context beyond skills/location/salary

**Ori's Claim:**
> "Ori understands your whole life—visa needs, caregiving responsibilities, time zone constraints, remote requirements—and only shows roles that actually work for YOU."

**Messaging:**
- ✅ "Tell us what you can't compromise on. We'll respect it."
- ✅ "Matching that understands your life, not just your resume."
- ✅ "Because 'remote-friendly' doesn't mean 'requires 9am EST standups' when you're in Mexico City."

---

#### 4. Geographic Honesty + LATAM Priority

**Market Gap:** Competitors claim "global" but deliver US-first experiences

**Ori's Claim:**
> "Built global-first with strong coverage in US, EU, and LATAM. We don't just say 'remote'—we mean truly distributed, with Mexico as a priority market from day one."

**Messaging:**
- ✅ "Actually global. LATAM isn't an afterthought."
- ✅ "We know the difference between 'remote' and 'US remote.'"
- ✅ "Transparent about where we're strong and where we're building."

---

#### 5. Long-Term Fit Over Quick Placement

**Market Gap:** All competitors optimize for "get hired faster," none for "find the right fit"

**Ori's Claim:**
> "Ori prioritizes career fit that prevents burnout, not just faster placements. Because the wrong job faster is still the wrong job."

**Messaging:**
- ✅ "We optimize for your next 3 years, not your next 3 weeks."
- ✅ "The right fit > the fast fit."
- ✅ "Because one great match beats 100 mediocre ones."

---

### What NOT to Say (Learn from Failures)

**Avoid Over-Promising:**
- ❌ "Apply to hundreds of jobs automatically" (Sonara failed, JobCopilot getting pushback)
- ❌ "Beta features" marketed to paying customers (Jobright backlash)
- ❌ "Top 1%" or "Top 3%" without rigorous vetting (cheapens claims)

**Avoid Generic AI Buzzwords:**
- ❌ "AI-powered matching" (everyone says this, meaningless)
- ❌ "Smart recommendations" (Indeed, LinkedIn, ZipRecruiter all use this)
- ❌ Black box promises without explanation (builds distrust)

**Avoid False Global Claims:**
- ❌ "Global coverage" if it's really US-first (Wellfound does this)
- ✅ "Strong in US, EU, and LATAM. Expanding to Asia in 2026." (honesty builds trust)

**Avoid Volume Metrics:**
- ❌ "X applications per day" (contributes to spam problem, employer backlash)
- ✅ "We limit searches to ensure quality" (contrarian, defensible)

---

<a name="business-model--unit-economics"></a>
## 5. Business Model & Unit Economics

### Pricing Structure (Two Options)

#### **Option A: Value Play (Proposed)**
- **Free:** 1 deep search/month
- **Plus:** $5/month - 4 deep searches
- **Premium:** $10/month - 30 deep searches

**Pros:**
- 50-75% below market ($24-40 competitors)
- Appeals to price-sensitive segments (early-career, LATAM)
- Rapid user acquisition

**Cons:**
- May signal lower quality
- Lower revenue per user

**Best for:** Rapid growth, market share capture, emerging markets

---

#### **Option B: Premium Quality Play**
- **Free:** 1 deep search/month
- **Plus:** $15-20/month - 4-5 deep searches
- **Premium:** $35-45/month - 30 deep searches

**Pros:**
- Aligns with market expectations for quality tools
- Higher revenue per user
- Signals "this is serious technology, not another cheap bot"

**Cons:**
- Higher barrier to conversion
- Less accessible to price-sensitive users

**Best for:** Profitability, quality perception, US/EU markets

---

#### **Recommended: Hybrid Approach**
- **LATAM pricing:** $5 Plus / $10 Premium (value play)
- **US/EU pricing:** $15-20 Plus / $35-45 Premium (premium play)
- Use **geographic pricing** to optimize for both growth and revenue

---

### Unit Economics (Verified 2025 Costs)

#### LLM Cost Analysis

**Research Question:** Can Ori sustain proposed pricing with 60%+ margins?

**Answer:** ✅ **YES** - Highly sustainable

**Cost per Search (2025 Verified Pricing):**
| Model | Naive (20k in, 5k out) | Optimized (8k in, 1.5k out) | With Caching |
|-------|------------------------|------------------------------|--------------|
| **Gemini 1.5 Pro** | $0.05 | **$0.0175** | $0.017 |
| **GPT-4o** | $0.10 | $0.035 | $0.034 |
| **Claude Sonnet 4.5** | $0.135 | $0.0465 | $0.045 |

**Decision:** Use **Gemini 1.5 Pro** as primary model
- **Rationale:** 50% cheaper than GPT-4o, proven quality
- **Validation:** Run GPT-4o on 10% of searches for comparison
- **Fallback:** Easy to switch if quality gap detected

---

#### Full Cost Structure (All-In COGS)

**Per User per Month (assuming full quota usage):**

| Tier | Searches | LLM | Job API | Infra | Overhead | **Total COGS** | Revenue | **Net Margin** |
|------|----------|-----|---------|-------|----------|----------------|---------|----------------|
| **Plus** | 4 | $0.07 | $0.75 | $0.15 | $0.50 | $1.47 | $5.00 | **70.6%** |
| **Premium** | 30 | $0.53 | $2.00 | $0.30 | $1.00 | $3.83 | $10.00 | **61.7%** |

**Key Findings:**
- ✅ Both tiers **exceed 60% margin target**
- ✅ Economics remain healthy even with **50% average utilization**
- ✅ Room for growth: Multi-stage pipeline can reduce to $0.015-0.020/search at scale

---

#### Scaling Economics

**As Volume Grows:**

| Monthly Searches | Strategy | Cost/Search | Notes |
|------------------|----------|-------------|-------|
| **<1,000** | Single Gemini Pro | $0.017 | Simple architecture |
| **1k-10k** | Optimized prompts + caching | $0.015-0.020 | Profile compression |
| **10k-50k** | Multi-stage (Flash-Lite + Pro) | $0.015-0.020 | Pre-filter 200→50 jobs |
| **50k+** | Advanced routing + batch | $0.010-0.015 | Negotiate volume discounts |

**Path to $0.012/search at scale:**
1. Profile compression (500→250 tokens)
2. Multi-stage pipeline (Flash-Lite pre-filter)
3. Batch processing for background tasks
4. Negotiate volume pricing with Google

---

### Competitive Pricing Benchmark

**AI Job Search Platforms (2025):**
- Jobright: $19.99-39.99/month
- TealHQ: $29/month
- JobCopilot: $38.60-55.90/month
- Sonara (historical): $23.95/month
- LazyApply: $99+ lifetime

**Ori's Positioning:**
- **Value Play ($5/$10):** 50-75% cheaper → rapid growth
- **Premium Play ($15-20/$35-45):** Market-aligned → profitability

---

# Part II: Technical Architecture

<a name="system-architecture-overview"></a>
## 6. System Architecture Overview

### High-Level Architecture

```
                                ┌─────────────────┐
                                │   Supabase      │
                                │  (PostgreSQL +  │
                                │   Auth + RLS)   │
                                └────────┬────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              ┌─────▼─────┐      ┌──────▼──────┐      ┌──────▼──────┐
              │  Frontend  │      │  Core API   │      │ AI Engine   │
              │  (Next.js) │◄─────┤  (Express)  │◄─────┤  (FastAPI)  │
              │            │ REST │             │ REST │             │
              └─────┬─────┘      └─────┬───────┘      └─────────────┘
                    │                  │
              ┌─────▼─────┐      ┌─────▼─────┐
              │  Vercel   │      │  Stripe   │
              │ (Hosting) │      │(Payments) │
              └───────────┘      └───────────┘
```

### Service Communication

**Frontend → Core API:**
- Protocol: HTTP/REST
- Auth: Supabase JWT in `Authorization: Bearer {token}`
- Endpoints: 8 API modules at `/api/v1/*`

**Core API → AI Engine:**
- Protocol: HTTP/REST
- Auth: None (internal service trust)
- Timeouts: 5-30s (aggressive, graceful degradation)
- Fallback: Simple skill matching if AI unavailable

**Core API → Supabase:**
- Protocol: PostgreSQL client (Supabase JS SDK)
- Auth: Service role key + Row Level Security (RLS) policies
- Tables: user_profiles, experiences, education, applications, conversations, messages, notifications, beta_testers

**Core API → Stripe:**
- Protocol: Stripe SDK + Webhooks
- Integration: Payment intents, subscriptions, webhook events

---

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 16 (App Router) | React SSR/SSG framework |
| **UI Components** | shadcn/ui | Latest | Accessible component library |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS |
| **State Management** | TanStack Query | v5 | Server state caching |
| **Backend API** | Express.js | 4.19.2 | REST API server |
| **AI Engine** | FastAPI | Latest | Python async API |
| **Database** | Supabase (PostgreSQL) | Latest | Postgres with RLS |
| **Auth** | Supabase Auth | Latest | JWT + OAuth |
| **Payments** | Stripe | Latest | Payment processing |
| **ML Models** | sentence-transformers | Latest | Local embeddings (all-MiniLM-L6-v2) |
| **Translation** | DeepL | Latest | Professional translation |
| **Deployment** | Vercel + Google Cloud Run | N/A | Hosting + containerization |

---

### Monorepo Structure

```
ori-platform/                    # Monorepo root
├── src/                         # [Part 1] Next.js Frontend
├── services/
│   ├── core-api/                # [Part 2] Express API
│   ├── ai-engine/               # [Part 3] Python AI/ML
│   └── deepl-mcp/               # [Part 4] Translation MCP
├── supabase/                    # Database migrations
├── public/                      # Static assets
├── branding/                    # Brand identity
└── docs/                        # Generated documentation
```

**Key Pattern:** Each service is independently deployable with its own package.json/requirements.txt

---

<a name="frontend-nextjs-16"></a>
## 7. Frontend (Next.js 16)

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** React 19
- **Component Library:** shadcn/ui (45 primitives)
- **CSS:** Tailwind CSS
- **State:** TanStack Query v5 (server state) + React Context (global state)
- **Auth:** Supabase (session-based)
- **Payments:** Stripe Elements
- **i18n:** i18next (5 languages: en, de, es, fr, it)

---

### Routing Structure (App Router)

**Public Routes (Marketing):**
- `/` - Landing page
- `/about`, `/pricing`, `/blog`, `/features`, `/journey`, `/contact`
- `/legal/terms-of-service`, `/legal/privacy-policy`, `/legal/cookie-policy`

**Auth Routes:**
- `/login`, `/signup`
- `/auth/callback` - OAuth callback

**Onboarding:**
- `/select-plan` - Plan selection post-signup
- `/onboarding/v2` - 6-step onboarding flow

**Authenticated App (`/app/*`):**
- `/app/dashboard` - Main dashboard (stats, activity, what's next)
- `/app/profile` - Profile management (3 tabs: Profile, Qualifications, Goals)
- `/app/recommendations` - AI job matches with skill gap analysis
- `/app/applications` - Application tracking (status: applied, interviewing, offer, rejected, paused)
- `/app/settings` - Account settings (profile, notifications, billing)

**Subdomain Routing:**
- `getori.app` → Marketing site
- `app.getori.app` → Authenticated app

---

### API Integration (8 Modules)

**Location:** `/src/integrations/api/*.ts`

| Module | Endpoints | Purpose |
|--------|-----------|---------|
| **chat.ts** | `/api/v1/chat/history`, `/api/v1/chat/message` | AI conversation system |
| **jobs.ts** | `/api/v1/jobs/find-matches` | AI-powered job recommendations |
| **dashboard.ts** | `/api/v1/dashboard` | Stats, activity feed |
| **profile.ts** | `/api/v1/profile`, `/api/v1/experiences`, `/api/v1/education` | User profile CRUD |
| **applications.ts** | `/api/v1/applications`, `/api/v1/applications/stats` | Job application tracking |
| **betaTesters.ts** | `/api/v1/beta-testers` | Waitlist management |
| **payments.ts** | `/api/v1/setup-intent`, `/api/v1/subscriptions` | Stripe integration |

**Pattern:**
```typescript
// All API calls include Authorization header
const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/profile`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  }
});
```

---

### State Management

**Global State (React Context):**
1. **AuthProvider** (`/src/contexts/AuthProvider.tsx`)
   - Session management
   - User metadata
   - Auth methods (login, signup, logout)

2. **OnboardingProvider** (`/src/contexts/OnboardingContext.tsx`)
   - Multi-step onboarding flow
   - Auto-save to backend
   - Session persistence

**Server State (React Query):**
- All API data managed via TanStack Query v5
- Configuration: 5-minute stale time, no refetch on window focus, single retry

**Custom Hooks:**
```typescript
useProfile()           // Fetch user profile with optimistic updates
useExperiences()       // Fetch work history, invalidate on mutations
useEducation()         // Fetch education
useApplications()      // Fetch job applications with status filtering
useApplicationStats()  // Application counts
useIsMobile()          // Responsive breakpoint (768px)
```

---

### UI Component Inventory

**UI Primitives (45 components, shadcn/ui based):**
- **Layout:** card, sheet, dialog, modal, sidebar, tabs, accordion
- **Forms:** input, textarea, select, checkbox, radio-group, switch, calendar
- **Navigation:** navigation-menu, breadcrumb, pagination, command
- **Feedback:** alert, toast, progress, skeleton
- **Display:** badge, avatar, table, separator

**Feature Components:**
- **App Shell:** AppShell, SidebarNav, BottomNav
- **Dashboard:** DashboardHeader, QuickStats, RecentActivity, WhatsNextCard
- **Chat:** ChatWindow (full UI with auto-scroll, typing indicator)
- **Profile:** ProfileTabs, ProfileForm, QualificationsSection, GoalsSection, ExperienceForm, EducationForm
- **Recommendations:** JobRecommendationCard, SkillsGapDisplay, OriAnalysisCard
- **Applications:** ApplicationTable, ApplicationStatusBadge
- **Onboarding:** 6-step flow with session persistence

---

### Branding & Design System

**Core Identity:**
- **Brand Promise:** "Your career, continuously aligned."
- **Mascot:** Ori the Firefly (futuristic, empathetic AI guide)
- **Personality:** Serene, Whimsical, Intuitive, Empathetic

**Color Palette (Dark Mode):**
```css
Background: #0D1B2A (deep navy)
Primary:    #3EDBF0 (electric blue)
Warm:       #F9A72B (amber)
Success:    #3EE8A0 (teal-green)
Error:      #FF5E5E (soft red)
```

**Voice & Tone:**
- **Always:** Empathetic, Clear, Encouraging, Personal
- **Never:** Manipulative, Patronizing, Generic

**Typography:**
- Font: Inter (variable fonts: italic, roman)
- Loaded from `/public/fonts/`

**References:**
- `/branding/BRAND_IDENTITY.md` (89KB comprehensive guide)
- `/branding/BRAND_ESSENTIALS.md`
- `/branding/ORI_MANIFESTO.md`

---

<a name="core-api-express"></a>
## 8. Core API (Express)

**Service:** `@ori/core-api`
**Location:** `/services/core-api`
**Port:** 3001 (default)
**Deployment:** Vercel Serverless Functions

### Tech Stack
- **Framework:** Express.js v4.19.2
- **Language:** TypeScript v5.9.3
- **Database:** Supabase (PostgreSQL with RLS)
- **Payment Processing:** Stripe v16.12.0
- **Email:** Resend
- **Validation:** Zod v4.1.12

### Key Design Patterns
- **Middleware-based architecture** for auth, validation, and error handling
- **Row Level Security (RLS)** via Supabase for data isolation
- **Service role patterns** for Stripe customer management
- **Graceful degradation** for AI Engine integration

---

### API Endpoint Reference

#### Health & Status
- **GET /health** - Service health check (returns "OK")

#### Applications Management
- **GET /api/v1/applications** - Get all applications (with optional status filter)
- **GET /api/v1/applications/stats** - Dashboard stats (total, by status)
- **POST /api/v1/applications** - Create application
- **PUT /api/v1/applications/:id** - Update application
- **PATCH /api/v1/applications/:id/status** - Quick status update
- **DELETE /api/v1/applications/:id** - Delete application

#### Dashboard
- **GET /api/v1/dashboard** - Aggregated dashboard data
  - Returns: stats (activeApplications, jobRecommendations, skillsAdded, profileCompletion)
  - Returns: recentActivity array
  - Fetches: applications, profile, experiences, education in parallel

#### Jobs & Matching
- **GET /api/v1/jobs** - Get all available jobs (limit 100)
- **POST /api/v1/jobs/find-matches** - Find intelligent job matches
  - Calls AI Engine for matching (with fallback)
  - Increments usage counter
  - Returns: matches with scores, reasoning, skill gaps
- **POST /api/v1/jobs/initial-search** - Initial job search with validation

#### Profile Management
- **GET /api/v1/profile** - Get user profile
- **PUT /api/v1/profile** - Update profile (string length validation)
- **PUT /api/v1/profile/onboarding** - Complete onboarding
  - Sets `onboarding_completed: true`
  - Creates Stripe customer if not exists

#### Experiences
- **GET /api/v1/experiences** - Get all work experiences
- **POST /api/v1/experiences** - Create experience
- **PUT /api/v1/experiences/:id** - Update experience
- **DELETE /api/v1/experiences/:id** - Delete experience

#### Education
- **GET /api/v1/education** - Get all education records
- **POST /api/v1/education** - Create education
- **PUT /api/v1/education/:id** - Update education
- **DELETE /api/v1/education/:id** - Delete education

#### Chat (AI Conversation)
- **GET /api/v1/chat/history** - Get conversation history
- **POST /api/v1/chat/message** - Send message and get AI response
  - Creates new conversation if needed
  - Fetches last 10 messages for context
  - Calls AI Engine (with fallback to placeholder)

#### Payments (Stripe)
- **POST /api/v1/payments/checkout** - Create checkout session
- **POST /api/v1/payments/portal** - Create customer portal session
- **POST /api/v1/payments/webhook** - Stripe webhook handler
  - Events: checkout.session.completed, customer.subscription.*, invoice.payment.*, customer.source.expiring

#### Subscriptions
- **POST /api/v1/subscriptions** - Create subscription with payment method
- **POST /api/v1/setup-intent** - Create Setup Intent for payment collection

#### Notifications
- **GET /api/v1/notifications/preferences** - Get notification preferences
- **PUT /api/v1/notifications/preferences** - Update preferences
- **GET /api/v1/notifications/history** - Get notification history (paginated)
- **GET /api/v1/notifications/by-type/:type** - Get notifications by type
- **POST /api/v1/notifications/unsubscribe** - Unsubscribe from all emails
- **POST /api/v1/notifications/unsubscribe/:token** - Unsubscribe via token (public)
- **POST /api/v1/notifications/resubscribe** - Re-subscribe to emails
- **GET /api/v1/notifications/stats** - Get notification statistics

#### Onboarding
- **POST /api/v1/onboarding/session** - Save/update onboarding session
- **GET /api/v1/onboarding/session** - Get current session
- **DELETE /api/v1/onboarding/session** - Abandon session
- **PUT /api/v1/onboarding/complete** - Complete onboarding
- **POST /api/v1/onboarding/analytics** - Track onboarding analytics
- **GET /api/v1/onboarding/skill-suggestions** - Get skill suggestions

#### Users
- **GET /api/v1/users/me** - Get current user profile

#### Beta Testers
- **POST /api/v1/beta-testers** - Register for beta access (public, no auth)

---

### Middleware

**Authentication Middleware** (`/src/middleware/auth.ts`):
```typescript
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction)
```
- Validates Supabase JWT tokens
- Extracts Bearer token from Authorization header
- Attaches `user` object to request
- Applied to all protected routes

**Validation Middleware** (`/src/middleware/validation.ts`):
```typescript
export const validateRequest = (schema: ZodSchema) => (req, res, next)
```
- Validates request body against Zod schema
- Returns 400 with validation details on failure

**Error Handler Middleware** (`/src/middleware/errorHandler.ts`):
- Global error handling
- Catches unhandled errors, logs, returns consistent error format

---

### Integration Patterns

**Supabase Integration** (`/src/lib/supabase.ts`):
- Client: Initialized with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- RLS Pattern: Service role client for admin operations + user-scoped queries via `.eq('user_id', req.user.id)`

**Stripe Integration** (`/src/lib/stripe.ts`, `/src/lib/stripeHelpers.ts`):

**Stripe Plans:**
```typescript
STRIPE_PLANS = {
  plus_monthly: { name: "Plus Monthly", priceId: env.STRIPE_PLUS_MONTHLY_PRICE_ID },
  plus_yearly: { name: "Plus Yearly", priceId: env.STRIPE_PLUS_YEARLY_PRICE_ID },
  premium_monthly: { name: "Premium Monthly", priceId: env.STRIPE_PREMIUM_MONTHLY_PRICE_ID },
  premium_yearly: { name: "Premium Yearly", priceId: env.STRIPE_PREMIUM_YEARLY_PRICE_ID }
}
```

**Helper Functions:**
- `ensureStripeCustomer(userId, email, name?)` - Creates or retrieves Stripe customer
- `getUserEmail(userId)` - Fetches user email from Supabase
- `getStatusFromPriceId(priceId)` - Maps price ID to subscription status
- `getPlanKeyFromStatus(status)` - Reverse mapping

**Webhook Handling:**
- Verifies Stripe signature with `STRIPE_WEBHOOK_SECRET`
- Updates subscription status in `user_profiles` table
- Sends notifications for payment failures and expiring cards

**AI Engine Integration** (`/src/lib/ai-client.ts`):

**AIClient Class Methods:**
- `healthCheck()` - Check AI Engine availability (5s timeout)
- `generateMatches(request)` - Job matching with semantic scoring (30s timeout)
- `getSkillGap(userSkills, requiredSkills)` - Simple skill gap analysis (10s timeout)
- `analyzeSkills(profile, targetJobs)` - Comprehensive skill analysis (30s timeout)
- `getLearningPaths(profile, targetJobs, maxPaths)` - Learning recommendations (30s timeout)
- `recommendRoles(profile)` - Role suggestions (15s timeout)
- `generateResponse(userProfile, messageHistory, newMessage)` - Conversational AI (30s timeout)

**Graceful Degradation:**
- Health check before AI calls
- Fallback to simple skill matching if AI unavailable
- Fallback to placeholder chat responses
- Returns `null` or empty arrays on errors (non-blocking)

---

### Data Models

**Application:**
```typescript
{
  id: uuid
  user_id: uuid
  job_title: string
  company: string
  location?: string
  job_url?: string
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'paused'
  notes?: string
  application_date: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

**UserProfile:**
```typescript
{
  user_id: uuid
  full_name?: string
  headline?: string
  location?: string
  about?: string
  long_term_vision?: string
  skills?: string[]
  target_roles?: string[]
  work_style?: 'Remote' | 'Hybrid' | 'On-site'
  industries?: string[]
  goal?: string
  cv_url?: string
  onboarding_completed: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?: string
  created_at: timestamp
  updated_at: timestamp
}
```

**Experience:**
```typescript
{
  id: uuid
  user_id: uuid
  company: string
  role: string
  start_date: date
  end_date?: date
  is_current: boolean
  description?: string
  created_at: timestamp
  updated_at: timestamp
}
```

**Education:**
```typescript
{
  id: uuid
  user_id: uuid
  institution: string
  degree: string
  field_of_study?: string
  start_date: date
  end_date?: date
  is_current: boolean
  description?: string
  created_at: timestamp
  updated_at: timestamp
}
```

---

### Environment Variables

```bash
# Server
PORT=3001
NODE_ENV=development|production

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PLUS_MONTHLY_PRICE_ID=price_xxx
STRIPE_PLUS_YEARLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxx

# AI Engine
AI_ENGINE_URL=http://localhost:3002

# Frontend
FRONTEND_URL=http://localhost:3000

# Email
RESEND_API_KEY=re_xxx
```

---

<a name="ai-engine-fastapi"></a>
## 9. AI Engine (FastAPI)

**Service:** AI Engine
**Location:** `/services/ai-engine`
**Port:** 3002 (default)
**Deployment:** Google Cloud Run (containerized)

### Tech Stack
- **Framework:** FastAPI (async/await)
- **Language:** Python 3.x
- **ML Models:** sentence-transformers (all-MiniLM-L6-v2 default, 384-dim embeddings)
- **Dependencies:** numpy, pydantic, uvicorn

### Key Design Patterns
- **Singleton Pattern:** EmbeddingService ensures single model instance
- **Multi-factor Scoring:** Weighted combination of semantic + structured signals
- **Graceful Degradation:** Returns defaults on errors, never fails hard
- **Lazy Loading:** Embedding model loaded at startup via lifespan manager
- **Caching:** LRU cache for repeated computations

---

### API Endpoint Reference

#### Health & Status
- **GET /health** - Health check with service diagnostics
  - Returns: `{ status, service, version, model_loaded, checks }`
- **GET /** - Root endpoint with service info

#### Core AI Endpoints

**POST /api/v1/match** - Generate intelligent job matches
- **Request:** `{ profile: UserProfile, jobs: Job[], limit: 10 }`
- **Response:** `List[MatchResult]` with scores, reasoning, skill gaps

**Algorithm:**
```python
overall_score = (
    semantic_score * 0.40 +      # Deep profile-job alignment via embeddings
    skill_score * 0.30 +          # Explicit skill overlap with fuzzy matching
    experience_score * 0.15 +     # Career level fit
    location_score * 0.10 +       # Work style preferences
    salary_score * 0.05           # Compensation alignment
)
```

**POST /api/v1/skill-gap** - Simple skill gap calculation
- **Request:** `{ user_skills: [], required_skills: [] }`
- **Response:** `{ user_skills, required_skills, missing_skills }`
- Case-insensitive comparison, returns sorted missing skills

**POST /api/v1/analyze-skills** - Comprehensive skill gap analysis
- **Request:** `{ profile: UserProfile, target_jobs: Job[] }`
- **Response:** `SkillAnalysisResult` with gaps, importance, learning resources, overall readiness
- Features:
  - Aggregates skills from multiple jobs
  - Identifies importance levels (critical, important, nice-to-have)
  - Contextual importance detection via keyword proximity
  - Learning resource links (Coursera, Udemy, Pluralsight, LinkedIn Learning)
  - Strategic recommendations based on readiness score

**POST /api/v1/learning-paths** - Generate personalized learning paths
- **Request:** `{ profile: UserProfile, target_jobs: Job[], max_paths: 5 }`
- **Response:** `List[LearningPath]` with skill, priority, resources, milestones, duration

**POST /api/v1/recommend-roles** - Suggest relevant roles based on skills
- **Request:** `UserProfile`
- **Response:** `{ user_id, suggested_roles, based_on }`
- Skill-to-Role Mapping (examples):
  - Python → Python Developer, Data Scientist, Backend Engineer
  - React → React Developer, Frontend Engineer, UI Developer
  - AWS → Cloud Engineer, DevOps Engineer, Solutions Architect

**POST /api/v1/next-steps** - Personalized career action recommendations
- **Request:** `{ profile: UserProfile, current_applications: 5 }`
- **Response:** `{ user_id, recommendations, timestamp }`
- Logic: Profile completeness checks, application strategy advice

**POST /api/v1/generate_response** - Context-aware conversational AI
- **Request:** `{ user_profile, message_history, new_message }`
- **Response:** `{ content }`
- **Note:** Current implementation is placeholder, future LLM integration (OpenAI/Anthropic)

#### Development Endpoints
- **POST /api/v1/embed** - Generate embedding for arbitrary text (dev/test only, disabled in production)

---

### Services Architecture

**MatchingService** (`/services/matching.py`):

**Core Methods:**
- `match_profile_to_jobs(profile, jobs, limit)` - Main matching entry point
- `_score_job_match(profile, job, embeddings)` - Score single job
- `_score_skills(user_skills, requirements)` - Skill overlap with fuzzy matching
- `_score_experience(profile, job)` - Experience level alignment
- `_score_location(profile, job)` - Work style preference matching
- `_score_salary(profile, job)` - Salary range overlap
- `_generate_reasoning(...)` - Human-readable match explanation
- `_identify_key_matches(...)` - Top matching factors

**Skill Matching Logic:**
- Exact matches (case-insensitive)
- Fuzzy matches (substring matching, e.g., "React" in "React.js")
- Returns: score, matching skills, missing skills

**Experience Scoring:**
- Detects job level from description keywords
- Hierarchy: entry (1) < mid (2) < senior (3) < executive (4)
- Perfect match: 100, Adjacent: 80, 2+ levels apart: 50

**Location Scoring:**
- Exact work style match: 100
- Flexible/remote preference: 90-80
- Mismatch: 60

**Salary Scoring:**
- No preference: 100
- Unknown salary: 75
- Range overlap: 70-100 (based on overlap ratio)
- No overlap: 0-50 (penalty for large gaps)

---

**SkillAnalyzer** (`/services/skill_analysis.py`):

**Core Functions:**
- `calculate_skill_gap(request)` - Simple set difference (used by `/skill-gap` endpoint)
- `analyze_skill_gaps(profile, target_jobs)` - Comprehensive analysis
- `generate_learning_paths(skill_gaps, max_paths)` - Learning path generation

**Skill Importance Detection:**
- **Critical:** "required", "must have", "essential", "mandatory"
- **Important:** "preferred", "desired", "should have", "strong"
- **Nice-to-have:** "nice to have", "bonus", "plus", "advantage"

**Learning Time Estimates:**
- Critical: 3-4 months
- Important: 2-3 months
- Nice-to-have: 1-2 months

**Readiness Score:**
```python
readiness = (matched_skills / total_required_skills) * 100
```

**Recommendations Based on Readiness:**
- ≥80%: "You're well-prepared! Apply confidently"
- ≥60%: "Solid foundation. Bridge a few gaps"
- <60%: "Consider targeted learning plan"

---

**RecommendationEngine** (`/services/recommendations.py`):

**Methods:**
- `recommend_learning_paths(profile, target_jobs, max_paths)` - Wrapper around SkillAnalyzer
- `recommend_next_steps(profile, current_applications)` - Action recommendations
- `suggest_roles(profile, job_market_data)` - Role suggestions
- `personalize_job_descriptions(profile, job, match_score)` - Personalized insights (not exposed via API yet)

**Next Steps Logic:**
- No CV: "Upload CV to unlock features"
- <5 skills: "Add more skills for better matching"
- No goal: "Define career goal"
- 0 applications: "Start applying! 3-5 per week"
- >20 applications: "Focus on follow-ups"

---

**EmbeddingService** (`/models/embeddings.py`):

**Singleton Pattern:**
```python
class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

**Methods:**
- `embed_text(text)` - Single text embedding
- `embed_batch(texts, batch_size)` - Batch embedding for efficiency
- `embed_profile(profile_dict)` - Profile-specific embedding generation
- `embed_job(job_dict)` - Job-specific embedding generation
- `cosine_similarity(a, b)` - Similarity calculation (assumes normalized vectors)
- `is_ready()` - Health check

**Profile Embedding Construction:**
```python
parts = [
    f"Skills: {', '.join(skills)}",
    f"Target roles: {', '.join(roles)}",
    f"Career goal: {goal}",
    f"Experience level: {level}",
    f"{years} years of experience",
    f"Industries: {', '.join(industries)}",
    f"Prefers {work_style} work",
    f"Background: {cv_text[:1000]}"  # Truncated
]
profile_text = ". ".join(parts)
```

**Job Embedding Construction:**
```python
parts = [
    f"Job title: {title}",
    f"Company: {company}",
    f"Description: {description[:500]}",
    f"Requirements: {', '.join(requirements)}",
    f"Tags: {', '.join(tags)}",
    f"Work type: {work_type}"
]
job_text = ". ".join(parts)
```

---

### Performance Characteristics

**Embedding Generation:**
- **Model:** all-MiniLM-L6-v2 (lightweight, fast)
- **Dimension:** 384 (balance between speed and quality)
- **Batch Processing:** Up to 32 texts per batch
- **Cold Start:** ~2-3 seconds (model loading)
- **Warm Request:** <100ms per profile/job pair

**Matching Performance:**
- **50 jobs:** ~2-3 seconds (including embeddings)
- **Bottleneck:** Embedding generation
- **Optimization:** Batch embedding, normalized vectors, numpy operations

**Memory Usage:**
- **Model Size:** ~90MB (all-MiniLM-L6-v2)
- **Embedding Cache:** Grows with unique texts (consider LRU cache for large scale)

---

### Scaling Considerations

**Horizontal Scaling:**
- **Stateless:** Can run multiple instances
- **Load Balancer:** Distribute requests across instances
- **Session Affinity:** Not required

**Optimization Opportunities:**
1. **Embedding Cache:** Cache embeddings for frequent job postings
2. **GPU Acceleration:** For production (faster embedding generation)
3. **Larger Model:** all-mpnet-base-v2 (768 dim) for better semantic understanding
4. **Async Batch Processing:** Queue-based system for large-scale matching
5. **Vector Database:** Pinecone/Weaviate for semantic search at scale

---

<a name="deepl-mcp-translation"></a>
## 10. DeepL MCP (Translation)

**Service:** DeepL MCP
**Location:** `/services/deepl-mcp`
**Port:** 3003 (recommended to avoid conflict with AI Engine)
**Protocol:** MCP (Model Context Protocol) v0.1

### Tech Stack
- **Framework:** Express.js v5.1.0
- **Language:** TypeScript v5.9.3
- **Translation API:** DeepL Node.js SDK v1.21.0

### Design Philosophy
- **Minimal & Focused:** Single-purpose service for translation
- **MCP Compliance:** Implements MCP manifest for tool discovery
- **Stateless:** No session management or data persistence
- **Error Handling:** Graceful error responses with clear messages

---

### MCP (Model Context Protocol) Integration

**What is MCP?**
MCP is a standardized protocol for exposing tools and capabilities to AI assistants. It defines:
- **Discovery:** `.well-known/mcp.json` manifest describing available tools
- **Invocation:** HTTP endpoints for executing tools
- **Schema:** Structured parameter and response definitions

**GET /.well-known/mcp.json** - MCP manifest for tool discovery
- Describes available translation tool
- Provides schema for automatic parameter validation
- Dynamically constructs handler URL based on request host

---

### API Endpoints

**POST /translate** - Translate text to target language using DeepL
- **Request:** `{ text: "Hello, world!", target_lang: "DE" }`
- **Response (Success):** `{ translation: "Hallo, Welt!" }`
- **Response (Error - Missing Parameters):** `{ error: "Missing required parameters: text, target_lang" }` (400)
- **Response (Error - Translation Failure):** `{ error: "Failed to translate text" }` (500)

**Notes:**
- Source language auto-detected by DeepL (passed as `null`)
- Handles both single and array responses from DeepL SDK

---

### Supported Languages

**Target Languages (examples):**
- `DE` - German
- `FR` - French
- `ES` - Spanish
- `IT` - Italian
- `PT-BR` - Portuguese (Brazilian)
- `NL` - Dutch
- `JA` - Japanese
- `ZH` - Chinese (Simplified)
- `EN-US` - English (American)

**Full List:** See [DeepL API Documentation](https://www.deepl.com/docs-api/translate-text/translate-text/)

---

### Integration with Ori Platform

**Current Status:**
- Standalone service, not yet integrated with Core API or Frontend
- MCP Protocol ready for AI assistant integration

**Potential Integration Points:**
1. **Job Descriptions Translation** - Translate postings to user's preferred language
2. **Profile Localization** - Translate profiles for international applications
3. **Chat Translation** - Real-time translation of chat messages
4. **Notification Translation** - Localize email notifications

**Example Integration (Core API):**
```typescript
// /src/lib/deepl-client.ts
class DeepLClient {
  async translate(text: string, targetLang: string): Promise<string> {
    const response = await fetch('http://localhost:3003/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target_lang: targetLang })
    });

    if (!response.ok) throw new Error('Translation failed');
    const data = await response.json();
    return data.translation;
  }
}
```

---

### Environment Variables

```bash
# Required
DEEPL_API_KEY=xxx-xxx-xxx:fx  # DeepL API key

# Optional
PORT=3003  # Server port (avoid 3002 conflict with AI Engine)
```

---

### Port Conflict Warning

**Issue:** Default port 3002 conflicts with AI Engine default port

**Recommended Configuration:**
```
Core API:     http://localhost:3001
AI Engine:    http://localhost:3002
DeepL MCP:    http://localhost:3003
Frontend:     http://localhost:3000
```

---

# Part III: Implementation Details

<a name="database-schema-supabase"></a>
## 11. Database Schema (Supabase)

### Schema Overview

**Database:** PostgreSQL (Supabase)
**Location:** `/supabase/migrations/`
**Authentication:** Supabase Auth (JWT + OAuth)
**Security:** Row Level Security (RLS) policies

### Core Tables

**user_profiles**
- Primary user data
- Stripe integration (customer_id, subscription_id, subscription_status)
- Onboarding tracking (onboarding_completed)
- Profile data (skills, target_roles, work_style, etc.)

**experiences**
- Work experience history
- Linked to user_profiles via user_id
- Supports current employment tracking

**education**
- Education records
- Linked to user_profiles via user_id
- Supports ongoing education tracking

**applications**
- Job application tracking
- Status: applied, interviewing, offer, rejected, paused
- Application date tracking

**conversations**
- AI chat conversation sessions
- Linked to user_profiles

**messages**
- Chat message history
- Linked to conversations
- Role: user | assistant

**notifications**
- Notification history
- Type: payment_failure, card_expiring, trial_ending, subscription, recommendation, application_status, security, weekly_digest

**notification_preferences**
- User notification settings
- Opt-in/opt-out for each notification type

**beta_testers**
- Waitlist/early access tracking
- Source tracking (signup, login, landing)

---

### Migration History (14 Migrations)

**Chronological Evolution (Nov 4-12, 2025):**

1. **20251104192526_*.sql** - Initial schema
2. **20251104192640_*.sql** - User profiles table
3. **20251104195559_*.sql** - RLS policies
4. **20251104203948_*.sql** - Additional tables
5. **20251105202850_*.sql** - Extensions & enhancements
6. **20251108003034_create_conversations_and_messages.sql** - Chat tables
7. **20251108020018_add_onboarding_fields_to_user_profiles.sql**
8. **20251108224444_create_core_application_schema.sql** - Applications table
9. **20251108235959_add_stripe_fields_to_user_profiles.sql** - Billing integration
10. **20251109000000_create_notifications_table.sql**
11. **20251109000001_create_notification_preferences_table.sql**
12. **20251110000000_create_beta_testers_table.sql**
13. **20251112000000_onboarding_v2_enhancement.sql**

**Pattern:** Incremental, feature-aligned schema evolution

---

### Security Model

**Row Level Security (RLS):**
- All tables have RLS policies enabled
- Users can only access their own data
- Service role bypasses RLS for admin operations

**Authentication:**
- Supabase Auth for session management
- JWT tokens in Authorization header
- OAuth support (Google, GitHub, etc.)

---

<a name="aillm-integration-strategy"></a>
## 12. AI/LLM Integration Strategy

### Current Architecture

**Embedding-Based Matching (Production):**
- **Model:** sentence-transformers (all-MiniLM-L6-v2)
- **Dimension:** 384
- **Deployment:** Local model in AI Engine (FastAPI)
- **Cost:** $0 (self-hosted)

**LLM for Conversational AI (Future):**
- **Placeholder:** Current implementation returns context-aware placeholders
- **Future:** OpenAI GPT-4o or Anthropic Claude Sonnet 4.5

---

### LLM Cost Strategy (Verified 2025 Pricing)

**Primary Recommendation: Google Gemini 1.5 Pro**

**Rationale:**
1. **Best Economics:** $0.017/search (50% cheaper than GPT-4o)
2. **Proven Quality:** Competitive reasoning with GPT-4o/Claude
3. **Automatic Caching:** No code changes, 75% savings on cached tokens
4. **Clear Path to Scale:** Flash-Lite pre-filter can reduce to $0.019 total

**Validation Strategy:**
- Run GPT-4o on 10% of searches for quality comparison
- Track user engagement, feedback, conversion
- Decision point: Month 2 review

---

### Optimization Roadmap

**Phase 1: MVP (Month 1-2)**
- **Model:** Gemini 1.5 Pro (single model, simple)
- **Target:** 8k input, 1.5k output
- **Cost:** $0.017/search
- **Validation:** GPT-4o on 10% of searches

**Phase 2: Optimization (Month 2-3)**
- Prompt optimization (target 20-30% token reduction)
- Profile compression (500→250 tokens)
- Cache hit rate >50%
- A/B test Gemini vs GPT-4o

**Phase 3: Scale (Month 3-4)**
- Multi-stage pipeline (Flash-Lite + Gemini Pro) if >10k searches/month
- Target: $0.015-0.020/search
- Batch processing for background tasks

**Phase 4: Advanced (Month 4+)**
- Advanced routing (simple queries → cheap model)
- Negotiate volume discounts
- Self-hosted embeddings for pre-filter
- Target: $0.008-0.012/search

---

### Technology Options Evaluated

| Model | Cost/Search (Optimized) | Pros | Cons | Recommendation |
|-------|-------------------------|------|------|----------------|
| **Gemini 1.5 Pro** | $0.017 | Lowest cost, automatic caching, multimodal | Ecosystem less mature | ✅ **Primary** |
| **GPT-4o** | $0.034 | Best DX, ecosystem, JSON mode, reliable | 2x more expensive | ✅ **Validator (10%)** |
| **Claude Sonnet 4.5** | $0.045 | Best reasoning, 90% cache savings | Most expensive, explicit caching | Consider if quality critical |
| **GPT-4o-mini** | $0.0065 | Ultra-cheap, good for pre-filtering | Lower quality | Use for multi-stage |
| **Gemini Flash-Lite** | $0.002 | 125x cheaper than GPT-4 | 7-17% lower performance | Use for pre-filter |

---

### Multi-Stage Pipeline (Future Optimization)

**Pattern:**
```
User Profile (500 tokens)
    ↓
[Compress & Cache] → Profile Summary (150-250 tokens)
    ↓
Job API Fetch → 200 raw jobs
    ↓
[Stage 1: Pre-Filter]
  Model: Gemini Flash-Lite or GPT-4o-mini
  Input: Profile summary + 200 job summaries (8-12k tokens)
  Output: Top 50 job IDs + basic scores (1k tokens)
  Cost: $0.001-0.002
    ↓
[Stage 2: Deep Ranking]
  Model: Gemini 1.5 Pro or GPT-4o
  Input: Profile summary + 50 detailed jobs (6-8k tokens)
  Output: Scores + rationales (1-1.5k tokens)
  Cost: $0.015-0.035
    ↓
Results: Top 10-20 jobs with match scores
```

**Total Cost:**
- Gemini stack: $0.019 (Flash-Lite + Pro)
- OpenAI stack: $0.037 (4o-mini + 4o)

**When to Implement:** >10k searches/month

---

<a name="payment-processing-stripe"></a>
## 13. Payment Processing (Stripe)

### Integration Architecture

**Stripe Integration Points:**
1. **Core API:** Handles Stripe API calls, webhook processing
2. **Frontend:** Stripe Elements for payment collection
3. **Database:** Stores `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` in user_profiles

---

### Stripe Plans

```typescript
STRIPE_PLANS = {
  plus_monthly: { name: "Plus Monthly", priceId: env.STRIPE_PLUS_MONTHLY_PRICE_ID },
  plus_yearly: { name: "Plus Yearly", priceId: env.STRIPE_PLUS_YEARLY_PRICE_ID },
  premium_monthly: { name: "Premium Monthly", priceId: env.STRIPE_PREMIUM_MONTHLY_PRICE_ID },
  premium_yearly: { name: "Premium Yearly", priceId: env.STRIPE_PREMIUM_YEARLY_PRICE_ID }
}
```

---

### Payment Flow

**1. Setup Intent Creation:**
- Frontend: User selects plan on `/select-plan`
- Frontend: Calls `POST /api/v1/setup-intent` with planId
- Core API: Creates Stripe Setup Intent
- Core API: Returns `clientSecret` to frontend

**2. Payment Collection:**
- Frontend: Displays Stripe Elements with `clientSecret`
- User: Enters payment details
- Stripe: Validates and attaches payment method

**3. Subscription Creation:**
- Frontend: Calls `POST /api/v1/subscriptions` with planId and paymentMethodId
- Core API: Creates Stripe subscription
- Core API: Returns subscription status

**4. Webhook Processing:**
- Stripe: Sends webhook to `POST /api/v1/payments/webhook`
- Core API: Verifies signature, processes event
- Core API: Updates `user_profiles.subscription_status`

---

### Webhook Events Handled

| Event | Action |
|-------|--------|
| **checkout.session.completed** | Initial subscription creation |
| **customer.subscription.created** | Subscription created |
| **customer.subscription.updated** | Plan change, status update |
| **customer.subscription.deleted** | Cancellation |
| **invoice.payment_succeeded** | Successful payment |
| **invoice.payment_failed** | Failed payment (sends notification) |
| **customer.source.expiring** | Payment method expiring (sends notification) |

---

### Customer Portal

**Purpose:** Allow users to manage subscriptions (upgrade, cancel, update payment method)

**Implementation:**
- Frontend: Calls `POST /api/v1/payments/portal` with userId
- Core API: Creates Stripe customer portal session
- Core API: Returns `url` to Stripe-hosted portal
- Frontend: Redirects user to portal

---

### Notification Integration

**Payment Failure:**
- Trigger: `invoice.payment_failed` webhook event
- Action: Insert notification into `notifications` table
- Type: `payment_failure`
- Respects: `payment_failure_emails` preference

**Card Expiring:**
- Trigger: `customer.source.expiring` webhook event
- Action: Insert notification
- Type: `card_expiring`
- Respects: `card_expiring_emails` preference

---

<a name="deployment--infrastructure"></a>
## 14. Deployment & Infrastructure

### Hosting Architecture

```
┌─────────────────┐
│   Vercel        │
│  (Frontend)     │
│  Next.js SSR    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│   Vercel        │      │  Google Cloud   │
│ (Core API)      │◄─────┤  Run            │
│ Serverless Fns  │      │ (AI Engine)     │
└────────┬────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│  (Database +    │
│   Auth)         │
└─────────────────┘
```

---

### Service Deployment

**Frontend (Next.js):**
- **Platform:** Vercel
- **Type:** Edge + Serverless Functions
- **Build:** `npm run build` (static + server components)
- **Environment:** Set env vars in Vercel dashboard
- **Domains:** `getori.app` (marketing), `app.getori.app` (app)

**Core API (Express):**
- **Platform:** Vercel Serverless Functions
- **Entry Point:** `api/index.ts` (exports Express app)
- **Build:** `npm run build` (TypeScript → JavaScript)
- **Environment:** Set env vars in Vercel dashboard
- **Webhook Special Handling:** Raw body middleware for Stripe signature verification

**AI Engine (FastAPI):**
- **Platform:** Google Cloud Run
- **Container:** Dockerfile in `/services/ai-engine`
- **Build:** `docker build -t ai-engine .`
- **Deploy:** `gcloud run deploy ai-engine --region us-central1`
- **Environment:** Set env vars via `gcloud run services update`
- **Auto-scaling:** 0-10 instances

**DeepL MCP:**
- **Platform:** Standalone Node.js server (not yet deployed)
- **Future:** Docker container or Vercel Function

---

### Environment Configuration

**Vercel (Frontend + Core API):**
- `NEXT_PUBLIC_API_URL` - Core API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (Core API only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `AI_ENGINE_URL` - AI Engine URL

**Google Cloud Run (AI Engine):**
- `PORT` - Server port (auto-set by Cloud Run)
- `ENVIRONMENT` - production
- `EMBEDDING_MODEL` - all-MiniLM-L6-v2
- `OPENAI_API_KEY` - (future)
- `ANTHROPIC_API_KEY` - (future)

**Supabase:**
- Managed service, no manual deployment
- Migrations applied via Supabase CLI or dashboard

---

### CI/CD Pipeline

**Vercel (Auto-deployment):**
- **Trigger:** Git push to `main` branch
- **Build:** Automatic Next.js build
- **Deploy:** Automatic deployment to production
- **Preview:** Every PR gets preview URL

**Google Cloud Run:**
- **Manual:** `gcloud run deploy` from local
- **Automated (future):** GitHub Actions on push to `main`

---

### Monitoring & Observability

**Current Status:**
- Basic logging to console
- Vercel function logs
- Cloud Run logs

**Recommended:**
1. **Error Tracking:** Sentry or similar
2. **Performance Monitoring:** Vercel Analytics, Cloud Monitoring
3. **Logging:** Structured logging (JSON format)
4. **Metrics:** Prometheus for AI Engine, custom metrics for Core API
5. **Alerting:** PagerDuty or Opsgenie for critical errors

---

### Security Considerations

1. **Authentication:** Supabase JWT validation on all protected routes
2. **Authorization:** RLS policies + application-level user_id checks
3. **Input Validation:** Zod schemas prevent invalid data
4. **SQL Injection:** Parameterized queries via Supabase client
5. **Webhook Security:** Stripe signature verification
6. **CORS:** Configured for specific origins
7. **Rate Limiting:** Not implemented (TODO: add for production)
8. **Secrets:** Environment variables, never committed to repo

---

# Part IV: Roadmap & Recommendations

<a name="immediate-priorities"></a>
## 15. Immediate Priorities

### Pre-Launch Checklist (Month 1)

**Phase 1A: MVP Core Features (Week 1-2)**

1. ✅ **Basic Infrastructure:**
   - [x] Frontend deployed to Vercel
   - [x] Core API deployed to Vercel
   - [x] AI Engine containerized and deployed to Cloud Run
   - [x] Supabase database with RLS policies
   - [x] Stripe integration (checkout + webhooks)

2. ✅ **Core User Flows:**
   - [x] Signup/login (email + OAuth)
   - [x] 6-step onboarding with session persistence
   - [x] Profile management (basic info, qualifications, goals)
   - [x] Plan selection and payment

3. 🔧 **AI Matching (Critical Path):**
   - [ ] Implement Gemini 1.5 Pro integration in AI Engine
   - [ ] Test job matching with real user profiles
   - [ ] Validate match quality with GPT-4o on 10% of searches
   - [ ] Optimize prompts (target: 8k input, 1.5k output)

4. 🔧 **Job Application Tracking:**
   - [x] Create application
   - [x] Update application status
   - [ ] Enhanced status transitions (applied → interviewing → offer)
   - [ ] Activity feed on dashboard

---

**Phase 1B: Quality & Polish (Week 3-4)**

5. 🔧 **User Experience:**
   - [ ] Dashboard with stats, activity, "What's Next" card
   - [ ] Job recommendations page with skill gap display
   - [ ] Application tracking page with filters
   - [ ] Mobile responsiveness testing
   - [ ] PWA manifest and icons

6. 🔧 **Testing:**
   - [ ] Unit tests for Core API routes (target: 80% coverage)
   - [ ] Integration tests for AI Engine matching
   - [ ] E2E tests for critical user flows (signup, onboarding, matching)

7. 🔧 **Content:**
   - [ ] Landing page copy (emphasize 5 differentiation pillars)
   - [ ] Pricing page with feature comparison
   - [ ] Legal pages (terms, privacy, cookies)
   - [ ] FAQ section (address common concerns)

8. 🔧 **Analytics:**
   - [ ] Implement Vercel Analytics
   - [ ] Track key events (signup, onboarding completion, first match, first application)
   - [ ] Set up error tracking (Sentry)

---

### Launch Strategy (Month 2)

**Phase 2A: Beta Launch - LATAM + Remote Communities**

**Target:** 100 beta users in first 2 weeks

**Channels:**
1. **Reddit AMAs:**
   - r/jobsearching, r/cscareerquestions
   - Position as "anti-spam" alternative to JobCopilot/LazyApply
   - Highlight LATAM focus, constraint-aware matching

2. **Remote Work Communities:**
   - RemoteOK, Nomad List, We Work Remotely forums
   - Emphasize "truly global, LATAM-first" positioning

3. **LATAM Tech Groups:**
   - Slack/Discord communities for Mexican/Brazilian developers
   - Spanish/Portuguese landing pages (use DeepL MCP!)

4. **Product Hunt:**
   - Launch with tagline: "Your AI job agent (not a spam bot)"
   - Emphasize quality over quantity

**Pricing:**
- Free: 1 deep search/month
- Plus: $5/month (4 searches)
- Premium: $10/month (30 searches)

**Success Criteria:**
- 100 signups in 2 weeks
- 30% complete onboarding
- 50% run first deep search
- 20% convert to paid (Plus or Premium)

---

**Phase 2B: Quality Validation (Month 2-3)**

**A/B Test: Gemini vs GPT-4o**
- Route 50% to Gemini, 50% to GPT-4o
- Track: match quality, user satisfaction, conversions
- Measure: Which model produces better job matches?
- Cost: Only $0.002/search for 50% sample

**Metrics to Track:**
- Match quality (user feedback: thumbs up/down)
- Engagement (searches per user, time on recommendations page)
- Conversion (applications submitted from matches)
- Retention (Week 2, Week 4 active users)

**Decision Point (End of Month 2):**
- If Gemini quality = GPT-4o: **Keep Gemini** (50% cost savings)
- If GPT-4o significantly better: **Switch to GPT-4o as primary**
- If Claude needed: **Test Claude on 10% sample**

---

**Phase 2C: Optimization (Month 3)**

**Prompt Optimization:**
- Compress system prompts (remove verbosity)
- Test structured output formats
- Reduce job descriptions to key fields only
- Target: 8k → 6k input (25% reduction)

**Caching Validation:**
- Measure cache hit rate in production
- Test different profile summary lengths
- Optimize cache window timing
- Target: >50% cache hit rate

**Multi-Stage Prototype:**
- Build Flash-Lite → Gemini Pro pipeline
- Test on sample searches
- Measure quality delta vs single-model
- Validate latency impact

---

### US/EU Expansion (Month 3-4)

**Phase 3: Premium Pricing Test**

**Target Markets:** US, UK, Germany, France
**Pricing Strategy:** $15-20 Plus / $35-45 Premium

**Messaging:**
- "Premium AI matching that actually works"
- "50% cheaper than competitors, 2x better matches"
- Emphasize quality, transparency, no spam

**Channels:**
1. **Tech Job Boards:** Hacker News, Indie Hackers
2. **LinkedIn Ads:** Target burned-out developers, career switchers
3. **Content Marketing:** "Why AI job tools fail (and how Ori is different)"
4. **Referral Program:** Give 1 month free for every referral

**Success Criteria:**
- 500 signups in Month 3-4
- 25% convert to paid
- Average LTV: $100+ (3-month retention)
- Net margin >60% maintained

---

<a name="technical-roadmap"></a>
## 16. Technical Roadmap

### Q1 2026: Foundation & Validation

**Month 1: MVP Launch**
- ✅ Core features shipped (onboarding, matching, applications)
- 🔧 Gemini 1.5 Pro integration
- 🔧 GPT-4o validation (10% of searches)
- 🔧 Beta launch in LATAM

**Month 2: Quality & Optimization**
- A/B test Gemini vs GPT-4o
- Prompt optimization (target: 25% token reduction)
- Cache hit rate >50%
- User feedback loop implementation

**Month 3: Scale Preparation**
- Multi-stage pipeline prototype (if >10k searches/month)
- Premium pricing test in US/EU
- Enhanced analytics and monitoring
- Performance benchmarking

---

### Q2 2026: Scale & Growth

**Month 4-5: Advanced Features**
- Conversational AI (replace placeholder with real LLM)
- Resume parsing (extract skills/experience from CVs)
- Learning paths (personalized skill development)
- Employer partnerships (pilot program)

**Month 6: Optimization & Monetization**
- Multi-stage pipeline in production (if validated)
- Negotiate volume discounts with LLM providers
- Freemium optimization (convert free → paid)
- Referral program launch

---

### Q3-Q4 2026: Advanced Capabilities

**Advanced Matching:**
- Job market trend analysis
- User behavior-based recommendations
- Career path predictions (ML model)

**Internationalization:**
- DeepL MCP integration for job translation
- Multi-language UI (expand beyond 5 languages)
- Regional job board integrations

**Enterprise Features:**
- Employer portal (post jobs, view candidates)
- B2B2C model (companies sponsor searches for employees)
- White-label API for partners

**Infrastructure:**
- Vector database (Pinecone/Weaviate) for semantic search at scale
- GPU acceleration for AI Engine
- Advanced monitoring and alerting

---

<a name="go-to-market-strategy"></a>
## 17. Go-to-Market Strategy

### Positioning Summary

**Core Message:**
> "Ori is your AI job agent that runs deep searches while you sleep—not a spam bot, but a partner that respects your whole life."

**5 Differentiation Pillars:**
1. **Agentic** - Works on your behalf vs. passive boards
2. **Quality over quantity** - Few, high-fit matches vs. spam
3. **Constraint-respecting** - Matches to life context
4. **Geographic honesty** - LATAM-first, transparent coverage
5. **Long-term fit** - Optimizes for career health, not speed

---

### Launch Strategy (3 Phases)

**Phase 1: LATAM + Remote Communities (Month 1-2)**
- **Price:** $5 Plus / $10 Premium (value play)
- **Positioning:** "Global-first AI job agent with real LATAM coverage"
- **Channels:** Reddit, remote work communities, LATAM tech groups
- **Goal:** 100 beta users, 30% onboarding completion, 20% paid conversion

**Phase 2: US/EU Expansion (Month 3-4)**
- **Price:** Test $15-20 Plus / $35-45 Premium
- **Positioning:** "Quality AI matching that respects your constraints"
- **Channels:** Product Hunt, tech job boards, LinkedIn ads, content marketing
- **Goal:** 500 signups, 25% paid conversion, $100+ LTV

**Phase 3: Employer Partnerships (Month 4+)**
- **Positioning (to employers):** "High-signal candidates, not spam"
- **Monetization:** Employer subscriptions for access to curated talent
- **Model:** B2B2C (companies sponsor searches, job seekers free)

---

### Marketing Channels

**Owned Media:**
1. **Blog:** "Why AI job tools fail (and how Ori is different)"
2. **Email:** Drip campaigns for onboarding, activation, conversion
3. **Social:** LinkedIn, Twitter (X), Reddit presence

**Paid Media (Phase 2+):**
1. **LinkedIn Ads:** Target burned-out developers, career switchers
2. **Google Ads:** "AI job matching", "remote jobs LATAM"
3. **Reddit Ads:** Target subreddits (r/cscareerquestions, r/jobsearching)

**Community:**
1. **Reddit AMAs:** Position as "anti-spam" alternative
2. **Product Hunt:** Launch with "quality over noise" messaging
3. **Remote Work Forums:** RemoteOK, Nomad List, We Work Remotely

**Partnerships:**
1. **Remote Job Boards:** Cross-promote with RemoteOK, We Work Remotely
2. **Coding Bootcamps:** Career services partnerships
3. **Tech Communities:** Slack/Discord sponsorships

---

### Content Strategy

**Key Themes:**
1. **Anti-Spam Positioning:** "The AI job tool that doesn't spam"
2. **Quality Matching:** "One great match beats 100 mediocre ones"
3. **LATAM Focus:** "Actually global, LATAM isn't an afterthought"
4. **Constraint-Aware:** "Matching that understands your whole life"
5. **Long-Term Fit:** "Optimizing for your next 3 years, not 3 weeks"

**Content Types:**
- **Educational:** "How AI job matching actually works (and why most tools fail)"
- **Comparison:** "Ori vs JobCopilot vs TealHQ: What's different?"
- **Case Studies:** "How Maria found her dream remote role (from Mexico City)"
- **Thought Leadership:** "The future of AI-powered career guidance"

---

### Conversion Funnel

**Awareness → Interest:**
- Landing page emphasizes 5 differentiation pillars
- Social proof (testimonials, success stories)
- Free tier (1 search/month) as hook

**Interest → Trial:**
- Onboarding completion bonus (extra free search)
- First match within 24 hours guarantee
- Email drip: "See your first matches!"

**Trial → Paid:**
- Usage-based prompts ("You've used 1/1 free search. Upgrade for 4 more?")
- Value demonstration (skill gap analysis, learning paths)
- Limited-time discount (20% off first month)

**Paid → Retained:**
- Weekly digest of new matches
- Application tracking reminders
- Success stories ("3 interviews this month!")

---

### Competitive Differentiation in Messaging

**vs JobCopilot/LazyApply:**
- ❌ "Apply to 50 jobs/day" → ✅ "Few, high-fit matches only"
- ❌ "Automate everything" → ✅ "Your AI agent, not a spam bot"

**vs Jobright/TealHQ:**
- ❌ "Black box matching" → ✅ "Transparent reasoning in every match"
- ❌ "Features on waitlist" → ✅ "Ship complete, no beta-gating"

**vs LinkedIn/Indeed:**
- ❌ "Employer-first" → ✅ "Job seeker-first, always"
- ❌ "Overwhelming volume" → ✅ "Curated precision"

**vs Wellfound:**
- ❌ "Global (but really US/EU)" → ✅ "LATAM-first from day one"
- ❌ "Startup-only" → ✅ "All roles, constraint-aware"

---

<a name="appendices"></a>
## 18. Appendices

### Appendix A: LLM Cost Modeling Details

**Research Date:** November 13, 2025
**Sources:** Official pricing pages (OpenAI, Anthropic, Google)

**Verified Pricing:**
- **Gemini 1.5 Pro:** $1.25/M input, $5.00/M output
- **GPT-4o:** $2.50/M input, $10.00/M output
- **Claude Sonnet 4.5:** $3.00/M input, $15.00/M output

**Optimization Strategies:**
1. **Prompt Compression:** 20-40% token reduction
2. **Multi-Model Routing:** 60-80% cost reduction
3. **Output Format Optimization:** 70% reduction (5k → 1.5k)
4. **Caching:** 50-90% savings on repeated tokens

**Real-World Evidence:**
- Case Study 1: 90% cost reduction with prompt caching ($720 → $72/mo)
- Case Study 2: 30-50% reduction with comprehensive optimization
- Case Study 3: 50% savings with Batch APIs

---

### Appendix B: Competitive Research Sources

**Pricing Information:**
- Jobright.ai: SaaSworthy, Merlio (2025)
- TealHQ: Official site, SaaSworthy (2025)
- AIApply: Official site, SaaSworthy (2025)
- JobCopilot: Official site, TrustRadius (2025)
- Sonara: Historical (shut down Feb 2024)

**User Reviews:**
- Trustpilot (verified reviews with timestamps)
- Product Hunt (2025 user feedback)
- Reddit (r/jobsearching, r/cscareerquestions)

**Market Data:**
- Talroo: 90% of employers report spam increase (2025)
- Three Ears Media: 94% encountered misleading AI content (2025)
- Resume Now: 62% reject AI resumes without personalization (2025)

**Total Sources:** 55+ web sources consulted
**Confidence Level:** HIGH (all claims verified with 2+ sources)

---

### Appendix C: Technical Implementation Notes

**Monorepo Structure:**
- **Package Manager:** pnpm workspaces
- **Build Orchestration:** Turborepo (if used)
- **Shared Types:** TypeScript types shared across services
- **Independent Deployment:** Each service deploys separately

**Code Quality:**
- **TypeScript:** Strict mode enabled
- **Linting:** ESLint with recommended rules
- **Formatting:** Prettier
- **Testing:** Jest (Core API), pytest (AI Engine)

**Performance Benchmarks:**
- Frontend: Lighthouse score >90
- Core API: p95 latency <500ms
- AI Engine: Matching latency <3s for 50 jobs

---

### Appendix D: Glossary

**Agentic:** AI that works autonomously on behalf of the user, not just reactive/passive

**Constraint-Respecting:** Matching that considers life factors (visa, caregiving, time zones, remote needs)

**Deep Search:** AI-powered analysis of profile vs. jobs (not just keyword matching)

**Graceful Degradation:** System continues functioning (with reduced capabilities) when dependencies fail

**LLM:** Large Language Model (e.g., GPT-4o, Claude, Gemini)

**MCP:** Model Context Protocol - standardized protocol for exposing tools to AI assistants

**RLS:** Row Level Security - database security model that restricts data access at row level

**Semantic Matching:** Embedding-based similarity (understands meaning, not just keywords)

**Skill Gap Analysis:** Identifying missing skills between user profile and job requirements

---

### Appendix E: Key File Locations

**Frontend:**
- `/src/app/` - Next.js pages and layouts
- `/src/components/` - React components
- `/src/integrations/api/` - API client modules
- `/src/contexts/` - React Context providers

**Core API:**
- `/services/core-api/src/routes/` - REST API endpoints
- `/services/core-api/src/lib/` - Integration libraries (Stripe, Supabase, AI Engine)

**AI Engine:**
- `/services/ai-engine/services/` - Business logic (matching, skill analysis, recommendations)
- `/services/ai-engine/models/` - Pydantic schemas and embedding service

**Database:**
- `/supabase/migrations/` - SQL migration files

**Documentation:**
- `/docs/` - Generated analysis documents
- `/branding/` - Brand identity and guidelines

---

### Appendix F: Environment Variables Reference

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**Core API (.env):**
```bash
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
AI_ENGINE_URL=http://localhost:3002
FRONTEND_URL=http://localhost:3000
RESEND_API_KEY=re_xxx
```

**AI Engine (.env):**
```bash
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2
OPENAI_API_KEY=sk-xxx (future)
ANTHROPIC_API_KEY=sk-ant-xxx (future)
```

**DeepL MCP (.env):**
```bash
PORT=3003
DEEPL_API_KEY=xxx-xxx-xxx:fx
```

---

## Document Maintenance

**Last Updated:** 2025-11-13
**Next Review:** 2025-12-13 (monthly)
**Owner:** Carlo
**Contributors:** Claude (AI), Mary (Business Analyst Agent)

**Change Log:**
- 2025-11-13: Initial synthesis from 7 source documents
- Future: Track major architectural changes, pricing updates, competitive shifts

---

## Related Documentation

**Internal:**
- `/docs/frontend-analysis.md` - Frontend deep-dive (DEPRECATED after this synthesis)
- `/docs/core-api-analysis.md` - Core API reference (DEPRECATED)
- `/docs/ai-engine-analysis.md` - AI Engine details (DEPRECATED)
- `/docs/source-tree-analysis.md` - Repository structure (DEPRECATED)
- `/branding/BRAND_IDENTITY.md` - Brand guidelines (ACTIVE)

**External:**
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Stripe Integration](https://stripe.com/docs)
- [DeepL API](https://www.deepl.com/docs-api)

---

_This master reference document synthesizes all research and technical analysis into a single, coherent source of truth for the Ori Platform. All claims are backed by verified sources with 2025 timestamps._
