# Quick Start: Notion Sync

Sync your docs to Notion in 3 minutes.

## 1. Get Notion Token

1. Go to: https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Name: "Ori Docs"
4. Submit and copy the token (starts with `secret_`)

## 2. Create Database

1. Open Notion → Create new page
2. Add **Table Database**
3. Name it "Documentation"
4. Click **Share** → Invite "Ori Docs" integration
5. Copy database ID from URL:
   ```
   https://notion.so/[DATABASE_ID]?v=...
   ```

## 3. Set Environment Variables

```bash
export NOTION_API_TOKEN="secret_your_token_here"
export NOTION_DATABASE_ID="your_database_id_here"
```

## 4. Run Sync

```bash
# Test with one file
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md

# Sync all docs
tsx scripts/sync-to-notion.ts
```

## Done!

Check your Notion database - all docs should be there.

## Common Commands

```bash
# Sync all
tsx scripts/sync-to-notion.ts

# Sync one file
tsx scripts/sync-to-notion.ts docs/SPECIFIC_FILE.md

# Preview (no changes)
tsx scripts/sync-to-notion.ts --dry-run
```

## Troubleshooting

**"Environment variable required"**
```bash
# Check if set:
echo $NOTION_API_TOKEN
echo $NOTION_DATABASE_ID

# If empty, export them again
```

**"401 Unauthorized"**
- Check token is correct
- Invite integration to database

**"404 Not Found"**
- Verify database ID from URL
- Check database exists

## Full Guide

See `docs/NOTION_SYNC_GUIDE.md` for complete documentation.
