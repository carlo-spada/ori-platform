# Complete Workflow Overhaul (Phase 2-4)

**Status**: TODO
**Priority**: MEDIUM
**Estimated**: 16 hours (3 days)
**Owner**: Claude

## Objective

Finish the internal workflow optimization initiative started in Phase 1 to achieve 10x agentic development velocity.

## Current State (Phase 1 Complete ✅)

**Completed**:
- ✅ Task management CLI (`scripts/task`)
- ✅ WIP limits enforced (5 tasks maximum)
- ✅ Quick reference docs (CLAUDE_QUICKREF.md, GEMINI_QUICKREF.md)
- ✅ Specialized agents integration (AGENTS.md)
- ✅ GitHub Action for task health monitoring (every 4 hours)
- ✅ 4-state workflow (TODO → IN-PROGRESS → IN-REVIEW → DONE)
- ✅ 30-hour staleness threshold (agentic pace)
- ✅ Claude-primary workflow with external consultants

**Impact So Far**:
- Reduced task governance overhead by ~60%
- Cleared review backlog (29 tasks → 0)
- Simplified workflow from 6+ states to 4
- Improved documentation scanability

## Remaining Phases

### Phase 2: Schema & Contract Sentinel Automation (6 hours)

**Objective**: Automate detection of breaking changes in database schema and API contracts.

**Why This Matters**:
- Catch breaking changes before deployment
- Prevent production incidents
- Faster code reviews (automated checks)
- Database migration safety

**Implementation**:

#### 1. Schema Contract Sentinel Agent (3 hours)

**Triggers**:
- Changes to `supabase/migrations/*.sql`
- Changes to `shared/types/*.ts`
- Changes to API route files (`services/core-api/src/routes/*.ts`)

**Checks**:
- **Database Schema**:
  - Column removals or renames (breaking)
  - Type changes (potentially breaking)
  - Constraint additions (may break existing data)
  - Index changes (performance impact)
- **API Contracts**:
  - Endpoint removals or URL changes
  - Required parameter changes
  - Response shape changes
  - Breaking type changes in shared types
- **Migration Safety**:
  - No DROP COLUMN without migration plan
  - Data backfill requirements
  - Rollback procedures

**GitHub Action**:
```yaml
# .github/workflows/schema-sentinel.yml
name: Schema Contract Sentinel
on:
  pull_request:
    paths:
      - 'supabase/migrations/**'
      - 'shared/types/**'
      - 'services/core-api/src/routes/**'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need history to compare
      - name: Analyze Schema Changes
        run: |
          pnpm exec tsx scripts/analyze-schema-changes.ts
      - name: Analyze API Contracts
        run: |
          pnpm exec tsx scripts/analyze-api-contracts.ts
      - name: Post PR Comment
        uses: actions/github-script@v7
        with:
          script: |
            // Post analysis results as PR comment
```

**Script**:
```typescript
// scripts/analyze-schema-changes.ts
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// 1. Get changed migration files
// 2. Parse SQL to detect breaking changes
// 3. Check for migration plan comments
// 4. Flag potential issues
// 5. Generate report
```

**Acceptance Criteria**:
- [ ] GitHub Action triggers on schema/contract changes
- [ ] Detects breaking changes in migrations
- [ ] Detects breaking changes in API types
- [ ] Posts detailed analysis as PR comment
- [ ] Blocks merge if critical issues found (optional)

#### 2. Test Architect Agent Enhancement (3 hours)

**Current State**: test-architect agent exists in `.claude/agents/`

**Enhancement**: Automate test coverage analysis and gap identification

**Triggers**:
- New features (new routes, new components)
- Changes to core business logic
- Before PR merge

**Checks**:
- **Coverage Analysis**:
  - Line coverage % (target: 80% backend, 70% frontend)
  - Branch coverage
  - Uncovered critical paths
- **Test Quality**:
  - Mock usage (appropriate vs excessive)
  - Test isolation
  - Edge case coverage
- **Missing Tests**:
  - New endpoints without tests
  - New components without tests
  - Changed business logic without test updates

**GitHub Action**:
```yaml
# .github/workflows/test-architect.yml
name: Test Architect
on:
  pull_request:
    paths:
      - 'src/**/*.{ts,tsx}'
      - 'services/*/src/**/*.{ts,js}'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests with Coverage
        run: |
          pnpm test:coverage
      - name: Analyze Test Gaps
        run: |
          pnpm exec tsx scripts/analyze-test-coverage.ts
      - name: Post Coverage Report
        uses: actions/github-script@v7
```

**Acceptance Criteria**:
- [ ] Automated test coverage analysis on PRs
- [ ] Identifies files without adequate tests
- [ ] Suggests test cases for edge cases
- [ ] Posts coverage report as PR comment
- [ ] Tracks coverage trends over time

### Phase 3: RAG for Documentation (6 hours)

**Objective**: Enable Claude to instantly search and retrieve information from project documentation without reading entire files.

**Why This Matters**:
- Faster context retrieval (seconds vs minutes)
- More accurate answers (semantic search)
- Reduces token usage (only read relevant sections)
- Scales with growing documentation

**Implementation**:

#### 1. Documentation Embedding (2 hours)

