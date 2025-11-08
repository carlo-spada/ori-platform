# Task: Backend Stripe Webhook Endpoint

## Objective
Implement a secure webhook endpoint in `services/core-api` to listen for Stripe events and update the user's subscription status in the database accordingly.

## Scope
*   Create a new POST endpoint (e.g., `/api/stripe-webhook`).
*   Implement Stripe webhook signature verification for security.
*   Handle the following events:
    *   `checkout.session.completed`: Update `subscription_status` and `stripe_subscription_id` for the user.
    *   `customer.subscription.updated`: Update `subscription_status` based on the new subscription state.
    *   `customer.subscription.deleted`: Set `subscription_status` to 'free' or 'cancelled'.
    *   (Optional) `invoice.payment_failed`: Log or handle failed payments.
*   Ensure the database updates are atomic and robust.

## Acceptance Criteria
*   The webhook endpoint is secure and correctly verifies Stripe signatures.
*   Stripe events are successfully received and processed.
*   User `subscription_status` and `stripe_subscription_id` are accurately updated in the database based on webhook events.
*   New unit tests are added to simulate webhook events and verify database updates.
