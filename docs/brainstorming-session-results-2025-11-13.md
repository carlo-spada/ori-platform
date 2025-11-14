# Brainstorming Session Results

**Session Date:** 2025-11-13
**Facilitator:** Business Analyst Mary
**Participant:** Carlo

## Session Start

**Chosen Approach:** AI-Recommended Techniques (based on multi-phase project context)

**Context:** Carlo wants to brainstorm around a multi-phase growth strategy for Ori Platform:
1. **Phase 1 (Immediate):** Launch MVP to get first customer payments and feedback ASAP
2. **Phase 2 (Marketing Automation):** Build AI agentic workflows for international marketing - weekly blog/newsletter, then social media campaigns
3. **Phase 3 (Customer Feedback Loop):** System to review, respond to, and integrate customer suggestions
4. **Contingency:** Fall back to existing roadmap on 'journey' page if needed

**Selected Techniques:**
1. Resource Constraints (15 min) - Identify MVP essentials
2. First Principles Thinking (20 min) - Novel AI marketing architecture
3. What If Scenarios (15 min) - Breakthrough customer feedback ideas
4. Assumption Reversal (15 min) - Risk mitigation and pivot strategies

## Executive Summary

**Topic:** {{session_topic}}

**Session Goals:** {{stated_goals}}

**Techniques Used:** {{techniques_list}}

**Total Ideas Generated:** {{total_ideas}}

### Key Themes Identified:

{{key_themes}}

## Technique Sessions

### Session 1: Resource Constraints (Structured)

**Constraint Imposed:** Only 2 weeks and $500 to launch MVP and get first paying customer

**Key Breakthrough:** Don't sell "an AI platform" - sell a concrete outcome

**THE CORE OFFERING:**
**"Ori Clarity Sprint"** - $79-149 one-time payment
- Deliverable: Personalized 90-day plan delivered in 7 days
- Output: 2-3 role hypotheses that fit + 90-day upskilling/job-search roadmap + async check-ins

**Manifesto Alignment:**
- Core purpose → guide to work that fits, not just "find a job"
- Emotional core → thoughtful, loyal mentor (not noisy productivity tool)
- Intelligence model → asks, observes, learns, reflects, outputs plan
- Autonomy → starts as advisor, scales to autonomy later

**MINIMUM VIABLE STACK (What to Build):**

1. **Landing Page** (one page only)
   - Headline: "Find work that fits you, not just your CV"
   - Sub: "Ori builds you a 90-day personalized upskilling + job search plan in 7 days"
   - 3 bullets tied to manifesto
   - Social proof: "Founding Cohort / Pilot"
   - Strong CTA: "Join the first cohort – limited spots"

2. **Payment System**
   - Stripe Checkout or Lemon Squeezy
   - One product: Ori Clarity Sprint (one-time payment)
   - Redirect to intake after payment

3. **Onboarding Experience** (Typeform/Tally/simple Next.js form)
   Questions aligned with "seeks to understand why a person chooses":
   - Background (studies, experience, skills enjoyed/hated)
   - Constraints (location, income floor, hours, remote preference)
   - Energy/preferences (solo vs team, creative vs analytical, stable vs fast-changing)
   - Emotional state (burned out? lost? ambitious but directionless?)
   - Time available per week
   - Final Ori-style prompt: "Describe the life you're hoping this next role takes you toward"

4. **Lightweight "Ori Brain"**
   - Notion template or simple internal tool
   - LLM-assisted (scripted) to generate:
     - 2-3 roles that fit
     - Skill gap identification
     - 12-week structured plan:
       * Weeks 1-4: exploration & foundational skills
       * Weeks 5-8: focused upskilling & portfolio building
       * Weeks 9-12: applications, networking, iteration
   - Output structure:
     * Page 1: "Who Ori thinks you are (right now)" - mirrored identity
     * Page 2: "Roles that fit you & why"
     * Page 3: "Your 90-day plan"
     * Page 4: "How Ori will keep you on track"
   - Deliver as: Beautiful PDF/ email / mini dashboard

5. **Two Mentor-Style Touchpoints** (via email)
   - Day 3-4: "Ori is processing... Quick question: income stability or experimentation?"
   - Day 7: Delivery email + optional async Q&A (3 questions allowed for plan refinement)

**CUT COMPLETELY (for now):**
- ❌ Continuous always-on agent across devices
- ❌ Real-time labor market scraping
- ❌ Multi-user org dashboards (schools/companies)
- ❌ Fancy gamification, streaks, XP, levels
- ❌ Native mobile apps
- ❌ Full autonomy (auto-applying, LinkedIn management)

**FAKE/WIZARD-OF-OZ:**
- ✨ "AI intelligence" → curated/scripted LLM prompts for personalization
- ✨ "Role database" → curated list of x number of archetypal roles (map users to these)
- ✨ "Personalized tracking" → scheduled emails (using resend api)

**POSTPONE (until after first paying users validate the concept):**
- ⏸️ Persistent "digital aura" tracking behavior over months/years
- ⏸️ Real-time job board integration & skills taxonomies
- ⏸️ Automated recurring check-ins via app/LLM agents
- ⏸️ Multi-modal signals (calendar, study apps, coding platforms)
- ⏸️ Employer-facing side (role-specs, fit suggestions, dual advocacy)

**BRUTAL SUMMARY (V1 - REVISED):**
~~MVP = One paid offering (Ori Clarity Sprint) + landing page + payment + intake form + AI-assisted personalized 90-day plan + 1-2 caring follow-ups.~~

**ITERATION & PIVOT:**

Carlo refined the MVP concept based on further reflection. The new approach shifts from:
- **Old:** One-time "Clarity Sprint" service (advisory/consulting model)
- **New:** AI-driven job matching platform (ongoing product model)

---

**REVISED MVP CONCEPT:**

**Core Promise:** "Ori finds and delivers personalized, high-fit job matches for you."

**User Experience Flow:**
1. User creates profile → shares skills, constraints, preferences
2. Ori works in background (AI + research)
3. User receives curated list of opportunities with explanations of fit

**Key Positioning Elements:**

**What You CAN Promise (Public Story):**
- **Outcome:** Personalized, high-fit job matches delivered
- **Mechanism:** "AI + targeted research to understand your profile and search the market"
- **Experience:** Request search → Ori works → get curated list with fit explanations

**What NOT to Claim (Red Lines):**
- ❌ "Proprietary models trained on millions of resumes" (if just using LLM API)
- ❌ "We search every job on the internet"
- ❌ "Guaranteed fit" or "Guaranteed job in 30 days"

**Safe, Honest Language:**
✅ "Ori combines AI and targeted research to surface roles that closely match your profile."
(True now with LLM agentic searches; still true when 80% automated)

