# MCP Integration Migration Strategies

## Overview

This document details the specific migration strategies for transitioning from existing systems to MCP-based workflows. Each migration follows a **Parallel Operation → Validation → Deprecation** approach to ensure zero downtime and complete confidence in new systems.

---

## Migration Strategy 1: Email System (Resend MCP)

### Current State Assessment

**Current Implementation**:
- `services/core-api/src/utils/notifications.ts` is an empty placeholder (119 lines of skeleton code)
- No email sending capability exists in production
- User signup, recommendations, and alerts have no email component
- Scaling email will require complete system redesign

**Files Involved**:
- `services/core-api/src/utils/notifications.ts` (placeholder)
- `services/core-api/src/routes/users.ts` (signup route, no email trigger)
- `src/hooks/useProfile.ts` (frontend profile updates, no email)
- Core API index.ts (no email service initialization)

**Dependencies**:
- Resend API account and API key (test/sandbox mode)
- Email templates (new, to be created)
- Environment variables for Resend

---

### Migration Path: 3 Phases

#### Phase A: Parallel Implementation (Weeks 5-5.5)

**Goal**: Build complete email service alongside placeholder, zero breaking changes

**Step 1: Create Email Service Architecture**

```typescript
// services/core-api/src/services/email.ts (NEW)
import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  template: string
  variables: Record<string, unknown>
}

class EmailService {
  private resend: Resend

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey)
  }

  async send(options: EmailOptions) {
    // Template rendering + sending via Resend
    // Comprehensive error handling
    // Logging for debugging
    // Retry logic for transient failures
  }

  async sendWelcome(email: string, name: string) {
    return this.send({
      to: email,
      subject: 'Welcome to Ori Platform',
      template: 'welcome',
      variables: { name }
    })
  }

  async sendRecommendation(email: string, jobTitle: string) {
    return this.send({
      to: email,
      subject: `New recommendation: ${jobTitle}`,
      template: 'recommendation',
      variables: { jobTitle }
    })
  }
}

// Export singleton instance
export const emailService = new EmailService(process.env.RESEND_API_KEY!)
```

**Step 2: Create Email Templates Directory**

```
services/core-api/src/templates/
├── emails/
│   ├── welcome.tsx          # React/JSX template for welcome email
│   ├── recommendation.tsx    # Job recommendation email
│   ├── payment-receipt.tsx   # Payment confirmation email
│   ├── alert.tsx            # Generic alert email
│   └── layouts/
│       ├── base.tsx         # Base email layout
│       └── footer.tsx       # Reusable footer component
└── __tests__/
    ├── welcome.test.ts
    ├── recommendation.test.ts
    └── email.integration.test.ts
```

**Step 3: Add Email Trigger Points (Non-Breaking)**

In each route that should send email, add optional trigger:

```typescript
// services/core-api/src/routes/users.ts

import { emailService } from '../services/email'

router.post('/signup', async (req, res) => {
  // ... existing signup logic ...

  // NEW: Try to send welcome email (don't break signup if email fails)
  try {
    await emailService.sendWelcome(user.email, user.full_name)
  } catch (error) {
    // Log but don't throw - email optional during transition
    console.warn('[Email] Failed to send welcome email', error)
  }

  // ... return response ...
})
```

**Step 4: Create Email Testing Infrastructure**

```typescript
// services/core-api/src/services/__tests__/email.test.ts

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(() => {
    emailService = new EmailService(process.env.RESEND_API_KEY!)
  })

  describe('sendWelcome', () => {
    it('should send welcome email with correct variables', async () => {
      const result = await emailService.sendWelcome(
        'test@example.com',
        'John Doe'
      )
      expect(result.success).toBe(true)
      expect(result.id).toBeDefined()
    })

    it('should render template with variables', async () => {
      // Test template rendering with Resend MCP preview
    })

    it('should handle email validation errors', async () => {
      // Invalid email should throw
      await expect(
        emailService.sendWelcome('invalid-email', 'John')
      ).rejects.toThrow()
    })
  })

  describe('error handling', () => {
    it('should retry on transient failures', async () => {
      // Mock transient failure, verify retry succeeds
    })

    it('should log failures with context', async () => {
      // Verify error logging includes recipient, template, reason
    })
  })
})
```

