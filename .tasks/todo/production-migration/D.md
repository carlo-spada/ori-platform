---
Task ID: D
Feature: Production Migration
Title: Full CI/CD Automation and Database Migrations
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: B, C
---

### Objective
Create a unified Continuous Integration and Continuous Deployment (CI/CD) pipeline that automates testing, deployment of all services, and database migrations.

### Context
This is the final step in achieving a Zero-Ops infrastructure. A fully automated pipeline ensures that every push to the main branch results in a safe, tested, and complete deployment of the entire platform.

### Key Files to Modify
- `.github/workflows/verify.yml`
- **New File**: `.github/workflows/deploy-production.yml`

### Instructions for Claude
1.  **Enhance `verify.yml`**:
    *   Update the existing `verify.yml` workflow.
    *   Ensure it runs on every pull request against the `main` branch.
    *   It should run `pnpm lint` and `pnpm test` for the entire monorepo.
    *   Add a step to run `pytest` for the `ai-engine`.
2.  **Create `deploy-production.yml` Workflow**:
    *   Create a new workflow that triggers on every push to the `main` branch.
    *   This workflow will orchestrate the entire deployment process.
    *   **Steps**:
        1.  **Run Verification**: The first job should run all the checks from the `verify.yml` workflow. The subsequent jobs should only run if this job succeeds.
        2.  **Deploy Vercel**: A second job that deploys the project to Vercel. Vercel's own GitHub integration can handle this automatically, but you can also use the Vercel CLI here for more control. This will deploy the Next.js frontend and the `core-api` serverless functions.
        3.  **Deploy AI Engine**: A third job that calls the `deploy-ai-engine.yml` workflow (or duplicates its steps) to deploy the container to Cloud Run.
        4.  **Run Database Migrations**: A final job that runs the Supabase database migrations against the production database.
            *   Use the Supabase CLI.
            *   This job will need the production database password stored as a GitHub Secret.
            *   Command: `supabase db push --password-from-stdin`

### Acceptance Criteria
-   The `verify.yml` workflow is updated to run all necessary checks on pull requests.
-   A new `deploy-production.yml` workflow is created.
-   On a push to `main`, the workflow automatically tests the entire codebase.
-   If tests pass, the workflow automatically deploys the frontend/`core-api` to Vercel and the `ai-engine` to Cloud Run.
-   After successful deployments, the workflow automatically applies any new Supabase migrations to the production database.
