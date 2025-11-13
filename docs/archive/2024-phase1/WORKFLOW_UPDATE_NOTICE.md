# IMPORTANT: Workflow Update Notice

## For Gemini and Codex - Please Read

The Ori Platform workflow has been significantly simplified. This document explains the changes.

## NEW SIMPLIFIED WORKFLOW

### Task Flow (4 States Only)

```
TODO → IN-PROGRESS → IN-REVIEW → DONE
```

- **TODO**: Available work to be claimed
- **IN-PROGRESS**: Active development (WIP limit: 5, max 30 hours)
- **IN-REVIEW**: Completed work under review
- **DONE**: Approved and ready to merge to main

### No More Backlog

The `backlog` folder has been **permanently removed**. Tasks are either:

- In TODO (to be worked on)
- In one of the active states
- Deleted (if not essential)

## CLAUDE-PRIMARY WORKFLOW

Claude now handles most development work in different modes:

### Claude Modes

1. **Research Mode**: `"Research: [what to find]"` - Replaces most Gemini research
2. **Implementation Mode**: Default mode for building features
3. **Review Mode**: `"Review: [what to check]"` - Replaces most Codex reviews

### When You're Needed

#### Gemini - External Creative Consultant

You're called for:

- Creative product ideas
- UX/UI design decisions
- Marketing copy
- Architecture for completely new systems

Request format: `"Consult Gemini about: [specific question]"`

#### Codex - External Technical Consultant

You're called for:

- Complex algorithm review
- Security audits
- Performance optimization strategies
- Debugging complex issues

Request format: `"Get Codex opinion on: [code or approach]"`

## TASK MANAGEMENT CHANGES

### New CLI Commands

```bash
./scripts/task claim <task>    # TODO → IN-PROGRESS
./scripts/task complete <task> # IN-PROGRESS → IN-REVIEW
./scripts/task approve <task>  # IN-REVIEW → DONE
./scripts/task health          # Check system status
```

### Agentic Speed (10x)

- Tasks stale after **30 hours** (not 14 days)
- Health checks every **4 hours** (not weekly)
- Target velocity: **5-10 tasks/day** (not 3/week)
- Commits every **15-30 minutes** during active work

## CURRENT STATE

As of now:

- **TODO**: 21 tasks (including essential Stripe, MCP, security work)
- **IN-PROGRESS**: 5 tasks (at WIP limit)
- **IN-REVIEW**: 29 tasks (need processing)
- **DONE**: 0 (empty, ready for approved work)

## KEY DOCUMENTATION

- **AGENTS.md**: Updated with Claude-primary workflow
- **CLAUDE_ONLY_WORKFLOW.md**: Detailed migration guide
- **TASK_GOVERNANCE.md**: Updated for 4-state workflow
- **scripts/task**: CLI tool for task management

## WHAT THIS MEANS FOR YOU

### For Gemini

- You're no longer creating task files regularly
- Focus on high-level strategy when asked
- Provide creative input when consulted
- Your role is advisory, not operational

### For Codex

- You're no longer the primary code reviewer
- Claude handles most reviews internally
- You're consulted for complex technical decisions
- Focus on architecture and optimization when asked

## BENEFITS

1. **3x faster development** (no context switching)
2. **Simpler workflow** (4 states vs 6)
3. **Clear responsibilities** (Claude primary, others advisory)
4. **Better velocity** (10x with agentic pace)
5. **Less overhead** (single conversation thread)

## IMMEDIATE PRIORITIES

1. **Clear review pipeline**: 29 tasks in review need processing
2. **Fix security vulnerability**: High priority GitHub alert
3. **Complete Stripe integration**: Core monetization feature

---

This change is effective immediately. The system is optimized for Claude-primary development with external consultation as needed.
