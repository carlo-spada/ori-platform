# Notion Setup Checklist - Step by Step

**Time Required**: 15-20 minutes
**Your API Key**: (provided separately - do not commit to git)

---

## ☐ Step 1: Create Notion Database (5 minutes)

### 1.1 Create New Page
- [ ] Open Notion (https://notion.so)
- [ ] Click "+ New page" in your workspace
- [ ] Title the page: **"Ori Platform Documentation"**

### 1.2 Create Database
- [ ] Type `/database` in the page
- [ ] Select "Table - Inline"
- [ ] Title the database: **"Documentation Hub"**

### 1.3 Add Properties

Click the "+ Add a property" button and create each of these:

**Property 1: Git Path**
- [ ] Name: `Git Path`
- [ ] Type: `Text`

**Property 2: Category**
- [ ] Name: `Category`
- [ ] Type: `Select`
- [ ] Add options: `Core`, `Operations`, `Reference`, `Agent Guide`, `Task Management`, `Branding`, `Other`

**Property 3: Last Updated**
- [ ] Name: `Last Updated`
- [ ] Type: `Date`

**Property 4: Status**
- [ ] Name: `Status`
- [ ] Type: `Select`
- [ ] Add options: `Current`, `Needs Review`, `Stale`
- [ ] Optional: Color `Current` green, `Needs Review` yellow, `Stale` red

**Property 5: Responsible Agent**
- [ ] Name: `Responsible Agent`
- [ ] Type: `Select`
- [ ] Add options: `Claude`, `Gemini`, `Carlo`, `All Agents`

**Property 6: Git Commit Hash**
- [ ] Name: `Git Commit Hash`
- [ ] Type: `Text`

**Property 7: Auto-sync Status**
- [ ] Name: `Auto-sync Status`
- [ ] Type: `Checkbox`

### 1.4 Get Database ID
- [ ] Click the "..." menu (top right of the database)
- [ ] Click "Copy link"
- [ ] The URL looks like: `https://notion.so/workspace/DATABASE_ID?v=...`
- [ ] Copy the DATABASE_ID part (the long string before `?v=`)
- [ ] Save it here: `_________________________________`

---

## ☐ Step 2: Share Database with Integration (CRITICAL)

**This step is often forgotten but required!**

- [ ] In your Notion database, click "Share" (top right)
- [ ] Click "Invite"
- [ ] Search for your integration (it should be named after your API key)
- [ ] Click "Invite" to give the integration access
- [ ] Verify it shows up under "Connections" in the share menu

**Without this step, the API will return "object_not_found" errors!**

---

## ☐ Step 3: Configure GitHub Secrets (3 minutes)

### 3.1 Open GitHub Settings
- [ ] Go to: https://github.com/carlo-spada/ori-platform/settings/secrets/actions
- [ ] Click "New repository secret"

### 3.2 Add NOTION_API_KEY
- [ ] Name: `NOTION_API_KEY`
- [ ] Value: (your Notion API key - starts with `ntn_`)
- [ ] Click "Add secret"

### 3.3 Add NOTION_DATABASE_ID
- [ ] Name: `NOTION_DATABASE_ID`
- [ ] Value: (paste the Database ID from Step 1.4)
- [ ] Click "Add secret"

### 3.4 Verify Secrets
- [ ] Go back to: https://github.com/carlo-spada/ori-platform/settings/secrets/actions
- [ ] Confirm both secrets are listed:
  - [ ] `NOTION_API_KEY` exists
  - [ ] `NOTION_DATABASE_ID` exists

---

## ☐ Step 4: Test Connection Locally (5 minutes)

### 4.1 Set Environment Variables

Open your terminal and run:

```bash
export NOTION_API_KEY="your-notion-api-key-here"
export NOTION_DATABASE_ID="your-database-id-from-step-1.4"
```

Replace `your-database-id-from-step-1.4` with the actual ID you copied.

### 4.2 Run Connection Test

```bash
cd /Users/carlo/Desktop/Projects/ori-platform
node scripts/test-notion-connection.js
```

### 4.3 Expected Output

You should see:
```
🔍 Testing Notion Connection...

======================================================================
✅ Environment variables found
   API Key: ntn_507908...
   Database ID: [your-id]

📊 Test 1: Retrieving database...
   ✅ Database found: "Documentation Hub"

🔧 Test 2: Checking required properties...
   ✅ Title
   ✅ Git Path
   ✅ Category
   ✅ Last Updated
   ✅ Status
   ✅ Responsible Agent
   ✅ Git Commit Hash
   ✅ Auto-sync Status

📄 Test 3: Creating test page...
   ✅ Test page created successfully
   Page ID: [page-id]
   URL: [notion-url]

🔍 Test 4: Querying database...
   ✅ Found 1 page(s) in database

✏️  Test 5: Updating test page...
   ✅ Test page updated successfully

======================================================================
✅ ALL TESTS PASSED!
======================================================================

🎉 Your Notion integration is working correctly!
```

**Checkboxes:**
- [ ] Connection test passed
- [ ] All properties validated
- [ ] Test page created in Notion
- [ ] Can see the test page in your Notion database

---

## ☐ Step 5: Sync Your First Real Doc (3 minutes)

### 5.1 Sync README.md

```bash
node scripts/sync-docs-to-notion.js "README.md"
```

### 5.2 Expected Output

```
🚀 Starting Notion Documentation Sync...

📝 Found 1 changed file(s):
   - README.md

📄 Processing: README.md
  📊 Status: Current (X days old)
  📁 Category: Other
  👤 Responsible: Carlo
  ✅ Created in Notion

✅ Notion sync complete!
```

### 5.3 Verify in Notion

- [ ] Go to your Notion "Documentation Hub" database
- [ ] You should see a new entry titled "README"
- [ ] Click on it to see the full synced content
- [ ] Content should include headings, code blocks, lists, etc.

---

## ☐ Step 6: Sync Critical Docs (2 minutes)

### 6.1 Sync Core Documentation

```bash
node scripts/sync-docs-to-notion.js "CLAUDE.md AGENTS.md GEMINI.md DOC_INDEX.md"
```

### 6.2 Verify in Notion

- [ ] Check your Notion database
- [ ] Should now have 5+ entries (including test page and README)
- [ ] Each should have proper Category, Status, and Responsible Agent

---

## ☐ Step 7: Test Staleness Checker (2 minutes)

### 7.1 Run Staleness Check

```bash
node scripts/update-notion-staleness.js
```

### 7.2 Expected Output

```
📊 Checking documentation staleness...

======================================================================
📈 DOCUMENTATION HEALTH SUMMARY
======================================================================

Total Documents: 5
✅ Current: 5 (100%)
⚠️  Needs Review (14-30 days): 0 (0%)
❌ Stale (30+ days): 0 (0%)

📊 Health Score: 100%

✅ All documentation is current! Great job! 🎉
```

**Checkboxes:**
- [ ] Staleness check ran successfully
- [ ] Health score calculated
- [ ] All docs showing as "Current" (they're fresh!)

---

## ☐ Step 8: Verify GitHub Actions (5 minutes)

### 8.1 Check Workflow Status

- [ ] Go to: https://github.com/carlo-spada/ori-platform/actions
- [ ] Look for "Sync Docs to Notion" workflow
- [ ] Click on the most recent run
- [ ] All steps should have green checkmarks

### 8.2 Trigger Manual Sync (Optional)

- [ ] Go to: https://github.com/carlo-spada/ori-platform/actions/workflows/sync-docs-to-notion.yml
- [ ] Click "Run workflow"
- [ ] Select branch: `dev`
- [ ] Click "Run workflow" button
- [ ] Wait ~30 seconds and refresh
- [ ] Workflow should complete successfully

---

## ☐ Step 9: Create Notion Views (Optional, 5 minutes)

Make your database easier to navigate:

### View 1: Stale Docs
- [ ] Click "New view" in your database
- [ ] Name: "Stale Docs"
- [ ] Type: Table
- [ ] Filter: `Status` = `Stale`
- [ ] Sort by: `Last Updated` (oldest first)

### View 2: By Category
- [ ] Click "New view"
- [ ] Name: "By Category"
- [ ] Type: Board
- [ ] Group by: `Category`

### View 3: By Agent
- [ ] Click "New view"
- [ ] Name: "By Agent"
- [ ] Type: Board
- [ ] Group by: `Responsible Agent`

---

## ☐ Step 10: Clean Up (1 minute)

- [ ] Delete the "Test Page - Can be deleted" from your Notion database (optional)
- [ ] Add your Notion database to favorites/bookmark for easy access

---

## Troubleshooting

### ❌ "object_not_found" error
**Problem**: Database ID is wrong OR integration doesn't have access

**Solution**:
1. Double-check the database ID
2. **Make sure you shared the database with your integration** (Step 2)
3. Try copying the database link again

### ❌ "unauthorized" error
**Problem**: API key is incorrect or integration lacks permissions

**Solution**:
1. Verify the API key is correct
2. Check the integration still exists in Notion settings
3. Recreate the integration if needed

### ❌ Missing properties error
**Problem**: Database is missing required properties

**Solution**:
1. Run the test script again to see which properties are missing
2. Add the missing properties to your database
3. Make sure property names match exactly (case-sensitive)

### ❌ GitHub Actions failing
**Problem**: Secrets not configured or workflow has issues

**Solution**:
1. Verify both secrets exist in GitHub settings
2. Check workflow logs for specific error messages
3. Re-run the workflow manually to test

---

## Success Criteria

### Immediate
- [x] Notion database created with all properties
- [x] Database shared with integration
- [x] GitHub secrets configured
- [x] Connection test passes
- [x] 5 critical docs synced successfully
- [x] Staleness check works
- [x] GitHub Actions workflow runs successfully

### Next Week
- [ ] All 70+ markdown files synced to Notion
- [ ] Daily staleness checks running automatically
- [ ] First health report reviewed
- [ ] Team members can access Notion documentation

---

## Quick Commands Reference

```bash
# Test connection
node scripts/test-notion-connection.js

# Sync specific file
node scripts/sync-docs-to-notion.js "path/to/file.md"

# Sync multiple files
node scripts/sync-docs-to-notion.js "file1.md file2.md file3.md"

# Check staleness
node scripts/update-notion-staleness.js

# Generate health report
node scripts/generate-weekly-doc-report.js
```

---

## Need Help?

1. Review error messages carefully
2. Check the troubleshooting section above
3. See full guide: `NOTION_SYNC_SETUP_GUIDE.md`
4. Ask Claude for help (I have full context)

---

**Status**: Ready to begin!
**Current Step**: Step 1 - Create Notion Database
**Estimated Time Remaining**: 15-20 minutes

**Once you complete all steps, mark them off and let me know! I can help troubleshoot any issues.**
