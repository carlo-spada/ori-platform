# Branch Synchronization Guide

## Overview

The Ori Platform uses a branching strategy with dedicated agent branches (`gemini-branch`, `claude-branch`, `codex-branch`) that need to be kept in sync with the `main` branch. This document explains how to synchronize these branches.

## Automatic Synchronization

The repository includes a GitHub Actions workflow (`.github/workflows/branch-sync-agent.yml`) that automatically syncs branches:

- **Runs every 6 hours** via scheduled cron job
- **Runs automatically** when changes are pushed to `main`
- **Can be triggered manually** via workflow_dispatch

### Manual Workflow Trigger

To manually trigger the branch sync workflow:

1. Go to the [Actions tab](https://github.com/carlo-spada/ori-platform/actions/workflows/branch-sync-agent.yml) in GitHub
2. Click the "Run workflow" button
3. Select the branch (usually `main`)
4. Click "Run workflow"

The workflow will automatically:
- Checkout the repository with full history
- Configure git with GitHub Actions Bot credentials
- Run the branch sync script
- Merge `main` into each agent branch
- Push the changes back to the repository

## Manual Synchronization

If you need to sync branches manually (e.g., during development or troubleshooting):

### Option 1: Using the Convenience Script

```bash
# From the repository root
./scripts/sync-branches-manual.sh
```

This script will:
- Verify you're in the correct directory
- Check your GitHub authentication
- Fetch the latest changes
- Run the synchronization process

### Option 2: Using Node.js Directly

```bash
# Ensure you're in the repository root
cd /path/to/ori-platform

# Fetch all branches
git fetch --all

# Run the sync script
node scripts/branch-sync-agent.js
```

**Requirements:**
- Node.js 18+ installed
- Git authentication configured (push access required)
- All agent branches exist locally

### Option 3: Manual Git Commands

If the script fails or you need more control:

```bash
# For each agent branch (gemini-branch, claude-branch, codex-branch):

# 1. Checkout the agent branch
git checkout gemini-branch

# 2. Fetch latest main
git fetch origin main

# 3. Merge main into the agent branch
git merge origin/main --no-ff -m "Merge main into gemini-branch"

# 4. Push the changes
git push origin gemini-branch

# Repeat for other branches
```

## Troubleshooting

### Authentication Issues

If you see "Authentication failed" errors:

1. **For HTTPS:** Ensure you have a valid GitHub personal access token:
   ```bash
   gh auth login
   ```

2. **For SSH:** Ensure your SSH key is added to your GitHub account:
   ```bash
   ssh -T git@github.com
   ```

### Merge Conflicts

If a merge conflict occurs during sync:

1. The script will automatically revert the affected branch
2. You'll need to resolve conflicts manually:
   ```bash
   git checkout <affected-branch>
   git merge origin/main
   # Resolve conflicts in your editor
   git add .
   git commit
   git push origin <affected-branch>
   ```

### Script Syntax Errors

If the sync script has syntax errors, it has been fixed in this PR. The errors were related to multi-line string literals that have been corrected.

## Current Branch Status

You can check the sync status of branches:

```bash
# See how many commits each branch is behind main
git fetch --all
echo "Gemini branch:" && git log origin/gemini-branch..origin/main --oneline | wc -l
echo "Claude branch:" && git log origin/claude-branch..origin/main --oneline | wc -l
echo "Codex branch:" && git log origin/codex-branch..origin/main --oneline | wc -l
```

## Configuration

The branch sync configuration is stored in `agents/branch-sync.config.json`:

```json
{
  "donorBranch": "main",
  "targetBranches": [
    "gemini-branch",
    "claude-branch",
    "codex-branch"
  ]
}
```

To modify which branches are synced, update this configuration file.

## Best Practices

1. **Let automation handle it**: The GitHub Actions workflow runs regularly and should handle most syncs automatically
2. **Trigger manually after important merges**: After merging significant PRs to `main`, trigger the workflow manually
3. **Monitor for conflicts**: If branches frequently have conflicts, coordinate agent work to minimize divergence
4. **Test locally first**: When troubleshooting, test the sync script locally before modifying the workflow

## Related Documentation

- [AGENTS.md](../AGENTS.md) - Full branching strategy and collaboration workflow
- [GitHub Actions Workflow](../.github/workflows/branch-sync-agent.yml) - Automated sync configuration
- [Branch Sync Config](../agents/branch-sync.config.json) - Branch configuration