**Suggested Copy Framework:**

**Landing Page "How It Works":**
1. **Tell Ori who you are**
   - Create your profile, share your skills, constraints, and what you're looking for
2. **Ori searches on your behalf**
   - Ori uses AI to scan opportunities and filter out roles that don't fit your profile, goals, or boundaries
3. **Get curated matches, not noise**
   - You receive a small set of handpicked roles with clear at-a-glance cards to giv you a glimpse on why they fit you.

**FAQ: "How does Ori find my matches?"**
> Ori uses a combination of AI and focused research to find roles that fit your skills, constraints, and preferences.
> It analyzes your profile, compares it to real job opportunities, and then surfaces a small number of matches with explanations of why they might be a good fit.
> We prioritize quality over quantity — fewer, better matches instead of endless scrolling.

**For Accelerator/Investor Pitch:**
> Ori is an AI-driven job matching app. Users create a profile and request "deep searches". For each search, Ori uses AI to analyze the user's skills, constraints, and preferences, then searches the market for relevant roles and returns a small set of high-fit matches with explanations. In the MVP, we use a large language model and structured workflows to deliver this experience, then gradually increase automation as we learn from early users.

**Strategic Insight:**
"We don't owe users a blueprint of your stack. We owe them clarity on what outcome they're buying and honesty about the nature of the system. The internal details can evolve wildly while the story 'AI job-matching that actually understands you' stays stable."

---

**IMPLEMENTATION DETAILS (Refined):**

**1. Monetization Model - Freemium Subscription Tiers:**

| Tier | Price | Deep-Research Searches | Job Matches | Strategy |
|------|-------|----------------------|-------------|----------|
| **Free** | $0 | 1/month | Up to 2/month | Cheap marketing - users become advocates |
| **Plus** | $5/mo or $48/yr | Up to 4/month | Up to 8/month | Core revenue tier |
| **Premium** | $10/mo or $96/yr | 30/month (1/day) | Up to 180/month | Power users |
| **Lifetime Premium** | $299 one-time | Unlimited | Unlimited | Early adopter special |

**2. Search Configuration - User Choice:**
- Users select matches per search: **2, 4, or 6 matches**
- Must stay within monthly quota limits
- Free: 1 search/month
- Plus: 4 searches/month and up to 8 matches/month
- Premium: 30 searches/month (1/day) and up to 180 matches/month.

**3. Turnaround Time Strategy:**

**Internal Reality:**
- Automated pipeline typically runs in **15-30 minutes**

**User Promise (UI/Copy):**
- "Ori usually completes searches in under an hour"
- FAQ safety net: "Within 24 hours"

**UX Benefit:**
- Feels "living, active, AI-powered" (not batchy/sluggish)
- Room for API quirks, rate limits, LLM variability
- Show "Search in progress..." status on dashboard
- Email notification when complete: "Your 'Data Analyst in EU' search is ready. Ori found you 4 matches today."

**4. Deliverable Format:**

**Primary: In-App Dashboard** (`/searches/<search_id>`)

Each search result page shows:
- **Title:** "Search: Mid-level Data Analyst – Remote-Friendly Europe"
- **Status pill:** "Completed · 4 matches found"
- **Match cards** (each with):
  - Job title + company
  - Location / remote status
  - Tags (e.g. "Hybrid", "Junior/Mid", "Python, SQL", 150,000$/year, etc.)
  - **"Why Ori picked this for you"** explanation:
    > "Matches your 3+ years in analytics, Python/SQL stack, remote preference, and interest in SaaS products."
  - Link: "View job"

**Secondary: Email Summary**
- Subject: "Ori found 4 new matches for your search: 'Data Analyst in EU'"
- Body: Short summary + top 2 jobs with links + CTA button
- Button: "View all matches in your Ori dashboard"
- Benefit: Users feel "Ori did work for me" even if they don't immediately log in

**No PDFs. No reports.** (Heavy and un-interactive)

---

**5. MINIMAL VIABLE TECHNICAL STACK:**

**Frontend / App Shell (Next.js)**
- Marketing site: `/`, `/pricing`, `/about`
- App routes (subdomain):
  - `app.getori.app/dashboard` – list of searches
  - `app.getori.app/profile` – user profile + preferences form
  - `app.getori.app/recommendations` – tba
  - `app.getori.app/settings` – users' settings
- **Auth:** Clerk / Supabase Auth (email login for MVP)

**Backend / API (Next.js API routes OR FastAPI)**

Core responsibilities:
1. **User profile CRUD** - Store profile JSON in Postgres
2. **Search request creation** - `POST /searches`
   - Validates quota for current plan
   - Creates search row with status `pending`
3. **Search processing worker** (cron job or lightweight worker)
   - Runs every 10 minutes, checks pending searches
   - For each pending search:
     1. Build query from profile + search config
     2. Call job API (one or two sources)
     3. Get ~50-200 raw postings
     4. Chunk + send to LLM with profile
     5. Get scores + reasoning from LLM
     6. Pick top N matches
     7. Store in `matches` table
     8. Update `search.status = 'complete'`
4. **Matches API** - `GET /searches/:id` returns search with matches
5. **Stripe webhooks** - `POST /webhooks/stripe` updates user plan

**Storage (Postgres via Supabase)**

Tables:
- `users` (id, email, plan, searches_used_this_month, etc.)
- `profiles` (user_id, profile_json)
- `searches` (id, user_id, query_text, status, created_at, completed_at)
- `matches` (id, search_id, job_title, company, location, url, fit_score, reason_text, raw_job_json)

**No Redis, Kafka, or microservices needed at MVP.** One DB, one backend, one worker loop.

**External Integrations:**
- **LLM API** - Single provider (OpenAI/Anthropic/Gemini)
- **Job source** - LLM decides which sources are more relevant for each candidate
- **Stripe** - 3 products (Free, Plus, Premium) + hosted checkout pages or embeddings

---

**6. FINAL MVP SUMMARY:**

**The Thinnest Slice of "Ori as an Autonomous Job-Matching and Career Advice Guide":**

✅ **Business Model:** Freemium subscription (Free/Plus/Premium tiers)
✅ **Core Mechanic:** Deep-research searches return 2-6 curated matches
✅ **Turnaround:** Fully automated, <1 hour (aiming for minutes)
✅ **Deliverable:** In-app dashboard + email summary
✅ **Tech Stack:**
- Next.js app + auth
- Postgres (Supabase)
- One backend service (Next API or FastAPI)
- Simple worker loop
- One job API + one LLM API
- Stripe for plans and quotas

**This is real. This can ship in 2 weeks.**

---

### Session 2: First Principles Thinking (Creative)

