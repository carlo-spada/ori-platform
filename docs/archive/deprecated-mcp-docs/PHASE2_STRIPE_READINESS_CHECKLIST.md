---
type: documentation
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: archive, deprecated, phase2, stripe, readiness, checklist.md, phase
priority: medium
quick-read-time: 9min
deep-dive-time: 14min
---

# Phase 2: Stripe MCP Integration - Readiness Checklist

**Phase**: Phase 2 (Weeks 3-4)
**Status**: Ready for Execution
**Objective**: Replace manual Stripe testing with MCP-based testing
**Success Metric**: >90% test coverage for payment system
**Team Size**: 2-3 engineers

---

## Pre-Phase 2 Checklist (Do This Before Week 3)

### Knowledge & Understanding ✓

- [ ] **Read**: `docs/TEAM_TRAINING_MCP_OVERVIEW.md` (15 min)
- [ ] **Read**: `.claude/mcp-setup-guide.md` (20 min)
- [ ] **Read**: `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md` (20 min)
- [ ] **Understand**: Why MCPs improve development velocity
- [ ] **Understand**: How Stripe MCP specifically will help Phase 2

### Setup & Verification ✓

- [ ] **Environment**: Set up `.env.local` with `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET`
  - [ ] Got test API key from Stripe dashboard
  - [ ] Got webhook secret from Stripe dashboard
  - [ ] Both keys start with `sk_test_` and `whsec_test_`
- [ ] **Verify**: Ran Stripe MCP verification commands
  - [ ] `"List test customers"` returns results
  - [ ] `"Create test customer"` works
  - [ ] `"Show recent charges"` returns data
- [ ] **Claude Code**: All MCPs load without errors on startup

### Current State Understanding ✓

- [ ] **Reviewed**: `docs/STRIPE_INFRASTRUCTURE_AUDIT.md`
  - [ ] Understand current payment system architecture
  - [ ] Know that payment routes are in `services/core-api/src/routes/payments.ts`
  - [ ] Understand 14 unique Stripe API call types identified
- [ ] **Reviewed**: `docs/STRIPE_QUICK_REFERENCE.md`
  - [ ] Know architecture diagram
  - [ ] Understand payment flow (Setup Intent → Confirm → Subscription)
  - [ ] Know webhook types being handled
