# Ori Platform - Product Requirements Document

**Author:** Carlo
**Product Manager:** John (PM Agent)
**Date:** 2025-11-13
**Version:** 1.0
**Status:** Phase 1 (MVP Foundation) - Ready for Epic Breakdown

---

## Executive Summary

### Vision Alignment

**Ori exists because the way we match humans to work right now is insanely wasteful and quietly cruel.**

Not dramatic cruel. Boring cruel. Spreadsheet cruel.

People don't just "have jobs"; they live inside them—8+ hours a day, for decades. Yet most people end up in roles chosen by luck, geography, parental pressure, or whatever was hiring the week they panicked. The tools we give them are infinite scroll, keyword filters, and spiritually empty "recommended jobs" that barely understand them.

**Your likelihood of doing work that fits you is closer to an accident than a system.**

### The Problem We're Killing

Today, most people find jobs through noise, luck, and desperation. Job boards and "AI recommendations" flood candidates with irrelevant roles while placing all the cognitive and emotional burden on individuals who have the least time, power, and information. Doing work that truly fits your skills, constraints, and values is still a privilege reserved for the well-connected and the obsessively organized.

**Ori exists to change that.** We believe every person deserves a loyal, intelligent agent on their side—one that deeply understands who they are, continuously scans the global job market, and surfaces only a small set of roles that genuinely fit. The core problem we are solving is the asymmetry of effort and insight in job search: individuals are forced to navigate a chaotic, global labor market alone.

**Ori's reason to exist is to reverse that asymmetry by making fulfillment systematic instead of accidental.**

### What Makes This Special

**Ori is not "a smarter job board." It's the first attempt to make fitting work a default outcome instead of a statistical miracle.**

**Five Unclaimed Positions We Own:**

1. **"Agentic" job search** - Your AI agent working on your behalf (not automation spam, not passive boards)
2. **Quality over quantity** - Few, perfect matches (not "50 applications/day" volume plays)
3. **Constraint-respecting matching** - Matches to life context (visa, caregiving, time zones, family constraints)
4. **Geographic honesty** - Actually global with LATAM priority from day one (not US-first with false "global" claims)
5. **Long-term fit** - Optimize for career health and fulfillment (not just "get hired faster")

**Competitive Moat (By Phase 3):**
- Multi-source LLM intelligence with provider performance feedback loops
- Proprietary matching quality data from user outcomes
- Constraint-aware matching taxonomy no competitor has
- Cultural adaptation intelligence for global markets
- User co-evolution system (manifesto-as-algorithmic-constraint)

---

## Project Classification

**Project Type:** Brownfield - Evolution of Existing Platform
**Track:** BMad Method (Level 2)
**Technical Type:** AI-Powered SaaS Platform
**Domain:** HR Tech / Job Matching / Career Development
**Complexity:** High (Multi-phase intelligent system with learning loops)

**Current State:** Existing platform infrastructure with job matching capabilities
**Target State:** LLM-powered autonomous job-matching agent with deep search, constraint-based filtering, and continuous learning

**Implementation Phases:**
- **Phase 1 (Months 1-6):** LLM-Powered Deep Search MVP
- **Phase 2 (Months 7-18):** Quality Validation & Intelligent Optimization
- **Phase 3 (Year 2+):** World-Class Autonomous Agent Platform

---

## Success Criteria

### Phase 1: MVP Foundation (Months 1-6)

**Business Metrics:**
- ✅ 100+ Premium users paying $5-10/month
- ✅ 50%+ run multiple searches (value validation)
- ✅ 70%+ month-over-month retention
- ✅ 60%+ gross margin after all costs (LLM, infrastructure, job APIs)
- ✅ User feedback: "Better than LinkedIn/Indeed"

**Technical Metrics:**
- ✅ Deep search working end-to-end
- ✅ Cost per search <$0.025
- ✅ Latency <10s (p95)
- ✅ 99%+ uptime

**Quality Metrics:**
- ✅ Match satisfaction >4/5 stars
- ✅ Click-through rate >10% on top results
- ✅ User reports: "Ori finds jobs I wouldn't have found myself"