**Goal:** Strip away assumptions about "how marketing works" and rebuild AI automation from fundamental truths

**Question Posed:** Forget tactics (blogs, newsletters, social media). At the physics level, what is international marketing actually trying to accomplish for Ori?

---

**FUNDAMENTAL BEHAVIOR SHIFT:**

**From (Current State):**
- Treat jobs as commodities ("I just need something that pays enough")
- Treat job search as episodic panic ("I scroll boards when I'm desperate")
- Treat tools as utilities, not companions ("LinkedIn is a CV graveyard I occasionally poke")

**To (Ori State):**
- Treat fit as non-negotiable ("I deserve work that actually matches who I am")
- Treat job search as ongoing, low-friction background process ("Ori is always watching the market for me")
- Treat Ori as a trusted agent, not just another board ("I offload the search and early filtering to Ori")

**Core Behavior Transformation:**
> From "I manually grind through chaos when I have to"
>
> To "I delegate the search and matching to an AI that actually understands me, all the time."

---

**THREE BELIEFS REQUIRED BEFORE PAYMENT:**

**(a) "Better-fitting work is real and possible for me"**

Not "dream job" fantasy, but:
> "There are roles out there that match my skills, constraints, and values better than what I have now."

Two-part belief required:
- **Hope:** "Something better exists"
- **Agency:** "I can actually move towards it"

Without this: Ori is just a toy.

---

**(b) "The current system is noisy, biased, and wasteful"**

Need mild, accurate disgust with the default:
- Endless scrolling
- Ghosting
- Irrelevant recommendations
- Jobs that look good on paper but feel dead inside

**Felt conclusion:**
> "The way I'm searching now is inefficient and misaligned. I'm wasting time, energy, and chances."

Marketing's job: Not to scream "everything is broken," but to gently make their current process look obviously dumb compared to delegating it.

---

**(c) "An AI agent can understand me well enough to help"**

The big trust bridge.

They don't need to know *how* Ori works.

They DO need to feel:
- "This thing can take my messy story, constraints, and preferences..."
- "...and return options that genuinely feel like 'me'."

**Emotional state before paying:**
> "This feels like a mentor-in-software I can safely lean on, and the cost is trivial compared to what's at stake."

---

**THE IRREDUCIBLE CORE OUTCOME:**

Not impressions. Not followers. Not even sign-ups.

**The irreducible outcome is:**
> A human voluntarily hands Ori enough trust and information that it can start acting as their job-matching agent — and is emotionally prepared to let it influence their decisions.

**Concretely:**
- They understand what Ori does in one sentence
- They resonate with why it exists ("fulfillment shouldn't be a privilege")
- They trust it enough to:
  - Create a profile (share real constraints, not performative LinkedIn fluff)
  - Request a search
  - Either:
    - Pay immediately, OR
    - Use free → experience "this is different" → then pay

Everything else is scaffolding to get that moment.

---

**THE FUNDAMENTAL FORCE (Physics Model):**

Current reality:
- **World of jobs:** High entropy (chaotic, noisy, overwhelming)
- **Human:** Low bandwidth (limited time, attention, emotional resilience)
- **Ori:** A field that:
  - Lowers the energy cost of seeking better work
  - Raises the perceived payoff of seeking better work
  - Provides a believable path between the two

**The force being applied:**
> **Trust-powered reduction of career uncertainty**

**How marketing applies this force:**

1. **Make current state feel unstable and wasteful**
   - "I shouldn't just drift or doomscroll jobs"

2. **Make the Ori state feel stable and sane**
   - "I have an intelligent agent watching the market for me, tuned to who I am"

3. **Make the jump feel safe and obvious**
   - "All I have to do is sign up, tell Ori who I am, and it starts working"

**Key Insight:**
> Channels are just different ways of applying the same force in different mediums and cultures.
>
> The invariants are: **change the behavior, install the beliefs, earn the trust to act on their behalf.**

---

**AI MARKETING AGENT AS FIELD GENERATOR:**

Treat the AI marketing agent like a **field generator, not a copy monkey.**

**Core Principle:** Think in "content primitives," not "content formats" (blog/post/email are just containers)

---

**THE THREE CONTENT PRIMITIVES:**

At the physics level, people need to repeatedly encounter 3 types of information:

1. **Contrast** – "My current way of job searching is dumb/fragile/expensive in ways I hadn't fully seen"
2. **Alternative** – "There is a clearer, more stable way to do this, and Ori embodies it"
3. **Bridge** – "Switching to that way is low-risk, almost obvious, and I understand what happens if I say yes"

**AI Marketing Agent's Job:**
> Generate, adapt, and recombine these three primitives over and over

---

**A. CONTRAST FRAMES** (Making the current state feel wasteful)

**Purpose:** Reframe their status quo

**Artifact Types:**
- **Micro-scenarios** (3-5 sentences)
  - "Day in the life" of current job search:
    - Doomscrolling 3 job boards
    - Applying blind
    - Getting ghosted
    - Emotionally exhausted

- **Simple cost calculators**
  - "If you spend 3 hours/week on job boards, that's ~150 hours/year. How many of those hours produced anything?"

- **Failure pattern spotlights**
  - "You only search when you're desperate → take whatever shows up → back here in 18 months"

**Container agnostic:** Could be DM, landing page section, in-app tooltip

**The primitive is:** "Your current process is leaking energy in ways you can't ignore anymore"

**AI Operation:**
```
CONTRAST_GENERATION(user_segment, culture)
→ small set of stories/stats/frames that highlight waste
```

---

**B. STABILITY MODELS** (Making the Ori state feel stable)

**Purpose:** Answer "If I let Ori into my life, what does my world look like?"

**Artifact Types:**
- **Ori-as-habit scenarios**
  - "Once you've set up your profile, you don't 'job search' anymore. Ori just runs deep searches when you ask, and you only see curated matches."

- **Visual process explanations** (even in text)
  - "You → Profile → Deep Search → Curated matches. No doomscrolling. No randomness."

- **Longer-term identity shift**
  - "Instead of reacting to layoffs or burnout, you become the person whose agent is always scanning the horizon for you."

**The primitive is:** Make them feel that life-with-Ori is more predictable, lighter, and sane

**AI Operation:**
```
STABILITY_MODELING(user_segment, culture)
→ narrative of "life with Ori" over weeks/months
```

---

**C. SAFETY BRIDGES** (Making the jump feel safe)

**Purpose:** Risk reduction and clarity on the first step

**Artifact Types:**
- **On-ramp explanations**
  - "What happens if you sign up today?" (3-5 steps, human language, no fluff)

- **Risk-slicing offers**
  - "1 free deep search this month, no credit card"
  - "We'll only email you when there's a match"

