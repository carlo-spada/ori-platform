# Task: Backend Stripe Webhook Endpoint and API Configuration

## Objective

Implement a secure webhook endpoint in `services/core-api` to listen for Stripe events and update the user's subscription status in the database accordingly. Additionally, programmatically configure the Stripe webhook endpoint via the Stripe API for automation and consistency.

## Scope

- **API-based Webhook Configuration:**
  - Implement logic (e.g., in a setup script or an initialization function) to programmatically create or update the Stripe webhook endpoint using `stripe.webhookEndpoints.create()` or `stripe.webhookEndpoints.update()`.
  - The webhook URL should be dynamically set based on the environment (e.g., `NEXT_PUBLIC_APP_URL` or a specific webhook URL environment variable).
  - Configure the webhook to listen to the following events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.source.expiring`.
  - Store the webhook secret securely (e.g., in environment variables).
- **Webhook Endpoint Implementation:**
  - Create a new POST endpoint (e.g., `/api/stripe-webhook`).
  - Implement Stripe webhook signature verification for security.
  - Handle the following events:
    - `checkout.session.completed`: Update `subscription_status` and `stripe_subscription_id` for the user.
    - `customer.subscription.created`: Confirm subscription creation and update `subscription_status`.
    - `customer.subscription.updated`: Update `subscription_status` based on plan changes, trial ending, payment method changes, or subscription state changes (e.g., `active`, `past_due`, `canceled`, `unpaid`).
    - `customer.subscription.deleted`: Set `subscription_status` to 'free' or 'cancelled'.
    - `invoice.payment_succeeded`: Log successful recurring payments.
    - `invoice.payment_failed`: Handle failed payments (dunning, user notification, update `subscription_status` to `past_due`).
    - `customer.source.expiring`: Notify user to update payment method.
- Ensure the database updates are atomic and robust.

## Acceptance Criteria

- The Stripe webhook endpoint is programmatically created/updated upon application setup/deployment.
- The webhook is configured to listen to all specified events.
- The webhook endpoint is secure and correctly verifies Stripe signatures.
- Stripe events are successfully received and processed.
- User `subscription_status` and `stripe_subscription_id` are accurately updated in the database based on webhook events.
- New unit tests are added to simulate webhook events and verify database updates.
- New unit tests are added to verify the programmatic webhook configuration.

---

**Note to Claude:** This task has been updated to include programmatic configuration of the Stripe webhook endpoint via the Stripe API, in addition to implementing the webhook listener. This ensures a higher level of automation and quality.
