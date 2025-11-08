# Task: Backend Endpoint for Stripe Checkout Session Creation

## Objective

Create a new API endpoint in `services/core-api` that the frontend can call to initiate a Stripe Checkout Session for paid subscription plans.

## Scope

- Create a new POST endpoint (e.g., `/api/create-checkout-session`).
- This endpoint should accept the `planId` (e.g., 'plus_monthly', 'premium_yearly') and the user's `stripe_customer_id`.
- Use `stripe.checkout.sessions.create()` to create a new session.
  - Ensure `mode: 'subscription'`, `customer: stripe_customer_id`, `line_items` (mapping `planId` to Stripe Price ID), `success_url`, and `cancel_url` are correctly configured.
- Return the `sessionId` to the frontend.

## Acceptance Criteria

- The new endpoint is accessible and correctly creates a Stripe Checkout Session.
- The endpoint handles different `planId` inputs and maps them to the correct Stripe Price IDs.
- Error handling is implemented for Stripe API calls.
- New unit tests are added to verify the endpoint's functionality.
