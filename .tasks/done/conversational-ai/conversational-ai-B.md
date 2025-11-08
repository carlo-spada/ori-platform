---
Task ID: B
Feature: Conversational AI
Title: Backend - API for Chat Messaging
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective

Create a new API in the `core-api` service to handle fetching conversation history, receiving new user messages, and returning AI-generated responses.

### Context

This API will be the bridge between the frontend chat window and the backend logic/database. It will manage the flow of a conversation.

### Key Files to Modify

- **New File**: `services/core-api/src/routes/chat.ts`
- `services/core-api/src/index.ts` (to register the new route)
- `shared/types/src/index.ts`

### Instructions for Claude

1.  **Update Shared Types**:
    - In `shared/types/src/index.ts`, define types for `ChatMessage` and `Conversation` that match the database schema.
2.  **Create Chat API Routes**:
    - Create a new route file at `services/core-api/src/routes/chat.ts`.
    - **`GET /api/chat/history`**:
      - An authenticated endpoint that fetches the most recent conversation (including all its messages) for the current user.
      - If no conversation exists, it should return an empty array of messages.
    - **`POST /api/chat/message`**:
      - An authenticated endpoint that receives a new user message.
      - The body should contain the `content` of the message and optionally a `conversation_id`.
      - **Logic**:
        1.  Save the user's message to the `messages` table.
        2.  **Generate an assistant response**. For this initial version, the response can be a simple, hardcoded "echo" or a rule-based response (e.g., "You said: [user message]"). The connection to a real AI model will be a future task.
        3.  Save the assistant's response to the `messages` table.
        4.  Return the assistant's message as the API response.
3.  **Register the Route**:
    - Import and register the new chat router in the `core-api`'s main `index.ts`.
4.  **Testing**:
    - Add integration tests for both new endpoints. Verify authentication, data fetching, and the message request/response cycle.

### Acceptance Criteria

- New `GET /api/chat/history` and `POST /api/chat/message` endpoints are created and functional.
- The endpoints are authenticated and interact correctly with the Supabase database.
- The `POST` endpoint saves the user message and a placeholder assistant response.
- The endpoints are covered by tests.
