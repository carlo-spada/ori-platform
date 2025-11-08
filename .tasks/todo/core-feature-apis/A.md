---
Task ID: A
Feature: Core Feature APIs
Title: Database - Create Core Application Schema
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective

Create a new Supabase migration to define the core database tables required for the application's main features, including profiles, qualifications, and applications.

### Context

This is the foundational task for making the Ori Platform functional. The application currently lacks the necessary database schema to store any user data beyond authentication. This migration will create that foundation.

### Key Files to Modify

- `supabase/migrations/` (a new migration file)

### Instructions for Claude

1.  **Create a New Migration File**:
    - Generate a new, timestamped migration file in the `supabase/migrations/` directory.
2.  **Update `profiles` Table**:
    - Alter the existing `profiles` table (created during Supabase project setup) to include columns for data collected during onboarding and on the profile page.
    - Add the following columns:
      - `full_name` (text)
      - `headline` (text, nullable)
      - `location` (text, nullable)
      - `about` (text, nullable)
      - `skills` (text[], nullable, default: '{}')
      - `long_term_vision` (text, nullable)
      - `target_roles` (text[], nullable, default: '{}')
3.  **Create New Tables**:
    - Write the `CREATE TABLE` statements for the following new tables. Ensure all tables have Row Level Security (RLS) enabled and appropriate policies for user ownership.
    - **`experiences`**:
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to `auth.users`)
      - `company` (text)
      - `role` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `is_current` (boolean, default: false)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
    - **`education`**:
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to `auth.users`)
      - `institution` (text)
      - `degree` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `is_current` (boolean, default: false)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
    - **`applications`**:
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to `auth.users`)
      - `job_title` (text)
      - `company` (text)
      - `location` (text, nullable)
      - `application_date` (timestamptz)
      - `status` (enum type: `applied`, `interviewing`, `offer`, `rejected`, `paused`)
      - `last_updated` (timestamptz)
4.  **Define RLS Policies**:
    - For each new table, create policies that allow a user to perform all CRUD operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) **only on their own records** (where `user_id` matches `auth.uid()`).

### Acceptance Criteria

- A new Supabase migration file is created.
- The migration successfully alters the `profiles` table and creates the `experiences`, `education`, and `applications` tables.
- All new tables have RLS enabled with policies that enforce user ownership of data.
- The migration can be run without errors.
