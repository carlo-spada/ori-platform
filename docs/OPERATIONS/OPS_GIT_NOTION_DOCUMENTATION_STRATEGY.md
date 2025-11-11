# Git + Notion Documentation Strategy

**Status**: Strategic Plan
**Created**: 2025-11-11
**Owner**: Carlo
**Purpose**: Hybrid documentation system with automated synchronization and maintenance tracking

---

## Executive Summary

Transform the Ori Platform documentation from a purely git-based system to a **hybrid Git + Notion structure** that maintains git as the source of truth while leveraging Notion for:

1. **Visual collaboration** - Better for planning, brainstorming, and stakeholder communication
2. **Automated notifications** - Track documentation staleness and missing updates
3. **Documentation health monitoring** - Automated checks for outdated content
4. **Team onboarding** - More accessible UI for non-technical stakeholders
5. **Change tracking** - Notion database of doc updates with automatic alerts

**Git remains the source of truth.** Notion is a mirror + notification system.

---

## System Architecture

### Two-Way Sync Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     Git Repository (Source of Truth)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  CLAUDE.md   │  │  AGENTS.md   │  │  docs/*.md   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          │  GitHub Actions  │                  │
          │  (auto-sync)     │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Notion Workspace                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Documentation Hub (Database)                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ Doc Status │  │ Last Edit  │  │ Staleness  │         │  │
│  │  │ (Current/  │  │ (Auto-     │  │ Alert      │         │  │
│  │  │  Stale)    │  │  tracked)  │  │ (Auto)     │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Automated Notifications:                                       │
│  • Daily: Docs not updated in 30+ days                          │
│  • Weekly: Documentation health report                          │
│  • On commit: Auto-update Notion pages from git                 │
└─────────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Git is source of truth** - All docs written and edited in git
2. **Notion is mirror + tracker** - Read-only sync from git → Notion
3. **Automated sync** - GitHub Actions push changes to Notion on commit
4. **Health monitoring** - Notion database tracks freshness, alerts on staleness
5. **No manual duplication** - Automation handles all synchronization

---

## Phase 1: Foundation Setup (Week 1)

### 1.1 Notion Workspace Structure

Create a dedicated **"Ori Platform Docs"** workspace with:

```
Ori Platform Documentation
├── 📚 Documentation Hub (Database)
│   ├── Properties:
│   │   ├── Title (text)
│   │   ├── Git Path (text) - e.g., "docs/CORE/CORE_DATABASE_SCHEMA.md"
│   │   ├── Category (select) - Core, Operations, Reference, Agent Guide
│   │   ├── Last Updated (date) - Auto-synced from git commit
│   │   ├── Staleness (formula) - Days since last update
│   │   ├── Status (select) - Current, Needs Review, Stale (30+ days)
│   │   ├── Responsible Agent (select) - Claude, Gemini, Carlo
│   │   ├── Git Commit Hash (text) - Latest commit that touched this doc
│   │   └── Auto-sync Status (checkbox) - Is this doc auto-syncing?
│   │
│   └── Views:
│       ├── All Docs (table)
│       ├── Stale Docs (filter: Staleness > 30 days)
│       ├── By Category (board)
│       └── Recent Updates (gallery, sorted by Last Updated)
│
├── 🏠 Start Here
│   ├── Overview (linked to DOC_INDEX.md content)
│   ├── Quick Start Guide
│   └── Navigation Help
│
├── 🤖 Agent Guides
│   ├── Claude's Implementation Guide (synced from CLAUDE.md)
│   ├── Gemini's Planning Guide (synced from GEMINI.md)
│   └── Agent Collaboration (synced from AGENTS.md)
│
├── 🏗️ Core Documentation
│   ├── Database Schema (synced from docs/CORE/CORE_DATABASE_SCHEMA.md)
│   ├── Architecture Overview
│   └── API Reference
│
├── ⚙️ Operations
│   ├── Deployment Runbook
│   ├── Branch Protection Setup
│   └── Auto PR Review System
│
├── 📖 Reference
│   ├── Design System
│   ├── Environment Variables
│   └── Skills Gap Quick Ref
│
└── 📊 Documentation Health Dashboard
    ├── Staleness Report (linked view)
    ├── Update History (timeline)
    └── Alert Log (what triggered notifications)
```

