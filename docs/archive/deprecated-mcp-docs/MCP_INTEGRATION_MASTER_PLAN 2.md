# MCP Integration Master Plan: Phase 1 Implementation

**Status**: Strategic Planning Phase
**Created**: November 2025
**Target Completion**: 8 weeks (2-week sprints)
**Scope**: Stripe MCP, Resend MCP, PostgreSQL MCP integration with graceful deprecation of redundant systems

---

## Executive Summary

This document outlines a comprehensive strategy for integrating three critical MCP servers into the Ori Platform while systematically phasing out redundant infrastructure and maintaining 100% backward compatibility throughout the transition.

### Why This Matters

Current State Problems:
- **Stripe testing** requires manual dashboard context-switching (slows development)
- **Email infrastructure** is placeholder-only; scaling will require significant refactoring
- **Database testing** lacks in-CLI tools; developers switch contexts constantly
- **No programmatic access patterns** to payment, email, or database workflows from development environment

MCP Integration Benefits:
- **90% reduction in context-switching** for payment/email/database tasks
- **40% faster iteration** on payment flows and email campaigns
- **Single source of truth** for database schema and queries
- **AI-assisted development** for complex integrations
- **Production-ready infrastructure** with minimal refactoring

---

## Phase 1: Foundation & Quick Wins (Weeks 1-2)

### 1.1 Infrastructure Discovery & Audit

**Objective**: Establish baseline and identify all systems affected by Phase 1 MCPs

**Tasks**:
1. **Payment System Audit** (Stripe)
   - [ ] Document all Stripe API call patterns in codebase
   - [ ] Map webhook handlers and their test coverage
   - [ ] Identify manual testing workflows
   - [ ] List environment configuration dependencies
   - **Files to audit**: `services/core-api/src/routes/payments.ts`, `src/lib/stripe.ts`, `src/integrations/api/payments.ts`

2. **Email System Audit** (Resend)
   - [ ] Identify all email trigger points in codebase
   - [ ] Document notification system placeholder implementation
   - [ ] Map user journey touchpoints requiring email
   - [ ] Catalog error handling for email failures
   - **Files to audit**: `services/core-api/src/utils/notifications.ts`, `src/hooks/useProfile.ts`

3. **Database Testing Audit** (PostgreSQL MCP)
   - [ ] List all current database testing patterns
   - [ ] Document schema inspection workflows
   - [ ] Map RLS policy testing procedures
   - [ ] Identify data migration validation patterns
   - **Files to audit**: `supabase/migrations/`, `services/core-api/src/__tests__/setup.ts`

**Deliverables**:
- `docs/MCP_AUDIT_BASELINE.md` (3-5 pages)
- `docs/STRIPE_MCP_READINESS.md` (system inventory)
- `docs/RESEND_MCP_READINESS.md` (system inventory)
- `docs/POSTGRES_MCP_READINESS.md` (system inventory)

**Success Criteria**:
- All three audit documents completed
- Zero ambiguity about which systems depend on payment/email/database infrastructure
- Team consensus on baseline understanding

---

### 1.2 MCP Server Setup & Configuration

**Objective**: Bootstrap MCP servers locally with working configurations

**Tasks**:
1. **Stripe MCP Server Setup**
   - [ ] Add Stripe MCP configuration to `.claude/mcp.json`
   - [ ] Test Stripe API connectivity with mock customer creation
   - [ ] Validate webhook simulation capabilities
   - [ ] Document connection parameters and secrets management

2. **Resend MCP Server Setup**
   - [ ] Install Resend MCP package in local environment
   - [ ] Configure API key and environment variables
   - [ ] Test email sending functionality with test templates
   - [ ] Validate template variable interpolation

3. **PostgreSQL MCP Server Setup**
   - [ ] Configure PostgreSQL MCP with Supabase connection string
   - [ ] Test schema introspection queries
   - [ ] Validate RLS policy inspection
   - [ ] Document connection pooling configuration

**Deliverables**:
- `.claude/mcp.json` updated with Phase 1 MCPs
- `.claude/mcp-setup-guide.md` (developer onboarding for MCP setup)
- Test results showing all three MCPs functional

**Success Criteria**:
- All three MCPs successfully initialize in local environment
- Team members can spin up MCP servers in <5 minutes
- Clear error messages if configuration is incorrect

---

### 1.3 Documentation Foundation

**Objective**: Create documentation structure for future phases

**Tasks**:
1. **Update CLAUDE.md**
   - Add "MCP-First Development Patterns" section
   - Document when to use each Phase 1 MCP
   - Link to MCP-specific runbooks

