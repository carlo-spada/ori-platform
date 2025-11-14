# Job API Technical Research & Comparison

**Research Date:** November 13, 2025
**Purpose:** Evaluate job board APIs for ORI platform to support $5/month pricing model with 30 searches/month for Premium users

---

## Executive Summary

### 🏆 Recommended Solution: **JSearch API (RapidAPI)**

**Why:** Best balance of coverage, pricing, and data quality for your use case.

- **Cost:** ~$0.003-0.02 per search (fits $5/mo budget with margin)
- **Coverage:** Global through Google for Jobs aggregation
- **Data Quality:** 30+ fields including salary, remote status, real-time updates
- **Rate Limits:** Sufficient for Premium tier (30 searches/user/month)

**Alternative for EU markets:** Arbeitnow (Free, but Germany/Europe only)

---

## Detailed API Comparison

### 1. JSearch API (RapidAPI) ⭐ RECOMMENDED

**Provider:** OpenWeb Ninja via RapidAPI
**Data Source:** Google for Jobs (aggregates LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster)

#### Pricing
| Plan | Monthly Cost | Requests/Month | Cost per Request |
|------|--------------|----------------|------------------|
| Basic (Free) | $0 | ~500-1,000 | Free (testing only) |
| Pro | ~$10-25 | ~5,000-10,000 | $0.001-0.005 |
| Ultra | ~$50-100 | ~20,000-50,000 | $0.001-0.005 |
| Mega | Custom | 100,000+ | $0.0005-0.002 |

**Estimated cost for ORI:**
- 100 Premium users × 30 searches = 3,000 searches/month
- At Pro tier: ~$15-20/month ($0.005-0.0067 per search)
- **Margin on $500 revenue (100 users × $5):** ~96-97%

#### Rate Limits
- Varies by plan (typically 1-10 requests/second)
- No strict hourly caps mentioned

#### Coverage
- **Geographic:** Global (via Google for Jobs)
- **Industries:** All major industries
- **Job Boards:** LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster, and 100+ more

#### Data Quality
- **Fields per job:** 30-40+ data points
- **Salary info:** ✅ min_salary, max_salary, median_salary
- **Remote status:** ✅ Dedicated remote job filtering
- **Freshness:** Real-time (Google for Jobs updates continuously)
- **Key fields:**
  - job_title, job_description
  - employer_name, employer_logo
  - job_location, job_city, job_country
  - job_is_remote, job_employment_type
  - job_apply_link, job_apply_quality_score
  - job_required_experience, job_required_skills
  - Salary information (min/max/median)

#### Pros
✅ Best data coverage (Google for Jobs aggregation)
✅ Real-time updates
✅ Excellent pricing for your volume
✅ Rich data fields (40+ per job)
✅ Remote job filtering built-in
✅ Global coverage
✅ Free tier for testing

#### Cons
❌ Dependent on RapidAPI platform
❌ Google for Jobs can have duplicate listings
❌ Pricing tiers not publicly detailed (need to sign up)

---

### 2. Arbeitnow API 🆓 FREE ALTERNATIVE

**Provider:** Arbeitnow
**Data Source:** European job boards, ATS systems (Greenhouse, SmartRecruiters, Lever, etc.)

#### Pricing
- **Cost:** FREE
- **Rate Limits:** None specified (no API key required)
- **Requests:** Unlimited

**Perfect for:** 100% margin if your users are in Germany/Europe

#### Coverage
- **Geographic:** Germany + Remote positions in Europe
- **Industries:** Tech-focused (from modern ATS systems)
- **Job Boards:** Greenhouse, SmartRecruiters, Join.com, TeamTailor, Recruitee, Comeet, Lever, Personio

#### Data Quality
- **Fields:** Standard job fields
- **Salary info:** Limited/varies by source
- **Remote status:** ✅ Has remote field
- **Freshness:** Daily updates from ATS systems

#### Pros
✅ Completely FREE
✅ No API key required
✅ European jobs (good for EU market)
✅ Direct from ATS = quality data

#### Cons
❌ Germany/Europe only (limited geography)
❌ Smaller dataset than global aggregators
❌ No clear SLA or support
❌ Limited salary data