**Deliverables for Phase A**:
- ✅ Complete `EmailService` implementation
- ✅ Email templates directory structure
- ✅ Email triggers added to signup route (non-breaking)
- ✅ Comprehensive email tests
- ✅ Git commit: `feat(email-service): implement Resend MCP email service in parallel`

---

#### Phase B: Validation & Hardening (Weeks 5.5-6)

**Goal**: Verify email system works correctly, all edge cases handled, production-ready

**Step 1: End-to-End Email Flow Testing**

```typescript
// services/core-api/src/__tests__/email.integration.test.ts

describe('Email Integration', () => {
  describe('user signup flow', () => {
    it('should send welcome email after successful signup', async () => {
      // 1. Sign up user via API
      // 2. Verify user created in database
      // 3. Verify welcome email sent
      // 4. Parse email from Resend logs
      // 5. Validate email content
    })

    it('should not break signup if email fails', async () => {
      // Mock Resend API failure
      // Sign up user
      // Verify user still created (email failure non-blocking)
      // Verify error logged
    })
  })

  describe('email template rendering', () => {
    it('should correctly interpolate all variables', async () => {
      // Use Resend MCP to preview template
      // Verify all variables rendered
      // Check no undefined values visible
    })

    it('should handle special characters in variables', async () => {
      // Test with HTML entities, quotes, special chars
      // Verify proper escaping
    })
  })

  describe('email delivery reliability', () => {
    it('should handle rate limiting gracefully', async () => {
      // Send many emails quickly
      // Verify queue handles rate limiting
      // Verify retry logic works
    })
  })
})
```

**Step 2: Email Content Validation**

```typescript
// Verify email templates with Resend MCP

// Using Claude Code + Resend MCP:
// 1. "Preview the welcome email template with sample data"
// 2. "Check all variables are populated correctly"
// 3. "Validate email is not marked as spam risk"
// 4. "Test email in different email clients (via Resend)"
```

**Step 3: Production-Ready Configuration**

```env
# Core API .env
RESEND_API_KEY=re_xxxxxxxxxxxxx              # From Resend dashboard
RESEND_FROM_EMAIL=noreply@getori.app         # Verified domain
RESEND_REPLY_TO=support@getori.app           # Support email
EMAIL_RETRY_ATTEMPTS=3                       # Retry failed sends
EMAIL_RETRY_DELAY_MS=5000                    # Wait before retry
EMAIL_LOG_LEVEL=info                         # Logging verbosity
```

**Step 4: Email Monitoring Setup**

```typescript
// services/core-api/src/lib/email-monitoring.ts (NEW)

import { emailService } from '../services/email'

interface EmailMetrics {
  sent: number
  failed: number
  bounced: number
  complained: number
  lastSentAt: Date
}

export class EmailMonitoring {
  private metrics: EmailMetrics = {
    sent: 0,
    failed: 0,
    bounced: 0,
    complained: 0,
    lastSentAt: new Date()
  }

  recordSent() { this.metrics.sent++ }
  recordFailed() { this.metrics.failed++ }

  // Expose metrics endpoint for monitoring
  getMetrics() { return this.metrics }
}
```

**Step 5: Add Health Check Endpoint**

```typescript
// services/core-api/src/routes/health.ts (UPDATE)

router.get('/health/email', async (req, res) => {
  try {
    const emailService = getEmailService()
    const result = await emailService.testConnection()

    res.json({
      status: 'healthy',
      emailService: result,
      lastCheck: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})
```

**Deliverables for Phase B**:
- ✅ End-to-end email flow tests passing
- ✅ All email templates previewed and validated
- ✅ Production environment configuration
- ✅ Email monitoring and health checks
- ✅ Team validation: email system tested in staging
- ✅ Git commit: `feat(email-service): add production-ready email monitoring and health checks`

---

#### Phase C: Enforce & Deprecate Old System (Week 6)

**Goal**: Make email service required, remove placeholder code

