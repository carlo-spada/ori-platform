---
type: operations-guide
role: setup-guide
scope: all
audience: all-agents, developers
last-updated: 2025-11-10
relevance: mcp, model-context-protocol, setup, configuration, integration
priority: critical
quick-read-time: 5min
deep-dive-time: 30min
---

# MCP Servers - Complete Setup Guide

**⚠️ IMPORTANT: Always read [DOC_INDEX.md](../../DOC_INDEX.md) first for current project status and navigation.**

Complete guide to setting up all Model Context Protocol (MCP) servers for the Ori Platform. This is the **authoritative reference** for MCP configuration.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start (5 Minutes)](#quick-start-5-minutes)
4. [Detailed Setup by MCP Server](#detailed-setup-by-mcp-server)
   - [Filesystem MCP](#filesystem-mcp)
   - [GitHub MCP](#github-mcp)
   - [Postgres MCP](#postgres-mcp)
   - [Stripe MCP](#stripe-mcp-via-docker)
   - [Resend MCP](#resend-mcp-via-docker)
   - [Notion MCP](#notion-mcp)
5. [Environment Variable Management](#environment-variable-management)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Verification Checklist](#verification-checklist)
9. [Configuration Reference](#configuration-reference)

---

## Overview

### What are MCP Servers?

Model Context Protocol (MCP) servers enable Claude to interact directly with external systems through standardized tools. Instead of manually running commands or switching between tools, Claude can:

- **Read/write files** directly in your project
- **Query databases** without leaving the conversation
- **Manage GitHub** issues, PRs, and repos seamlessly
- **Interact with Stripe** for payment operations
- **Send emails** via Resend
- **Sync documentation** to Notion

### Why Use MCP?

**Before MCP:**
- Read file: Use tool, wait, copy output (20 seconds)
- Database query: Switch to Supabase UI, write SQL, run (2 minutes)
- GitHub operation: Use gh CLI, parse output (1 minute)

**After MCP:**
- Read file: Ask Claude → done (3 seconds)
- Database query: Ask Claude → done (5 seconds)
- GitHub operation: Ask Claude → done (5 seconds)

**Result**: 5-10x faster development workflow.

### MCP Servers in This Project

| MCP Server | Purpose | Status | Required |
|-----------|---------|--------|----------|
| **Filesystem** | File operations in project directory | ✅ Active | ✅ Yes |
| **GitHub** | Repo management, issues, PRs | ⚠️ Needs token | ✅ Yes |
| **Postgres** | Database queries (Supabase) | ⚠️ Needs config | ✅ Yes |
| **Stripe** | Payment operations | ✅ Active (Docker) | ⚠️ If payments |
| **Resend** | Email sending | ✅ Active (Docker) | ⚠️ If emails |
| **Notion** | Documentation sync | ⚠️ Needs token | ❌ Optional |

---

## Prerequisites

### Required

- **Claude Desktop** installed and configured
- **Node.js 18+** (for npx and MCP servers)
- **Git** configured with repo access
- **Terminal access** for configuration

### Optional (based on which MCPs you use)

- **GitHub account** with personal access token
- **Supabase account** with project created
- **Stripe account** (test mode)
- **Resend account** (for email)
- **Notion workspace** (for doc sync)

### Time Required

- **Quick setup** (Filesystem + GitHub): 5 minutes
- **Full setup** (all MCPs): 15-30 minutes
- **Per-MCP setup**: 2-5 minutes each

---

## Quick Start (5 Minutes)

For experienced developers who want the bare minimum to get started.

### Step 1: Open Claude Desktop Config

1. Open Claude Desktop
2. Settings → Developer → "Edit Config"
3. File opens: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Step 2: Essential Configuration

Copy this minimal config (replace paths/tokens):

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
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

### Step 3: Get GitHub Token

1. Visit: https://github.com/settings/tokens/new
2. Name: "Claude Desktop MCP"
3. Expiration: 90 days
4. Scopes: `repo`, `workflow`
5. Generate → Copy token
6. Replace `ghp_YOUR_TOKEN_HERE` in config

### Step 4: Restart

1. Save config file
2. Quit Claude Desktop (⌘+Q)
3. Restart Claude Desktop
4. Look for MCP icon (🔌) in chat input

### Step 5: Test

Ask Claude:
- "List all TypeScript files in src/components/"
- "Show recent commits in this repo"

**Success?** You're ready! Continue below for additional MCPs.

---

## Detailed Setup by MCP Server

### Filesystem MCP

**Purpose**: Direct file operations in your project directory.

**Capabilities**:
- Read files (all formats, including images, PDFs)
- Write and edit files
- Search files (glob patterns)
- List directories
- Move/rename files

**Setup**:

Already configured if you completed Quick Start. Verify path is correct:

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

**⚠️ Important**:
- Path must be absolute (not relative)
- MCP can only access files within this directory
- For multiple projects, add separate entries

**Test Commands**:
- "Read src/app/page.tsx"
- "List all files in services/core-api/src/routes/"
- "Search for all files containing 'useAuth'"

**Available Tools**:
- `mcp__filesystem__read_text_file`
- `mcp__filesystem__write_file`
- `mcp__filesystem__edit_file`
- `mcp__filesystem__list_directory`
- `mcp__filesystem__search_files`
- And more... (see [MCP_REFERENCE.md](../MCP_REFERENCE.md))

---

### GitHub MCP

**Purpose**: GitHub repository management.

**Capabilities**:
- List issues and PRs
- Create/update issues
- Manage PRs (create, merge, comment)
- Search code and repos
- View workflows and runs

**Setup**:

#### 1. Create Personal Access Token

1. Visit: https://github.com/settings/tokens/new
2. Configure:
   - **Name**: "Claude Desktop MCP"
   - **Expiration**: 90 days (recommended)
   - **Scopes**:
     - ✅ `repo` (full repo access)
     - ✅ `workflow` (GitHub Actions)
     - ❌ Others (not needed)
3. Click "Generate token"
4. **Copy immediately** (shown only once)

#### 2. Add to Config

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_abc123..."
      }
    }
  }
}
```

#### 3. Restart Claude Desktop

Quit (⌘+Q) and restart.

**Test Commands**:
- "List open issues in carlo-spada/ori-platform"
- "Show recent PRs"
- "Create issue: Fix login redirect bug"

**Security Notes**:
- Token has **full repo access** - keep secure
- Rotate every 90 days
- Revoke immediately if compromised
- Never commit to git

---

### Postgres MCP

**Purpose**: Direct database queries to Supabase PostgreSQL.

**Capabilities**:
- Read-only SQL queries
- View table schemas
- List RLS policies
- Inspect database structure

**⚠️ Important**: This MCP is **read-only** by design. Use Supabase Dashboard for writes/migrations.

**Setup**:

#### 1. Get Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh)
2. Settings → Database → Connection String
3. Select **URI** format
4. Copy connection string:
   ```
   postgresql://postgres.[project]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

#### 2. URL-Encode Special Characters

If your password contains special characters:
- `@` → `%40`
- `:` → `%3A`
- `#` → `%23`
- `$` → `%24`

Example:
```
Password: my@pass:word
Encoded:  my%40pass%3Aword
```

#### 3. Add to Config

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://postgres.zvngsecxzcgxafbzjewh:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
      }
    }
  }
}
```

#### 4. Restart Claude Desktop

**Test Commands**:
- "Show all tables in the database"
- "Describe the user_profiles table"
- "List RLS policies on applications table"
- "SELECT count(*) FROM user_profiles"

**Available Tool**:
- `mcp__postgres__query` - Execute read-only SQL

**Common Queries**:

```sql
-- View all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Table schema
\d user_profiles

-- RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Row count
SELECT count(*) FROM user_profiles;
```

**Troubleshooting**:
- **Connection refused**: Check password encoding
- **Permission denied**: Verify user has SELECT privileges
- **Database does not exist**: Check project ID in connection string

---

### Stripe MCP (via Docker)

**Purpose**: Stripe payment operations.

**Capabilities**:
- List customers
- Create customers
- List subscriptions
- Create products/prices
- Search resources
- Fetch by ID

**Setup**:

#### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Test Mode** (toggle top-right)
3. Developers → API Keys
4. Copy **Secret Key** (starts with `sk_test_`)

#### 2. Get Webhook Secret

1. Developers → Webhooks
2. Add endpoint: `http://localhost:3001/api/v1/payments/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`
4. Copy **Signing secret** (starts with `whsec_test_`)

#### 3. Set Environment Variables

Add to your shell config (`~/.zshrc`, `~/.bashrc`):

```bash
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_test_..."
```

Then reload: `source ~/.zshrc`

#### 4. Verify MCP Docker Config

Check `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "server"],
      "env": {
        "STRIPE_API_KEY": "${STRIPE_API_KEY}",
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}"
      }
    }
  }
}
```

**Test Commands**:
- "List test customers in Stripe"
- "Create customer with email test@example.com"
- "Show recent subscriptions"

**Available Tools**:
- `mcp__MCP_DOCKER__list_customers`
- `mcp__MCP_DOCKER__create_customer`
- `mcp__MCP_DOCKER__list_subscriptions`
- `mcp__MCP_DOCKER__create_price`
- `mcp__MCP_DOCKER__search_stripe_documentation`

**Troubleshooting**:
- **Invalid API Key**: Must start with `sk_test_` (not `pk_test_`)
- **Webhook errors**: Check signing secret from Webhooks section
- **Permission denied**: Verify test mode is enabled

---

### Resend MCP (via Docker)

**Purpose**: Send transactional emails.

**Capabilities**:
- Send emails
- Preview templates
- List available templates
- Test email delivery

**Setup**:

#### 1. Get API Key

1. Go to [Resend Dashboard](https://resend.com/home)
2. API Keys → Create API Key
3. Name: "Development"
4. Copy key (starts with `re_`)

#### 2. Set Environment Variable

Add to shell config:

```bash
export RESEND_API_KEY="re_..."
```

Reload: `source ~/.zshrc`

#### 3. Verify MCP Docker Config

Check `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "server"],
      "env": {
        "RESEND_API_KEY": "${RESEND_API_KEY}"
      }
    }
  }
}
```

**Test Commands**:
- "Send test email to test@example.com"
- "Preview welcome email template"
- "Show available email templates"

**Available Tool**:
- `mcp__MCP_DOCKER__send-email`

**Example Usage**:

```typescript
mcp__MCP_DOCKER__send-email({
  from: 'onboarding@getori.app',
  to: 'user@example.com',
  subject: 'Welcome to Ori',
  html: '<p>Welcome!</p>'
})
```

---

### Notion MCP

**Purpose**: Notion workspace integration for documentation sync.

**Capabilities**:
- Search workspace
- Create/update pages
- Query databases
- Add comments
- Sync documentation

**Setup**:

#### 1. Create Notion Integration

1. Visit: https://www.notion.so/profile/integrations
2. Click **+ New integration**
3. Configure:
   - **Name**: "Claude MCP Server"
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration

#### 2. Set Capabilities

Go to **Capabilities** tab:

**Content Capabilities**:
- ✅ Read content
- ✅ Update content
- ✅ Insert content
- ❌ Delete content (keep disabled for safety)

**Comment Capabilities**:
- ✅ Read comments
- ✅ Insert comments (optional)

**User Information**:
- ✅ Read user information (optional)

#### 3. Copy Integration Token

1. Click **Show** next to "Internal Integration Secret"
2. Copy token (starts with `ntn_`)
3. **Keep secure!** Treat like a password

#### 4. Grant Page Access

**Option A: Workspace-wide (Recommended)**
1. Integration settings → Access tab
2. Add connections → Select workspace

**Option B: Per-page**
1. Open Notion page
2. ••• menu → Connections
3. Add "Claude MCP Server"
4. Repeat for each page

#### 5. Add to Config

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_..."
      }
    }
  }
}
```

#### 6. Restart Claude Desktop

**Test Commands**:
- "Search my Notion for pages about authentication"
- "Create a Notion page titled 'Test' with some content"
- "List databases in my Notion workspace"

**Available Tools**:
- `mcp__notion__search`
- `mcp__notion__create_page`
- `mcp__notion__update_page`
- `mcp__notion__query_database`
- `mcp__notion__append_blocks`
- And more...

**Usage Examples**:

**Sync documentation**:
> "Read docs/OAUTH_SETUP_GUIDE.md and create a Notion page for it"

**Update existing page**:
> "Update the Notion page titled 'OAuth Setup Guide' with latest changes"

**Search and summarize**:
> "Search my Notion for all pages about authentication and summarize"

**Troubleshooting**:
- **Tools not available**: Verify token in config, restart Claude
- **Cannot access page**: Add integration connection to page
- **Invalid token**: Regenerate at notion.so/profile/integrations

---

## Environment Variable Management

### Option 1: Shell Configuration (Recommended)

Add to `~/.zshrc`, `~/.bashrc`, or `~/.fish/config.fish`:

```bash
# MCP Environment Variables
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."
export DATABASE_URL="postgresql://..."
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_test_..."
export RESEND_API_KEY="re_..."
export NOTION_TOKEN="ntn_..."
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

