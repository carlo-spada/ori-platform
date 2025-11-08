# Repository Guidelines

**Always remember to treat this repository as a living, evolving system, not just a codebase. Every file —including internal AI guides— must contribute to a continuous, compounding loop of learning and improvement. Treat every change as an act of careful architecture: favor clarity, safety, and long-term adaptability. Collaborate in ways that deepen collective understanding: even if it means doing a little more now to unlock much more later in the future.**

## Collaborative Workflow & Branching Strategy

To ensure the `main` branch remains stable and deployable at all times, we will adhere to the following Git workflow. This process is enforced automatically by GitHub branch protection rules.

### Branching Model

The repository uses a **simplified two-branch workflow**:

- **`main`**: Production branch that is automatically deployed to Vercel. It must always be stable and ready for deployment. **Direct pushes to `main` are strictly prohibited** and enforced by GitHub branch protection rules.
- **`dev`**: The working branch where all development happens. All features, fixes, and changes are made here before being merged to `main` via Pull Request.

### Core Development Workflow

All development follows this streamlined sequence:

1.  **Start on Dev**: Always work on the `dev` branch:

    ```bash
    git checkout dev
    git pull origin dev
    ```

2.  **Develop**: Make your changes on the `dev` branch. Commit regularly with clear, conventional commit messages following the format:

    ```bash
    git add .
    git commit -m "feat: add new feature"  # or fix:, chore:, docs:, etc.
    ```

3.  **Push to Dev**: Push your changes to the remote `dev` branch:

    ```bash
    git push origin dev
    ```

4.  **Test Locally**: Before creating a PR, run all essential checks:

    ```bash
    pnpm install
    pnpm lint
    pnpm build
    # pnpm test (when applicable)
    ```

5.  **Create a Pull Request**: When ready to deploy to production, create a PR from `dev` → `main`:
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

- **Pull Requests Required**: All code must enter `main` through a PR from `dev`
- **No Direct Pushes**: Direct pushes to `main` are blocked for everyone
- **Automated CI Checks**: GitHub Actions automatically runs `lint`, `build`, and `test` on every PR
- **Required Approvals**: At least 1 approving review is required
- **Code Owners Review**: Changes to files with designated owners require their approval
- **Conversation Resolution**: All PR conversations must be resolved before merging
- **Signed Commits**: All commits must have verified signatures
- **Linear History**: Merge commits are prevented; use squash or rebase merging
- **CodeQL Scanning**: Code must pass security analysis
- **Copilot Review**: Automatically requests code review on new PRs and pushes
- **Successful Deployment**: Vercel deployment must succeed before PR can merge
- **No Force Pushes**: Force pushes are blocked on `main`
- **No Deletions**: Branch deletion is restricted

## GitHub Considerations

All code changes must be integrated into `main` via Pull Requests from `dev`. Direct pushes to `main` are strictly prohibited and enforced by branch protection rules. Before creating a PR, ensure all local checks pass (`pnpm lint`, `pnpm build`). This workflow preserves version integrity, prevents integration errors, and ensures `main` is always production-ready.

## Project Management Workflow

To ensure clarity, prevent redundant work, and leverage distinct agent strengths, we use a file-based task management system coupled with specialized AI roles. This is the single source of truth for what needs to be done, what is in progress, and what is complete.

### Task Board Integrity

**The file-based task board is the single source of truth for the project's status.** The accuracy of this system is critical for our collaborative workflow. All agents are required to meticulously follow the process of moving task files between their respective stages (`todo`, `in-progress`, `done`, `in-review`, `reviewed`). Failure to do so results in an inaccurate project status, hindering our ability to plan and execute effectively.

### Directory Structure

All tasks are managed within the `.tasks/` directory, which is organized into stage-based subdirectories:

- **`.tasks/todo/`**: Planned tasks and features. Large features ('epics') are represented as subfolders (e.g., `.tasks/todo/feature-name/`), with individual work units as Markdown files inside (e.g., `A.md`).
- **`.tasks/in-progress/`**: Tasks actively being worked on by an agent.
- **`.tasks/done/`**: Tasks that have been implemented by Claude.
- **`.tasks/in-review/`**: Tasks currently under review, debugging, and refactoring by Codex.
- **`.tasks/reviewed/`**: Tasks that have been successfully reviewed by Codex and are ready for final integration.