**Step 1: Enforce Email Sending**

```typescript
// Change optional email sending to required
// (after validating Phase B is successful)

router.post('/signup', async (req, res) => {
  // ... existing signup logic ...

  // CHANGED: Email now required (will throw if fails)
  await emailService.sendWelcome(user.email, user.full_name)

  // ... return response ...
})
```

**Step 2: Remove Placeholder Code**

```bash
# Delete old placeholder
rm services/core-api/src/utils/notifications.ts

# Remove from imports
# (automated by linter)
```

**Step 3: Add Required Email Checks to CI**

```yaml
# .github/workflows/email-checks.yml (NEW)
name: Email Service Validation

on: [push, pull_request]

jobs:
  email-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test email service
        run: pnpm --filter @ori/core-api test -- email
      - name: Validate templates
        run: pnpm --filter @ori/core-api test -- templates
```

**Step 4: Announce Deprecation to Team**

```markdown
# Email System Migration Complete ✅

## What Changed
- Old placeholder system removed
- Resend MCP-based email service now active
- All user communications sent via Resend

## What You Need to Do
1. Delete any references to old `notifications.ts`
2. Use `emailService` singleton for any new email triggers
3. Add email tests for new email-sending routes
4. Update onboarding docs (see CLAUDE.md)

## Migration Timeline
- ✅ Week 5: Parallel implementation
- ✅ Week 5.5-6: Testing and validation
- ✅ Week 6: Enforce new system
- **Week 6+**: Old system removed, email required

## Questions?
See `docs/RESEND_MCP_WORKFLOWS.md` for detailed workflows
```

**Deliverables for Phase C**:
- ✅ Email service required (no fallback)
- ✅ Placeholder code removed
- ✅ CI includes email validation
- ✅ Team notified of deprecation
- ✅ Git commit: `chore(email): enforce Resend MCP email service, remove placeholder`

---

### Email Migration Success Criteria

| Criterion | Baseline | Target | Status |
|-----------|----------|--------|--------|
| Email tests | 0 | >80% coverage | ✅ Phase B |
| Failed emails logged | No | Yes, with retry | ✅ Phase B |
| Developers can test email locally | No | Yes, from IDE | ✅ Phase A |
| Email templates versioned | No | Yes, in git | ✅ Phase A |
| Production ready | No | Yes, monitoring enabled | ✅ Phase B |
| Old system removed | No | Yes | ✅ Phase C |

---

## Migration Strategy 2: Database Testing (PostgreSQL MCP)

### Current State Assessment

**Current Implementation**:
- Developers use external tools (psql, DBeaver) for database work
- RLS policy testing requires manual SQL queries
- Migration validation requires manual database setup/cleanup
- Schema inspection context-switches away from IDE

**Files Involved**:
- `services/core-api/src/__tests__/setup.ts` (database test setup)
- `supabase/migrations/` (migration files)
- Various `.test.ts` files that query database

**Dependencies**:
- Supabase PostgreSQL connection
- PostgreSQL MCP server configured
- Database client library (already installed)

---

### Migration Path: 2 Phases

#### Phase A: Add PostgreSQL MCP to Test Setup (Weeks 7-7.5)

**Goal**: Enable PostgreSQL MCP queries in test files, don't break existing tests

**Step 1: Enhance Test Setup with PostgreSQL MCP**

```typescript
// services/core-api/src/__tests__/setup.ts (UPDATE)

import { PostgresClient } from '@ori/postgres-mcp' // Hypothetical

// Initialize PostgreSQL MCP client for tests
const postgresClient = new PostgresClient({
  connectionString: process.env.DATABASE_URL,
  readOnly: false // Allow writes in test
})

// Helper function for introspection
export async function inspectSchema(tableName: string) {
  return postgresClient.introspectTable(tableName)
}

// Helper for RLS policy inspection
export async function inspectRLSPolicies(tableName: string) {
  return postgresClient.getRLSPolicies(tableName)
}

// Helper for migration validation
export async function validateMigration(migrationFile: string) {
  return postgresClient.validateMigration(migrationFile)
}
```

