# Notion MCP Server Setup Guide

Complete guide to setting up the official Notion MCP server for seamless documentation sync and collaboration.

## What is This?

The Notion MCP (Model Context Protocol) server allows Claude to directly interact with your Notion workspace through standardized tools. This means you can:

- **Sync docs automatically**: Claude can push documentation to Notion
- **Search Notion**: Query your Notion workspace from Claude
- **Create/update pages**: Manage Notion content via Claude commands
- **Read content**: Pull information from Notion into conversations

## Prerequisites

- Notion workspace with admin access
- Claude Desktop app installed
- 5 minutes for setup

---

## Step 1: Create Notion Integration

### 1.1 Go to Integrations Page

Visit: https://www.notion.so/profile/integrations

### 1.2 Create New Integration

1. Click **+ New integration**
2. Configure:
   - **Name**: "Claude MCP Server"
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration

### 1.3 Set Capabilities

Go to **Configuration** tab and set:

- **Content Capabilities**:
  - ✅ Read content
  - ✅ Update content
  - ✅ Insert content
  - ❌ Delete content (keep disabled for safety)

- **Comment Capabilities**:
  - ✅ Read comments
  - ✅ Insert comments (optional)

- **User Information**:
  - ✅ Read user information (optional, for better context)

### 1.4 Copy Integration Token

1. Click **Show** next to "Internal Integration Secret"
2. Copy the token (starts with `ntn_`)
3. **⚠️ Keep this secure!** Treat it like a password

---

## Step 2: Grant Integration Access to Pages

You have two options:

### Option A: Grant Access to Entire Workspace (Recommended)

1. Go to **Access** tab in your integration settings
2. Click **Add connections**
3. Select your workspace
4. This gives the integration access to all pages you can access

### Option B: Grant Access to Specific Pages

1. Open a Notion page you want Claude to access
2. Click the **•••** menu (top right)
3. Scroll down to **Connections**
4. Click **+ Add connections**
5. Search for "Claude MCP Server"
6. Click to connect
7. Repeat for each page you want accessible

---

## Step 3: Configure Claude Desktop

### 3.1 Locate Configuration File

The config file is at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 3.2 Add Notion MCP Server

The configuration has already been added! Just replace the token:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "NOTION_TOKEN": "ntn_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

**Replace `YOUR_NOTION_INTEGRATION_TOKEN`** with your actual token from Step 1.4.

### 3.3 Restart Claude Desktop

1. Quit Claude Desktop completely (Cmd+Q)
2. Reopen Claude Desktop
3. The Notion MCP server will load automatically

---

## Step 4: Verify Setup

### 4.1 Check MCP Tools

In Claude Desktop, ask:

> "What Notion tools do you have available?"

You should see tools like:
- `mcp__notion__search`
- `mcp__notion__retrieve_page`
- `mcp__notion__create_page`
- `mcp__notion__update_page`
- And more...

### 4.2 Test Basic Functionality

Try this command:

> "Search my Notion workspace for pages about documentation"

Claude should use the `mcp__notion__search` tool and return results.

---

## Available Notion Tools

Once configured, Claude has access to these MCP tools:

### Search & Retrieve
- **`mcp__notion__search`** - Search workspace for pages/databases
- **`mcp__notion__retrieve_page`** - Get specific page content
- **`mcp__notion__retrieve_database`** - Get database structure
- **`mcp__notion__query_database`** - Query database with filters

### Create & Update
- **`mcp__notion__create_page`** - Create new pages
- **`mcp__notion__update_page`** - Update existing pages
- **`mcp__notion__append_blocks`** - Add content to pages
- **`mcp__notion__update_block`** - Modify specific blocks

### Comments
- **`mcp__notion__create_comment`** - Add comments to pages
- **`mcp__notion__retrieve_comments`** - Read page comments

### Users
- **`mcp__notion__list_users`** - Get workspace members
- **`mcp__notion__retrieve_user`** - Get user details

