# MCP Integration Guidelines for Developers

**Version**: 1.0
**Last Updated**: November 10, 2025
**Audience**: Engineers building features in Phase 2+
**Purpose**: Code patterns and integration examples for MCPs

---

## Quick Start for Developers

### Before You Start

You'll need:
1. MCP servers configured (`.claude/mcp.json` ✓ already done)
2. Environment variables set (follow `.claude/mcp-setup-guide.md`)
3. All three MCPs verified working (use verification checklist)

### The Three MCPs You Have

| MCP | Phase | Use When | Commands |
|-----|-------|----------|----------|
| **Stripe** | Phase 2+ | Testing payments, creating test data | List customers, create charges, simulate webhooks |
| **Resend** | Phase 3+ | Designing/testing emails | Preview templates, test rendering, validate variables |
| **PostgreSQL** | Phase 4+ | Database debugging, RLS testing | Query data, test policies, explore schema |

---

## Part 1: Stripe MCP Integration

### Overview

The Stripe MCP allows you to:
- Create and manage test customers
- Simulate payment flows
- Test webhook handlers
- Build automated payment tests
- Create realistic test scenarios

### When to Use Stripe MCP

#### ✅ DO Use Stripe MCP For:

1. **Creating Test Data**
   ```
   "Create a test Stripe customer for john@example.com"
   "Create a subscription for the customer we just created"
   ```

2. **Testing Payment Flows**
   ```
   "Simulate a successful $99 payment for the customer"
   "Create a failed payment scenario to test error handling"
   ```

3. **Validating Payment State**
   ```
   "List all test customers we've created"
   "Show me recent charges in test mode"
   "Get the subscription status for customer_id"
   ```

4. **Building Payment Tests**
   ```
   "Create test fixtures for 5 different payment scenarios"
   "Simulate a webhook for payment_intent.succeeded"
   ```

#### ❌ DON'T Use Stripe MCP For:

- Accessing production data (use test mode only!)
- Making real charges to real customers
- Testing actual credit card processing
- High-volume load testing (use synthetic load tools instead)

### Code Patterns: Stripe MCP

#### Pattern 1: Creating Test Data for a Test

**When**: You're writing a test that needs a Stripe customer

**How**: Ask Claude to create the test data

```typescript
// Before: Manual test data setup
describe('Payment Processing', () => {
  test('creates subscription for customer', async () => {
    // ❌ Old way: Would need to manually create test customer
    const customerId = 'cus_test_123'; // Hardcoded
    // ...rest of test
  });
});

// After: Using Stripe MCP
describe('Payment Processing', () => {
  test('creates subscription for customer', async () => {
    // Ask Claude: "Create a test Stripe customer for test@example.com"
    // Claude returns: { id: 'cus_OqA3xJB...', email: 'test@example.com' }

    const customerId = 'cus_OqA3xJB...'; // Created by MCP

    // Test the subscription creation with real test customer
    const subscription = await createSubscription(customerId, 'price_test_monthly');

    expect(subscription.status).toBe('active');
  });
});
```

#### Pattern 2: Testing Payment Webhooks

**When**: You're testing webhook handlers

**How**: Ask Claude to simulate webhook scenarios

```typescript
// Before: Manual webhook testing
describe('Stripe Webhooks', () => {
  test('handles successful payment', async () => {
    // ❌ Old way: Manually construct webhook payload
    const payload = {
      type: 'payment_intent.succeeded',
      data: { object: { /* ... */ } }
    };
    // ...rest of test
  });
});

// After: Using Stripe MCP
describe('Stripe Webhooks', () => {
  test('handles successful payment', async () => {
    // Ask Claude: "Simulate a payment_intent.succeeded webhook"
    // Claude returns: { id: 'pi_...', status: 'succeeded' }

    const webhook = await stripeWebhookHandler({
      type: 'payment_intent.succeeded',
      data: { /* MCP provided realistic data */ }
    });

    expect(webhook.processed).toBe(true);
  });
});
```

