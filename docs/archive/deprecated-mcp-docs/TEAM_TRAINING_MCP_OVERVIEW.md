---
type: documentation
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: archive, deprecated, team, training, overview.md, training:, (model
priority: medium
quick-read-time: 11min
deep-dive-time: 18min
---

# Team Training: MCP (Model Context Protocol) Overview

**Version**: 1.0
**Last Updated**: November 10, 2025
**Audience**: All Ori Platform Engineers
**Duration**: 15-20 minutes to read
**Format**: Self-service training document

---

## Part 1: What is Model Context Protocol (MCP)?

### Simple Definition

Model Context Protocol (MCP) is a **standard for AI agents to access external tools and data sources**. Think of it as a bridge between AI assistants (like Claude) and your business systems (Stripe, email services, databases).

### Why It Matters

Before MCPs, Claude had to work with:

- Static knowledge about APIs
- No real-time data from your systems
- No ability to take actions in your tools
- Manual integration for each service

With MCPs, Claude can:

- ✅ Query your live systems in real-time
- ✅ Take actions (create customers, send emails, etc.)
- ✅ Use the same standard interface for all tools
- ✅ Understand your actual data, not guesses

### The MCP Ecosystem

MCPs are provided by:

- **Service providers** (Stripe, Resend, etc.) publish MCP servers
- **Developers** configure these servers in their projects
- **Claude** connects to these servers and uses them naturally

---

## Part 2: Why Ori Platform Is Using MCPs

### The Problem We Solved

**Before MCPs** at Ori:

- To test payment flows, engineers manually opened Stripe dashboard
- To test emails, engineers manually created test data
- To debug database issues, engineers connected via SQL client
- To create test scenarios, engineers ran custom scripts
- Testing was slow, error-prone, and context-switching

**Impact**: Development velocity was reduced by manual tool-switching

### The Solution: MCPs

**With MCPs** at Ori:

- Claude helps engineers test Stripe payments **without leaving the IDE**
- Claude helps design and test emails **inline with development**
- Claude helps introspect the database **through natural conversation**
- Claude helps create realistic test scenarios **programmatically**
- Engineers stay in flow state - no context switching

**Impact**: Development velocity increased by reducing tool-switching and enabling better testing

### Strategic Advantages

1. **Efficiency**: Test faster, with less manual setup
2. **Quality**: Better testing = fewer bugs in production
3. **Knowledge**: Claude understands your actual systems
4. **Debugging**: Issues resolved faster with live data
5. **Automation**: Repetitive testing scenarios automated
6. **Learning**: New team members learn by example from Claude

---

## Part 3: How MCPs Fit Into Ori's Architecture

### The Three-Tier Architecture

```
┌─────────────────────────────────────────────┐
│          Claude (in Claude Code)             │ ← AI Assistant
│  "Create a test customer for john@ex.com"   │
└────────────────────┬────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────┐
│      MCP Servers (Running locally)           │ ← Protocol Layer
├─────────────────────────────────────────────┤
│ ✅ Stripe MCP      - Payment system         │
│ ✅ Resend MCP      - Email system           │
│ ✅ PostgreSQL MCP  - Database system        │
└────┬─────────────┬──────────────┬───────────┘
     │             │              │
     ↓             ↓              ↓
┌────────────┐ ┌────────┐ ┌──────────────┐
│   Stripe   │ │ Resend │ │  PostgreSQL  │
│  (Cloud)   │ │ (Cloud)│ │   (Cloud)    │
└────────────┘ └────────┘ └──────────────┘
```

### What Each MCP Does

#### Stripe MCP (Payments)

```
Claude ←→ Stripe MCP ←→ Stripe API

Enables:
- List test customers
- Create test customers and subscriptions
- Simulate payment scenarios
- Test webhook handling
- Validate charge states
```

**When You Use It**: Testing payment flows, validating transactions, creating test data

#### Resend MCP (Email)

```
Claude ←→ Resend MCP ←→ Resend API

Enables:
- Preview email templates
- Test email rendering
- Validate email variables
- Test email delivery
- Debug email issues
```

**When You Use It**: Designing emails, testing templates, validating formatting

#### PostgreSQL MCP (Database)

```
Claude ←→ PostgreSQL MCP ←→ Supabase PostgreSQL

Enables:
- Explore database schema
- Test RLS (Row Level Security) policies
- Query data
- Validate migrations
- Debug data issues
```

**When You Use It**: Understanding schema, testing RLS, debugging data, validating migrations

---

## Part 4: The Three MCPs We're Using

### Overview Table

| MCP            | Service             | Purpose                               | Phase   | Test Keys          | Status   |
| -------------- | ------------------- | ------------------------------------- | ------- | ------------------ | -------- |
| **Stripe**     | Stripe (Payments)   | Payment system testing & integration  | Phase 2 | Test mode API keys | Ready ✅ |
| **Resend**     | Resend (Email)      | Email system implementation & testing | Phase 3 | Test API key       | Ready ✅ |
| **PostgreSQL** | Supabase (Database) | Database exploration & RLS testing    | Phase 4 | Connection string  | Ready ✅ |

### MCP 1: Stripe (Payment Processing)

**What It Does**:

- Enables Claude to interact with Stripe for payment testing
- Create test customers, charges, subscriptions
- Simulate payment scenarios and webhooks
- Validate payment flow behavior

**Where It's Configured**:

- Configuration: `.claude/mcp.json` (Stripe server definition)
- Environment: `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- Setup: `.claude/mcp-setup-guide.md` (Step 1)

**When to Use It**:

- ✅ Creating test payment scenarios
- ✅ Validating payment processing logic
- ✅ Testing webhook handlers
- ✅ Debugging payment issues
- ✅ Building automated payment tests

**Example Usage**:

```
"Create a test customer in Stripe for john@example.com"
"Simulate a successful payment of $50"
"Show me recent charges in test mode"
"Create a test subscription for the $29/month plan"
```

**Current Status**: 🟢 Configured and ready
**Setup Effort**: ~10 minutes (get API keys, set environment variables)
**Phase**: Phase 2 (Weeks 3-4)

---

### MCP 2: Resend (Email Service)

**What It Does**:

- Enables Claude to preview and test email templates
- Validate email rendering and variables
- Test email delivery and formatting
- Help design email workflows

**Where It's Configured**:

- Configuration: `.claude/mcp.json` (Resend server definition)
- Environment: `RESEND_API_KEY`
- Setup: `.claude/mcp-setup-guide.md` (Step 2)

**When to Use It**:

- ✅ Designing email templates
- ✅ Testing email rendering
- ✅ Validating email variables
- ✅ Testing email delivery
- ✅ Building email workflows

**Example Usage**:

```
"Preview the welcome email template"
"Test this email with variables: name=John, plan=Pro"
"Show me all available email templates"
"Test sending this email template to john@example.com"
```

**Current Status**: 🟢 Configured and ready
**Setup Effort**: ~5 minutes (get test API key, set environment variable)
**Phase**: Phase 3 (Weeks 5-6)

---

### MCP 3: PostgreSQL (Database)

**What It Does**:

- Enables Claude to explore your database schema
- Query data for debugging
- Test RLS (Row Level Security) policies
- Validate migrations and data integrity

**Where It's Configured**:

- Configuration: `.claude/mcp.json` (PostgreSQL server definition)
- Environment: `DATABASE_URL`
- Setup: `.claude/mcp-setup-guide.md` (Step 3)

**When to Use It**:

- ✅ Understanding database schema
- ✅ Testing RLS policies
- ✅ Debugging data issues
- ✅ Validating migrations
- ✅ Exploring relationships

**Example Usage**:

```
"Show me the structure of the user_profiles table"
"List all RLS policies on the applications table"
"Show me all users with premium subscriptions"
"Validate the data in the applications table"
```

**Current Status**: 🟢 Configured and ready
**Setup Effort**: ~10 minutes (get Supabase connection string, set environment variable)
**Phase**: Phase 4 (Weeks 7-8)

---

## Part 5: How MCPs Enhance Your Workflow

### Before MCPs (Current Workflow)

```
Engineer's Workflow:

1. Start writing code in IDE ✏️
2. Need to test payment → Open Stripe dashboard 🌐
3. Create test customer manually 👆
4. Switch back to IDE 🔄
5. Need to test email → Open Resend dashboard 🌐
6. Preview template manually 👆
7. Switch back to IDE 🔄
8. Need to check database → Open database client 🌐
9. Run SQL query manually 👆
10. Switch back to IDE 🔄

Time Lost to Context Switching: 10-15 minutes per session 😫
Flow State Interrupted: Multiple times per development session 📉
```

### With MCPs (New Workflow)

```
Engineer's Workflow:

1. Start writing code in IDE ✏️
2. Need to test payment → Ask Claude in IDE: "Create test customer"
3. Claude uses Stripe MCP → Returns result instantly ⚡
4. Back to coding (no context switch) 🎯
5. Need to test email → Ask Claude in IDE: "Preview email"
6. Claude uses Resend MCP → Shows preview instantly ⚡
7. Back to coding (no context switch) 🎯
8. Need to check database → Ask Claude in IDE: "Show schema"
9. Claude uses PostgreSQL MCP → Returns schema instantly ⚡
10. Back to coding (no context switch) 🎯

Time Saved: 10-15 minutes per session ✅
Flow State Preserved: Stay in IDE the whole time 🎯
Efficiency Gain: 30-40% faster development 📈
```

### Real Example: Testing a Payment Feature

#### Without MCPs:

```
1. Write checkout component (5 min)
2. Open Stripe dashboard to create test customer (2 min)
3. Copy test customer ID back to IDE
4. Update test to use customer ID (1 min)
5. Open database client to validate charge was recorded (2 min)
6. Check results in database
7. Back to IDE to fix any issues (5 min)

Total: 15 minutes of coding + tool switching
```

#### With MCPs:

```
1. Write checkout component (5 min)
2. Tell Claude: "Create test customer and charge"
3. Claude creates customer and charge in Stripe (10 seconds) ⚡
4. Tell Claude: "Verify the charge in the database"
5. Claude queries database and shows result (5 seconds) ⚡
6. Back to IDE to fix any issues (5 min)

Total: 10 minutes of coding + 15 seconds of tool usage
Savings: 4-5 minutes saved per test cycle
```

---

## Part 6: Phase Breakdown & Timeline

### Phase 1: Infrastructure & Setup (Week 1) ✅

**Status**: Complete
**What Happened**:

- Audited all three systems (Stripe, Resend, PostgreSQL)
- Configured MCPs in `.claude/mcp.json`
- Created setup guide for developers
- Prepared team training materials

**Deliverables**:

- ✅ 11 comprehensive audit documents
- ✅ MCP configuration file
- ✅ Setup guide (5000+ words)
- ✅ This training document

**What You Need to Do**:

1. Read this document (15 min) ✅ You're doing it!
2. Follow setup guide to get API keys (10 min)
3. Set environment variables in `.env.local` (5 min)
4. Verify all three MCPs work (15 min)

---

### Phase 2: Stripe MCP Integration (Weeks 3-4) 🟡

**Purpose**: Replace manual Stripe testing with MCP-based testing

**What We'll Build**:

- Automated payment tests using Stripe MCP
- Test data generation with MCP
- Webhook simulation and testing
- Subscription testing

**Target**: >90% test coverage for payment system

**Effort**: 48-66 hours

**Key Success Metric**: "I can test any payment scenario without touching Stripe dashboard"

---

### Phase 3: Resend MCP Integration (Weeks 5-6) 🟡

**Purpose**: Build email system using Resend MCP

**What We'll Build**:

- Email templates (welcome, payment confirmation, recommendations, etc.)
- Email delivery integration
- Preference management
- Email testing and validation

**Target**: All 5+ user journeys have email flows

**Effort**: 60-80 hours

**Key Success Metric**: "Emails are sent automatically in the right moments, tested with MCPs"

---

### Phase 4: PostgreSQL MCP Integration (Weeks 7-8) 🟡

**Purpose**: Enable database exploration and RLS testing from IDE

**What We'll Build**:

- Database schema introspection tools
- RLS policy testing automation
- Migration validation tools
- Query debugging helpers

**Target**: All engineers can debug database issues in IDE

**Effort**: 50-70 hours

**Key Success Metric**: "I can test RLS policies and debug database issues without external tools"

---

## Part 7: Getting Started (Next Steps)

### Your Setup Checklist ✅

**Today** (Right now):

- [ ] Read this training document (15 min) ← You are here
- [ ] Review `.claude/mcp-setup-guide.md` (20 min)
- [ ] Understand Phase 2-4 timeline

**Tomorrow**:

- [ ] Get API keys (following setup guide)
  - [ ] Stripe test API key + webhook secret
  - [ ] Resend test API key
  - [ ] Supabase connection string
- [ ] Set environment variables in `.env.local`
- [ ] Verify MCPs work (following verification checklist)
- [ ] Ask for help if stuck (see support section below)

**This Week**:

- [ ] Attend team workshop (TBD)
- [ ] Ask questions about MCPs
- [ ] Get ready for Phase 2 kickoff

### Support & Resources

**Where to Find Help**:

1. **Setup Issues**: See troubleshooting in `.claude/mcp-setup-guide.md`
2. **How MCPs Work**: Refer back to this document
3. **Phase 2 Details**: See `docs/PHASE2_STRIPE_READINESS_CHECKLIST.md`
4. **Integration Examples**: See `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md`
5. **Questions**: Ask in team Slack or workshop

**Key Documents** (For Your Bookmarks):

- `.claude/mcp-setup-guide.md` - Setup and troubleshooting
- `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md` - Integration examples
- `docs/PHASE1_AUDIT_DOCUMENTATION_INDEX.md` - All Phase 1 docs

---

## Part 8: Frequently Asked Questions

### Q: Do I have to use MCPs?

**A**: No, but they'll make you more productive. Phase 2+ work will be much easier with MCPs. Without them, you'll be manually testing payments and other flows.

### Q: Will MCPs work with my development setup?

**A**: Yes! As long as you can set environment variables, you can use MCPs. Setup takes 20-30 minutes for experienced developers.

### Q: What if I have test/sandbox API keys?

**A**: That's exactly what you need! MCPs are designed to use test keys only. Production keys should NEVER be in development environments.

### Q: Can I disable an MCP if I don't need it?

**A**: Yes. In `.claude/mcp.json`, set `"disabled": true` for any MCP you don't want to use.

### Q: Will MCPs have access to production data?

**A**: No! You'll use test API keys (Stripe test mode, Resend test key) and development database. Your production systems are isolated and safe.

### Q: What if an MCP breaks or goes down?

**A**: MCPs are provided by Stripe, Resend, and PostgreSQL. They're as reliable as their services. If the service is down, the MCP won't work, but it won't break your code.

### Q: Can I use MCPs for production-like testing?

**A**: Yes! Test keys in Stripe and Resend are designed for this. You get realistic behavior without using production resources.

### Q: How do I report issues with MCPs?

**A**: Check the troubleshooting section in `.claude/mcp-setup-guide.md` first. If still stuck, post in team Slack with the error message.

### Q: Will MCPs change how I write code?

**A**: Not really. They're tools to help you test and debug faster. Your actual code (components, API endpoints, etc.) stays the same.

### Q: Do I need to update CLAUDE.md or code patterns for MCPs?

**A**: Yes! See `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md` for code patterns when using MCPs. Your team will maintain these patterns across the codebase.

### Q: What's the security model?

**A**: - ✅ MCPs run locally on your machine

- ✅ API keys are in environment variables, not code
- ✅ Test keys used in development, production keys only in production
- ✅ MCPs are read-only or test-mode write operations
- ✅ No sensitive data stored or shared

---

## Summary

### Key Takeaways

1. **What**: MCPs are a standard for AI agents to access your tools (Stripe, Resend, PostgreSQL)
2. **Why**: Improve development velocity by reducing context switching and enabling better testing
3. **How**: Three MCPs configured in `.claude/mcp.json`, requiring API keys and environment variables
4. **When**: Phase 2 starts Stripe, Phase 3 adds Resend, Phase 4 adds PostgreSQL testing
5. **Who**: All engineers will use them during Phase 2-4 development

### Next Action

1. **Read setup guide**: `.claude/mcp-setup-guide.md`
2. **Get API keys**: Follow the guide's instructions
3. **Set environment variables**: Create `.env.local`
4. **Verify MCPs work**: Use the verification checklist
5. **Attend workshop**: TBD (will be announced)

### Final Thought

MCPs are going to make your job easier. Instead of constantly switching between the IDE and external tools, Claude becomes your assistant that can interact with your systems directly. You stay in flow state, tests run faster, and bugs are caught earlier.

Welcome to the future of AI-assisted development! 🚀

---

**Last Updated**: November 10, 2025
**Version**: 1.0
**Questions?**: Ask in the team workshop or check the setup guide
