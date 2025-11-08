---
Task ID: D
Feature: Core Feature APIs
Title: Frontend - Integrate Dashboard with Real Data
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: C
---

### Objective
Make the main dashboard dynamic by creating new aggregate API endpoints and connecting the dashboard components to them.

### Context
The dashboard is the user's home base. It currently shows mock data for key stats and recent activity. This task will make it a true, personalized reflection of the user's current status.

### Key Files to Modify
- `src/app/app/dashboard/page.tsx`
- `services/core-api/src/routes/dashboard.ts` (new file)
- `services/core-api/src/index.ts`

### Instructions for Claude
1.  **Create Dashboard API Endpoint**:
    *   In the `core-api`, create a new route: `GET /api/dashboard`.
    *   This endpoint should perform several database queries to aggregate data for the logged-in user:
        *   **Quick Stats**: Count the number of active applications, job recommendations, and skills. Calculate profile completion percentage.
        *   **Recent Activity**: Fetch a list of the user's most recent actions (e.g., last 5 applications added, skills added). This may require a new `activity_feed` table or a complex query across multiple tables.
    *   Return all of this data in a single, structured response.
2.  **Refactor the Dashboard Page (`/app/dashboard`)**:
    *   Remove the mock data for `QuickStats` and `RecentActivity`.
    *   Create a new API client function and `useQuery` hook to fetch data from the `/api/dashboard` endpoint.
    *   Pass the real data from the query to the `QuickStats` and `RecentActivity` components.
    *   Ensure a graceful loading state is handled for the entire dashboard.

### Acceptance Criteria
-   A new `GET /api/dashboard` endpoint exists and returns aggregated data for stats and recent activity.
-   The dashboard page is refactored to fetch data from this endpoint.
-   The `QuickStats` and `RecentActivity` components display real, personalized data for the logged-in user.
-   All mock data is removed from the dashboard page.
