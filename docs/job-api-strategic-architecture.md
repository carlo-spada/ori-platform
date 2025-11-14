# Job API Strategic Architecture: Path to Global Dominance

**Date:** November 13, 2025
**Author:** Carlo (with strategic research by Mary - Business Analyst)
**Status:** Architecture Decision Proposed
**Project:** ORI Platform

---

## Executive Summary

### The Question

**"What's the best strategy to become the undisputed #1 job matching provider globally, ideally for all sorts of jobs (from gardening to AI research)?"**

Should ORI use:
- Just one API provider?
- Hybrid strategy (intelligently choosing between providers)?
- Multiple providers per search (fusion)?
- A new approach entirely?

### The Answer: Phased Hybrid Evolution

**Start simple, scale to world-class through three strategic phases:**

| Phase | Timeline | Strategy | Cost/Month | Margin | Goal |
|-------|----------|----------|------------|--------|------|
| **1. MVP Foundation** | Months 1-6 | Single provider (JSearch) | $15-50 | 96-99% | Validate PMF |
| **2. Intelligent Hybrid** | Months 7-18 | Smart routing (2-4 providers) | $200-500 | 70-86% | Build differentiation |
| **3. World-Class Platform** | Year 2+ | Multi-source fusion (6-10 providers) | $5k-10k | 80-90% | **Global dominance** |

### Why This Wins

 **Speed to Market:** Launch in 2-3 months (Phase 1 simplicity)
 **Financial Viability:** 96-99% margins from day one
 **Data-Driven:** Phase 1 tells you which gaps to fill in Phase 2
 **Competitive Moat:** Phase 3 provider intelligence is proprietary and defensible
 **Risk Mitigation:** No vendor lock-in, graceful fallbacks, pluggable architecture

---

## Strategic Context

### Your Vision

Build the world's **undisputed #1 AI-powered job matching platform** covering:
-  **All job types** (gardening ’ AI research, blue-collar ’ executive)
-  **All geographies** (US, EU, APAC, LATAM, Africa, Middle East)
-  **Superior matching** (fewer, better results with clear "why" explanations)
-  **Sustainable pricing** ($5/month Premium tier, 30 searches)

### The Challenge

How do you build global coverage without:
- L Spending $10k-20k/year on scrapers (legal risks, maintenance hell)
- L Using one expensive provider (JobsPikr $79-400/month)
- L Building complex multi-source architecture from day one (6-8 week delay)
- L Vendor lock-in that prevents future flexibility

### The Competitive Landscape

**LinkedIn & Indeed Weaknesses ORI Can Exploit:**

1. **Spray-and-Pray Matching** - 100s of results, mostly noise
   - **ORI Advantage:** 10 perfect matches > 100 mediocre listings

2. **Opaque Algorithms** - Users don't know WHY jobs were recommended
   - **ORI Advantage:** Transparent "Why this fits you" for every match

3. **Weak Constraint Handling** - Show jobs outside salary/visa/remote requirements
   - **ORI Advantage:** STRICT enforcement of hard constraints

4. **US/EU Bias** - Coverage great in developed markets, poor elsewhere
   - **ORI Advantage:** Multi-source fusion fills geographic/industry gaps

5. **No Learning** - Same generic results for everyone
   - **ORI Advantage:** Feedback loops improve matching over time

---

## Phase 1: MVP Foundation (Months 1-6)

### Goal
Validate product-market fit with excellent UX, minimal complexity, profitability from day 1.

### Architecture

**Single Provider: JSearch API (RapidAPI)**

**Why JSearch:**
-  Best $/search ratio ($0.003-0.005 per search)
-  Global coverage (Google for Jobs aggregates 100+ sources)
-  Rich data (40+ fields: salary, remote, skills, experience)
-  Real-time updates (<24hr lag)
-  Free tier for testing (500-1,000 searches)
-  No legal risks (managed API)

**Coverage:**
- **Strong:** US, EU, Remote-first knowledge work
- **Industries:** Tech, business, creative, product, data
- **Gaps:** Blue-collar trades, emerging markets (APAC, LATAM, Africa)