**Advantages**:
- Available to all applications
- Persists across sessions
- Easy to update

### Option 2: .env.local (Project-Specific)

Create `.env.local` in project root:

```env
# MCP Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
DATABASE_URL=postgresql://...
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
RESEND_API_KEY=re_...
```

**⚠️ CRITICAL**: Add to `.gitignore`:
```gitignore
.env.local
.env*.local
```

**Advantages**:
- Per-project configuration
- Easy to share template (without secrets)
- Portable

### Option 3: Direct in MCP Config (Not Recommended)

For testing only. **Never commit secrets to config file.**

```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_hardcoded_token"
      }
    }
  }
}
```

**Disadvantages**:
- Risk of committing secrets
- Hard to rotate
- Not portable

---

## Security Best Practices

### Token Security

#### ✅ DO

1. **Use test/sandbox keys in development**
   - Stripe: `sk_test_...`, `whsec_test_...`
   - Resend: Test API key
   - GitHub: Minimal scopes needed

2. **Rotate tokens regularly**
   - GitHub: Every 90 days
   - API keys: Every 3-6 months
   - Immediately if compromised

3. **Store securely**
   - Use environment variables
   - Never commit to git
   - Use password manager for backup

4. **Limit scope/permissions**
   - GitHub: Only `repo` and `workflow`
   - Notion: Disable "Delete content"
   - Postgres: Read-only user

