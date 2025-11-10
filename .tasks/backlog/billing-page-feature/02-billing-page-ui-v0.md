# Task: Billing Page UI Generation with v0.dev

## Objective
Generate the core UI components for the billing management page using `v0.dev`, covering subscription display, plan selection, and payment method management.

## Scope
*   Access `v0.dev` (https://v0.dev).
*   Provide prompts to `v0.dev` to generate UI for the following sections:
    *   **Subscription Overview Card:** Displays current plan, price, billing cycle, next billing date, and a "Cancel Subscription" button.
    *   **Plan Selection Section:** Shows available plans (Free, Plus, Premium) with their features, pricing (monthly/yearly toggle), and "Upgrade/Downgrade" buttons.
    *   **Payment Method Management Card:** Displays the last 4 digits of the current card, expiration date, and an "Update Payment Method" button.
    *   **Billing History Section:** A table to list past invoices with date, amount, and status.
*   Integrate the generated code into `src/app/app/settings/billing/page.tsx` and/or create new components in `src/components/billing/`.
*   Ensure the generated UI is responsive and uses existing project styling conventions (Tailwind CSS, shadcn-ui).

## Acceptance Criteria
*   The billing page displays placeholder UI for subscription overview, plan selection, payment method management, and billing history.
*   The UI is generated using `v0.dev` and integrated into the project.
*   The components are styled consistently with the rest of the application.
*   No visual regressions are introduced.