### Phase 2: Validation & Optimization (Months 7-18)

**Business Metrics:**
- ✅ 1,000+ Premium users
- ✅ 60%+ retention (improved from Phase 1)
- ✅ $5,000-10,000/month revenue
- ✅ Net Promoter Score (NPS) >30

**Technical Metrics:**
- ✅ Cost per search <$0.020
- ✅ Cache hit rate >50%
- ✅ Primary LLM model chosen (data-driven)
- ✅ A/B testing infrastructure operational

**Quality Metrics:**
- ✅ User feedback validates multi-source intelligence = better results
- ✅ Click-through rate >15%
- ✅ Conversion rate (search → application) >10%

### Phase 3: World-Class Platform (Year 2+)

**Business Metrics:**
- ✅ 10,000+ Premium users
- ✅ 70%+ retention (best-in-class)
- ✅ $50,000+/month revenue
- ✅ NPS >50

**Technical Metrics:**
- ✅ Cost per search <$0.018
- ✅ 99.9%+ uptime
- ✅ Proprietary provider intelligence operational
- ✅ ML models improving match quality

**Quality Metrics:**
- ✅ Match satisfaction >4.5/5 stars
- ✅ Click-to-apply rate >20%
- ✅ User testimonials: "Ori is the best job search I've ever used"
- ✅ Documented competitive wins: Users switch from LinkedIn/Indeed to Ori

---

## Product Scope

### Phase 1: MVP Foundation (Months 1-6)

**Core Value Proposition:**
> "Ori runs deep searches on your behalf and surfaces only roles that truly fit your skills, constraints, and direction."

**MVP Features:**

**1. Deep Search Engine**
- User initiates "deep search" request with:
  - Job title/role keywords
  - Location preferences (remote, hybrid, on-site + geographic constraints)
  - Salary range (min/max)
  - Constraint filters (visa sponsorship, time zone, experience level)
- Ori uses LLM (Gemini 1.5 Pro) to:
  - Research job market via web search
  - Analyze 50-200 job listings
  - Score and rank by fit to user profile
- Returns 2-6 curated matches with "Why Ori picked this for you" explanations

**2. User Profile System**
- Skills & Experience (structured input)
- Constraints (visa, remote requirements, time zones, caregiving, salary floor)
- Preferences (company culture, industry, role type, growth vs. stability)
- Work Style (solo vs. team, creative vs. analytical, fast-paced vs. stable)
- Aspirational Direction ("The life you're hoping this next role takes you toward")

**3. Freemium Subscription Model**
- **Free Tier:** 1 deep search/month (2 matches per search)
- **Plus Tier:** $5/month - 4 deep searches/month (up to 4 matches per search)
- **Premium Tier:** $10/month - 30 deep searches/month (up to 6 matches per search)

**4. Results Dashboard**
- `/searches/<search_id>` page showing:
  - Search status (pending/in progress/completed)
  - Match cards with:
    - Job title, company, location, remote status
    - Tags (salary, experience level, visa sponsorship, etc.)
    - **"Why Ori picked this for you"** explanation (LLM-generated)
    - Link to job posting
- Email notification when search completes

**5. Basic Feedback Loop**
- User can rate matches (thumbs up/down)
- Optional: "Why wasn't this relevant?" text feedback
- Feedback stored for future Phase 2 learning loops

**What's NOT in MVP:**
- ❌ Continuous background job monitoring (future Phase 3)
- ❌ Multi-modal signals (calendar, study apps, coding platforms)
- ❌ Automated applications
- ❌ Employer-facing features
- ❌ Multi-language support (English only for MVP)
- ❌ Mobile apps (web-first)

### Phase 2: Intelligent Optimization (Months 7-18)

**Goal:** Build competitive differentiation through superior matching quality and user trust

**New Features:**

**1. A/B Testing Infrastructure**
- Route 50% of searches to Gemini, 50% to GPT-4o for quality comparison
- Track match quality, user satisfaction, conversion rates
- Data-driven primary model selection (Month 9)

