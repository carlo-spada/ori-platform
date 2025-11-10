# Phase 1 MCP Architecture & Infrastructure Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Developer Environment (Local)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────┐                                              │
│  │   Claude Code IDE        │                                              │
│  │  + MCP Servers (Phase 1) │                                              │
│  ├──────────────────────────┤                                              │
│  │  • Stripe MCP            │                                              │
│  │  • Resend MCP            │                                              │
│  │  • PostgreSQL MCP        │                                              │
│  └──────────┬───────────────┘                                              │
│             │                                                               │
│    ┌────────▼────────┬────────────┬─────────────────┐                     │
│    │                 │            │                 │                     │
│    │                 │            │                 │                     │
│    ▼                 ▼            ▼                 ▼                     │
│ ┌─────────┐      ┌─────────┐  ┌─────────┐     ┌───────────┐            │
│ │ Stripe  │      │ Resend  │  │PostSQL  │     │ Git/Bash  │            │
│ │   MCP   │      │   MCP   │  │   MCP   │     │  (native) │            │
│ │ Client  │      │ Client  │  │ Client  │     │           │            │
│ └────┬────┘      └────┬────┘  └────┬────┘     └───────────┘            │
│      │                │            │                                     │
└──────┼────────────────┼────────────┼─────────────────────────────────────┘
       │                │            │
       │                │            │ (Postgres Driver)
       │                │            │
       │ (HTTPS)        │            │
       │                │ (HTTPS)    │
       ▼                ▼            ▼
  ┌────────────┐   ┌─────────┐  ┌──────────────┐
  │   Stripe   │   │ Resend  │  │   Supabase   │
  │    API     │   │   API   │  │  PostgreSQL  │
  │ (Sandbox)  │   │(Sandbox)│  │  (Dev/Stg)   │
  └────────────┘   └─────────┘  └──────────────┘
```

## Data Flow: Before & After MCP Integration

### Before Phase 1 (Current State)

```
Payment Testing:
Developer
  → Open Stripe Dashboard (context switch)
  → Navigate to test customers
  → Copy webhook payload manually
  → Paste into code/tools
  → Test webhook handler
  → Context switch back to code

Email Development:
Developer
  → Edit notifications.ts (placeholder)
  → Run app
  → Try to test (nothing happens)
  → Open email provider docs
  → Implement email service
  → Test manually/don't test
  → Integrate into app

Database Debugging:
Developer
  → Open psql/DBeaver (context switch)
  → Write SQL query for schema inspection
  → Review results
  → Copy findings back to code
  → Check RLS policies in separate tool
  → Debug based on findings
```

### After Phase 1 (MCP-First Development)

```
Payment Testing:
Developer
  → Use Claude Code with Stripe MCP
  → MCP: "Create test customer with subscription"
  → MCP: "Simulate subscription update webhook"
  → Results integrated directly into code
  → Run tests with generated data
  → All in one context, zero switching

Email Development:
Developer
  → Use Claude Code with Resend MCP
  → MCP: "Generate email template preview"
  → MCP: "Test welcome email with sample data"
  → MCP: "Validate email variables"
  → Results show in IDE
  → Implement service with test data from MCP
  → All integrated end-to-end

Database Debugging:
Developer
  → Use Claude Code with PostgreSQL MCP
  → MCP: "Show schema for user_profiles table"
  → MCP: "Check RLS policies for applications table"
  → MCP: "Validate migration would succeed"
  → Results displayed with helpful context
  → Debug based on findings
  → All queries runnable without context switch
```

## Component Integration Details

### 1. Stripe MCP Integration

#### Connection Points
```
┌────────────────────────────────────────────────┐
│          Stripe MCP Server (Local)             │
│  Provides: Customer, Subscription, Invoice API│
└────────────────┬───────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  Stripe SDK    │
         │  (JavaScript)  │
         └───────┬────────┘
                 │
    ┌────────────▼──────────────┐
    │                           │
    │  Environment Variables    │
    │  ├─ STRIPE_API_KEY       │
    │  ├─ STRIPE_SECRET_KEY    │
    │  └─ STRIPE_WEBHOOK_SECRET│
    │                           │
    └───────────┬───────────────┘
                │
        ┌───────▼──────────┐
        │  Stripe Sandbox  │
        │   API Endpoint   │
        └──────────────────┘
