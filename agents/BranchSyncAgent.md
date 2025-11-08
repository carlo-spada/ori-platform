# Branch Sync Agent

## Purpose

Codex, Claude, and Gemini each work off long-lived branches. When those branches fall behind `main`, every pull request becomes a manual merge party. The Branch Sync Agent keeps the playing field level by continuously blending the latest `main` history back into every agent branch without touching their in-flight work.

## Operating Principles

1. **Single Source of Truth** — `main` remains the canonical branch. The agent never writes directly to `main`; it only syncs *from* `main` into the agent branches.
2. **Non-Destructive Updates** — The agent performs `git merge origin/main --no-edit` inside each agent branch. That keeps commit history intact (no force pushes) while ensuring the branch contains the newest `main` commits.
3. **Deterministic Order** — Branches are updated sequentially: `codex-branch`, `claude-branch`, `gemini-branch`. Running sequentially prevents cross-branch race conditions and makes troubleshooting predictable.
4. **Conflict Visibility** — If a merge conflict appears, the agent aborts the merge immediately and surfaces the conflict details in the workflow summary + failure logs. Nothing is pushed when conflicts exist.
5. **Human-Callable** — The exact same logic can run locally via `node scripts/branch-sync-agent.js`, so humans (or other agents) can reproduce the behavior before the scheduled workflow fires.

## Artifact Map

| File | Role |
| --- | --- |
| `agents/branch-sync.config.json` | Declares the source branch and target branches. |
| `scripts/branch-sync-agent.js` | Implements the sync procedure (fetch → checkout → merge → push). |
| `.github/workflows/branch-sync-agent.yml` | Runs the agent on push to `main`, nightly, and on manual dispatch. |

## Execution Flow

1. Checkout the repository with `fetch-depth: 0`.
2. Read `agents/branch-sync.config.json` to obtain `source` + `targets`.
3. Fetch `origin/<source>` once, then iterate through each target branch:
   - `git fetch origin <target>`
   - `git checkout -B <target> origin/<target>` (fresh branch starting from remote)
   - Capture the current `HEAD` SHA.
   - `git merge origin/<source> --no-edit`
   - On success, compare the new `HEAD` SHA to decide whether a push is required.
   - Push back to `origin/<target>` only when new commits were created.
4. Collect per-branch status and append a markdown table to `$GITHUB_STEP_SUMMARY`.

## Failure Handling

- **Merge Conflicts** — Run `git merge --abort`, mark the branch as `conflict`, and continue attempting the rest. The job fails at the end so maintainers notice right away.
- **Push Protection** — Branch protections may block the push. The action surfaces the error and exits non-zero so we can adjust permissions or manually intervene.
- **Network / Auth Issues** — Retries rely on rerunning the workflow; logs include the branch and Git command that failed.

## Local Usage

```bash
pnpm install # ensures node_modules exists if scripts ever expand
node scripts/branch-sync-agent.js --config agents/branch-sync.config.json
```

Running locally mirrors the workflow exactly, letting anyone confirm the merge behavior before trusting automation.

## Future Enhancements

- Automatically open an issue or ping Slack when merges conflict repeatedly.
- Add support for temporary feature branches by accepting `--only <branch>` overrides.
- Emit JSON artifacts so other workflows (e.g., nightly reports) can reuse the sync status.