**Documents to Index**:
- `README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- `.tasks/TASK_GOVERNANCE.md`
- `docs/**/*.md` (all documentation)
- `.claude/agents/*.md` (agent definitions)
- Migration files (for schema questions)
- Test files (for test pattern examples)

**Tech Stack**:
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2) - already have in ai-engine
- **Vector Store**: Simple JSON file or SQLite with vector extension
- **Update Trigger**: GitHub Action on doc changes

**Script**:
```typescript
// scripts/embed-documentation.ts

import { encode } from 'gpt-tokenizer';
import { embed } from '../services/ai-engine/src/embeddings';

async function embedDocumentation() {
  // 1. Read all markdown files
  // 2. Split into chunks (500 tokens with 50 token overlap)
  // 3. Generate embeddings for each chunk
  // 4. Store in vector database
  // 5. Create index for fast retrieval
}
```

#### 2. RAG Query Interface (2 hours)

**MCP Server for Documentation**:
```typescript
// mcp-servers/documentation/index.ts

import { MCPServer } from '@modelcontextprotocol/sdk';

const server = new MCPServer({
  name: 'ori-documentation',
  version: '1.0.0',
});

server.tool('search_docs', async ({ query }: { query: string }) => {
  // 1. Embed the query
  // 2. Search vector store for similar chunks
  // 3. Rank by relevance
  // 4. Return top 5 results with context
});

server.tool('get_doc', async ({ path }: { path: string }) => {
  // Direct file retrieval
});
```

**Claude Usage**:
```typescript
// Instead of: Read entire AGENTS.md
// Now: search_docs("What is the git workflow?")
// Returns: Only relevant sections about git workflow
```

#### 3. Auto-Update Pipeline (2 hours)

**GitHub Action**:
```yaml
# .github/workflows/update-doc-embeddings.yml
name: Update Documentation Embeddings
on:
  push:
    branches: [main, dev]
    paths:
      - '**.md'
      - 'docs/**'
      - '.claude/**'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate Embeddings
        run: pnpm exec tsx scripts/embed-documentation.ts
      - name: Commit Updated Index
        run: |
          git add .embeddings/
          git commit -m "chore: update documentation embeddings"
          git push
```

**Acceptance Criteria**:
- [ ] All documentation embedded and indexed
- [ ] MCP server for documentation queries
- [ ] Search returns relevant results in <1 second
- [ ] Auto-updates on doc changes
- [ ] Claude CLI configured to use documentation MCP

### Phase 4: Monitoring Dashboard (4 hours)

**Objective**: Visual dashboard for project health, velocity, and system status.

**Why This Matters**:
- At-a-glance project health
- Identify bottlenecks quickly
- Track velocity trends
- Monitor system uptime and performance

**Implementation**:

#### Dashboard Page (3 hours)

**Route**: `/admin/dashboard` (authenticated, admin-only)

**Widgets**:

1. **Task Health** (from `scripts/task health`)
   - Current WIP count
   - Stale tasks (>30 hours)
   - Review backlog
   - Completion velocity (tasks/day)
   - Trend graph (last 30 days)

2. **Deployment Status**
   - Latest Vercel deployment (success/failure)
   - Uptime percentage (last 7 days)
   - Recent deployments list
   - Link to Vercel dashboard

3. **GitHub Activity**
   - Open PRs
   - Failing workflows
   - Recent commits
   - Open issues

4. **Stripe Metrics** (once live)
   - MRR (Monthly Recurring Revenue)
   - Active subscriptions
   - Churn rate
   - New signups (last 7 days)

5. **System Health**
   - API response time (p50, p95, p99)
   - Error rate
   - Database connection pool
   - Active users (last 24 hours)

**Data Sources**:
- GitHub API (PRs, issues, workflows)
- Vercel API (deployments, analytics)
- Stripe API (subscriptions, revenue)
- Supabase (database metrics)
- Internal analytics (user activity)

**Tech Stack**:
- shadcn/ui Card components
- recharts for graphs
- Real-time updates via polling or webhooks

#### Automated Reports (1 hour)

**Daily Summary Email** (via Resend):
```typescript
// Send at 9 AM daily
// Recipients: Team
// Content:
// - Task velocity (yesterday)
// - Deployments (yesterday)
// - New users (yesterday)
// - Critical issues (if any)
// - Top priority for today
```

**Weekly Report** (via Resend):
```typescript
// Send Monday 9 AM
// Content:
// - Velocity trends (last week vs previous)
// - Completed features
// - Open blockers
// - Upcoming milestones
// - Celebration: What went well
```

**Acceptance Criteria**:
- [ ] Dashboard page deployed and functional
- [ ] All widgets showing real data
- [ ] Graphs render correctly
- [ ] Auto-refresh every 5 minutes
- [ ] Daily summary email sending
- [ ] Weekly report email sending

## Overall Acceptance Criteria

- [ ] Phase 2: Schema sentinel automated and active
- [ ] Phase 2: Test architect enhanced and running on PRs
- [ ] Phase 3: Documentation RAG working and integrated
- [ ] Phase 3: MCP server for docs configured in Claude
- [ ] Phase 4: Dashboard deployed and accessible
- [ ] Phase 4: Automated reports sending
- [ ] All phases documented in AGENTS.md
- [ ] Velocity metrics show improvement (baseline vs after)

## Expected Impact

**Before Phases 2-4**:
- Manual schema review: 15-30 min per PR
- Finding relevant docs: 5-10 min per lookup
- Test coverage blind spots
- No visibility into project health

**After Phases 2-4**:
- Automated schema analysis: < 1 min
- Doc retrieval: < 10 seconds
- Test gaps identified automatically
- Real-time project health visibility

**Net Result**: Additional 2-3x productivity boost on top of Phase 1 improvements.

## Related Files

- `.github/workflows/schema-sentinel.yml` (create)
- `.github/workflows/test-architect.yml` (update)
- `.github/workflows/update-doc-embeddings.yml` (create)
- `scripts/analyze-schema-changes.ts` (create)
- `scripts/analyze-test-coverage.ts` (create)
- `scripts/embed-documentation.ts` (create)
- `mcp-servers/documentation/` (create)
- `src/app/admin/dashboard/page.tsx` (create)
- `scripts/send-daily-report.ts` (create)
