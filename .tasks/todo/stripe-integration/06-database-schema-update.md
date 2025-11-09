# Task: Database Schema Update for Stripe Integration

## Objective

Update the database schema to include necessary fields for Stripe customer and subscription management.

## Scope

- Identify the appropriate migration system or method for the project's database.
- Add the following columns to the `users` table:
  - `stripe_customer_id` (VARCHAR/TEXT, NOT NULL, UNIQUE)
  - `stripe_subscription_id` (VARCHAR/TEXT, NULLABLE, UNIQUE)
  - `subscription_status` (VARCHAR/TEXT, e.g., 'free', 'plus_monthly', 'premium_yearly', 'cancelled', with a default of 'free')

## Acceptance Criteria

- The database schema is updated with the new columns.
- Existing data is not corrupted.
- The new columns are correctly indexed if necessary.
- A migration script or equivalent is created and documented.