- **Trust tokens** (specific, not generic)
  - What Ori WON'T do: sell data, spam, apply without consent
  - Where they can quit safely: delete profile, cancel subscription easily

**The primitive is:** "Your downside is tiny, your upside is meaningful, and you know the next move"

**AI Operation:**
```
BRIDGE_DESIGN(user_segment, culture)
→ micro-offers, next-step scripts, safety explanations
```

---

**INTERNATIONAL = CULTURAL ADAPTATION, NOT TRANSLATION**

Different pain stories, aspirations, risk tolerances, and tech expectations across cultures.

**A. Localizing Contrast Frames**

Waste looks different by region:
- Region A: "Endless unpaid overtime and toxic cultures"
- Region B: "Visa precarity and constant risk of losing residency"
- Region C: "Family expectations and prestige of certain titles"

**AI Operation:**
```
Map "job search is chaotic and wasteful"
→ into the specific flavor of pain that resonates locally
```
Same operation, different ingredients.

---

**B. Localizing Stability Models**

Different definitions of "stability":
- Culture A: Salary + benefits + brand name
- Culture B: Time freedom + remote + flexible work

**AI needs:**
- Belief map per region: what "good work" looks like
- Generate Ori-state narratives matching those values

**Examples:**
- Region A: "Less chaos, more prestige-aligned matches"
- Region B: "Less chaos, more remote + flexible life design"

Same engine, different emphasis.

---

**C. Localizing Safety Bridges**

Fears shift by culture:
- "Is this legitimate, or a scam?"
- "Will this affect my current employer?"
- "Is my data safe from the government?"
- "Is AI morally okay here?"

**AI must adapt:**
- Which fears to pre-empt
- Which proof tokens to show (local payment methods, testimonials, regulatory language)

**AI Operation:**
```
CULTURAL_ADAPTATION(artifact, culture)
→ variant that preserves the force but obeys local norms and fears
```

---

**THE REPEATABLE WEEKLY AI MARKETING CYCLE:**

Not "this week's newsletter" - think **weekly force-application cycle**

**Step 1: SENSE**
```
SENSE_MISALIGNMENT()
→ "Where are people not yet believing 1, 2, or 3?"
```

Pull:
- Recent user signups (by region/segment)
- Drop-off points (bounced at profile? at pricing?)
- Common questions from support/chat/site search

**Example diagnostics:**
- Many bounce at pricing? → Don't feel safe about the jump
- Many never start a search? → Don't believe Ori-state is real/useful

---

**Step 2: DIAGNOSE**
```
FORCE_DIAGNOSIS(segment)
→ {contrast, stability, bridge} priority
```

For each segment/country:
- Need more contrast? (don't feel current state is bad)
- Need more stability? (don't see Ori as strong/serious enough)
- Need more safety? (hesitate at signup/payment)

---

**Step 3: GENERATE PRIMITIVES**
```
GENERATE_PRIMITIVES(segment, force_type, culture)
```

For each segment & force type, generate:
- N new contrast frames
- N new stability models
- N new safety bridges

Manifests as:
- 3 micro-scenarios
- 2 "life with Ori" sequences
- 2 "on-ramp clarity" scripts

---

**Step 4: MAP TO CONTAINERS**
```
CONTAINER_MAPPING(primitive)
→ "this becomes a snippet here, a script there, a tooltip over there"
```

Only NOW choose containers. Same primitive, multiple surfaces:
- This contrast frame becomes:
  - 10s script for short video
  - 3-line in-app nudge
  - Support macro response

**AI doesn't think "write a blog"**

**AI thinks:**
> "I have a contrast frame. Where are surfaces this week that touch this segment? Let's push variants there."

---

**Step 5: MEASURE & REFINE**
```
FEEDBACK_INGEST()
→ update weights on which primitives to generate more of
```

Watch what moves:
- Did more users start a search?
- Upgrade from free to paid?
- Complete their profile?

**System learns:**
- "This type of contrast lands well in Germany, badly in Brazil"
- "This safety bridge works great for students but not for senior engineers"

---

**THIS IS AGENTIC MARKETING AUTOMATION:**

**Not automating posts.**

**Automating the application of psychological force toward the Ori state.**

---

**FINAL ABSTRACTION:**

An AI marketing agent for Ori doesn't "do content."

**It continuously generates and localizes three kinds of evidence:**
1. Evidence that your current behavior is wasteful
2. Evidence that a delegated, AI-assisted job search is more stable
3. Evidence that trying Ori is safe, reversible, and worth it

**The primitives:** Contrast, Stability, Bridge

**The operations:** Sense, Diagnose, Generate, Map, Measure

**The containers:** Blogs, videos, in-app flows, emails — just skins on this deeper loop

---

### Session 3: What If Scenarios (Creative)

**Goal:** Explore radical possibilities for customer feedback system beyond "a form where users submit suggestions"

**Core Question:** What if customers weren't just giving feedback - what if they were co-creating Ori?

---

**BREAKTHROUGH CONCEPT:**

Fusion of Scenario 1 (AI-prioritized suggestions) + Scenario 4 (Real-time AI responses)

**Not a feedback system. A second intelligence layer:**
> "Ori learning how to become a better Ori"

---

**THE VISION: REAL-TIME AI-POWERED CO-EVOLUTION**

Every customer suggestion is:
1. Ingested automatically
2. Scored on impact / feasibility / manifesto-alignment
3. Surfaced back to user in real-time with transparent reasoning

---

**1. THE ROADMAP BECOMES A SHARED OBJECT**

**Old model:** Hidden spreadsheet ("Maybe later", "Q4 if we survive", "LOL no")

**New model:** Living, user-visible probability field

Each idea displays:
- **Priority score** (e.g., 78/100)
- **Rationale:** "High impact for students; requires X infrastructure; aligned with 'fulfillment should be scalable'"
- **Tags:** "Roadmap Candidate: Matching Engine"

**Result:**
> The roadmap transforms into a real-time conversation between user needs, technical constraints, and Ori's philosophy

**Effect:**
> Ori stops being "a black box app" and becomes "a system we're all training together"

---

**2. SUGGESTIONS BECOME HYPOTHESES ABOUT HUMAN FULFILLMENT**

**Not just:** "Can you add dark mode?"

**But:** Scientific hypotheses:
- "What if Ori also considered X when matching jobs?"
- "What if Ori could nudge me before I hit burnout?"
- "What if Ori learned from my 'no' clicks too?"

**Every suggestion is implicitly:**
- A theory about human fulfillment, OR
- A theory about how an AI agent should behave on your behalf

**Transformation:**
> Your system isn't just taking feature requests; it's **crowdsourcing theories of meaningful work** and running them through an AI filter

---

**3. AI AS GUARDIAN OF THE MANIFESTO**

**AI explicitly scores on three dimensions:**

**a) Impact**
- Does this meaningfully improve job fit, clarity, or user agency?

**b) Feasibility**
- Does this explode infrastructure / security budget?