**Step 2: Create RLS Policy Testing Helpers**

```typescript
// services/core-api/src/__tests__/rls-helpers.ts (NEW)

import { PostgresClient } from '@ori/postgres-mcp'

const db = new PostgresClient({
  connectionString: process.env.DATABASE_URL
})

/**
 * Test that RLS policy correctly restricts user access
 *
 * Example:
 * await testRLSPolicy({
 *   table: 'user_profiles',
 *   userId: 'user-123',
 *   expectedAccess: 'read_own'
 * })
 */
export async function testRLSPolicy(options: {
  table: string
  userId: string
  expectedAccess: 'read_own' | 'read_all' | 'write_own' | 'none'
}) {
  const policies = await db.getRLSPolicies(options.table)

  // Simulate query with given user context
  const canRead = await db.canUserRead(
    options.table,
    options.userId
  )

  // Validate against expected access
  switch (options.expectedAccess) {
    case 'read_own':
      return canRead && !canReadOthers // Can read own, not others
    case 'read_all':
      return canRead && canReadOthers
    case 'none':
      return !canRead
  }
}

/**
 * List all RLS policies for a table
 */
export async function listRLSPolicies(tableName: string) {
  return db.getRLSPolicies(tableName)
}

/**
 * Validate RLS policy implementation
 */
export async function validateRLSPolicy(tableName: string, policyName: string) {
  const policies = await db.getRLSPolicies(tableName)
  const policy = policies.find(p => p.name === policyName)

  if (!policy) {
    throw new Error(`RLS policy ${policyName} not found on ${tableName}`)
  }

  return {
    name: policy.name,
    definition: policy.definition,
    roles: policy.roles
  }
}
```

**Step 3: Add Database Introspection Tests**

```typescript
// services/core-api/src/__tests__/database.test.ts (NEW)

import { inspectSchema, inspectRLSPolicies } from './setup'

describe('Database Schema', () => {
  describe('user_profiles table', () => {
    it('should have correct columns', async () => {
      const schema = await inspectSchema('user_profiles')

      expect(schema.columns).toContainEqual(
        expect.objectContaining({
          name: 'id',
          type: 'uuid',
          nullable: false
        })
      )
      expect(schema.columns.map(c => c.name)).toContain('full_name')
      expect(schema.columns.map(c => c.name)).toContain('email')
    })

    it('should have RLS enabled', async () => {
      const policies = await inspectRLSPolicies('user_profiles')
      expect(policies.length).toBeGreaterThan(0)
    })

    it('should enforce user isolation via RLS', async () => {
      // Use helpers to validate RLS policies
      await testRLSPolicy({
        table: 'user_profiles',
        userId: 'user-123',
        expectedAccess: 'read_own'
      })
    })
  })

  describe('migrations', () => {
    it('should validate without errors', async () => {
      const result = await validateMigration('migrations/20250101_initial.sql')
      expect(result.valid).toBe(true)
    })
  })
})
```

**Step 4: Create Migration Validation Tool**

```typescript
// services/core-api/src/lib/migration-validator.ts (NEW)

import { PostgresClient } from '@ori/postgres-mcp'
import * as fs from 'fs'
import * as path from 'path'

class MigrationValidator {
  private db: PostgresClient

  constructor() {
    this.db = new PostgresClient({
      connectionString: process.env.DATABASE_URL
    })
  }

  /**
   * Validate a migration file would succeed
   * (dry-run, doesn't actually apply migration)
   */
  async validateMigration(filePath: string) {
    const sql = fs.readFileSync(filePath, 'utf-8')

    return {
      file: path.basename(filePath),
      valid: await this.db.validateSQL(sql),
      sqlStatements: sql.split(';').filter(s => s.trim()),
      estimatedExecutionTime: await this.db.estimateDuration(sql)
    }
  }

  /**
   * Validate all migrations in a directory
   */
  async validateAllMigrations(migrationDir: string) {
    const files = fs.readdirSync(migrationDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    const results = await Promise.all(
      files.map(f => this.validateMigration(path.join(migrationDir, f)))
    )

    return {
      total: files.length,
      valid: results.filter(r => r.valid).length,
      details: results
    }
  }

  /**
   * Show schema diff that migration would apply
   */
  async getMigrationDiff(filePath: string) {
    const sql = fs.readFileSync(filePath, 'utf-8')
    return this.db.getDiffForSQL(sql)
  }
}

export const migrationValidator = new MigrationValidator()
```