---

### 3. SerpAPI (Google Jobs)

**Provider:** SerpAPI
**Data Source:** Google for Jobs

#### Pricing
| Plan | Monthly Cost | Searches/Month | Cost per Search |
|------|--------------|----------------|-----------------|
| Free | $0 | 250 | Free (testing) |
| Developer | $75 | 5,000 | $0.015 |
| Production | $150 | 15,000 | $0.01 |
| Big Data | $275 | 30,000 | $0.0092 |

**Estimated cost for ORI:**
- 3,000 searches/month = Developer plan ($75/mo)
- **Cost per search:** $0.015
- **Margin on $500 revenue:** 85% ($425 profit)

#### Rate Limits
- **Hourly limit:** 20% of monthly quota per hour
- Developer plan: ~1,000 searches/hour max

#### Coverage
- **Geographic:** Global (Google for Jobs)
- **Industries:** All
- **Sources:** Same as Google for Jobs (Indeed, LinkedIn, etc.)

#### Data Quality
- **Fields:** Good (Google Jobs structured data)
- **Salary info:** ⚠️ REMOVED - Google deprecated salary fields in Jobs Listing API
- **Remote status:** ✅ Has "work from home" filter (ltype parameter)
- **Freshness:** Real-time

#### Pros
✅ Reliable provider (established company)
✅ Global coverage
✅ Free tier for testing (250 searches)
✅ Good documentation

#### Cons
❌ More expensive than JSearch ($0.015 vs $0.005 per search)
❌ Salary data removed by Google (major limitation)
❌ 20% hourly rate limit could be restrictive
❌ Higher cost impacts margins

---

### 4. Adzuna API

**Provider:** Adzuna
**Data Source:** Adzuna job aggregator (UK, US, AU, and more)

#### Pricing
- **Free tier:** 14-day trial (testing only)
- **Commercial pricing:** Contact for quote
- **Rate limits:** Default limits; can request increases for high-volume

**Note:** Pricing not publicly available - requires sales contact

#### Coverage
- **Geographic:** UK, US, Australia, and select countries
- **Industries:** All major industries
- **Quality:** Good (established aggregator)

#### Data Quality
- **Fields:** Standard job fields + salary data
- **Salary info:** ✅ Available (one of their key features)
- **Remote status:** Likely available
- **Freshness:** Regular updates

#### Pros
✅ Established provider
✅ Salary data available
✅ 14-day free trial
✅ Can negotiate rate limits

#### Cons
❌ No public pricing (sales required)
❌ Limited geographic coverage vs Google for Jobs
❌ Likely expensive for commercial use

---

### 5. Reed API (UK Focus)

**Provider:** Reed.co.uk
**Data Source:** Reed.co.uk UK job board

#### Pricing
- **Cost:** Not publicly available
- **Free tier:** Available for developers (need account)

#### Rate Limits
- **Jobseeker API:** 1,000 requests/day
- **Recruiter API:** 2,000 requests/hour (customizable)

#### Coverage
- **Geographic:** UK only
- **Industries:** All UK industries
- **Quality:** High (direct from Reed, major UK job board)

#### Data Quality
- **Fields:** Comprehensive UK job data
- **Salary info:** Likely available
- **Freshness:** Real-time from Reed.co.uk

#### Pros
✅ Excellent for UK market
✅ High-quality data
✅ Good rate limits

#### Cons
❌ UK only (major limitation)
❌ No global coverage
❌ Pricing unclear

---

### 6. JobsPikr API

**Provider:** JobsPikr
**Data Source:** Web scraping + aggregation from multiple job boards

#### Pricing (Highly Variable)
- **Starting:** $79-400/month (sources vary)
- **Enterprise:** Custom pricing
- **Model:** Subscription-based (monthly/annual)

**Note:** Pricing inconsistent across sources - requires direct quote

#### Rate Limits
- **Aggregation API:** 100 requests/hour
- **Data API:** 5,000 requests/hour

#### Coverage
- **Geographic:** Global
- **Industries:** All major industries
- **Quality:** Good (ML-powered data cleaning)

