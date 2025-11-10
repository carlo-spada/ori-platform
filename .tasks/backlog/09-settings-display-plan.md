# Task: Settings - Display Current Subscription Plan

## Objective
Display the user's current subscription plan and basic details on the subscription management settings page.

## Scope
*   In `src/app/app/settings/subscription/page.tsx` (or a dedicated component), use React Query to fetch data from the backend's subscription details endpoint (e.g., `/api/billing/subscription`).
*   Display the current plan name, price, billing cycle, and next billing date.
*   Handle loading and error states gracefully.

## Acceptance Criteria
*   The subscription settings page accurately displays the user's current plan details.
*   Data is fetched from the backend API.
*   Loading indicators are shown during data fetching.
*   Error messages are displayed if data fetching fails.
*   New unit tests are added for data fetching and display.
