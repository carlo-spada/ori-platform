# Create Marketing & Community Pages

**Status**: TODO
**Priority**: HIGH
**Estimated**: 12 hours (1 week)
**Owner**: Claude

## Objective

Build essential marketing and community engagement pages to establish presence, gather feedback, and build community before product launch.

## Why Before Product Features

1. **Build audience while building product**
2. **Early adopters provide product-market fit feedback**
3. **Community engagement → brand advocates**
4. **Transparency builds trust and excitement**
5. **SEO benefit from content-rich pages**

## Pages to Create

### 1. FAQ Page (3 hours)

**Route**: `/faq` or `/help`

**Content Sections**:
- General Questions (What is Ori? Who is it for?)
- Account & Billing (Pricing, subscriptions, refunds)
- Features & Capabilities (What can I do? Integrations?)
- Privacy & Security (Data handling, GDPR, security)
- Technical Support (How to get help, response times)

**Features**:
- Categorized accordion UI (shadcn/ui)
- Search functionality
- "Was this helpful?" feedback buttons
- Link to contact/support

**Implementation**:
```typescript
// src/app/faq/page.tsx
- Use v0.dev to generate FAQ accordion component
- Structure: Category → Questions → Expandable answers
- Mobile-responsive
- SEO optimized (structured data)
```

### 2. Whitepaper/Vision Page (4 hours)

**Route**: `/whitepaper` or `/vision`

**Content**:
1. **The Problem** (2-3 paragraphs)
   - What pain point does Ori solve?
   - Why existing solutions fall short
   - Market opportunity

2. **The Solution** (3-4 paragraphs)
   - How Ori solves it differently
   - Key innovations
   - Technical approach (high-level)

3. **The Vision** (2-3 paragraphs)
   - Where we're going
   - Impact on users/industry
   - Long-term goals

4. **The Journey** (timeline)
   - MVP milestones
   - Beta launch
   - Full launch
   - Future features

**Design**:
- Long-form reading experience
- Illustrations/diagrams (use v0.dev or Figma)
- Downloadable PDF version
- Social sharing buttons

### 3. Public Roadmap Page (2 hours)

**Route**: `/roadmap`

**Sections**:
- **Now** (Current sprint - 2 weeks)
- **Next** (Next month)
- **Later** (Next quarter)
- **Done** (Completed features)

**Features**:
- Kanban-style or timeline visualization
- Feature cards with descriptions
- Upvote/interest indicators (optional)
- Last updated timestamp

**Implementation Options**:
1. Static page (markdown-based, updated manually)
2. Integration with GitHub Projects API
3. Use Canny.io or ProductBoard embed

### 4. Feature Request Page (2 hours)

**Route**: `/feature-requests` or `/feedback`

**Purpose**: Let users suggest features and vote on priorities

**Implementation Options**:

**Option A: GitHub Issues Integration**
```typescript
// Pros: Free, integrated with dev workflow
// Cons: Requires GitHub account

- Embed GitHub Issues with label "feature-request"
- Use GitHub API to fetch and display issues
- Vote = GitHub reactions (👍)
- Link to "Submit Issue" on GitHub
```

**Option B: Canny.io Integration**
```typescript
// Pros: Purpose-built, beautiful UI, no GitHub needed
// Cons: Paid ($50/mo after trial)

- Embed Canny widget
- Users can post, vote, comment
- Admin can mark as "Planned", "In Progress", "Done"
```

**Option C: Custom Implementation**
```typescript
// Pros: Full control, no external dependency
// Cons: More development time

- Database table: feature_requests
- Fields: title, description, votes, status, user_id
- API endpoints: POST /feature-requests, POST /vote
- Frontend: Submit form + voting UI
```

**Recommendation**: Start with GitHub Issues (Option A), migrate to Canny if needed.

### 5. Patron/Early Supporter Page (1 hour)

**Route**: `/support` or `/patron`

**Purpose**: Enable community funding and early investment opportunities

**Content**:
- Why support Ori early?
- Supporter benefits/perks
- Transparency: How funds are used
- Recognition: Supporter wall of fame

**Implementation Options**:

**Option A: Patreon Integration**
```typescript
// Pros: Established platform, handles payments
// Cons: Platform fees (5-12%)

- Embed Patreon widget
- Link to Patreon page
- Display patron count/goals
```

**Option B: Custom Stripe Donation**
```typescript
// Pros: Direct, lower fees
// Cons: More implementation work

- Use existing Stripe integration
- Create "support tiers" (like subscriptions)
- One-time donations + recurring support options
- Supporter database in Supabase
```

**Option C: Ko-fi / Buy Me a Coffee**
```typescript
// Pros: Simple, quick setup
// Cons: Less control, not "investment" focused
```

**Recommendation**: Option B (Custom Stripe) - leverage existing infrastructure, lowest fees.

**Supporter Tiers** (suggested):
- **Early Bird** ($5/month) - Name on website, early access
- **Founding Supporter** ($25/month) - Above + input on roadmap
- **Platinum Patron** ($100/month) - Above + direct feedback sessions

## Design System

Use existing shadcn/ui components:
- Accordion (FAQ)
- Card (roadmap, features)
- Button (CTAs)
- Form (feature requests)
- Badge (status indicators)

## SEO Optimization

Each page should have:
- Unique meta title and description
- Open Graph tags for social sharing
- Structured data (FAQ, Organization)
- Internal linking to other pages
- Clear CTAs (signup, contact)

## Content Strategy

- **Tone**: Transparent, authentic, community-focused
- **Voice**: First-person ("We believe...", "We're building...")
- **Length**: Long enough to inform, short enough to engage
- **Updates**: Roadmap updated bi-weekly, FAQ as needed

## Implementation Order

1. **FAQ** (most immediate user need)
2. **Feature Requests** (start gathering feedback ASAP)
3. **Roadmap** (transparency builds trust)
4. **Whitepaper** (deeper engagement for interested users)
5. **Patron/Support** (once community engaged)

## Acceptance Criteria

- [ ] All 5 pages created and deployed
- [ ] Mobile-responsive on all pages
- [ ] SEO optimized (meta tags, structured data)
- [ ] Internal navigation links functional
- [ ] Analytics tracking added (Vercel Analytics)
- [ ] Pages linked from main navigation/footer
- [ ] Content reviewed for clarity and accuracy

## Related Files

- `src/app/faq/page.tsx` (create)
- `src/app/whitepaper/page.tsx` (create)
- `src/app/roadmap/page.tsx` (create)
- `src/app/feature-requests/page.tsx` (create)
- `src/app/support/page.tsx` (create)
- `src/components/marketing/` (new component directory)

## Success Metrics

After launch, track:
- Page views on each page
- Time on page (engagement)
- Feature request submissions
- Patron signups
- Conversion rate from marketing pages to signup