**2. Enhanced Feedback Loop**
- Track: view, click, save, dismiss actions
- User-reported outcomes: applied, interviewed, offered, accepted
- 1-5 star ratings per match
- Explicit feedback: "Why wasn't this relevant?" with categories

**3. Prompt Optimization**
- Reduce token usage 20-30% through compression
- Structured output formats (JSON)
- Profile summarization (500 → 250 tokens)
- Job description compression to key fields

**4. Multi-Stage Pipeline (Optional)**
- Stage 1: Pre-filter with Gemini Flash-Lite (200 jobs → 50 jobs)
- Stage 2: Deep ranking with Gemini Pro (50 jobs → top matches)
- Target cost reduction: $0.017 → $0.019 combined (including pre-filter)

**5. Constraint Intelligence**
- Learn which constraints matter most per user segment
- Surface hidden constraints through conversation
- Validate constraint enforcement in matches

**6. Simple AI Suggestion Response**
- Feedback form: "Have an idea for Ori?"
- LLM generates response:
  - "This is interesting because..."
  - "Here's the constraint..."
  - "Here's a simpler variant..."
- Personalized response sent to user (manual trigger initially OK)

### Phase 3: World-Class Autonomous Agent (Year 2+)

**Goal:** Become the undisputed #1 global job-matching platform through data quality, learning loops, and agentic intelligence

**New Features:**

**1. Advanced Multi-Source Fusion**
- Multiple LLM providers with intelligent routing
- Provider quality scoring by market/segment (proprietary data moat)
- Dynamic provider selection based on query context
- Self-healing fallbacks

**2. Machine Learning Models**
- **Provider Quality Model:** Which LLM works best for which queries?
- **Salary Estimation Model:** Fill missing salary data from patterns
- **Match Quality Predictor:** Predict probability user will click/save/apply
- **Skills Taxonomy:** Learn skill relationships ("React devs often know TypeScript")

**3. Cultural Adaptation & Multilingual**
- Translate job descriptions to user's preferred language
- Cross-language semantic matching
- Cultural context adaptation (salary norms, work-life balance preferences)
- Regional constraint intelligence (visa types, labor laws)

**4. User Co-Evolution System (Manifesto-as-Constraint)**
- AI-scored idea triage (impact + feasibility + manifesto alignment)
- Living roadmap visible to users
- Feature lifecycle: Explore → Incubate → Standard → Legacy
- Pivot triggers when co-evo features outperform roadmap
- Red list of disallowed feature motifs (manipulation, coercion, deception)

**5. Proprietary Data Moats**
- **Provider Intelligence Database:** Which sources work best for which queries
- **Salary Intelligence:** User-reported actual outcomes
- **Company Culture Insights:** Aggregated user feedback on companies
- **Constraint Taxonomy:** Learned constraint patterns by segment

**6. Agentic Capabilities**
- Background job monitoring (continuous market scanning)
- Proactive alerts: "A role matching your profile just opened"
- Autonomous application preparation (with user approval)
- Multi-modal signals (calendar, productivity apps, skill development platforms)

**7. Employer-Facing Platform**
- Position Ori as "signal vs. noise" solution for employers
- High-quality candidate matches
- Cultural fit predictions
- Dual advocacy model (represent both candidates and employers fairly)

---

## Functional Requirements

### FR-1: User Profile & Onboarding

**FR-1.1: Profile Creation**
- User creates profile with:
  - Skills (structured tags + free text)
  - Experience (years, roles, industries)
  - Education (degrees, certifications, bootcamps)
  - Constraints (MUST HAVE):
    - Visa sponsorship needs (yes/no, which countries)
    - Remote requirements (fully remote, hybrid, on-site)
    - Location constraints (cities, regions, time zones)
    - Salary floor (minimum acceptable)
    - Caregiving/family constraints (optional)
  - Preferences (NICE TO HAVE):
    - Company culture (startup vs. corporate, flat vs. hierarchical)
    - Industry preferences
    - Role growth vs. stability
    - Work style (solo vs. team, creative vs. analytical)
  - Aspirational direction: "Describe the life you're hoping this next role takes you toward" (free text)

