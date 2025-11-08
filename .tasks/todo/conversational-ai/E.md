---
Task ID: E
Feature: Conversational AI
Title: Backend - AI Model Integration & Contextual Awareness
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: B
---

### Objective
Replace the placeholder chat response logic with a real, context-aware connection to the `ai-engine`. This will enable intelligent, personalized conversations by providing the AI with user profile data and conversation history.

### Context
This is the critical task that elevates our chat feature from a simple messaging UI to an intelligent AI assistant. It establishes the data pipeline that will power all future AI-driven conversational features. This plan defers the actual LLM integration in the `ai-engine` to focus on creating a robust data pipeline first.

### Key Files to Modify
- `services/core-api/src/routes/chat.ts`
- `services/core-api/src/lib/ai-client.ts` (or equivalent)
- `services/ai-engine/main.py`
- `services/ai-engine/models/schemas.py`

### Instructions for Claude

#### Part 1: Enhance the `ai-engine`

1.  **Define Context-Aware Schemas**:
    *   In `services/ai-engine/models/schemas.py`, define new Pydantic models to handle a conversational turn.
    ```python
    from pydantic import BaseModel
    from typing import Literal

    class UserProfileContext(BaseModel):
        skills: list[str] = []
        target_roles: list[str] = []

    class ChatMessage(BaseModel):
        role: Literal["user", "assistant"]
        content: str

    class AIRequest(BaseModel):
        user_profile: UserProfileContext
        message_history: list[ChatMessage]
        new_message: str

    class AIResponse(BaseModel):
        content: str
    ```

2.  **Create New `ai-engine` Endpoint**:
    *   In `services/ai-engine/main.py`, create a new endpoint: `POST /generate_response`.
    *   This endpoint should accept a body conforming to the `AIRequest` schema.
    *   **Logic**: For this initial implementation, the endpoint should **not** call a real LLM. Instead, it should prove that it received the context by returning a structured, hardcoded response.
    ```python
    @app.post("/generate_response", response_model=AIResponse)
    async def generate_response(request: AIRequest):
        # Placeholder logic to prove context was received
        num_skills = len(request.user_profile.skills)
        history_len = len(request.message_history)
        response_content = (
            f"Received context: User has {num_skills} skill(s). "
            f"Conversation has {history_len} prior messages. "
            f"New message: '{request.new_message}'"
        )
        return AIResponse(content=response_content)
    ```
3.  **Add a Test**: Create a new test in the `ai-engine/tests/` directory to validate that the `/generate_response` endpoint works as expected.

#### Part 2: Update the `core-api`

1.  **Create AI Client Method**:
    *   In `services/core-api/src/lib/ai-client.ts`, add a new method to call the `/generate_response` endpoint of the `ai-engine`. It should accept the user profile, history, and new message.

2.  **Modify `POST /api/chat/message` Handler**:
    *   In `services/core-api/src/routes/chat.ts`, refactor the existing logic.
    *   After saving the user's new message to the database:
        1.  Fetch the user's profile from the Supabase `profiles` table to get their skills and target roles.
        2.  Fetch the last 5-10 messages from the current conversation to provide as history.
        3.  Construct the `AIRequest` payload.
        4.  Call the new `ai-engine` client method with this payload.
        5.  Take the `content` from the `AIResponse` and save it as the new assistant message in your database.
        6.  Return the assistant's message to the frontend.

3.  **Update Tests**: Update the integration tests for the `core-api` to verify that the `POST /api/chat/message` endpoint correctly calls the `ai-engine` with the expected contextual payload.

### Acceptance Criteria
-   The `ai-engine` has a new, tested `POST /generate_response` endpoint that uses the new Pydantic schemas.
-   The `core-api`'s `POST /api/chat/message` endpoint is updated to:
    -   Fetch user profile and conversation history.
    -   Call the new `ai-engine` endpoint with this context.
    -   Save and return the structured response from the `ai-engine`.
-   The placeholder "echo" logic is completely removed, and the foundation for a truly intelligent AI is in place.
