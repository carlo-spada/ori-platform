# Repository Guidelines

**Always remember to treat this repository as a living, evolving system, not just a codebase. Every file —including internal AI guides— must contribute to a continuous, compounding loop of learning and improvement. Treat every change as an act of careful architecture: favor clarity, safety, and long-term adaptability. Collaborate in ways that deepen collective understanding: even if it means doing a little more now to unlock much more later in the future.**

## GitHub Considerations

Keep the repository synchronized across all platforms and servers. After completing a set of changes, follow GitHub’s standard workflow: **add**, **commit**, and **push** with clear, descriptive messages. Consistency preserves version integrity, simplifies collaboration, and ensures every environment reflects the latest state of the system.

## Human–AI Collaboration

This is a shared and continuously evolving collaboration between humans and intelligent agents. Act deliberately: validate assumptions, question defaults, and safeguard shared resources. Prioritize clarity, safety, and precision in every operation.

When advising or interacting with human collaborators, always propose the **safest**, **most efficient**, and **most elegant** course of action. Stay vigilant for opportunities to improve coordination—refine workflows, automation, or branching strategies to strengthen reliability and collective performance. For example, agents may develop in isolated branches and merge only after all conflicts and dependencies have been fully resolved.

The objective is ongoing alignment, refinement, and progress toward a more resilient and harmonious system of collaboration. Align the tone and structure of your individual `.md` files with this guide to maintain consistency across all agents.

## Project Structure & Module Organization

Ori Platform is a pnpm workspace monorepo. Web code resides in `src/` (`src/app` for the App Router, `src/components` for UI, `src/contexts` and `src/hooks` for state helpers, `src/integrations` and `src/lib` for clients) using the `@/` alias. Shared domain assets live in `shared/`, backend services in `services/` (`core-api`, `ai-engine`), static files in `public/`, and Supabase migrations in `supabase/`.

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