**Tech Stack:**
```
Frontend:  Next.js + TypeScript (Vercel)
Backend:   Next.js API routes / FastAPI (Vercel/Render)
Database:  Supabase (managed Postgres)
Workers:   Python/TS background workers (job queue for async searches)
LLM:       OpenAI/Anthropic for matching intelligence
Job API:   JSearch (single provider)
```

**Data Flow:**
```
User submits search
  “
API creates search record (returns immediately: 200-500ms)
  “
Background worker:
  1. Call JSearch API (50-100 jobs)
  2. Normalize to ORI schema
  3. LLM matching (rank by fit, generate "why" explanations)
  4. Store top 10-30 matches in DB
  5. Notify user (email/push)
  “
User views results in app
```

**Matching Algorithm (Simplified):**
```python
FOR EACH job IN jsearch_results:
  # HARD CONSTRAINTS (must match)
  if NOT (
    job.salary >= user.min_salary AND
    job.salary <= user.max_salary AND
    job.location IN user.acceptable_locations AND
    job.visa_sponsorship == user.needs_visa AND
    job.remote_status >= user.min_remote
  ):
    SKIP  # Do not show this job

  # SOFT PREFERENCES (scored by LLM)
  soft_score = LLM_score(
    job_description, user_skills, user_experience, user_preferences
  )

  explanation = LLM_explain(why_this_job_fits, user_profile)

  STORE match(job, soft_score, explanation)

RETURN top_10_matches_by_score
```

### Economics

**Cost Structure (100 Premium Users):**
- JSearch Pro: $15-20/month
- Supabase: $0-25/month (free tier ’ $25)
- Vercel: $0-20/month (free tier ’ Pro $20)
- OpenAI/LLM: $50-100/month
- **Total: ~$100-150/month**
- **Revenue: $500/month** (100 users × $5)
- **Profit: $350-400/month**
- **Margin: 70-80%** 

**Cost at Scale (1,000 Premium Users):**
- JSearch Ultra: $50-150/month
- Infrastructure: $50-100/month
- LLM: $500-1,000/month
- **Total: ~$600-1,250/month**
- **Revenue: $5,000/month**
- **Profit: $3,750-4,400/month**
- **Margin: 75-88%** 

### Success Metrics

- <¯ 100+ Premium users paying $5/month
- <¯ >50% run multiple searches (value validation)
- <¯ >70% month-over-month retention
- <¯ User feedback: "Better than LinkedIn/Indeed"
- <¯ Profitability: 70%+ margins

### Exit Criteria for Phase 2

 Product-market fit validated (retention, NPS, testimonials)
 $500-2,000/month revenue (100-400 users)
 Identified specific coverage gaps users complain about
 Data showing which markets/industries need better coverage

### What NOT to Build in Phase 1

L Multi-source architecture (premature)
L Custom scrapers (expensive, risky)
L Deduplication (not needed with single provider)
L Complex feedback loops (nice-to-have, not MVP-critical)
L Multilingual support (English-first markets)
L Blue-collar coverage (target knowledge workers first)

**Timeline: 6-8 weeks to launch**

---

## Phase 2: Intelligent Multi-Source (Months 7-18)

### Goal
Build competitive differentiation through superior coverage. Establish multi-source architecture foundation.

### Architecture Evolution

**Add Secondary Providers (Smart Routing):**

**Provider Ecosystem:**
1. **JSearch** (Primary - Global baseline)
2. **Arbeitnow** (Free EU jobs from ATS systems)
3. **Niche Provider** (TBD based on Phase 1 user demand)
   - Option A: Blue-collar jobs API
   - Option B: APAC regional API (India, SEA)
   - Option C: LATAM regional API (Brazil, Mexico)

**Intelligent Routing Logic:**
```python
def select_providers(user_location, job_type, industry):
    providers = []

    # Geographic routing
    if user_location IN ["Germany", "Austria", "Switzerland"]:
        providers = [("jsearch", 0.8), ("arbeitnow", 1.0)]

    elif user_location IN ["India", "Singapore", "Indonesia"]:
        providers = [("jsearch", 0.6), ("apac_api", 1.0)]

    # Industry routing
    if job_type == "blue_collar":
        providers.append(("blue_collar_api", 1.0))
        # Reduce JSearch weight for blue-collar
        providers = [(p, w*0.5) if p=="jsearch" else (p,w) for p,w in providers]

    # Default fallback
    if len(providers) == 0:
        providers = [("jsearch", 1.0)]

    return providers
```

