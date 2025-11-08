# Repository Guidelines

**Always remember to treat this repository as a living, evolving system, not just a codebase. Every file —including internal AI guides— must contribute to a continuous, compounding loop of learning and improvement. Treat every change as an act of careful architecture: favor clarity, safety, and long-term adaptability. Collaborate in ways that deepen collective understanding: even if it means doing a little more now to unlock much more later in the future.**

## Collaborative Workflow & Branching Strategy

To ensure the `main` branch remains stable and deployable at all times, we will adhere to the following Git workflow. This process is enforced automatically by GitHub branch protection rules.

### Branching Model

The repository uses a **simplified two-branch workflow**:

*   **`main`**: Production branch that is automatically deployed to Vercel. It must always be stable and ready for deployment. **Direct pushes to `main` are strictly prohibited** and enforced by GitHub branch protection rules.
*   **`development`**: The working branch where all development happens. All features, fixes, and changes are made here before being merged to `main` via Pull Request.

### Core Development Workflow

All development follows this streamlined sequence:

1.  **Start on Development**: Always work on the `development` branch:
    ```bash
    git checkout development
    git pull origin development
    ```

2.  **Develop**: Make your changes on the `development` branch. Commit regularly with clear, conventional commit messages following the format:
    ```bash
    git add .
    git commit -m "feat: add new feature"  # or fix:, chore:, docs:, etc.
    ```

3.  **Push to Development**: Push your changes to the remote `development` branch:
    ```bash
    git push origin development
    ```

4.  **Test Locally**: Before creating a PR, run all essential checks:
    ```bash
    pnpm install
    pnpm lint
    pnpm build
    # pnpm test (when applicable)
    ```

5.  **Create a Pull Request**: When ready to deploy to production, create a PR from `development` → `main`:
    - The PR description should clearly explain the changes
    - Link related issues with `Closes #123`
    - All automated checks will run (linting, build, tests, CodeQL)
    - Copilot will automatically review the code
    - At least 1 approval is required
    - All conversations must be resolved

6.  **Merge to Main**: Once approved and all checks pass:
    - The PR can be merged (squash merge recommended)
    - Vercel will automatically deploy to production
    - The deployment must succeed before merge is complete

### Enforcement & Automation

This workflow is strictly enforced by GitHub branch protection rules:

*   **Pull Requests Required**: All code must enter `main` through a PR from `development`
*   **No Direct Pushes**: Direct pushes to `main` are blocked for everyone
*   **Automated CI Checks**: GitHub Actions automatically runs `lint`, `build`, and `test` on every PR
*   **Required Approvals**: At least 1 approving review is required
*   **Code Owners Review**: Changes to files with designated owners require their approval
*   **Conversation Resolution**: All PR conversations must be resolved before merging
*   **Signed Commits**: All commits must have verified signatures
*   **Linear History**: Merge commits are prevented; use squash or rebase merging
*   **CodeQL Scanning**: Code must pass security analysis
*   **Copilot Review**: Automatically requests code review on new PRs and pushes
*   **Successful Deployment**: Vercel deployment must succeed before PR can merge
*   **No Force Pushes**: Force pushes are blocked on `main`
*   **No Deletions**: Branch deletion is restricted

## GitHub Considerations

All code changes must be integrated into `main` via Pull Requests from `development`. Direct pushes to `main` are strictly prohibited and enforced by branch protection rules. Before creating a PR, ensure all local checks pass (`pnpm lint`, `pnpm build`). This workflow preserves version integrity, prevents integration errors, and ensures `main` is always production-ready.

## Human–AI Collaboration

This is a shared and continuously evolving collaboration between humans and intelligent agents. Act deliberately: validate assumptions, question defaults, and safeguard shared resources. Prioritize clarity, safety, and precision in every operation.

When advising or interacting with human collaborators, always propose the **safest**, **most efficient**, and **most elegant** course of action. Stay vigilant for opportunities to improve coordination—refine workflows, automation, or development strategies to strengthen reliability and collective performance.

The objective is ongoing alignment, refinement, and progress toward a more resilient and harmonious system of collaboration.

## Project Management: The Task-as-File System

To ensure clarity and prevent redundant work, we use a file-based task management system. This is the single source of truth for what needs to be done, what is in progress, and what is complete.

### Directory Structure
All tasks are managed within the `.tasks/` directory, which is organized into three stage-based subdirectories:
-   **`.tasks/todo/`**: Contains features or tasks that are planned but not yet started. Large features ('epics') should correspond to a subfolder within this directory (e.g., `.tasks/todo/feature-name/`). Each smaller, independent work unit related to that feature will be an individual Markdown file within that folder (e.g., `A.md`, `B.md`). Standalone tasks can be individual Markdown files directly in `todo/`.
-   **`.tasks/in-progress/`**: Contains files or entire feature subfolders that are actively being worked on.
-   **`.tasks/done/`**: A record of all completed tasks and features.

### Workflow

