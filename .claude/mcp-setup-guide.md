# MCP Servers Setup Guide for Ori Platform

**Version**: 1.0
**Last Updated**: November 2025
**Status**: Phase 1 Implementation

---

## Quick Start (5 minutes)

### For Experienced Developers

1. **Get API Keys** (from Stripe, Resend, Supabase dashboards)
2. **Set Environment Variables** (`.env.local` or `.env`)
   ```bash
   export STRIPE_API_KEY="sk_test_..."
   export STRIPE_WEBHOOK_SECRET="whsec_test_..."
   export RESEND_API_KEY="re_test_..."
   export DATABASE_URL="postgresql://..."
   ```
3. **MCPs are ready!** (`.claude/mcp.json` is pre-configured)
4. **Verify**: Each MCP should initialize when you start Claude Code

### Environment Variables Quick Reference

| Variable | Source | Mode | Required |
|----------|--------|------|----------|
| `STRIPE_API_KEY` | Stripe Dashboard → Developers | Test/Sandbox | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers | Test/Sandbox | ✅ Yes |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | Test | ✅ Yes |
| `DATABASE_URL` | Supabase Project → Settings | Dev | ✅ Yes |

---

## Detailed Setup Guide

### Step 1: Stripe MCP Setup

**What You Need**:
- Stripe account (create at stripe.com if needed)
- Stripe test mode API keys

**How to Get Stripe Keys**:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to **Developers** → **API Keys**
4. You'll see:
   - **Publishable Key**: `pk_test_...` (for frontend)
   - **Secret Key**: `sk_test_...` (for backend/MCP)
5. Copy the **Secret Key** (starts with `sk_test_`)
6. Also get **Webhook Signing Secret**:
   - In **Developers** → **Webhooks**
   - Create endpoint: `http://localhost:3001/api/v1/payments/webhook`
   - Copy the signing secret (`whsec_test_...`)

**Set Environment Variables**:

```bash
# Add to ~/.bashrc, ~/.zshrc, or .env file
export STRIPE_API_KEY="sk_test_XXXXXXXXXXXXXXXXXXXXX"
export STRIPE_WEBHOOK_SECRET="whsec_test_XXXXXXXXXXXXXXXXXXXXX"

# Or add to .env.local for Claude Code
STRIPE_API_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXX
```

**Verify Stripe MCP Works**:

When Claude Code starts, try these prompts:
- "List test customers in Stripe"
- "Create a test customer in Stripe for test@example.com"
- "Show recent charges in Stripe"

✅ **Success**: MCP returns Stripe data without errors

---

### Step 2: Resend MCP Setup

**What You Need**:
- Resend account (create at resend.com if needed)
- Resend test API key

**How to Get Resend API Key**:

1. Go to [Resend Dashboard](https://resend.com/home)
2. Click **API Keys** in left sidebar
3. Copy the **Test API Key** (starts with `re_test_`)
4. Do NOT use production key in development

**Set Environment Variable**:

```bash
# Add to ~/.bashrc, ~/.zshrc, or .env file
export RESEND_API_KEY="re_test_XXXXXXXXXXXXXXXXXXXXX"

# Or add to .env.local for Claude Code
RESEND_API_KEY=re_test_XXXXXXXXXXXXXXXXXXXXX
```

**Verify Resend MCP Works**:

When Claude Code starts, try these prompts:
- "Preview the welcome email template"
- "Show available email templates in Resend"
- "Test sending an email with Resend"

✅ **Success**: MCP returns email data/previews without errors

---

### Step 3: PostgreSQL MCP Setup

**What You Need**:
- Supabase project connection string
- PostgreSQL database accessible (local or cloud)

**How to Get Supabase Connection String**:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`ori-platform` project)
3. Go to **Settings** → **Database** → **Connection string**
4. Copy the **Full connection string** (URI style):
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```
5. If needed, use the **Replacement string** with actual values

**Common Issues with Connection String**:

- **Password contains special characters?** URL-encode them: `%40` for `@`, `%3A` for `:`, etc.
- **Still won't connect?** Try the **Pooling connection string** instead (under Database → Connection pooling)

**Set Environment Variable**:

```bash
# Add to ~/.bashrc, ~/.zshrc, or .env file
export DATABASE_URL="postgresql://user:password@host:5432/database"

# Or add to .env.local for Claude Code
DATABASE_URL=postgresql://user:password@host:5432/database

# Example (do NOT use these values):
# DATABASE_URL=postgresql://postgres:mypassword@db.supabase.co:5432/postgres
```

**Verify PostgreSQL MCP Works**:

When Claude Code starts, try these prompts:
- "Show all tables in the database"
- "Describe the user_profiles table"
- "List RLS policies on the applications table"
- "Show row counts for all tables"

✅ **Success**: MCP returns database schema/data without errors

---

## Configuration File Reference

**Location**: `.claude/mcp.json`

This file is **committed to git** and contains the MCP server configurations:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-stripe"],
      "env": {
        "STRIPE_API_KEY": "${STRIPE_API_KEY}",
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}"
      },
      "disabled": false,
      "description": "Stripe payment processing..."
    },
    "resend": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-resend"],
      "env": {
        "RESEND_API_KEY": "${RESEND_API_KEY}"
      },
      "disabled": false,
      "description": "Resend email service..."
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "READ_ONLY": "false"
      },
      "disabled": false,
      "description": "PostgreSQL database access..."
    }
  }
}
```

