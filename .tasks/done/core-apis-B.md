---
Task ID: B
Feature: Core Feature APIs
Title: Backend - Create Profile & Application CRUD APIs
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective

Develop a comprehensive set of CRUD (Create, Read, Update, Delete) API endpoints in the `core-api` service to manage all user profile data and job applications.

### Context

With the database schema in place (Task A), we now need the API layer to interact with it. These endpoints will be consumed by the frontend to replace all the mock data.

### Key Files to Modify

- **New File**: `services/core-api/src/routes/profile.ts`
- **New File**: `services/core-api/src/routes/applications.ts`
- `services/core-api/src/index.ts` (to register the new routes)

### Instructions for Claude

1.  **Create Profile Management Routes (`profile.ts`)**:
    - Create a new router that handles all data related to a user's profile. All endpoints must be authenticated and operate only on the logged-in user's data.
    - **`GET /api/profile`**: Fetches the complete profile for the current user (from `profiles`, `experiences`, `education` tables).
    - **`PUT /api/profile`**: Updates the user's core profile data (name, headline, etc.).
    - **`POST /api/profile/experience`**: Adds a new work experience.
    - **`PUT /api/profile/experience/:id`**: Updates an existing work experience.
    - **`DELETE /api/profile/experience/:id`**: Deletes a work experience.
    - Implement similar `POST`, `PUT`, `DELETE` endpoints for `education` and `skills`.
2.  **Create Application Management Routes (`applications.ts`)**:
    - Create a new router to handle job application tracking. All endpoints must be authenticated.
    - **`GET /api/applications`**: Fetches all applications for the current user.
    - **`POST /api/applications`**: Adds a new application.
    - **`PUT /api/applications/:id`**: Updates an existing application (e.g., changing its status).
    - **`DELETE /api/applications/:id`**: Deletes an application.
3.  **Register New Routes**:
    - In `services/core-api/src/index.ts`, import and register the new `profileRouter` and `applicationsRouter`.
4.  **Implement Logic**:
    - Use the Supabase client (`supabase-js`) to interact with the database.
    - Ensure all data mutations are validated and that user ownership is respected (relying on RLS policies).
5.  **Testing**:
    - Add integration tests for all new endpoints to ensure they perform the correct database operations and handle authentication properly.

### Acceptance Criteria

- A full set of authenticated CRUD endpoints for profile data (core info, skills, experience, education) is created and functional.
- A full set of authenticated CRUD endpoints for job applications is created and functional.
- All new routes are registered and tested.
- The API layer for managing core user data is complete.
