# Documentation Governance & Prevention Guide

**Purpose**: Prevent documentation explosion, maintain single source of truth, ensure quality
**Status**: Active governance framework
**Last Updated**: November 10, 2025

---

## Why Documentation Explosion Happened

### Root Causes (This Project)

1. **No Documentation Review Process**
   - New docs created without reviewing existing docs
   - No check: "Does this already exist?"
   - No gatekeeper role

2. **No Naming Convention**
   - Multiple docs with similar names (5+ MCP_INTEGRATION_* files)
   - No way to distinguish purpose from filename
   - Led to duplication

3. **No Documentation Architecture**
   - No defined document types
   - No hierarchical structure
   - No clear "where should this go?"

4. **No Consolidation Plan**
   - Documents created but never merged/consolidated
   - No periodic reviews
   - Accumulated over time

5. **No Single Source of Truth**
   - Multiple "indexes" with different info
   - No official "start here" document
   - Each doc stood alone

6. **Context Window Resets**
   - Previous context created 50+ files before issues recognized
   - New context had no context about what existed
   - Led to duplication and poor organization

---

## Prevention Framework

### 1. Documentation Architecture (Fixed Structure)

**Define document types and purposes:**

```
docs/
├── CORE/                          # Technical specifications
│   ├── DATABASE_SCHEMA.md         # Database structure (single source)
│   ├── API_ENDPOINTS.md           # API documentation (single source)
│   └── architecture/
│       └── overview.md            # System architecture (single source)
│
├── OPERATIONS/                    # How-to and process docs
│   ├── DATABASE_MIGRATION.md      # Migration tracking (single source)
│   ├── TRANSLATION_WORKFLOW.md    # i18n process (single source)
│   └── DEPLOYMENT.md              # Deployment guide (single source)
│
├── CURRENT_PHASE/                 # Active development phase docs
│   ├── MCP_DOCUMENTATION_INDEX.md # Navigation guide (single source)
│   ├── MCP_REFACTORING_PLAN.md    # Implementation strategy (single source)
│   ├── NEXT_STEPS.md              # Decision document (single source)
│   └── STATUS_REPORT.md           # Phase status (single source)
│
├── DECISIONS/                     # Architecture decisions (why we chose X)
│   ├── MCP_ARCHITECTURE_AUDIT.md  # Why MCP (single source)
│   └── ADR_*.md                   # Architecture Decision Records
│
├── REFERENCE/                     # Background and learning
│   ├── PHASE2_COMPLETION.md       # Phase 2 archive
│   └── PHASE3_COMPLETION.md       # Phase 3 archive
│
└── archive/                       # Old/deprecated docs
    └── deprecated-mcp-docs/       # Clearly marked as old
```

**Rules**:
- Only ONE canonical doc per topic
- Cross-reference instead of duplicating
- Clear folder = clear purpose

### 2. Documentation Naming Convention

**Standard naming pattern:**

```
{TYPE}_{TOPIC}_{SCOPE}.md

TYPE: CORE, OPS, DECISION, REFERENCE, STATUS
TOPIC: What it's about (DATABASE, API, MCP, STRIPE, EMAIL, etc.)
SCOPE: Optional - (QUICK, DETAILED, AUDIT, PLAN, IMPLEMENTATION)

EXAMPLES (GOOD):
✅ CORE_DATABASE_SCHEMA.md           (technical spec)
✅ OPS_DEPLOYMENT_GUIDE.md           (process)
✅ DECISION_MCP_ARCHITECTURE.md      (why we chose MCP)
✅ STATUS_MCP_REFACTORING_PLAN.md    (current phase)
✅ REFERENCE_PHASE3_COMPLETION.md    (archive)

EXAMPLES (BAD - Don't do this):
❌ MCP_INTEGRATION_ANALYSIS.md            (unclear type)
❌ MCP_QUICK_REFERENCE.md                 (purpose unclear)
❌ STRIPE_INFRASTRUCTURE_AUDIT.md         (too specific/narrow)
❌ EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md (name explosion)
```

