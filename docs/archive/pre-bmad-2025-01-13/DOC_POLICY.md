---
type: governance-policy
role: documentation-governance
scope: all
audience: all-agents, developers
last-updated: 2025-11-10
relevance: documentation, policy, governance, elegance
priority: critical
quick-read-time: 3min
deep-dive-time: 8min
---

# Documentation Policy - Elegant Minimalism

**Philosophy**: Documentation is a tool, not an archive. Keep what serves the present. Refactor, don't accumulate.

---

## Core Principles

### 1. Solve Problems Elegantly, Not Quickly

❌ **Bad**: "Problem with docs? Write a script to manage them!"
✅ **Good**: "Problem with docs? Why do we have the problem? Fix the root cause."

**Before creating ANY solution**:
- What's the underlying problem?
- Can we prevent it instead of managing it?
- What's the long-term elegant solution?

### 2. Refactor, Don't Delete

❌ **Bad**: Document over 500 lines → Delete it
✅ **Good**: Document over 500 lines → Extract value, refactor into existing docs

**Documents contain knowledge**. Preserve the value, eliminate the bloat.

---

## Line Limits (By Document Type)

### Permanent Documents (Strategic, Long-term)
**Limit**: 2000 lines
**Examples**:
- `ORI_MANIFESTO.md` - Brand vision and philosophy
- `CORE_ARCHITECTURE_OVERVIEW.md` - Complete system design
- `API_ENDPOINTS.md` - Comprehensive API reference

**Purpose**: Foundational knowledge that rarely changes. Can be comprehensive.

### Long-living Documents (Tactical, Updated Frequently)
**Limit**: 1000 lines
**Examples**:
- `AGENTS.md` - Workflow and collaboration
- `CLAUDE.md` - Implementation patterns
- `CONTRIBUTING.md` - Contribution guide
- `OPS_DEPLOYMENT_RUNBOOK.md` - Operations procedures

**Purpose**: Actively maintained guides that evolve with the project.

### Transient Documents (Temporary, Task-specific)
**Limit**: 500 lines
**Examples**:
- `.tasks/**/*.md` - Task descriptions
- Setup guides for temporary features
- Migration guides (delete after migration complete)
- Status reports

**Purpose**: Short-lived documentation that should be brief and focused.

---

## Document Lifecycle Management

### Before Creating a New Document

**Ask these questions in order**:

1. **Can I update an existing document instead?**
   - Search: `pnpm find-docs "<topic>"`
   - Check: `grep -r "<topic>" docs/`
   - If yes → Update existing, don't create new

2. **Can this be a section in DOC_INDEX.md?**
   - Small topic? → Add to DOC_INDEX.md
   - Navigation? → Already in DOC_INDEX.md
   - Quick reference? → Section in existing doc

3. **Will this document live long-term?**
   - No → Don't create it, use README or comments
   - Yes → Ensure it has permanent value

4. **Have I identified what to refactor/consolidate?**
   - Creating doc = opportunity to clean up
   - Find 2 old docs to merge/consolidate
   - Result: Net documentation stays flat or decreases

### Document Creation Process

```markdown
## Creating New Doc

1. Search for existing coverage
2. Justify permanent existence
3. Identify category (permanent/long-living/transient)
4. Set appropriate line limit
5. Find consolidation opportunity (merge 2 old docs)
6. Create new doc
7. Update DOC_INDEX.md
8. Commit with explanation
```

### Refactoring Oversized Documents

**Document approaching limit?**

1. **Identify core value**
   - What's essential? What's nice-to-have?
   - What's referenced frequently?
   - What's never referenced?

2. **Extract and redistribute**
   - Move examples to code comments
   - Move troubleshooting to FAQ section in existing doc
   - Move historical context to git commit messages
   - Keep only what's actively needed

3. **Update and consolidate**
   - Merge similar sections across docs
   - Remove outdated information
   - Simplify explanations

**Example**:
```
Before: OPS_MCP_SETUP_GUIDE.md (1098 lines)

Refactor strategy:
- Keep: Setup steps, configuration (400 lines)
- Move to CLAUDE.md: MCP tool usage examples (200 lines)
- Move to README.md: Quick start (50 lines)
- Delete: Redundant troubleshooting already in MCP_REFERENCE.md (200 lines)
- Simplify: Verbose explanations (248 lines → 50 lines)

After: OPS_MCP_SETUP_GUIDE.md (700 lines)
Net: -398 lines, better organized
```

---

## Current Document Inventory

### Root Level (Target: ≤10)
1. README.md
2. CONTRIBUTING.md
3. AGENTS.md
4. CLAUDE.md
5. GEMINI.md
6. DOC_INDEX.md
7. SECURITY.md
8. ORI_MANIFESTO.md
9. MCP-QUICK-SETUP.md
10. QUICK_START.md

**Current**: 10 ✅ (at target)

### docs/ Structure (Target: ≤20 active)

**Core** (3 docs):
- CORE_DATABASE_SCHEMA.md
- CORE_ONBOARDING_ARCHITECTURE.md
- CORE_ARCHITECTURE_OVERVIEW.md

**Operations** (5 docs):
- OPS_DEPLOYMENT_RUNBOOK.md
- OPS_MCP_SETUP_GUIDE.md
- OPS_BRANCH_PROTECTION_SETUP.md
- OPS_AUTO_PR_REVIEW.md
- OPS_GIT_NOTION_DOCUMENTATION_STRATEGY.md

