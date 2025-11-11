---
type: documentation
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: notion, sync, setup, guide.md, quick, step, create
priority: medium
quick-read-time: 5min
deep-dive-time: 8min
---

# Notion Sync - Quick Setup Guide

**Your Notion API Key**: (provided by Carlo - do not commit to git)

**Time to complete**: 15-20 minutes

---

## Step 1: Create Notion Database (5 minutes)

### 1.1 Create New Page in Notion

1. Open Notion
2. Click "+ New page" in your workspace
3. Title: **"Ori Platform Documentation"**

### 1.2 Add a Database

1. In the new page, type `/database` and select "Table - Inline"
2. Title the database: **"Documentation Hub"**

### 1.3 Add Properties to Database

Click "+ Add a property" and create these properties:

| Property Name | Type | Options |
|---------------|------|---------|
| **Title** | Title | (default, already exists) |
| **Git Path** | Text | - |
| **Category** | Select | Options: `Core`, `Operations`, `Reference`, `Agent Guide`, `Task Management`, `Branding`, `Other` |
| **Last Updated** | Date | - |
| **Status** | Select | Options: `Current`, `Needs Review`, `Stale` |
| **Responsible Agent** | Select | Options: `Claude`, `Gemini`, `Carlo`, `All Agents` |
| **Git Commit Hash** | Text | - |
| **Auto-sync Status** | Checkbox | - |

### 1.4 Get Database ID

