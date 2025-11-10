# Task Governance & Best Practices

**Purpose**: Maintain task board integrity, prevent chaos, and enable smooth agent collaboration
**Status**: Active framework
**Last Updated**: November 10, 2025

---

## Why Task Governance Matters

The `.tasks/` folder is the **single source of truth** for project status. Without clear governance:

- ❌ Tasks get lost or duplicated
- ❌ Agents duplicate effort or miss work
- ❌ No clear project status
- ❌ Decision paralysis (too many tasks, unclear priority)
- ❌ Stale/abandoned tasks accumulate

**Prevention is cheaper than cleanup.** This framework prevents chaos through simple rules.

---

## Task Board Architecture

### Directory Structure (Immutable)

```
.tasks/
├── TASK_GOVERNANCE.md          # This file - rules and standards
├── CHECK_TASKS.sh              # Health check script (when implemented)
├── todo/                        # New tasks, waiting to be claimed
│   ├── feature-name/           # Large features (epics) as folders
│   │   ├── A.md                # First work unit
│   │   ├── B.md                # Second work unit
│   │   └── C.md                # Third work unit
│   └── single-task.md          # Small tasks as single files
├── in-progress/                # Actively being worked on (claimed)
│   ├── feature-name/           # Feature folders
│   │   ├── A.md
│   │   ├── B.md
│   │   └── C.md
│   └── single-task.md
├── done/                        # Implemented, awaiting review
│   └── (same structure)
├── in-review/                   # Under review/debugging
│   └── (same structure)
├── reviewed/                    # Review complete, ready for main
│   └── (same structure)
└── archived/                    # Abandoned or superseded tasks
    └── (same structure)
```

**Key Rule**: **Large features (epics) are FOLDERS. Small tasks are SINGLE FILES.** Always move entire folders as one unit.

---

## Task Lifecycle

### Phase 1: Creation (Gemini → `.tasks/todo/`)

**Who**: Gemini (Planner)
**When**: Formulating strategic plans
**What**: Create feature folders or task files

**Rules**:
```
Feature or Large Task (Epic)?
  → Create folder: .tasks/todo/feature-name/
     - A.md, B.md, C.md (work units)
     - README.md (optional, for complex features)

Single, Small Task?
  → Create file: .tasks/todo/single-task.md
```

**Commit Immediately**:
```bash
git add .tasks/
git commit -m "feat(tasks): create feature-name plan"
git push origin dev
```

### Phase 2: Claiming (Agent → `.tasks/in-progress/`)

**Who**: Claude, Codex, or other agents
**When**: Ready to start work
**What**: Move task file/folder from `todo` to `in-progress`

**Rules**:
```
Moving a folder?
  → Move entire folder as one unit
  → git mv .tasks/todo/feature-name .tasks/in-progress/feature-name
  → Commit and push immediately

Moving a single file?
  → git mv .tasks/todo/single-task.md .tasks/in-progress/single-task.md
  → Commit and push immediately
```

**Commit Message**:
```bash
git commit -m "chore(tasks): claim feature-name for implementation"
git push origin dev
```

**Never**:
- ❌ Leave tasks in `todo` while working on them
- ❌ Forget to commit and push the move
- ❌ Move only some files from a folder (move entire folder)

### Phase 3: Implementation (Agent)

**Who**: Claude (Implementer)
**When**: Actively developing
**What**: Implement according to task file

**Rules**:
- Implement code as described in task file
- Commit work frequently (after each logical unit)
- Don't move task files yet (stay in `in-progress`)

**Commit Messages**:
```bash
# Frequent commits during implementation
git commit -m "feat: implement feature X as per task"
git push origin dev
```

### Phase 4: Completion (Claude → `.tasks/done/`)

**Who**: Claude (Implementer)
**When**: Implementation finished
**What**: Move task file/folder from `in-progress` to `done`

**Rules**:
```bash
# Move entire folder/file
git mv .tasks/in-progress/feature-name .tasks/done/feature-name

# Commit and push
git commit -m "chore(tasks): complete feature-name implementation"
git push origin dev
```

### Phase 5: Review (Codex → `.tasks/in-review/`)

**Who**: Codex (Reviewer)
**When**: Proactively monitors `.tasks/done/`
**What**: Move to review, debug, refactor