**c) Alignment**
- Does this move Ori closer to "fulfillment at scale"?
- Or does it make us just another growth-hack toy?

**Role:** AI acts as **"philosophical bouncer at the door of the roadmap"**

---

**NEW BEHAVIORS EMERGE:**

**Example A: High impact, Low alignment**
- Suggestion: Gamification / daily streaks
- Score: "This could increase engagement, but it turns Ori into a slot machine. We say no."

**Example B: High alignment, Lower growth**
- Suggestion: Features for underrepresented groups or noise reduction
- Score: "This helps fulfill mission even if it doesn't juice metrics. Roadmap candidate."

**Result:**
> Users can see the **values of Ori operationalized in real time**

**Transformation:**
> The manifesto stops being pretty text and becomes **an algorithmic constraint**

---

**4. CONTINUOUS CO-EVOLUTION LOOP**

**The System:**

**Step 1: Ingest**
- User submits idea

**Step 2: AI Analysis**
AI generates:
- Priority score
- "Why this matters" explanation
- Possible smaller, testable slices of that idea

**Step 3: Experimentation**
Best slices become:
- A/B tests
- Limited cohort experiments
- Instrumented for metrics: Did this increase match quality / satisfaction / retention?

**Step 4: Learning**
Results flow back into:
- The model (what kinds of ideas tend to work)
- The UI (users see "This class of ideas is usually powerful")

**The Wild Bit:**
> Ori is not only matching **humans ↔ jobs**;
>
> It's also matching **ideas ↔ reality** in a continuous experiment

**Identity Shift:**
> Your users aren't just "customers giving feedback."
>
> They're **co-scientists in a long-running experiment about meaningful work.**
>
> The AI is the lab assistant that keeps things tidy, honest, and aligned.

---

**5. THE USER EXPERIENCE**

**What users feel:**
- ✅ "When I share an idea, Ori actually listens"
- ✅ "I see immediately whether it's plausible and aligned"
- ✅ "I learn how the system thinks, not just what it does"
- ✅ "I'm not yelling into a void; I'm participating in how this thing grows"

**Emotional contract:**

**OLD:**
> "Fill out this form and maybe someone will read it before the heat death of the universe"

**NEW:**
> "There's an intelligence on the other side of the screen that isn't just serving me – it's **evolving with me**"

**Meta-connection:**
> This is the "digital aura" metaphor from the manifesto, but applied at the **platform level** instead of just the individual level

---

**WILD EXPANSION: USER CO-CREATION PHASE**

**Concept:** Every feature must "pass through" user co-creation before going global

**The Process:**

1. **AI Pattern Detection**
   - Watches patterns in suggestions + behavior
   - Identifies struggle points

2. **Proactive Proposal**
   - AI: "I've noticed many users struggling with X. Here's a prototype idea: Y."

3. **Co-Design Loop**
   - Subset of advanced/early users see prototypes
   - Question: "Would this actually help you? How would you tweak it?"
   - Their input is scored and fed back into design

4. **Iteration Before Production**
   - Only after co-design loop does feature hit production for everyone

**Result:**
> Features are not just "shipped at users."
>
> They're **negotiated between AI, humans, and the manifesto.**

---

**THE DELICIOUS RECURSION:**

**Ori becomes:**
- A job-matching agent **for individuals**, AND
- A feature-matching agent **for itself**

---

**FINAL SYNTHESIS:**

**Primary Direction:**
> Scenario 1 as a **"living AI-powered roadmap"** that enforces the manifesto and treats user suggestions as **scientific hypotheses about human fulfillment**

**Enhancement Layer:**
> Add Scenario 4 (AI explains itself to users) to make the whole thing feel **transparent, teachable, and emotionally satisfying** - not just "smart"

**Core Innovation:**
> Transform feedback from **reactive collection** to **proactive co-evolution**

---

### Session 4: Assumption Reversal (Deep)

**Goal:** Challenge the assumption "stick to roadmap if co-evolution fails" and explore risk mitigation

**Core Reversal:** What if customer co-evolution proves MORE valuable than your planned roadmap? What if the "contingency" becomes the main plan?

---

**1. FLIP THE DEFAULT: ROADMAP = HYPOTHESIS, CO-EVOLUTION = CONTROL LOOP**

**Original World:**
- Roadmap = main plan
- Customer co-creation = contingency / feedback spice

**Reversed World:**
- Customer co-evolution = **main steering mechanism**
- Roadmap = **guardrails + non-negotiables** (core engine, infrastructure, philosophy)

**Constitutional Model:**
- **Manifesto + Architecture** = Constitution (unchangeable foundation)
- **Roadmap** = "Laws we currently think are good" (revisable)
- **Co-evolution system** = Democracy + experimentation constantly revising those laws

**New Principle:**
> "Stick to the manifesto and core engine even if co-evo goes weird, but **assume co-evo is the default way we discover what to build next.**"

---

**2. EMPIRICAL SCENARIO: CO-EVOLUTION OUTPERFORMS ROADMAP**

**Imagine you ship:**
- Minimal, solid matching engine
- Visible, AI-mediated suggestion + experiment system
- Small set of founder-driven roadmap features

**Then you observe:**