2. **Update AGENTS.md**
   - Add Claude's MCP responsibilities
   - Update workflow section with MCP integration checklist
   - Document deprecation timeline

3. **Create MCP Integration Index**
   - Quick reference guide for all Phase 1 MCPs
   - Decision tree: "When to use which MCP"
   - Common MCP patterns and anti-patterns

**Deliverables**:
- Updated `CLAUDE.md` with MCP integration section
- Updated `AGENTS.md` with Claude's MCP responsibilities
- New `docs/MCP_INTEGRATION_QUICK_REFERENCE.md`

**Success Criteria**:
- Clear guidance on which MCP to use for which task
- Any new developer can onboard to MCP workflow in <1 hour
- Links between documentation are bidirectional

---

## Phase 2: Stripe MCP Integration (Weeks 3-4)

### 2.1 Payment Testing Modernization

**Objective**: Replace manual Stripe dashboard testing with MCP-based workflows

**Current State Problems**:
- Developers manually navigate Stripe dashboard to test payment flows
- Webhook simulation requires external tools or manual cURL requests
- Payment scenarios (upgrade, downgrade, cancellation) require manual setup
- Test data isolated from code, hard to reproduce issues

**Solution Architecture**:
```
Old Flow:
Developer → Manual Stripe Dashboard → Test webhook manually → Copy webhook data → Paste into code

New Flow:
Developer → Stripe MCP (in Claude Code) → Generate test scenarios → Simulate webhooks → Auto-integrate into code
```

**Tasks**:

1. **Stripe MCP Testing Patterns**
   - [ ] Create `docs/STRIPE_MCP_WORKFLOWS.md` documenting:
     - How to use MCP to test subscription creation
     - How to simulate payment failures
     - How to generate webhook payloads
     - How to validate webhook handling
   - [ ] Add code examples for each pattern

2. **Payment Route Test Refactoring**
   - [ ] Identify all manual payment test scenarios
   - [ ] Convert to automated tests using Stripe MCP
   - [ ] Add MCP-assisted test data generation
   - [ ] Update test setup to use MCP for webhook simulation
   - **Files to update**:
     - `services/core-api/src/routes/__tests__/payments.test.ts`
     - `services/core-api/src/routes/__tests__/subscriptions.test.ts`

3. **Webhook Handler Modernization**
   - [ ] Document webhook handler requirements
   - [ ] Add MCP-assisted webhook payload validation
   - [ ] Create webhook scenario generator
   - [ ] Test edge cases (duplicate webhooks, out-of-order events)

4. **Development Command Addition**
   - [ ] Add `pnpm stripe:test-scenarios` command
   - [ ] Command uses Stripe MCP to generate test data
   - [ ] Output to development Stripe account

**Deliverables**:
- `docs/STRIPE_MCP_WORKFLOWS.md` (comprehensive guide)
- Updated payment test files using MCP patterns
- New npm script for MCP-assisted testing
- Webhook scenario generator tool

**Success Criteria**:
- All existing payment tests pass with new MCP-based approach
- New developers can test payment flows without leaving Claude Code
- Stripe dashboard context-switching reduced by 80%+
- Test coverage for payment flows increases by 20%+

---

### 2.2 Stripe MCP Documentation & Deprecation Prep

**Objective**: Prepare to deprecate old payment testing approaches

**Tasks**:

1. **Deprecation Timeline Creation**
   - [ ] Document which components/patterns will be deprecated
   - [ ] Establish sunset date (recommend 2 weeks after Phase 2 completion)
   - [ ] Create migration guide for existing tests

2. **Manual Testing Cleanup**
   - [ ] Identify all manual payment testing steps in developer docs
   - [ ] Create deprecation notices linking to new MCP workflows
   - [ ] Archive old dashboard navigation guides

3. **Knowledge Transfer**
   - [ ] Record 10-minute video: "Stripe MCP Workflow Demo"
   - [ ] Document FAQ: "Old way vs. new way"
   - [ ] Add to onboarding checklist

**Deliverables**:
- `docs/DEPRECATIONS.md` (Stripe manual testing section)
- Video demo and FAQ
- Migration guide for existing tests
- Onboarding checklist update

**Success Criteria**:
- Team consensus on deprecation timeline
- All team members trained on new MCP workflows
- Zero ambiguity about what's being phased out and why

---

## Phase 3: Resend MCP Integration (Weeks 5-6)

### 3.1 Email Infrastructure Implementation

**Objective**: Replace placeholder email system with production-ready Resend MCP integration