**FR-1.2: Profile Editing**
- User can update profile at any time
- Profile changes trigger re-summarization for LLM context
- Version history maintained (for Phase 2 learning)

**FR-1.3: Profile Compression (Technical)**
- System generates LLM-optimized profile summary (150-250 tokens)
- Cached for reuse across searches
- Updated when profile changes

---

### FR-2: Deep Search System

**FR-2.1: Search Request**
- User initiates deep search with:
  - Required: Job title/role keywords
  - Required: Number of matches desired (2, 4, or 6)
  - Optional: Additional context (specific companies, industries, avoid-lists)
- System validates quota (Free: 1/month, Plus: 4/month, Premium: 30/month)
- Creates search record with status `pending`
- Returns immediately with search ID

**FR-2.2: Search Processing (Async Worker)**
- Background worker picks up pending search
- **Step 1: LLM Research Phase**
  - Gemini 1.5 Pro performs web research for job listings
  - Target: 50-200 raw job postings
  - Includes: job title, company, location, salary, description, requirements
- **Step 2: Constraint Filtering (HARD FILTERS)**
  - Remove jobs that violate MUST-HAVE constraints:
    - Salary below user's minimum
    - Location incompatible with user's constraints
    - Visa sponsorship missing when required
    - Remote status doesn't match requirements
  - These jobs are NEVER shown to user
- **Step 3: LLM Matching & Scoring**
  - For each job passing constraints:
    - Generate fit score (0-100) based on:
      - Skills match
      - Experience fit
      - Preference alignment
      - Cultural fit indicators
    - Generate "Why Ori picked this" explanation (50-150 words)
- **Step 4: Ranking & Selection**
  - Sort jobs by fit score
  - Select top N matches (2, 4, or 6 based on user request)
  - Store in `matches` table
  - Update search status to `complete`
- **Step 5: Notification**
  - Send email: "Your search is ready. Ori found you X matches today."
  - Include top 2 jobs with summaries
  - CTA: "View all matches in your Ori dashboard"

**FR-2.3: Search Results Display**
- `/searches/<search_id>` page shows:
  - Search query and parameters
  - Status pill (pending/in progress/completed)
  - Match cards for each result:
    - Job title + company
    - Location / remote status
    - Tags (salary estimate, experience level, visa sponsorship, etc.)
    - **"Why Ori picked this for you"** explanation
    - "View job" link (external URL)
  - Feedback actions: thumbs up/down, "Not relevant" with reason

**FR-2.4: Search History**
- `/dashboard` shows list of all user searches
- Displays: search query, date, status, match count
- Click to view results

---

### FR-3: Constraint Management

**FR-3.1: Constraint Definition**
- Hard constraints (MUST match):
  - Salary range (min/max)
  - Location (cities, countries, regions, time zones)
  - Remote status (fully remote, hybrid min X days, on-site OK)
  - Visa sponsorship required
  - Experience level (junior, mid, senior, lead, etc.)
- Soft preferences (scored but not filtered):
  - Industry preferences
  - Company size
  - Company culture indicators
  - Growth stage (startup, scale-up, enterprise)

**FR-3.2: Constraint Enforcement**
- Jobs violating hard constraints are NEVER shown
- System logs filtered-out jobs for analysis (Phase 2: identify coverage gaps)
- User can see "X jobs filtered out due to constraints" (transparency)

**FR-3.3: Constraint Intelligence (Phase 2+)**
- Learn which constraints matter most per user segment
- Surface hidden constraints through conversation
- Suggest constraint refinements based on market reality

---

### FR-4: Subscription & Quota Management

**FR-4.1: Subscription Tiers**
- **Free:** 1 deep search/month, up to 2 matches per search
- **Plus ($5/mo):** 4 deep searches/month, up to 4 matches per search
- **Premium ($10/mo):** 30 deep searches/month, up to 6 matches per search

