---
Task ID: C
Feature: Skills Gap Analysis
Title: Integrate Frontend with Backend API for Job Recommendations
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Connect the `recommendations` page to the live backend API (`POST /api/jobs/find-matches`) to display real job recommendations and skills gap analysis data, replacing the current mock data.

### Context
The `src/app/app/recommendations/page.tsx` currently uses mock data. This task involves setting up data fetching using `react-query` to consume the `POST /api/jobs/find-matches` endpoint (implemented in Task B) and passing the retrieved `JobMatch` data, including `skills_analysis`, to the `JobRecommendationCard` component.

### Key Files to Modify/Create
- `src/integrations/api/jobs.ts` (new file for API client functions)
- `src/app/app/recommendations/page.tsx`
- `src/components/recommendations/JobRecommendationCard.tsx` (to consume real data)

### Instructions for Claude
1.  **Create API Client Function:**
    *   Create a new file: `src/integrations/api/jobs.ts`.
    *   Inside this file, create an asynchronous function (e.g., `fetchJobRecommendations`) that makes a `POST` request to `/api/jobs/find-matches`.
    *   This function should accept any necessary parameters (e.g., user ID, filters) and return a `Promise<JobMatch[]>`.
    *   Consider using `react-query`'s `useQuery` or `useMutation` hook for data fetching and state management within this file or directly in the page component.
2.  **Modify `recommendations/page.tsx`:**
    *   Open `src/app/app/recommendations/page.tsx`.
    *   Remove the `MOCK_JOB_RECOMMENDATIONS` constant.
    *   Implement data fetching using the `fetchJobRecommendations` function (and `react-query` hook if applicable).
    *   Handle loading states (e.g., display a spinner or skeleton loader while data is being fetched).
    *   Handle error states (e.g., display an error message if the API call fails).
    *   Pass the actual `JobMatch[]` data received from the API to the `JobRecommendationCard` components. Ensure the `skills_analysis` property is correctly passed down.
3.  **Update `JobRecommendationCard.tsx`:**
    *   Modify `src/components/recommendations/JobRecommendationCard.tsx` to accept a `JobMatch` object (which now includes `skills_analysis`) as its `job` prop.
    *   Remove any temporary mock data integration for `SkillsGapDisplay` (from Task A).
    *   Pass the real `job.skills_analysis` to the `SkillsGapDisplay` component.

### Acceptance Criteria
-   `src/integrations/api/jobs.ts` contains a function to fetch job recommendations from the backend API.
-   `src/app/app/recommendations/page.tsx` successfully fetches and displays real job recommendation data from the API.
-   The `MOCK_JOB_RECOMMENDATIONS` constant is removed from `page.tsx`.
-   Loading and error states are handled gracefully on the recommendations page.
-   `JobRecommendationCard.tsx` correctly receives and displays `JobMatch` data, including the `skills_analysis` via the `SkillsGapDisplay` component.
-   All new code adheres to project coding standards (linting, TypeScript strictness).