**Rules**:
```bash
# Claim for review
git mv .tasks/done/feature-name .tasks/in-review/feature-name
git commit -m "chore(tasks): claim feature-name for review"
git push origin dev

# Perform review, debugging, refactoring
# Make code changes as needed

# Complete review
git mv .tasks/in-review/feature-name .tasks/reviewed/feature-name
git commit -m "chore(tasks): complete feature-name review"
git push origin dev
```

### Phase 6: Integration (Carlo → `main`)

**Who**: Carlo (Integrator/Releaser)
**When**: All feature tasks are in `.tasks/reviewed/`
**What**: Merge to main branch

**Rules**:
- All feature tasks must be in `.tasks/reviewed/`
- Create PR from `dev` to `main`
- Merge after approval and checks pass

---

## Task File Format

### Large Feature (Epic) Structure

**File**: `.tasks/todo/feature-name/README.md`

```markdown
# Feature Name

**Status**: TODO / IN_PROGRESS / DONE / IN_REVIEW / REVIEWED
**Created**: Date
**Owner**: Agent Name
**Priority**: HIGH / MEDIUM / LOW
**Estimated Duration**: X hours / Y days

## Overview
Brief description of what this feature is and why it matters.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Work Units
- **A.md**: First part (e.g., "Backend API setup")
- **B.md**: Second part (e.g., "Frontend component")
- **C.md**: Third part (e.g., "Testing & integration")

## Dependencies
- Other tasks this depends on
- External dependencies

## Notes
Any additional context for agents working on this.
```

**Files**: `.tasks/todo/feature-name/A.md`, `B.md`, `C.md`

```markdown
# Feature Name - Part A: Backend API Setup

**Status**: TODO / IN_PROGRESS / DONE
**Estimated**: 4 hours
**Depends On**: None (or link to other task)

## What to Do
Clear, step-by-step instructions for implementing this work unit.

1. Step 1
2. Step 2
3. Step 3

## Acceptance Criteria
- [ ] Thing is done
- [ ] Tests pass
- [ ] Documentation updated

## Resources
- Links to relevant code
- Links to relevant docs
- API endpoints to reference

## Notes
Additional context for the implementing agent.
```

### Single Small Task

**File**: `.tasks/todo/fix-button-styling.md`

```markdown
# Fix Button Styling Bug

**Status**: TODO
**Type**: Bug Fix
**Priority**: MEDIUM
**Estimated**: 30 minutes

## Problem
Button in settings page doesn't match brand colors.

## Solution
Update `src/components/ui/Button.tsx` to use correct color from brand palette.

## Steps
1. Open file
2. Change color value
3. Test in browser
4. Run lint check

## Acceptance Criteria
- [ ] Button matches brand color
- [ ] No lint errors
- [ ] Visually verified in browser

## Related Files
- `src/components/ui/Button.tsx`
- `src/lib/colors.ts`
```

---

## Quality Gates (Before Creating Tasks)

**Gemini should answer these before creating a task:**

```
□ Is this a new task or does it already exist?
  → Search .tasks/ directory
  → Check archived tasks

□ Can this task be smaller?
  → Epic? Break into A.md, B.md, C.md
  → Too vague? Make more specific

□ Is this task clear enough?
  → Can an agent understand it without questions?
  → Does it have acceptance criteria?

□ Does it have dependencies?
  → Are prereq tasks listed?
  → In correct order?

□ Is it in the right folder structure?
  → Epic? Use folder structure
  → Single task? Use single file
```

**If any answer is "no": Revise before creating.**

---

## Prevention Rules

### Rule 1: No Duplicate Tasks

**Check Before Creating**:
```bash
# Search for similar tasks
grep -r "keyword" .tasks/todo/
grep -r "keyword" .tasks/in-progress/
grep -r "keyword" .tasks/done/

# If found: Don't create duplicate, comment on existing task instead
```

### Rule 2: No Task Abandonment

**If a task isn't relevant anymore**:
```bash
# Move to archived (don't delete)
git mv .tasks/todo/old-task.md .tasks/archived/old-task.md
git commit -m "chore(tasks): archive old-task - no longer needed"
git push origin dev

# Add note at top:
# **ARCHIVED**: Reason for archival (e.g., "Superseded by feature X")
```

**Never**:
- ❌ Delete task files
- ❌ Leave stale tasks in `todo`
- ❌ Create new task when old one exists