**Deliverables for Phase A**:
- ✅ PostgreSQL MCP integrated into test setup
- ✅ RLS policy testing helpers
- ✅ Database introspection tests
- ✅ Migration validation tool
- ✅ Git commit: `feat(postgres-mcp): add PostgreSQL MCP to test infrastructure`

---

#### Phase B: Modernize Database Workflows (Weeks 7.5-8)

**Goal**: Enable in-IDE database exploration, deprecate external tools

**Step 1: Create In-IDE Database Query Tool**

```typescript
// services/core-api/src/lib/db-inspector.ts (NEW)

/**
 * Run database query from IDE via PostgreSQL MCP
 * Used for debugging and schema exploration
 */
export async function runQuery(sql: string) {
  const result = await db.query(sql)

  return {
    rows: result.rows,
    rowCount: result.rowCount,
    fields: result.fields,
    executionTimeMs: result.executionTime
  }
}

/**
 * Show table definition
 */
export async function describeTable(tableName: string) {
  const schema = await db.introspectTable(tableName)

  return {
    name: tableName,
    columns: schema.columns.map(c => ({
      name: c.name,
      type: c.type,
      nullable: c.nullable,
      default: c.default,
      description: c.description
    })),
    indexes: schema.indexes,
    constraints: schema.constraints,
    rlsPolicies: schema.rlsPolicies,
    triggers: schema.triggers
  }
}

/**
 * Show all tables in database
 */
export async function listTables() {
  return db.listTables()
}

/**
 * Find references to a column (used in queries, foreign keys, etc)
 */
export async function findColumnReferences(tableName: string, columnName: string) {
  return db.findReferences(tableName, columnName)
}
```

**Step 2: Create PostgreSQL MCP Usage Patterns**

Document in `docs/POSTGRES_MCP_WORKFLOWS.md`:

```markdown
# PostgreSQL MCP Workflows

## Using Claude Code to Inspect Database Schema

### Show Table Structure
```
claude: "Show me the schema for the user_profiles table"
→ Displays columns, types, constraints, RLS policies
```

### Check RLS Policies
```
claude: "List all RLS policies on the applications table"
→ Shows policy definitions and which roles they apply to
```

### Validate Migration
```
claude: "Validate the migration file 20250101_add_skills.sql"
→ Shows if migration is syntactically valid, estimated duration
```

### Debug Data Issue
```
claude: "Show me all columns for users in the experiences table"
→ Displays schema and sample data
```

### Find Dependencies
```
claude: "Show me all tables that reference user_profiles"
→ Lists foreign key relationships
```
```

**Step 3: Add Database Health Checks**

```typescript
// services/core-api/src/routes/health.ts (UPDATE)

router.get('/health/database', async (req, res) => {
  try {
    const health = {
      connected: await db.isConnected(),
      tables: await db.countTables(),
      migrations: await db.getAppliedMigrations(),
      rlsEnabled: await db.isRLSEnabled(),
      replicationLag: await db.getReplicationLag(),
      responseTimeMs: await db.getConnectionHealth()
    }

    res.json({
      status: 'healthy',
      database: health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})
```

**Step 4: Create Database Development Runbook**

