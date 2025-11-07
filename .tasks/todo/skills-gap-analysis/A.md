---
Task ID: A
Feature: Skills Gap Analysis
Title: Enhance Shared Types & Create SkillsGapDisplay UI Component
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Create the foundational data types for skill analysis and develop a reusable React component to visually represent a user's skills against job requirements. This task is independent and can be started immediately.

### Context
The 'Skills Gap Analysis' feature requires a clear way to define and display individual skills, indicating whether they match a user's profile or are missing for a specific job. The existing `shared/types` package is the central place for data contracts, and `src/components/recommendations` is where related UI components reside.

### Key Files to Modify/Create
- `shared/types/src/index.ts`
- `src/components/recommendations/SkillsGapDisplay.tsx`
- `src/components/recommendations/JobRecommendationCard.tsx` (for temporary integration)

### Instructions for Claude
1.  **Define `Skill` Interface:**
    *   In `shared/types/src/index.ts`, add a new exported interface `Skill` with the following properties:
        ```typescript
        export interface Skill {
          name: string;
          status: 'matched' | 'missing'; // Indicates if the user has this skill for the job
        }
        ```
2.  **Update `JobMatch` Interface:**
    *   In `shared/types/src/index.ts`, modify the existing `JobMatch` interface to include a new property:
        ```typescript
        export interface JobMatch extends Job {
          // ... existing properties ...
          skills_analysis?: Skill[]; // Array of skills with their match status
        }
        ```
3.  **Create `SkillsGapDisplay` Component:**
    *   Create a new file: `src/components/recommendations/SkillsGapDisplay.tsx`.
    *   This component should be a functional React component that accepts `skills: Skill[]` as a prop.
    *   For each `Skill` in the array:
        *   Display the `skill.name`.
        *   If `skill.status` is `'matched'`, display a green checkmark icon (use `lucide-react`'s `CheckCircle` or similar) and a distinct text style (e.g., `text-green-500`).
        *   If `skill.status` is `'missing'`, display a red 'x' icon (use `lucide-react`'s `XCircle` or similar) and a distinct text style (e.g., `text-red-500` or `text-muted-foreground`).
    *   Ensure the component is responsive and visually clean, fitting within the existing UI aesthetic (Tailwind CSS, shadcn-ui).
4.  **Temporary Integration into `JobRecommendationCard`:**
    *   In `src/components/recommendations/JobRecommendationCard.tsx`, temporarily integrate the new `SkillsGapDisplay` component.
    *   Pass it mock `Skill[]` data to verify its rendering within the card layout. Example mock data:
        ```typescript
        const mockSkills: Skill[] = [
          { name: 'React', status: 'matched' },
          { name: 'TypeScript', status: 'matched' },
          { name: 'Node.js', status: 'missing' },
          { name: 'AWS', status: 'missing' },
        ];
        // Pass this to <SkillsGapDisplay skills={mockSkills} />
        ```
    *   **Important:** This integration is temporary for UI verification. The actual data will come from the API in Task C.

### Acceptance Criteria
-   `shared/types/src/index.ts` contains the new `Skill` interface and `JobMatch` is updated.
-   `src/components/recommendations/SkillsGapDisplay.tsx` is created and correctly renders `Skill[]` data with appropriate icons and styling for 'matched' and 'missing' statuses.
-   `src/components/recommendations/JobRecommendationCard.tsx` temporarily renders `SkillsGapDisplay` with mock data, demonstrating correct visual integration.
-   All new code adheres to project coding standards (linting, TypeScript strictness).
