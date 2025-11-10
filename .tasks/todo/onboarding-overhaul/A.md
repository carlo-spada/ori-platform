---
Task ID: A
Feature: Onboarding Overhaul
Title: Backend - Create User Profile API Endpoint
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Create a new, secure API endpoint in the `core-api` service that accepts the onboarding data, validates it, and creates or updates a user's profile in the Supabase database.

### Context
The current onboarding flow is a frontend-only mock. This task creates the necessary backend infrastructure to persist the user's collected information. This is the foundational step for the entire onboarding overhaul.

### Key Files to Modify
- **New File**: `services/core-api/src/routes/profile.ts` (or similar)
- `services/core-api/src/index.ts` (to register the new route)
- `shared/types/src/index.ts` (to potentially refine the `OnboardingData` type for the backend)
- `supabase/migrations/` (a new migration might be needed if the `profiles` table is insufficient)
- `services/core-api/.env.example`

### Instructions for Claude
1.  **Review Database Schema**:
    *   Examine the existing `profiles` table in Supabase.
    *   Identify if new columns are needed to store the onboarding data (e.g., `headline`, `location`, `skills`, `long_term_vision`, `target_roles`).
    *   If necessary, create a new Supabase migration to alter the `profiles` table. `skills` and `target_roles` should likely be stored as `jsonb` or `text[]` arrays.
2.  **Create the API Route**:
    *   Create a new route file (e.g., `services/core-api/src/routes/profile.ts`).
    *   Define a `POST` or `PUT` endpoint, for example, `/api/profile/onboarding`.
    *   This endpoint must be authenticated. It should only allow a user to update their own profile. Use Supabase Auth to get the user's ID from the session.
3.  **Implement Endpoint Logic**:
    *   The endpoint should receive the `OnboardingData` in its request body.
    *   Perform backend validation on the incoming data (e.g., check for required fields, string lengths).
    *   Write the logic to `upsert` (insert or update) the data into the user's row in the `profiles` table, identified by their authenticated user ID.
    *   On success, return a `200 OK` response with the updated profile data.
4.  **Register the Route**:
    *   Import and register the new profile router in the main `index.ts` of the `core-api` service.
5.  **Environment Variables**:
    *   Ensure any new required environment variables (e.g., Supabase URL/keys if not already present) are added to `.env.example`.
6.  **Testing**:
    *   Add integration tests for the new endpoint to verify that it correctly validates data, handles authentication, and updates the database as expected.

### Acceptance Criteria
-   A new, authenticated API endpoint (`/api/profile/onboarding` or similar) exists in the `core-api`.
-   The endpoint correctly validates and persists onboarding data to the Supabase `profiles` table.
-   The database schema is updated via a migration if necessary.
-   The endpoint is protected and can only be called by an authenticated user to update their own profile.
-   The new endpoint is covered by tests.