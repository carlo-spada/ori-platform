# Branch Sync Instructions

## Quick Start: How to Sync All Branches Now

After this PR is merged, follow these steps to synchronize all agent branches with main:

### Option 1: GitHub Actions (Recommended)

1. Navigate to: https://github.com/carlo-spada/ori-platform/actions/workflows/branch-sync-agent.yml
2. Click the **"Run workflow"** button (top right)
3. Ensure "main" branch is selected
4. Click **"Run workflow"** to confirm
5. Wait for the workflow to complete (~1-2 minutes)

**What it does:**
- Merges `main` into `gemini-branch`
- Merges `main` into `claude-branch`
- Merges `main` into `codex-branch`
- Pushes all changes automatically

### Option 2: Local Manual Sync

If you have push access to the repository:

```bash
# Clone and navigate to the repository
cd ori-platform

# Run the sync script
./scripts/sync-branches-manual.sh
```

### Option 3: Wait for Automatic Sync

The workflow runs automatically:
- Every 6 hours via scheduled cron job
- Every time code is pushed to `main`

## What Was Fixed

This PR fixed critical syntax errors in `scripts/branch-sync-agent.js` that prevented the branch synchronization from working. The errors were:

```javascript
// Before (broken):
console.log('
--- Syncing ${branch} ---');

// After (fixed):
console.log('\n--- Syncing ${branch} ---');
```

## Current Branch Status

As of this PR:
- **gemini-branch**: 3 commits behind main
- **claude-branch**: 10 commits behind main
- **codex-branch**: 12 commits behind main

After running the sync, all branches will be up-to-date with `main`.

## Documentation

For detailed information about branch synchronization, see:
- [docs/BRANCH_SYNC.md](docs/BRANCH_SYNC.md) - Complete synchronization guide
- [AGENTS.md](AGENTS.md) - Branching strategy and workflow

## Need Help?

If you encounter issues:
1. Check the [troubleshooting section](docs/BRANCH_SYNC.md#troubleshooting) in the documentation
2. Review the GitHub Actions workflow logs
3. Ensure you have proper authentication and push access

## Automatic Sync Going Forward

Once this PR is merged, branch synchronization will happen automatically every 6 hours and on every push to `main`. No manual intervention should be needed for day-to-day operations.
