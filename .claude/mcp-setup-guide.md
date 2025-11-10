# MCP Servers Setup Guide

**Version**: 1.0
**Status**: Phase 1 Implementation
**Time**: ~15-30 min for experienced developers

---

## Quick Start (5 minutes)

1. **Get API Keys** from Stripe, Resend, Supabase dashboards
2. **Set Environment Variables** (`.env.local` or shell):
   ```bash
   export STRIPE_API_KEY="sk_test_..."
   export STRIPE_WEBHOOK_SECRET="whsec_test_..."
   export RESEND_API_KEY="re_test_..."
   export DATABASE_URL="postgresql://..."
   ```
3. **MCPs Ready**: `.claude/mcp.json` is pre-configured
4. **Verify**: Each MCP initializes when Claude Code starts

---

## Environment Variables Reference

| Variable | Source | Mode | Required |
|----------|--------|------|----------|
| `STRIPE_API_KEY` | Stripe Dashboard → Developers | Test | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks | Test | ✅ |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | Test | ✅ |
| `DATABASE_URL` | Supabase → Settings | Dev | ✅ |

---

## Setup Details

### Stripe MCP

**Get Keys**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Test Mode** (toggle top right)
3. **Developers** → **API Keys** → Copy **Secret Key** (`sk_test_...`)
4. **Developers** → **Webhooks** → Create endpoint: `http://localhost:3001/api/v1/payments/webhook`
5. Copy webhook signing secret (`whsec_test_...`)

**Set Variables**:
```bash
export STRIPE_API_KEY="sk_test_XXXXX"
export STRIPE_WEBHOOK_SECRET="whsec_test_XXXXX"
```

**Verify**:
- "List test customers in Stripe"
- "Create test customer for test@example.com"

---

### Resend MCP

**Get Key**:
1. Go to [Resend Dashboard](https://resend.com/home)
2. **API Keys** → Copy **Test API Key** (`re_test_...`)

**Set Variable**:
```bash
export RESEND_API_KEY="re_test_XXXXX"
```

**Verify**:
- "Preview welcome email"
- "Show available email templates"

---

### PostgreSQL MCP

**Get Connection String**:
1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project → **Settings** → **Database** → **Connection string**
3. Copy **Full connection string** (URI style): `postgresql://[user]:[password]@[host]:[port]/[database]`
4. **Note**: URL-encode special chars: `@` → `%40`, `:` → `%3A`

**Set Variable**:
```bash
export DATABASE_URL="postgresql://user:password@host:5432/database"
```

**Verify**:
- "Show all tables"
- "Describe user_profiles table"
- "List RLS policies"

---

## Configuration File Reference

**Location**: `.claude/mcp.json` (committed to git)

MCPs are **automatically loaded** when Claude Code starts. Environment variables are replaced at runtime. If missing, MCP shows error on init.

---

## Environment Variable Management

### Option 1: Shell (Recommended)
Add to `~/.bashrc`, `~/.zshrc`, or `~/.fish/config.fish`:
```bash
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_test_..."
export RESEND_API_KEY="re_test_..."
export DATABASE_URL="postgresql://..."
```
Then: `source ~/.bashrc` or restart terminal

### Option 2: .env.local (Project-Specific)
Create `.env.local` in project root (never commit):
```env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
RESEND_API_KEY=re_test_...
DATABASE_URL=postgresql://...
```
Claude Code reads automatically.

### Option 3: Direct in Claude Code (Testing Only)
Temporary, not persistent. Don't use for production keys.

---

## Security Best Practices

### ✅ DO
- Use **test/sandbox keys** in development (keys starting with `test_`)
- Use **unique passwords** for database connections
- Rotate API keys regularly
- Store production keys securely (not in code)

### ❌ DON'T
- Commit `.env.local` to git
- Use production keys in development
- Share API keys in chat/email/slack
- Put secrets in code comments
- Log or print API keys

---

## Troubleshooting

### Stripe MCP Errors

**"Invalid API Key"**:
- Key must start with `sk_test_` (not `pk_test_`)
- Check you're in **Test Mode** in Stripe dashboard
- Try creating new API key

**"Webhook secret invalid"**:
- Get from **Developers** → **Webhooks** (different from API key)
- Must start with `whsec_test_`
- Copy exact string (no extra spaces)

### Resend MCP Errors

**"Invalid API Key"**:
- Key starts with `re_test_` or `re_`
- Check key hasn't expired
- Generate new key if stuck

### PostgreSQL MCP Errors

**"Connection refused"**:
- Database running? (`psql` connects?)
- Connection string format: `postgresql://user:password@host:port/database`
- Username/password correct?
- For Supabase: use `[project].supabase.co` as host
- URL-encode special chars: `@` → `%40`, `:` → `%3A`, `#` → `%23`

**"Permission denied"**:
- User has read access to database?
- RLS policies blocking queries?
- Use service role/admin credentials for testing

**"Database does not exist"**:
- Check database name in connection string
- Connected to correct Supabase project?

---

## MCP Commands Reference

### Stripe
```
"List test customers"
"Create customer with email john@example.com"
"Show recent charges"
"Simulate payment failure webhook"
```

### Resend
```
"Show available templates"
"Preview welcome email"
"Test sending email to test@example.com"
```

### PostgreSQL
```
"Show all tables"
"Describe user_profiles table"
"List RLS policies on applications"
"Show row count for all tables"
```

---

## Verification Checklist

- [ ] `STRIPE_API_KEY` set
- [ ] `STRIPE_WEBHOOK_SECRET` set
- [ ] `RESEND_API_KEY` set
- [ ] `DATABASE_URL` set
- [ ] All three MCPs initialize without errors
- [ ] Can query each system from Claude Code
- [ ] Team members can replicate setup

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| **MCP Config** | `.claude/mcp.json` | Configurations (committed) |
| **This Guide** | `.claude/mcp-setup-guide.md` | Setup instructions |
| **Secrets** | `.env.local` or shell | Credentials (NOT committed) |

---

## Common Workflows

**Testing Stripe**: "List test customers" → Claude Code uses Stripe MCP → No dashboard needed

**Testing Email**: "Preview welcome email" → Claude Code uses Resend MCP → Iterate inline

**Debugging DB**: "Show schema for user_profiles" → Claude Code uses PostgreSQL MCP → No external tools

---

## Next Steps

1. ✅ Complete setup (see Quick Start)
2. ✅ Verify all MCPs working (see Verification Checklist)
3. ✅ Run test commands (see MCP Commands Reference)
4. ✅ Tell team setup complete
5. ✅ Ready for Phase 1.2

---

**Setup Complete**: ~15-30 min
**Status**: Ready for Phase 1.2 development
**Last Updated**: November 2025
