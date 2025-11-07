# Repository Guidelines

## GitHub Considerations

Always keep the repository synchronized across all platforms and servers. After completing a set of changes, follow GitHub’s standard workflow: add, commit, and push your updates using clear messages and consistent practices. This ensures version integrity and collaboration reliability across environments.

## Project Structure & Module Organization
Ori Platform is a pnpm workspace monorepo. Web code lives in `src/` (`src/app` App Router, `src/components` UI, `src/contexts`/`src/hooks` state helpers, `src/integrations`/`src/lib` clients) using the `@/` alias. Shared domain assets sit in `shared/`, backend services in `services/` (`core-api`, `ai-engine`), static files in `public/`, and Supabase migrations in `supabase/`.

## Build, Test, and Development Commands
- `pnpm install` — install workspace dependencies (never mix npm/yarn).
- `pnpm dev` — start the Next.js app at `http://localhost:3000`.
- `pnpm dev:api` or `pnpm --filter @ori/core-api dev` — run the core API with hot reload.
- `pnpm build && pnpm start` — create and serve the production bundle.
- `pnpm lint` — enforce the Next.js core-web-vitals ESLint config.
- `pnpm turbo test --filter=<package>` — execute package-specific tests; writes coverage to `coverage/`.

## Coding Style & Naming Conventions
TypeScript strict mode is on; keep components explicitly typed and favor composition. Use 2-space indentation, single quotes, trailing semicolons, PascalCase components, camelCase hooks/utilities, SCREAMING_SNAKE_CASE env keys, and order Tailwind classes layout → color → state. Run `pnpm lint --fix` before committing.

## Testing Guidelines
Co-locate `*.test.tsx`/`*.spec.ts` UI tests (React Testing Library + Vitest/Jest) and cover `services/core-api` endpoints with supertest integration tests. Python agents add pytest suites in `services/ai-engine/tests` and mock Supabase/Stripe/HTTP clients. Before each PR run `pnpm lint` and the relevant `pnpm turbo test --filter ...`, and refresh Supabase migrations whenever the schema changes.

## Commit & Pull Request Guidelines
History follows Conventional Commits (`feat:`, `fix:`, `chore:` etc.); keep scopes tight (e.g., `feat(core-api): add billing limits`). In PRs, describe the change, link issues via `Closes #123`, enumerate new env vars/migrations, and attach screenshots or Looms for UI updates. Confirm local lint/tests in the PR checklist, request reviewers from each affected surface (web, API, AI engine), and note any rollout or follow-up steps.

## Security & Configuration Tips
Secrets live in untracked `.env.local` (web) or service-specific `.env`; seed them from vaults or `.env.example` and never commit. Stripe keys, Supabase URLs, and AI model tokens are required for `pnpm dev`. Database work flows through `supabase/migrations`/`supabase/config.toml`; document any new credential setup in your PR so teammates can reproduce the environment.

## Guide Maintenance
Treat this document as the common playbook: whenever you ship a major feature, infra change, or new workflow, update the relevant sections here and reference the PR so every agent stays in sync.
