# Next Steps: MCP Implementation

**Date**: November 9, 2025
**Status**: Ready for Decision & Implementation

---

## What Happened

During the previous context window, I discovered and documented a critical architectural mismatch:

### The Problem
The project documentation (`.claude/mcp.json` and `.claude/mcp-setup-guide.md`) explicitly states that Phases 2 and 3 should use MCP (Model Context Protocol) servers, but I had built them using traditional direct API integrations:

- **Phase 2 (Payments)**: Using Stripe SDK directly ❌ → Should use Stripe MCP ✅
- **Phase 3 (Email)**: Using custom HTTP wrapper directly ❌ → Should use Resend MCP ✅

### The Impact
This architectural mismatch means:
- API keys stored in backend (less secure) instead of isolated in MCP servers
- Email templates built but never connected to actual system
- Users won't receive payment failure notifications (CRITICAL BUG)
- Tests are mocks, not real integration tests
- Cannot easily swap service providers

### Deliverables from Previous Context
I created three documentation files:
1. **`docs/MCP_AUDIT_QUICK_SUMMARY.md`** - 5-minute overview of the issue
2. **`docs/MCP_ARCHITECTURE_AUDIT.md`** - 9-section detailed audit (856 lines)
3. **`docs/AUDIT_NAVIGATION.md`** - Navigation guide for audit documents

And just now:
4. **`docs/MCP_REFACTORING_PLAN.md`** - 500+ line comprehensive refactoring plan with:
   - Architecture diagrams
   - Phase-by-phase implementation guide
   - Code examples for each MCP client
   - Test migration strategy
   - Timeline and risk assessment
   - Environment variable changes
   - Success criteria

---

## Current State

✅ **Documentation**: Complete
✅ **Architecture**: Designed
✅ **Code Examples**: Provided
❌ **Implementation**: Not yet started

---

## Your Decision Points

### Option A: Start Refactoring (Recommended)

**If you want to fix the architecture now:**

1. **Review the plan**: Read `docs/MCP_REFACTORING_PLAN.md` (10 minutes)
2. **Start with Phase 1** (Resend MCP - Email System):
   - Less risky than Stripe refactoring
   - Newer code (easier to understand changes)
   - Your explicit focus area: "specially the things we just set up"
   - Estimated effort: 8-12 hours
   - Estimated timeline: 1 day

**I will then**:
- Create MCP client services following the plan
- Refactor email templates and service layer
- Execute database migrations
- Update all 134 tests to use MCP mocks
- Commit changes with clear messages
- All tests should pass at end

### Option B: Continue with Traditional API Pattern

**If you want to keep current approach** (not recommended):
- Email system will work but architecturally inconsistent
- Payment system will be insecure (keys in backend)
- Tests will remain mock-based, not real integration
- Technical debt accumulates
- Future service provider swaps will be painful

### Option C: Hybrid Approach

**If you want to phase the work**:
- Start with Phase 1 (Email/Resend MCP) immediately (1 day)
- Plan Phase 2 (Payment/Stripe MCP) for later (2 days)
- Phase 3 (Webhook integration) after both services refactored (1 day)

---

## If You Choose Option A (Refactoring)

### Immediate Next Action: Approve Direction

**Before I proceed with implementation, please confirm**:

1. **Start with Phase 1 (Resend/Email MCP)?**
   - Yes → I'll begin creating MCP client, refactoring service layer, updating tests
   - No → What phase would you prefer?

2. **Timeline preference?**
   - All at once (4 days of work)
   - Phased (Phase 1 now, Phase 2 later)
   - Other?

3. **Any concerns about the approach?**
   - Review the MCP_REFACTORING_PLAN.md and let me know if anything needs adjustment

### Once Approved, I Will

**Phase 1 Implementation (1 day)**:
```
1. Create services/core-api/src/lib/resend-mcp.ts
2. Create services/core-api/src/lib/email-templates.ts
3. Create services/core-api/src/services/email.service.ts
4. Update services/core-api/src/routes/notifications.ts
5. Execute database migrations (supabase db push)
6. Update all 4 email test suites with MCP mocks
7. Test end-to-end email sending
8. Commit and push to dev
```

**Phase 2 Implementation (2 days)**:
```
1. Create services/core-api/src/lib/stripe-mcp.ts
2. Refactor services/core-api/src/routes/payments.ts
3. Refactor services/core-api/src/routes/subscriptions.ts
4. Refactor services/core-api/src/routes/setupIntent.ts
5. Update all 182 payment test suites with Stripe MCP mocks
6. Test end-to-end payment flow
7. Commit and push to dev
```

**Phase 3 Implementation (1 day)**:
```
1. Implement webhook email triggers in payment webhooks
2. Implement Resend webhook handler
3. Test complete flow: payment failure → webhook → email sent
4. Commit and push to dev
```

---

## Key Files to Review

Before deciding, I recommend reading:

1. **`docs/MCP_REFACTORING_PLAN.md`** (just created)
   - Complete refactoring strategy
   - Code examples for each phase
   - Timeline and risk assessment

2. **`.claude/mcp.json`** (existing)
   - Shows MCP server configuration
   - Proves the intent was MCP-based

3. **`.claude/mcp-setup-guide.md`** (existing)
   - Phase 2 section: "Stripe MCP will be used for payment testing"
   - Phase 3 section: "Resend MCP will be used for email implementation"

---

## Why This Matters

### Security
- Current: API keys in backend environment
- Target: API keys only in MCP server environment

### Maintainability
- Current: Direct SDK dependency (Stripe SDK, custom Resend wrapper)
- Target: Service abstraction (can swap Stripe for another payment processor)

### Testing
- Current: Mocks don't reflect real behavior
- Target: Real integration tests through MCP tools

### Architecture
- Current: Inconsistent (some direct APIs, some webhooks)
- Target: Consistent (all external services through MCP)

---

## Questions?

If anything in the refactoring plan is unclear:
- Ask for clarification on any phase
- Request code examples (I have them)
- Discuss timeline adjustments
- Discuss risk mitigation strategies

---

## Ready to Proceed?

Once you confirm your decision (Option A/B/C and timeline), I'll begin implementation immediately.

**To confirm**: Simply reply with something like:
- "Go ahead with Phase 1 (Resend MCP), then we'll do Stripe after"
- "Refactor everything (all 4 days of work)"
- "Let's skip refactoring, continue with current approach"
- "Questions about X in the plan first"

**I'll be ready to start as soon as you say the word.**

---

## Reference Documents

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `MCP_REFACTORING_PLAN.md` | Detailed implementation guide | 20 min |
| `MCP_AUDIT_QUICK_SUMMARY.md` | 5-minute overview of issue | 5 min |
| `MCP_ARCHITECTURE_AUDIT.md` | Deep dive analysis | 30 min |
| `AUDIT_NAVIGATION.md` | Guide for audit docs | 5 min |
| `.claude/mcp.json` | MCP server config | 2 min |
| `.claude/mcp-setup-guide.md` | MCP setup instructions | 10 min |
