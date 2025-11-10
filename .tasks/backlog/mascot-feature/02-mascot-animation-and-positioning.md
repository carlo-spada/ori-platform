# Task: Mascot Animation and Positioning Logic

## Objective
Implement the logic for the mascot to "fly around" the page unobtrusively, including smooth movement and staying within the viewport.

## Scope
*   Enhance `src/components/mascot/Mascot.tsx` to manage its own position.
*   Use `position: fixed` and dynamically update `top` and `left` CSS properties.
*   Implement a smooth animation loop (e.g., using `requestAnimationFrame` or CSS transitions/animations) to move the mascot.
*   Develop logic for the mascot to randomly move to different positions within the viewport, avoiding the edges too closely.
*   Consider adding a subtle "following" behavior based on scroll position or mouse movement, but prioritize unobtrusive random movement.

## Acceptance Criteria
*   The mascot moves smoothly and randomly across the screen.
*   The mascot remains within the visible viewport at all times.
*   Movement is subtle and does not distract from main content.
*   Performance is good; no jank or excessive CPU usage.
*   New unit tests are added for the positioning and animation logic.