**How It Works**:
- `${VARIABLE_NAME}` = Replaced with environment variable at runtime
- MCPs are **automatically loaded** when Claude Code starts
- If environment variable is missing, MCP will show error when initialized

---

## Environment Variable Management

### Option 1: Shell Environment (Recommended for Daily Use)

Add to your shell configuration file (`~/.bashrc`, `~/.zshrc`, `~/.fish/config.fish`):

```bash
# Stripe
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_test_..."

# Resend
export RESEND_API_KEY="re_test_..."

# PostgreSQL
export DATABASE_URL="postgresql://..."
```

Then reload: `source ~/.bashrc` (or restart terminal)

**Pros**:
- Available to all applications
- Persists across sessions
- Safe (shell history may contain values)

**Cons**:
- Less convenient for project-specific values

### Option 2: .env.local File (Best for Project Setup)

Create `.env.local` in project root (never commit):

```env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
RESEND_API_KEY=re_test_...
DATABASE_URL=postgresql://...
```

Then Claude Code reads from this file automatically.

**Pros**:
- Project-specific
- Easy to manage per project
- Can be .gitignored

**Cons**:
- Need to create per project

### Option 3: Direct in Claude Code (For Testing)

If you want to test without environment setup:

1. Tell Claude Code: "I'll set the STRIPE_API_KEY to sk_test_..."
2. Claude Code can use provided values temporarily

**Pros**:
- No setup required
- Quick testing

**Cons**:
- Not persistent
- Security risk
- Don't do this for production keys

---

## Security Best Practices

### ✅ DO

- ✅ Use **test/sandbox keys** in development (keys starting with `test_`)
- ✅ Use **unique passwords** for database connections
- ✅ Rotate API keys regularly
- ✅ Store production keys securely (not in code)
- ✅ Use environment-specific secrets management for production
- ✅ Review what MCPs can access (read-only mode for PostgreSQL in most cases)

### ❌ DON'T

- ❌ Commit `.env.local` or secrets to git
- ❌ Use production API keys in development
- ❌ Share API keys in chat/email/slack
- ❌ Put secrets in code comments
- ❌ Use generic/shared database credentials
- ❌ Log or print API keys

---

## Troubleshooting

### Stripe MCP Not Working

**Error**: "Invalid API Key" or "Unauthorized"

**Solutions**:
1. ✅ Verify key starts with `sk_test_` (not `pk_test_`)
2. ✅ Check you're in **Test Mode** in Stripe dashboard
3. ✅ Make sure key is recent (old keys may not work)
4. ✅ Try creating new API key in Stripe dashboard
5. ✅ Check environment variable is set: `echo $STRIPE_API_KEY`

**Error**: "Webhook secret invalid"

**Solutions**:
1. ✅ Get correct webhook secret (different from API key)
2. ✅ Must start with `whsec_test_`
3. ✅ Create webhook endpoint in Stripe dashboard if missing
4. ✅ Copy exact string (no extra spaces)

---

### Resend MCP Not Working

**Error**: "Invalid API Key"

**Solutions**:
1. ✅ Verify key starts with `re_test_` (or `re_` for production)
2. ✅ Check key hasn't expired (rotate periodically)
3. ✅ Make sure you copied full key (no truncation)
4. ✅ Generate new key in Resend dashboard if stuck

**Error**: "Email validation failed"

**Solutions**:
1. ✅ Use valid email format (test@example.com)
2. ✅ For test environment, most emails work
3. ✅ Check template variables are correct

---

### PostgreSQL MCP Not Working

**Error**: "Connection refused" or "Cannot connect"

**Solutions**:
1. ✅ Check database is running (`psql` connects?)
2. ✅ Verify connection string format:
   - Should be: `postgresql://user:password@host:port/database`
   - NOT: `postgresql://user@password@host` (wrong @ placement)
3. ✅ Check username/password are correct
4. ✅ For Supabase, use `[project].supabase.co` as host
5. ✅ If special chars in password, URL-encode them:
   - `@` → `%40`
   - `:` → `%3A`
   - `#` → `%23`

**Error**: "Permission denied"

**Solutions**:
1. ✅ Make sure user has read access to database
2. ✅ Check RLS policies don't block queries
3. ✅ For testing, use service role or admin credentials
4. ✅ If using RLS-enforced user, may get permission errors

**Error**: "Database does not exist"

**Solutions**:
1. ✅ Check database name in connection string
2. ✅ Make sure you connected to right Supabase project
3. ✅ Create database if it doesn't exist

---

## MCP Server Commands Reference

Once setup is complete, you can use these MCPs in Claude Code.

### Stripe MCP Commands