**Data Flow (Multi-Source):**
```
User submits search
  “
Intelligent Router selects 2-3 providers based on context
  “
Parallel API calls to selected providers
  “
Collect results (50-100 jobs per provider)
  “
Normalization Layer (map all schemas ’ ORI unified schema)
  “
Deduplication Engine:
  - Fuzzy matching (job_title + company + location)
  - Semantic similarity (OpenAI embeddings)
  - Merge duplicate jobs, keep best fields
  “
Quality Scoring (weight providers by historical performance)
  “
LLM Matching + Ranking
  “
Store top 20-40 matches (more than Phase 1 due to better coverage)
  “
User views results
```

**Deduplication Algorithm:**
```python
def deduplicate_jobs(jobs_from_all_providers):
    embeddings = OpenAI.embed([
        f"{job.title} {job.company} {job.location}"
        for job in jobs
    ])

    clusters = []
    for i, job in enumerate(jobs):
        matched = False
        for cluster in clusters:
            similarity = cosine_similarity(
                embeddings[i],
                cluster.centroid_embedding
            )
            if similarity > 0.85:  # 85% threshold
                cluster.add(job)
                matched = True
                break

        if not matched:
            clusters.append(Cluster(job, embeddings[i]))

    # For each cluster, merge job data (best fields from duplicates)
    deduplicated = []
    for cluster in clusters:
        best_job = merge_job_data(cluster.jobs)
        deduplicated.append(best_job)

    return deduplicated
```

**Provider Quality Scoring (Feedback Loop):**
```python
# Updated weekly based on user feedback
provider_scores = {
    "jsearch": {
        "US_tech": 0.95,      # Excellent
        "EU_tech": 0.85,      # Good
        "blue_collar": 0.60,  # Moderate (not specialized)
    },
    "arbeitnow": {
        "EU_tech": 0.90,      # Excellent for EU
        "US_tech": 0.10,      # Poor (out of scope)
    },
    # Updated based on click-through rates, user ratings
}

def weight_results(jobs, user_market):
    for job in jobs:
        provider = job.source_provider
        market = classify_market(user_location, user_job_type)
        quality_weight = provider_scores[provider][market]
        job.final_score = job.match_score * quality_weight

    return sorted(jobs, key=lambda j: j.final_score, reverse=True)
```

### Economics

**Cost Structure (1,000 Premium Users):**
- JSearch Ultra: $50-150/month
- Arbeitnow: $0 (free!)
- Niche Provider: $100-200/month (estimated)
- Infrastructure: $50-100/month
- LLM (incl. embeddings): $500-1,000/month
- **Total: ~$700-1,500/month**
- **Revenue: $5,000/month**
- **Profit: $3,500-4,300/month**
- **Margin: 70-86%** 

### Success Metrics

- <¯ 1,000+ Premium users
- <¯ >60% retention (improved from Phase 1)
- <¯ User feedback: "ORI finds jobs LinkedIn/Indeed miss"
- <¯ Provider intelligence: Data shows which providers work best per market
- <¯ Click-through rate >15% on top 10 results

### Exit Criteria for Phase 3

 Clear data on provider performance by market
 $5,000-10,000/month revenue (1,000-2,000 users)
 User feedback validates multi-source = better results
 Identified high-value niches underserved by APIs

**Timeline: 4-6 months to implement and validate**

---

## Phase 3: World-Class Platform (Year 2+)

### Goal
Become the undisputed best job matching platform globally through data quality, intelligent routing, and proprietary insights.

### Architecture Evolution

**Full Multi-Source Fusion Engine**

**Provider Ecosystem (6-10 providers):**
1. **JSearch** (Global baseline via Google for Jobs)
2. **Arbeitnow** (Free EU tech jobs)
3. **APAC API** (India, Southeast Asia coverage)
4. **LATAM API** (Brazil, Mexico, Latin America)
5. **Blue Collar API** (Skilled trades, service industry)
6. **Healthcare API** (Medical professionals, healthcare IT)
7. **Finance API** (FinTech, banking, finance roles)
8. **Custom Scrapers** (Selective high-value niches)