- [ ] **Noted**: Current test coverage is 0% (critical gap we're fixing)

### Team Readiness ✓

- [ ] **Assigned**: Phase 2 team identified (2-3 engineers)
- [ ] **Scheduled**: Phase 2 kickoff meeting (Week 2, Day 5)
- [ ] **Resources**: All documentation available and reviewed
- [ ] **Support**: Know who to ask for MCP issues

---

## Phase 2 Execution Checklist (Week 3-4)

### Week 3: Setup & Test Infrastructure

#### Day 1-2: Test Infrastructure Setup

- [ ] **Create Test Utilities**
  - [ ] Create `services/core-api/src/__tests__/fixtures/stripe.fixtures.ts`
  - [ ] Create helper functions for Stripe MCP data creation
  - [ ] Create test customer factory using Stripe MCP
  - [ ] Create subscription factory using Stripe MCP
  - [ ] Document fixtures for team

- [ ] **Create Mock/Test Configuration**
  - [ ] Configure Jest for payment tests
  - [ ] Set up test environment variables
  - [ ] Create Stripe test client configuration
  - [ ] Document setup for future maintainers

#### Day 3-5: Payment Creation Tests

- [ ] **Test: Customer Creation**
  - [ ] Test creating customer via API
  - [ ] Test customer persisted to database
  - [ ] Test error handling (duplicate email, missing email)
  - [ ] Test customer ID returned correctly

- [ ] **Test: Subscription Creation**
  - [ ] Test creating subscription for customer
  - [ ] Test subscription persisted to database
  - [ ] Test correct price ID selected
  - [ ] Test error handling (invalid price, deleted customer)

- [ ] **Test: Payment Processing**
  - [ ] Test successful payment through SetupIntent → Confirm
  - [ ] Test payment recorded in database
  - [ ] Test invoice created in Stripe
  - [ ] Test invoice stored in database

**Target**: 10-15 new tests covering payment creation paths

### Week 4: Webhook & Advanced Tests

#### Day 1-2: Webhook Testing

- [ ] **Test: Webhook Handlers**
  - [ ] Test `payment_intent.succeeded` webhook
  - [ ] Test `customer.subscription.created` webhook
  - [ ] Test `customer.subscription.updated` webhook
  - [ ] Test `customer.subscription.deleted` webhook
  - [ ] Test `charge.failed` webhook
  - [ ] Test webhook signature validation
  - [ ] Test webhook idempotency

- [ ] **Test: Error Scenarios**
  - [ ] Test invalid webhook signature (should reject)
  - [ ] Test missing webhook secret
  - [ ] Test duplicate webhook processing (idempotency)

#### Day 3-4: Integration & Edge Cases

- [ ] **Test: Payment Scenarios**
  - [ ] Test successful payment flow (end-to-end)
  - [ ] Test failed payment + retry
  - [ ] Test subscription upgrade
  - [ ] Test subscription downgrade
  - [ ] Test subscription cancellation

- [ ] **Test: Error Handling**
  - [ ] Test payment with insufficient funds
  - [ ] Test payment with declined card
  - [ ] Test timeout handling
  - [ ] Test API rate limiting

#### Day 5: Test Coverage & Documentation

- [ ] **Test Coverage**
  - [ ] Run test coverage report
  - [ ] Verify >90% coverage on payment routes
  - [ ] Document coverage metrics
  - [ ] List any untestable edge cases (if any)

- [ ] **Documentation**
  - [ ] Document payment test patterns used
  - [ ] Create test data fixtures guide
  - [ ] Update CLAUDE.md with new payment testing patterns
  - [ ] Create Phase 2 completion summary

**Target**: 20-25 new tests covering webhooks and advanced scenarios

---

## Success Criteria for Phase 2

### Code Quality ✓

- [ ] **Test Coverage**: >90% on payment routes
- [ ] **Code Style**: Passes `pnpm lint` without errors
- [ ] **Builds**: `pnpm --filter @ori/core-api build` succeeds
- [ ] **Type Safety**: No TypeScript errors
- [ ] **Git**: All commits include clear messages

### Testing Quality ✓

- [ ] **All Tests Pass**: `pnpm --filter @ori/core-api test` succeeds with 100% pass rate
- [ ] **No Flaky Tests**: Tests pass consistently (run 3x to verify)
- [ ] **Test Isolation**: Tests don't depend on each other
- [ ] **MCP Usage**: All tests use Stripe MCP for creating test data (not hardcoded)
- [ ] **Realistic Scenarios**: Tests cover success and failure paths

### Documentation ✓

- [ ] **Code Comments**: Complex payment logic is well-documented
- [ ] **Test Comments**: Test purposes are clear
- [ ] **Fixtures Documented**: How to create test data is clear
- [ ] **Patterns Documented**: Payment testing patterns added to CLAUDE.md
- [ ] **Phase 2 Summary**: Completion summary created

### Team Readiness ✓

- [ ] **Knowledge Transfer**: Entire payment system understood by team
- [ ] **Confidence**: Team is confident in payment code correctness
- [ ] **Maintainability**: Tests can be maintained by future engineers
- [ ] **Onboarding**: New engineer can understand tests without help
- [ ] **Processes**: Team has established testing process for Phase 3

---

## Testing Patterns to Use in Phase 2

### Pattern 1: Creating Test Fixtures with Stripe MCP

```typescript
import {
  createStripeTestCustomer,
  createStripeTestSubscription,
} from '../fixtures/stripe.fixtures'

describe('Payment Processing', () => {
  it('creates subscription for customer', async () => {
    // Use Stripe MCP to create test data
    const customer = await createStripeTestCustomer('test@example.com')

    // Make API call
    const response = await request(app)
      .post('/api/v1/payments/subscribe')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ customerId: customer.id, planId: 'price_monthly' })

    // Verify response
    expect(response.status).toBe(200)
    expect(response.body.subscriptionId).toBeDefined()

    // Verify database
    const subscription = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = ?',
      [userId],
    )
    expect(subscription).toHaveLength(1)
  })
})
```

### Pattern 2: Testing Webhook Handlers

```typescript
describe('Stripe Webhooks', () => {
  it('processes payment_intent.succeeded webhook', async () => {
    // Create test payment with Stripe MCP
    const customer = await createStripeTestCustomer('test@example.com')
    const payment = await simulateStripePayment(customer.id, 9900)

    // Send webhook to handler
    const response = await request(app)
      .post('/api/v1/payments/webhook')
      .set('stripe-signature', generateSignature(payment.webhook))
      .send(payment.webhook)

    // Verify webhook was processed
    expect(response.status).toBe(200)

    // Verify database was updated
    const transaction = await db.query(
      'SELECT * FROM transactions WHERE payment_intent_id = ?',
      [payment.id],
    )
    expect(transaction.status).toBe('succeeded')
  })
})
```

### Pattern 3: Testing Error Scenarios

```typescript
describe('Payment Error Handling', () => {
  it('handles card declined error', async () => {
    // Simulate failure with Stripe MCP
    const customer = await createStripeTestCustomer('test@example.com')
    const failedPayment = await simulateStripePayment(customer.id, 9900, {
      status: 'failed',
    })

    // Call API with failed payment
    const response = await request(app)
      .post('/api/v1/payments/confirm')
      .send({ paymentIntentId: failedPayment.id })

    // Verify error handling
    expect(response.status).toBe(402) // Payment required
    expect(response.body.error).toContain('declined')
  })
})
```

---

## Deliverables for Phase 2

### Code Changes

- [ ] **Tests**: 30-40 new test cases for payment system
- [ ] **Fixtures**: Stripe test data factory in `__tests__/fixtures/`
- [ ] **Utilities**: Helper functions for Stripe MCP integration
- [ ] **Documentation**: Updated CLAUDE.md with payment testing patterns

### Documentation

- [ ] **Phase 2 Completion Summary**: Overview of work done, tests added, coverage achieved
- [ ] **Payment Testing Guide**: How to write new payment tests
- [ ] **Stripe MCP Patterns**: Common patterns used in tests

### Metrics

- [ ] **Test Coverage**: >90% for `src/routes/payments.ts`
- [ ] **Test Count**: 30-40 new tests
- [ ] **Lines of Test Code**: 1,000+ lines of test code
- [ ] **Pass Rate**: 100% test pass rate

---

## Common Pitfalls to Avoid

### ❌ DON'T:

1. **Hardcode test customer IDs**

   ```typescript
   // ❌ Bad - IDs change every test run
   const customerId = 'cus_test_12345';

   // ✅ Good - Create fresh customer each test
   const customer = await createStripeTestCustomer(...);
   ```

2. **Skip webhook signature validation tests**

   ```typescript
   // ❌ Bad - Webhook security not tested
   // Test only calls handler without verifying signature

   // ✅ Good - Test both valid and invalid signatures
   ```

3. **Use production API in tests**

   ```typescript
   // ❌ Bad - Real money could be charged
   STRIPE_KEY=sk_live_...

   // ✅ Good - Always use test mode
   STRIPE_KEY=sk_test_...
   ```

4. **Test only success paths**

   ```typescript
   // ❌ Bad - No error testing
   // Missing: failed payment, timeout, API error tests

   // ✅ Good - Test success, failure, and edge cases
   ```

### ✅ DO:

1. **Create fresh test data each test**
   - Prevents test interdependencies
   - Makes tests isolated and reliable

2. **Test both success and failure paths**
   - Successful payment
   - Failed payment (card declined)
   - Timeout/API error
   - Edge cases (subscription already exists, etc.)

3. **Verify database state after tests**
   - Assert payment recorded in `transactions` table
   - Assert subscription recorded in `subscriptions` table
   - Verify invoice created in both Stripe and database

4. **Document MCP usage in tests**
   - Add comment explaining why Stripe MCP is used
   - Reference the Stripe MCP pattern in comments
   - Make it clear what test data is being created

---

## Phase 2 Timeline

### Week 2 (Preparation)

- Day 5: Phase 2 kickoff meeting
- Read all Phase 2 documentation
- Get Stripe test API keys
- Verify Stripe MCP is working

### Week 3 (Infrastructure & Basic Tests)

- Day 1-2: Create test utilities and fixtures
- Day 3-5: Implement payment creation and subscription tests
- **Checkpoint**: 10-15 tests passing, basic infrastructure complete

### Week 4 (Webhooks & Advanced Tests)

- Day 1-2: Implement webhook handler tests
- Day 3-4: Implement error scenario tests
- Day 5: Verify >90% test coverage, documentation
- **Checkpoint**: 30-40 tests passing, >90% coverage achieved

---

## Resources for Phase 2

### Documentation

- `docs/STRIPE_INFRASTRUCTURE_AUDIT.md` - Technical analysis
- `docs/STRIPE_QUICK_REFERENCE.md` - Quick reference guide
- `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md` - Integration patterns
- `.claude/mcp-setup-guide.md` - Setup and troubleshooting

### Code References

- `services/core-api/src/routes/payments.ts` - Payment route handlers
- `services/core-api/src/services/stripe-service.ts` - Stripe service
- `shared/types/src/index.ts` - Type definitions for payments
- `docs/DATABASE_QUICK_REFERENCE.md` - Database schema reference

### Team Support

- **MCP Issues**: Refer to `.claude/mcp-setup-guide.md` troubleshooting
- **Architecture Questions**: Refer to `docs/STRIPE_INFRASTRUCTURE_AUDIT.md`
- **Pattern Questions**: Refer to `docs/MCP_INTEGRATION_GUIDELINES_FOR_DEVELOPERS.md`
- **Stuck?**: Ask in team Slack or schedule pairing session

---

## Success Definition

### Phase 2 is COMPLETE when:

1. ✅ **Test Coverage**: >90% on `src/routes/payments.ts`
2. ✅ **Test Count**: 30-40 new passing tests
3. ✅ **All Tests Pass**: 100% pass rate on payment tests
4. ✅ **Documentation**: Updated CLAUDE.md with new patterns
5. ✅ **Code Quality**: Passes lint, builds successfully, type-safe
6. ✅ **Team Confidence**: Entire team understands payment system
7. ✅ **No Regressions**: All existing functionality still works
8. ✅ **Git History**: Clean commits with descriptive messages

### What Success Looks Like

**Before Phase 2**: Manual testing, 0% coverage, payment bugs in production, slow testing

**After Phase 2**: Automated testing with Stripe MCP, >90% coverage, high confidence in payment code, fast feedback loop

---

## Next Steps After Phase 2

1. **Phase 3 (Weeks 5-6)**: Resend MCP integration for email system
2. **Phase 4 (Weeks 7-8)**: PostgreSQL MCP for database testing
3. **Future**: Expand MCP usage to other systems

---

**Created**: November 10, 2025
**Status**: Ready for Phase 2 Execution
**Duration**: 2 weeks (Weeks 3-4)
**Team**: 2-3 engineers
**Success Metric**: >90% test coverage + 30-40 new tests
