# Set Up Blog Automation and Social Media Presence

**Status**: TODO
**Priority**: MEDIUM
**Estimated**: 8 hours
**Owner**: Claude

## Objective

Establish automated content marketing infrastructure (blog) and social media presence to build audience and brand awareness before launch.

## Why This Matters

- **Content Marketing**: SEO traffic, thought leadership, trust building
- **Social Presence**: Brand awareness, community building, viral potential
- **Automation**: Consistent output without manual burden
- **Timing**: Build audience WHILE building product

## Part 1: Blog Automation (5 hours)

### Blog Architecture

**Route**: `/blog`

**Content Strategy**:

- **Frequency**: 2-3 posts per week
- **Topics**:
  - Product updates and milestones
  - Industry insights (job market, career development)
  - Technical deep-dives (how we built X)
  - User stories and case studies
  - Tips and best practices

**Automation Approach**:

**Option A: AI-Generated + Editorial Review**

```typescript
// Workflow:
// 1. AI generates draft posts (Claude API)
// 2. Store in "drafts" folder or DB
// 3. Human reviews/edits
// 4. Publish to blog

// Tech stack:
- Next.js MDX for blog posts
- Claude API for content generation
- GitHub Actions for scheduled generation
- Admin UI for review/edit/publish
```

**Option B: Hybrid (Manual + AI Enhancement)**

```typescript
// Workflow:
// 1. Human writes outline/key points
// 2. AI expands and enhances
// 3. Quick review and publish

// More control, less automation
```

**Recommendation**: Start with Option B, evolve to Option A as we refine prompts.

### Implementation Steps

#### 1. Blog Infrastructure (2 hours)

```bash
# Create blog structure
src/app/blog/
  ├── page.tsx              # Blog index (list of posts)
  ├── [slug]/
  │   └── page.tsx          # Individual post page
  └── layout.tsx            # Blog layout

content/blog/
  ├── 2025-01-announcing-ori.mdx
  ├── 2025-01-building-in-public.mdx
  └── ...

# Use next-mdx-remote or contentlayer
```

**Features**:

- Markdown/MDX support
- Syntax highlighting (code blocks)
- Table of contents
- Reading time estimate
- Social sharing buttons
- Newsletter signup CTA
- Related posts

#### 2. Content Generation Scripts (2 hours)

```typescript
// scripts/generate-blog-post.ts

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function generateBlogPost(topic: string, keywords: string[]) {
  const prompt = `
You are a technical content writer for Ori, a platform connecting job seekers with opportunities.

Generate a blog post about: ${topic}

Requirements:
- 800-1200 words
- SEO optimized (include keywords: ${keywords.join(', ')})
- Engaging introduction
- Practical value for readers
- Clear structure with H2/H3 headings
- Include actionable takeaways
- Conversational but professional tone

Output in MDX format with frontmatter.
`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  return message.content[0].text
}
```

**GitHub Action for Scheduled Generation**:

```yaml
# .github/workflows/generate-blog-post.yml
name: Generate Blog Post Draft
on:
  schedule:
    - cron: '0 9 * * 1,3,5' # Mon, Wed, Fri at 9 AM
  workflow_dispatch:
    inputs:
      topic:
        description: 'Blog post topic'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate Draft
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          pnpm exec tsx scripts/generate-blog-post.ts "${{ inputs.topic }}"
      - name: Create PR with Draft
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'Draft: New blog post'
          body: 'AI-generated draft, requires editorial review'
          labels: content, blog
```

#### 3. Blog Admin UI (1 hour - optional)

Simple admin page for reviewing drafts:

- List unpublished drafts
- Edit in markdown editor
- Publish button (moves to published folder)
- Schedule publishing

## Part 2: Social Media Presence (3 hours)

### Platforms to Focus On

**Priority 1: LinkedIn**

- **Why**: Professional audience, B2B focus, high engagement
- **Content**: Company updates, industry insights, job market trends
- **Frequency**: 3-5 posts per week

**Priority 2: Twitter/X**

- **Why**: Tech community, real-time updates, viral potential
- **Content**: Quick tips, product updates, engagement with community
- **Frequency**: 1-2 posts per day

**Priority 3: GitHub**

- **Why**: Developer community, transparency, technical credibility
- **Content**: Public repos, open-source contributions, technical docs
- **Frequency**: As needed

**Optional: Instagram/TikTok**

- **Why**: Visual storytelling, younger audience
- **Content**: Behind-the-scenes, team culture, short tips
- **Frequency**: 2-3 posts per week (if resources allow)