#### Pattern 3: Validating Multiple Payment Scenarios

**When**: You need to test different payment states

**How**: Ask Claude to create diverse test scenarios

```typescript
// Testing multiple payment scenarios
describe('Payment Scenarios', () => {
  let testCustomers: any[] = [];

  beforeAll(async () => {
    // Ask Claude: "Create 5 test Stripe customers for payment testing"
    // Claude creates: successful payer, failed payment user, subscription user, etc.
    // Returns array of 5 realistic test customers

    testCustomers = await getTestCustomersFromMCP();
  });

  test('handles successful payment', async () => {
    const result = await processPayment(testCustomers[0]);
    expect(result.status).toBe('succeeded');
  });

  test('handles failed payment', async () => {
    const result = await processPayment(testCustomers[1]);
    expect(result.status).toBe('failed');
  });

  test('handles subscription upgrade', async () => {
    const result = await upgradeSubscription(testCustomers[2]);
    expect(result.planTier).toBe('premium');
  });
});
```

### Stripe MCP Commands Reference

**Customer Management**:
```
"List all test customers in Stripe"
"Create a test customer with email: john@example.com"
"Get details for customer: cus_123ABC"
"Update customer john@example.com with billing email: billing@example.com"
```

**Payment Testing**:
```
"Create a successful $99 payment for customer cus_123ABC"
"Create a failed payment (card declined) for customer cus_123ABC"
"Simulate a payment with no funds for customer cus_123ABC"
```

**Subscription Testing**:
```
"Create a monthly subscription ($29) for customer cus_123ABC"
"Upgrade customer cus_123ABC from basic to premium"
"Cancel subscription for customer cus_123ABC"
"Get subscription status for customer cus_123ABC"
```

**Webhook Simulation**:
```
"Simulate a payment_intent.succeeded webhook"
"Simulate a charge.failed webhook"
"Simulate a customer.subscription.updated webhook"
```

---

## Part 2: Resend MCP Integration

### Overview

The Resend MCP allows you to:
- Preview email templates
- Test email rendering
- Validate email variables
- Debug email formatting
- Design email workflows

### When to Use Resend MCP

#### ✅ DO Use Resend MCP For:

1. **Previewing Email Templates**
   ```
   "Preview the welcome email template"
   "Show me how the payment confirmation email renders"
   ```

2. **Testing Email Variables**
   ```
   "Test the welcome email with name=John and plan=Pro"
   "Show me the email with special characters in the name: José García"
   ```

3. **Validating Email Formatting**
   ```
   "Check if this email template is responsive on mobile"
   "Validate that all variables in the template are defined"
   ```

4. **Designing Email Workflows**
   ```
   "Create an email template for the payment confirmation"
   "Design a welcome email sequence for new users"
   ```

#### ❌ DON'T Use Resend MCP For:

- Sending real emails to production users from development
- Load testing email delivery
- Bulk email testing (use Resend test mode properly)

### Code Patterns: Resend MCP

#### Pattern 1: Email Template Validation

**When**: You're creating a new email template

**How**: Ask Claude to preview and validate the template

```typescript
// Email template with variables
const welcomeEmailTemplate = `
  <h1>Welcome, {{user.name}}!</h1>
  <p>You're now on the {{plan.name}} plan</p>
  <p>You can access {{features | join(", ")}}</p>
`;

// Before: Manual testing in Resend dashboard
// After: Using Resend MCP

describe('Welcome Email', () => {
  test('renders correctly with all variables', async () => {
    // Ask Claude: "Test this email template with:
    // user.name=John, plan.name=Pro, features=[AI Matching, Upskilling]"

    const preview = await getEmailPreviewFromMCP(welcomeEmailTemplate, {
      user: { name: 'John' },
      plan: { name: 'Pro' },
      features: ['AI Matching', 'Upskilling']
    });

    expect(preview.html).toContain('Welcome, John!');
    expect(preview.html).toContain('Pro plan');
  });

  test('handles missing variables gracefully', async () => {
    // Ask Claude: "Test this template with missing features variable"

    const preview = await getEmailPreviewFromMCP(welcomeEmailTemplate, {
      user: { name: 'Jane' },
      plan: { name: 'Free' }
      // Missing: features
    });

    // Should either show empty or default value
    expect(preview.errors).toContain('features is undefined');
  });
});
```