### Agent Roles & Workflow

1.  **Gemini (Planner & Researcher)**:
    - **Role**: Conducts big-picture research, defines the project vision, and breaks it down into a cohesive, step-by-step plan.
    - **Workflow**: Creates feature folders and task files (`.md`) in the `.tasks/todo/` directory. While most implementation tasks are assigned to Claude, Gemini can assign tasks directly to Codex if the work is primarily refactoring, debugging, or cleanup, playing to each agent's strengths from the start.

2.  **Claude (Implementer & Builder)**:
    - **Role**: Materializes the plans defined by Gemini, focusing on implementation.
    - **Workflow**:
      1.  Claims a task by moving its corresponding file or folder from `.tasks/todo/` to `.tasks/in-progress/`.
      2.  Implements the feature or fix as described in the task file.
      3.  Upon completion, moves the task file/folder to `.tasks/done/` and **updates the assignee in the file to Codex** to signal it's ready for review.

3.  **Codex (Reviewer & Debugger)**:
    - **Role**: Audits the code produced by Claude, identifying bugs, refactoring opportunities, and ensuring quality.
    - **Workflow**:
      1.  Proactively monitors both the `.tasks/done/` directory (for standard reviews) and the `.tasks/todo/` directory (for directly assigned refactor/debug tasks).
      2.  Claims a task by moving it to `.tasks/in-review/`.
      3.  Performs debugging and refactoring.
      4.  Once the review is complete, moves the task file/folder to `.tasks/reviewed/`.

4.  **Carlo (Integrator & Releaser)**:
    - **Role**: Performs the final review and merges the completed feature into the `main` branch.
    - **Workflow**: Once an entire feature's tasks are in the `.tasks/reviewed/` directory, Carlo will merge the feature branch into `main` for release.

This structured process ensures a clear separation of duties, maintains code quality, and provides a transparent, real-time view of the project's status.

## Agent Responsibilities & Best Practices

### UI/UX Development Workflow using v0.dev

To accelerate development and maintain a high standard of user experience, this project has adopted **v0.dev** as the primary tool for creating new UI components.

1.  **Standard Practice**: For any task involving the creation of new UI, the assigned agent will first use v0.dev to generate the component code. The generated code, which is compatible with our Next.js, Tailwind CSS, and shadcn/ui stack, should then be integrated and adapted as needed.
2.  **Proactive Agent Suggestion**: When a human user requests the development of a UI/UX component, all AI agents are required to first suggest using v0.dev for the task. This ensures the user is aware of our most efficient workflow before work begins.

### Version Control Discipline

**CRITICAL:** All agents must maintain strict version control discipline to ensure the repository remains synchronized and changes are never lost.

#### 1. Commit & Push Frequently

**Required behavior for all agents:**

- **Commit and push changes immediately after completing each task**
- **When working with `.tasks/` files**: Commit and push **after moving each task file** between directories (todo → in-progress → done/in-review → reviewed)
- **When editing code**: Commit and push **after completing each logical unit of work** (e.g., implementing a single function, fixing a single bug, adding a single feature)
- **Minimum requirement**: Push **at least once per task/file edit** in the `.tasks/` folder

#### 2. Commit Message Format

Follow these patterns for task management:

```bash
# When claiming a task
git add .tasks/
git commit -m "chore(tasks): claim task A.md for implementation"
git push origin dev

# When implementing changes
git add .
git commit -m "feat: implement feature X as per task A.md"
git push origin dev

# When completing a task
git add .tasks/
git commit -m "chore(tasks): move A.md to done"
git push origin dev
```

#### 3. Documentation Updates

**After every major change**, agents MUST update:

- **`README.md`**: If the change affects installation, setup, project structure, or user-facing features
- **`AGENTS.md`**: If the change affects workflows, development processes, or introduces new patterns
- **Agent-specific `.md` files**:
  - **Claude**: Update `CLAUDE.md` if implementation patterns or tool usage changes
  - **Gemini**: Update `GEMINI.md` if planning strategies or research methods evolve
  - **Codex**: Update relevant documentation if review processes change

#### 4. What Constitutes a "Major Change"

A change is considered "major" if it involves:

- Adding or removing a service/package
- Changing the build or deployment process
- Modifying the branching strategy or git workflow
- Adding new development commands or scripts
- Updating dependencies that affect setup or configuration
- Implementing a new feature that affects how developers work with the codebase
- Changing authentication, payment, or core integrations
- Modifying the project structure or file organization

#### 5. Documentation Update Workflow

After implementing a major change, follow this sequence:

```bash
# Step 1: Commit code changes
git add .
git commit -m "feat: implement new feature"
git push origin dev

# Step 2: Update relevant documentation
git add README.md AGENTS.md CLAUDE.md  # or whichever files need updates
git commit -m "docs: update guides to reflect new feature implementation"
git push origin dev

# Step 3: Move task to completion
git add .tasks/
git commit -m "chore(tasks): complete task A.md"
git push origin dev
```

#### 6. Why This Matters

- **Prevents Work Loss**: Frequent commits ensure no work is lost due to crashes, network issues, or conflicts
- **Maintains Synchronization**: Regular pushes keep all agents (human and AI) working from the same source of truth
- **Enables Collaboration**: Up-to-date documentation allows agents to understand changes made by others
- **Provides Audit Trail**: Clear commit history makes it easy to track progress and debug issues
- **Supports Rollbacks**: Small, focused commits make it easier to revert specific changes if needed
- **Preserves Context**: Future agents can understand the reasoning behind changes through documentation

**Remember**: The repository is a living system. Your commits and documentation updates are how you communicate with future agents (including yourself). Be thorough, be frequent, and be clear.

## Project Structure & Module Organization

Ori Platform is a pnpm workspace monorepo. Web code resides in `src/`, backend API code in `api/`, and shared packages in `shared/`.

- **`api/`**: Production **Vercel Serverless Functions** that serve as the project's backend.
- **`src/`**: The **Next.js** application that serves as the main user interface.
- **`services/`**: Supporting backend services.
  - `core-api`: A local-only Express server that mirrors the serverless functions for development.
  - `ai-engine`: The Python/FastAPI service for all AI-powered features.
- **`shared/`**: Shared packages (e.g., types, utils) used across the monorepo.

**AI Engine (Nov 2025):** Fully implemented Python FastAPI service providing semantic job matching, skill gap analysis, and learning path generation. Uses sentence-transformers for local embedding generation (no API keys required). Multi-factor scoring algorithm weights semantic similarity (40%), skill match (30%), experience (15%), location (10%), and salary (5%). Core-api integrates via HTTP client with graceful fallback.

## Build, Test, and Development Commands

- `pnpm install` — install workspace dependencies (avoid mixing npm/yarn).
- `pnpm dev` — launch the Next.js app at `http://localhost:3000`. This also serves the API routes from the `api/` directory.
- `pnpm dev:api` or `pnpm --filter @ori/core-api dev` — run the local-only Express.js server for API development at `http://localhost:3001`.
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

- **CI Consolidation (Jan 2025):** Merged `verify.yml` and `auto-pr-review.yml` into a single, efficient `pull-request-ci.yml` to accelerate PR checks.
- **Branch Rename (Jan 2025):** Simplified working branch from `development` to `dev` for cleaner workflow commands
- **Lint & Build Fixes (Jan 2025):** Resolved all TypeScript strict mode violations and React purity issues in dashboard and test files
- **CI/CD Updates (Jan 2025):** Updated GitHub workflows to use pnpm v10 for lockfile compatibility
- **AI Engine (Nov 2025):** Fully implemented Python FastAPI service with semantic matching, skill gap analysis, learning paths, and core-api integration
- **Branch Simplification (Nov 2025):** Migrated from multi-agent branch structure to streamlined `main`/`dev` workflow with comprehensive branch protection
- **Automated Reviews:** Integrated Copilot code review for all PRs with automatic push reviews

### Immediate Next Steps

- Ensure `AGENTS.md` and `CLAUDE.md` stay synchronized with workflow changes
- Run `pnpm install && pnpm lint` before starting any new work
- Set up CodeQL scanning and CODEOWNERS file for enhanced security

### Reference Documentation

- **AI Engine Quick Start:** See `AI_ENGINE_QUICKSTART.md` for setup instructions
- **AI Engine Architecture:** See `services/ai-engine/README.md` for detailed technical documentation
- **Core-API Integration:** See `services/core-api/src/lib/ai-client.ts` for integration patterns