**When to Use Custom Scraping (Phase 3 Only):**

**Criteria:**
-  High user demand (>10% of users request this niche)
-  No API available for this source
-  Legally permissible (ToS allows, or official RSS/feed)
-  ROI positive (value to users > maintenance cost)

**Example Use Cases:**
- Quantum computing job boards (ultra-niche)
- Biotech-specific academic sites
- Government research labs (DOE, NASA, etc.)
- Regional job boards in underserved markets

**Custom Scraping Strategy:**
```
IF niche_demand > 10% AND no_api_exists:
    Evaluate legal risk (ToS, robots.txt)
    IF legal_ok:
        Estimate maintenance cost (hours/month)
        Estimate user value (retention lift, NPS impact)
        IF value > cost * 3:
            BUILD custom scraper
        ELSE:
            SKIP (not worth it)
```

**Advanced Intelligent Routing:**
```python
def intelligent_routing_v2(user_profile, search_params):
    location = user_profile.location
    job_type = search_params.job_category
    industry = search_params.industry
    experience = user_profile.experience_years

    # Historical performance data (learned from 100k+ searches)
    provider_performance = load_provider_scores()

    providers = []

    # Rule 1: Geographic routing
    if location IN ["US", "Canada"]:
        providers.append(("jsearch", 1.0))
    elif location IN ["Germany", "Austria", "Switzerland"]:
        providers.append(("jsearch", 0.8))
        providers.append(("arbeitnow", 1.0))
    elif location IN ["India", "Singapore", "Indonesia"]:
        providers.append(("jsearch", 0.6))
        providers.append(("apac_api", 1.0))
    elif location IN ["Brazil", "Mexico", "Colombia"]:
        providers.append(("jsearch", 0.6))
        providers.append(("latam_api", 1.0))

    # Rule 2: Industry routing
    if job_type == "blue_collar":
        providers.append(("blue_collar_api", 1.0))
        providers = adjust_weights(providers, "jsearch", 0.5)
    elif industry == "healthcare":
        providers.append(("healthcare_api", 1.0))
        providers = adjust_weights(providers, "jsearch", 0.8))

    # Rule 3: Niche routing (learned from user behavior)
    if "quantum computing" in search_params.keywords:
        providers.append(("quantum_jobs_scraper", 1.0))

    # Rule 4: Adjust by historical performance
    for provider, weight in providers:
        context_key = f"{location}_{job_type}_{industry}"
        historical_quality = provider_performance.get(provider, {}).get(context_key, 1.0)
        final_weight = weight * historical_quality
        # Use final_weight in ranking

    return providers
```

**Advanced Feedback Loop (Machine Learning):**

**Data Collection:**
-  View, click, save, dismiss
-  **NEW:** Apply, interview, offer, accept (self-reported)
-  **NEW:** User ratings (1-5 stars per match)
-  **NEW:** Explicit feedback ("Why wasn't this relevant?")

**ML Models:**

1. **Provider Quality Model**
   - Input: Provider, location, job_type, industry
   - Output: Quality score (0-1)
   - Training data: Historical click-through rates, user ratings
   - Update: Weekly batch training

2. **Salary Estimation Model**
   - Input: Job_title, company, location, experience, skills
   - Output: Estimated min/max salary
   - Training data: Jobs with known salaries + user-reported offers
   - Use case: Fill missing salary data from providers

3. **Match Quality Predictor**
   - Input: User_profile, job_features, provider_source
   - Output: Probability user will click/save/apply
   - Training data: All historical user interactions
   - Use case: Re-rank jobs beyond keyword matching

**Proprietary Data Moats (Your Competitive Advantage):**

1. **Provider Intelligence Database**
   - Which providers work best for which queries
   - Example: "Remote EU Python jobs: Arbeitnow + JSearch = 20% higher CTR than JSearch alone"
   - **LinkedIn/Indeed don't have this data**

2. **Salary Intelligence**
   - User-reported salaries from offers/acceptances
   - More accurate than public APIs (actual outcomes, not estimates)
   - Can estimate salaries where provider doesn't include it

