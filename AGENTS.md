# Repository Guidelines

**Always remember to treat this repository as a living, evolving system, not just a codebase. Every file —including internal AI guides— must contribute to a continuous, compounding loop of learning and improvement. Treat every change as an act of careful architecture: favor clarity, safety, and long-term adaptability. Collaborate in ways that deepen collective understanding: even if it means doing a little more now to unlock much more later in the future.**

## Collaborative Workflow & Branching Strategy

To ensure the `main` branch remains stable and deployable at all times, we will adhere to the following Git workflow. This process is enforced automatically by GitHub branch protection rules.

### Branching Model

*   **`main`**: This is the production branch. It must always be stable and ready for deployment. **Direct pushes to `main` are disabled.**
*   **Agent Branches**: Each agent will perform their work on a dedicated, long-lived branch.
    *   Gemini's branch: `gemini-branch`
    *   Claude's branch: `claude-branch`
    *   Codex's branch: `codex-branch`

The human supervisor will not have a dedicated branch and will instead assist agents on their respective branches.

### Core Development Workflow

All development must follow this sequence to ensure compatibility and stability:

1.  **Sync with `main`**: Before starting new work, always update your personal branch with the latest changes from `main`:
    ```bash
    git checkout <your-agent-branch>
    git pull origin main
    ```
2.  **Develop**: Work on your task on your agent branch. Commit changes regularly with clear, conventional commit messages.
3.  **Prepare for Merge (Compatibility Check)**: When your work is complete, you **must** sync with `main` again to resolve any potential conflicts locally *before* creating a Pull Request.
    ```bash
    # Fetch the latest changes from the main branch
    git fetch origin main
    
    # Rebase your changes on top of the latest main branch
    git rebase origin/main
    ```
4.  **Test Locally**: After a successful rebase, run all essential checks to guarantee your changes are compatible with the latest code from `main`:
    ```bash
    pnpm install
    pnpm lint
    pnpm build
    # pnpm test (when applicable)
    ```
5.  **Create a Pull Request**: Once all local checks pass, push your branch and open a Pull Request to merge your branch into `main`. The PR description should clearly explain the changes.

### Enforcement & Automation

This workflow is not just a guideline; it is enforced by the repository's configuration:
*   **Pull Requests (PRs) are Required**: All code must enter the `main` branch through a PR.
*   **Automated CI Checks**: A GitHub Actions workflow automatically runs `lint`, `build`, and `test` commands on every PR. The PR cannot be merged unless all checks pass.
*   **Code Review**: At least one other agent or the human supervisor must review and approve a PR before it can be merged.

### Branch Sync Agent

`main` is the single source of truth. To prevent the agent branches from drifting away from the latest production-ready commits, a dedicated workflow (`.github/workflows/branch-sync-agent.yml`) runs every six hours, on every push to `main`, and on manual dispatch. The workflow executes `scripts/branch-sync-agent.js` which reads `agents/branch-sync.config.json` and merges `origin/main` into `codex-branch`, `claude-branch`, and `gemini-branch` sequentially. If it creates new merges it pushes them back upstream; if a merge conflict happens the workflow aborts, records the failure in the step summary, and exits non-zero so humans can resolve the conflict directly on the affected branch. You can run the same logic locally with `node scripts/branch-sync-agent.js`.

## GitHub Considerations

All code changes must be integrated into the `main` branch via Pull Requests (PRs) from an agent's dedicated branch. Direct pushes to `main` are disabled. Before creating a PR, ensure your branch is up-to-date with `main` and passes all local checks. This workflow preserves version integrity, prevents integration errors, and ensures the `main` branch is always stable.

## Human–AI Collaboration

This is a shared and continuously evolving collaboration between humans and intelligent agents. Act deliberately: validate assumptions, question defaults, and safeguard shared resources. Prioritize clarity, safety, and precision in every operation.

When advising or interacting with human collaborators, always propose the **safest**, **most efficient**, and **most elegant** course of action. Stay vigilant for opportunities to improve coordination—refine workflows, automation, or branching strategies to strengthen reliability and collective performance. For example, agents may develop in isolated branches and merge only after all conflicts and dependencies have been fully resolved.

The objective is ongoing alignment, refinement, and progress toward a more resilient and harmonious system of collaboration. Align the tone and structure of your individual `.md` files with this guide to maintain consistency across all agents.

## Project Management: The Task-as-File System

To ensure clarity and prevent redundant work, we use a file-based task management system. This is the single source of truth for what needs to be done, what is in progress, and what is complete.

### Directory Structure
All tasks are managed within the `.tasks/` directory, which is organized into three stage-based subdirectories:
-   **`.tasks/todo/`**: Contains features or tasks that are planned but not yet started. Large features ('epics') should correspond to a subfolder within this directory (e.g., `.tasks/todo/feature-name/`). Each smaller, independent work unit related to that feature will be an individual Markdown file within that folder (e.g., `A.md`, `B.md`). Standalone tasks can be individual Markdown files directly in `todo/`.
-   **`.tasks/in-progress/`**: Contains files or entire feature subfolders that are actively being worked on.
-   **`.tasks/done/`**: A record of all completed tasks and features.

### Workflow
All agents must adhere to the following workflow before, during, and after their work.

