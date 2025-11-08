# Auto PR Review System - Quick Reference

## 🤖 What It Does

Automatically reviews, approves, and merges PRs to `main` that pass quality checks.

## ✅ Auto-Merge Conditions

Your PR will be automatically merged if:

- ✅ Lint passes (`pnpm lint`)
- ✅ Build succeeds (`pnpm build`)
- ✅ Less than 500 lines changed
- ✅ No critical files modified

## ⚠️ Manual Review Needed When:

- Large changes (>500 lines)
- Critical files modified:
  - `.github/workflows/*`
  - `AGENTS.md`
  - `package.json`
  - Config files
- Security-sensitive files

## 📋 Workflow Status

After opening/updating a PR, check the "Auto PR Review & Merge" action:

- ✅ **Verify PR** - Runs lint, build, tests
- 🔍 **Automated Review** - Analyzes changes
- 🎯 **Auto-merge** or ⚠️ **Manual review required**

## 🔧 Configuration

Edit `.github/auto-review.config.json` to customize:

- Change size threshold
- Add/remove critical file patterns
- Disable auto-merge
- Change merge method

## 📚 Full Documentation

See [docs/AUTO_PR_REVIEW.md](../docs/AUTO_PR_REVIEW.md) for complete guide.

## 🚫 Disable Auto-Review

To disable for a specific PR, add label: `manual-merge`

To disable globally: Set `"enabled": false` in config file.
