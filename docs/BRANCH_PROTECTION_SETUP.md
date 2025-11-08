# Branch Protection Setup Guide

This document provides step-by-step instructions for setting up branch protection rules on the `main` branch.

## New Simplified Branch Structure

The repository now uses a **two-branch workflow**:
- **`main`**: Production branch (deployed to Vercel, fully protected)
- **`development`**: Working branch (all development happens here)

## Setting Up Branch Protection for Main

Navigate to: `https://github.com/carlo-spada/ori-platform/settings/rules`

### Create Repository Ruleset

1. Click **"New ruleset"** → **"New branch ruleset"**
2. **Ruleset Name**: `Main Branch Protection`
3. **Enforcement status**: Active
4. **Target branches**: Add branch → Include by pattern → `main`

### Configure Rules

#### 1. Restrict Deletions
- ✅ Enable: **Restrict deletions**
- Only allow users with bypass permissions to delete matching refs

#### 2. Require Linear History
- ✅ Enable: **Require linear history**
- Prevent merge commits from being pushed to matching refs

#### 3. Require Deployments to Succeed
- ✅ Enable: **Require deployments to succeed before merging**
- Select environment: `Production` (Vercel)

#### 4. Require Signed Commits
- ✅ Enable: **Require signed commits**
- Commits pushed to matching refs must have verified signatures

#### 5. Require Pull Request Before Merging
- ✅ Enable: **Require a pull request before merging**
- Configure the following sub-rules:

  **Required Approvals:**
  - Required approving reviews: `1`

  **Dismiss Stale Reviews:**
  - ✅ Enable: **Dismiss stale pull request approvals when new commits are pushed**
  - New, reviewable commits will dismiss previous pull request review approvals

  **Code Owners:**
  - ✅ Enable: **Require review from Code Owners**
  - Require an approving review in pull requests that modify files with a designated code owner

  **Most Recent Push:**
  - ✅ Enable: **Require approval of the most recent reviewable push**
  - The most recent reviewable push must be approved by someone other than the person who pushed it

  **Conversation Resolution:**
  - ✅ Enable: **Require conversation resolution before merging**
  - All conversations on code must be resolved before a pull request can be merged

#### 6. Automatically Request Copilot Code Review
- ✅ Enable: **Automatically request Copilot code review**
- ✅ Enable: **Review new pushes**
- ✅ Enable: **Review draft pull requests**

#### 7. Allowed Merge Methods
Configure in: `Settings → General → Pull Requests`
- ✅ Allow merge commits (optional)
- ✅ Allow squash merging (recommended)
- ✅ Allow rebase merging (optional)

#### 8. Block Force Pushes
- ✅ Enable: **Block force pushes**
- Prevent users with push access from force pushing to refs

#### 9. Require Code Scanning Results
- ✅ Enable: **Require code scanning results**
- Tool: **CodeQL**
- Configure CodeQL: Go to `Security → Code scanning → CodeQL analysis`

#### 10. Require Code Quality Results
- ✅ Enable: **Require code quality results**
- Severity: Select minimum severity level for blocking merges

## Workflow

### Development Process

1. **Start Work**: Always work on the `development` branch
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Make Changes**: Commit regularly with clear messages
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to Development**: Push your changes to the development branch
   ```bash
   git push origin development
   ```

4. **Create Pull Request**: When ready to deploy, create a PR from `development` → `main`
   - All automated checks will run
   - Request reviews as needed
   - Copilot will automatically review the code
   - Resolve all conversations

5. **Merge to Main**: Once approved and all checks pass
   - The PR can be merged (squash recommended)
   - Vercel will automatically deploy to production
   - Development branch will be automatically synced (optional workflow)

## Setting Up CodeQL

1. Navigate to: `Security → Code scanning`
2. Click **"Set up code scanning"**
3. Choose **"CodeQL Analysis"**
4. Select: **Default setup** (recommended)
5. Languages: JavaScript/TypeScript, Python
6. Save configuration

## Setting Up CODEOWNERS

Create a file at `.github/CODEOWNERS`:

```
# Default owner for everything
* @carlo-spada

# AI engine components
/services/ai-engine/ @carlo-spada

# Frontend components
/src/components/ @carlo-spada

# API routes
/services/core-api/ @carlo-spada
```

## Verifying Protection is Active

After setup, verify by attempting:
```bash
git checkout main
git push origin main
```

You should see an error preventing direct pushes to main.

## Bypass Permissions

Only repository administrators can bypass these rules when absolutely necessary. This should be used sparingly and with caution.

---

**Last Updated**: 2025-11-07
**Repository**: https://github.com/carlo-spada/ori-platform