**FR-4.2: Quota Tracking**
- System tracks searches used this month per user
- Resets on monthly subscription anniversary
- Displays remaining quota in dashboard
- Blocks search creation when quota exceeded
- Prompts upgrade when quota reached

**FR-4.3: Stripe Integration**
- Hosted checkout pages for Plus and Premium
- Webhook handling for subscription events:
  - `customer.subscription.created` → Activate plan
  - `customer.subscription.updated` → Update plan
  - `customer.subscription.deleted` → Downgrade to Free
  - `invoice.payment_failed` → Suspend plan
- Upgrade/downgrade flows
- Cancellation with immediate downgrade (no partial refunds for simplicity)

---

### FR-5: Feedback & Learning

**FR-5.1: Match Feedback (Phase 1)**
- User can rate each match: thumbs up/down
- Optional: "Why wasn't this relevant?" with categories:
  - Wrong seniority level
  - Wrong location/remote status
  - Wrong salary
  - Wrong skills/experience fit
  - Wrong company culture
  - Other (free text)
- Feedback stored for Phase 2 analysis

**FR-5.2: Outcome Tracking (Phase 2)**
- User self-reports outcomes:
  - Applied
  - Interviewed
  - Offered
  - Accepted
- Used for ML model training (match quality predictor)

**FR-5.3: Suggestion System (Phase 2)**
- "Have an idea for Ori?" feedback form
- LLM generates response:
  - "This is interesting because..."
  - "Here's the constraint (technical, alignment, feasibility)..."
  - "Here's a simpler variant we could explore..."
- Response sent via email (initially manual trigger, automate in Phase 3)

---

### FR-6: Admin & Analytics

**FR-6.1: Cost Monitoring**
- Track per-search costs:
  - LLM API costs (input + output tokens)
  - Job API costs (if any)
  - Infrastructure costs (prorated)
- Alert when costs exceed budget thresholds

**FR-6.2: Quality Metrics**
- Match click-through rate (% of matches clicked)
- User satisfaction (average rating, NPS)
- Conversion rate (search → application)
- Retention (monthly active users, churn rate)

**FR-6.3: Search Analytics**
- Most common job queries
- Constraint distributions (what % need visa sponsorship, remote, etc.)
- Geographic distribution of users and searches
- Coverage gap analysis (where are we weak?)

---

## Non-Functional Requirements

### NFR-1: Performance

**NFR-1.1: Latency**
- Deep search completes in <10 seconds (p95)
- Aiming for <5 seconds in production
- Dashboard loads in <2 seconds
- Search result page loads in <1 second

**NFR-1.2: Throughput**
- Support 100+ concurrent searches (Phase 1)
- Support 1,000+ concurrent searches (Phase 2)
- Support 10,000+ concurrent searches (Phase 3)

**NFR-1.3: Availability**
- 99%+ uptime (Phase 1)
- 99.5%+ uptime (Phase 2)
- 99.9%+ uptime (Phase 3)

### NFR-2: Cost Efficiency

**NFR-2.1: LLM Costs**
- Phase 1: <$0.025 per search (target: $0.017 with Gemini Pro)
- Phase 2: <$0.020 per search (with optimization)
- Phase 3: <$0.018 per search (with multi-stage pipeline)

**NFR-2.2: Gross Margin**
- Maintain 60%+ gross margin after all costs:
  - LLM API costs
  - Job API costs (if any)
  - Infrastructure (DB, hosting, email)
  - Support & overhead

**NFR-2.3: Cost Monitoring**
- Daily cost alerts at $100, $500, $1000/month
- Circuit breakers: max cost per user per month
- Budget alerts trigger optimization sprints

### NFR-3: Security & Privacy

**NFR-3.1: Data Protection**
- User profiles encrypted at rest
- Search history private to user
- No selling of user data (manifesto alignment)
- GDPR-compliant data export and deletion

**NFR-3.2: Authentication**
- Email/password login (Supabase Auth or Clerk)
- Password reset flows
- Session management (JWT tokens)
- Optional: OAuth (Google, LinkedIn) in Phase 2

