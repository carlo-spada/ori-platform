# MCP Servers Setup Guide

**Status**: IN PROGRESS
**Owner**: Claude
**Estimated Time**: 3 hours

## Overview

Setting up Model Context Protocol (MCP) servers to enable direct integrations with:
1. Filesystem (project files)
2. PostgreSQL/Supabase (database)
3. GitHub (repository operations)
4. Stripe (payments, optional)

## Prerequisites

- [x] Node.js installed (LTS version)
- [x] Claude Desktop app installed
- [ ] Supabase credentials (from project dashboard)
- [ ] GitHub Personal Access Token
- [ ] Stripe API key (optional, for later)

## Configuration File Location

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

**How to Access**:
1. Open Claude Desktop
2. Go to Settings → Developer
3. Click "Edit Config"

## Step-by-Step Setup

### 1. Filesystem MCP Server (5 minutes)

**Purpose**: Allow Claude to read/write project files directly

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/carlo/Desktop/Projects/ori-platform"
      ]
    }
  }
}
```

**Benefits**:
- Read any file in the project
- Create/edit files
- Search across codebase
- No need to manually paste file contents

**Test**:
After restart, ask Claude: "List all files in src/components/"

### 2. PostgreSQL/Supabase MCP Server (15 minutes)

**Purpose**: Direct database queries and schema inspection

**Get Credentials**:
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to Settings → Database
4. Copy Connection String (Session mode)
5. Replace `[YOUR-PASSWORD]` with actual password

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": { ... },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.PROJECT_REF.supabase.co:5432/postgres"
      ],
      "env": {
        "PGPASSWORD": "your_password_here"
      }
    }
  }
}
```

**Security Note**: Store password securely. Consider using environment variables:
```json
"env": {
  "PGPASSWORD": "${SUPABASE_DB_PASSWORD}"
}
```

Then set in shell profile:
```bash
# Add to ~/.zshrc or ~/.bashrc
export SUPABASE_DB_PASSWORD="your_password"
```

**Benefits**:
- Query tables directly
- Inspect schema
- Run migrations
- Debug data issues

**Test**:
Ask Claude: "Show me the schema of the user_profiles table"

### 3. GitHub MCP Server (10 minutes)

**Purpose**: Repository operations (issues, PRs, commits, workflows)

**Get GitHub Token**:
1. Go to: https://github.com/settings/tokens/new
2. Scopes needed:
   - `repo` (full control of private repos)
   - `workflow` (manage GitHub Actions)
   - `read:org` (if working with orgs)
3. Generate token and copy

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": { ... },
    "postgres": { ... },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Benefits**:
- Create/update issues
- Manage PRs
- Trigger workflows
- Check CI status
- No need to use `gh` CLI commands

**Test**:
Ask Claude: "List open issues in carlo-spada/ori-platform"

### 4. Stripe MCP Server (Optional - 10 minutes)

**Purpose**: Payment operations, webhook testing

**Get Stripe Key**:
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy "Secret key" (starts with `sk_test_`)

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": { ... },
    "postgres": { ... },
    "github": { ... },
    "stripe": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-stripe"
      ],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key"
      }
    }
  }
}
```

**Benefits**:
- Create customers
- Manage subscriptions
- Test webhooks
- Query payment data

**Test**:
Ask Claude: "List recent Stripe customers"

## Complete Configuration Template

Save this to `claude_desktop_config.json`:

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
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.YOUR_PROJECT_REF.supabase.co:5432/postgres"
      ],
      "env": {
        "PGPASSWORD": "${SUPABASE_DB_PASSWORD}"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## Activation

1. Save configuration file
2. **Completely quit** Claude Desktop (⌘+Q on Mac, not just close window)
3. Restart Claude Desktop
4. Look for MCP indicator in bottom-right of chat input
5. You should see icons for each connected server

## Troubleshooting

### "Cannot connect to MCP server"

**Windows users**: Use full path instead of `npx`:
```json
"command": "C:\\Program Files\\nodejs\\npx.cmd"
```

**Mac users**: Verify npx is in PATH:
```bash
which npx
# Should output: /usr/local/bin/npx or similar
```

### "Authentication failed" (PostgreSQL)

- Check password is correct
- Verify project ref in connection string
- Ensure Supabase allows direct database connections

### "GitHub API rate limit"

- Verify token has correct scopes
- Check token hasn't expired
- Try regenerating token

### MCP icon not showing

- Ensure you completely quit Claude Desktop (not just minimized)
- Check configuration JSON is valid (no syntax errors)
- Look for error logs in Claude Desktop console

## Verification Checklist

After setup, test each server:

**Filesystem**:
- [ ] Can list project files
- [ ] Can read file contents
- [ ] Can create new files

**PostgreSQL/Supabase**:
- [ ] Can query tables
- [ ] Can inspect schema
- [ ] Can run SELECT statements

**GitHub**:
- [ ] Can list issues
- [ ] Can view PR status
- [ ] Can check workflow runs

**Stripe** (if configured):
- [ ] Can list customers
- [ ] Can create test customer
- [ ] Can query subscriptions

## Security Best Practices

1. **Never commit credentials** to git
2. Use environment variables for sensitive data
3. Use test keys when possible (Stripe, etc.)
4. Rotate tokens regularly
5. Use minimum required scopes for GitHub token
6. Consider using separate database user with read-only access for queries

## Next Steps After Setup

With MCP servers connected, you can now:

1. **Database Operations**: Query user data, inspect schema, debug issues
2. **GitHub Management**: Create issues, manage PRs, trigger workflows
3. **File Operations**: Read/write code without manual copy-paste
4. **Stripe Testing**: Test payment flows, inspect subscription data

## Expected Productivity Gains

**Before MCP**:
- Read file: Copy path → use Read tool → wait for response (10-20 seconds)
- Database query: Write SQL → run in Supabase UI → copy results (1-2 minutes)
- GitHub operation: Use gh CLI → parse output (30 seconds - 1 minute)

**After MCP**:
- Read file: Ask Claude → instant response (2-3 seconds)
- Database query: Ask Claude → instant results (5 seconds)
- GitHub operation: Ask Claude → done (5 seconds)

**Net Result**: 5-10x faster for common operations

## Documentation References

- MCP Official Docs: https://modelcontextprotocol.io
- MCP Servers Repo: https://github.com/modelcontextprotocol/servers
- Supabase MCP: https://supabase.com/docs/guides/getting-started/mcp

## Status Tracking

- [ ] Filesystem MCP configured
- [ ] PostgreSQL/Supabase MCP configured
- [ ] GitHub MCP configured
- [ ] Stripe MCP configured (optional)
- [ ] All servers tested and verified
- [ ] Documentation updated in project README