**Current State Problems**:
- `services/core-api/src/utils/notifications.ts` is empty placeholder
- No email sending capability exists
- Scaling email will require significant backend refactoring
- No transactional email templates

**Solution Architecture**:
```
Old Flow:
App → Placeholder notification function → Nothing happens

New Flow:
App → Core API email trigger → Resend MCP → Test in development → Production sending
```

**Tasks**:

1. **Email Infrastructure Design**
   - [ ] Design email service architecture (core-api wrapper around Resend MCP)
   - [ ] Define email types (welcome, recommendations, notifications, alerts)
   - [ ] Create email template structure
   - [ ] Design email failure handling and retries

2. **Core API Email Service Implementation**
   - [ ] Implement `services/core-api/src/services/email.ts`
   - [ ] Create email templates directory structure
   - [ ] Add email queue for transactional emails (optional: Bull queue)
   - [ ] Implement with Resend MCP integration
   - [ ] Add logging and error handling

3. **Email Trigger Points**
   - [ ] User signup → Welcome email
   - [ ] Job recommendation generated → Notification email
   - [ ] Application status change → Alert email
   - [ ] Payment receipt → Transaction email
   - [ ] Integrate triggers into existing API routes

4. **Email Testing Patterns**
   - [ ] Create `docs/RESEND_MCP_WORKFLOWS.md`
   - [ ] Document how to test email in development
   - [ ] Show email preview in Resend dashboard
   - [ ] Add MCP-assisted template testing

5. **Email Template System**
   - [ ] Design template variable system (Handlebars or similar)
   - [ ] Create reusable template components
   - [ ] Build template preview tool using Resend MCP
   - [ ] Document template authoring patterns

**Deliverables**:
- `services/core-api/src/services/email.ts` (email service)
- `services/core-api/src/templates/` directory with email templates
- `docs/RESEND_MCP_WORKFLOWS.md` (testing guide)
- Updated API routes with email triggers
- Email testing helper functions

**Success Criteria**:
- All email trigger points working end-to-end
- Developers can test email changes locally without external services
- Email templates fully customizable and previewable
- Zero context-switching required for email development

---

### 3.2 Email System Testing & Deprecation Prep

**Objective**: Validate email system and prepare for production rollout

**Tasks**:

1. **Email Service Tests**
   - [ ] Unit tests for email service
   - [ ] Integration tests for email triggers
   - [ ] Template rendering tests
   - [ ] Error handling tests

2. **User Journey Email Testing**
   - [ ] Test full signup → welcome email flow
   - [ ] Test recommendation → notification email flow
   - [ ] Test payment → receipt email flow
   - [ ] Test all failure scenarios

3. **Production Readiness Checklist**
   - [ ] Resend account configured
   - [ ] Email domain DNS records verified
   - [ ] Production API key secured
   - [ ] Email templates finalized
   - [ ] Bounce/complaint handling configured
   - [ ] Unsubscribe links configured

**Deliverables**:
- Email service test suite (>80% coverage)
- Production readiness checklist
- Email delivery monitoring documentation
- Runbook for email troubleshooting

**Success Criteria**:
- All email tests passing
- Team consensus on production readiness
- No manual email configuration required for new environments
- Email service fully operational in staging environment

---

## Phase 4: PostgreSQL MCP Integration (Weeks 7-8)

### 4.1 Database Development Modernization

**Objective**: Enable in-CLI database exploration and testing via PostgreSQL MCP

**Current State Problems**:
- Developers use external database tools (psql, DBeaver) for schema exploration
- RLS policy testing requires separate tooling
- Migration testing requires manual database setup/cleanup
- Data debugging requires context-switching

**Solution Architecture**:
```
Old Flow:
Developer → Open DBeaver/psql → Execute manual queries → Review results → Copy to code

New Flow:
Developer → PostgreSQL MCP in Claude Code → Automatic schema awareness → Run queries → Integrate results
```

**Tasks**:

1. **PostgreSQL MCP Query Patterns**
   - [ ] Create `docs/POSTGRES_MCP_WORKFLOWS.md` with:
     - Schema introspection queries
     - RLS policy inspection
     - Data querying and debugging
     - Migration validation patterns
   - [ ] Add code examples for each pattern

2. **Database Schema Documentation Automation**
   - [ ] Use PostgreSQL MCP to auto-generate schema docs
   - [ ] Create schema visualization tools
   - [ ] Add data relationship diagrams
   - [ ] Link to migration context