#### Pattern 2: Email Personalization

**When**: You're testing email personalization logic

**How**: Ask Claude to test various scenarios

```typescript
describe('Email Personalization', () => {
  const testCases = [
    { name: 'John', company: 'Acme' },
    { name: 'María', company: 'Tech Startup' },
    { name: 'José García-López', company: 'International Corp' }
  ];

  testCases.forEach(testCase => {
    test(`personalizes email for ${testCase.name}`, async () => {
      // Ask Claude: "Preview this email with name=${testCase.name}, company=${testCase.company}"

      const preview = await getEmailPreviewFromMCP(emailTemplate, testCase);

      expect(preview.subject).toContain(testCase.name);
      expect(preview.body).toContain(testCase.company);
    });
  });
});
```

#### Pattern 3: Email Workflow Testing

**When**: You're building multi-email sequences

**How**: Ask Claude to validate the entire sequence

```typescript
// Email workflow: signup → welcome → first match → upgrade
describe('Email Workflows', () => {
  test('signup triggers correct email sequence', async () => {
    // Ask Claude: "Show me the email sequence for new user signup:
    // 1. Welcome email
    // 2. First job match email
    // 3. Upgrade prompt email"

    const sequence = await getEmailSequenceFromMCP('signup', {
      user: { name: 'John' },
      plan: 'free'
    });

    expect(sequence).toHaveLength(3);
    expect(sequence[0].type).toBe('welcome');
    expect(sequence[1].type).toBe('first_match');
    expect(sequence[2].type).toBe('upgrade');
  });
});
```

### Resend MCP Commands Reference

**Template Management**:
```
"Show all email templates"
"List available email templates in our system"
"Get details for the welcome email template"
```

**Email Previewing**:
```
"Preview the welcome email with name=John"
"Show how this email renders on mobile"
"Test email rendering with long text and special characters"
```

**Variable Validation**:
```
"Check what variables are used in the payment confirmation email"
"Validate that all variables in the welcome email are defined"
"Test this email with missing variables"
```

**Email Testing**:
```
"Test sending welcome email to test@example.com"
"Show delivery status for email_id_123"
"Get bounce/complaint info for recent test emails"
```

---

## Part 3: PostgreSQL MCP Integration

### Overview

The PostgreSQL MCP allows you to:
- Explore database schema
- Test Row Level Security (RLS) policies
- Query data for debugging
- Validate migrations
- Understand data relationships

### When to Use PostgreSQL MCP

#### ✅ DO Use PostgreSQL MCP For:

1. **Understanding Database Schema**
   ```
   "Show me the structure of the user_profiles table"
   "What columns are in the applications table?"
   ```

2. **Testing RLS Policies**
   ```
   "Test if a user can see other users' profiles (RLS test)"
   "Verify that users can only access their own applications"
   ```

3. **Debugging Data Issues**
   ```
   "Show me all users with premium subscriptions"
   "Find applications created in the last 7 days"
   ```

4. **Validating Migrations**
   ```
   "Check if migration created the applications table correctly"
   "Show me the current schema version"
   ```

#### ❌ DON'T Use PostgreSQL MCP For:

- Modifying production data (use development database only!)
- Bulk operations (write scripts instead)
- High-volume queries (use proper database tools)

### Code Patterns: PostgreSQL MCP

#### Pattern 1: RLS Policy Testing

**When**: You're implementing Row Level Security

**How**: Ask Claude to test RLS policies

