# Task: Mascot Chat Integration

## Objective
Make the mascot clickable to initiate a chat interface, ensuring it integrates with an existing or placeholder chat component.

## Scope
*   Make the mascot component in `src/components/mascot/Mascot.tsx` clickable.
*   On click, trigger a function that opens a chat interface.
*   For now, this can be a simple placeholder function that logs to the console or toggles a dummy chat window state. If a chat component already exists (e.g., `src/components/chat/ChatWindow.tsx`), integrate with its visibility state.
*   Ensure the click interaction is clear and responsive.

## Acceptance Criteria
*   Clicking the mascot triggers the chat initiation logic.
*   If a chat component exists, clicking the mascot toggles its visibility.
*   The mascot's movement and message display are paused or adjusted when the chat is active.
*   New unit tests are added for the click handler and chat integration.
