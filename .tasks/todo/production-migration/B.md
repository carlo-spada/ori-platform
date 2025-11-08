---
Task ID: B
Feature: Production Migration
Title: Refactor `core-api` for Serverless Deployment
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective

Refactor the `core-api` Express application to be compatible with Vercel's Serverless Function deployment model.

### Context

To achieve a unified frontend and API deployment, we must move away from a long-running Express server and adapt our API routes to be individually deployable serverless functions. This is a critical code architecture change.

### Key Files to Modify

- `services/core-api/src/index.ts`
- All files in `services/core-api/src/routes/`
- **New Directory**: `api/` in the root of the monorepo.

### Instructions for Claude

1.  **Create Root `api` Directory**:
    - Vercel automatically detects serverless functions in a root-level `api/` directory. Create this directory.
2.  **Refactor API Routes**:
    - For each route file in `services/core-api/src/routes/` (e.g., `chat.ts`, `profile.ts`), create a corresponding file inside the new `api/` directory (e.g., `api/chat.ts`, `api/profile.ts`).
    - Modify each new file to export a default function that is a Vercel-compatible request handler (which is very similar to an Express handler). You can often reuse most of your existing Express route logic.
    - Example for `api/chat.ts`:

      ```typescript
      import { VercelRequest, VercelResponse } from '@vercel/node'
      // ... import your actual logic

      export default function handler(req: VercelRequest, res: VercelResponse) {
        // Your route logic here...
        // e.g., if (req.method === 'GET') { ... }
      }
      ```
3.  **Remove Express Server**:
    - The main `services/core-api/src/index.ts` file that starts the Express server (`app.listen(...)`) is no longer needed for production. You can either delete it or modify it to only run for local development.
4.  **Update `vercel.json` (if needed)**:
    - Create or update the root `vercel.json` file to configure any necessary rewrites, ensuring that requests to `/api/*` are correctly routed to the functions in the `api/` directory. Vercel's default behavior is often sufficient, but you may need to add configuration for more complex routing.

### Acceptance Criteria

- A new `api/` directory exists at the project root.
- The logic from the `core-api` routes has been refactored into Vercel-compatible serverless functions within the `api/` directory.
- The old Express server (`app.listen`) is removed or conditionally disabled for production builds.
- The refactored API is deployable to Vercel.
