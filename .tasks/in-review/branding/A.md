---
Task ID: A
Feature: Skills Gap Analysis
Title: Enhance Backend API for Skills Gap Analysis
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: C
---

### Objective

Enhance the core backend API to integrate skills gap analysis data into the job recommendations endpoint. This involves calling the AI Engine's skill analysis service and embedding the results within the API response.

### Context

This is the first step in building the user-facing "Skills Gap Analysis" feature. The frontend (Task B) will consume the data provided by this enhanced endpoint. This task depends on the AI Engine (Task C) exposing a functional endpoint for skill analysis.

### Key Files to Modify

- `services/core-api/src/routes/recommendations.ts` (or equivalent file handling job recommendations)
- `services/core-api/src/lib/ai-client.ts` (or equivalent client for communicating with the AI Engine)
- `shared/types/src/index.ts` (to update the data structures)

### Instructions for Claude

1.  **Update Shared Types**: In `shared/types/src/index.ts`, update the `JobRecommendation` type to include a new optional field, `skillsGap`, which should be an object containing `userSkills`, `requiredSkills`, and `missingSkills` (all likely `string[]`).
2.  **Create AI Engine Client Method**: In `services/core-api/src/lib/ai-client.ts`, add a new method to call the AI Engine's `/skill_gap` endpoint. This method should accept user skills and required job skills as arguments and return the analysis.
3.  **Modify Recommendations Endpoint**:
    - In the main job recommendations route (`services/core-api/src/routes/recommendations.ts`), for each job recommendation being processed:
    - Fetch the current user's skills from their profile.
    - Extract the required skills from the job data.
    - Call the new AI Engine client method with these two sets of skills.
    - Attach the returned `skillsGap` object to the job recommendation object being sent to the frontend.
4.  **Error Handling**: Implement graceful error handling. If the AI Engine call fails, the `skillsGap` field should be `null` or omitted, and the core job recommendation should still be returned without errors.
5.  **Testing**: Add a unit or integration test to verify that the endpoint correctly calls the AI client and returns the `skillsGap` data in the expected format.

### Acceptance Criteria

- The `JobRecommendation` type in `shared/types` is updated to include the `skillsGap` object.
- The job recommendations API endpoint (`/api/recommendations` or similar) successfully enriches each job object with skills gap data from the AI Engine.
- The API gracefully handles potential errors from the AI Engine, ensuring the user still receives job recommendations.
- The changes are covered by tests.