#### ❌ DON'T

1. **Never commit secrets**
   - Check `.gitignore` includes `.env*`
   - Review commits before pushing
   - Use git hooks to prevent

2. **Never share in plaintext**
   - Don't paste in chat/email
   - Don't include in screenshots
   - Don't log or print

3. **Never use production keys in development**
   - Always use test mode
   - Separate dev/prod environments
   - Never mix credentials

4. **Never hardcode in config**
   - Use environment variables
   - Reference with `${VAR_NAME}`
   - Keep config portable

### Notion-Specific Security

1. **Limit integration capabilities**
   - Only enable what you need
   - Keep "Delete content" disabled
   - Review periodically

2. **Control page access**
   - Only connect needed pages
   - Use workspace-wide carefully
   - Audit connections regularly

3. **Monitor activity**
   - Check Notion audit log
   - Review page modifications
   - Watch for unexpected changes

### Database Security

1. **Use read-only credentials for MCP**
   - Create separate DB user
   - Grant only SELECT permission
   - No writes via MCP

2. **URL-encode passwords**
   - Special chars break connection
   - Test encoded string
   - Document encoding used

3. **Use connection pooling**
   - Supabase pooler endpoint
   - Prevents connection exhaustion
   - Better performance

---

## Troubleshooting

### General MCP Issues

