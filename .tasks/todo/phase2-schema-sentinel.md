# Phase 2: Implement Schema Contract Sentinel GitHub Action

## Objective

Create GitHub Action that automatically reviews database migrations and API changes on PRs.

## Acceptance Criteria

- [ ] GitHub Action triggers on changes to `supabase/migrations/`, `shared/types/`, `services/*/routes/`
- [ ] Posts automated review comment on PR
- [ ] Detects breaking changes
- [ ] Checks migration reversibility
- [ ] Validates type compatibility

## Implementation

1. Use workflow template from TRANSITION_MASTERPLAN.md
2. Test with a sample PR that modifies migrations
3. Ensure comments are informative and actionable

## Time Estimate

3 hours (agentic pace)

## Priority

HIGH - Part of Phase 2 automation
