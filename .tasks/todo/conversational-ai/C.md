---
Task ID: C
Feature: Conversational AI
Title: Frontend - Connect Chat Window to API
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: B
---

### Objective
Integrate the `ChatWindow.tsx` component with the new backend chat API, transforming it from a static UI into a fully functional, persistent chat interface.

### Context
This task brings the chat feature to life for the user. It wires the frontend UI to the backend services, enabling real-time, persistent conversations.

### Key Files to Modify
- `src/components/chat/ChatWindow.tsx`
- `src/app/app/dashboard/page.tsx` (or wherever the chat window is rendered)
- `src/lib/react-query.ts`

### Instructions for Claude
1.  **Data Fetching with React Query**:
    *   Create a new query using `useQuery` to fetch the conversation history from the `GET /api/chat/history` endpoint.
    *   This query will provide the initial `messages` for the `ChatWindow` component.
2.  **Data Mutation with React Query**:
    *   Create a mutation using `useMutation` to handle sending new messages to the `POST /api/chat/message` endpoint.
    *   **Optimistic Updates**: Implement an optimistic update for a seamless user experience. When the user sends a message:
        1.  Immediately add the user's message to the local React Query cache.
        2.  When the mutation is successful, update the cache with the actual assistant message returned from the API.
        3.  If the mutation fails, roll back the optimistic update and show an error state.
3.  **Integrate into `ChatWindow.tsx`**:
    *   Refactor the component that hosts `ChatWindow.tsx` (e.g., the dashboard page).
    *   Use the `useQuery` and `useMutation` hooks to manage the chat state.
    *   Pass the messages from the query to the `ChatWindow`.
    *   The `onSend` prop of the `ChatWindow` should trigger the `mutate` function from `useMutation`.
4.  **Update Component State**:
    *   The component should now handle loading states (e.g., showing a skeleton loader while history is fetching) and error states (e.g., showing an error message if the API fails).

### Acceptance Criteria
-   The `ChatWindow` fetches and displays the user's past conversation history on load.
-   Users can send new messages, which are persisted in the database.
-   The UI updates optimistically, showing the user's message immediately.
-   The assistant's (placeholder) response appears after the API call completes.
-   The chat is fully functional and persistent across page reloads.