```
"List test customers"
"Create customer with email john@example.com"
"Show recent charges"
"Simulate payment failure webhook"
"Get subscription for customer [ID]"
"Create test invoice"
```

### Resend MCP Commands

```
"Show available email templates"
"Preview welcome email template"
"Test sending email to test@example.com"
"List recent emails sent"
"Get delivery status for email [ID]"
```

### PostgreSQL MCP Commands

```
"Show all tables in database"
"Describe the user_profiles table"
"List RLS policies on applications table"
"Show row count for all tables"
"Query: SELECT * FROM user_profiles LIMIT 5"
"Show indexes on experiences table"
"List database triggers"
```

---

## Verification Checklist

Use this checklist to verify all MCPs are working:

### Stripe MCP ✓

- [ ] `STRIPE_API_KEY` environment variable set
- [ ] `STRIPE_WEBHOOK_SECRET` environment variable set
- [ ] Can list test customers
- [ ] Can create test customer
- [ ] MCP initializes without errors

### Resend MCP ✓

- [ ] `RESEND_API_KEY` environment variable set
- [ ] Can list email templates
- [ ] Can preview email
- [ ] MCP initializes without errors

### PostgreSQL MCP ✓

- [ ] `DATABASE_URL` environment variable set
- [ ] Connection successful
- [ ] Can list tables
- [ ] Can describe specific table
- [ ] MCP initializes without errors

### All MCPs ✓

- [ ] All three MCPs initialize when Claude Code starts
- [ ] No errors in MCP initialization logs
- [ ] Can query each system from Claude Code
- [ ] No data loss or corruption
- [ ] Team members can replicate setup

---

## File Locations Reference

| File | Location | Purpose |
|------|----------|---------|
| **MCP Config** | `.claude/mcp.json` | Server configurations (committed) |
| **This Guide** | `.claude/mcp-setup-guide.md` | Setup instructions (this file) |
| **Environment** | `.env.local` or shell | Secret credentials (NOT committed) |
| **Stripe Audit** | `docs/STRIPE_QUICK_REFERENCE.md` | Stripe implementation details |
| **Resend Audit** | `docs/RESEND_MCP_READINESS.md` | Email system details |
| **Database Audit** | `docs/DATABASE_QUICK_REFERENCE.md` | Database implementation details |

---

## Common Workflows

### Testing Stripe Integration

1. **Tell Claude Code**: "List test customers"
2. Claude Code uses Stripe MCP to fetch data
3. No need to open Stripe dashboard
4. Can create test data directly from IDE

### Testing Email System

1. **Tell Claude Code**: "Preview welcome email"
2. Claude Code uses Resend MCP to show preview
3. Can iterate on email design without leaving IDE
4. Test variables and rendering inline

### Debugging Database Issues

1. **Tell Claude Code**: "Show schema for user_profiles"
2. Claude Code uses PostgreSQL MCP to introspect
3. Can see columns, types, RLS policies
4. Debug queries without external database tools

---

## Next Steps

### After Setup Complete

1. ✅ Verify all three MCPs working (see checklist above)
2. ✅ Run some test commands (see reference section)
3. ✅ Tell team setup is complete
4. ✅ Point team to this guide for their setup
5. ✅ Ready for Phase 1.3: Team Training

### If Issues Arise

1. Check troubleshooting section above
2. Verify environment variables: `echo $VARIABLE_NAME`
3. Check `.claude/mcp.json` configuration
4. Review error messages from MCP initialization
5. Consult Phase 1.1 audit documents for system details

### For Phase 2-4 Development

- **Phase 2**: Stripe MCP will be used for payment testing
- **Phase 3**: Resend MCP will be used for email implementation
- **Phase 4**: PostgreSQL MCP will be used for database exploration

---

## Support & Questions

### Where to Find Help

1. **For Stripe issues**: `docs/STRIPE_QUICK_REFERENCE.md`
2. **For Resend issues**: `docs/RESEND_MCP_READINESS.md`
3. **For Database issues**: `docs/DATABASE_QUICK_REFERENCE.md`
4. **For MCP info**: `.claude/mcp.json` configuration
5. **For implementation details**: Phase 1.1 audit documents

### FAQ

**Q: Do I need to set up MCPs for local development?**
A: Yes, MCPs are used during development (Phase 2+) and testing

**Q: Can I use production API keys?**
A: NO - Only use test/sandbox keys. Production keys are for deployment only

**Q: What if I don't want to use an MCP?**
A: You can disable it in `.claude/mcp.json` by setting `"disabled": true`

**Q: Are API keys stored securely?**
A: Keys are in environment variables (not in code), but still be careful. Never commit `.env.local`

**Q: What happens if API key is wrong?**
A: MCP will error when you try to use it. Fix environment variable and try again

**Q: Can multiple people use same API keys?**
A: Yes, but recommended to have separate test accounts per developer for better logging

---

**Setup Time**: ~15-30 minutes for experienced developers
**Status**: Ready for Phase 1.2 completion
**Document Version**: 1.0
**Last Updated**: November 2025