3. **RLS Policy Testing Patterns**
   - [ ] Document RLS policy testing with MCP
   - [ ] Create helper functions for policy validation
   - [ ] Add MCP-assisted policy debugging
   - [ ] Test auth context variations

4. **Migration Testing Workflows**
   - [ ] Add migration validation using PostgreSQL MCP
   - [ ] Test migration rollback scenarios
   - [ ] Validate data integrity after migrations
   - [ ] Create migration dry-run tool

5. **Development Data Management**
   - [ ] Create seed data generator using PostgreSQL MCP
   - [ ] Document data reset procedures
   - [ ] Add privacy-compliant test data patterns
   - [ ] Create database snapshot utilities

**Deliverables**:
- `docs/POSTGRES_MCP_WORKFLOWS.md` (comprehensive guide)
- Schema documentation auto-generated
- RLS policy testing helper functions
- Migration validation tool
- Database development utilities

**Success Criteria**:
- All schema queries runnable from Claude Code without external tools
- RLS policies fully testable via MCP
- Developers no longer need external database clients for common tasks
- Context-switching for database work reduced by 85%+

---

### 4.2 Database System Validation & Documentation

**Objective**: Ensure PostgreSQL MCP integration works flawlessly and document deprecations

**Tasks**:

1. **Comprehensive Database Testing**
   - [ ] Test all common RLS scenarios
   - [ ] Test migration procedures
   - [ ] Test data integrity queries
   - [ ] Test performance impact of MCP queries

2. **External Database Tool Deprecation Prep**
   - [ ] Document which external tools become optional
   - [ ] Create deprecation timeline
   - [ ] Prepare team for transition
   - [ ] Document fallback procedures

3. **Team Training**
   - [ ] Record PostgreSQL MCP workflow demo
   - [ ] Create FAQ document
   - [ ] Add to developer onboarding
   - [ ] Run team workshop

**Deliverables**:
- Comprehensive test suite for PostgreSQL MCP patterns
- Database tool deprecation guide
- Team training materials
- Developer workflow video

**Success Criteria**:
- Team comfortable using PostgreSQL MCP for daily database tasks
- No external database tools required for normal development
- All database operations traceable and logged
- Zero data integrity issues from MCP operations

---

## Cross-Phase Integration: Graceful Deprecation Strategy

### Deprecation Principles

1. **Additive First**: Always introduce new MCP workflows before deprecating old ones
2. **Parallel Operation**: Old and new systems coexist for full phase duration
3. **Clear Timeline**: Sunset dates published immediately
4. **Complete Migration**: Ensure 100% of functionality migrated before deprecation
5. **Easy Rollback**: Ability to revert to old systems if needed

### Deprecation Process

**Week 1 of Phase X**:
1. Announce deprecation timeline to team
2. Publish migration guides
3. Start training on new workflows

**Week 2 of Phase X**:
1. Monitor adoption of new workflows
2. Answer questions and refine documentation
3. Maintain both systems fully functional

**Week 1 after Phase X**:
1. Enforce use of new workflows
2. Archive documentation for old systems
3. Remove old system code/configuration

### Documentation for Each Deprecation

Each deprecation requires:
1. **What's changing**: Specific system/workflow being deprecated
2. **Why it's changing**: Benefits of new approach
3. **How to migrate**: Step-by-step migration guide
4. **Timeline**: Clear sunset date (minimum 2 weeks notice)
5. **Support**: Who to ask for help during transition
6. **Fallback**: What to do if new system doesn't work

### System-Specific Deprecation Plans

#### Stripe Manual Testing (Phase 2)
**Deprecated**: Manual Stripe dashboard navigation for testing
**Reason**: Slower, error-prone, requires context-switching
**Migration Timeline**: 2 weeks after Phase 2 completion
**Fallback**: Stripe dashboard still accessible for edge cases

#### Email Placeholder System (Phase 3)
**Deprecated**: `services/core-api/src/utils/notifications.ts` placeholder
**Reason**: Will be replaced by full Resend email service
**Migration Timeline**: 1 week after Phase 3 completion
**Fallback**: Manual email sending via direct Resend API

#### External Database Tools (Phase 4)
**Deprecated**: Required use of external database clients (psql, DBeaver)
**Reason**: PostgreSQL MCP provides equivalent or better functionality
**Migration Timeline**: 2 weeks after Phase 4 completion
**Fallback**: External tools remain available for complex scenarios

---

## Success Metrics & Validation

### Development Velocity
- **Metric**: Time to test new payment flow (Stripe)
- **Baseline**: ~15 minutes (Stripe dashboard navigation)
- **Target**: <3 minutes (MCP workflow)
- **Success**: 80%+ reduction in time

