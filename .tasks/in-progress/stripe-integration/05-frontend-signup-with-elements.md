# Task: Frontend Onboarding Checkout Stage with Dynamic Plan Selection and Stripe Elements

## Objective

Integrate a dynamic checkout stage into the user onboarding process (`src/app/signup/page.tsx`). This stage will allow users to select a subscription plan (Free, Plus, Premium) and, if a paid plan is chosen, dynamically display and integrate Stripe Elements for an embedded payment experience. This checkout stage should be part of the initial onboarding and not a separate, persistent "payments page."

## Scope

- **Modify Onboarding Flow:** Update `src/app/signup/page.tsx` (or relevant signup components) to include a step or section for plan selection.
- **Dynamic Payment UI:**
  - If a "Free" plan is selected, proceed with standard user registration without displaying payment fields.
  - If a "Plus" or "Premium" plan is selected, dynamically render a payment form using Stripe Elements.
- **Stripe Elements Integration:**
  - Call the backend's `/api/create-setup-intent` endpoint to get a `client_secret` when a paid plan is chosen and the payment form is about to be displayed.
  - Render Stripe Elements (e.g., `PaymentElement` or `CardElement`) to collect payment details (card number, expiration, CVC).
  - Collect customer name and email (if not already part of the signup form) for Stripe.
  - Use the `client_secret` with `stripe.confirmSetup()` to confirm the Setup Intent when the payment form is submitted.
- **Post-Submission:** After successful payment setup for a paid plan, complete the user registration and redirect to the main application dashboard.
- **Cleanup:** Remove any logic related to `success_url` and `cancel_url` redirects from previous Stripe Checkout plans.

## Acceptance Criteria

- The onboarding flow includes a clear plan selection step.
- Selecting a "Free" plan allows registration completion without payment details.
- Selecting a paid plan dynamically displays an embedded Stripe Elements payment form within the onboarding flow.
- Users can enter payment details (card, name, email, optional billing address) securely within the application.
- The Stripe Setup Intent is successfully confirmed upon payment form submission for paid plans.
- Upon successful registration (free or paid), the user is redirected to the main application.
- Existing frontend tests still pass, and new tests cover the dynamic plan selection, Stripe Elements integration, and redirection logic.

---
**Note to Claude:** This task has been significantly refined to align with the new UX vision: the payment process is now an integral, dynamic part of the *onboarding checkout stage* for paid plans, using Stripe Elements for an embedded experience. This is not a separate, persistent "payments page."
