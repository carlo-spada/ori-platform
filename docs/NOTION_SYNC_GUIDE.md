# Notion Documentation Sync Guide

This guide explains how to sync your documentation files from the `/docs` directory to Notion for easier review and collaboration.

## Prerequisites

- Notion workspace with admin access
- Node.js and pnpm installed
- Access to create Notion integrations

---

## 1. Create Notion Integration

### Step 1: Create Integration Token

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Configure integration:
   - **Name**: "Ori Documentation Sync"
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration
   - **Capabilities**:
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content
4. Click **Submit**
5. Copy the **Internal Integration Token** (starts with `secret_`)
   - ⚠️ **Important**: Keep this token secure!

### Step 2: Create Notion Database

1. Open Notion and create a new page
2. Add a **Database - Table** to the page
3. Name it "Documentation"
4. Add these properties (or keep defaults):
   - **Name** (Title) - Will contain document titles
   - **Created** (Date) - Optional, tracks creation date
   - **Last Updated** (Date) - Optional, tracks updates
5. Click **Share** in top right
6. Click **Invite** and select your integration "Ori Documentation Sync"
7. Copy the **Database ID** from the URL:
   ```
   https://notion.so/workspace/[THIS_IS_YOUR_DATABASE_ID]?v=...
   ```

---

## 2. Configure Environment

Add these environment variables to your shell profile or `.env` file:

```bash
# Notion Integration
export NOTION_API_TOKEN="secret_your_token_here"
export NOTION_DATABASE_ID="your_database_id_here"
```

### For macOS/Linux (bash/zsh):

```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export NOTION_API_TOKEN="secret_your_token_here"' >> ~/.zshrc
echo 'export NOTION_DATABASE_ID="your_database_id_here"' >> ~/.zshrc
source ~/.zshrc
```

### Verify Configuration:

```bash
echo $NOTION_API_TOKEN
echo $NOTION_DATABASE_ID
```

---

## 3. Run Sync Script

### Sync All Documentation

Syncs all `.md` files in `/docs` directory:

```bash
tsx scripts/sync-to-notion.ts
```

### Sync Specific File

Sync only one file:

```bash
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md
```

### Dry Run (Preview)

Preview what would be synced without making changes:

```bash
tsx scripts/sync-to-notion.ts --dry-run
```

---

## 4. How It Works

### Markdown to Notion Conversion

The script converts markdown syntax to Notion blocks:

| Markdown | Notion Block |
|----------|--------------|
| `# Heading 1` | Heading 1 |
| `## Heading 2` | Heading 2 |
| `### Heading 3` | Heading 3 |
| \`\`\`code\`\`\` | Code block |
| `* List item` | Bulleted list |
| `1. Item` | Numbered list |
| `- [ ] Task` | Checkbox (unchecked) |
| `- [x] Task` | Checkbox (checked) |
| `> Quote` | Quote block |
| `---` | Divider |
| Regular text | Paragraph |

### Sync Behavior

1. **First Sync**: Creates new page in database with document content
2. **Subsequent Syncs**: Updates existing page by:
   - Finding page by title
   - Deleting old content
   - Adding updated content
3. **Title Generation**: Converts filename to title
   - `OAUTH_SETUP_GUIDE.md` → "OAuth Setup Guide"
   - `database-schema.md` → "Database Schema"

### Content Limits

- **Paragraph/Code blocks**: 2000 characters max
  - Longer content is automatically split into multiple blocks
- **Blocks per request**: 100 blocks
  - Script automatically chunks larger documents

---

## 5. Reviewing in Notion

### Accessing Synced Docs

1. Open your Notion workspace
2. Navigate to "Documentation" database
3. Click on any document to view/edit
4. Use Notion's collaboration features:
   - Add comments
   - Assign tasks
   - Create linked databases
   - Export to PDF

### Notion Advantages

- **Better readability**: Native Notion formatting
- **Collaboration**: Comments, mentions, sharing
- **Organization**: Tags, filters, views
- **Mobile access**: Review docs on phone/tablet
- **Version history**: Track changes over time

---

## 6. Workflow Integration

### Recommended Workflow

1. **Write/Update docs in repo**: Edit markdown files as usual
2. **Sync to Notion**: Run sync script after major changes
3. **Review in Notion**: Use Notion for reading and feedback
4. **Make changes in repo**: Apply feedback to markdown files
5. **Re-sync**: Update Notion with latest changes

### Automated Sync (Optional)

Add to git hooks or CI/CD:

```bash
# .git/hooks/post-commit
#!/bin/bash
if git diff-tree --name-only -r HEAD | grep -q '^docs/'; then
  echo "📚 Docs changed, syncing to Notion..."
  tsx scripts/sync-to-notion.ts
