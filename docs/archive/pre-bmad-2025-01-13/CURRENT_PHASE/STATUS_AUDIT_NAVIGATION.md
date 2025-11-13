# Architectural Audit: Document Navigation Guide

**Comprehensive MCP Integration Gap Analysis**
**Date:** November 9, 2025
**Repository:** Ori Platform
**Status:** Ready for Review

---

## START HERE

**New to this audit?** Start with these documents in order:

1. **[MCP_AUDIT_QUICK_SUMMARY.md](./MCP_AUDIT_QUICK_SUMMARY.md)** (5 min read)
   - One-sentence problem statement
   - Quick facts table
   - High-level findings
   - Files that need changes
   - Estimated effort

2. **[MCP_ARCHITECTURE_AUDIT.md](./MCP_ARCHITECTURE_AUDIT.md)** (30-40 min read)
   - Executive summary with context
   - Detailed Stripe analysis (Part 1)
   - Detailed Resend analysis (Part 2)
   - Gap analysis matrix (Part 3)
   - Refactoring scope (Part 4)
   - Critical findings (Part 5)
   - Recommendations (Part 6)

---

## Document Organization

### NEW DOCUMENTS (This Audit)

**Executive-Level Documents:**

- **MCP_AUDIT_QUICK_SUMMARY.md** - 1-2 page summary of the mismatch
- **MCP_ARCHITECTURE_AUDIT.md** - Comprehensive 9-part audit report

### EXISTING STRIPE DOCUMENTS

**From Previous Stripe Audit (Sept 2025):**

- **STRIPE_INFRASTRUCTURE_AUDIT.md** - 32KB complete technical audit
- **STRIPE_QUICK_REFERENCE.md** - 13KB quick navigation guide
- **STRIPE_CODE_LOCATIONS.md** - 15KB detailed code location reference
- **STRIPE_AUDIT_INDEX.md** - Index to Stripe documentation
- **PHASE2_STRIPE_READINESS_CHECKLIST.md** - Implementation checklist

### EXISTING EMAIL DOCUMENTS

**From Previous Email Audit (Nov 2025):**

- **EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md** - 24KB complete email audit
- **EMAIL_NOTIFICATION_INDEX.md** - Index to email documentation
- **RESEND_MCP_READINESS.md** - 17KB Resend implementation roadmap

### EXISTING MCP INTEGRATION DOCUMENTS

**From Previous MCP Planning (Nov 2025):**

- **MCP_INTEGRATION_MASTER_PLAN.md** - Overall integration strategy
- **MCP_INTEGRATION_ANALYSIS.md** - Technical analysis of MCP integration
- **MCP_MIGRATION_STRATEGIES.md** - Different approaches to migration
- **MCP_PHASE1_ARCHITECTURE.md** - Phase 1 architecture design
- **MCP_IMPLEMENTATION_SUMMARY.md** - Implementation summary
- **MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md** - Developer guidelines
- **POSTGRESQL_MCP_PHASE4_ROADMAP.md** - Database MCP roadmap
- **TEAM_TRAINING_MCP_OVERVIEW.md** - Team training overview

---

## How to Use These Documents

### If You're Planning MCP Integration

**Read in this order:**

1. MCP_AUDIT_QUICK_SUMMARY.md (understand the gap)
2. MCP_ARCHITECTURE_AUDIT.md (detailed findings)
3. MCP_INTEGRATION_MASTER_PLAN.md (overall strategy)
4. STRIPE_INFRASTRUCTURE_AUDIT.md (Stripe context)
5. RESEND_MCP_READINESS.md (Email context)

### If You're Implementing Stripe MCP

**Read in this order:**

1. MCP_ARCHITECTURE_AUDIT.md (Part 1: Stripe section)
2. STRIPE_INFRASTRUCTURE_AUDIT.md (technical details)
3. STRIPE_CODE_LOCATIONS.md (find exact lines)
4. MCP_INTEGRATION_MASTER_PLAN.md (strategy)

### If You're Implementing Resend MCP

**Read in this order:**

1. MCP_ARCHITECTURE_AUDIT.md (Part 2: Resend section)
2. EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md (technical details)
3. RESEND_MCP_READINESS.md (implementation roadmap)
4. MCP_INTEGRATION_MASTER_PLAN.md (strategy)

### If You're Reviewing/Approving

**Read in this order:**

1. MCP_AUDIT_QUICK_SUMMARY.md (5 min)
2. MCP_ARCHITECTURE_AUDIT.md (40 min)
3. Optional: Drill into specific sections based on questions

---

## Key Findings at a Glance

### Stripe (Phase 2)

**Status:** Configured for MCP, not using it
**Impact:** 14 API call types using direct SDK instead
**Coverage:** 0% automated tests
**Files affected:** 4 core files
**Effort to fix:** 40-50 hours

**What's not MCP:**

```
Stripe.customers.create()         ← Direct SDK
Stripe.subscriptions.create()     ← Direct SDK
Stripe.checkout.sessions.create() ← Direct SDK
Stripe.webhooks.constructEvent()  ← Direct SDK
And 10 more...
```

### Resend (Phase 3)

**Status:** Configured for MCP, using custom HTTP wrapper
**Impact:** Email system non-functional
**Coverage:** 0% tests, 0% integration
**Files affected:** 3 core files
**Effort to fix:** 30-40 hours

**What's not MCP:**

