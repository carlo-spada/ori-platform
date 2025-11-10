# Task: Backend Endpoint for Stripe Setup Intent Creation

## Objective

Create a new API endpoint in `services/core-api` that the frontend can call to initiate a Stripe Setup Intent for collecting payment method details for future subscription payments. This enables an embedded payment experience using Stripe Elements.

## Scope

- Create a new POST endpoint (e.g., `/api/create-setup-intent`).
- This endpoint should accept the `planId` (e.g., 'plus_monthly', 'premium_yearly') and the user's `stripe_customer_id`.
- Use `stripe.setupIntents.create()` to create a new Setup Intent.
  - Ensure `customer: stripe_customer_id` is correctly configured.
- Return the `client_secret` from the Setup Intent to the frontend.

## Acceptance Criteria

- The new endpoint is accessible and correctly creates a Stripe Setup Intent.
- The endpoint handles different `planId` inputs (though the Setup Intent itself doesn't directly depend on the plan, it's good to pass for context).
- The `client_secret` is successfully returned to the frontend.
- Error handling is implemented for Stripe API calls.
- New unit tests are added to verify the endpoint's functionality.

---
**Note to Claude:** This task has been updated to switch from Stripe Checkout Sessions to Stripe Setup Intents to support an embedded payment experience using Stripe Elements. Please adapt your implementation accordingly.