fi
```

---

## 7. Troubleshooting

### "NOTION_API_TOKEN environment variable is required"

**Solution**: Ensure environment variable is set:
```bash
export NOTION_API_TOKEN="secret_your_token_here"
```

### "NOTION_DATABASE_ID environment variable is required"

**Solution**: Set database ID:
```bash
export NOTION_DATABASE_ID="your_database_id_here"
```

### "Notion API error: 401 Unauthorized"

**Possible causes**:
1. Integration token is incorrect
2. Token has expired
3. Integration not invited to database

**Solution**:
1. Verify token is correct
2. Create new integration if needed
3. Re-invite integration to database

### "Notion API error: 404 Not Found"

**Possible causes**:
1. Database ID is incorrect
2. Integration doesn't have access
3. Database was deleted

**Solution**:
1. Verify database ID from URL
2. Check integration has access to database
3. Ensure database exists

### "Cannot find page by title"

**Note**: This is normal on first sync. The script will create a new page.

### Sync Fails Midway

**Solution**: Re-run the script. It will:
- Skip already synced pages
- Update partially synced pages
- Continue from where it stopped

---

## 8. File Structure

```
/Users/carlo/Desktop/Projects/ori-platform/
├── scripts/
│   └── sync-to-notion.ts       # Sync script
├── docs/
│   ├── OAUTH_SETUP_GUIDE.md    # Example doc
│   ├── NOTION_SYNC_GUIDE.md    # This guide
│   └── ...                      # All other docs
```

---

## 9. Script Features

### Command Line Options

```bash
# Sync all docs
tsx scripts/sync-to-notion.ts

# Sync specific file
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md

# Dry run (no changes)
tsx scripts/sync-to-notion.ts --dry-run

# Combine options
tsx scripts/sync-to-notion.ts docs/specific.md --dry-run
```

### Output Example

```
🚀 Notion Documentation Sync
==================================================

📚 Found 3 markdown file(s)

📄 Processing: docs/OAUTH_SETUP_GUIDE.md
   Title: OAuth Setup Guide
   Blocks: 145
   ➕ Creating new page...
   ✅ Created: abc123def456

📄 Processing: docs/DATABASE_SCHEMA.md
   Title: Database Schema
   Blocks: 89
   🔄 Updating existing page...
   ✅ Updated: def456abc789

==================================================
📊 Summary:
   Created: 1
   Updated: 1
   Skipped: 0
   Errors:  0

✅ Sync complete!
```

---

## 10. Advanced Usage

### Custom Page Properties

To add custom properties to synced pages, modify the `createNotionPage` function:

```typescript
const page = await notionRequest('/pages', 'POST', {
  parent: { database_id: NOTION_DATABASE_ID },
  properties: {
    title: {
      title: [{ type: 'text', text: { content: title } }],
    },
    // Add custom properties
    Status: {
      select: { name: 'Synced' },
    },
    Category: {
      select: { name: 'Documentation' },
    },
  },
  children: initialBlocks,
})
```

### Filtering Files

To sync only specific docs, modify the file filter:

```typescript
// Only sync files starting with "CORE_"
const files = getAllMarkdownFiles(docsDir).filter((f) =>
  path.basename(f).startsWith('CORE_')
)
```

---

## 11. Security Best Practices

1. **Never commit tokens**: Keep `NOTION_API_TOKEN` out of git
2. **Use environment variables**: Don't hardcode credentials
3. **Limit integration scope**: Only grant necessary permissions
4. **Rotate tokens periodically**: Create new integrations regularly
5. **Review access logs**: Check Notion integration activity

---

## 12. Next Steps

After setting up Notion sync:

1. **Test with one file**: Sync OAuth guide first
2. **Verify in Notion**: Check formatting and content
3. **Sync all docs**: Run full sync if test succeeds
4. **Share with team**: Invite team members to Notion database
5. **Set up routine**: Sync after major documentation updates

---

## Support

### Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion Integrations](https://www.notion.so/my-integrations)
- [Script source code](../scripts/sync-to-notion.ts)

### Issues

If you encounter issues:
1. Check environment variables are set
2. Verify integration has database access
3. Review Notion API error messages
4. Check script output for details

---

## Example: First Time Setup

Complete walkthrough:

```bash
# 1. Create integration at notion.so/my-integrations
# 2. Create database in Notion and invite integration
# 3. Set environment variables
export NOTION_API_TOKEN="secret_ABC123..."
export NOTION_DATABASE_ID="def456ghi789..."

# 4. Test with dry run
tsx scripts/sync-to-notion.ts --dry-run

# 5. Sync OAuth guide as test
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md

# 6. Check Notion - verify content looks good

# 7. Sync all docs
tsx scripts/sync-to-notion.ts

# 8. Done! Check Notion database for all docs
```

---

## Changelog

- **2024-11-10**: Initial release
  - Markdown to Notion conversion
  - Create and update pages
  - Dry run mode
  - Batch sync support