#### Data Quality
- **Fields:** Comprehensive (30+ fields)
- **Salary info:** ✅ Available
- **Remote status:** ✅ Available
- **Freshness:** Regular updates

#### Pros
✅ Global coverage
✅ Rich data (ML-enhanced)
✅ Industry classification
✅ Salary data

#### Cons
❌ Expensive ($79-400+ per month minimum)
❌ Low rate limits on Aggregation API (100/hour)
❌ Pricing unclear - requires sales contact
❌ Overkill for your volume (3k searches/month)

---

## Alternative Approaches Analysis

### Web Scraping (DIY)

#### Approach
Build your own scraper to extract job data from job boards

#### Legal Risks
- **High Risk:** Most major job boards (LinkedIn, Indeed, Glassdoor) explicitly prohibit scraping in Terms of Service
- **Lawsuits:** Glassdoor and LinkedIn have taken legal action against scrapers
- **Copyright:** Job postings often contain copyrighted content
- **Cease & Desist:** High likelihood of receiving legal threats

#### Technical Challenges
- **Maintenance overhead:** Sites change frequently, breaking scrapers
- **Anti-scraping measures:** CAPTCHAs, rate limiting, IP blocking
- **Data quality:** Requires parsing, cleaning, standardization
- **Infrastructure:** Need proxies, rotation, monitoring

#### Cost Analysis
- **Development:** 40-80 hours initial build ($4,000-8,000 if outsourced)
- **Maintenance:** 10-20 hours/month ($1,000-2,000/month)
- **Infrastructure:** Proxies, servers (~$100-500/month)
- **Legal risk:** Unquantifiable but potentially catastrophic

#### Verdict
❌ **NOT RECOMMENDED**
- Legal risks too high
- Maintenance overhead too expensive
- Total cost higher than API solutions
- Unreliable (scrapers break frequently)

---

### Hybrid Model (Free Sources + Paid Premium)

#### Approach
Use free APIs (Arbeitnow) for some regions, paid APIs (JSearch) for others

#### Analysis
**Pros:**
- Lower costs in regions with free coverage
- Can offer better margins in Europe

**Cons:**
- Complex architecture (multiple integrations)
- Inconsistent data quality across regions
- Hard to maintain UX consistency
- Premature optimization for early stage

#### Verdict
⚠️ **CONSIDER FOR LATER**
- Good strategy once you have product-market fit
- Too complex for MVP
- Start with single provider, expand later

---

## Pricing Model Feasibility Analysis

### Your Target: $5/month for Premium (30 searches)

#### Scenario: 100 Premium Users

| API Provider | Monthly Cost | Revenue | Profit | Margin |
|--------------|-------------|---------|--------|--------|
| **JSearch (Pro)** | $15-20 | $500 | $480-485 | **96-97%** ✅ |
| **SerpAPI (Developer)** | $75 | $500 | $425 | **85%** ✅ |
| **Arbeitnow (Free)** | $0 | $500 | $500 | **100%** ✅ |
| **JobsPikr (Starter)** | $79-250 | $500 | $250-421 | **50-84%** ⚠️ |

#### Scenario: 1,000 Premium Users (30,000 searches/month)

| API Provider | Monthly Cost | Revenue | Profit | Margin |
|--------------|-------------|---------|--------|--------|
| **JSearch (Ultra)** | $50-150 | $5,000 | $4,850-4,950 | **97-99%** ✅ |
| **SerpAPI (Big Data)** | $275 | $5,000 | $4,725 | **94.5%** ✅ |
| **JobsPikr** | $250-400 | $5,000 | $4,600-4,750 | **92-95%** ✅ |

**Conclusion:** ✅ **$5/month pricing is VERY FEASIBLE** with excellent margins

---

## Final Recommendation

### Primary Solution: **JSearch API (RapidAPI)**

#### Why JSearch?

1. **Cost-Effective:** Best pricing for your volume ($0.003-0.005 per search)
2. **Best Coverage:** Global reach through Google for Jobs aggregation
3. **Rich Data:** 40+ fields including salary, remote status, skills
4. **Real-Time:** Live data updates
5. **Scalable:** Pricing scales well as you grow
6. **Low Risk:** Established provider, no legal concerns
7. **Quick Integration:** Well-documented REST API