### Context Switching
- **Metric**: Tools open during payment/email/database development
- **Baseline**: 4+ (IDE, Stripe dashboard, email service, database client)
- **Target**: 1 (IDE only, via MCP)
- **Success**: All work done from IDE

### Onboarding Time
- **Metric**: Time for new developer to be productive with payment/email/database
- **Baseline**: 2-3 hours
- **Target**: <1 hour
- **Success**: Clear documentation, zero manual setup

### Test Coverage
- **Metric**: Test coverage for payment/email/database code
- **Baseline**: Current coverage levels
- **Target**: +20% absolute coverage
- **Success**: Easier to write tests with MCP assistance

### Team Adoption
- **Metric**: % of new code using MCP patterns
- **Target**: 90%+ within 2 weeks of deprecation
- **Success**: Team naturally prefers MCP workflows

---

## Risk Management

### Risk #1: MCP Server Unreliability
**Impact**: Development blocked if MCP servers crash
**Mitigation**:
- Comprehensive error handling in all MCP integrations
- Fallback to traditional methods if MCP unavailable
- Local MCP server redundancy
- Clear error messages and recovery procedures

### Risk #2: API Rate Limiting
**Impact**: Stripe/Resend rate limits could block development
**Mitigation**:
- Use sandbox/test environments exclusively in development
- Document rate limit thresholds
- Implement caching for frequent queries
- Graceful degradation if limits exceeded

### Risk #3: Data Loss During Migration
**Impact**: Losing existing email/payment configuration
**Mitigation**:
- Backup all existing configurations before migration
- Parallel operation of old and new systems
- Validation checks before deprecating old systems
- Detailed migration procedures with checkpoints

### Risk #4: Team Resistance
**Impact**: Team continues using old workflows, MCP integration fails
**Mitigation**:
- Early training and buy-in
- Clear benefits communication
- Minimal disruption to existing workflows
- Support during transition period

### Risk #5: Integration Complexity
**Impact**: Integration takes longer than planned, schedule slips
**Mitigation**:
- Iterative validation of each integration step
- Clear integration criteria before moving to next phase
- Buffer time in schedule
- Weekly progress reviews and course corrections

---

## Implementation Responsibility Matrix

| Task | Owner | Support | Review |
|------|-------|---------|--------|
| Infrastructure Audit | Claude | Gemini | Codex |
| MCP Server Setup | Claude | Team | Codex |
| Payment Testing | Claude | Team | Codex |
| Email Service | Claude | Team | Codex |
| Database Tooling | Claude | Team | Codex |
| Documentation | Claude | Gemini | Codex |
| Deprecation Timeline | Gemini | Claude | Carlo |
| Team Training | Gemini | Claude | - |
| Final Review & Approval | Carlo | Team | - |

---

## Timeline Overview

```
Week 1-2:   Phase 1 - Foundation & Audits
            ├─ Infrastructure discovery
            ├─ MCP server setup
            └─ Documentation foundation

Week 3-4:   Phase 2 - Stripe MCP
            ├─ Payment testing modernization
            ├─ Deprecation planning
            └─ Team training

Week 5-6:   Phase 3 - Resend MCP
            ├─ Email service implementation
            ├─ Production readiness
            └─ Integration with API

Week 7-8:   Phase 4 - PostgreSQL MCP
            ├─ Database modernization
            ├─ RLS testing patterns
            └─ Team training

Post-Phase: Ongoing
            ├─ Sunset old systems (2 weeks after each phase)
            ├─ Monitor adoption
            └─ Refine based on feedback
```

---

## Next Steps

1. **Immediate** (Today):
   - [ ] Review this plan with team
   - [ ] Confirm timeline and resource availability
   - [ ] Identify any blockers or concerns

2. **This Week**:
   - [ ] Begin Phase 1 infrastructure audit
   - [ ] Set up MCP server development environment
   - [ ] Create audit documentation structure

3. **Next Sprint**:
   - [ ] Complete Phase 1 deliverables
   - [ ] Get team sign-off on MCP workflows
   - [ ] Begin Phase 2 Stripe MCP integration

---

## Questions & Contact

For questions about this plan:
- **Implementation details**: Claude (via GitHub issues/PRs)
- **Strategic guidance**: Gemini (via AGENTS.md)
- **Code quality**: Codex (via code reviews)
- **Final approval**: Carlo

All discussion and decisions will be documented in git commits and PR descriptions.

---

**Document Version**: 1.0
**Last Updated**: November 2025
**Next Review**: After Phase 1 completion
