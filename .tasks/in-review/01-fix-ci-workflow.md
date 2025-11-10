# Fix CI Workflow (pnpm lockfile issue)

**Status**: TODO
**Priority**: CRITICAL
**Estimated**: 5 minutes
**Owner**: Claude

## Problem

GitHub Actions workflow failing with "workflow file issue" due to missing pnpm-lock.yaml after security vulnerability fix.

## Root Cause

- Deleted pnpm-lock.yaml during dependency override testing
- CI workflow uses `pnpm install --frozen-lockfile` flag
- Flag requires lockfile to exist

## Solution

Either:

1. Generate pnpm-lock.yaml: `pnpm install` at root
2. OR remove `--frozen-lockfile` flag from `.github/workflows/translate.yml`

## Steps

1. Navigate to project root
2. Run `pnpm install` to generate lockfile
3. Commit pnpm-lock.yaml
4. Push to dev
5. Verify CI passes

## Acceptance Criteria

- [ ] pnpm-lock.yaml exists in repository
- [ ] GitHub Actions workflows pass
- [ ] No "workflow file issue" errors

## Related Files

- `.github/workflows/translate.yml` (line 58)
- `pnpm-lock.yaml` (missing)