```

**Development Workflow**:
1. MCP queries Stripe Sandbox API (never touches production)
2. Test data persists in Sandbox for validation
3. Webhook simulation returns realistic payloads
4. Results directly integrate into test code
5. No manual Stripe dashboard navigation needed

**Files Involved**:
- `services/core-api/src/lib/stripe.ts` - Stripe client initialization
- `services/core-api/src/routes/payments.ts` - Payment endpoints (will gain MCP tests)
- `services/core-api/src/routes/subscriptions.ts` - Subscription endpoints
- `services/core-api/src/__tests__/setup.ts` - MCP test configuration

#### Use Cases During Development

| Use Case | Old Way | MCP Way | Time Saved |
|----------|---------|---------|-----------|
| Create test customer | Manual dashboard | `stripe-mcp create:customer` | 3 min |
| Test subscription webhook | Copy/paste payload | `stripe-mcp simulate:webhook subscription.updated` | 5 min |
| Validate payment logic | Set breakpoint + test | MCP generates test scenarios | 8 min |
| Debug cancellation flow | Manual testing | `stripe-mcp test:cancellation` | 10 min |
| **Total per session** | **~15-30 min context switching** | **<3 min, zero switching** | **80%+** |

---

### 2. Resend MCP Integration

#### Connection Points
```
┌────────────────────────────────────────────────┐
│          Resend MCP Server (Local)             │
│  Provides: Email Send, Template, Preview API  │
└────────────────┬───────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  Resend SDK    │
         │  (JavaScript)  │
         └───────┬────────┘
                 │
    ┌────────────▼──────────────┐
    │                           │
    │  Environment Variables    │
    │  ├─ RESEND_API_KEY       │
    │  ├─ RESEND_FROM_EMAIL    │
    │  └─ RESEND_DOMAIN        │
    │                           │
    └───────────┬───────────────┘
                │
        ┌───────▼──────────┐
        │  Resend Sandbox  │
        │   API Endpoint   │
        └──────────────────┘
```

**Development Workflow**:
1. Email service in `services/core-api/src/services/email.ts` calls Resend MCP
2. Templates stored in version control (`services/core-api/src/templates/`)
3. MCP provides email preview and validation
4. Template variables interpolated by MCP
5. Test sends logged but not delivered
6. All email development and testing from IDE

**Files Involved**:
- `services/core-api/src/services/email.ts` - Email service (NEW)
- `services/core-api/src/templates/` - Email templates (NEW)
- `services/core-api/src/utils/notifications.ts` - Currently empty placeholder (to be replaced)
- Any route that triggers emails (signup, recommendations, etc.)

#### Use Cases During Development

| Use Case | Old Way | MCP Way | Time Saved |
|----------|---------|---------|-----------|
| Preview email template | Copy/paste to provider | MCP renders preview inline | 5 min |
| Test with sample data | Manual setup | `resend-mcp preview:template welcome --data {...}` | 3 min |
| Validate email variables | Trial/error | MCP validates all variables | 10 min |
| Test transactional email | Set up scenario + monitor | MCP simulates trigger + shows result | 8 min |
| **Total per session** | **~20-30 min context switching** | **<2 min, zero switching** | **85%+** |

---

### 3. PostgreSQL MCP Integration

#### Connection Points
```
┌──────────────────────────────────────────────┐
│       PostgreSQL MCP Server (Local)          │
│  Provides: Schema, Query, RLS, Validation    │
└──────────────────┬──────────────────────────┘
                   │
           ┌───────▼────────┐
           │  Postgres Lib  │
           │  (JavaScript)  │
           └───────┬────────┘
                   │
      ┌────────────▼──────────────┐
      │                           │
      │  Environment Variables    │
      │  ├─ SUPABASE_URL         │
      │  ├─ SUPABASE_ANON_KEY    │
      │  └─ SUPABASE_PSQL_URL    │
      │                           │
      └───────────┬───────────────┘
                  │
          ┌───────▼──────────┐
          │   Supabase DB    │
          │  (Dev Postgres)  │
          └──────────────────┘
```

**Development Workflow**:
1. MCP connects to Supabase PostgreSQL (dev environment only)
2. Schema queries return readable database structure
3. RLS policy queries show permission rules
4. Migration validation checks schema changes
5. All without leaving IDE or using psql/DBeaver
6. Results integrate directly into code

**Files Involved**:
- `supabase/migrations/` - Migration files (validation via MCP)
- `services/core-api/src/__tests__/setup.ts` - Database test setup (enhanced with MCP)
- `docs/DATABASE_SCHEMA.md` - Schema docs (auto-updated by MCP)
- Any test that queries database

#### Use Cases During Development

| Use Case | Old Way | MCP Way | Time Saved |
|----------|---------|---------|-----------|
| Check table schema | Open psql/DBeaver | `postgres-mcp schema:inspect user_profiles` | 4 min |
| View RLS policies | Query separate tool | `postgres-mcp rls:show applications` | 3 min |
| Validate migration | Run migration + test | `postgres-mcp migration:validate` (dry-run) | 10 min |
| Debug data query | Open database tool | `postgres-mcp query:execute "SELECT * WHERE..."` | 5 min |
| **Total per session** | **~15-20 min context switching** | **<2 min, zero switching** | **80%+** |

---

## Network & Security Architecture

### Development Environment Security

```
┌──────────────────────────────────────────────────────────────────┐
│                   Developer Machine (Local)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Local MCP Server Instances                     │  │
│  │  (All communication is local/encrypted only)             │  │
│  │                                                          │  │
│  │  • Stripe MCP  → Uses API key from .env (not committed) │  │
│  │  • Resend MCP  → Uses API key from .env (not committed) │  │
│  │  • PostgreSQL MCP → Uses connection string (not commit) │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │           Environment Variables (.env.local)            │  │
│  │  • STRIPE_API_KEY (Sandbox only)                        │  │
│  │  • STRIPE_WEBHOOK_SECRET (Local testing)                │  │
│  │  • RESEND_API_KEY (Sandbox/Test)                        │  │
│  │  • DATABASE_URL (Dev Supabase, not production)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌──────────┐
         │Stripe  │ │Resend  │ │Supabase  │
         │Sandbox │ │ Test   │ │Dev DB    │
         │(Public)│ │(Public)│ │(Private) │
         └────────┘ └────────┘ └──────────┘