### Social Media Automation

#### Setup (1 hour)

1. **Create Accounts**:
   - LinkedIn Company Page
   - Twitter/X Business Account
   - GitHub Organization (already have)

2. **Branding**:
   - Profile pictures (logo)
   - Cover images
   - Bio/description (consistent messaging)
   - Link to website

3. **Tools**:
   - **Buffer or Hootsuite**: Schedule posts across platforms
   - **Zapier**: Auto-post blog posts to social
   - **Claude API**: Generate social post variations from blog content

#### Content Automation (2 hours)

```typescript
// scripts/generate-social-posts.ts

// For each new blog post:
// 1. Generate LinkedIn post (professional, 1200 chars)
// 2. Generate Twitter thread (conversational, 280 chars each)
// 3. Generate Instagram caption (visual, with hashtags)

async function generateSocialPosts(blogPost: {
  title: string
  summary: string
  url: string
}) {
  const linkedInPost = await generateLinkedInPost(blogPost)
  const twitterThread = await generateTwitterThread(blogPost)

  // Save to Buffer/Hootsuite via API
  await schedulePost('linkedin', linkedInPost)
  await schedulePost('twitter', twitterThread[0])
}
```

**Automation Workflow**:

```
New blog post published
  → Trigger webhook/GitHub Action
  → Generate social media variants
  → Schedule posts via Buffer API
  → Post at optimal times (9 AM, 2 PM, 6 PM)
```

### Content Calendar Template

**Weekly Rhythm**:

- **Monday**: Motivational/inspirational (career tips)
- **Tuesday**: Product update or feature highlight
- **Wednesday**: Blog post share (deep content)
- **Thursday**: Industry news/commentary
- **Friday**: Community spotlight or user story
- **Weekend**: Light content, behind-the-scenes

## Part 3: Email Newsletter (Optional - 2 hours)

**Purpose**: Direct line to interested users

**Platform Options**:

- Resend (already integrated)
- Mailchimp
- ConvertKit
- Substack

**Implementation**:

1. Newsletter signup form (embedded on site)
2. Welcome email sequence (automated via Resend)
3. Weekly/bi-weekly digest (blog posts + updates)
4. Segment by interest (job seekers vs employers)

```typescript
// Newsletter automation:
// - Collect emails via signup form
// - Store in Supabase (newsletter_subscribers table)
// - Send via Resend on schedule
// - Track open rates and clicks
```

## Acceptance Criteria

### Blog

- [ ] Blog infrastructure deployed (`/blog` route)
- [ ] At least 3 initial posts published
- [ ] Content generation script working
- [ ] GitHub Action for draft generation set up
- [ ] SEO optimized (meta tags, sitemap)
- [ ] Analytics tracking enabled

### Social Media

- [ ] LinkedIn, Twitter/X accounts created and branded
- [ ] At least 10 posts scheduled for next 2 weeks
- [ ] Automation script for blog → social posts
- [ ] Buffer/Hootsuite account set up
- [ ] Bio links to website

### Newsletter (Optional)

- [ ] Signup form on website
- [ ] Welcome email sequence created
- [ ] First newsletter drafted
- [ ] Subscriber list started

## Content Ideas (First Month)

1. **"Introducing Ori: Connecting Talent with Opportunity"** (Launch post)
2. **"Why We're Building in Public"** (Transparency, community)
3. **"The Problem with Traditional Job Boards"** (Industry critique)
4. **"How AI is Transforming Hiring"** (Thought leadership)
5. **"Behind the Scenes: Building Ori's Matching Algorithm"** (Technical)
6. **"5 Tips for Job Seekers in 2025"** (Practical value)
7. **"Our Product Roadmap: What's Coming Next"** (Transparency)
8. **"Meet the Team: [Name]"** (Humanize the brand)

## Success Metrics

Track after 30 days:

- Blog: Page views, time on page, bounce rate
- LinkedIn: Followers, engagement rate, post reach
- Twitter: Followers, retweets, replies
- Newsletter: Subscriber count, open rate, click rate

## Related Files

- `src/app/blog/` (create)
- `content/blog/` (create)
- `scripts/generate-blog-post.ts` (create)
- `scripts/generate-social-posts.ts` (create)
- `.github/workflows/generate-blog-post.yml` (create)

## Budget Considerations

- **Buffer/Hootsuite**: $15-30/month (or use free tier)
- **Newsletter platform**: $0-20/month (Resend free tier likely sufficient)
- **Claude API**: ~$10-20/month for content generation
- **Total**: ~$25-70/month for full automation