3. **Company Culture Insights**
   - User feedback on companies
   - Surface in matches: "Company culture aligns with your work-life balance preference"

4. **Skills Taxonomy**
   - Learned skill relationships ("React devs often know TypeScript")
   - Better matching: Job requires TS ’ Recommend to React devs even if TS not in profile

**Multilingual Support (Global Requirement):**

```python
# Job description processing
detected_language = detect_language(job.description)
if detected_language != user.language_preference:
    job.description_translated = translate(job.description, user.language_preference)

# Cross-language matching
job_embedding = OpenAI.embed(job.description_translated)
user_embedding = OpenAI.embed(user.profile_translated)
semantic_match = cosine_similarity(job_embedding, user_embedding)
```

### Economics

**Cost Structure (10,000 Premium Users):**
- JSearch Mega: $500-1,000/month (custom enterprise pricing)
- Regional APIs (3-4): $300-600/month
- Industry APIs (2-3): $200-400/month
- Custom Scrapers: $500-1,000/month (infra + maintenance)
- Infrastructure: $200-500/month
- LLM: $3,000-6,000/month
- Translation APIs: $200-500/month
- **Total: ~$5,000-10,000/month**
- **Revenue: $50,000/month**
- **Profit: $40,000-45,000/month**
- **Margin: 80-90%** 

### Success Metrics

- <¯ 10,000+ Premium users
- <¯ >70% retention (best-in-class)
- <¯ NPS >50 ("Would you recommend ORI?")
- <¯ User testimonials: "ORI is the best job search I've ever used"
- <¯ Click-to-apply rate >20% (matches highly relevant)
- <¯ Documented competitive wins: Users switch from LinkedIn/Indeed to ORI

### Competitive Moat Achieved

 **Data Quality:** Multi-source fusion = better coverage than any single competitor
 **Intelligent Routing:** Proprietary provider performance data
 **Matching Intelligence:** Feedback loops + ML models > generic keyword matching
 **Global Coverage:** APAC, LATAM, Africa coverage rivals/beats LinkedIn
 **Transparency:** Users trust ORI because they understand WHY
 **Continuous Improvement:** More users ’ more feedback ’ better matching (flywheel)

**Timeline: 12-18 months to full implementation**

---

## Strategic Insights from Research

### Global Coverage Gaps (2025 Data)

**Google for Jobs Coverage:**

**Tier 1 (Excellent):** US, Canada, UK
**Tier 2 (Good):** India, Brazil, Mexico, Spain, Germany
**Tier 3 (Limited):** Colombia, Chile, Argentina, South Africa, Kenya, Nigeria
**Major Gaps:** China, Russia, Southeast Asia, Middle East, Most of Africa, Eastern Europe

**Implication:** Single provider (JSearch/SerpAPI) won't achieve global dominance. Multi-source REQUIRED for Phases 2-3.

### Data Quality Variations

**Salary Data Completeness (2025):**
- **Global Average:** Only 28.1% of job listings disclose salary
- **US Tech:** 50-70% (improving due to transparency laws)
- **EU:** 20-40% (lower transparency culture)
- **Emerging Markets:** 15-25%

**Implication:** ORI must handle missing salary gracefully (estimation models, clear uncertainty indication).

**Blue-Collar Coverage:**
- **White-Collar (Tech, Business):** Excellent (Google for Jobs, LinkedIn, Indeed)
- **Blue-Collar (Trades, Service):** Moderate to Poor (gaps in coverage)
- **Implication:** Phase 2-3 must add specialized blue-collar providers for true "all jobs" coverage.

### Competitive Intelligence

**LinkedIn's Moat:**
- Professional network graph (connections, endorsements)
- User activity data (searches, profile views, applications)
- Employer relationships (paid job slots)

**Indeed's Moat:**
- Massive scale (250M visitors/month)
- Resume database (225M profiles)
- Historical hiring outcomes data

**ORI's Opportunity:**
-  **Better UX:** 10 perfect matches > 100 mediocre listings
-  **Transparency:** Clear "why" explanations (LinkedIn/Indeed = black box)
-  **Constraint Respect:** STRICT enforcement (salary, visa, remote)
-  **Multi-Source:** Better coverage in specific markets (EU, blue-collar, emerging)
-  **Feedback Flywheel:** Provider intelligence no one else has