**Benefits**:
- Filename tells you document type
- Easier to find related docs
- Prevents similar naming (can't have 5 MCP_* files)
- Single source obvious (only one CORE_MCP_ARCHITECTURE.md)

### 3. Documentation Quality Gate (Before Creating)

**Checklist before writing a new document:**

```
📋 Before Creating a New Document, Answer:

1. DOES IT ALREADY EXIST?
   ☐ Search existing docs for same topic
   ☐ Check docs/archive/ for similar docs
   ☐ Check the INDEX file for related docs
   → If yes: UPDATE existing doc instead of creating new one

2. WHAT IS THIS DOCUMENT'S PURPOSE?
   ☐ Technical specification? (CORE_*)
   ☐ How-to guide? (OPS_*)
   ☐ Architecture decision? (DECISION_*)
   ☐ Phase work? (STATUS_*)
   ☐ Reference/learning? (REFERENCE_*)
   → If unclear: Plan before writing

3. IS THIS A SINGLE SOURCE OF TRUTH?
   ☐ Will this be THE authoritative doc on this topic?
   ☐ Or will it overlap with another doc?
   ☐ Or will it need updating if another doc changes?
   → If #2 or #3: Consolidate with existing doc instead

4. DOES IT BELONG IN docs/?
   ☐ Is it essential for understanding the project?
   ☐ Or is it temporary/phase-specific?
   ☐ Temporary: Maybe just a commit message + link in INDEX
   → Think before creating permanent docs for temporary work

5. WILL MULTIPLE VERSIONS EXIST?
   ☐ Will there be: PLAN, IMPLEMENTATION, AUDIT, QUICK, DETAILED versions?
   ☐ If yes: Create ONE doc with clearly marked sections
   → Don't create 5 separate files for different versions of same topic

6. IS THIS INDEXED?
   ☐ Once created, will it be linked from a navigation doc?
   ☐ Or will it be orphaned?
   → If orphaned: Don't create it (no one will find it)
```

**If you answer "No" to any question: STOP and plan before writing.**

### 4. Single Source of Truth Pattern

**Principle**: One canonical document per topic, others link to it.

```
WRONG (Documentation Explosion):
❌ MCP_INTEGRATION_ANALYSIS.md
❌ MCP_INTEGRATION_QUICK_REFERENCE.md
❌ MCP_INTEGRATION_MASTER_PLAN.md
❌ MCP_PHASE1_ARCHITECTURE.md
❌ MCP_MIGRATION_STRATEGIES.md

RIGHT (Single Source):
✅ STATUS_MCP_REFACTORING_PLAN.md
   ├─ Sections: Overview, Phase 1, Phase 2, Phase 3, Timeline
   ├─ Links to: MCP_DOCUMENTATION_INDEX.md, DECISION_MCP_ARCHITECTURE.md
   └─ One place for all refactoring info
```

**How to structure**:

```markdown
# Document Title

## Quick Overview (5 min read)
[Summary of key points]

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1: Details
[Detailed content]

## Section 2: More Details
[More detailed content]

## Related Documents
- See X for [topic]
- See Y for [topic]
- See archive/Z for [historical context]
```

**Benefits**:
- No duplication
- Easy to update (one place to change)
- Readers know where to go (single source)
- Reduces context switching

### 5. Documentation Index (Navigation)

**Rule**: Every documentation "system" needs ONE authoritative index.

**Current**: `docs/MCP_DOCUMENTATION_INDEX.md`

**Pattern for future indices**:

```markdown
# [SYSTEM] Documentation Index

**Purpose**: Single navigation point for all [SYSTEM] documentation
**Updated**: [DATE]

## Quick Start (5 minutes)
- Read: [Link to quick overview]

## For Decision Makers (15 minutes)
- Read: [Link 1]
- Read: [Link 2]

## For Engineers (Implementation)
- Before: [Setup/prerequisites]
- During: [Step-by-step guide]
- After: [Validation/testing]

## Reference & Learning
- Architecture: [Link]
- Deep Dive: [Link]
- Archive: [Old docs]

## Document Descriptions
| Name | Purpose | Time |
|------|---------|------|
| Doc A | What it's for | 10 min |
| Doc B | What it's for | 20 min |
```

**Rule**: This index is the official starting point. Everything else links from here.

### 6. Review & Consolidation Schedule

**Prevent accumulation by reviewing regularly:**

```
SCHEDULE:
├─ Weekly (5 min)
│  └─ New docs created this week?
│     - Are they in the right folder?
│     - Are they indexed?
│     - Any duplicates?
│
├─ Monthly (30 min)
│  └─ Any opportunities to consolidate?
│     - Can 3 docs become 1?
│     - Any orphaned docs?
│     - Archive anything outdated?
│
├─ Quarterly (1 hour)
│  └─ Full documentation audit
│     - Count files: should be stable (not growing)
│     - Check for: orphaned, duplicate, contradictory docs
│     - Consolidate as needed
│     - Update indices
│
└─ After Phase Complete
   └─ Archive all phase-specific docs
      - Move to docs/archive/phase-X/
      - Update REFERENCE/ with completion summary
      - Clean up CURRENT_PHASE/ folder
```

**Tool**: Script to check for documentation issues:

```bash
#!/bin/bash
# docs/check-documentation.sh

echo "📊 Documentation Health Check"
echo "=============================="

# Count files
TOTAL=$(find docs -name "*.md" | wc -l)
ACTIVE=$(find docs -name "*.md" -not -path "*/archive/*" | wc -l)
ARCHIVED=$(find docs/archive -name "*.md" 2>/dev/null | wc -l)

echo "Total files: $TOTAL"
echo "Active: $ACTIVE"
echo "Archived: $ARCHIVED"

# Check for duplicates
echo ""
echo "🔍 Checking for duplicate patterns..."
grep -r "^# " docs/*.md 2>/dev/null | cut -d: -f2 | sort | uniq -d

# Check for orphaned files (not in any index)
echo ""
echo "⚠️  Potentially orphaned files (not in any index):"
for file in docs/*.md; do
    basename=$(basename "$file")
    if ! grep -l "$basename" docs/*INDEX*.md 2>/dev/null | grep -q .; then
        echo "  - $basename"
    fi
done

# Check for stale files (older than 3 months)
echo ""
echo "📅 Files not updated in 3+ months:"
find docs -name "*.md" -not -path "*/archive/*" -mtime +90 -exec ls -lh {} \;
```

### 7. Context Window Reset Protocol

**When starting a new context, follow this:**

1. **First Action**: Read the documentation index
   ```bash
   # Find and read the main documentation index
   cat docs/*INDEX*.md
   # Or
   cat docs/MCP_DOCUMENTATION_INDEX.md
   ```

2. **Second Action**: Check what exists before creating
   ```bash
   # List all existing documentation
   ls -la docs/*.md
   # Search for related docs
   grep -r "your-topic" docs/
   ```

3. **Third Action**: Update existing, don't create new
   - If doc exists: Edit and improve it
   - If doc is outdated: Update it with new info
   - Only create new if no similar doc exists

4. **Document Your Work In Index**
   - After creating/updating docs, update the INDEX
   - Add links to the navigation
   - Ensure doc is discoverable

### 8. Commit Message Standard

**Include documentation status in commits:**

```bash
# GOOD: Clear what documentation changed
git commit -m "feat: implement Phase 1 refactoring

- Updated: docs/STATUS_MCP_REFACTORING_PLAN.md with Phase 1 results
- Created: services/core-api/src/lib/resend-mcp.ts
- See: docs/MCP_DOCUMENTATION_INDEX.md for full plan"

# BAD: No clarity on documentation
git commit -m "implement Phase 1"

# GOOD: For documentation cleanup
git commit -m "docs: consolidate stripe docs into single source of truth

- Deleted: docs/STRIPE_AUDIT.md, docs/STRIPE_QUICK_REF.md
- Updated: docs/STATUS_STRIPE_IMPLEMENTATION.md
- See: docs/DOCUMENTATION_GOVERNANCE.md"
```

### 9. Documentation Authority Matrix

**Who decides about documentation:**

| Question | Owner | Process |
|----------|-------|---------|
| Should we create a new doc? | Tech Lead | Review existing docs, check index |
| Where should this doc go? | Tech Lead | Reference folder structure |
| Is this a duplicate? | Reviewer | Check during PR review |
| Should we consolidate? | Tech Lead | Monthly review |
| Is this orphaned? | Any dev | Move to archive or add to index |
| What's the standard format? | Tech Lead | Reference DOCUMENTATION_GOVERNANCE.md |

---

## Implementation: Preventing Future Explosions

### Immediate Actions (This Week)

- [ ] Add `docs/check-documentation.sh` script
- [ ] Add to PR checklist: "Have you reviewed existing docs?"
- [ ] Update CLAUDE.md with documentation governance link
- [ ] Set up monthly documentation review reminder

### Long-term Prevention

1. **PR Review Checklist** (add to GitHub)
   ```markdown
   - [ ] Does documentation exist for this feature?
   - [ ] Are you creating new docs or updating existing?
   - [ ] Is the doc added to an index/navigation file?
   - [ ] No duplicate information in multiple docs?
   - [ ] Links are current and not broken?
   ```

2. **CLAUDE.md Update** (add section)
   ```markdown
   ## Documentation Governance

   Before creating a new documentation file, see docs/DOCUMENTATION_GOVERNANCE.md

   Quick checklist:
   - Does this doc already exist?
   - Is it single source of truth for this topic?
   - Is it indexed/discoverable?
   - Does it follow naming convention?
   ```

3. **Team Training** (quarterly)
   - Review documentation structure
   - Discuss what worked/what didn't
   - Consolidate if needed
   - Update standards

### Metrics to Track

```
Monthly Documentation Health:
├─ Total active files (should be ~20-30, not 50+)
├─ Duplicate files (should be 0)
├─ Orphaned files (should be 0)
├─ Files not updated in 3+ months (should be in archive)
├─ Index completeness (100% of docs should be indexed)
└─ Broken links (should be 0)
```

---

## Example: How to Prevent This Situation Again

### Scenario: Need to document email system (like Phase 3)

**WRONG APPROACH** (leads to explosion):
```
❌ Create EMAIL_NOTIFICATION_INFRASTRUCTURE_AUDIT.md
❌ Create EMAIL_INFRASTRUCTURE_QUICK_REFERENCE.md
❌ Create EMAIL_NOTIFICATION_INDEX.md
❌ Create RESEND_MCP_READINESS.md
❌ Create PHASE3_KICKOFF.md
```

**RIGHT APPROACH** (prevents explosion):

1. **Check index**: `docs/MCP_DOCUMENTATION_INDEX.md`
   - Does Phase 3 email doc exist? NO
   - Is there a phase documentation standard? YES (see PHASE2)

2. **Create one consolidated doc**:
   ```
   STATUS_PHASE3_EMAIL_IMPLEMENTATION.md
   ├─ Overview (5 min)
   ├─ Architecture (10 min)
   ├─ Implementation (20 min)
   ├─ Testing (5 min)
   └─ Related docs (links)
   ```

3. **Update the index**:
   - Add link to STATUS_PHASE3_EMAIL_IMPLEMENTATION.md
   - Add to phase documentation section
   - Add timeline/status

4. **Result**: ONE clear doc instead of 5+ scattered docs

---

## Conclusion: Prevention is Easier Than Cleanup

**Cost of explosion** (what happened):
- 50+ files created
- 12 deleted, 13 archived
- 3 new files to organize them
- Hours spent on cleanup

**Cost of prevention**:
- 5 minutes: Check if doc exists
- 5 minutes: Add to index
- 5 minutes: Follow naming convention

**Prevention wins.** The checklist and architecture above cost ~15 minutes per document but save hours of cleanup later.

---

## Quick Reference: Document Creation Checklist

**Use this every time you create documentation:**

```
□ Does this doc already exist?
  → Search: grep -r "topic" docs/

□ Did you check the index?
  → Read: docs/*INDEX*.md

□ Is this the right folder?
  → See: DOCUMENTATION_GOVERNANCE.md folder structure

□ Does the filename follow convention?
  → Pattern: {TYPE}_{TOPIC}_{SCOPE}.md

□ Is it a single source of truth?
  → No duplicates of same info elsewhere?

□ Did you add it to the index?
  → Link from docs/*INDEX*.md or docs/*_INDEX.md

□ Are your internal links correct?
  → Test: All links point to real files

□ Is it discoverable?
  → Could someone find it starting from README.md?
```

**If any box is unchecked: Fix before committing.**

---

## References

- `docs/DOCUMENTATION_GOVERNANCE.md` (this file) - governance framework
- `docs/MCP_DOCUMENTATION_INDEX.md` - current phase index (example)
- `docs/DOCUMENTATION_AUDIT_AND_CLEANUP.md` - what went wrong
- `CLAUDE.md` - project standards and conventions
- `AGENTS.md` - team workflows and responsibilities