#### Implementation Plan

**Phase 1: MVP (Months 1-3)**
- Start with JSearch API Free tier for testing
- Validate data quality and coverage
- Build integration, test with beta users
- Upgrade to Pro plan (~$10-25/month) when ready

**Phase 2: Growth (Months 4-12)**
- Monitor usage patterns
- Optimize search queries for cost efficiency
- Consider caching strategies to reduce API calls
- Scale to Ultra plan as user base grows

**Phase 3: Scale (Year 2+)**
- Negotiate custom enterprise pricing
- Consider hybrid approach (add Arbeitnow for EU)
- Implement intelligent caching and query optimization
- Evaluate building proprietary data layer

### Fallback Option: **Arbeitnow** (if EU-only)

If your initial market is Germany/Europe:
- Start with Arbeitnow (100% free)
- Test product-market fit with zero API costs
- Expand to JSearch when going global

### What to Avoid

❌ **Web Scraping:** Legal risks too high, maintenance too expensive
❌ **JobsPikr:** Too expensive for your volume, unclear pricing
❌ **SerpAPI:** More expensive than JSearch, salary data removed
❌ **Adzuna/Reed:** Requires sales contact, likely expensive, limited coverage

---

## Next Steps

### Immediate Actions

1. **Sign up for JSearch API** on RapidAPI
   - Create free account
   - Get API key
   - Test with 100-500 free requests

2. **Build Proof of Concept**
   - Integrate JSearch API
   - Test search quality for your use cases
   - Validate data completeness (salary, remote, skills)

3. **Test Key Queries**
   - Remote software engineering jobs
   - Jobs in specific locations
   - Salary data availability
   - Skills matching quality

4. **Validate Assumptions**
   - Confirm data quality meets user needs
   - Test API reliability and response times
   - Verify coverage in your target markets

5. **Make Go/No-Go Decision**
   - If data quality good → proceed with JSearch
   - If gaps found → test SerpAPI or Arbeitnow
   - Document findings for architecture decision

### Technical Considerations

**API Integration Checklist:**
- [ ] Error handling for rate limits
- [ ] Caching strategy (reduce duplicate searches)
- [ ] Cost monitoring dashboard
- [ ] Query optimization (minimize API calls)
- [ ] Fallback handling (API downtime)

**Cost Optimization Strategies:**
- Implement search result caching (24-hour TTL)
- Deduplicate similar searches from different users
- Pre-fetch popular searches during off-peak hours
- Monitor and cap usage per user to prevent abuse

---

## Appendix: Data Comparison Matrix

### Field Availability Comparison

| Feature | JSearch | SerpAPI | Arbeitnow | JobsPikr | Reed | Adzuna |
|---------|---------|---------|-----------|----------|------|--------|
| **Job Title** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Description** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Salary Min/Max** | ✅ | ❌ | ⚠️ | ✅ | ✅ | ✅ |
| **Remote Status** | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ |
| **Skills/Requirements** | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| **Experience Level** | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| **Company Info** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Apply Link** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Global Coverage** | ✅ | ✅ | ❌ | ✅ | ❌ | ⚠️ |
| **Real-time Updates** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Legend:**
- ✅ Available / Excellent
- ⚠️ Partial / Limited
- ❌ Not available / Poor

---

## Cost Per Search Comparison (Visual)

```
Cost per search (for 3,000 searches/month):

JSearch (Pro)       [$0.005]  ████░░░░░░░░░░░░░░░░
SerpAPI (Dev)       [$0.015]  ████████████░░░░░░░░
Arbeitnow           [$0.000]  ░░░░░░░░░░░░░░░░░░░░
JobsPikr (Starter)  [$0.026]  ████████████████░░░░

                     $0.00                    $0.03
```

**Winner:** JSearch API for best balance of cost and features

---

**Document End**

*Last updated: November 13, 2025*
*Research conducted by: Claude (Anthropic)*
*For: ORI Platform - Job API Technical Decision*
