# MCP Integration Documentation Index

## Overview

This folder contains comprehensive analysis of the Ori Platform codebase specifically focused on understanding how Model Context Protocol (MCP) server integration would affect existing systems. These documents are designed for developers planning to implement MCP functionality within the Ori ecosystem.

---

## Documents in This Set

### 1. MCP_INTEGRATION_QUICK_REFERENCE.md (257 lines)
**Purpose**: Fast reference for key integration points  
**Best For**: Quick lookups, developer onboarding, implementation checklists

**Contains**:
- At-a-glance technology stack
- High-value integration opportunities ranked by priority
- Critical implementation details (Stripe webhook patterns, test setup, etc.)
- Key files reference table
- Database schema overview
- Environment configuration examples
- Development workflow commands
- Recommended 5-week implementation roadmap

**Read Time**: 5-10 minutes

---

### 2. MCP_INTEGRATION_ANALYSIS.md (1,331 lines)
**Purpose**: Comprehensive technical analysis of all systems affected by MCP integration  
**Best For**: Deep dive understanding, architectural planning, implementation details

**Sections**:
1. **Project Architecture Overview** - Monorepo structure, technology stack
2. **Payment & Stripe Integration** - Webhook handling, configuration, testing
3. **Email & Notification System** - Placeholder implementation, integration points
4. **Database Architecture & Testing** - Schema, RLS, query patterns
5. **GitHub Workflow Automation** - CI/CD pipeline, existing MCP usage
6. **Testing Infrastructure** - Jest, pytest, vitest setup
7. **Service Communication Patterns** - Three-tier architecture, API layer
8. **Deployment & CI/CD Pipeline** - Production architecture, build config
9. **Documentation Structure & Standards** - How docs are maintained
10. **Environment Configuration** - Secrets management, env vars
11. **Internationalization** - Translation infrastructure (5 languages)
12. **Systems Affected by MCP Integration** - Impact analysis matrix
13. **Key Files for Reference** - File locations and purposes
14. **Critical Implementation Notes** - Stripe webhook gotchas, DB auth patterns
15. **Recommendations for MCP Integration** - Phased approach, best practices

**Read Time**: 30-45 minutes (skim) or 2-3 hours (deep study)

---

## Quick Navigation

### I want to understand...

**High-level overview?**
- Start: MCP_INTEGRATION_QUICK_REFERENCE.md
- Then: MCP_INTEGRATION_ANALYSIS.md Section 1 & 12

**Payment/Stripe system?**
- MCP_INTEGRATION_ANALYSIS.md Section 2
- Key file: `services/core-api/src/routes/payments.ts` (309 lines)

**Email notifications?**
- MCP_INTEGRATION_ANALYSIS.md Section 3
- Key file: `services/core-api/src/utils/notifications.ts` (119 lines)

**Database & testing?**
- MCP_INTEGRATION_ANALYSIS.md Section 4 & 6
- Key file: `docs/DATABASE_SCHEMA.md`

**GitHub Actions & CI/CD?**
- MCP_INTEGRATION_ANALYSIS.md Section 5 & 8
- Key file: `.github/workflows/gemini-invoke.yml` (existing MCP example)

**Service communication?**
- MCP_INTEGRATION_ANALYSIS.md Section 7
- Key file: `services/core-api/src/lib/ai-client.ts` (349 lines)

**Deployment pipeline?**
- MCP_INTEGRATION_QUICK_REFERENCE.md "Recommended Implementation Order"
- MCP_INTEGRATION_ANALYSIS.md Section 8

---

## Key Integration Opportunities (Ranked)

### Tier 1: High Impact, Low Effort
1. **Email Service MCP** - Replace placeholder notification system
   - Current: `services/core-api/src/utils/notifications.ts`
   - Target: SendGrid/Resend/AWS SES
   - Impact: Immediate production value
   - Effort: 2-3 days

### Tier 2: High Impact, Medium Effort
2. **Stripe API MCP** - Automate payment operations
   - Current: `services/core-api/src/routes/payments.ts`
   - Opportunities: Product management, webhook analytics
   - Impact: Operational efficiency
   - Effort: 3-5 days

3. **Supabase Database MCP** - Automate database operations
   - Current: Manual migrations via Supabase CLI
   - Opportunities: Auto-generate migrations, schema validation
   - Impact: Development velocity
   - Effort: 4-6 days

### Tier 3: Medium Impact, Medium Effort
4. **Deployment Orchestration MCP** - Multi-service coordination
   - Current: Sequential GitHub Actions jobs
   - Opportunities: Health checks, secret management, rollback
   - Impact: Reliability improvement
   - Effort: 5-7 days

### Tier 4: Enhancement/Polish
5. **Documentation Auto-Generation MCP** - Keep docs in sync
   - Current: Manual updates
   - Opportunities: API specs, code samples, architectural diagrams
   - Impact: Documentation quality
   - Effort: 3-5 days

---

## Critical Files for MCP Integration

**Absolute Must-Read**:
- `/services/core-api/src/routes/payments.ts` - Stripe integration pattern
- `/services/core-api/src/lib/ai-client.ts` - Service communication pattern
- `.github/workflows/gemini-invoke.yml` - Existing MCP server example
- `/docs/DATABASE_SCHEMA.md` - Database structure

**Important Context**:
- `CLAUDE.md` - Implementation guidelines
- `AGENTS.md` - Development workflow and versioning
- `docs/API_ENDPOINTS.md` - API specification
- `/services/core-api/jest.config.js` - Test setup pattern

