# Task: Mascot Insightful Messages

## Objective
Add functionality for the mascot to display short, insightful, or helpful messages periodically in an unobtrusive speech bubble.

## Scope
*   Within `src/components/mascot/Mascot.tsx`, create a sub-component or logic for a speech bubble.
*   Implement a mechanism to display a random message from a predefined list (e.g., an array of strings).
*   Messages should appear for a short duration (e.g., 5-10 seconds) and then fade out.
*   Implement a timer (e.g., `setInterval`) to trigger new messages every few minutes.
*   Ensure the speech bubble's styling is unobtrusive and doesn't block important content.

## Acceptance Criteria
*   A speech bubble appears next to the mascot at regular intervals.
*   Messages are drawn from a predefined list and are displayed correctly.
*   Messages disappear after a set duration.
*   The speech bubble is visually appealing and does not obstruct the UI.
*   New unit tests are added for message display and timing.
