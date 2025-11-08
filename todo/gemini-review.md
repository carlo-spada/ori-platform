# Gemini Review – Repository Audit

## Pruned Artifacts

- Removed `.next/`, `services/ai-engine/models/__pycache__/`, `shared/types/dist/`, and `services/core-api/dist/` which were committed build outputs/cache. Follow-up: add these paths to `.gitignore` so they do not respawn after every build.

## Bugs to Triage

1. **Applications API is never authenticated** – `services/core-api/src/routes/applications.ts:17-105` never registers `authMiddleware`, yet each handler checks `req.user`. Because `req.user` is always `undefined`, every GET/POST/PATCH request returns 403 even for valid tokens. Apply `authMiddleware` to the router (or wrap individual routes) so Supabase user context is populated before the ownership checks run.
2. **Role recommendation payload mismatch** – `services/ai-engine/main.py:308-325` expects the raw `UserProfile` as the request body, but `services/core-api/src/lib/ai-client.ts:229-247` wraps it as `{ profile: {...} }`. FastAPI will respond with 422 because the top-level keys do not match. Either change the endpoint signature to accept an object with a `profile` key or send the profile object directly from the client.
3. **Learning-path limits ignored** – In `services/ai-engine/main.py:272-299` the `max_paths` argument is declared as a plain integer, so FastAPI treats it as a query parameter. `AIClient.getLearningPaths` (`services/core-api/src/lib/ai-client.ts:199-220`) sends `max_paths` inside the JSON body, so the server always falls back to the default of 5 paths. Bind `max_paths` via `Body(...)` on the server or move it to the query string on the client so callers can actually control the length of the recommendation list.
4. **Job matching filters are a no-op** – `services/core-api/src/routes/jobs.ts:82-112` accepts `filters` (location, workType, salary) from the client but never applies them when querying Supabase. Apart from setting `profile.salary_min`, the filters are ignored, so the UI controls do nothing. Apply the filters to the `jobs` query (e.g., `.eq('work_type', filters.workType)`, `.ilike('location', ...)`, `.gte('salary_min', filters.salaryMin)`) before sending jobs to the AI engine.
5. **404 page uses non-existent translation keys** – `src/app/not-found.tsx:19-31` references `notFound.seo.title`, `notFound.seo.description`, and `notFound.primaryCtaLabel`, but `public/locales/en/translation.json:42-48` only defines `notFound.title`, `notFound.description`, and `notFound.primaryCta`. The page renders the raw key names in every locale. Update the component to use the correct keys (or add the missing entries to every locale file).

## Refactors / Improvements

- **Orphaned authenticated layout** – `src/components/app/AppShell.tsx:5-34` (and the accompanying `SidebarNav`/`BottomNav` components) are never imported anywhere else in the repo, so `/app/*` routes render without the navigation that was designed. Either wire up `AppShell` via `src/app/app/layout.tsx` or remove the dead components to reduce confusion.
- **Tracked build artifacts** – `shared/types/dist/*` and `services/core-api/dist/*` keep showing up in `git status`. After pruning them, add these paths (and `__pycache__` folders) to the root `.gitignore` so future builds don’t dirty the tree.

## Documentation Gaps

- **Missing API base URL** – The frontend client (`src/integrations/api/jobs.ts:76-83`) hard-requires `NEXT_PUBLIC_API_URL`, but `README.md:55-64` never tells contributors to set it. Folks following the README will hit runtime errors immediately. Extend the environment section with the API URL (and, ideally, document the core-api/AI-engine env vars too).
