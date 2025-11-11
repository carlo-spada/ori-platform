---
type: documentation
role: documentation
scope: all
audience: all-agents
last-updated: 2025-11-10
relevance: archive, 2024, phase1, claude, only, workflow.md, claude-only
priority: medium
quick-read-time: 4min
deep-dive-time: 6min
---

# Claude-Only Workflow: Simplified & Accelerated

> **10x faster with single-agent architecture**
> Gemini and Codex become external consultants only

## Core Principle: One Agent, Multiple Modes

Instead of context-switching between agents, Claude operates in different modes:

### 🔍 RESEARCH MODE (Replaces Gemini)

```
"Research: Find all implementations of authentication in the codebase"
"Research: What's the current database schema for users?"
"Research: How are payments currently handled?"
```

Claude uses:

- `Task` tool with subagent_type=Explore
- `Grep` for code search
- `Glob` for file discovery
- Quick analysis without implementation

### 💻 IMPLEMENTATION MODE (Current Claude)

```
"Implement: Add user profile endpoint"
"Implement: Fix the authentication bug"
"Implement: Complete stripe integration"
```

Claude uses:

- Standard implementation tools
- Commits every 15-30 minutes
- Follows CLAUDE_QUICKREF.md

### ✅ REVIEW MODE (Replaces Codex)

```
"Review: Check my implementation for security issues"
"Review: Validate test coverage"
"Review: Ensure no breaking changes"
```

Claude triggers:

- Specialized agents (schema-sentinel, test-architect, etc.)
- Runs tests and linting
- Self-review before PR

## Workflow Simplification

### OLD (Multi-Agent):

```
Gemini → Research & Plan (30 min)
  ↓ (context switch)
Claude → Implement (2 hrs)
  ↓ (context switch)
Codex → Review & Debug (30 min)
  ↓ (context switch)
Carlo → Integrate & Release (30 min)

Total: 3.5 hours + context switching overhead
```

### NEW (Claude-Only):

```
Claude Research Mode (5 min)
  ↓ (same context)
Claude Implementation Mode (1 hr)
  ↓ (same context)
Claude Review Mode (10 min)
  ↓
PR with auto-reviews

Total: 1.25 hours, no context switching
```

## Task Workflow (Simplified)

```bash
# 1. Claim task
./scripts/task claim feature-x

# 2. Research (if needed)
"Research: Find similar implementations"
"Research: Check database schema"

# 3. Implement
"Implement: [describe the feature]"
# Claude commits every 15-30 min automatically

# 4. Self-review
"Review: Run all quality checks"
# Claude triggers specialized agents

# 5. Complete
./scripts/task complete feature-x
gh pr create
```

## When to Consult External Agents

### Consult Gemini When:

- Need creative product ideas
- Designing new user experiences
- Architecture decisions for new systems
- Marketing copy or user-facing content

### Consult Codex When:

- Need second opinion on complex algorithms
- Performance optimization strategies
- Security audit of critical code
- Complex debugging scenarios

### How to Consult:

```markdown
"I need to consult Gemini about: [specific question]"
"Get Codex's opinion on: [code snippet or approach]"
```

Then return to Claude for implementation.

## Benefits of Claude-Only Workflow

1. **No Context Loss**: Single conversation thread
2. **Faster Iteration**: No agent handoffs
3. **Consistent Style**: One agent, one coding style
4. **Immediate Pivots**: Can switch modes instantly
5. **Better Memory**: Claude remembers entire session
6. **Reduced Overhead**: No inter-agent communication

## Quick Mode Triggers

| Need          | Say                                  | Claude Does                    |
| ------------- | ------------------------------------ | ------------------------------ |
| Find code     | "Research: [what to find]"           | Searches without implementing  |
| Build feature | "Implement: [what to build]"         | Writes code, tests, commits    |
| Check quality | "Review: [what to check]"            | Runs checks, triggers agents   |
| Get opinion   | "Consult [Gemini/Codex]: [question]" | Prepares question for external |
| Quick fix     | "Fix: [specific issue]"              | Rapid targeted change          |

## Implementation Checklist

- [x] Single agent (Claude) for all core work
- [x] Task CLI for workflow management
- [x] Specialized agents for automated reviews
- [x] Quick reference docs (CLAUDE_QUICKREF.md)
- [ ] Remove Gemini/Codex from daily workflow docs
- [ ] Update AGENTS.md to reflect Claude-only
- [ ] Update onboarding for new devs

## Metrics Improvement

| Metric                 | Multi-Agent  | Claude-Only | Improvement    |
| ---------------------- | ------------ | ----------- | -------------- |
| Task completion        | 3-4 hours    | 1-1.5 hours | 3x faster      |
| Context switches       | 3-5 per task | 0           | 100% reduction |
| Communication overhead | 30 min/task  | 0           | 100% reduction |
| Consistency            | Variable     | High        | Unified style  |
| Learning curve         | Complex      | Simple      | 80% easier     |

## Migration Path

### Phase 1: Update Documentation (30 min)

1. Update AGENTS.md to show Claude as primary
2. Mark Gemini/Codex as "external consultants"
3. Update task templates

### Phase 2: Simplify Commands (30 min)

1. Remove multi-agent handoff scripts
2. Update quick reference cards
3. Simplify PR templates

### Phase 3: Team Adoption (1 day)

1. Announce simplified workflow
2. Demo Claude-only approach
3. Gather feedback and iterate

## Emergency Fallback

If Claude-only doesn't work for specific task:

```bash
# Explicitly request multi-agent workflow
"Use traditional workflow: Gemini → Claude → Codex"
```

But this should be rare (< 5% of tasks).