```markdown
# Database Development Runbook (PostgreSQL MCP)

## Before This Document
- Schema inspection required external tools (psql, DBeaver)
- RLS policy validation was manual SQL queries
- Migration testing required manual database setup

## Now With PostgreSQL MCP

### Daily Database Tasks

#### 1. Check Table Schema
```
# Old way: Open DBeaver, navigate to table
# New way:
claude: "Show schema for user_profiles table"
```

#### 2. Validate RLS Policies
```
# Old way: Run SELECT * FROM pg_policies WHERE...
# New way:
claude: "List RLS policies for applications table, show which users they protect"
```

#### 3. Test Migration
```
# Old way: Apply migration to test DB, check for errors, rollback
# New way:
claude: "Validate migration file 20250110_add_payment_status.sql"
```

#### 4. Debug Data Issue
```
# Old way: Write SQL query in psql, run manually
# New way:
claude: "Find all experiences for user 123 and show column values"
```

### When to Use External Tools
- Complex analytical queries (use psql for full query power)
- Manual data corrections (rare, use with caution)
- Performance analysis (use EXPLAIN ANALYZE)

### Benefits
✅ No context switching - everything from IDE
✅ Faster debugging (pre-written query patterns)
✅ Built-in validation (migration checking)
✅ Automatic RLS aware (respects policies)
✅ Audit trail (all queries logged)
```

**Deliverables for Phase B**:
- ✅ In-IDE database query patterns documented
- ✅ PostgreSQL MCP workflows guide created
- ✅ Database health check endpoints added
- ✅ Migration validation tool fully functional
- ✅ Team trained on new workflows
- ✅ Git commit: `feat(postgres-mcp): modernize database development workflows`

---

### Database Migration Success Criteria

| Criterion | Baseline | Target | Status |
|-----------|----------|--------|--------|
| RLS policy testing automated | Manual SQL | Tests in Jest | ✅ Phase A |
| Migration validation automated | Manual run+test | Auto-validation | ✅ Phase A |
| Schema inspection from IDE | No | Yes, via MCP | ✅ Phase B |
| Context-switching for DB work | 4+ tools | 1 (IDE only) | ✅ Phase B |
| Database health monitored | No | Yes, endpoints | ✅ Phase B |
| Developers trained | No | 100% | ✅ Phase B |

---

## Migration Strategy 3: Payment Testing (Stripe MCP)

### Current State Assessment

**Current Implementation**:
- Manual Stripe dashboard navigation for testing
- Webhook simulation requires external tools
- Payment scenarios require manual setup
- Test data isolated from code

**Files Involved**:
- `services/core-api/src/routes/payments.ts`
- `services/core-api/src/routes/subscriptions.ts`
- `src/lib/stripe.ts`
- `services/core-api/src/__tests__/` (test files)

---

### Migration Path: 2 Phases

#### Phase A: Add Stripe MCP Test Patterns (Weeks 3-3.5)

**Goal**: Add Stripe MCP alongside existing tests, zero breaking changes

**Step 1: Create Stripe MCP Test Helpers**

```typescript
// services/core-api/src/__tests__/stripe-helpers.ts (NEW)

import { StripeClient } from '@ori/stripe-mcp' // Hypothetical

const stripeClient = new StripeClient({
  apiKey: process.env.STRIPE_API_KEY,
  mode: 'sandbox'
})

/**
 * Create test customer with subscription
 */
export async function createTestCustomer(options: {
  email: string
  planId: string
  paymentMethodId?: string
}) {
  const customer = await stripeClient.createCustomer({
    email: options.email,
    metadata: { testMode: 'true' }
  })

  if (options.planId) {
    await stripeClient.createSubscription({
      customerId: customer.id,
      priceId: options.planId
    })
  }

  return customer
}

/**
 * Simulate webhook event
 */
export async function simulateWebhook(eventType: string, data: any) {
  return stripeClient.simulateWebhook({
    type: eventType,
    data
  })
}

/**
 * Get test webhook payload
 */
export async function getWebhookPayload(eventType: string) {
  return stripeClient.getTestPayload(eventType)
}
```

**Step 2: Add Stripe MCP Tests Alongside Existing Tests**

```typescript
// services/core-api/src/routes/__tests__/payments.test.ts (UPDATE)

import { createTestCustomer, simulateWebhook } from '../stripe-helpers'

describe('Stripe Payment Flows (with Stripe MCP)', () => {
  describe('subscription creation', () => {
    it('should create subscription via Stripe MCP', async () => {
      const customer = await createTestCustomer({
        email: 'test@example.com',
        planId: 'plus_monthly'
      })

      expect(customer.id).toBeDefined()
      expect(customer.subscriptions).toHaveLength(1)
    })
  })

  describe('webhook handling', () => {
    it('should handle subscription.updated webhook', async () => {
      const webhook = await simulateWebhook('customer.subscription.updated', {
        customerId: 'cus_123',
        subscriptionId: 'sub_456'
      })

      const response = await request(app)
        .post('/api/v1/webhooks/stripe')
        .send(webhook)

      expect(response.status).toBe(200)
    })
  })
})
```

