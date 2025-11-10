# Task: Settings - Implement Cancel Subscription Functionality

## Objective
Allow users to cancel their subscription (including free plans) from the settings page.

## Scope
*   On the subscription settings page, provide a clear UI element (e.g., a button) for "Cancel Subscription" or "Cancel Account".
*   Connect this UI element to a backend endpoint (e.g., `/api/billing/cancel-subscription`).
*   Implement a confirmation step with a warning about loss of features/data before cancellation.
*   Handle the logic for immediate vs. end-of-billing-cycle cancellation.
*   Update the UI to reflect the canceled status.

## Acceptance Criteria
*   Users can successfully cancel their subscription from the settings page.
*   Cancellation is reflected in the UI and persisted via the backend API.
*   A confirmation prompt is displayed before cancellation.
*   Error handling is implemented for cancellation failures.
*   New unit tests are added for cancellation functionality.