### Rule 3: Folder Movement as Unit

**Always move entire folders together**:
```bash
# RIGHT - move folder as unit
git mv .tasks/todo/feature-name .tasks/in-progress/feature-name

# WRONG - don't move partial folders
git mv .tasks/todo/feature-name/A.md .tasks/in-progress/A.md
# This breaks the folder structure!

# WRONG - don't split feature work
# If A.md is done but B.md isn't, move whole folder to in-progress/done
# Don't split files to different directories
```

### Rule 4: Clear Task Ownership

**Each task in `in-progress` has owner**:
```markdown
**Claimed By**: [Agent Name]
**Claimed At**: [Date/Time]
```

**Multiple agents?**:
- Don't claim same task twice
- Add note: "Collaboration: Claude on backend, Codex on tests"

### Rule 5: Task Status Tracking

**Task files should show current status**:
```
Status: TODO      ← Created, not started
Status: IN_PROGRESS ← Actively being worked on
Status: DONE      ← Implemented, awaiting review
Status: IN_REVIEW ← Under review/debugging
Status: REVIEWED  ← Ready for main branch
Status: ARCHIVED  ← No longer relevant
```

**Update status in task file when moving directories.**

---

## Health Check (Quarterly Audit)

**Run quarterly to prevent task board chaos:**

```bash
# Count tasks by status
echo "Task Distribution:"
find .tasks/todo -type f -name "*.md" | wc -l
find .tasks/in-progress -type f -name "*.md" | wc -l
find .tasks/done -type f -name "*.md" | wc -l
find .tasks/in-review -type f -name "*.md" | wc -l
find .tasks/reviewed -type f -name "*.md" | wc -l
find .tasks/archived -type f -name "*.md" | wc -l

# Check for stale tasks (in-progress for 2+ weeks)
find .tasks/in-progress -type f -mtime +14

# Check for stale done tasks (awaiting review for 3+ weeks)
find .tasks/done -type f -mtime +21
```

**Health Metrics** (target ranges):
- `todo/`: 20-50 tasks (reasonable backlog)
- `in-progress/`: 2-5 features (focus)
- `done/`: 0-3 items (moving fast)
- `in-review/`: 1-2 items (review bottleneck?)
- `reviewed/`: 0-2 items (ready to ship)
- `archived/`: Should grow over time (old tasks)

**If metrics off**:
- Too many in `todo`: Need to prioritize
- Stuck in `in-progress`: Agent blocked?
- Stuck in `done`: Review backlog?
- Stuck in `in-review`: Reviewer bottleneck?

---

## Common Scenarios & Solutions

### Scenario 1: Task is Blocked

**Problem**: Agent can't complete task due to dependency

**Solution**:
```markdown
**Status**: BLOCKED (not a standard status, but indicates)
**Blocked By**: Name of blocking task
**Unblock When**: Task X is completed

Example:
"Cannot implement feature B until feature A's API is deployed"
```

**Action**:
1. Add `BLOCKED` note to task file
2. Don't move it out of `in-progress`
3. Comment in blocking task
4. Once unblocked, remove `BLOCKED` note

### Scenario 2: Task is Too Big

**Problem**: Task started but is too complex to finish in reasonable time

**Solution**:
```bash
# Split large task into smaller pieces
# Move back to todo, break into sub-tasks

git mv .tasks/in-progress/big-feature .tasks/todo/big-feature
# Then split into:
# - big-feature-part1.md
# - big-feature-part2.md
# - big-feature-part3.md

git commit -m "chore(tasks): split big-feature into smaller tasks"
git push origin dev
```

### Scenario 3: Duplicate Tasks Exist

**Problem**: Two similar tasks in backlog

**Solution**:
```bash
# Keep the more detailed/important one
# Archive the duplicate

git mv .tasks/todo/duplicate-task.md .tasks/archived/duplicate-task.md

# Add note:
# **ARCHIVED**: Duplicate of existing-task.md

git commit -m "chore(tasks): archive duplicate-task"
git push origin dev
```

### Scenario 4: Task is No Longer Relevant

**Problem**: Requirements changed, task obsolete

**Solution**:
```bash
# Archive with reason
git mv .tasks/todo/old-task.md .tasks/archived/old-task.md

# Add note at top:
# **ARCHIVED** [Date]: No longer needed - feature X changed requirements

git commit -m "chore(tasks): archive old-task - feature X made it obsolete"
git push origin dev
```