```

### Key Security Principles

1. **No Credentials in Code**
   - All API keys stored in `.env.local` (never committed)
   - MCP servers read from environment variables only
   - Separate keys for sandbox/test vs. production

2. **Sandbox/Test Environments Only**
   - Stripe MCP uses Sandbox API (never touches production)
   - Resend MCP uses Test API (no actual email sending)
   - PostgreSQL MCP connects to dev Supabase only

3. **Local MCP Servers**
   - All MCP server instances run locally
   - No communication with external MCP broker
   - Network isolation except for API calls

4. **Audit Trail**
   - All MCP commands logged with timestamps
   - Queries recorded for debugging
   - No sensitive data in logs

---

## Configuration & Environment Setup

### File Structure for Phase 1 MCPs

```
ori-platform/
├── .claude/
│   ├── mcp.json                    ← MCP server configurations
│   └── mcp-setup-guide.md          ← Developer setup instructions
│
├── .env.example                    ← Template with MCP env vars
├── .env.local                      ← Actual secrets (not committed)
│
├── services/core-api/
│   ├── .env.example
│   ├── .env                        ← MCP secrets for core-api
│   ├── src/
│   │   ├── services/
│   │   │   └── email.ts            ← NEW: Resend MCP email service
│   │   ├── templates/              ← NEW: Email templates
│   │   ├── lib/
│   │   │   ├── stripe.ts           ← Updated for Stripe MCP testing
│   │   │   └── postgres.ts         ← NEW: PostgreSQL MCP queries
│   │   └── __tests__/
│   │       ├── setup.ts            ← Updated with MCP configuration
│   │       └── payments.test.ts    ← Updated with Stripe MCP tests
│   │
│   └── jest.config.js
│
├── docs/
│   ├── MCP_INTEGRATION_MASTER_PLAN.md
│   ├── MCP_PHASE1_ARCHITECTURE.md  ← This file
│   ├── STRIPE_MCP_WORKFLOWS.md     ← Phase 2 (payment testing)
│   ├── RESEND_MCP_WORKFLOWS.md     ← Phase 3 (email workflows)
│   ├── POSTGRES_MCP_WORKFLOWS.md   ← Phase 4 (database workflows)
│   ├── DEPRECATIONS.md             ← Timeline for old system sunset
│   └── MCP_INTEGRATION_QUICK_REFERENCE.md
│
└── CLAUDE.md                       ← Updated with MCP patterns
```

### Configuration Template: `.claude/mcp.json`

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-stripe"],
      "env": {
        "STRIPE_API_KEY": "${STRIPE_API_KEY}",
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",
        "STRIPE_ACCOUNT": "sandbox"
      },
      "description": "Stripe payment testing and webhook simulation"
    },
    "resend": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-resend"],
      "env": {
        "RESEND_API_KEY": "${RESEND_API_KEY}",
        "RESEND_MODE": "test"
      },
      "description": "Resend email preview, sending, and template management"
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${SUPABASE_PSQL_URL}",
        "READ_ONLY": "false"
      },
      "description": "PostgreSQL schema inspection, querying, and RLS policy validation"
    }
  }
}
```

### Environment Variables Needed

**Frontend (`.env.local`)**:
```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# New for MCP (only for local development, Claude Code usage)
STRIPE_MCP_API_KEY=             # Sandbox key from Stripe
RESEND_MCP_API_KEY=             # Test key from Resend
DATABASE_MCP_URL=               # Dev Supabase PostgreSQL URL
```