1. Click the "..." menu (top right of database)
2. Click "Copy link"
3. The link looks like: `https://notion.so/your-workspace/DATABASE_ID?v=...`
4. Extract the DATABASE_ID (it's the long string before `?v=`)
5. Save it - you'll need it in Step 2

Example:
- Full URL: `https://notion.so/myworkspace/abc123def456?v=xyz`
- Database ID: `abc123def456`

---

## Step 2: Configure GitHub Secrets (3 minutes)

### 2.1 Go to Repository Settings

1. Open: https://github.com/carlo-spada/ori-platform/settings/secrets/actions
2. Click "New repository secret"

### 2.2 Add NOTION_API_KEY

- **Name**: `NOTION_API_KEY`
- **Value**: (your Notion API key - starts with `ntn_`)
- Click "Add secret"

### 2.3 Add NOTION_DATABASE_ID

- **Name**: `NOTION_DATABASE_ID`
- **Value**: (paste the Database ID you copied in Step 1.4)
- Click "Add secret"

---

## Step 3: Install Dependencies (2 minutes)

```bash
# In your project root
npm install @notionhq/client gray-matter
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "@notionhq/client": "^2.2.14",
    "gray-matter": "^4.0.3"
  }
}
```

---

## Step 4: Test the Sync Locally (5 minutes)

### 4.1 Set Environment Variables

```bash
export NOTION_API_KEY="your-notion-api-key-here"
export NOTION_DATABASE_ID="your-database-id-from-step-1"
```

### 4.2 Test Sync with One Doc

```bash
# Test with README.md
node scripts/sync-docs-to-notion.js "README.md"
```

Expected output:
```
🚀 Starting Notion Documentation Sync...

📝 Found 1 changed file(s):
   - README.md

📄 Processing: README.md
  📊 Status: Current (0 days old)
  📁 Category: Other
  👤 Responsible: Carlo
  ✅ Created in Notion

✅ Notion sync complete!
```

### 4.3 Check Notion

1. Go back to your Notion "Documentation Hub" database
2. You should see a new entry for "README"
3. Click it to see the synced content

### 4.4 Test Staleness Checker

```bash
node scripts/update-notion-staleness.js
```

Expected output:
```
📊 Checking documentation staleness...

======================================================================
📈 DOCUMENTATION HEALTH SUMMARY
======================================================================

Total Documents: 1
✅ Current: 1 (100%)
⚠️  Needs Review (14-30 days): 0 (0%)
❌ Stale (30+ days): 0 (0%)

📊 Health Score: 100%

✅ All documentation is current! Great job! 🎉
```

---

## Step 5: Commit and Push (5 minutes)

```bash
# Stage the new files
git add .github/workflows/sync-docs-to-notion.yml \
        .github/workflows/daily-doc-health-check.yml \
        scripts/sync-docs-to-notion.js \
        scripts/update-notion-staleness.js \
        scripts/generate-weekly-doc-report.js \
        NOTION_SYNC_SETUP_GUIDE.md \
        package.json

# Commit
git commit -m "feat(docs): add Notion sync automation

- GitHub Actions workflows for auto-sync on every commit
- Daily staleness monitoring with GitHub issue creation
- Scripts for syncing docs and generating health reports
- Tracks documentation freshness with 30-day staleness threshold

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to dev
git push origin dev
```

---

## Step 6: Verify GitHub Actions (5 minutes)

### 6.1 Check Workflow Runs

1. Go to: https://github.com/carlo-spada/ori-platform/actions
2. You should see a new workflow run called "Sync Docs to Notion"
3. Click it to see the progress
4. It should show green checkmarks for all steps

### 6.2 Check Notion Again

After the workflow runs, check your Notion database:
- Should see all markdown files synced
- Each entry should have proper Category, Status, etc.
- Content should be formatted with headings, code blocks, etc.

---

## Step 7: Test Manual Trigger (Optional)

You can manually trigger the sync anytime:

1. Go to: https://github.com/carlo-spada/ori-platform/actions/workflows/sync-docs-to-notion.yml
2. Click "Run workflow"
3. Select branch: `dev`
4. Click "Run workflow"

---

## What Happens Next

### Automatic Sync
- Every commit that changes `.md` files → Auto-syncs to Notion
- Takes ~30-60 seconds after push

### Daily Health Checks
- Every day at 9 AM UTC (1 AM PST, 10 AM CET)
- Checks for stale docs (30+ days old)
- Creates GitHub issue if stale docs found
- Generates health summary

### Manual Health Check
```bash
# Run anytime
node scripts/generate-weekly-doc-report.js
```

---

## Troubleshooting

### Sync Failed: "Invalid Database ID"
- Double-check the DATABASE_ID in GitHub Secrets
- Make sure you copied the right part (before `?v=`)
- Try opening the database in Notion and copying the link again

### Sync Failed: "Unauthorized"
- Check that NOTION_API_KEY is correct in GitHub Secrets
- Verify the Notion integration has access to the database
- Go to Notion database → Share → Make sure integration is added

### No Content Showing in Notion
- The sync only includes first ~95 blocks (Notion limit)
- Check if file has unusual markdown formatting
- Try syncing a simpler file first to verify

### Workflow Not Triggering
- Check GitHub Actions is enabled: Settings → Actions → "Allow all actions"
- Verify secrets are set correctly
- Make sure you pushed to `dev` or `main` branch
- Check workflow file has correct paths in `on.push.paths`

---

## Next Steps

### Week 1 (This Week)
- [x] Create Notion database ← **YOU ARE HERE**
- [x] Add GitHub secrets
- [ ] Test sync locally
- [ ] Commit and push
- [ ] Verify automatic sync works
- [ ] Sync 5 critical docs (CLAUDE.md, AGENTS.md, GEMINI.md, README.md, DOC_INDEX.md)

### Week 2
- [ ] Enable daily staleness checks
- [ ] Set up notification preferences (GitHub issues vs email)
- [ ] Review first health report
- [ ] Adjust staleness thresholds if needed

### Week 3
- [ ] Create agent-specific views in Notion
- [ ] Add documentation dependency tracking
- [ ] Set up "Last Reviewed" workflow

### Ongoing
- [ ] Review weekly health reports
- [ ] Address stale documentation
- [ ] Monthly comprehensive audit

---

## Support

If you run into issues:

1. Check the GitHub Actions logs for error messages
2. Review this guide's troubleshooting section
3. Check the full strategy doc: `docs/OPERATIONS/OPS_GIT_NOTION_DOCUMENTATION_STRATEGY.md`
4. Ask Claude for help (I have context on the entire setup)

---

## Quick Reference

### Environment Variables (Local Testing)
```bash
export NOTION_API_KEY="your-notion-api-key-here"
export NOTION_DATABASE_ID="your-database-id"
```

### Useful Commands
```bash
# Sync specific file
node scripts/sync-docs-to-notion.js "path/to/file.md"

# Check staleness
node scripts/update-notion-staleness.js

# Generate weekly report
node scripts/generate-weekly-doc-report.js

# Sync multiple files
node scripts/sync-docs-to-notion.js "README.md CLAUDE.md AGENTS.md"
```

### GitHub Actions URLs
- Workflows: https://github.com/carlo-spada/ori-platform/actions
- Secrets: https://github.com/carlo-spada/ori-platform/settings/secrets/actions
- Sync workflow: https://github.com/carlo-spada/ori-platform/actions/workflows/sync-docs-to-notion.yml

---

**Status**: Ready to set up! Follow steps 1-7 in order.
**Estimated Time**: 20 minutes
**Next Action**: Step 1 - Create Notion Database