---

## Development Environment Setup

To explore the codebase for MCP integration:

```bash
# Clone and install
git clone https://github.com/carlo-spada/ori-platform.git
cd ori-platform
pnpm install

# Install AI engine dependencies
cd services/ai-engine
pip install -r requirements.txt

# Create environment files
cp .env.example .env.local                    # Frontend
cp services/core-api/.env.example services/core-api/.env
cp services/ai-engine/.env.example services/ai-engine/.env
```

**Then run in 3 separate terminals**:
```bash
# Terminal 1: Frontend
pnpm dev                              # http://localhost:3000

# Terminal 2: Backend
pnpm dev:api                          # http://localhost:3001

# Terminal 3: AI Engine
cd services/ai-engine && python main.py  # http://localhost:3002
```

---

## Branch Protection & Workflow

**Important**: This project uses a strict two-branch workflow:
- `dev` branch: All feature development
- `main` branch: Production (auto-deployed to Vercel)

**For MCP Integration Work**:
1. Create feature branch from `dev`
2. Implement MCP integration
3. Update documentation (CLAUDE.md, AGENTS.md)
4. Create PR: feature-branch → dev
5. After review, dev → main triggers auto-deployment

See `AGENTS.md` for detailed workflow.

---

## Existing MCP Usage in Repository

The repository **already uses MCP servers** in GitHub Actions:

**Location**: `.github/workflows/gemini-invoke.yml`

**Current Setup**:
- Runs Docker-containerized GitHub MCP server
- Version: v0.18.0
- Tools: 20 GitHub operations (PR/issue/branch management)
- Environment: `GITHUB_PERSONAL_ACCESS_TOKEN` passed via env

**This provides a proven pattern** for adding additional MCP services:
1. Container-based approach (Docker)
2. Environment variable passing
3. Tool selection and configuration
4. Security handling (token management)

---

## Integration Checklist

Before implementing any MCP integration:

- [ ] Read MCP_INTEGRATION_QUICK_REFERENCE.md (5-10 min)
- [ ] Understand existing integration point (QUICK_REFERENCE section 1-2)
- [ ] Read relevant ANALYSIS.md section (30-60 min)
- [ ] Review critical files (60-120 min)
- [ ] Map out MCP service architecture (30 min)
- [ ] Design service isolation (30 min)
- [ ] Plan error handling & fallbacks (30 min)
- [ ] Create test strategy (30 min)
- [ ] Review CLAUDE.md & AGENTS.md (30 min)
- [ ] Implement feature branch (varies by scope)
- [ ] Update documentation (60 min)
- [ ] Create PR to dev branch (GitHub)

---

## Common Questions Answered

**Q: Why does the Stripe webhook route have to be before express.json()?**
A: Stripe signature verification requires the raw unparsed request body. See MCP_INTEGRATION_ANALYSIS.md Section 14.1.

**Q: How do I handle service-to-service authentication?**
A: The AI engine uses an HTTP client with optional authentication. See MCP_INTEGRATION_ANALYSIS.md Section 7.2.

**Q: What's the RLS policy used in Supabase?**
A: `auth.uid() = user_id` on all user-data tables. Backend uses service role key to bypass RLS. See MCP_INTEGRATION_ANALYSIS.md Section 4.1.

**Q: How are environment variables loaded in different services?**
A: Frontend: Next.js auto-loads `.env.local`. Backend: `dotenv.config()` in code. AI Engine: `load_dotenv()` in Python. See MCP_INTEGRATION_ANALYSIS.md Section 10.

**Q: Is there existing email infrastructure?**
A: Only placeholder in-app notifications exist. Perfect opportunity for MCP email service. See MCP_INTEGRATION_ANALYSIS.md Section 3.

**Q: What's the recommended MCP integration order?**
A: Email service → Stripe → Database → Deployment → Documentation. See MCP_INTEGRATION_QUICK_REFERENCE.md "Recommended Implementation Order".

---

## Related Documentation

**In this repository**:
- `CLAUDE.md` - Implementation guidelines and code standards
- `AGENTS.md` - Collaborative workflow and agent responsibilities
- `README.md` - Project overview and setup
- `docs/API_ENDPOINTS.md` - Complete API specification
- `docs/DATABASE_SCHEMA.md` - Database structure and migrations
- `docs/SUBDOMAIN_MIGRATION.md` - Subdomain routing architecture

**External Resources**:
- [MCP Specification](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## Support & Contact

**For questions about the codebase**:
- Primary developer: Carlo Spada
- Repository: https://github.com/carlo-spada/ori-platform
- Issue tracker: GitHub Issues

**For MCP specification questions**:
- Refer to official MCP documentation
- Check existing Gemini integration in `.github/workflows/gemini-invoke.yml`

---

## Document Maintenance

These documents should be updated when:
- New MCP integrations are implemented
- Architecture changes significantly
- New deployment patterns are established
- Critical security fixes are discovered
- Major dependency updates occur

**Update Instructions**:
1. Edit this file: `docs/MCP_INTEGRATION_INDEX.md`
2. Update affected files: `docs/MCP_INTEGRATION_ANALYSIS.md` and/or `docs/MCP_INTEGRATION_QUICK_REFERENCE.md`
3. Commit with message: `docs: update MCP integration documentation`
4. Push to dev branch

---

**Generated**: 2025-11-10  
**Status**: Complete and ready for implementation  
**Last Verified**: Against main branch commit 58c74f1