**NFR-3.3: Authorization**
- Users can only access their own searches and profiles
- Admin roles for support and analytics
- API rate limiting per user tier

### NFR-4: Scalability

**NFR-4.1: Database**
- Postgres (Supabase) with row-level security
- Indexed on: user_id, search_id, created_at
- Partitioning strategy for large tables (Phase 2+)

**NFR-4.2: Background Workers**
- Queue-based search processing (BullMQ or similar)
- Horizontal scaling of workers
- Retry logic for failed searches
- Dead letter queue for permanent failures

**NFR-4.3: Caching**
- Profile summaries cached in database
- LLM prompt caching (automatic for Gemini, GPT-4o)
- Results page caching (CDN for static assets)

### NFR-5: Observability

**NFR-5.1: Logging**
- Structured logs (JSON) for all LLM calls
- Include: user_id, model, input_tokens, output_tokens, cost, latency, cache_hit
- Error logs with stack traces
- Search processing pipeline logs

**NFR-5.2: Monitoring**
- Key metrics dashboards:
  - Cost per search (by model, by user tier)
  - Latency (p50, p95, p99)
  - Error rate
  - Cache hit rate
  - User engagement (searches per user, retention)
- Alerts for anomalies (cost spikes, latency spikes, error rate increases)

**NFR-5.3: Analytics**
- User behavior tracking (PostHog or similar)
- Funnel analysis: signup → profile → search → results → feedback
- A/B testing infrastructure (Phase 2)

### NFR-6: Reliability

**NFR-6.1: Error Handling**
- Graceful degradation when LLM APIs fail
- Fallback to secondary provider (GPT-4o if Gemini fails)
- User-friendly error messages
- Automatic retries with exponential backoff

**NFR-6.2: Data Integrity**
- Database transactions for critical operations
- Idempotent webhook handlers (Stripe)
- Validation of all user inputs
- Sanitization of LLM outputs (prevent XSS, injection)

**NFR-6.3: Backup & Recovery**
- Daily database backups (Supabase automatic)
- Point-in-time recovery capability
- Disaster recovery plan (RTO <24 hours)

---

## Technical Architecture

### Phase 1: MVP Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

**Backend:**
- Next.js API routes (serverless functions)
- Background workers: Node.js + BullMQ (or FastAPI if preferred)

**Database:**
- Supabase (managed Postgres)
- Tables:
  - `users` (id, email, plan, searches_used_this_month, profile_json)
  - `profiles` (user_id, skills, constraints, preferences, llm_summary)
  - `searches` (id, user_id, query, status, created_at, completed_at)
  - `matches` (id, search_id, job_title, company, location, salary, fit_score, reason_text, url, raw_json)
  - `feedback` (id, match_id, user_id, rating, reason, created_at)

**LLM Integration:**
- **Primary:** Google Gemini 1.5 Pro
- **Validation (10% of searches):** OpenAI GPT-4o
- Abstraction layer: `LLMService` interface (easy provider switching)

**Payment Processing:**
- Stripe Checkout (hosted pages)
- Webhook handling for subscription lifecycle
- Products: Free, Plus ($5/mo), Premium ($10/mo)

**Email:**
- Resend or SendGrid
- Transactional emails (search complete, subscription changes)

**Hosting:**
- Vercel (frontend + serverless API)
- Render or Railway (background workers)

### Phase 2: Optimization Additions

**A/B Testing:**
- Feature flags (LaunchDarkly or PostHog)
- Route searches to different LLM providers
- Track quality metrics per variant

**Caching Layer:**
- Redis for hot data (profile summaries, recent searches)
- LLM prompt caching (automatic)

**Analytics:**
- PostHog for user behavior
- Custom dashboards for cost/quality metrics

### Phase 3: World-Class Additions

**Machine Learning:**
- Python-based ML models (scikit-learn, PyTorch)
- Model serving (FastAPI or Modal)
- Training pipelines (weekly batch jobs)