**Reference** (6 docs):
- REFERENCE_ENV_VARS.md
- REFERENCE_DESIGN_SYSTEM.md
- REFERENCE_DESIGN_SYSTEM_QUICK.md
- REFERENCE_SKILLS_GAP_QUICK_REF.md
- REFERENCE_ONBOARDING_FIELDS.md
- REFERENCE_DEEPL_MCP_SERVER.md

**API** (4 docs):
- API_ENDPOINTS.md
- API_SUMMARY.md
- OAUTH_SETUP_GUIDE.md
- MCP_REFERENCE.md

**Current**: 18 active docs ✅ (under target)

---

## Archive Policy

### What Gets Archived

✅ **Archive**:
- Completed task plans (`.tasks/done/` → `.tasks/archived/`)
- Historical project phases (superseded workflows)
- Migration guides (after migration complete)

❌ **Don't Archive**:
- Outdated documentation (refactor into current docs instead)
- Duplicate documentation (delete, keep one source of truth)
- Verbose documentation (refactor to be concise)

### Archive Location

- `.tasks/archived/` - Completed task plans only
- `docs/archive/` - Historical project phases (minimal, last resort)
- Git history - Everything else (deleted docs are preserved)

---

## Script Policy (Critical)

### Before Creating a Script

**Ask**:
1. Can this be solved by better organization?
2. Can this be prevented by changing workflow?
3. Is this a one-time need? (If yes, don't script it)
4. Will this script need maintenance? (If yes, reconsider)

### Script Creation Criteria

✅ **Create script if**:
- Used frequently (daily/weekly)
- Saves significant time (>30 min per use)
- Complex logic that's error-prone manually
- Already proven valuable via manual execution

❌ **Don't create script if**:
- Used once or rarely
- Simple manual alternative exists
- Adds complexity for minimal gain
- Solving symptom, not cause

### Current Scripts Audit

**Keep** (actively used):
- `scripts/translate.ts` - DeepL translation (frequent use)
- `scripts/task` - Task management helper (workflow core)

**Question** (evaluate necessity):
- Any scripts not used in last 30 days
- Any scripts that duplicate existing tools
- Any scripts solving preventable problems

---

## Maintenance Schedule

### Monthly (First Monday)

```bash
# 1. Find documents approaching limits
find docs -name "*.md" -exec wc -l {} \; | awk '
  $1 > 1800 && $1 <= 2000 {print "⚠️ Permanent doc near limit:", $2, "(" $1 " lines)"}
  $1 > 900 && $1 <= 1000 {print "⚠️ Long-living doc near limit:", $2, "(" $1 " lines)"}
  $1 > 450 && $1 <= 500 {print "⚠️ Transient doc near limit:", $2, "(" $1 " lines)"}
'

# 2. Find rarely referenced docs
echo "Rarely referenced docs:"
for doc in $(find docs -name "*.md"); do
  refs=$(grep -r "$(basename $doc)" . --exclude-dir=node_modules | wc -l)
  if [ $refs -lt 2 ]; then
    echo "  - $doc (referenced $refs times)"
  fi
done

# 3. Find docs not updated in 90 days
find docs -name "*.md" -mtime +90 -exec ls -lh {} \;

# Action: Refactor approaching-limit docs, consolidate rarely-used docs
```

### Quarterly (First Monday of Quarter)

- Review all documentation for relevance
- Consolidate similar documents
- Update DOC_INDEX.md
- Check scripts in `scripts/` for usage

---

## Violations and Enforcement

### Line Limit Violations

**Document exceeds limit?**

1. **Don't panic, don't delete**
2. **Understand why**:
   - New content added? Extract to separate concept
   - Verbose explanations? Simplify
   - Examples bloating it? Move to code or separate examples doc
   - Multiple topics? Split into focused docs

3. **Refactor thoughtfully**:
   - Preserve all valuable information
   - Improve organization
   - Make it more useful, not just shorter

### Creation Without Consolidation

**New doc without addressing existing bloat?**

- Review required: Why is new doc necessary?
- Identify consolidation opportunity
- Result: Net flat or negative documentation growth

---

## Examples of Elegant Solutions

### Example 1: Script Bloat

**Problem**: Multiple scripts for similar tasks
❌ **Quick Fix**: Create master script that calls them all
✅ **Elegant Solution**: Consolidate into one well-designed script, or eliminate by improving workflow

### Example 2: Documentation Duplication

**Problem**: Same information in 3 places
❌ **Quick Fix**: Keep all 3, add "see also" links
✅ **Elegant Solution**: One authoritative document, others deleted or converted to short references

### Example 3: Oversized Document

**Problem**: CONTRIBUTING.md at 1200 lines
❌ **Quick Fix**: Split into CONTRIBUTING_PART1.md, CONTRIBUTING_PART2.md
✅ **Elegant Solution**: Extract code examples to actual code files, move detailed specs to relevant docs, keep essential contribution workflow

---

## Summary

| Document Type | Line Limit | Examples |
|---------------|------------|----------|
| **Permanent** | 2000 lines | ORI_MANIFESTO.md, CORE_ARCHITECTURE_OVERVIEW.md, API_ENDPOINTS.md |
| **Long-living** | 1000 lines | AGENTS.md, CLAUDE.md, CONTRIBUTING.md, OPS_DEPLOYMENT_RUNBOOK.md |
| **Transient** | 500 lines | .tasks/**/*.md, temporary guides, migration docs |

**Key Principles**:
1. Solve root cause, not symptoms
2. Refactor, don't delete
3. Preserve value, eliminate bloat
4. Prevent before managing
5. Long-term elegance over short-term convenience

---

**Last Updated**: 2025-11-10
**Next Review**: 2025-12-10 (monthly)
