---
Task ID: B
Feature: Skills Gap Analysis
Title: Implement Backend Logic for Job Matching and Skills Gap Analysis
Assignee: Claude (Implementer & Builder)
Status: Done
---

### Objective
Replace the mock implementation in the job matching API endpoint with real logic to calculate job match scores and perform skills gap analysis based on user profiles and job requirements.

### Context
The `POST /api/jobs/find-matches` endpoint currently returns mock data. This task involves implementing the core backend logic to fetch user skills and job requirements, calculate a match score, and generate a detailed skills analysis for each recommended job.

### Key Files to Modify
- `services/core-api/src/routes/jobs.ts`
- Potentially `services/core-api/src/lib/` for new utility functions if needed.

### Instructions for Claude
1.  **Locate and Modify `POST /find-matches` Endpoint:**
    *   Open `services/core-api/src/routes/jobs.ts`.
    *   Identify and remove the existing mock data generation logic within the `POST /find-matches` handler.
2.  **Fetch User Profile:**
    *   Retrieve the authenticated user's profile from the database. This profile will contain the user's `skills` (as `string[]`) and `goal` (as `string`).
    *   Ensure you handle cases where the user profile or skills might be missing.
3.  **Fetch Jobs:**
    *   Fetch a relevant set of jobs from the `jobs` table. Consider adding basic filtering (e.g., by location, work type) if the user's profile provides such preferences. For V1, fetching all jobs is acceptable if performance is not an immediate concern.
4.  **Implement Job Matching Logic (V1):**
    *   For each fetched job, compare its `requirements` (as `string[]`) with the user's `skills` (from their profile).
    *   Calculate a `match_score` (a number, e.g., 0-100). A simple V1 algorithm could be: `(number of matching skills / total number of job requirements) * 100`. Consider case-insensitivity and partial matches if feasible.
    *   Filter and select the top 5-10 matched jobs based on this score.
5.  **Implement Skills Gap Analysis:**
    *   For each of the top matched jobs, perform a detailed skills analysis:
        *   Iterate through the job's `requirements`.
        *   For each requirement, determine if the user possesses that skill (i.e., if it's present in the user's `skills` array).
        *   Construct an array of `Skill` objects (as defined in `shared/types/src/index.ts` in Task A), where each `Skill` object has a `name` and a `status` (`'matched'` or `'missing'`).
6.  **Construct API Response:**
    *   The API should return an array of `JobMatch` objects.
    *   Each `JobMatch` object must include the calculated `match_score` and the `skills_analysis` array populated from the previous step.
    *   Ensure the response adheres to the `JobMatch` interface defined in `shared/types/src/index.ts`.

### Acceptance Criteria
-   The `POST /api/jobs/find-matches` endpoint no longer returns mock data.
-   The endpoint successfully fetches user skills and job requirements from the database.
-   A `match_score` is calculated for each job based on skill overlap.
-   A `skills_analysis` array (conforming to `Skill[]` type) is generated for each recommended `JobMatch`.
-   The API response is an array of `JobMatch` objects, including `match_score` and `skills_analysis`.
-   All new code adheres to project coding standards (linting, TypeScript strictness).
-   Basic error handling is in place (e.g., if user profile not found).
