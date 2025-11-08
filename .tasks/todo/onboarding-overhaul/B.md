---
Task ID: B
Feature: Onboarding Overhaul
Title: Frontend - Connect Onboarding Page to API
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective
Connect the frontend onboarding component to the new backend API endpoint. This involves replacing the current mock submission logic with a real API call to persist user data.

### Context
This task makes the onboarding flow functional by wiring the UI to the backend created in Task A. It will enable users to properly save their profile information for the first time.

### Key Files to Modify
- `src/app/onboarding/page.tsx`
- `src/lib/react-query.ts` (or a new file for API client functions)
- `src/lib/types.ts` (if any frontend-specific type adjustments are needed)

### Instructions for Claude
1.  **Create an API Client Function**:
    *   Create a new function that will be responsible for making the API call to the `/api/profile/onboarding` endpoint. This could be in a shared API client file or directly within the `react-query` library setup.
    *   This function should take the `OnboardingData` as an argument and use the Supabase client or a standard `fetch` call to send the data to your `core-api` service.
2.  **Use React Query for Mutation**:
    *   In `src/app/onboarding/page.tsx`, use React Query's `useMutation` hook to handle the data submission. This provides proper state management for `isLoading`, `isError`, etc.
    *   The `mutationFn` for `useMutation` will be the API client function you created in the previous step.
3.  **Replace Mock Logic**:
    *   Remove the `useState` for `isSubmitting` and the `setTimeout` logic inside the `handleNext` function.
    *   Instead, call the `mutate` function from your `useMutation` hook, passing in the collected `data`.
    *   The `isLoading` state from the mutation should be used to drive the UI (e.g., disabling buttons, showing the `FinalizingStep` loading state).
4.  **Implement `onSubmit`**:
    *   The `Onboarding` component in `page.tsx` is a default export. For it to be used, you will need to properly instantiate it and pass the `onSubmit` prop which will be the function that calls the API.
5.  **Error Handling**:
    *   Use the `isError` and `error` properties from the `useMutation` result to handle potential submission failures.
    *   **Crucially, if the mutation fails, ensure the user is returned to the previous step and their entered data is preserved.** Do not let them get stuck on the "Finalizing" screen. A simple `console.error` is acceptable for the error itself, but the user flow must be resilient.

### Acceptance Criteria
-   The `Onboarding` page uses React Query's `useMutation` to handle form submission.
-   The mock `setTimeout` logic is completely removed and replaced with a real API call to the backend.
-   The UI correctly reflects the loading state during the API call.
-   If the API submission fails, the user is not stuck and their form data is preserved.
-   Upon successful submission, the user is redirected to `/app/dashboard`.