**Deliverables for Phase A**:
- ✅ Stripe MCP test helpers created
- ✅ New tests using Stripe MCP added alongside old tests
- ✅ Test data generated by MCP instead of manually
- ✅ Webhook simulation working end-to-end
- ✅ Git commit: `feat(stripe-mcp): add MCP-based payment testing alongside existing tests`

---

#### Phase B: Enforce & Deprecate Manual Testing (Weeks 3.5-4)

**Goal**: Replace manual Stripe dashboard testing completely

**Step 1: Replace Existing Tests with MCP Versions**

**Step 2: Remove Manual Testing Documentation**

**Step 3: Update Developer Onboarding**

**Deliverables for Phase B**:
- ✅ All existing tests converted to Stripe MCP
- ✅ Manual testing docs removed
- ✅ Developer onboarding updated
- ✅ Git commit: `chore(stripe-mcp): enforce MCP payment testing, deprecate manual dashboard testing`

---

## Deprecation Cleanup Checklist

After each phase completes, follow this checklist:

```markdown
# Deprecation Cleanup Template

## Phase: [Email | Database | Stripe]

### Code Cleanup
- [ ] Remove deprecated code/imports
- [ ] Update remaining references
- [ ] Run linter and fix issues
- [ ] Ensure all tests passing

### Documentation Cleanup
- [ ] Archive old documentation
- [ ] Update README if needed
- [ ] Remove deprecated sections from CLAUDE.md
- [ ] Update AGENTS.md with new workflow

### Configuration Cleanup
- [ ] Remove deprecated environment variables
- [ ] Update .env.example
- [ ] Update deployment configs

### Team Communication
- [ ] Document what changed and why
- [ ] Announce official deprecation date
- [ ] Share migration guides for edge cases
- [ ] Answer team questions

### Git Hygiene
- [ ] Create deprecation commit
- [ ] Tag with version
- [ ] Update changelog

### Monitoring
- [ ] Monitor for usage of deprecated systems
- [ ] Alert if fallback being used
- [ ] Plan removal date (usually 2 weeks post-deprecation)
```

---

## Cross-Phase Timeline

```
Phase 1: Foundation (Weeks 1-2)
├─ All three MCPs setup
├─ Audit complete
└─ Documentation ready

Phase 2: Stripe MCP (Weeks 3-4)
├─ Week 3: Add MCP tests alongside old tests
├─ Week 3.5: Convert all tests to MCP
├─ Week 4: Deprecate manual testing
└─ 2 weeks later: Remove manual testing code

Phase 3: Resend MCP (Weeks 5-6)
├─ Week 5: Build email service in parallel
├─ Week 5.5: Validate email system
├─ Week 6: Enforce email service
└─ 2 weeks later: Remove placeholder code

Phase 4: PostgreSQL MCP (Weeks 7-8)
├─ Week 7: Add MCP test infrastructure
├─ Week 7.5: Modernize database workflows
├─ Week 8: Team trained on new patterns
└─ 2 weeks later: Deprecate external tools
```

---

## Rollback Plan

If any migration fails:

1. **Identify Issue**: Determine what went wrong
2. **Stop Deployment**: Prevent further breaking changes
3. **Revert Code**: `git revert [commit]` to previous state
4. **Verify Rollback**: Ensure old system working again
5. **Post-Mortem**: Document what went wrong
6. **Retry**: Fix issues and attempt migration again

Example:
```bash
# If email migration failed
git revert HEAD~3                    # Revert last 3 commits
git push origin dev
# App continues on old system while we fix issues
```

---

**Document Version**: 1.0
**Created**: November 2025
**Status**: Ready for Phase 1 Implementation