1.  **Review the Board**: Before starting any new work, an agent must review the contents of the `.tasks/` subdirectories to understand the current state of the project.
2.  **Claim a Task**: To begin work on a task, an agent **moves** the corresponding task file or feature folder from `.tasks/todo/` to `.tasks/in-progress/`. This is a critical, atomic step to claim ownership and prevent multiple agents from working on the same task.
    ```bash
    # Example: Claiming task 'A.md'
    mv .tasks/todo/A.md .tasks/in-progress/A.md
    # Example: Claiming feature 'feature-name/'
    mv .tasks/todo/feature-name/ .tasks/in-progress/feature-name/
    ```
3.  **Update Task File**: The agent should then edit the task file (or a central `README.md` within a feature folder) to add their name to the `Assignee` field.
4.  **Perform the Work**: The agent works on their task, following the instructions within the task file.
5.  **Complete a Task**: Upon completion and successful merging of the work, the agent moves the task file or feature folder from `.tasks/in-progress/` to `.tasks/done/`.

This system minimizes merge conflicts and provides a clear, real-time view of the project's status.

### Agent Roles (Initial Draft)

To leverage distinct strengths and optimize collaboration, we are experimenting with specialized roles for each AI agent:

*   **Gemini (Planner & Researcher)**:
    *   **Focus**: Condensing large amounts of information, researching novel ideas or solutions, and designing actionable implementation plans.
    *   **Role**: Outlines *what* to do and *why*. Creates the initial task files and feature folders.

*   **Claude (Implementer & Builder)**:
    *   **Focus**: Executing the plans generated by Gemini with precision and creativity.
    *   **Role**: Focuses on *how* to build or implement the feature in code or documentation, while maintaining coherence and consistency.

*   **Codex (Reviewer & Debugger)**:
    *   **Focus**: Auditing the code or artifacts produced by Claude.
    *   **Role**: Identifies bugs, potential conflicts with the existing `main` branch, or opportunities for improvement. Codex should attempt to fix simple issues autonomously; for more complex cases, it should report them back to Gemini (for strategy) or Claude (for implementation).

These roles are not fixed and will adapt as we test and learn from the workflow.

### Branch Access Boundaries

- Each agent must work exclusively inside their own local clone (`./codex-branch`, `./gemini-branch`, `./claude-branch`). Creating, editing, or deleting files in another agent’s workspace is prohibited.
- Cross-branch changes (for example, updates that must appear in every AGENTS.md) require a handoff: notify the supervisor or the owning agent to perform the change, or coordinate an explicit automation step.
- Shared artifacts should flow through the human supervisor (or dedicated sync scripts) so accountability for each workspace remains clear and audit-able.
- If an agent accidentally edits outside their folder, revert locally and inform the affected agent before proceeding.

## Project Structure & Module Organization

Ori Platform is a pnpm workspace monorepo. Web code resides in `src/` (`src/app` for the App Router, `src/components` for UI, `src/contexts` and `src/hooks` for state helpers, `src/integrations` and `src/lib` for clients) using the ` @/` alias. Shared domain assets live in `shared/`, backend services in `services/` (`core-api`, `ai-engine`), static files in `public/`, and Supabase migrations in `supabase/`.

## Build, Test, and Development Commands

- `pnpm install` — install workspace dependencies (avoid mixing npm/yarn).
- `pnpm dev` — launch the Next.js app at `http://localhost:3000`.
- `pnpm dev:api` or `pnpm --filter @ori/core-api dev` — run the core API with hot reload.
- `pnpm build && pnpm start` — compile and serve the production build.
- `pnpm lint` — enforce the Next.js core-web-vitals ESLint configuration.
- `pnpm turbo test --filter=<package>` — run package-specific tests; coverage output is written to `coverage/`.

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

### Documentation Maintenance Schedule

To ensure `AGENTS.md` and each agent's individual `.md` file (e.g., `GEMINI.md`, `CLAUDE.md`, `CODEX.md`) remain accurate, consistent, and up-to-date, a weekly refactoring and synchronization schedule is in place:

*   **Gemini**: Refactor and update on **Mondays** (or the next working day if Monday is not a working day).
*   **Claude**: Refactor and update on **Wednesdays**.
*   **Codex**: Refactor and update on **Fridays**.

All agents must follow the same standards and recommendations when performing these updates. This ensures continuous alignment and quality across all documentation.

### Initial Work Split Suggestion - by Codex on the 7/11/25

- **codex-branch**: Own TypeScript-heavy core work (Next.js app, shared hooks, build tooling), rapid debugging loops, and schema-aware migrations when paired with Supabase notes.
- **gemini-branch**: Focus on exploratory or net-new UX and AI-facing experiences across `src/components`, `src/app`, and `src/integrations`, where broad design ideation and multi-file patterning matter.
- **claude-branch**: Drive long-form reasoning tasks—config coordination, backend contract updates in `services/`, and documentation refreshes that keep cross-cutting changes coherent.
- **Cross-branch guardrails**: Sequence dependent tasks `claude ➝ codex ➝ gemini` (API contract → implementation → UI polish) and schedule weekly rebases on `main` after each PR merge to minimize conflicts.
- **Immediate next steps**: Curate the upcoming sprint backlog into codex/gemini/claude columns with clear owners, and have every agent run `pnpm install && pnpm lint` inside their clone to ensure environment parity before starting.