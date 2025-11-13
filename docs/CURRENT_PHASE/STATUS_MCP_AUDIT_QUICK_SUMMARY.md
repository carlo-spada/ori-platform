# MCP Architecture Audit: Quick Summary

**Date:** November 9, 2025
**Status:** Critical architectural mismatch identified

---

## The Problem in One Sentence

**MCPs are configured in `.claude/mcp.json` but never actually used—Stripe and Resend integrations use direct API calls instead.**

---

## What Was Intended

```
Phase 1 Setup: Configure MCPs
  ↓
Phase 2 Implementation: Use Stripe MCP for all payment operations
  ↓
Phase 3 Implementation: Use Resend MCP for all email operations
```

## What Actually Happened

```
Phase 1 Setup: ✓ Configured MCPs in .claude/mcp.json
  ↓
Phase 2 Implementation: ✗ Used direct Stripe SDK calls instead
  ↓
Phase 3 Implementation: ✗ Used custom HTTP wrapper for Resend instead
```

---

## Quick Facts

| Metric                 | Stripe       | Resend       | Combined          |
| ---------------------- | ------------ | ------------ | ----------------- |
| **MCP Configured?**    | ✓ Yes        | ✓ Yes        | —                 |
| **MCP Actually Used?** | ✗ No         | ✗ No         | **0% compliance** |
| **Direct API Calls**   | 14 types     | 1 type       | 15 total          |
| **Test Coverage**      | 0%           | 0%           | **0% total**      |
| **Functional?**        | Partial      | Broken       | Partial           |
| **Files Affected**     | 4 core files | 3 core files | 7 files           |

---

## Stripe Specifics

**What's Not Using MCP:**

1. Customer creation (2 types)
2. Payment methods (1 type)
3. Setup intents (1 type)
4. Subscriptions (2 types)
5. Checkout sessions (1 type)
6. Billing portal (1 type)
7. Webhooks (1 type)
8. Products & prices (2 types)
9. More webhook processing (4 types)

**Files making direct calls:**

- `src/lib/stripe.ts` — Creates Stripe instance directly
- `src/lib/stripeHelpers.ts` — 65 lines of direct SDK calls
- `src/routes/payments.ts` — 309 lines, 50+ direct calls
- `src/scripts/setupStripe.ts` — 150+ lines of direct calls

**Impact:** Can't test payment flows, 0% code coverage

---

## Resend Specifics

**What's Not Using MCP:**

1. Email sending (custom HTTP wrapper instead)

**Files making direct calls:**

- `src/lib/resend.ts` — 745 lines of custom HTTP client
- All email sending goes through custom ResendClient

**Impact:** Email system is non-functional

- Functions exist but are never called
- Database tables don't exist
- API endpoints don't exist
- Webhook → email flow is broken
- Users don't get payment failure alerts

---

## Broken Features

| Feature               | Should Work            | Actually        | Severity |
| --------------------- | ---------------------- | --------------- | -------- |
| Payment failure email | Sent on Stripe webhook | Never sent      | CRITICAL |
| Welcome email         | Sent on signup         | Not implemented | CRITICAL |
| Email preferences     | Saved in database      | Ignored         | HIGH     |
| Payment testing       | Via MCP simulation     | Manual only     | HIGH     |
| Email testing         | Via MCP                | Impossible      | CRITICAL |

---

## How to Fix This

### Quick (This Week)

- [ ] Create `notifications` database table
- [ ] Fix webhook → email hookup
- [ ] Test payment failure email locally

### Short-term (Next 2 Weeks)

- [ ] Create `StripeService` abstraction layer
- [ ] Replace Stripe SDK calls with service calls
- [ ] Integrate Stripe MCP
- [ ] Create email API endpoints
- [ ] Integrate Resend MCP

### Medium-term (Month 2)

- [ ] Add 80%+ test coverage for payments
- [ ] Add webhook simulation tests
- [ ] Document MCP patterns in CLAUDE.md

---

## Files That Need Changes

**Stripe (4 files):**

- `services/core-api/src/lib/stripe.ts`
- `services/core-api/src/lib/stripeHelpers.ts`
- `services/core-api/src/routes/payments.ts`
- `services/core-api/src/scripts/setupStripe.ts`

**Resend (3 files):**

- `services/core-api/src/lib/resend.ts`
- `services/core-api/src/utils/notifications.ts`
- `services/core-api/src/routes/payments.ts` (webhook integration)

**New Files Needed:**

- `services/core-api/src/routes/notifications.ts` (API endpoints)

**Database:**

- New migration for `notifications` table
- New migration for `notification_preferences` table

---

## Estimated Effort

| Phase     | Task                      | Hours           |
| --------- | ------------------------- | --------------- |
| 1         | Create abstraction layers | 8-10            |
| 2         | Replace Stripe calls      | 12-16           |
| 3         | Integrate MCPs            | 8-12            |
| 4         | Build tests               | 20-30           |
| 5         | Document                  | 4-6             |
| **TOTAL** | **Full MCP integration**  | **52-74 hours** |

---

## Key Insight

The MCP setup guide and configuration are **excellent**—the problem is that implementation diverged and went with quick wins (direct API calls) instead of the intended architecture (MCP-based).

This is **not a setup problem**, it's a **design debt problem** that needs to be addressed.

---

## References

- **Full Report:** `/Users/carlo/Desktop/Projects/ori-platform/docs/MCP_ARCHITECTURE_AUDIT.md`
- **MCP Config:** `/Users/carlo/Desktop/Projects/ori-platform/.claude/mcp.json`
- **Setup Guide:** `/Users/carlo/Desktop/Projects/ori-platform/.claude/mcp-setup-guide.md`
- **CLAUDE.md:** `/Users/carlo/Desktop/Projects/ori-platform/CLAUDE.md`