```typescript
// RLS Policy: Users can only see their own profile
describe('RLS: User Profile Access', () => {
  test('user can see their own profile', async () => {
    // Ask Claude: "Test if user_123 can access their own profile (user_id=user_123)"
    // Claude queries: SELECT * FROM user_profiles WHERE id = 'profile_123'
    //                (with RLS for user_123)

    const canAccess = await testRLSPolicy({
      table: 'user_profiles',
      userId: 'user_123',
      policy: 'users can only access their own profile'
    });

    expect(canAccess).toBe(true);
  });

  test('user cannot see another users profile', async () => {
    // Ask Claude: "Test if user_123 can access user_456's profile"

    const canAccess = await testRLSPolicy({
      table: 'user_profiles',
      userId: 'user_123',
      targetId: 'profile_456',
      policy: 'users can only access their own profile'
    });

    expect(canAccess).toBe(false);
  });
});
```

#### Pattern 2: Data Relationship Validation

**When**: You're verifying foreign key relationships

**How**: Ask Claude to validate the data structure

```typescript
describe('Data Relationships', () => {
  test('all applications have valid user_id', async () => {
    // Ask Claude: "Validate that all applications reference existing users"

    const orphans = await validateDataIntegrity({
      query: `
        SELECT a.id FROM applications a
        LEFT JOIN user_profiles u ON a.user_id = u.id
        WHERE u.id IS NULL
      `
    });

    expect(orphans).toHaveLength(0); // No orphaned records
  });

  test('user can only access their own applications', async () => {
    // Ask Claude: "Test RLS: Can user_123 see user_456's applications?"

    const result = await testRLSPolicy({
      table: 'applications',
      userId: 'user_123',
      policy: 'users can only access their own applications'
    });

    expect(result.canAccess).toBe(false);
  });
});
```

#### Pattern 3: Schema Validation

**When**: You're checking database migrations

**How**: Ask Claude to validate schema structure

```typescript
describe('Database Migrations', () => {
  test('migration creates applications table correctly', async () => {
    // Ask Claude: "Describe the applications table structure"

    const schema = await getTableSchema('applications');

    expect(schema.columns).toContainEqual({
      name: 'id',
      type: 'uuid',
      primaryKey: true
    });

    expect(schema.columns).toContainEqual({
      name: 'user_id',
      type: 'uuid',
      nullable: false
    });

    expect(schema.indexes).toContainEqual({
      name: 'idx_applications_user_id',
      columns: ['user_id']
    });
  });

  test('RLS policies are enabled on user tables', async () => {
    // Ask Claude: "List RLS policies on the user_profiles table"

    const policies = await getRLSPolicies('user_profiles');

    expect(policies.length).toBeGreaterThan(0);
    expect(policies).toContainEqual(
      expect.objectContaining({
        name: 'users_select_own_profile'
      })
    );
  });
});
```

### PostgreSQL MCP Commands Reference

**Schema Exploration**:
```
"Show me all tables in the database"
"Describe the structure of the user_profiles table"
"List all columns in the applications table"
"Show me the indexes on the experiences table"
```

**RLS Policy Testing**:
```
"List RLS policies on the user_profiles table"
"Test if user_123 can access their own profile"
"Verify that users can only see their own applications"
"Show RLS policies that allow all authenticated users access"
```

**Data Querying**:
```
"Show me all users with premium subscriptions"
"Find applications created in the last 7 days"
"Count how many users have completed their profiles"
"Show me users who haven't logged in for 30 days"
```

**Data Integrity**:
```
"Check if all applications have valid user_id references"
"Find orphaned records in the experiences table"
"Validate foreign key relationships"
"Show me duplicate entries in user_profiles"
```

---

## Part 4: Testing with MCPs

### Testing Strategy

#### Phase 2: Payment Testing with Stripe MCP

