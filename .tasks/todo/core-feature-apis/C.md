---
Task ID: C
Feature: Core Feature APIs
Title: Frontend - Integrate Profile & Applications Pages with APIs
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: B
---

### Objective
Refactor the Profile and Applications pages to be fully dynamic by removing all mock data and integrating them with the new backend APIs.

### Context
This is a major step in making the application real. It involves wiring up the existing UI components to fetch, display, and update live user data, replacing all the `useState`-based mock data.

### Key Files to Modify
- `src/app/app/profile/page.tsx`
- `src/app/app/applications/page.tsx`
- `src/lib/react-query.ts` (or a new API client file)

### Instructions for Claude
1.  **Create API Client Functions**:
    *   Create typed functions for interacting with all the new endpoints defined in Task B (e.g., `fetchUserProfile`, `addExperience`, `updateApplicationStatus`).
2.  **Refactor the Profile Page (`/app/profile`)**:
    *   Remove all `useState` calls that hold mock profile data (skills, experiences, etc.).
    *   Use `useQuery` from React Query to fetch the user's complete profile data.
    *   Use `useMutation` for all data-changing operations (adding/updating/deleting skills, experiences, etc.).
    *   Implement optimistic updates where possible to make the UI feel fast.
    *   Wire up the forms and buttons to call the mutation functions.
    *   Ensure loading and error states are handled gracefully.
3.  **Refactor the Applications Page (`/app/applications`)**:
    *   Remove the `MOCK_APPLICATIONS` array and the corresponding `useState`.
    *   Use `useQuery` to fetch the user's job applications.
    *   Use `useMutation` to handle status updates and deletions.
    *   Connect the `ApplicationTable` component to the data from `useQuery`.
    *   Enable the "Add Application" button and connect it to a form/modal that uses a mutation to create a new application.

### Acceptance Criteria
-   The Profile page is fully powered by real data from the backend. All user profile information is persistent across reloads.
-   The Applications page is fully powered by real data. Users can add, update, and delete applications, and the changes are persisted.
-   All mock data is removed from these pages.
-   React Query is used for all data fetching and mutations, including handling of loading and error states.
