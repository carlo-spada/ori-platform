# Task: Frontend Signup with Plan Selection and Stripe Elements Integration

## Objective

Modify the signup page (`src/app/signup/page.tsx`) to allow users to select a subscription plan (Free, Plus, Premium) and integrate with Stripe Elements for an embedded payment experience for paid plans.

## Scope

- Update `src/app/signup/page.tsx` (or relevant signup components) to include plan selection UI.
- When a paid plan is selected:
  - Call the backend's `/api/create-setup-intent` endpoint to get a `client_secret`.
  - Render Stripe Elements (e.g., `PaymentElement` or `CardElement`) to collect payment details.
  - Use the `client_secret` with `stripe.confirmSetup()` to confirm the Setup Intent when the form is submitted.
- When the "Free" plan is selected, proceed with standard user registration.
- Remove any logic related to `success_url` and `cancel_url` redirects from Stripe Checkout.

## Acceptance Criteria

- The signup page clearly presents plan options (Free, Plus, Premium).
- Selecting a paid plan displays an embedded Stripe Elements payment form.
- Users can enter payment details directly within the application.
- The Setup Intent is successfully confirmed with Stripe upon form submission for paid plans.
- Selecting the "Free" plan completes registration without payment form display.
- Existing frontend tests still pass, and new tests cover the plan selection and Stripe Elements integration logic.

---
**Note to Claude:** This task has been updated to switch from Stripe Checkout redirects to an embedded payment experience using Stripe Elements. Please adapt your implementation accordingly.