---

## Usage Examples

### Example 1: Sync Documentation to Notion

Instead of using the script, you can now ask Claude:

> "Read the OAuth setup guide from docs/OAUTH_SETUP_GUIDE.md and create a Notion page for it in my Documentation database"

Claude will:
1. Read the markdown file
2. Convert it to Notion blocks
3. Create a page in your specified database

### Example 2: Update Existing Documentation

> "Update the Notion page titled 'OAuth Setup Guide' with the latest content from docs/OAUTH_SETUP_GUIDE.md"

### Example 3: Search and Summarize

> "Search my Notion workspace for all pages about authentication and give me a summary"

### Example 4: Create New Page

> "Create a new Notion page titled 'API Changelog' with today's changes from git log"

---

## Common Use Cases

### 1. Documentation Workflow

**Old way (script):**
```bash
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md
```

**New way (MCP):**
> "Sync docs/OAUTH_SETUP_GUIDE.md to Notion"

### 2. Meeting Notes

> "Create a Notion page for today's standup with these notes: [your notes]"

### 3. Task Management

> "Create a task in my Notion Tasks database: 'Implement OAuth error handling'"

### 4. Knowledge Base Search

> "Search Notion for information about Stripe webhook setup"

---

## Troubleshooting

### "Notion MCP tools not available"