1.  **Review the Board**: Before starting new work, review the `.tasks/` subdirectories to understand the current project state
2.  **Claim a Task**: Move the task file or feature folder from `.tasks/todo/` to `.tasks/in-progress/` to claim ownership:
    ```bash
    # Example: Claiming task 'A.md'
    mv .tasks/todo/A.md .tasks/in-progress/A.md
    # Example: Claiming feature 'feature-name/'
    mv .tasks/todo/feature-name/ .tasks/in-progress/feature-name/
    ```
3.  **Update Task File**: Edit the task file to add assignee information
4.  **Perform the Work**: Complete the task following the instructions within the task file
5.  **Complete a Task**: Upon completion and successful PR merge, move the task file from `.tasks/in-progress/` to `.tasks/done/`

This system minimizes merge conflicts and provides a clear, real-time view of the project's status.

## Project Structure & Module Organization

Ori Platform is a pnpm workspace monorepo. Web code resides in `src/` (`src/app` for the App Router, `src/components` for UI, `src/contexts` and `src/hooks` for state helpers, `src/integrations` and `src/lib` for clients) using the ` @/` alias. Shared domain assets live in `shared/`, backend services in `services/` (`core-api`, `ai-engine`), static files in `public/`, and Supabase migrations in `supabase/`.

**AI Engine (Nov 2025):** Fully implemented Python FastAPI service providing semantic job matching, skill gap analysis, and learning path generation. Uses sentence-transformers for local embedding generation (no API keys required). Multi-factor scoring algorithm weights semantic similarity (40%), skill match (30%), experience (15%), location (10%), and salary (5%). Core-api integrates via HTTP client with graceful fallback.

## Build, Test, and Development Commands

- `pnpm install` — install workspace dependencies (avoid mixing npm/yarn).
- `pnpm dev` — launch the Next.js app at `http://localhost:3000`.
- `pnpm dev:api` or `pnpm --filter @ori/core-api dev` — run the core API with hot reload.
- `pnpm build && pnpm start` — compile and serve the production build.
- `pnpm lint` — enforce the Next.js core-web-vitals ESLint configuration.
- `pnpm turbo test --filter=<package>` — run package-specific tests; coverage output is written to `coverage/`.

**AI Engine Commands:**
- `cd services/ai-engine && pip install -r requirements.txt` — first-time setup (creates venv recommended).
- `python main.py` — start AI engine at `http://localhost:3002` (downloads model on first run).
- `pytest tests/ -v` — run AI engine tests with verbose output.

## Coding Style & Naming Conventions

TypeScript strict mode is enabled; favor explicit types and composable patterns. Use two-space indentation, single quotes, trailing semicolons, PascalCase for components, camelCase for hooks and utilities, and SCREAMING_SNAKE_CASE for environment variables. Tailwind classes should follow a logical order: layout → color → state. Run `pnpm lint --fix` before committing.

## Testing Guidelines

Co-locate UI tests as `*.test.tsx` or `*.spec.ts` files (React Testing Library + Vitest/Jest). Cover `services/core-api` endpoints with supertest integration tests. Python agents include pytest suites in `services/ai-engine/tests` and mock Supabase, Stripe, or HTTP clients. Before each pull request, run `pnpm lint` and the relevant `pnpm turbo test --filter ...`, and refresh Supabase migrations whenever the schema changes.

## Commit & Pull Request Guidelines

Follow the Conventional Commits format (`feat:`, `fix:`, `chore:`). Keep scopes concise (e.g., `feat(core-api): add billing limits`). In pull requests, describe the change, link related issues with `Closes #123`, list any new environment variables or migrations, and attach screenshots or Looms for UI updates. Verify local linting and tests, request reviewers for each affected surface (web, API, AI engine), and document rollout or follow-up actions.

## Security & Configuration Tips

Store secrets in untracked `.env.local` (web) or service-specific `.env` files, seeded from vaults or `.env.example`. Never commit credentials. Stripe keys, Supabase URLs, and AI model tokens are required for `pnpm dev`. Database changes flow through `supabase/migrations` and `supabase/config.toml`; document any new credentials or setup steps in your PR to ensure reproducibility.

## Keeping This Guide Alive

Treat this document as the shared playbook. Whenever you introduce a major feature, infrastructure update, or new workflow, update the relevant sections here and reference the pull request so every agent—human or AI—remains aligned and informed. Synchronization across guides is essential for coherent, adaptive collaboration.

### Recent Completions

- **AI Engine (Nov 2025):** Fully implemented Python FastAPI service with semantic matching, skill gap analysis, learning paths, and core-api integration
- **Branch Simplification (Nov 2025):** Migrated from multi-agent branch structure to streamlined `main`/`development` workflow with comprehensive branch protection
- **Automated Reviews:** Integrated Copilot code review for all PRs with automatic push reviews

### Immediate Next Steps

- Ensure `AGENTS.md` and `CLAUDE.md` stay synchronized with workflow changes
- Run `pnpm install && pnpm lint` before starting any new work
- Set up CodeQL scanning and CODEOWNERS file for enhanced security

### Reference Documentation

- **AI Engine Quick Start:** See `AI_ENGINE_QUICKSTART.md` for setup instructions
- **AI Engine Architecture:** See `services/ai-engine/README.md` for detailed technical documentation
- **Core-API Integration:** See `services/core-api/src/lib/ai-client.ts` for integration patterns
