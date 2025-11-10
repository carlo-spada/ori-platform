# Task: Settings - Update Payment Method with Stripe Elements

## Objective
Allow users to securely update their payment method from the settings page using Stripe Elements.

## Scope
*   On the subscription settings page, provide a UI element (e.g., a button) for "Update Payment Method".
*   When triggered, display a form integrated with Stripe Elements (e.g., `PaymentElement` or `CardElement`).
*   Call the backend's `/api/create-setup-intent` endpoint to get a `client_secret`.
*   Use `stripe.confirmSetup()` to confirm the new payment method.
*   Display the last 4 digits and expiration date of the newly updated card.

## Acceptance Criteria
*   Users can click "Update Payment Method" to reveal a Stripe Elements form.
*   Payment details can be entered securely within the application.
*   The new payment method is successfully saved to Stripe via a Setup Intent.
*   The UI updates to show the details of the new payment method.
*   Error handling is implemented for payment method update failures.
*   New unit tests are added for Stripe Elements integration.
