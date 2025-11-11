# Notion Sync - 5 Minute Quick Start

**Your API Key**: (provided separately - do not commit)

Follow these 3 simple steps to set up automatic documentation sync!

---

## Step 1: Create Page & Database in Notion (3 minutes)

### 1.1 Create Page
1. Open Notion: https://notion.so
2. Click "+ New page"
3. Title: **"Ori Platform Documentation"**

### 1.2 Add Database
1. In the page, type `/database`
2. Select "Table - Inline"
3. It creates a database - leave the title as "Database"

### 1.3 Add Properties (Click "+")

Add each of these properties by clicking the "+" button next to existing columns:

**1. Git Path** (Text)
- Click "+"
- Type: Text
- Name: `Git Path`

**2. Category** (Select)
- Click "+"
- Type: Select
- Name: `Category`
- Add options: `Core`, `Operations`, `Reference`, `Agent Guide`, `Task Management`, `Branding`, `Other`

**3. Last Updated** (Date)
- Click "+"
- Type: Date
- Name: `Last Updated`

**4. Status** (Select)
- Click "+"
- Type: Select
- Name: `Status`
- Add options: `Current` (green), `Needs Review` (yellow), `Stale` (red)

**5. Responsible Agent** (Select)
- Click "+"
- Type: Select
- Name: `Responsible Agent`
- Add options: `Claude`, `Gemini`, `Carlo`, `All Agents`

**6. Git Commit Hash** (Text)
- Click "+"
- Type: Text
- Name: `Git Commit Hash`

**7. Auto-sync Status** (Checkbox)
- Click "+"
- Type: Checkbox
- Name: `Auto-sync Status`

### 1.4 Get Database ID
1. Click "..." menu (top right of database)
2. Click "Copy link"
3. URL looks like: `https://notion.so/workspace/DATABASE_ID?v=...`
4. Extract the DATABASE_ID (the part before `?v=`)

Example:
- URL: `https://notion.so/myspace/abc123def456?v=xyz`
- Database ID: `abc123def456` ← **This is what you need**

---

## Step 2: Configure GitHub Secrets (1 minute)

1. Go to: https://github.com/carlo-spada/ori-platform/settings/secrets/actions
2. Click "New repository secret"
3. Add these two secrets:

**Secret 1: NOTION_API_KEY**
- Name: `NOTION_API_KEY`
- Value: (your Notion API key - starts with `ntn_`)

**Secret 2: NOTION_DATABASE_ID**
- Name: `NOTION_DATABASE_ID`
- Value: (paste the Database ID from Step 1.4)

---

## Step 3: Test It! (1 minute)

```bash
# Set environment variables
export NOTION_API_KEY="your-notion-api-key"
export NOTION_DATABASE_ID="your-database-id-here"  # Replace with yours!

# Test connection
node scripts/test-notion-connection.js

# Sync first doc
node scripts/sync-docs-to-notion.js "README.md"
```

Expected output:
```
✅ ALL TESTS PASSED!
🎉 Your Notion integration is working correctly!
```

Then check your Notion database - you should see README synced!

---

## ✅ Done! What Happens Now

### Automatic (Zero Work)
- Every commit with `.md` changes → Auto-syncs to Notion in 30-60 seconds
- Daily at 9 AM UTC → Checks for stale docs (30+ days old)
- Creates GitHub issue if stale docs found

### Manual (When You Want)
```bash
# Sync more docs
node scripts/sync-docs-to-notion.js "CLAUDE.md AGENTS.md GEMINI.md"

# Check health
node scripts/generate-weekly-doc-report.js
```

---

## Troubleshooting

**"object_not_found"**
→ Database ID is wrong. Copy the link again and extract the ID carefully.

**"unauthorized"**
→ API key is wrong. Double-check it matches.

**"validation_error"**
→ Missing a property. Go back to Step 1.3 and add all 7 properties.

---

## That's It!

You now have:
✅ Automatic documentation sync
✅ Staleness monitoring
✅ Health tracking
✅ Visual dashboard in Notion

**Next**: Just keep committing markdown files - they'll appear in Notion automatically!