```typescript
describe('Payment Processing with Stripe MCP', () => {
  let testCustomer: any;

  beforeAll(async () => {
    // Create test customer via MCP
    testCustomer = await stripeCreateTestCustomer('test@example.com');
  });

  describe('Subscription Creation', () => {
    test('creates subscription with valid payment method', async () => {
      const subscription = await createSubscription(testCustomer.id);
      expect(subscription.status).toBe('active');
    });
  });

  describe('Payment Processing', () => {
    test('processes successful payment', async () => {
      // Simulate successful payment via Stripe MCP
      const payment = await stripeSimulatePayment({
        customerId: testCustomer.id,
        amount: 9900,
        status: 'succeeded'
      });

      expect(payment.status).toBe('succeeded');
      // Verify in your database that charge was recorded
    });

    test('handles failed payment', async () => {
      // Simulate failed payment via Stripe MCP
      const payment = await stripeSimulatePayment({
        customerId: testCustomer.id,
        amount: 9900,
        status: 'failed'
      });

      expect(payment.status).toBe('failed');
      // Verify proper error handling in your code
    });
  });
});
```

#### Phase 3: Email Testing with Resend MCP

```typescript
describe('Email Delivery with Resend MCP', () => {
  describe('Welcome Email', () => {
    test('renders correctly', async () => {
      const preview = await resendPreviewEmail('welcome', {
        name: 'John',
        plan: 'Pro'
      });

      expect(preview.subject).toContain('Welcome');
      expect(preview.html).toContain('John');
    });

    test('handles personalization', async () => {
      const preview = await resendPreviewEmail('welcome', {
        name: 'María García',
        plan: 'Premium'
      });

      expect(preview.html).toContain('María García');
      expect(preview.html).not.toContain('{{name}}'); // Variables resolved
    });
  });
});
```

#### Phase 4: Database Testing with PostgreSQL MCP

```typescript
describe('Data Integrity with PostgreSQL MCP', () => {
  test('RLS prevents unauthorized access', async () => {
    const canAccess = await testRLSPolicy({
      table: 'applications',
      userId: 'user_123',
      targetUserId: 'user_456',
      expectedAccess: false
    });

    expect(canAccess).toBe(false);
  });

  test('migrations create correct schema', async () => {
    const schema = await getTableSchema('applications');

    expect(schema).toHaveProperty('id');
    expect(schema).toHaveProperty('user_id');
    expect(schema.id.primaryKey).toBe(true);
  });
});
```

---

## Part 5: Common Integration Patterns

### Pattern: Feature Testing Checklist

When building a feature, use this checklist to ensure MCP integration:

**Before Starting**:
- [ ] Do you need Stripe MCP? (Payment-related features)
- [ ] Do you need Resend MCP? (Email-related features)
- [ ] Do you need PostgreSQL MCP? (Database-related features)

**During Development**:
- [ ] Using MCPs to create test data? (Not hardcoding)
- [ ] Testing with realistic scenarios from MCPs?
- [ ] Validating RLS policies if database changes?
- [ ] Previewing emails if email changes?

**During Testing**:
- [ ] Did you use MCP to create test fixtures?
- [ ] Did you validate behavior with MCP data?
- [ ] Did you test error cases with MCP?
- [ ] Did you verify data integrity with PostgreSQL MCP?

**Code Review**:
- [ ] Are MCPs used appropriately?
- [ ] Is test data created via MCP, not hardcoded?
- [ ] Are test scenarios realistic?
- [ ] Is there good documentation of MCP usage?

---

## Part 6: Troubleshooting MCP Integration

### Problem: MCP Fails During Test

**Symptoms**: "MCP connection refused" or "API key invalid"

**Troubleshooting**:
1. Verify environment variables are set: `echo $STRIPE_API_KEY`
2. Check that API key is in test mode (starts with `test_`)
3. Verify MCP is not disabled in `.claude/mcp.json`
4. Check Claude Code can access environment variables
5. Review MCP logs for more details

### Problem: Test Data Not Persisting

**Symptoms**: "Data created by MCP disappeared"