---

## Agent Responsibilities

### Gemini (Planner)
- ✅ Create tasks in `.tasks/todo/`
- ✅ Break epics into work units (A.md, B.md, C.md)
- ✅ Include acceptance criteria
- ✅ Commit and push immediately
- ✅ Quarterly audit of task board
- ❌ Don't move tasks between directories (that's agent's job)
- ❌ Don't create duplicate tasks

### Claude (Implementer)
- ✅ Claim task by moving to `in-progress`
- ✅ Implement according to task file
- ✅ Move to `done` when complete
- ✅ Commit and push after each step
- ❌ Don't leave task in `in-progress` when stuck (communicate or archive)
- ❌ Don't modify task files (create new task instead if scope changes)

### Codex (Reviewer)
- ✅ Monitor `.tasks/done/` for review items
- ✅ Claim for review by moving to `in-review`
- ✅ Debug and refactor as needed
- ✅ Move to `reviewed` when complete
- ✅ Commit and push at each step
- ❌ Don't skip review (even "small" changes)
- ❌ Don't merge directly to main (Carlo does that)

### Carlo (Integrator)
- ✅ Monitor `.tasks/reviewed/` for release-ready items
- ✅ Merge feature to `main` when all tasks are reviewed
- ✅ Handle final integration and deployment
- ❌ Don't merge unreviewed code
- ❌ Don't skip CI/CD checks

---

## Commit Message Standards for Tasks

### Standard Format

```bash
# Task creation
git commit -m "feat(tasks): create feature-name plan"

# Task claiming
git commit -m "chore(tasks): claim feature-name for implementation"

# Task completion
git commit -m "chore(tasks): complete feature-name"

# Task review
git commit -m "chore(tasks): claim feature-name for review"
git commit -m "chore(tasks): complete feature-name review"

# Task archival
git commit -m "chore(tasks): archive feature-name - reason"
```

### With Implementation Details

```bash
# Implementation with multiple commits
git commit -m "feat: implement API endpoints for feature-name

- POST /api/feature
- GET /api/feature/:id
- Tests added
See: .tasks/in-progress/feature-name/A.md"

git commit -m "feat: implement frontend component for feature-name

See: .tasks/in-progress/feature-name/B.md"
```

---

## Prevention Checklist

**Before Creating Task**:
- [ ] Task doesn't already exist
- [ ] Task is not too vague
- [ ] Task has clear acceptance criteria
- [ ] Task is broken down if it's large (A.md, B.md, C.md)
- [ ] Dependencies are listed
- [ ] Task is assigned correct folder/filename

**Before Moving Task**:
- [ ] Status in file is updated
- [ ] Entire folder moved as unit (not partial)
- [ ] Commit message is descriptive
- [ ] Pushed to remote

**During Implementation**:
- [ ] Status updated if task becomes blocked
- [ ] Working on correct task (matches file name)
- [ ] Frequent commits (at least once per session)

---

## When Everything Goes Wrong

If the task board gets messy:

1. **Don't panic** - archived/undone changes are just git away
2. **Check git log** - see what happened
   ```bash
   git log --oneline .tasks/ | head -20
   ```
3. **Restore if needed** - git can undo any move
   ```bash
   git log --all --full-history -- ".tasks/feature-name"
   git checkout <commit> -- ".tasks/feature-name"
   ```
4. **Communicate** - tell team what happened
5. **Prevent next time** - follow governance rules

**Nothing is permanently lost.** Git history is your safety net.

---

## Summary

| Goal | How |
|------|-----|
| Prevent duplicate tasks | Check before creating, archive old ones |
| Prevent lost work | Commit after every move and implementation |
| Prevent chaos | One owner per task, clear status, regular audits |
| Prevent confusion | Clear task descriptions, acceptance criteria |
| Prevent blocking | Track dependencies, communicate blockers |
| Prevent burnout | Reasonable task sizes, break epics into units |

**Follow these rules, and the task board stays healthy. Break them, and it becomes a mess.**

---

## References

- `AGENTS.md` - Team workflow and agent roles
- `CLAUDE.md` - Claude's implementation guidelines
- `GEMINI.md` - Gemini's planning guidelines
- Git documentation: `git log .tasks/`, `git mv`, `git restore`