#### MCP Server Not Loading

**Symptoms**: No MCP tools available, no 🔌 icon

**Solutions**:
1. Check config syntax (valid JSON)
2. Verify environment variables set
3. Restart Claude Desktop completely (⌘+Q)
4. Check Claude logs:
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

#### Environment Variables Not Recognized

**Symptoms**: "Invalid API key" or "Connection refused"

**Solutions**:
1. Verify variables set in shell:
   ```bash
   echo $GITHUB_PERSONAL_ACCESS_TOKEN
   echo $DATABASE_URL
   ```
2. Reload shell config: `source ~/.zshrc`
3. Restart terminal
4. Check Claude reads variables (logs)

#### npx Cache Issues

**Symptoms**: MCP server fails to load, outdated version

**Solutions**:
```bash
# Clear npx cache
rm -rf ~/.npm/_npx

# Clear specific package
npm cache clean --force
```

### MCP-Specific Issues

#### Filesystem MCP

**"Cannot access path"**:
- Path must be absolute (not `~/...`)
- MCP restricted to configured directory
- Check file permissions

**"File not found"**:
- Verify path is correct
- Check file exists: `ls -la /path/to/file`
- Case-sensitive filesystem

#### GitHub MCP

**"Invalid token"**:
- Token must start with `ghp_`
- Check expiration date
- Verify scopes include `repo`, `workflow`
- Regenerate if needed

