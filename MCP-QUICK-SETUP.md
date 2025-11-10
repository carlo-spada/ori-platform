# MCP Quick Setup - 5 Minute Guide

## Step 1: Open Config (30 seconds)

1. Open Claude Desktop
2. Settings → Developer → "Edit Config"

## Step 2: Copy This Configuration (2 minutes)

```json
{
  "preferences": {
    "quickEntryDictationShortcut": "off",
    "menuBarEnabled": false,
    "quickEntryShortcut": "off"
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/carlo/Desktop/Projects/ori-platform"
      ]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.supabase.com/mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "REPLACE_WITH_YOUR_TOKEN"
      }
    }
  }
}
```

## Step 3: Get GitHub Token (2 minutes)

1. Go to: https://github.com/settings/tokens/new
2. Name: "Claude Desktop MCP"
3. Expiration: 90 days
4. Scopes: Check `repo` and `workflow`
5. Click "Generate token"
6. Copy token (starts with `ghp_`)
7. Replace `REPLACE_WITH_YOUR_TOKEN` in config above

## Step 4: Save & Restart (30 seconds)

1. Save configuration file
2. **Completely quit** Claude Desktop (⌘+Q on Mac)
3. Restart Claude Desktop
4. Look for MCP icon (🔌) in bottom-right of chat input

## Step 5: Test It! (1 minute)

**In Claude Desktop, try these:**

- "List all TypeScript files in src/components/"
- "Show me the user_profiles table schema" (will prompt for Supabase OAuth first time)
- "List open issues in carlo-spada/ori-platform"

## ✅ Success = 5-10x Faster Development

**Before MCP:**

- Read file: Use tool, wait, copy output (20 seconds)
- Database query: Switch to Supabase UI, write SQL, run (2 minutes)
- GitHub operation: Use gh CLI, parse output (1 minute)

**After MCP:**

- Read file: Ask Claude → done (3 seconds)
- Database query: Ask Claude → done (5 seconds)
- GitHub operation: Ask Claude → done (5 seconds)

## Full Documentation

See `.tasks/in-progress/mcp-setup-guide.md` for complete guide including:

- Troubleshooting
- Stripe MCP (optional)
- Security best practices
- Advanced configuration options
