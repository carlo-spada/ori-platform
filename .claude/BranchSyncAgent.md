# Branch Sync Agent

This document outlines the purpose, guardrails, and operational flow of the Branch Sync Agent. This automation ensures that our long-lived agent branches (`gemini-branch`, `claude-branch`, `codex-branch`) remain synchronized with the `main` branch, facilitating continuous integration and reducing merge conflicts.

## Intent

The primary goal of the Branch Sync Agent is to keep the agent branches up-to-date with the latest changes from `main`. This allows agents to always work on the most current codebase, minimizing the effort required for rebasing and conflict resolution during feature integration.

## Guardrails

1.  **Read-Only `main` for Agents**: Agent branches should never directly push to `main`. All changes from agent branches must go through a pull request and review process.
2.  **Conflict Resolution**: In case of merge conflicts, the agent will attempt to resolve them automatically. If automatic resolution fails, the sync process will abort, and a human will be notified to intervene.
3.  **Idempotency**: The sync process is designed to be idempotent, meaning running it multiple times will produce the same result without unintended side effects.
4.  **Permissions**: The GitHub Action workflow will be configured with appropriate permissions to push to the agent branches but not to `main`.

## Flow

1.  **Trigger**: The sync process is triggered by:
    *   Every push to the `main` branch.
    *   A scheduled cron job (e.g., every six hours).
    *   Manual dispatch via `workflow_dispatch` in GitHub Actions.

2.  **Configuration**: The agent reads its configuration from `agents/branch-sync.config.json`, which specifies the donor branch (`main`) and the target agent branches.

3.  **Synchronization Logic (per target branch)**:
    *   Fetch the latest changes from `main`.
    *   Checkout the target agent branch.
    *   Merge `main` into the target agent branch.
    *   If conflicts occur:
        *   Attempt automatic resolution (if configured and feasible).
        *   If unresolved, abort the merge, revert the branch to its state before the sync, and log the conflict for human intervention.
    *   If successful, push the updated target agent branch to the remote.
    *   Generate a human-readable summary of the sync operation (success/failure, conflicts, etc.).

4.  **Reporting**: The sync summary is logged in the workflow run and can be used for notifications (e.g., Slack, GitHub Issues) in case of failures or conflicts.

## Local Invocation

To run the sync script locally for testing or manual intervention:

```bash
node scripts/branch-sync-agent.js
```

Ensure you have the necessary Git credentials configured for pushing to the remote agent branches.