```
emailService.sendPaymentFailure()  ← Custom HTTP client
emailService.sendWelcome()         ← Custom HTTP client
(Never actually called from webhooks)
```

### Combined

**Total refactoring effort:** 60-90 hours
**Timeline:** 2-3 weeks
**Risk level:** Moderate (well-documented, clear path forward)

---

## Critical Issues Resolved by Audit

1. **Why don't users get payment failure emails?**
   - Answer: Webhook → email flow is broken. Functions exist but aren't called.

2. **Why can't we test payment flows?**
   - Answer: Using direct SDK calls instead of MCP. No test fixtures available.

3. **Why is MCP configured but unused?**
   - Answer: Architectural divergence. Phase 2/3 teams built direct calls instead of waiting for MCP integration.

4. **What should be the next step?**
   - Answer: Create abstraction layers, replace direct calls with MCP, build test suites.

---

## Files Referenced in Audit

### Configuration Files

- `.claude/mcp.json` - MCP configuration (3 MCPs configured)
- `.claude/mcp-setup-guide.md` - MCP setup instructions
- `CLAUDE.md` - Project principles and standards
- `AGENTS.md` - Team workflow and responsibilities

### Stripe Implementation Files

- `services/core-api/src/lib/stripe.ts` - Stripe client initialization
- `services/core-api/src/lib/stripeHelpers.ts` - Helper functions
- `services/core-api/src/routes/payments.ts` - Payment endpoints and webhooks
- `services/core-api/src/scripts/setupStripe.ts` - Setup script

### Resend Implementation Files

- `services/core-api/src/lib/resend.ts` - Email service implementation
- `services/core-api/src/utils/notifications.ts` - Notification helpers
- `services/core-api/src/routes/payments.ts` - Webhook integration (missing)
- `services/core-api/src/routes/notifications.ts` - API endpoints (needs implementation)

### Test Files

- `services/core-api/src/routes/__tests__/payments.*.test.ts` - Payment tests (mostly stubs)
- No email tests exist

### Database Files

- `supabase/migrations/` - Migration files
- Missing: `notifications` table migration
- Missing: `notification_preferences` table migration

---

## Action Items

### Immediate (This Week)

- [ ] Read MCP_AUDIT_QUICK_SUMMARY.md
- [ ] Review MCP_ARCHITECTURE_AUDIT.md
- [ ] Schedule architectural review meeting
- [ ] Create database tables for notifications

### Short-term (Next 2 Weeks)

- [ ] Create StripeService abstraction layer
- [ ] Integrate Stripe MCP
- [ ] Create email API endpoints
- [ ] Integrate Resend MCP

### Medium-term (Month 2)

- [ ] Build comprehensive test suite (target 80%+ coverage)
- [ ] Add webhook simulation tests
- [ ] Document MCP patterns in CLAUDE.md
- [ ] Create developer runbook

---

## Document Statistics

| Document                                   | Size       | Read Time     | Focus              |
| ------------------------------------------ | ---------- | ------------- | ------------------ |
| MCP_AUDIT_QUICK_SUMMARY.md                 | 5 KB       | 5 min         | Overview           |
| MCP_ARCHITECTURE_AUDIT.md                  | 26 KB      | 40 min        | Detailed findings  |
| STRIPE_INFRASTRUCTURE_AUDIT.md             | 32 KB      | 45 min        | Stripe deep-dive   |
| EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md | 24 KB      | 35 min        | Email deep-dive    |
| MCP_INTEGRATION_MASTER_PLAN.md             | 22 KB      | 30 min        | Strategy           |
| **TOTAL**                                  | **140 KB** | **3-4 hours** | Full understanding |

---

## Key Contacts

- **Original MCP Setup:** See `.claude/mcp-setup-guide.md` (Phase 1)
- **Stripe Audit:** `docs/STRIPE_INFRASTRUCTURE_AUDIT.md` (Sept 2025)
- **Email Audit:** `docs/EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md` (Nov 2025)
- **This Audit:** `docs/MCP_ARCHITECTURE_AUDIT.md` (Nov 2025)

---

## FAQ

**Q: Is this a blocker for shipping the platform?**
A: No. Stripe works. Email is non-critical for MVP. Can be addressed in Phase 2.5.

**Q: How urgent is this?**
A: Moderate. Users won't get payment failure emails (critical), but can manually check. Should be fixed soon.

**Q: Can we fix just the email first?**
A: Yes. Email fixes are independent of Stripe. Start with database tables + webhook connection.

**Q: Should we do MCP integration now?**
A: Recommended as a discrete task after email + Stripe issues are prioritized.

**Q: Who should own this?**
A: Claude (Implementer) for coding. Gemini for planning. Codex for review.

---

## Summary

This audit provides a **comprehensive gap analysis** showing that:

1. MCPs are **correctly configured** but **never used**
2. Direct API calls are being used **instead of MCPs**
3. Email system is **broken** due to missing integration
4. Payment testing is **impossible** without MCP
5. **60-90 hours of refactoring** needed to fix architectural debt

**Recommendation:** Accept this as planned technical debt, schedule Phase 2.5 for MCP integration, and improve testability & reliability.

---

**Audit Complete:** November 9, 2025
**Status:** Ready for architectural review
**Responsibility:** Project Leadership
**Next Step:** Plan Phase 2.5 MCP Integration Sprint