### 1.2 GitHub Actions Workflow

**File**: `.github/workflows/sync-docs-to-notion.yml`

```yaml
name: Sync Docs to Notion

on:
  push:
    branches: [main, dev]
    paths:
      - '**.md'
      - 'CLAUDE.md'
      - 'GEMINI.md'
      - 'AGENTS.md'
      - 'docs/**'
  workflow_dispatch: # Manual trigger

jobs:
  sync-to-notion:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2 # Need previous commit for diff

      - name: Get changed markdown files
        id: changed-files
        uses: tj-actions/changed-files@v41
        with:
          files: |
            **.md

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @notionhq/client gray-matter

      - name: Sync to Notion
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
        run: |
          node scripts/sync-docs-to-notion.js "${{ steps.changed-files.outputs.all_changed_files }}"

      - name: Update staleness database
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
        run: |
          node scripts/update-notion-staleness.js
```

### 1.3 Sync Script

**File**: `scripts/sync-docs-to-notion.js`

```javascript
const { Client } = require('@notionhq/client')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { execSync } = require('child_process')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

// Category mapping based on file path
function getCategory(filePath) {
  if (filePath.includes('docs/CORE')) return 'Core'
  if (filePath.includes('docs/OPERATIONS')) return 'Operations'
  if (filePath.includes('docs/REFERENCE')) return 'Reference'
  if (['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'].includes(path.basename(filePath))) {
    return 'Agent Guide'
  }
  return 'Other'
}

// Get last commit info for a file
function getLastCommit(filePath) {
  try {
    const hash = execSync(`git log -1 --format=%H -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()
    const date = execSync(`git log -1 --format=%ai -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()
    return { hash, date }
  } catch (error) {
    return { hash: 'unknown', date: new Date().toISOString() }
  }
}

// Convert markdown to Notion blocks (simplified)
function markdownToNotionBlocks(markdown) {
  const blocks = []
  const lines = markdown.split('\n')

  for (let line of lines) {
    // Headings
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] },
      })
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: line.slice(3) } }] },
      })
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: [{ type: 'text', text: { content: line.slice(4) } }] },
      })
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: '' } }],
          language: language || 'plain text',
        },
      })
    }
    // Regular paragraphs
    else if (line.trim()) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line } }],
        },
      })
    }
  }

  // Notion has a limit of 100 blocks per request
  return blocks.slice(0, 100)
}

// Find existing page in Notion database by git path
async function findPageByGitPath(gitPath) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Git Path',
      rich_text: { equals: gitPath },
    },
  })
  return response.results[0]
}

// Create or update Notion page
async function syncFileToNotion(filePath) {
  console.log(`Syncing ${filePath} to Notion...`)

  const content = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content: markdown } = matter(content)

  const category = getCategory(filePath)
  const { hash, date } = getLastCommit(filePath)
  const title = path.basename(filePath, '.md')

  // Calculate staleness
  const lastUpdate = new Date(date)
  const now = new Date()
  const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
  const status = daysSinceUpdate > 30 ? 'Stale' : daysSinceUpdate > 14 ? 'Needs Review' : 'Current'

  const properties = {
    Title: { title: [{ text: { content: title } }] },
    'Git Path': { rich_text: [{ text: { content: filePath } }] },
    Category: { select: { name: category } },
    'Last Updated': { date: { start: date.split(' ')[0] } },
    Status: { select: { name: status } },
    'Git Commit Hash': { rich_text: [{ text: { content: hash } }] },
    'Auto-sync Status': { checkbox: true },
  }

  // Check if page exists
  const existingPage = await findPageByGitPath(filePath)

  if (existingPage) {
    // Update existing page
    await notion.pages.update({
      page_id: existingPage.id,
      properties,
    })

    // Update page content (blocks)
    // Note: This requires deleting old blocks and adding new ones
    const blocks = markdownToNotionBlocks(markdown)
    // Simplified: just append new content (full implementation would clear old blocks)
    await notion.blocks.children.append({
      block_id: existingPage.id,
      children: blocks,
    })

    console.log(`✅ Updated ${filePath} in Notion`)
  } else {
    // Create new page
    const blocks = markdownToNotionBlocks(markdown)
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      children: blocks,
    })

    console.log(`✅ Created ${filePath} in Notion`)
  }
}

// Main execution
async function main() {
  const changedFiles = process.argv[2]?.split(' ') || []

  if (changedFiles.length === 0) {
    console.log('No markdown files changed.')
    return
  }

  for (const file of changedFiles) {
    if (file.endsWith('.md')) {
      try {
        await syncFileToNotion(file)
      } catch (error) {
        console.error(`❌ Failed to sync ${file}:`, error.message)
      }
    }
  }

  console.log('\n✅ Notion sync complete!')
}

main().catch(console.error)
```

### 1.4 Staleness Monitoring Script

**File**: `scripts/update-notion-staleness.js`

```javascript
const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

async function updateStaleness() {
  console.log('Checking documentation staleness...')

  const response = await notion.databases.query({
    database_id: databaseId,
  })

  const now = new Date()
  const stalePages = []

  for (const page of response.results) {
    const lastUpdated = page.properties['Last Updated']?.date?.start
    if (!lastUpdated) continue

    const lastUpdateDate = new Date(lastUpdated)
    const daysSinceUpdate = Math.floor((now - lastUpdateDate) / (1000 * 60 * 60 * 24))

    // Update status based on staleness
    let newStatus = 'Current'
    if (daysSinceUpdate > 30) {
      newStatus = 'Stale'
      stalePages.push({
        title: page.properties.Title.title[0]?.plain_text || 'Untitled',
        gitPath: page.properties['Git Path']?.rich_text[0]?.plain_text || 'Unknown',
        daysSinceUpdate,
      })
    } else if (daysSinceUpdate > 14) {
      newStatus = 'Needs Review'
    }

    // Update if status changed
    const currentStatus = page.properties.Status?.select?.name
    if (currentStatus !== newStatus) {
      await notion.pages.update({
        page_id: page.id,
        properties: {
          Status: { select: { name: newStatus } },
        },
      })
      console.log(`Updated ${page.properties.Title.title[0]?.plain_text}: ${newStatus}`)
    }
  }

  // Log stale docs
  if (stalePages.length > 0) {
    console.log('\n⚠️  STALE DOCUMENTATION DETECTED:\n')
    stalePages.forEach((doc) => {
      console.log(`  - ${doc.title} (${doc.gitPath}) - ${doc.daysSinceUpdate} days old`)
    })
  } else {
    console.log('\n✅ All documentation is current!')
  }

  return stalePages
}

updateStaleness().catch(console.error)
```

---

## Phase 2: Automated Notifications (Week 2)

### 2.1 Daily Staleness Alerts

**File**: `.github/workflows/daily-doc-health-check.yml`

```yaml
name: Daily Documentation Health Check

on:
  schedule:
    - cron: '0 9 * * *' # Every day at 9 AM UTC
  workflow_dispatch:

jobs:
  check-doc-health:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @notionhq/client

      - name: Check documentation staleness
        id: staleness-check
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
        run: |
          node scripts/update-notion-staleness.js > staleness-report.txt
          cat staleness-report.txt

      - name: Send Slack notification if stale docs found
        if: contains(steps.staleness-check.outputs.result, 'STALE')
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "⚠️ Stale documentation detected!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Documentation health check found stale docs (30+ days old). Review needed!"
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "<https://notion.so/your-workspace|View in Notion>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Create GitHub issue if critical docs are stale
        if: contains(steps.staleness-check.outputs.result, 'CLAUDE.md') || contains(steps.staleness-check.outputs.result, 'AGENTS.md')
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '📚 Critical Documentation Needs Update',
              body: 'Automated check found critical documentation (CLAUDE.md, AGENTS.md, or similar) has not been updated in 30+ days. Please review and update if necessary.\n\n[View in Notion](https://notion.so/your-workspace)',
              labels: ['documentation', 'maintenance', 'automated']
            })
```

### 2.2 Weekly Health Report

**File**: `scripts/generate-weekly-doc-report.js`

```javascript
const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

async function generateWeeklyReport() {
  const response = await notion.databases.query({
    database_id: databaseId,
  })

  const stats = {
    total: response.results.length,
    current: 0,
    needsReview: 0,
    stale: 0,
    byCategory: {},
  }

  for (const page of response.results) {
    const status = page.properties.Status?.select?.name
    const category = page.properties.Category?.select?.name

    if (status === 'Current') stats.current++
    if (status === 'Needs Review') stats.needsReview++
    if (status === 'Stale') stats.stale++

    if (category) {
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
    }
  }

  const healthScore = Math.round((stats.current / stats.total) * 100)

  console.log('\n📊 WEEKLY DOCUMENTATION HEALTH REPORT\n')
  console.log(`Total Documents: ${stats.total}`)
  console.log(`✅ Current: ${stats.current} (${Math.round((stats.current / stats.total) * 100)}%)`)
  console.log(
    `⚠️  Needs Review: ${stats.needsReview} (${Math.round((stats.needsReview / stats.total) * 100)}%)`
  )
  console.log(`❌ Stale: ${stats.stale} (${Math.round((stats.stale / stats.total) * 100)}%)`)
  console.log(`\n📈 Health Score: ${healthScore}%`)
  console.log(`\nBy Category:`)
  Object.entries(stats.byCategory).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`)
  })

  return { stats, healthScore }
}