**"Not found" errors**:
- Verify repo name: `owner/repo`
- Check token has access to repo
- Ensure repo is not private (or token has access)

#### Postgres MCP

**"Connection refused"**:
- URL-encode password special characters
- Verify connection string format
- Check Supabase project is running
- Test connection with `psql`:
  ```bash
  psql "postgresql://..."
  ```

**"Permission denied"**:
- User needs SELECT privileges
- RLS policies may block queries
- Use service role for admin access

**"Syntax error"**:
- Check SQL syntax
- Ensure semicolon at end
- Escape special characters

#### Stripe MCP

**"Invalid API key"**:
- Must be secret key: `sk_test_...` (not `pk_test_...`)
- Verify test mode enabled
- Check key not revoked

**"Webhook secret invalid"**:
- Different from API key
- Get from Webhooks section
- Must start with `whsec_test_...`

#### Resend MCP

**"Invalid API key"**:
- Check key format: `re_...`
- Verify not expired
- Regenerate if stuck

**"Domain not verified"**:
- For production: Verify domain in Resend
- For dev: Use resend.dev domain

#### Notion MCP

**"Integration cannot access page"**:
- Add integration to page connections
- Or grant workspace-wide access
- Check integration not disabled

**"Invalid token"**:
- Token must start with `ntn_`
- Regenerate at notion.so/profile/integrations
- Update config with new token

---

## Verification Checklist

Use this checklist to ensure MCP setup is complete and working.

### Essential MCPs

- [ ] **Filesystem MCP**
  - [ ] Path configured correctly
  - [ ] Can list files: "List files in src/"
  - [ ] Can read files: "Read package.json"
  - [ ] 🔌 icon visible in Claude

- [ ] **GitHub MCP**
  - [ ] Token created (90-day expiration)
  - [ ] Scopes: `repo`, `workflow`
  - [ ] Can list issues: "List open issues"
  - [ ] Can view PRs: "Show recent PRs"

- [ ] **Postgres MCP**
  - [ ] Connection string configured
  - [ ] Password URL-encoded
  - [ ] Can query: "Show all tables"
  - [ ] Can describe: "Describe user_profiles"

### Optional MCPs

- [ ] **Stripe MCP** (if using payments)
  - [ ] Test API key set
  - [ ] Webhook secret configured
  - [ ] Can list: "List test customers"
  - [ ] Can create: "Create test customer"

- [ ] **Resend MCP** (if using email)
  - [ ] API key set
  - [ ] Can preview: "Show email templates"
  - [ ] Can send: "Send test email"