**Advanced Infrastructure:**
- Kubernetes for workers (horizontal auto-scaling)
- Multi-region deployment (US, EU, LATAM)
- CDN for global performance

**Data Warehouse:**
- BigQuery or Snowflake
- ETL pipelines for analytics
- Data science workflows (Jupyter, Dagster)

---

## Implementation Planning

### Phase 1 Roadmap (Months 1-6)

**Month 1: Foundation**
- Week 1-2: Setup infrastructure (Supabase, Vercel, Stripe)
- Week 3-4: User auth + profile system + subscription flows

**Month 2: Deep Search MVP**
- Week 1-2: LLM integration (Gemini 1.5 Pro) + web research
- Week 3-4: Search processing worker + constraint filtering + ranking

**Month 3: User Experience**
- Week 1-2: Results dashboard + match cards + "Why Ori picked this" display
- Week 3-4: Email notifications + feedback system

**Month 4-5: Beta Testing**
- Week 1-2: Internal testing + bug fixes
- Week 3-4: Private beta (10-20 users) + feedback iteration
- Week 5-8: Public beta launch (Product Hunt, Reddit, Twitter)

**Month 6: Growth & Iteration**
- Target: 100 Premium users
- Iterate based on user feedback
- Monitor costs, quality, retention
- Decide on Phase 2 priorities

### Phase 2 Roadmap (Months 7-18)

**Months 7-9: Quality Validation**
- A/B test Gemini vs GPT-4o (50/50 split)
- Analyze match quality, user satisfaction, conversion
- Choose primary model based on data
- Implement prompt optimization (20-30% token reduction)

**Months 10-12: Intelligent Features**
- Enhanced feedback loop (outcome tracking)
- Constraint intelligence (learn patterns)
- Multi-stage pipeline (optional, if cost optimization needed)
- Simple AI suggestion response system

**Months 13-18: Scale Preparation**
- Optimize for 1,000+ users
- Implement caching strategies
- Build ML model prototypes
- Prepare for Phase 3 expansion

### Phase 3 Roadmap (Year 2+)

**Months 19-24: Advanced Intelligence**
- ML models: Provider quality, salary estimation, match predictor
- Cultural adaptation + multilingual support
- User co-evolution system (manifesto-as-constraint)
- Proprietary data moats operational

**Months 25-30: Agentic Capabilities**
- Background job monitoring
- Proactive alerts
- Autonomous application preparation
- Multi-modal signal integration

**Months 31-36: Platform Expansion**
- Employer-facing features
- Dual advocacy model
- Global scale (10,000+ users)
- World-class competitive positioning achieved

---

## Epic Breakdown Required

**Next Step:** Run `/bmad:bmm:workflows:create-epics-and-stories` to decompose this PRD into:
- Epics: Functional groupings (e.g., "User Profile System", "Deep Search Engine", "Subscription Management")
- Stories: Bite-sized implementation tasks (estimated 200k context limit compliance)

Each epic will include:
- Acceptance criteria
- Technical specifications
- Dependencies
- Estimated complexity

---

## References

### Research Documents
- **Technical Research:** `docs/research-technical-2025-11-13.md` (LLM cost modeling, provider selection)
- **Competitive Intelligence:** `docs/research-competitive-2025-11-13.md` (market positioning, pricing strategy)
- **Strategic Architecture:** `docs/job-api-strategic-architecture.md` (phased implementation roadmap)
- **Brainstorming Session:** `docs/brainstorming-session-results-2025-11-13.md` (MVP vision, marketing strategy)
- **Manifesto:** `branding/ORI_MANIFESTO.md` (product vision, philosophy, values)

### Workflow Status
- **Workflow Tracker:** `docs/bmm-workflow-status.yaml`
- **Current Phase:** Planning (PRD) → Ready for Solutioning (Architecture + Epics/Stories)

---

_This PRD captures the strategic vision and execution roadmap for Ori Platform—from LLM-powered MVP to world-class autonomous agent._

_Created through collaborative discovery between Carlo and Product Manager John (PM Agent)._
_Generated: 2025-11-13 via BMad Method PRD Workflow_
