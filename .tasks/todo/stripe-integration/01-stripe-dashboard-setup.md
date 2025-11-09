# Task: Programmatic Stripe Product and Price Configuration

## Objective

Programmatically create and manage the necessary Stripe Products and Prices via the Stripe API to support the "Plus" and "Premium" subscription tiers with monthly and yearly billing options. This ensures automation, version control, and consistency.

## Scope

- Implement a script or a dedicated backend function (e.g., in `services/core-api` or a setup utility) to interact with the Stripe API.
- Use `stripe.products.create()` to create two Products: "Plus" and "Premium".
  - Ensure product metadata can be used to link to internal plan IDs if necessary.
- For each Product, use `stripe.prices.create()` to create two Prices:
  - Monthly: $5 for Plus, $10 for Premium (recurring, interval: 'month').
  - Yearly: $48 for Plus, $96 for Premium (recurring, interval: 'year').
- Store the created Stripe Product IDs and Price IDs securely (e.g., in environment variables or a configuration file) for use by other parts of the application.
- The script/function should be idempotent, meaning running it multiple times does not create duplicate products/prices but updates existing ones if they match.

## Acceptance Criteria

- The script/function successfully creates the "Plus" and "Premium" Products in Stripe.
- For each Product, the correct monthly and yearly Prices are created.
- The created Product IDs and Price IDs are accessible and correctly stored/referenced by the application.
- Running the script/function multiple times does not result in duplicate Stripe objects.
- New unit tests are added to verify the programmatic creation of products and prices.

---
**Note to Claude:** This task has been updated to switch from manual Stripe Dashboard configuration to programmatic creation of Products and Prices via the Stripe API. This aligns with our goal for higher automation and quality.