generateWeeklyReport().catch(console.error)
```

---

## Phase 3: Advanced Features (Week 3-4)

### 3.1 Documentation Dependencies

Track which docs reference other docs. If a doc changes, notify owners of dependent docs.

**Notion Property**: `Referenced By` (relation to other pages in database)

**Script**: Parse markdown links in each doc, find references, update Notion relations.

### 3.2 Automated "Last Reviewed" Tracking

Add a mechanism for agents to mark docs as "reviewed" even if no changes were made.

**Implementation**:

1. Add `Last Reviewed` property in Notion
2. Create slash command: `/mark-doc-reviewed [doc-name]`
3. Updates Notion without changing git

### 3.3 Documentation Coverage Metrics

Track which features have corresponding documentation.

**Notion Database**: `Feature Documentation Coverage`

Properties:

- Feature Name
- Has Architecture Doc?
- Has API Doc?
- Has User Guide?
- Coverage Score (formula)

### 3.4 Agent-Specific Views

Create filtered views for each agent:

- **Claude's View**: Implementation docs, MCP tools, API references
- **Gemini's View**: Planning docs, architecture, governance
- **Carlo's View**: Operations, deployment, business docs

### 3.5 Change Impact Analysis

When a doc changes, automatically identify:

- Related docs that might need updates
- Features affected by the change
- Tests that might need review

**Implementation**: Parse git diff, identify changed sections, cross-reference with doc dependency graph.

---

## Phase 4: Continuous Improvement (Ongoing)

### 4.1 Monthly Documentation Audit

**Automated Task** (1st of every month):

1. Generate comprehensive health report
2. Create GitHub issue with audit results
3. Assign to Carlo for review
4. Include recommended actions

### 4.2 Documentation Quality Metrics

Track over time:

- Average documentation staleness
- Percentage of docs with 90+ day staleness
- Documentation growth rate
- Most frequently updated docs (might indicate instability)

### 4.3 Smart Notifications

Use LLM to analyze doc changes and determine notification priority:

- **Low Priority**: Typo fixes, formatting
- **Medium Priority**: Content additions, clarifications
- **High Priority**: Architectural changes, breaking changes
- **Critical**: Security updates, deployment changes

---

## Implementation Checklist

### Week 1: Foundation

- [ ] Create Notion workspace structure
- [ ] Set up Documentation Hub database with properties
- [ ] Create category views (All Docs, Stale Docs, etc.)
- [ ] Write `sync-docs-to-notion.js` script
- [ ] Write `update-notion-staleness.js` script
- [ ] Create GitHub Actions workflow for sync
- [ ] Test sync with 2-3 docs manually
- [ ] Set up Notion API integration secrets in GitHub

### Week 2: Automation

- [ ] Create daily staleness check workflow
- [ ] Set up Slack webhook for notifications
- [ ] Write weekly report generation script
- [ ] Schedule weekly report workflow
- [ ] Test notification system end-to-end
- [ ] Document how to manually trigger syncs

### Week 3: Advanced Features

- [ ] Implement documentation dependency tracking
- [ ] Add "Last Reviewed" mechanism
- [ ] Create agent-specific Notion views
- [ ] Build feature documentation coverage tracker
- [ ] Test all advanced features

### Week 4: Polish & Training

- [ ] Create user guide for Notion workspace
- [ ] Document how to interpret health scores
- [ ] Set up alerting thresholds
- [ ] Train team on new system
- [ ] Conduct first monthly audit

---

## Success Metrics

### Immediate (Week 1-2)

- [ ] 100% of critical docs synced to Notion
- [ ] Automated sync running on every commit
- [ ] Staleness tracking active

### Short-term (Month 1)

- [ ] Zero docs over 60 days old
- [ ] 90%+ docs marked as "Current"
- [ ] Health score of 85%+
- [ ] At least 1 automated notification sent and acted upon

### Long-term (3-6 months)

- [ ] Average doc staleness < 15 days
- [ ] 95%+ documentation health score
- [ ] Zero missed doc updates for major features
- [ ] Team using Notion as primary doc discovery tool

---

## Maintenance & Governance

### Daily

- Automated staleness check runs
- Notion pages auto-sync from git commits
- Alerts sent for stale critical docs

### Weekly

- Review weekly health report
- Address any stale documentation
- Check sync status for failed syncs

### Monthly

- Comprehensive documentation audit
- Review and adjust staleness thresholds
- Analyze documentation growth patterns
- Update Notion workspace structure if needed

### Quarterly

- Review documentation strategy effectiveness
- Gather team feedback on Notion usage
- Optimize notification rules
- Archive obsolete documentation

---

## Risk Mitigation

### Sync Failures

**Risk**: GitHub Actions workflow fails, Notion out of sync
**Mitigation**:

- Workflow sends failure notification
- Manual sync command available
- Git remains source of truth (never blocked)

### Over-Notification

**Risk**: Too many alerts, notification fatigue
**Mitigation**:

- Tunable staleness thresholds
- Priority-based notifications
- Weekly digest instead of daily for low-priority

### Notion Downtime

**Risk**: Notion unavailable, no doc access
**Mitigation**:

- Git docs always accessible
- README.md links to both Git and Notion
- Notion is enhancement, not requirement

### Data Privacy

**Risk**: Sensitive information in Notion
**Mitigation**:

- No secrets or credentials in synced docs
- Review frontmatter/metadata before sync
- Option to exclude specific docs from sync

---

## Cost Analysis

### Notion Plan

- **Free Plan**: Up to 10 users, unlimited pages
- **Plus Plan**: $10/user/month (needed for API access)
- **Estimated**: $30-50/month for 3-5 users

### GitHub Actions

- **Public Repo**: 2,000 minutes/month free
- **Estimated**: ~100 minutes/month for doc sync
- **Cost**: $0

### Development Time

- **Week 1 (Foundation)**: 16 hours
- **Week 2 (Automation)**: 12 hours
- **Week 3 (Advanced)**: 8 hours
- **Week 4 (Polish)**: 4 hours
- **Total**: 40 hours

### ROI

**Time saved per month**:

- Manual doc audits: 4 hours → 30 minutes (saves 3.5 hours)
- Finding stale docs: 2 hours → 0 (automated)
- Onboarding new team members: 3 hours → 1 hour (Notion UI)
- **Total saved**: ~7.5 hours/month

**Break-even**: After 6 months

---

## Next Steps

1. **Decision Point**: Approve strategy and budget
2. **Setup**: Create Notion workspace and API integration
3. **Phase 1**: Implement foundation (Week 1)
4. **Test**: Validate with subset of docs
5. **Roll Out**: Full implementation (Weeks 2-4)
6. **Monitor**: Track success metrics
7. **Iterate**: Adjust based on team feedback

---

## Appendix: Alternative Approaches

### Option A: Notion as Primary (Not Recommended)

**Pros**: Better UI, easier collaboration
**Cons**: Loses git history, harder CI/CD, version control issues

### Option B: Git-Only with Better Tooling

**Pros**: Simpler, no external dependency
**Cons**: Lacks notification system, harder for non-technical users

### Option C: Custom Dashboard

**Pros**: Full control, custom features
**Cons**: High development cost, maintenance burden

**Selected**: Hybrid Git + Notion (best of both worlds)

---

**Status**: Ready for approval and implementation
**Owner**: Carlo
**Next Action**: Approve strategy → Begin Week 1 setup
