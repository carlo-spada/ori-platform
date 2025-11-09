---
Task ID: B
Feature: Core App UI/UX and PWA
Title: Dashboard UI Redesign
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Redesign the dashboard to be more visually appealing, informative, and functional, creating a "nice looking" and engaging home base for the user.

### Context
The current dashboard is a placeholder. This task will implement a more robust and aesthetically pleasing design that provides immediate value to the user upon logging in.

### Key Files to Modify
- `src/app/app/dashboard/page.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/WhatsNextCard.tsx`
- `public/locales/en/translation.json` (and other languages)
- **New Components**: e.g., `src/components/dashboard/QuickStats.tsx`, `src/components/dashboard/RecentActivity.tsx`

### Instructions for Claude
1.  **Dashboard Layout**:
    *   In `src/app/app/dashboard/page.tsx`, update the layout to use a responsive grid (e.g., using CSS Grid or Tailwind's grid classes). This will allow for a more complex and organized arrangement of components.
2.  **Enhance `DashboardHeader.tsx`**:
    *   Update the header to be more dynamic. Instead of a static title, it should greet the user by name (e.g., "Welcome back, Carlo!"). This will require fetching user data.
3.  **Create `QuickStats.tsx` Component**:
    *   Create a new component to display key statistics at a glance.
    *   This could include cards for "Active Applications," "Job Recommendations," and "Skills Added."
    *   Use icons and bold numbers to make the information easily digestible. For now, you can use mock data.
4.  **Create `RecentActivity.tsx` Component**:
    *   Create a new component to show a feed of recent user activity (e.g., "You applied to Senior Product Manager," "You added the skill 'TypeScript'").
    *   This will also use mock data for now, but the component should be designed to eventually handle real data.
5.  **Redesign `WhatsNextCard.tsx`**:
    *   Update the existing "What's Next" card to be more visually engaging.
    *   Instead of a simple list, consider using icons and more descriptive text to guide the user toward key actions like "Explore Recommendations" or "Complete Your Profile."
6.  **Internationalization (i18n)**:
    *   Ensure all new user-facing strings (titles, labels, descriptions) are added to the translation files (e.g., `public/locales/en/translation.json`) and implemented using the `useTranslation` hook.
7.  **Styling and Polish**:
    *   Use `shadcn-ui` components (`Card`, `Button`, etc.) and Tailwind CSS to ensure the new dashboard is consistent with the project's design system.
    *   Pay attention to spacing, typography, and creating a clean, modern aesthetic.

### Acceptance Criteria
-   The dashboard page uses a responsive grid layout.
-   The `DashboardHeader` displays a personalized greeting.
-   New `QuickStats` and `RecentActivity` components are created and integrated into the dashboard, using mock data.
-   The `WhatsNextCard` is redesigned to be more engaging.
-   All new text is internationalized.
-   The overall look and feel of the dashboard is modern, professional, and significantly improved from the placeholder version.