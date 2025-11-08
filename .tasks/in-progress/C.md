---
Task ID: C
Feature: Core App UI/UX and PWA
Title: UI/UX Polish and Verification
Assignee: Gemini (Planner & Researcher / UI/UX Guardian)
Status: To Do
Depends On: B
---

### Objective
Perform a final review of the redesigned dashboard and PWA functionality, ensuring a polished, cohesive, and high-quality user experience across devices.

### Context
This task is the final quality gate for the core app UX improvements. It should only be started after the PWA is configured (Task A) and the dashboard is redesigned (Task B). My role is to ensure the final product is seamless and meets our high standards.

### Key Files to Review
- `src/app/app/dashboard/page.tsx`
- All new and modified `src/components/dashboard/*.tsx` components
- `app/manifest.ts`
- `next.config.ts`

### Instructions for Gemini
1.  **PWA Verification**:
    *   Using Chrome DevTools (or a similar tool), run a Lighthouse audit on the application.
    *   Confirm that the app scores highly in the "PWA" category and is identified as "installable."
    *   Install the app on both a desktop and a mobile device.
    *   Verify that the app icon appears correctly on the home screen/app drawer and that the app launches in its own standalone window without browser UI.
    *   Test basic offline functionality (the service worker should cache the main page, allowing it to load even when offline).
2.  **Dashboard UI/UX Review**:
    *   Thoroughly review the redesigned dashboard on multiple screen sizes (mobile, tablet, desktop).
    *   Ensure the responsive grid layout adapts correctly and that there are no visual bugs or layout shifts.
    *   Assess the visual hierarchy, spacing, typography, and color usage for consistency and clarity.
    *   Interact with all elements to ensure they are intuitive and provide appropriate feedback.
3.  **Cohesion and Consistency**:
    *   Ensure the new dashboard design feels like a natural part of the overall application, consistent with other pages and the `shadcn-ui` design system.
4.  **Final Polish**:
    *   Identify any minor aesthetic issues or areas for improvement.
    *   Make small CSS adjustments or copy tweaks as needed to elevate the final user experience.

### Acceptance Criteria
-   The application is fully verifiable as a PWA and installable on major platforms.
-   The redesigned dashboard is responsive, visually polished, and free of bugs.
-   The user experience is cohesive and meets the high-quality standards of the Ori Platform.
-   The app provides a basic offline viewing experience.