**Core API (`services/core-api/.env`)**:
```env
# Existing
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002

# New for MCP
STRIPE_MCP_ENABLED=true
RESEND_API_KEY=                 # Test/sandbox key
RESEND_FROM_EMAIL=noreply@getori.app
POSTGRES_MCP_ENABLED=true
```

---

## Implementation Sequence

### Step 1: Local MCP Setup (Day 1-2)
1. Create `.claude/mcp.json` with all three server configurations
2. Test each MCP server can initialize and authenticate
3. Document setup in `.claude/mcp-setup-guide.md`
4. Verify all developers can run MCPs locally

### Step 2: Stripe MCP Integration (Week 3-4)
1. Update payment tests to use Stripe MCP
2. Create Stripe MCP workflow documentation
3. Test all payment scenarios with MCP data
4. Validate webhook handling with MCP-generated payloads

### Step 3: Resend MCP Integration (Week 5-6)
1. Implement email service using Resend MCP
2. Create email templates directory
3. Add email triggers to API routes
4. Test email workflows end-to-end

### Step 4: PostgreSQL MCP Integration (Week 7-8)
1. Add PostgreSQL MCP queries to test setup
2. Create database exploration workflow documentation
3. Implement RLS policy testing patterns
4. Add migration validation using PostgreSQL MCP

---

## Monitoring & Observability

### MCP Server Health Checks

```typescript
// services/core-api/src/lib/mcp-health.ts (NEW)
export async function checkMCPHealth() {
  return {
    stripe: await checkStripeMCP(),
    resend: await checkResendMCP(),
    postgres: await checkPostgresMCP(),
    timestamp: new Date().toISOString(),
  }
}
```

**Health Check Criteria**:
- Stripe MCP: Can list test customers successfully
- Resend MCP: Can render test email template
- PostgreSQL MCP: Can query schema information

### Logging & Debugging

```typescript
// All MCP operations logged with context
console.log('[MCP:Stripe]', 'Creating test customer', { email: '...' })
console.log('[MCP:Resend]', 'Preview email', { template: 'welcome' })
console.log('[MCP:Postgres]', 'Schema inspection', { table: 'user_profiles' })
```

### Error Handling

If MCP unavailable, graceful degradation:
- Stripe: Fall back to manual Stripe dashboard
- Resend: Log error, don't send email (but don't crash)
- PostgreSQL: Fall back to manual psql queries

---

## Version Control & Git

### Files to Never Commit
```
.env.local                          # Local development secrets
.env                                # Core API secrets
services/ai-engine/.env             # AI Engine secrets
.claude/mcp.json (with secrets)      # If secrets injected
```

### Files to Always Commit
```
.env.example                        # Template with placeholders
.claude/mcp.json (with ${VARS})     # Config with variable references
docs/MCP_PHASE1_ARCHITECTURE.md     # This documentation
docs/MCP_INTEGRATION_MASTER_PLAN.md # Master plan
CLAUDE.md (updated)                 # Development patterns
```

### Git Workflow for MCP Setup
```bash
# Day 1: Create MCP configuration
git add .claude/mcp.json docs/MCP_*
git commit -m "chore(mcp): initialize Phase 1 MCP servers configuration"
git push origin dev

# Week 3: Stripe MCP integration
git add services/core-api/src/routes/__tests__/payments.test.ts
git commit -m "feat(stripe-mcp): replace manual testing with MCP-based workflows"
git push origin dev

# Week 5: Resend MCP integration
git add services/core-api/src/services/email.ts services/core-api/src/templates/
git commit -m "feat(resend-mcp): implement email service with MCP integration"
git push origin dev

# Week 7: PostgreSQL MCP integration
git add services/core-api/src/lib/postgres.ts docs/POSTGRES_MCP_WORKFLOWS.md
git commit -m "feat(postgres-mcp): add database exploration via MCP"
git push origin dev
```

---

## Success Validation Checklist

### Phase 1 Foundation
- [ ] All three MCP servers initialize successfully locally
- [ ] Environment variables documented and accessible to all developers
- [ ] MCP configuration stored in version control
- [ ] Zero hardcoded credentials anywhere

### Phase 2 Stripe MCP
- [ ] Payment tests use Stripe MCP instead of manual dashboard
- [ ] Webhook simulation works end-to-end
- [ ] Developers can test payment flows without context-switching
- [ ] >90% test coverage for payment routes

### Phase 3 Resend MCP
- [ ] Email service implemented and fully functional
- [ ] Templates stored in version control
- [ ] Email triggers integrated into API routes
- [ ] Email testing possible entirely from IDE

### Phase 4 PostgreSQL MCP
- [ ] Database schema queryable via MCP from IDE
- [ ] RLS policies inspectable via MCP
- [ ] Migration validation automated
- [ ] Zero use of external database tools for common tasks

---

**Document Version**: 1.0
**Created**: November 2025
**Status**: Ready for Implementation Review