- [ ] **Notion MCP** (if syncing docs)
  - [ ] Integration created
  - [ ] Token configured
  - [ ] Pages connected
  - [ ] Can search: "Search Notion for..."

### General

- [ ] All environment variables set
- [ ] Claude Desktop restarted
- [ ] MCP tools available (check with: "What MCP tools do you have?")
- [ ] No errors in Claude logs
- [ ] Team members can replicate setup

---

## Configuration Reference

### Full Configuration Example

Complete `claude_desktop_config.json` with all MCPs:

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
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    },
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "server"],
      "env": {
        "STRIPE_API_KEY": "${STRIPE_API_KEY}",
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",
        "RESEND_API_KEY": "${RESEND_API_KEY}"
      }
    }
  }
}
```

### Environment Variables Reference

| Variable | MCP Server | Format | Example |
|----------|-----------|--------|---------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub | `ghp_...` | `ghp_abc123xyz...` |
| `DATABASE_URL` | Postgres | `postgresql://...` | `postgresql://user:pass@host:5432/db` |
| `STRIPE_API_KEY` | Stripe | `sk_test_...` | `sk_test_51abc...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe | `whsec_test_...` | `whsec_test_abc...` |
| `RESEND_API_KEY` | Resend | `re_...` | `re_abc123...` |
| `NOTION_TOKEN` | Notion | `ntn_...` | `ntn_abc123...` |

### File Locations

| File | Location | Purpose |
|------|----------|---------|
| **MCP Config** | `~/Library/Application Support/Claude/claude_desktop_config.json` | Claude Desktop MCP configuration |
| **Shell Config** | `~/.zshrc` or `~/.bashrc` | Environment variables (shell) |
| **Project Env** | `.env.local` | Project-specific environment variables |
| **Logs** | `~/Library/Logs/Claude/` | Claude Desktop logs |
| **This Guide** | `docs/OPERATIONS/OPS_MCP_SETUP_GUIDE.md` | Complete setup guide |
| **Quick Ref** | `MCP-QUICK-SETUP.md` | 2-minute quick reference |

---

## Additional Resources

### Documentation

- **MCP Protocol**: https://modelcontextprotocol.io/
- **Project MCP Reference**: [docs/MCP_REFERENCE.md](../MCP_REFERENCE.md)
- **Quick Setup Guide**: [MCP-QUICK-SETUP.md](../../MCP-QUICK-SETUP.md)
- **Notion MCP Package**: https://www.npmjs.com/package/@notionhq/notion-mcp-server

### External Links

- **Notion API**: https://developers.notion.com/
- **GitHub Tokens**: https://github.com/settings/tokens
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Resend Dashboard**: https://resend.com/home
- **Supabase Dashboard**: https://supabase.com/dashboard

### Support

- **Claude Desktop Logs**: `~/Library/Logs/Claude/`
- **Supabase Logs**: Dashboard → Logs
- **Stripe Logs**: Dashboard → Developers → Events
- **Notion Audit**: Workspace Settings → Audit Log

---

## Summary

### Time Investment

- **Initial setup**: 15-30 minutes
- **Per MCP**: 2-5 minutes
- **Maintenance**: Minimal (token rotation every 90 days)

### Benefits

- **5-10x faster** development workflow
- **Seamless integration** with external services
- **No context switching** between tools
- **Natural language** interface
- **Error handling** by Claude

### Next Steps

1. ✅ Complete setup using this guide
2. ✅ Verify all MCPs working (checklist above)
3. ✅ Test commands for each MCP
4. ✅ Share setup with team
5. ✅ Start using in development

---

**Status**: Production Ready
**Version**: 1.0
**Last Updated**: 2025-11-10
**Maintained By**: Ori Platform Team

---

**For quick 2-minute setup**, see: [MCP-QUICK-SETUP.md](../../MCP-QUICK-SETUP.md)
**For MCP protocol details**, see: [docs/MCP_REFERENCE.md](../MCP_REFERENCE.md)
**For project documentation**, see: [DOC_INDEX.md](../../DOC_INDEX.md)
