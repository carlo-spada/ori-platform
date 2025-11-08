# Task: Frontend Signup with Plan Selection and Stripe Checkout Integration

## Objective
Modify the signup page (`src/app/signup/page.tsx`) to allow users to select a subscription plan (Free, Plus, Premium) and integrate with the backend to initiate Stripe Checkout for paid plans.

## Scope
*   Update `src/app/signup/page.tsx` (or relevant signup components) to include plan selection UI.
*   When a paid plan is selected and the form is submitted:
    *   Call the backend's `/api/create-checkout-session` endpoint.
    *   Use the returned `sessionId` to redirect the user to Stripe Checkout.
*   When the "Free" plan is selected, proceed with standard user registration.
*   Handle redirects from Stripe Checkout (`success_url` and `cancel_url`).

## Acceptance Criteria
*   The signup page clearly presents plan options (Free, Plus, Premium).
*   Selecting a paid plan successfully redirects the user to Stripe Checkout.
*   Selecting the "Free" plan completes registration without payment redirection.
*   Users are redirected correctly after completing/cancelling Stripe Checkout.
*   Existing frontend tests still pass, and new tests cover the plan selection and redirection logic.