### Build vs Buy Economics

**Web Scraping (DIY) Costs:**
- Development: $4,000-8,000 (40-80 hours initial build)
- Maintenance: $1,000-2,000/month (10-20 hours ongoing)
- Infrastructure: $100-500/month (proxies, servers)
- **Total Year 1:** $10,000-20,000
- **Legal Risk:** Unquantifiable but potentially catastrophic

**API Solution Costs:**
- **Year 1:** $180-600 (JSearch $15-50/month)
- **Scraping is 20-50x more expensive**

**Verdict:** APIs for 99% of coverage. Custom scraping ONLY for ultra-high-value niches in Phase 3.

---

## Implementation Roadmap

### Week 1-2: Validation
- [ ] Sign up for JSearch Free tier (RapidAPI)
- [ ] Test 100 sample searches (validate data quality)
  - US tech jobs
  - EU remote jobs
  - Blue-collar jobs (understand gaps)
- [ ] Validate salary data completeness (target >50%)
- [ ] **Go/No-Go Decision:** Proceed with JSearch or test alternatives

### Weeks 3-8: Phase 1 MVP Development
- [ ] Backend API (Next.js/FastAPI)
- [ ] JSearch integration (single provider)
- [ ] Normalization layer (JSearch ’ ORI schema)
- [ ] Matching algorithm (constraints + LLM scoring)
- [ ] Async worker pipeline (queue + background)
- [ ] Frontend (search form + results with "Why" explanations)
- [ ] Supabase DB (users, searches, jobs, matches)
- [ ] Stripe payments
- [ ] Deploy to Vercel

### Weeks 9-12: Beta & Launch
- [ ] Beta test (10-20 users)
- [ ] Iterate based on feedback
- [ ] Public launch (Product Hunt, Reddit, Twitter)
- [ ] Target: 100 Premium users in Month 3

### Months 7-9: Phase 2 Planning
- [ ] Analyze Phase 1 data (coverage gaps, user requests)
- [ ] Research secondary providers
- [ ] Build provider abstraction (`JobSource` interface)
- [ ] Prototype deduplication algorithm
- [ ] Test intelligent routing rules

### Months 10-12: Phase 2 Launch
- [ ] Add Arbeitnow (free EU)
- [ ] Add 1 niche provider (data-driven choice)
- [ ] Implement deduplication
- [ ] Implement smart routing
- [ ] Launch enhanced search
- [ ] Monitor: retention lift, coverage feedback

### Year 2: Phase 3 Expansion
- [ ] Add 3-5 more providers (regional, industry)
- [ ] Build ML models (provider quality, salary estimation)
- [ ] Advanced feedback loops
- [ ] Multilingual support (if user base warrants)
- [ ] Selective custom scraping (high-value niches)

---

## Architecture Decision Record (ADR)

### ADR-002: Job API Provider Strategy

**Status:**  Accepted (November 13, 2025)

**Decision:**

Adopt **Phased Hybrid Architecture**:
- **Phase 1:** JSearch only
- **Phase 2:** JSearch + 2-3 specialized providers (intelligent routing)
- **Phase 3:** 6-10 providers + multi-source fusion + selective custom scraping

**Rationale:**

- **Phase 1** minimizes risk, validates PMF, 96-97% margins
- **Phase 2** builds differentiation, maintains 70-86% margins
- **Phase 3** achieves world-class coverage, 80-90% margins at scale
- **Flexibility:** Can pivot providers based on real user data
- **Defensibility:** Multi-source intelligence = proprietary moat

**Alternatives Rejected:**

L **Multi-source from day 1:** Too complex, delays launch 6-8 weeks
L **Web scraping:** Legal risks too high, $10-20k/year cost
L **JobsPikr:** Too expensive ($79-400/month), overkill for use case
L **SerpAPI:** 3x more expensive than JSearch, missing salary data

**Consequences:**

**Positive:**
-  Fast time-to-market (2-3 months)
-  Profitable from day 1 (96% margins)
-  No vendor lock-in (pluggable architecture)
-  Scalable to global dominance
-  Legal safety (no scraping)