**Features born from user proposals + AI triage:**
- ✅ Increase match satisfaction more
- ✅ Retain users longer
- ✅ Unlock meaningful differentiators (niche constraints you hadn't thought of)

**Roadmap-only features:**
- ⚠️ Look elegant in Notion
- ⚠️ Don't move core metrics as much

**Rational Conclusion:**
> "Our users + AI are better at discovering what improves their fulfillment than we are alone."

**Design Implication:**
> You need a system where co-evo wins by design, not by accident. The roadmap becomes something the co-evo system can rewrite.

---

**3. FLEXIBLE PIVOT MECHANISMS: SAFELY LETTING CO-EVO TAKE OVER**

**A. CAPACITY BUCKETS (Dynamic Allocation)**

**Explicit build capacity budget:**
- 40% – Core roadmap (matching engine, infra, non-negotiables)
- 40% – Co-evolved features (user + AI suggested, experiment-driven)
- 20% – Tech debt / polish / housekeeping

**Pivot Rule:**
> If co-evolved features consistently outperform roadmap features on key metrics (match satisfaction, retention, NPS, etc.) for X months
>
> → Shift buckets (e.g., 60% co-evo, 25% roadmap, 15% infra)

**Result:** Co-evo can become the main plan **systematically, not by vibes**

---

**B. ORIGIN-AGNOSTIC PRIORITY SCORING**

**Unified scoring model for ALL ideas (founder + user):**

**Dimensions:**
1. **Impact on:**
   - Match quality / satisfaction
   - Long-term retention
   - "Fulfillment at scale" (mission)

2. **Feasibility / complexity**

3. **Manifesto alignment**
   - No dark patterns
   - No bullshit growth hacks

4. **Strategic leverage**
   - Helps future features?
   - Strengthens infrastructure?

**Process:**
- Founder idea: "Add X feature" → scored
- User idea (AI-filtered): "What if Ori did Y?" → scored

**Rule:**
> If a user idea beats a roadmap item on the same scoreboard → it goes ahead in line

**Transformation:**
> The roadmap is no longer "the list of founder ideas."
>
> It's **"the list of top-scoring ideas, regardless of origin."**

**This is how you mathematically let co-evo win when it should.**

---

**C. FEATURE LIFECYCLE (Welcomes Experiments, Protects Coherence)**

**Four-stage lifecycle to avoid "Franken-Ori":**

1. **Explore** – Cheap experiments, small cohorts only
2. **Incubate** – Promising, being refined, still optional
3. **Standard** – Part of default experience for most users
4. **Legacy** – On its way out

**Rules:**
- Co-evolved ideas start in **Explore/Incubate**
- Only X features in Explore at a time (prevents chaos)
- **Graduation to Incubate:** Must beat baseline on defined metrics
- **Graduation to Standard:** Must be:
  - Consistent with Ori UX
  - Sustainable infrastructure-wise
  - Aligned with manifesto

**Result:**
> User-driven ideas can change the main product, but only after they **prove themselves and survive the manifesto filter**

---

**D. EXPLICIT PIVOT TRIGGERS (Not Feelings-Based)**

**Trigger A: Co-Evo Dominance**

IF co-evo features originated from users in last 3 months:
- Account for ≥50% of match-satisfaction improvement AND
- ≥50% of new revenue uplift

THEN tilt capacity toward co-evo for next quarter

---

**Trigger B: Roadmap Underperformance**

IF 3 consecutive roadmap epics deliver <30% of expected impact

THEN:
- Pause new roadmap bets
- Run "roadmap reset" driven by:
  - User idea clustering
  - AI-identified gaps
  - Manifesto review

**Purpose:** These triggers let the contingency become the main path **when reality proves it should**

---

**4. RISK MITIGATION: CO-EVO WITHOUT LOSING YOUR SOUL**

**Risk A: Feature Soup / Random UX**

**Mitigations:**
- Hard limit on concurrent experiments
- Strong design system + UX principles as constraints
- Require graduating features to fit coherent flows

---

**Risk B: Power-User Capture**

**Problem:** 200 hyper-online tech bros steering Ori away from broader humanity

**Mitigations:**
- **Segment feedback by:**
  - Geography
  - Career stage
  - Job type
  - Plan tier (free vs premium)
- **Require:** Impact across diverse segments before feature becomes Standard
- **Give extra weight to:**
  - Underrepresented segments
  - Strategic segments (early-career, non-English speakers)

---

**Risk C: Drift from Manifesto / Ethics**

**Dangerous:** Users might ask for stuff that "works" but violates philosophy
- Spammy outreach
- Over-automation of human signaling
- Creepy data usage

**Mitigations:**

1. **Make manifesto alignment an explicit scoring axis**

2. **Red List of Disallowed Feature Motifs:**
   - Manipulation
   - Coercive gamification
   - Deceptive presentation of AI vs human

3. **Periodic Philosophy Audit:**
   - Sample features
   - Check against:
     > "Does this increase human agency and fulfillment, or just optimize for clicks / short-term outcomes?"

**Critical Insight:**
> Your brand voice + manifesto become not just marketing but **legally binding physics in your system**

---

**5. IF THE CONTINGENCY IS THE MAIN PLAN**

**Ori becomes:**
- **A core engine** (matching + personalization)
- **Wrapped in a living skin** of features that are continually:
  - Proposed by users + AI
  - Evaluated by metrics + philosophy
  - Upgraded / downgraded via lifecycle gates

---

**FOUNDER ROLE TRANSFORMATION:**

**From:**
> "Enforce the roadmap"

**To:**
> "Define the invariants (manifesto, engine, ethics), design the evolutionary rules, and intervene only when evolution drifts away from the kind of future you're trying to build"

---

**ALIGNMENT WITH MANIFESTO:**

This is very on-brand with the "digital aura" / Demerzel-like guardian vibe:
> You're not micromanaging features
>
> You're **shaping the rules of an ecosystem that co-evolves with its users**

---

**FINAL ZOOM-OUT:**

**You're not just building a job product.**

**You're building a system that:**
- Learns—together with its users—what good work looks like
- Then rewrites itself accordingly

**This is the ultimate expression of:**
> "Fulfillment shouldn't be a privilege"

Because the system itself is designed to discover, test, and implement what fulfillment actually means **in practice, not just theory.**

{{technique_sessions}}

## Idea Categorization

### Immediate Opportunities

_Ideas ready to implement now_

**A. Core MVP Stack & Business Model**
- ✅ Freemium subscription model (Free/Plus/Premium with search quotas)
- ✅ User profile + preferences system
- ✅ "Deep search" request system
- ✅ Job API + LLM ranking → 2-6 curated matches per search
- ✅ Results delivery: `/searches/[id]` dashboard + email summary
- ✅ Stripe integration for plan management + quota enforcement

**Impact:** This is the most directly actionable outcome. Ship this and you have a real, testable loop.

---

**B. Marketing Force Primitives (Instead of "Channels")**

Apply immediately to landing page, emails, in-app copy:

**Contrast Frames:**
- Short narratives making current job search feel wasteful
- Example: "Doomscrolling job boards when you're already burned out"

**Stability Models:**
- "Life with Ori" explained in simple loops
- "Profile once → deep searches when you want → only see curated matches"

**Safety Bridges:**
- Very clear explanation of:
  - What happens when they sign up
  - What WON'T happen (no auto-applying, no spam)
  - That they can safely walk away

**Impact:** Copy/UX decisions applicable today to website and onboarding

---

**C. Simple Suggestion → AI Reply Loop (Scenario 4 "Lite")**

Not the full co-evo system yet. Just:
- Feedback form in-app: "Have an idea for Ori?"
- Pipe each suggestion into LLM that returns:
  - "This is interesting because..."
  - "Here's the constraint..."
  - "Here's a simpler variant..."
- Send personalized response to user (manual trigger initially OK)

**Benefits:**
- Kills the "feedback black hole" feeling
- Starts training how Ori talks about product decisions

---

### Future Innovations

_Ideas requiring development/research_

**A. AI-Scored, Manifesto-Aware Idea Triage (Scenario 1)**

Every suggestion receives:
- Impact estimate (on match quality/retention)
- Feasibility estimate
- Manifesto alignment score

User sees:
- Priority score
- Short rationale

**Enables:**
- Visible roadmap feed (both founders and users see)
- AI as philosophical bouncer for features

**Prerequisites:**
- Solid idea schema
- Historical data to train/calibrate scoring
- UI space to display results

---

**B. Weighted Community Voting (Scenario 2)**

Users vote on suggestions with weight based on:
- Tenure
- Usage frequency
- Plan tier (Premium gets slightly more weight)

**Solves:**
- Drive-by "Product Hunt tourists" hijacking direction
- Makes early adopters & power users feel genuinely influential

**Requires:**
- Abuse prevention mechanisms
- Ensuring no overfitting to one loud segment
- Transparent but non-controversial weighting design
- Enough users and suggestions to justify crowdsourced sorting

---

**C. Rewarding Implemented Suggestions with Real Value (Scenario 3)**

When an idea ships, the suggester gets:
- Premium time extension
- Extra searches
- Lifetime credits

**Benefits:**
- Encourages quality feedback (not random wishlists)
- Creates sense of co-ownership

**Prerequisites:**
- Solid tracking: suggestion → spec → shipped feature
- Clear rules to avoid drama ("I suggested this 6 months ago, where's my reward?")

**Timing:** Fantastic v2/v3 move when ready to formalize co-creation

---

**D. Co-Evolution as Formal Product Process**

Full implementation of:
- **Capacity buckets** (40% roadmap, 40% co-evo, 20% infra)
- **Unified scoring** (founder ideas vs user ideas on same scoreboard)
- **Feature lifecycle:** Explore → Incubate → Standard → Legacy
- **Pivot triggers** (when co-evo features consistently outperform roadmap)

**Nature:** More "operating model" than feature

**Implementation:** Bring in gradually as user-driven ideas justify formal system

---

### Moonshots

_Ambitious, transformative concepts_

**A. Ori as Global Co-Evolution Lab for "What Good Work Is"**

**Not just:**
> "We match people to jobs"

**But:**
> "We are continuously learning, with our users, what fulfilling work looks like across cultures, and evolving the product to encode that"

**Long-term Implementation:**

Aggregate patterns in:
- Suggestions
- Successful matches
- Failed journeys
- "This feature helped me" stories

Use AI to surface:
- Theories: "For this type of person in this culture, these role patterns lead to higher long-term satisfaction"

Feed theories back into:
- The matching engine
- The feature roadmap
- Public-facing insights ("State of Meaningful Work" reports)

**Identity:** A research institution disguised as a product. Very on-brand with manifesto.

---

**B. Features Must "Win Elections" Before Becoming Standard**

**The Wild Extension:**

New features are:
- Proposed by AI (not just users)
- Critiqued & refined by users
- To become Standard, must:
  - Win on metrics
  - Pass manifesto alignment
  - AND pass user approval threshold in key segments

**Result:** Democratic, manifesto-constrained software evolution

**Timing:** Definitely not MVP

---

**C. AI Marketing + Product Agents as Self-Tuning Ecosystem**

**Eventual Endgame of "Force" Model:**

AI agents constantly:
- Sense where people get stuck (don't believe contrast/stability/safety)
- Adapt artifacts per segment and culture
- Test small variations
- Feed learnings back into:
  - Marketing surfaces
  - Product itself (onboarding, in-app nudges, feature activation)

**The System Becomes:**
> A closed feedback loop where how you explain Ori and what Ori actually does co-adapt

**Requirement:** Scale + data to grow into this

---

## Summary: Most Actionable vs Most Aspirational

### MOST ACTIONABLE RIGHT NOW

**Turn into code and flows immediately:**
1. MVP engine (profile → deep search → AI matches → dashboard + email)
2. Freemium tiers and quotas
3. Force-based messaging (contrast/stability/safety in landing page, onboarding, emails)
4. Minimal feedback → AI reply loop to start co-creation tone

---

### MOST ASPIRATIONAL / IDENTITY-DEFINING

**What kind of organism Ori becomes over 5-10 years:**
1. AI-scored, manifesto-aware roadmap with user co-evo as first-class citizen
2. Ori as global experiment in human fulfillment where:
   - Users propose theories via suggestions
   - AI evaluates them
   - Product keeps rewriting itself accordingly

**Strategy:**
- **Near term:** Build the working nucleus
- **Long term:** Let that nucleus grow into the co-evolving organism we sketched

### Insights and Learnings

_Key realizations from the session_

1. **Don't sell "an AI platform" - sell a concrete outcome**
   - The shift from vague tech to specific promise: "Find work that fits you, not just your CV"
   - Pricing should reflect value delivered, not features listed

2. **Marketing as physics, not tactics**
   - The fundamental force: "Trust-powered reduction of career uncertainty"
   - Three content primitives (Contrast/Stability/Bridge) replace traditional "channels"
   - International = cultural adaptation, not translation

3. **Feedback systems can be intelligence layers**
   - Treating suggestions as "hypotheses about human fulfillment"
   - AI as "philosophical bouncer" enforcing manifesto alignment
   - The roadmap becomes a living conversation, not a static document

4. **Co-evolution > Roadmap**
   - Users + AI may discover better features than founders alone
   - The manifesto becomes "algorithmic constraint" not marketing copy
   - Founder role shifts from "enforce roadmap" to "shape evolutionary rules"

5. **The delicious recursion**
   - Ori matches humans ↔ jobs
   - Ori matches ideas ↔ reality
   - Ori matches features ↔ itself
   - This is a meta-learning layer, not just a feedback system

6. **Values as executable code**
   - Manifesto-alignment scoring makes ethics operational
   - "Red list" of disallowed feature motifs protects soul at scale
   - Philosophy audits prevent drift toward engagement-hacking

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Ship the MVP in 2 Weeks

**Rationale:**
Everything else depends on having a working product loop. The MVP validates:
- Can we actually match people to jobs better than alternatives?
- Will people pay for this?
- Does the manifesto translate into real user value?

**Next steps:**
1. Build core stack (Next.js + Supabase + Stripe + LLM API + 1 job API)
2. Implement freemium tiers with quota enforcement
3. Create `/app` routes: dashboard, profile, searches, settings
4. Build search processing worker (cron-based for MVP)
5. Design match card UI with "Why Ori picked this" explanations
6. Set up email notifications (search complete)
7. Create landing page with force-based messaging (contrast/stability/bridge)

**Resources needed:**
- Developer time (full-time for 2 weeks)
- API keys: OpenAI/Anthropic + job board API (start with 1 source)
- Stripe account + product setup
- Domain + hosting (Vercel/similar)
- Email service (Resend/similar)

**Timeline:** 2 weeks to first paying customer

---

#### #2 Priority: Implement Force-Based Marketing Copy

**Rationale:**
Marketing isn't about channels - it's about applying psychological force. Get the messaging right from day one so every word reduces career uncertainty and builds trust.

**Next steps:**
1. Write 5-10 **Contrast Frames** for different user segments:
   - "Doomscrolling 3 job boards when you're already burned out"
   - "Endless applications, zero responses, constant ghosting"
   - Cost calculator: "150 hours/year on job boards - what did you get?"
2. Write 3-5 **Stability Models**:
   - "Life with Ori" scenarios
   - Process explainers (simple, non-technical)
   - Long-term identity shift narratives
3. Write **Safety Bridges**:
   - "What happens when you sign up" (5 clear steps)
   - "What Ori will NOT do" (explicit promises)
   - Risk-slicing offers for free tier
4. Apply across:
   - Landing page hero/sections
   - Onboarding flow
   - Email templates
   - In-app tooltips

**Resources needed:**
- Copywriting time
- Understanding of target user segments
- Reference: manifesto for tone/values

**Timeline:** 1 week, parallel to MVP development

---

#### #3 Priority: Simple Feedback → AI Reply Loop

**Rationale:**
Start the co-evolution culture from day one. Even a basic "AI explains why your suggestion matters/what the constraints are" kills the feedback black hole and trains how Ori talks about product decisions.

**Next steps:**
1. Add feedback form in-app: "Have an idea for Ori?"
2. Create simple LLM prompt template:
   - Input: user suggestion + manifesto + current product state
   - Output: "This is interesting because...", "Here's the constraint...", "Here's a simpler variant..."
3. Set up response workflow (can be manual trigger initially):
   - Suggestion comes in → pipe to LLM → review response → send to user
4. Track in simple database table (suggestions + responses + user)
5. Start building dataset for future AI scoring system

**Resources needed:**
- Form UI (simple textarea + submit)
- LLM prompt engineering
- Email template for responses
- Basic tracking database

**Timeline:** 1-2 days after MVP launches

## Reflection and Follow-up

### What Worked Well

1. **Resource Constraints forced clarity**
   - Imposing extreme limitations ("2 weeks, $500") stripped away all nice-to-haves
   - Revealed the essential: one paid offering that changes trajectory
   - Crystallized business model and tech stack decisions

2. **First Principles Thinking unlocked novel architecture**
   - Starting from "what is marketing fundamentally trying to do?" instead of "how to write blog posts"
   - Led to the content primitives model (Contrast/Stability/Bridge)
   - Created a framework that works across cultures without copying templates

3. **What If Scenarios enabled breakthrough**
   - "Ori learning how to become a better Ori" emerged from combining scenarios
   - The manifesto-as-algorithmic-constraint idea wouldn't have surfaced without provocative prompts
   - Gave permission to think wildly about co-evolution

4. **Assumption Reversal provided risk mitigation**
   - Challenging "roadmap as main plan" revealed flexible pivot mechanisms
   - Created systematic (not vibes-based) ways to let user co-evo win when it should
   - Established guardrails for scaling without losing soul

### Areas for Further Exploration

1. **Job API selection and integration strategy**
   - Which job board APIs to start with?
   - How to handle international job markets?
   - Backup strategies if primary source fails?

2. **LLM prompt engineering for matching**
   - What profile structure maximizes LLM understanding?
   - How to craft prompts that surface "fit" not just keyword matching?
   - Multi-step reasoning vs single-pass scoring?

3. **Pricing validation**
   - Is $5/mo for Plus sustainable for our costs?
   - What's the right free tier that creates value but drives upgrades?
   - Should lifetime Premium be limited to first N customers?

4. **Cultural adaptation depth**
   - Which regions/cultures to prioritize for launch?
   - How to source cultural belief maps for Stability Models?
   - Partnership opportunities with local career coaches?

5. **Manifesto scoring implementation**
   - How to operationalize "alignment with manifesto" as a numeric score?
   - Who calibrates the scoring in the beginning?
   - How often to audit and recalibrate?

### Recommended Follow-up Techniques

1. **Morphological Analysis** (from brainstorming techniques) for:
   - Exploring all parameter combinations for pricing tiers
   - Mapping job API options × LLM providers × delivery formats

2. **Five Whys** for drilling into:
   - Why users currently hate job searching (deeper contrast frames)
   - Why certain features might drive retention vs churn

3. **Time Shifting** to imagine:
   - How would Ori work in 2030 when AI agents are ubiquitous?
   - What if we launched in 2010 with today's model?
   - Helps reveal what's timeless vs timely

### Questions That Emerged

1. **Product:** How do we prevent users from gaming the system (requesting infinite searches with throwaway accounts)?

2. **Technical:** What's the right balance between automated job scraping vs API costs vs match quality?

3. **Business:** Should we B2C only initially, or explore B2B (universities, bootcamps) for faster validation?

4. **Ethical:** If AI can predict job fit better than humans self-report, do we show them roles they didn't ask for?

5. **Strategic:** At what user count does co-evolution become more valuable than founder roadmap? How do we know?

6. **Operational:** Who responds to feedback/suggestions before the AI system is reliable enough?

### Next Session Planning

**Suggested topics:**
1. **Deep dive on job matching algorithm** - LLM prompting strategies, scoring models, multi-pass refinement
2. **International expansion strategy** - Which markets first? Cultural adaptation playbook
3. **Financial modeling** - Unit economics, CAC, LTV projections for freemium model
4. **Feature prioritization workshop** - Map all ideas from this session to implementation timeline
5. **Brand voice & manifesto operationalization** - Turn philosophy into actual copy and design decisions

**Recommended timeframe:**
- Technical deep dive: Within 1 week (before starting MVP build)
- Business/financial modeling: Within 2 weeks (for investor/accelerator conversations)
- Brand/copy workshop: Within 3-5 days (parallel to development)

**Preparation needed:**
- Research job board APIs (pricing, coverage, rate limits)
- Draft sample user profiles for LLM testing
- Analyze competitor pricing models
- Gather manifesto source material for brand voice workshop
- Create initial tech stack decision doc

---

**Total Ideas Generated:** 80+

**Session Duration:** ~90 minutes

**Techniques Used:**
1. Resource Constraints (Structured)
2. First Principles Thinking (Creative)
3. What If Scenarios (Creative)
4. Assumption Reversal (Deep)

---

_Session facilitated using the BMAD CIS brainstorming framework_

**Facilitator:** Business Analyst Mary
**Participant:** Carlo
**Date:** November 13, 2025