**Troubleshooting**:
1. Test data created via MCP is temporary (for test mode)
2. For persistent test data, you need to write to your database
3. Use MCP to create scenario, then verify in your code
4. Don't rely on MCP data persisting between sessions

### Problem: Email Template Not Rendering

**Symptoms**: "Variables not substituted in email preview"

**Troubleshooting**:
1. Check template variable names match what you're passing
2. Verify variable case sensitivity (JavaScript is case-sensitive!)
3. Use `{{variable}}` syntax for template variables
4. Test with simple variables first, then complex ones

### Problem: RLS Policy Test Returning Unexpected Results

**Symptoms**: "MCP says user can access data when they shouldn't"

**Troubleshooting**:
1. Verify you're testing as the right user ID
2. Check RLS policy syntax in database
3. Test with different user IDs to verify policy logic
4. Review PostgreSQL RLS documentation for correct syntax

---

## Part 7: Best Practices

### ✅ DO:

1. **Create test data via MCP, not hardcoded**
   ```typescript
   // ✅ Good
   const customer = await stripeCreateTestCustomer('test@example.com');

   // ❌ Bad
   const customer = { id: 'cus_test_hardcoded' };
   ```

2. **Test realistic scenarios**
   ```typescript
   // ✅ Good
   const payment = await stripeSimulatePayment({ status: 'failed' });

   // ❌ Bad
   // Only testing successful payments
   ```

3. **Validate across systems**
   ```typescript
   // ✅ Good - Test Stripe MCP creation + PostgreSQL MCP verification
   const customer = await stripeCreateTestCustomer(...);
   const dbUser = await queryDatabase(`SELECT * FROM users WHERE ...`);
   expect(dbUser.stripe_id).toBe(customer.id);
   ```

4. **Document MCP dependencies**
   ```typescript
   // ✅ Good
   describe('Payment Tests', () => {
     // Requires: Stripe MCP, PostgreSQL MCP
     // Purpose: Validate payment creation and recording
   });
   ```

### ❌ DON'T:

1. **Hardcode test data IDs**
   ```typescript
   // ❌ Bad
   const customerId = 'cus_test_12345'; // Hardcoded IDs break

   // ✅ Good
   const customer = await stripeCreateTestCustomer(...);
   const customerId = customer.id;
   ```

2. **Use production APIs in development**
   ```typescript
   // ❌ Bad
   STRIPE_API_KEY=sk_live_... // Production key in dev

   // ✅ Good
   STRIPE_API_KEY=sk_test_... // Test key in dev
   ```

3. **Ignore RLS in database tests**
   ```typescript
   // ❌ Bad
   const data = await rawQuery('SELECT * FROM applications'); // Bypasses RLS

   // ✅ Good
   const data = await authenticatedQuery(...); // Respects RLS
   ```

4. **Create MCPs dependency without documentation**
   ```typescript
   // ❌ Bad
   test('something', () => { /* Needs Stripe MCP but not documented */ });

   // ✅ Good
   describe('Payment Flows', () => {
     // Requires: Stripe MCP (configured with STRIPE_API_KEY)
   });
   ```

---

## Summary

### Key Points

1. **Stripe MCP**: Create test customers, simulate payments, test webhooks
2. **Resend MCP**: Preview emails, test rendering, validate personalization
3. **PostgreSQL MCP**: Test RLS, explore schema, debug data issues

### Your Workflow

1. **Phase 2**: Use Stripe MCP for payment feature testing
2. **Phase 3**: Use Resend MCP for email feature development
3. **Phase 4**: Use PostgreSQL MCP for database safety and debugging

### Getting Help

- **Setup Issues**: See `.claude/mcp-setup-guide.md` troubleshooting
- **Integration Questions**: Refer to patterns in this document
- **General Questions**: Check the team MCP Overview document

---

**Last Updated**: November 10, 2025
**Version**: 1.0
**Audience**: Engineers (Phase 2+)
