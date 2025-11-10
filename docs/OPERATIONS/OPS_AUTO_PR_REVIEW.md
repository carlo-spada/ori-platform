# Automated PR Review & Merge System

## Overview

The Ori Platform includes an automated PR review and merge system that automatically reviews, approves, and merges pull requests to the `main` branch when they meet quality criteria.

## How It Works

### 1. Automatic Verification

When a PR is opened or updated, the system automatically:

1. **Runs verification checks:**
   - Linting (`pnpm lint`)
   - Build (`pnpm build`)
   - Tests (`pnpm test`)

2. **Analyzes the changes:**
   - Number of files changed
   - Lines added/removed
   - Modified file types
   - Detects risky patterns

3. **Makes a decision:**
   - ✅ Auto-approve and merge if all checks pass and changes are safe
   - ⚠️ Request manual review if changes are risky or substantial

### 2. Auto-Merge Criteria

A PR will be **automatically merged** if:

- ✅ All verification checks pass (lint + build)
- ✅ Changes are less than 500 lines
- ✅ No critical files are modified
- ✅ No security-sensitive files are changed

### 3. Manual Review Required

A PR will require **manual review** if:

- ⚠️ Changes exceed 500 lines
- ⚠️ Critical files modified:
  - `.github/workflows/` (GitHub Actions)
  - `AGENTS.md` (branching strategy)
  - `package.json` / `pnpm-lock.yaml` (dependencies)
  - Configuration files (`tsconfig.json`, `next.config.ts`)
- ⚠️ Security-sensitive files modified:
  - Environment files (`.env*`)
  - Authentication code
  - Security modules

## Workflow Diagram

```
PR Created/Updated
       ↓
  Run Verification
  (lint, build, test)
       ↓
    Pass? ───No──→ Comment with errors
       │           (PR blocked)
      Yes
       ↓
  Analyze Changes
  (size, files, patterns)
       ↓
    Risky? ───Yes──→ Comment: Manual review needed
       │             (PR blocked until approved)
       No
       ↓
  Auto-Approve PR
       ↓
  Auto-Merge PR
  (squash merge)
       ↓
  Post success comment
```

## Configuration

The auto-review system is configured in `.github/auto-review.config.json`:

```json
{
  "enabled": true,
  "requireManualReview": {
    "largeChanges": {
      "threshold": 500
    },
    "criticalFiles": {
      "patterns": [".github/workflows/**", "AGENTS.md", ...]
    }
  },
  "autoMerge": {
    "method": "squash"
  }
}
```

### Customization Options

- **Threshold for large changes**: Adjust `requireManualReview.largeChanges.threshold`
- **Critical file patterns**: Modify `requireManualReview.criticalFiles.patterns`
- **Merge method**: Change `autoMerge.method` (options: `merge`, `squash`, `rebase`)
- **Enable/disable**: Set `enabled: false` to disable auto-review

## Usage Examples

### Example 1: Simple Bug Fix (Auto-merged)

```
PR: Fix typo in documentation
Files: README.md (1 file)
Changes: +2, -2
Result: ✅ Auto-approved and merged
```

### Example 2: Feature Addition (Manual Review)

```
PR: Add new authentication module
Files: src/auth/*, package.json (15 files)
Changes: +450, -120
Result: ⚠️ Manual review required (critical files)
```

### Example 3: Failed Verification

```
PR: Update component styles
Files: src/components/* (5 files)
Lint errors: 3 errors found
Result: ❌ Blocked until lint errors fixed
```

## Manual Override

If you need to bypass the auto-review for a specific PR:

1. Add the label `manual-merge` to the PR
2. The auto-review will skip auto-merge
3. A human reviewer can approve and merge manually

## Monitoring

### View Auto-Review Activity

1. Go to [Actions tab](https://github.com/carlo-spada/ori-platform/actions/workflows/auto-pr-review.yml)
2. See all auto-review runs and their results
3. Check logs for detailed analysis

### Common Issues

**Issue**: PR not auto-merging despite passing checks

- **Solution**: Check if critical files are modified (requires manual review)

**Issue**: Auto-review failing on valid changes

- **Solution**: Ensure `pnpm lint` and `pnpm build` pass locally first

**Issue**: Want to disable auto-merge temporarily

- **Solution**: Set `enabled: false` in `.github/auto-review.config.json`

## Integration with Two-Branch Workflow

The auto-review system integrates with the current two-branch workflow:

1. **Dev branch** (`dev`) is where all development happens
2. **Pull requests** from `dev` → `main` trigger auto-review
3. **Auto-review** runs verification and analysis
4. **Safe changes** can be auto-merged (if enabled)
5. **Risky changes** always wait for human approval
6. **Branch sync** (optional) keeps dev updated with main after merges

This maintains the safety of the main branch while reducing manual overhead for routine changes.

**Note**: The repository previously used agent-specific branches (gemini-branch, claude-branch, codex-branch) but has since simplified to a two-branch workflow (main/dev) as of November 2025.

## Security Considerations

The auto-review system is designed with security in mind:

- **No auto-merge for security files**: Authentication, secrets, and security modules always require manual review
- **Verification required**: All PRs must pass lint and build checks
- **Audit trail**: All auto-reviews and merges are logged in GitHub Actions
- **Override capability**: Human reviewers can always intervene

## Disabling Auto-Review

To disable the auto-review system:

### Option 1: Via Configuration

Edit `.github/auto-review.config.json`:

```json
{
  "enabled": false
}
```

### Option 2: Delete Workflow

Remove or rename `.github/workflows/auto-pr-review.yml`

### Option 3: Branch Protection

Update branch protection rules in GitHub settings to require manual reviews

## Best Practices

1. **Keep PRs small**: Stay under 500 lines for faster auto-merge
2. **Separate concerns**: Split large features into multiple PRs
3. **Test locally first**: Run `pnpm lint` and `pnpm build` before pushing
4. **Document changes**: Clear PR descriptions help reviewers (human or automated)
5. **Critical changes**: Expect manual review for workflow/config changes

## Troubleshooting

### Workflow not triggering

Check:

- PR targets `main` branch
- Workflow file is in `.github/workflows/`
- GitHub Actions is enabled for the repository

### Permissions errors

Ensure GitHub Actions has:

- `contents: write` (for merging)
- `pull-requests: write` (for comments/reviews)
- `checks: read` (for verification status)

### Merge conflicts

Auto-review will fail if there are merge conflicts. Resolve conflicts and push updates to trigger a new review.

## Related Documentation

- [AGENTS.md](../AGENTS.md) - Branching strategy and agent workflow
- [Branch Sync Guide](BRANCH_SYNC.md) - Keeping agent branches in sync
- [Verification Workflow](../.github/workflows/verify.yml) - CI checks
