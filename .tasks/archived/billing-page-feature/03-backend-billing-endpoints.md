# Task: Backend API Endpoints for Billing Management

## Objective
Implement new API endpoints in `services/core-api` to support fetching and managing user billing information and subscriptions.

## Scope
*   Create a GET endpoint (e.g., `/api/billing/subscription`) to fetch the user's current subscription details from Stripe.
*   Create a POST endpoint (e.g., `/api/billing/change-plan`) to handle plan upgrades/downgrades. This will interact with Stripe's subscription update API.
*   Create a POST endpoint (e.g., `/api/billing/cancel-subscription`) to handle subscription cancellations.
*   Create a GET endpoint (e.g., `/api/billing/invoices`) to fetch a list of past invoices from Stripe.
*   Ensure all endpoints are authenticated and authorized.
*   Implement robust error handling and logging.

## Acceptance Criteria
*   All specified backend endpoints are created and functional.
*   Endpoints correctly interact with the Stripe API to retrieve and modify subscription data.
*   Authentication and authorization are enforced for all billing endpoints.
*   New unit tests are added for each endpoint.