**Solution:**
1. Check token is correct in config file
2. Restart Claude Desktop completely (Cmd+Q)
3. Check for typos in config JSON
4. Verify config file has valid JSON (use https://jsonlint.com)

### "Integration cannot access page"

**Solution:**
1. Go to the page in Notion
2. Click **•••** → **Connections**
3. Verify "Claude MCP Server" is connected
4. If not, add the connection

### "Invalid token error"

**Solution:**
1. Go to https://www.notion.so/profile/integrations
2. Find "Claude MCP Server" integration
3. Regenerate the token
4. Update `claude_desktop_config.json` with new token
5. Restart Claude Desktop

### "Cannot create page"

**Possible causes:**
- Integration doesn't have "Insert content" capability
- Integration not connected to target database/page
- Database properties don't match

**Solution:**
1. Check integration capabilities in Notion settings
2. Ensure integration is connected to the database
3. Verify you're using correct database ID

### MCP Server Not Loading

**Check logs:**
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Common issues:**
- Network connectivity
- npx cache issues (clear with: `rm -rf ~/.npm/_npx`)
- Node.js version (requires Node 18+)

---

## Security Best Practices

### Token Security

1. **Never commit token to git**
   - Config file is in `~/Library/Application Support/Claude/` (not in repo)
   - Still, double-check git status before commits

2. **Rotate tokens periodically**
   - Regenerate every 3-6 months
   - Regenerate immediately if compromised

3. **Limit integration capabilities**
   - Only enable what you need
   - Keep "Delete content" disabled

4. **Review integration access**
   - Periodically audit which pages integration can access
   - Remove access from sensitive pages

### Workspace Security

1. **Use separate integrations for different purposes**
   - One for Claude
   - One for automation
   - One for testing

2. **Monitor integration activity**
   - Check Notion audit log regularly
   - Look for unexpected page modifications

3. **Limit team access**
   - Only admins should create integrations
   - Regular members shouldn't see integration tokens

---

## Advantages Over Script Approach

| Feature | Script | MCP Server |
|---------|--------|------------|
| **Ease of use** | Manual command | Natural language |
| **Context aware** | No | Yes - Claude sees full conversation |
| **Flexibility** | Fixed markdown→Notion | Any operation |
| **Error handling** | Manual retry | Claude handles automatically |
| **Integration** | Separate step | Seamless in conversation |
| **Search** | Not possible | Full workspace search |
| **Updates** | Full page replace | Targeted updates |
| **Real-time** | Batch operation | Interactive |

---

## Comparison: Script vs MCP

### Script Approach
```bash
# Terminal workflow
cd /path/to/project
tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md

# Wait for completion
# Check Notion manually
# Fix errors and re-run if needed
```

### MCP Approach
```
# Natural conversation with Claude
You: "Sync the OAuth guide to Notion"
Claude: [Uses MCP tools automatically]
Claude: "Done! I've created a page titled 'OAuth Setup Guide' in your Documentation database."

You: "Can you add a note at the top saying this was updated today?"
Claude: [Updates the page]
Claude: "Added the note!"
```

---

## Next Steps

### Immediate

1. ✅ Integration created
2. ✅ Token configured in Claude
3. ✅ Claude Desktop restarted
4. 🔄 Test by asking: "What Notion tools do you have?"

### Optional Enhancements

1. **Create Database Structure**
   - Create "Documentation" database in Notion
   - Add properties: Status, Category, Last Updated
   - Give integration access

2. **Set Up Templates**
   - Create page templates in Notion
   - Claude can duplicate them when creating pages

3. **Organize Workspaces**
   - Create dedicated workspace for docs
   - Set up views and filters

4. **Automate Workflows**
   - Ask Claude to sync docs on schedule
   - Create pages from commit messages
   - Update changelog automatically

---

## Configuration Reference

### Full Config Example

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "NOTION_TOKEN": "ntn_1234567890abcdef"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NOTION_TOKEN` | Integration token | `ntn_abc123...` |
| `OPENAPI_MCP_HEADERS` | Custom headers (advanced) | `{"X-Custom": "value"}` |

---

## Support Resources

### Official Documentation
- **Notion API**: https://developers.notion.com/
- **Notion Integrations**: https://www.notion.so/profile/integrations
- **MCP Protocol**: https://modelcontextprotocol.io/

### Package Information
- **npm**: https://www.npmjs.com/package/@notionhq/notion-mcp-server
- **GitHub**: https://github.com/makenotion/notion-mcp-server
- **Version**: 1.9.0 (latest)

### Getting Help

1. **Check Claude logs**: `~/Library/Logs/Claude/`
2. **Verify config**: Use JSON validator
3. **Test connection**: Ask Claude to list Notion tools
4. **Review integration**: Check access in Notion settings

---

## Cleanup (If Needed)

### Remove MCP Server

1. Remove from config:
   ```bash
   # Edit this file:
   ~/Library/Application Support/Claude/claude_desktop_config.json

   # Remove the "notion" section
   ```

2. Restart Claude Desktop

### Revoke Integration

1. Go to https://www.notion.so/profile/integrations
2. Find "Claude MCP Server"
3. Click **•••** → **Delete integration**

### Clear Cache

```bash
# Clear npx cache
rm -rf ~/.npm/_npx

# Clear Claude cache (if needed)
rm -rf ~/Library/Application\ Support/Claude/Cache
```

---

## FAQ

**Q: Do I need the sync script anymore?**
A: No! The MCP server replaces the script with more powerful capabilities.

**Q: Can I use both MCP and script?**
A: Yes, but MCP is recommended for better integration with Claude.

**Q: Is my token secure in the config file?**
A: Yes, the file is in your user directory with restricted permissions. Just don't commit it to git.

**Q: Can multiple Claude instances share one integration?**
A: Yes, but each needs the token configured separately.

**Q: Does this work with Notion personal accounts?**
A: Yes! Works with personal, team, and enterprise workspaces.

**Q: What happens if my token expires?**
A: Notion tokens don't expire unless you revoke them. Just regenerate and update config if needed.

---

## Status

✅ **MCP server configured in Claude Desktop**
⚠️ **You need to add your NOTION_TOKEN**

Setup time: ~5 minutes
First use: Immediate after restart

---

**Updated**: 2024-11-10
**Version**: Notion MCP Server 1.9.0
**Status**: Production Ready
