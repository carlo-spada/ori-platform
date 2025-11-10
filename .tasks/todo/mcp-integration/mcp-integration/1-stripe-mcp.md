# Task: Set up Stripe MCP Server

**Assigned to:** Claude

## High-Level Goal

Integrate the Stripe MCP Server to enable programmatic testing of our payment and subscription infrastructure. This will replace manual testing in the Stripe dashboard and streamline our development workflow.

## Detailed Requirements

1.  **Configure the Stripe MCP Server:**
    *   Set up the Stripe MCP server in our Claude Code environment.
    *   Ensure it is configured with the necessary API keys (from GitHub secrets).

2.  **Create a `StripeService`:**
    *   Create a new service in `services/core-api/src/services/stripe.ts`.
    *   This service should encapsulate all Stripe-related logic and use the Stripe MCP server for all interactions with the Stripe API.
    *   It should provide a simple, high-level API for our application to use (e.g., `createCustomer`, `createSubscription`, `handleWebhook`).

3.  **Refactor Payment and Subscription Tests:**
    *   Refactor our existing payment and subscription tests to use the new `StripeService`.
    *   The tests should use the Stripe MCP server to create test customers, subscriptions, and invoices.
    *   The tests should also cover webhook handling.

## Acceptance Criteria

- [ ] The Stripe MCP server is configured and running in our Claude Code environment.
- [ ] A new `StripeService` is created and encapsulates all Stripe-related logic.
- [ ] All existing payment and subscription tests are refactored to use the new `StripeService`.
- [ ] The tests cover the creation of test customers, subscriptions, and invoices.
- [ ] The tests cover webhook handling.
- [ ] All manual testing in the Stripe dashboard is replaced by programmatic tests.