**Negative:**
-   Phase 1 limited to Google for Jobs coverage
-   Deduplication complexity in Phase 2-3
-   Multi-provider costs scale with usage

**Risks & Mitigation:**

**Risk 1:** JSearch unavailable/expensive
’ **Mitigation:** Pluggable architecture allows swap to SerpAPI in <1 week

**Risk 2:** Coverage gaps prevent user acquisition
’ **Mitigation:** Phase 2 adds providers to fill gaps identified in Phase 1

**Risk 3:** Multi-source complexity overwhelms solo founder
’ **Mitigation:** Delay Phase 2 until PMF validated, hire when revenue supports it

---

## Key Takeaways

### The "New Idea" - Your Proprietary Moat

**Feedback Loop Provider Intelligence**

Track which providers give best results for which queries:
- "Remote EU Python jobs: Arbeitnow + JSearch = 20% higher CTR"
- "Blue-collar Ohio jobs: Blue Collar API beats JSearch by 35%"
- "Healthcare roles in Canada: Healthcare API + JSearch = best conversion"

**This data is PROPRIETARY.** LinkedIn and Indeed don't have it because they don't use multiple job sources intelligently. Over time (months 12-24), your routing gets smarter than anyone else's.

**That's your defensible competitive moat.**

### Financial Viability

**$5/month Premium pricing is not just viable - it's incredibly profitable:**

| Users | Phase | Monthly Cost | Revenue | Margin |
|-------|-------|--------------|---------|--------|
| 100 | 1 | $100-150 | $500 | **70-80%** |
| 1,000 | 2 | $700-1,500 | $5,000 | **70-86%** |
| 10,000 | 3 | $5k-10k | $50,000 | **80-90%** |

Your biggest costs will be:
- **LLM API** (matching intelligence)
- **Customer acquisition** (marketing)
- **NOT job data APIs** (negligible at scale)

### Speed to Market

**Phase 1 can launch in 6-8 weeks:**

- Week 1-2: Validate JSearch quality
- Week 3-8: Build MVP (simple single-provider architecture)
- Week 9-12: Beta test and public launch

**No need to solve global coverage on day 1.** Start with US/EU tech jobs (80% of your early adopters), expand based on actual user demand.

### Avoiding Common Mistakes

L **Don't start with web scraping** - Legal minefield, 20x more expensive than APIs
L **Don't build multi-source from day 1** - 6-8 week delay for minimal value
L **Don't use expensive enterprise APIs** - JobsPikr/Adzuna overkill for MVP
L **Don't ignore Phase 1 data** - Let users tell you which gaps to fill

---

## Conclusion

**Answer to Your Question:**

*"Should we use just one provider, hybrid, or multiple per search?"*

**All three - but at different times:**

1. **Months 1-6:** ONE provider (JSearch) - Fastest, simplest, profitable
2. **Months 7-18:** HYBRID (2-4 providers, smart routing) - Differentiation
3. **Year 2+:** MULTI-SOURCE FUSION (6-10 providers per search) - Global dominance

**Why phased?**
- Avoids premature optimization
- Data-driven expansion (users tell you what's missing)
- Sustainable margins at every phase (60-99%)
- Builds defensible moat through provider intelligence

**The path to becoming #1 globally:**
1. Start simple and fast
2. Listen to users
3. Fill gaps strategically
4. Build proprietary intelligence
5. Scale to world-class

**Your competitive moat isn't the APIs you use - it's the intelligence about WHICH APIs work best for WHICH queries. That comes from data only YOU will have.**

---

**Next Steps:**

1.  Review this strategic architecture with team/advisors
2.  Sign up for JSearch Free tier and validate quality
3.  Make go/no-go decision on Phase 1 approach
4.  Begin MVP development (Week 3)

**Questions? Need deeper analysis on any section?**

Contact: carlo@ori-platform.com

---

*Document Version: 1.0*
*Last Updated: November 13, 2025*
*Research conducted by: Mary (Business Analyst) with support from Claude (Anthropic)*
*Methodology: BMad Research Workflow - Technical Architecture + Strategic Analysis*
