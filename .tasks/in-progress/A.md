---
Task ID: A
Feature: Conversational AI
Title: Backend - Database Schema for Conversations
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Create the necessary database schema in Supabase to store chat conversations, ensuring they are persistent and linked to individual users.

### Context
To have a chat that "remembers" the user, we must store the conversation history. This is the foundational data layer for the entire conversational AI feature.

### Key Files to Modify
- `supabase/migrations/` (new migration file)

### Instructions for Claude
1.  **Design the Schema**:
    *   Design two new tables: `conversations` and `messages`.
    *   **`conversations` table**:
        *   `id`: Primary key (UUID, auto-generated).
        *   `user_id`: Foreign key to `auth.users(id)`.
        *   `created_at`: Timestamp.
        *   `updated_at`: Timestamp.
        *   `summary`: A nullable text field to potentially store a summary of the conversation later.
    *   **`messages` table**:
        *   `id`: Primary key (UUID, auto-generated).
        *   `conversation_id`: Foreign key to `conversations(id)`.
        *   `role`: An enum or text field ('user' or 'assistant').
        *   `content`: The text of the message.
        *   `created_at`: Timestamp.
2.  **Create Supabase Migration**:
    *   Create a new SQL migration file in the `supabase/migrations/` directory.
    *   Write the SQL `CREATE TABLE` statements for both `conversations` and `messages`.
    *   Ensure you set up foreign key constraints, indexes (on `user_id` and `conversation_id`), and enable Row Level Security (RLS) for both tables.
3.  **Define RLS Policies**:
    *   For the `conversations` table, create a policy that allows a user to `SELECT`, `INSERT`, `UPDATE` only their own conversations (where `user_id` matches `auth.uid()`).
    *   For the `messages` table, create a policy that allows a user to `SELECT` and `INSERT` messages only for conversations they own. This can be checked via a subquery to the `conversations` table.

### Acceptance Criteria
-   A new Supabase migration file is created.
-   The migration successfully creates the `conversations` and `messages` tables with the correct columns and constraints.
-   Row Level Security is enabled and correctly configured for both tables, ensuring users can only access their own conversation data.
