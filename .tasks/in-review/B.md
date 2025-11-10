---
Task ID: B
Feature: Skills Gap Analysis
Title: Frontend Component Creation and Integration
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective
Create and integrate the necessary frontend components to display skills gap analysis data on the job recommendations page. This involves building a new component to visualize the analysis and connecting it to the backend API.

### Context
This task focuses on the UI implementation for the "Skills Gap Analysis" feature. It depends on the backend API (Task A) providing the necessary `skillsGap` data. The final UI/UX polish will be handled in Task D.

### Key Files to Modify
- `src/app/app/recommendations/page.tsx`
- `src/components/recommendations/JobRecommendationCard.tsx`
- **New File**: `src/components/recommendations/SkillsGapDisplay.tsx`
- `src/lib/react-query.ts` (or equivalent file for data fetching hooks)

### Instructions for Claude
1.  **Create `SkillsGapDisplay.tsx` Component**:
    *   Create a new file at `src/components/recommendations/SkillsGapDisplay.tsx`.
    *   This component should accept a `skillsGap` object (containing `userSkills`, `requiredSkills`, `missingSkills`) as a prop.
    *   Render the "missing skills" in a clear and user-friendly way. For example, display them as a list of badges.
    *   You can also visually distinguish between skills the user has and skills that are required but missing.
    *   Focus on structure and functionality; final styling will be done in Task D.
2.  **Update Data Fetching Logic**:
    *   In the relevant data fetching hook (e.g., using React Query), ensure the query to the job recommendations endpoint is correctly typed to expect the new `skillsGap` data.
3.  **Integrate into `JobRecommendationCard.tsx`**:
    *   Modify `src/components/recommendations/JobRecommendationCard.tsx` to import and render the new `SkillsGapDisplay` component.
    *   Pass the `skillsGap` data from the job recommendation object to the component.
    *   Conditionally render the `SkillsGapDisplay` component only if the `skillsGap` data is present in the API response.
4.  **Update Recommendations Page**:
    *   Ensure the main recommendations page at `src/app/app/recommendations/page.tsx` correctly passes the data down to the `JobRecommendationCard` components. No major changes should be needed here if props are passed through correctly.

### Acceptance Criteria
-   The `SkillsGapDisplay.tsx` component is created and can render skills gap data passed to it.
-   The frontend data fetching logic is updated to include the `skillsGap` object.
-   `JobRecommendationCard.tsx` successfully integrates and conditionally renders the `SkillsGapDisplay` component.
-   The recommendations page displays the skills gap information for each job card where the data is available.
