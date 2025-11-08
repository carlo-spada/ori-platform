# Task: Backend User Registration with Stripe Customer Creation

## Objective
Modify the user registration process in the `services/core-api` to create a Stripe Customer object for every new user, regardless of their initial plan choice (Free, Plus, Premium), and store the `stripe_customer_id` in the user's database record.

## Scope
*   Identify the existing user registration endpoint in `services/core-api`.
*   Integrate the Stripe Node.js client (if not already present, add it to `package.json` and install).
*   Modify the registration logic to call `stripe.customers.create()` for each new user.
*   Store the returned `id` (Stripe Customer ID) in the user's database record.
*   Set an initial `subscription_status` (e.g., 'free') for all new users.

## Acceptance Criteria
*   New users successfully register and have a corresponding `stripe_customer_id` stored in the database.
*   The `subscription_status` field for new users is initialized correctly (e.g., 'free').
*   Existing unit tests for user registration still pass.
*   New unit tests are added to verify Stripe Customer creation and ID storage.
