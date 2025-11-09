---
Task ID: D
Feature: Conversational AI
Title: UI/UX Polish - The "Firefly" Experience
Assignee: Gemini (Planner & Researcher / UI/UX Guardian)
Status: To Do
Depends On: C
---

### Objective

Redesign and polish the `ChatWindow` component to transform it into the "beautiful, unobtrusive, yet exceedingly helpful" experience you described—a true "firefly in a person's nightsky."

### Context

With the core functionality in place, this task focuses entirely on the aesthetics, interaction design, and overall feel of the chat interface to meet the high-quality standard you've set.

### Key Files to Review/Modify

- `src/components/chat/ChatWindow.tsx`
- `src/app/globals.css` (if minor global style adjustments are needed)

### Instructions for Gemini

1.  **Aesthetic Redesign**:
    - **Colors & Theme**: Move beyond the default component styles. Introduce a subtle, elegant color palette. Consider using gradients or a slightly translucent "glassmorphism" effect for the background to make it feel modern.
    - **Typography**: Ensure the typography is exceptionally clear and readable.
    - **Avatars**: Add simple, elegant avatars for both the user and "Ori" to make the conversation feel more personal.
    - **Rename**: Change the hardcoded "AURA" title to "Ori".
2.  **Interaction & Animation**:
    - **Message Streaming**: When the real AI is integrated, the assistant's response should "stream" in word-by-word to feel more dynamic. For now, simulate this with a slight delay and a fade-in animation on the assistant's message.
    - **Input Area**: The text input area should subtly animate or glow when focused, inviting interaction.
    - **Loading States**: Replace any jarring loading indicators with smooth, subtle animations (e.g., a soft pulsing dot or a gentle shimmer effect).
3.  **Accessibility**:
    - Ensure the entire chat interface is fully accessible.
    - Verify correct ARIA roles and attributes are used for the chat log, messages, and input field.
    - Confirm the interface is navigable and usable with a keyboard alone.
    - Check for sufficient color contrast.
4.  **End-to-End Verification**:
    - Test the entire chat flow, ensuring the new design works flawlessly with the backend integration.
    - Check for responsiveness on mobile, tablet, and desktop. The "firefly" experience must be consistent across all devices.

### Acceptance Criteria

- The `ChatWindow` UI is significantly redesigned to be visually stunning, modern, and elegant.
- Subtle animations and transitions are added to enhance the user experience and make the interaction feel fluid.
- The component is renamed to "Ori" and includes user/assistant avatars.
- The final design is responsive, polished, and fully accessible.
- The beautiful UI is fully functional and integrated with the backend.
