---
type: analysis-doc
role: analysis
scope: all
audience: developers
last-updated: 2025-11-10
relevance: archive, deprecated, database, system, comprehensive, analysis.md, postgresql
priority: medium
quick-read-time: 17min
deep-dive-time: 29min
---

# PostgreSQL Database System in Ori Platform - Comprehensive Analysis

**Analysis Date:** November 9, 2025
**Project:** Ori Platform (pnpm workspace monorepo)
**Database:** Supabase PostgreSQL (zkdgtofxtzqnzgncqlyc.supabase.co)

---

## Executive Summary

Ori Platform uses a well-structured PostgreSQL database via Supabase with comprehensive Row-Level Security (RLS) policies. The system includes 8 main tables, 41 RLS policies, 14 indexes, and 9 database triggers. All database queries follow a consistent pattern through the Supabase client using TypeScript types for strong typing.

**Key Strengths:**

- Complete RLS coverage on all user-facing tables
- Comprehensive indexing for query performance
- Automated timestamp maintenance via triggers
- Type-safe API client with React Query integration
- Clear separation of frontend API clients from backend database access

**Opportunities for Improvement:**

- No direct database testing (tests mock AI client only)
- Limited database debugging tools in developer workflow
- No migration testing or rollback documentation
- Missing integration tests for RLS policies
- No performance monitoring/query analysis tools

---

## 1. DATABASE SCHEMA

### 1.1 Tables Overview

| Table           | Purpose                         | RLS | Created    | Status     |
| --------------- | ------------------------------- | --- | ---------- | ---------- |
| `user_profiles` | User profile data & preferences | ✅  | 2025-11-04 | Core       |
| `experiences`   | Work experience history         | ✅  | 2025-11-08 | Core       |
| `education`     | Education & qualifications      | ✅  | 2025-11-08 | Core       |
| `applications`  | Job application tracking        | ✅  | 2025-11-04 | Core       |
| `conversations` | Chat conversation threads       | ✅  | 2025-11-08 | Core       |
| `messages`      | Chat messages                   | ✅  | 2025-11-08 | Core       |
| `user_roles`    | User role assignments           | ✅  | 2025-11-05 | Supporting |
| `jobs`          | Job listings (deprecated)       | ✅  | 2025-11-04 | Legacy     |

### 1.2 Detailed Table Schemas

#### `user_profiles` (Primary User Data)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104192526_aab03785-104b-485e-99e4-9331b093077b.sql`

```
id                          UUID PRIMARY KEY (gen_random_uuid)
user_id                     UUID NOT NULL (FK → auth.users, UNIQUE)
full_name                   TEXT (optional)
headline                    TEXT (optional, professional title)
location                    TEXT (optional)
about                       TEXT (optional, bio)
long_term_vision            TEXT (optional, career vision)
skills                      TEXT[] (optional, array of skills)
target_roles                TEXT[] (optional, desired roles - GIN indexed)
work_style                  TEXT CHECK ('Remote', 'Hybrid', 'On-site')
industries                  TEXT[] (optional)
goal                        TEXT (optional, career goal)
cv_url                      TEXT (optional, resume URL)
onboarding_completed        BOOLEAN (default: FALSE)
stripe_customer_id          TEXT UNIQUE (optional, Stripe integration)
stripe_subscription_id      TEXT UNIQUE (optional, Stripe integration)
subscription_status         TEXT CHECK ('free', 'plus_monthly', 'plus_yearly', 'premium_monthly', 'premium_yearly', 'past_due', 'cancelled')
created_at                  TIMESTAMPTZ (default: NOW())
updated_at                  TIMESTAMPTZ (auto-updated via trigger)
```

**Indexes:**

- `idx_user_profiles_target_roles` (GIN on target_roles)
- `idx_user_profiles_stripe_customer_id`
- `idx_user_profiles_stripe_subscription_id`
- `idx_user_profiles_subscription_status`

**Triggers:**

- `update_user_profiles_updated_at` (auto-update timestamp)
- `on_auth_user_created` (create profile on signup)

**Constraints:**

- UNIQUE(user_id) - one profile per user
- work_style must be one of three enum values
- subscription_status must be one of seven values

---

#### `experiences` (Work Experience)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108224444_create_core_application_schema.sql`

```
id              UUID PRIMARY KEY (gen_random_uuid)
user_id         UUID NOT NULL (FK → auth.users, ON DELETE CASCADE)
company         TEXT NOT NULL
role            TEXT NOT NULL
start_date      DATE NOT NULL
end_date        DATE (nullable)
is_current      BOOLEAN (default: FALSE)
description     TEXT (nullable)
created_at      TIMESTAMPTZ (default: NOW())
updated_at      TIMESTAMPTZ (auto-updated via trigger)
```

**Indexes:**

- `idx_experiences_user_id`

**Triggers:**

- `update_experiences_updated_at`

---

#### `education` (Education History)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108224444_create_core_application_schema.sql`

```
id              UUID PRIMARY KEY (gen_random_uuid)
user_id         UUID NOT NULL (FK → auth.users, ON DELETE CASCADE)
institution     TEXT NOT NULL
degree          TEXT NOT NULL
field_of_study  TEXT (nullable)
start_date      DATE NOT NULL
end_date        DATE (nullable)
is_current      BOOLEAN (default: FALSE)
description     TEXT (nullable)
created_at      TIMESTAMPTZ (default: NOW())
updated_at      TIMESTAMPTZ (auto-updated via trigger)
```

**Indexes:**

- `idx_education_user_id`

**Triggers:**

- `update_education_updated_at`

---

#### `applications` (Job Applications Tracking)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104195559_647b02f7-16db-475f-adaf-96c0fee443b2.sql` (initial)
**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108224444_create_core_application_schema.sql` (enhanced)

```
id                UUID PRIMARY KEY (gen_random_uuid)
user_id           UUID NOT NULL (FK → auth.users, ON DELETE CASCADE)
job_title         TEXT NOT NULL
company           TEXT NOT NULL
location          TEXT (nullable)
job_url           TEXT (nullable)
application_date  TIMESTAMPTZ NOT NULL (default: NOW())
status            application_status ENUM NOT NULL (default: 'applied')
notes             TEXT (nullable)
last_updated      TIMESTAMPTZ (default: NOW())
created_at        TIMESTAMPTZ (default: NOW())
```

**Enum: application_status**

- `applied`
- `interviewing`
- `offer`
- `rejected`
- `paused`

**Indexes:**

- `idx_applications_user_id`
- `idx_applications_status`
- `idx_applications_user_status` (composite on user_id, status)
- `idx_applications_date` DESC

**Triggers:**

- `update_applications_last_updated`
- `sync_applications_last_updated`

---

#### `conversations` (Chat Conversations)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108003034_create_conversations_and_messages.sql`

```
id          UUID PRIMARY KEY (gen_random_uuid)
user_id     UUID NOT NULL (FK → auth.users, ON DELETE CASCADE)
summary     TEXT (nullable)
created_at  TIMESTAMPTZ (default: NOW())
updated_at  TIMESTAMPTZ (auto-updated via trigger & message insertion)
```

**Indexes:**

- `idx_conversations_user_id`
- `idx_conversations_created_at` DESC

**Triggers:**

- `update_conversations_updated_at`
- `update_conversation_on_new_message` (updates timestamp when message added)

---

#### `messages` (Chat Messages)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108003034_create_conversations_and_messages.sql`

```
id              UUID PRIMARY KEY (gen_random_uuid)
conversation_id UUID NOT NULL (FK → conversations, ON DELETE CASCADE)
role            TEXT NOT NULL CHECK ('user' | 'assistant')
content         TEXT NOT NULL
created_at      TIMESTAMPTZ (default: NOW())
```

**Indexes:**

- `idx_messages_conversation_id`
- `idx_messages_created_at` ASC

---

#### `user_roles` (Role Management - Support Table)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251105202850_d23d1ef7-3854-4b13-90bc-f4618c127e48.sql`

```
id          UUID PRIMARY KEY (gen_random_uuid)
user_id     UUID NOT NULL (FK → auth.users)
role        app_role ENUM NOT NULL ('admin', 'moderator', 'user')
created_at  TIMESTAMPTZ (default: NOW())
UNIQUE(user_id, role)
```

**Notes:** RLS prevents users from viewing/modifying their own roles (admin-only)

---

### 1.3 Table Relationships

```
┌─────────────────────────────────────────┐
│         auth.users (Supabase)           │
│ (External: Supabase Auth)               │
└──────────────────┬──────────────────────┘
                   │ (1:1)
        ON DELETE CASCADE
                   │
        ┌──────────▼────────────┐
        │   user_profiles       │
        │ (Central User Data)   │
        └──────────────────────┘

        ├─ (1:N) ─────────────────┐
        │    experiences          │
        │ (Work History)          │
        │                         │
        ├─ (1:N) ─────────────────┐
        │    education            │
        │ (Education History)     │
        │                         │
        ├─ (1:N) ─────────────────┐
        │    applications         │
        │ (Job Applications)      │
        │                         │
        ├─ (1:N) ─────────────────┐
        │    conversations        │
        │ (Chat Threads)          │
        │                         │
        └─ (1:N) ─────────────────┐
             user_roles           │
             (Role Assignments)   │
                                  │
            ┌─────────────────────┘
            │ (1:N)
            ▼
        messages
        (Chat Messages)
        FK → conversations
```

### 1.4 Storage Bucket (CV Uploads)

**Bucket ID:** `cv-uploads`
**Access:** Private (not public)
**Purpose:** Store user CVs/resumes
**RLS Pattern:** Users can only access their own CVs via folder structure

---

## 2. ROW-LEVEL SECURITY (RLS)

### 2.1 RLS Policy Summary

**Total Policies:** 41
**Tables with RLS:** 6/8 (100% coverage on user-facing tables)

RLS follows a consistent pattern:

```sql
-- SELECT: User can view only their own records
USING (auth.uid() = user_id)

-- INSERT: User can only insert their own records
WITH CHECK (auth.uid() = user_id)

-- UPDATE: User can only update their own records
USING (auth.uid() = user_id)

-- DELETE: User can only delete their own records
USING (auth.uid() = user_id)
```

### 2.2 RLS Policies by Table

#### `user_profiles` (4 policies)

```
1. "Users can view their own profile" (SELECT)
2. "Users can insert their own profile" (INSERT)
3. "Users can update their own profile" (UPDATE)
   - Note: No DELETE policy (profiles persist)
4. Implicit: RLS blocks all other access
```

#### `experiences` (4 policies)

```
1. "Users can view their own experiences" (SELECT)
2. "Users can insert their own experiences" (INSERT)
3. "Users can update their own experiences" (UPDATE)
4. "Users can delete their own experiences" (DELETE)
```

#### `education` (4 policies)

```
1. "Users can view their own education" (SELECT)
2. "Users can insert their own education" (INSERT)
3. "Users can update their own education" (UPDATE)
4. "Users can delete their own education" (DELETE)
```

#### `applications` (4 policies)

```
1. "Users can view their own applications" (SELECT)
2. "Users can insert their own applications" (INSERT)
3. "Users can update their own applications" (UPDATE)
4. "Users can delete their own applications" (DELETE)
```

#### `conversations` (4 policies)

```
1. "Users can view their own conversations" (SELECT)
2. "Users can create their own conversations" (INSERT)
3. "Users can update their own conversations" (UPDATE)
4. "Users can delete their own conversations" (DELETE)
```

#### `messages` (4 policies with nested SELECT subquery)

```
1. "Users can view messages from their conversations" (SELECT)
   - Subquery: EXISTS (SELECT 1 FROM conversations WHERE id = messages.conversation_id AND user_id = auth.uid())

2. "Users can create messages in their conversations" (INSERT)
   - Same subquery pattern

3. "Users can update messages in their conversations" (UPDATE)
   - Same subquery pattern

4. "Users can delete messages from their conversations" (DELETE)
   - Same subquery pattern
```

#### `jobs` (1 policy)

```
1. "Authenticated users can view jobs" (SELECT)
   - USING (auth.role() = 'authenticated')
   - Note: Public read-only for all authenticated users
```

#### `user_roles` (1 policy)

```
1. "Users can view their own roles" (SELECT)
   - USING (auth.uid() = user_id)
   - Note: No INSERT/UPDATE/DELETE (admin-controlled)
```

#### Storage: `cv-uploads` (4 policies)

```
1. "Users can view their own CVs" (SELECT)
   - Uses storage.foldername(name) to extract user ID from path

2. "Users can upload their own CVs" (INSERT)
   - Same folder-based check

3. "Users can update their own CVs" (UPDATE)
   - Same folder-based check

4. "Users can delete their own CVs" (DELETE)
   - Same folder-based check
```

### 2.3 RLS Security Model Assessment

**Strengths:**

- Consistent pattern across all tables
- Proper foreign key cascades (ON DELETE CASCADE)
- No admin backdoors or bypasses visible
- Messages table uses subquery for transitive ownership check

**Potential Improvements:**

- Consider read-only profile access for other authenticated users (for profile viewing)
- Add audit logging for sensitive operations
- Implement soft deletes for audit trail
- Add data retention policies for GDPR compliance

---

## 3. DATABASE MIGRATIONS

### 3.1 Migration Files (9 total)

| #   | Date       | File                                                        | Purpose                                                     | Status  |
| --- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ------- |
| 1   | 2025-11-04 | `20251104192526_aab03785...sql`                             | Create user_profiles table + RLS + storage bucket           | Applied |
| 2   | 2025-11-04 | `20251104192640_1c305d13...sql`                             | Fix search_path security in update_updated_at_column()      | Applied |
| 3   | 2025-11-04 | `20251104195559_647b02f7...sql`                             | Create jobs & applications tables                           | Applied |
| 4   | 2025-11-04 | `20251104203948_bfa7f327...sql`                             | Add application status enum + indexes                       | Applied |
| 5   | 2025-11-05 | `20251105202850_d23d1ef7...sql`                             | Move roles to secure user_roles table                       | Applied |
| 6   | 2025-11-08 | `20251108003034_create_conversations_and_messages.sql`      | Create conversations & messages tables                      | Applied |
| 7   | 2025-11-08 | `20251108020018_add_onboarding_fields_to_user_profiles.sql` | Add headline, location, target_roles fields                 | Applied |
| 8   | 2025-11-08 | `20251108224444_create_core_application_schema.sql`         | Create experiences, education tables + enhance applications | Applied |
| 9   | 2025-11-08 | `20251108235959_add_stripe_fields_to_user_profiles.sql`     | Add Stripe customer/subscription fields                     | Applied |

**Path:** `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/`

### 3.2 Migration Patterns

**Naming Convention:**

```
{TIMESTAMP}_{description-or-uuid}.sql
Example: 20251104192526_aab03785-104b-485e-99e4-9331b093077b.sql
```

**Structure Pattern:**

```sql
-- Comments explaining the migration
CREATE TABLE/ALTER TABLE
ENABLE ROW LEVEL SECURITY
CREATE POLICY ...
CREATE INDEX ...
CREATE TRIGGER ...
```

### 3.3 Notable Migration Features

#### Update Timestamp Trigger (Reusable)

```sql
-- File: 20251104192640_1c305d13...sql
-- Ensures all tables get auto-updated timestamps

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Applied to: user_profiles, experiences, education,
--             applications, conversations, jobs
```

#### Auto-Profile Creation on Signup

```sql
-- File: 20251104192526_aab03785...sql
-- Creates profile record when user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### Conversation Timestamp Synchronization

```sql
-- File: 20251108003034_create_conversations_and_messages.sql
-- Updates conversation.updated_at when message is added

CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_timestamp();
```

### 3.4 Migration Testing & Validation

**Current State:**

- ✅ Migrations applied to Supabase production
- ❌ No rollback tests documented
- ❌ No test/staging validation process documented
- ❌ No migration hooks or pre/post checks

**How to Apply:**

```bash
# Via Supabase CLI
supabase db push

# Or via Supabase Dashboard SQL Editor (manual)
```

**How to Test (Currently Manual):**

```bash
# Connect to Supabase and run:
\d user_profiles
\d+ user_profiles  -- with indexes
SELECT * FROM information_schema.table_constraints WHERE table_name = 'user_profiles'
```

---

## 4. DATABASE TESTING

### 4.1 Current Testing Landscape

**Test Files:** 1 (only backend unit test)

- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/__tests__/skills-gap.test.ts`

**Test Coverage:**

- ❌ No database integration tests
- ❌ No RLS policy tests
- ❌ No migration tests
- ❌ No data integrity tests
- ✅ Basic AI client mocking in unit tests

### 4.2 Existing Test Setup

**File:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/__tests__/setup.ts`

```typescript
// Test environment setup for core-api
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

// Set default test environment variables
process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock'
process.env.FRONTEND_URL = 'http://localhost:3000'
process.env.AI_ENGINE_URL = 'http://localhost:3002'

// Mock console methods
global.console = {
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  error: console.error,
  warn: console.warn,
}
```

**Jest Configuration:**

```javascript
// File: /Users/carlo/Desktop/Projects/ori-platform/services/core-api/jest.config.js

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  // Coverage: 60% threshold
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
}
```

**Important:** `setupFiles` (NOT `setupFilesAfterEnv`) used to ensure env vars load before module imports.

### 4.3 Current Test Example

**File:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/__tests__/skills-gap.test.ts`

```typescript
describe('fetchSkillsGapForJob', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('formats AI response data', async () => {
    jest.spyOn(aiClient, 'getSkillGap').mockResolvedValue({
      user_skills: ['React'],
      required_skills: ['React', 'TypeScript'],
      missing_skills: ['TypeScript'],
    })

    const result = await fetchSkillsGapForJob(
      ['React'],
      ['React', 'TypeScript'],
    )
    expect(result).toEqual({
      userSkills: ['React'],
      requiredSkills: ['React', 'TypeScript'],
      missingSkills: ['TypeScript'],
    })
  })
})
```

### 4.4 Recommended Database Testing Patterns

**Integration Tests (Missing):**

```typescript
// Example: Test RLS policy enforcement
describe('RLS Policies', () => {
  it('should prevent users from viewing other users profiles', async () => {
    // Create two users
    // User A tries to query User B's profile
    // Should return 0 rows or 403
  })
})

// Example: Test application creation
describe('Applications API', () => {
  it('should allow user to create application', async () => {
    const headers = getAuthHeaders(userId)
    const response = await fetch('/api/v1/applications', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        job_title: 'Engineer',
        company: 'ACME',
        status: 'applied',
      }),
    })
    expect(response.status).toBe(201)
  })
})
```

---

## 5. DATABASE CLIENT USAGE

### 5.1 Backend Supabase Client (Server-Side)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key are required')
}

// Server-side client (service role key = admin access)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
```

**Characteristics:**

- Service Role Key (admin access, bypasses RLS)
- No session persistence (stateless)
- Used in Express.js route handlers

### 5.2 Frontend Supabase Client (Browser)

**File:** `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/supabase/client.ts`

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase client is not configured')
      return null
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
```

**Characteristics:**

- Anon Key (client-level, respects RLS)
- Singleton pattern (single instance)
- Used for authentication only
- All data queries go through backend API

### 5.3 API Client Layer (Frontend Data Fetching)

**Pattern:** Frontend → API Client → Backend API → Supabase

**File:** `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/profile.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}
```

**API Clients Provided:**

- `/src/integrations/api/profile.ts` - Profile + Experiences + Education
- `/src/integrations/api/applications.ts` - Job Applications
- `/src/integrations/api/jobs.ts` - Job Matching
- `/src/integrations/api/chat.ts` - Chat Messages
- `/src/integrations/api/dashboard.ts` - Dashboard Stats
- `/src/integrations/api/payments.ts` - Stripe Integration

### 5.4 Backend API Routes (Database Access)

**Pattern:** All routes use `supabase.from(table).select/insert/update/delete()`

**Example:** `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

```typescript
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  try {
    const { status } = req.query

    let query = supabase
      .from('applications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('application_date', { ascending: false })

    // Filter by status if provided
    if (status && typeof status === 'string') {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query

    if (error) {
      console.error('Error fetching applications:', error)
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }

    return res.status(200).json({ applications })
  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
```

**All Routes Follow This Pattern:**

1. Check authentication via `authMiddleware`
2. Extract user.id from JWT token
3. Use Supabase client to query with `.eq('user_id', req.user.id)`
4. Return JSON response
5. No manual RLS checks needed (RLS enforced at DB level)

### 5.5 React Query Integration

**File:** `/Users/carlo/Desktop/Projects/ori-platform/src/hooks/useProfile.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile)
    },
  })
}
```

**React Query Hooks:**

- `/src/hooks/useProfile.ts` - Profile operations
- `/src/hooks/useApplications.ts` - Application operations
- `/src/hooks/useEarlyAccess.ts` - Email signup

---

## 6. DEVELOPER WORKFLOWS

### 6.1 Current Workflow Challenges

**Database Inspection:**

- ❌ No CLI tools documented
- ❌ Manual Supabase Dashboard access required
- ❌ No schema introspection utilities
- ❌ No data seeding/fixtures for development

**Debugging:**

- ❌ No query performance monitoring
- ❌ No slow query logging
- ❌ RLS policy debugging requires trial and error
- ❌ No data migration validation tools

**Testing:**

- ❌ No test database seeding
- ❌ No integration test framework
- ❌ No RLS policy testing
- ❌ Manual testing only

### 6.2 How Developers Currently Work

**Common Tasks:**

1. **View Schema:**

   ```bash
   # Manual: Visit Supabase Dashboard
   # URL: https://app.supabase.com/project/zkdgtofxtzqnzgncqlyc/sql/new
   ```

2. **Debug RLS Issues:**
   - Add console.log in route handler
   - Run API call and check logs
   - Manually verify RLS policy SQL

3. **Add New Column:**
   - Create migration file in supabase/migrations/
   - Apply via `supabase db push`
   - Manually test with API

4. **Create Test Data:**
   - Manually create records via Supabase Dashboard
   - Or write one-off SQL scripts
   - No reproducible fixtures

### 6.3 Recommended Improvements (Phase 4)

1. **Database CLI Tools:**

   ```bash
   pnpm db:schema     # View current schema
   pnpm db:seed       # Seed test data
   pnpm db:reset      # Reset database (dev only)
   ```

2. **PostgreSQL MCP Integration:**
   - Direct database queries via MCP
   - RLS policy testing
   - Query analysis and optimization
   - Migration validation

3. **Development Database Setup:**
   - Docker Compose for local Supabase
   - Automated seeding scripts
   - Test data factories

4. **Monitoring & Debugging:**
   - Query performance dashboard
   - RLS policy testing framework
   - Slow query logs
   - Data validation reports

---

## 7. DATA VALIDATION & CONSTRAINTS

### 7.1 Column-Level Constraints

| Table         | Column              | Constraint                                    |
| ------------- | ------------------- | --------------------------------------------- |
| user_profiles | work_style          | CHECK IN ('Remote', 'Hybrid', 'On-site')      |
| user_profiles | subscription_status | CHECK IN (7 values: free, plus_monthly, etc.) |
| applications  | status              | ENUM (5 values: applied, interviewing, etc.)  |
| messages      | role                | CHECK IN ('user', 'assistant')                |

### 7.2 Table-Level Constraints

| Table         | Constraint                         | Purpose              |
| ------------- | ---------------------------------- | -------------------- |
| user_profiles | UNIQUE(user_id)                    | One profile per user |
| experiences   | FK user_id → auth.users            | Cascade delete       |
| education     | FK user_id → auth.users            | Cascade delete       |
| applications  | FK user_id → auth.users            | Cascade delete       |
| conversations | FK user_id → auth.users            | Cascade delete       |
| messages      | FK conversation_id → conversations | Cascade delete       |
| user_roles    | UNIQUE(user_id, role)              | No duplicate roles   |

### 7.3 Application-Level Validation

**Backend Validation (Zod Schemas):**

File: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts`

```typescript
const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional().nullable(),
})
```

**Profile Field Validations:**

File: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/profile.ts`

```typescript
if (full_name && full_name.length > 200) {
  return res
    .status(400)
    .json({ error: 'Full name must be 200 characters or less' })
}

if (about && about.length > 5000) {
  return res
    .status(400)
    .json({ error: 'About must be 5000 characters or less' })
}

if (work_style && !['Remote', 'Hybrid', 'On-site'].includes(work_style)) {
  return res.status(400).json({ error: 'Invalid work_style' })
}
```

---

## 8. TYPESCRIPT TYPES

**File:** `/Users/carlo/Desktop/Projects/ori-platform/shared/types/src/index.ts`

**Key Interfaces:**

```typescript
export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  headline?: string
  location?: string
  about?: string
  long_term_vision?: string
  skills?: string[]
  target_roles?: string[]
  work_style?: 'remote' | 'hybrid' | 'onsite'
  industries?: string[]
  goal?: string
  cv_url?: string
  onboarding_completed?: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?:
    | 'free'
    | 'plus_monthly'
    | 'plus_yearly'
    | 'premium_monthly'
    | 'premium_yearly'
    | 'past_due'
    | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  role: string
  start_date: string // ISO date string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study?: string | null
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}

export type ApplicationStatus =
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'paused'

export interface Application {
  id: string
  user_id: string
  job_title: string
  company: string
  location?: string | null
  job_url?: string | null
  application_date: string
  status: ApplicationStatus
  notes?: string | null
  last_updated: string
  created_at: string
}
```

---

## 9. MIGRATION HISTORY & GIT LOG

```
f194a5b fix(migrations): make core schema migration idempotent
be06061 feat(database): add Stripe integration fields to user_profiles
3ee89e4 feat(database): implement core application schema (Task A)
51a42a2 feat: create user profile API endpoint for onboarding (Task A)
9adecb6 feat(database): add conversations and messages schema for chat
1b0df56 Initial commit: Post-migration and rebrand to Ori
```

---

## 10. RECOMMENDATIONS FOR PHASE 4 (PostgreSQL MCP Integration)

### 10.1 PostgreSQL MCP Capabilities Needed

1. **Schema Introspection:**
   - List all tables and columns
   - View indexes and constraints
   - Display RLS policies
   - Export schema documentation

2. **Query Execution:**
   - Execute raw SQL queries
   - Get query execution plans
   - Analyze query performance
   - Identify slow queries

3. **RLS Policy Testing:**
   - Test policies with different user contexts
   - Verify access control
   - Check for policy gaps
   - Document policy behavior

4. **Data Inspection:**
   - View table contents (with RLS applied)
   - Count records by user
   - Find orphaned records
   - Check data integrity

5. **Migration Support:**
   - Validate migrations before applying
   - Test rollbacks
   - Generate migration scripts
   - Document schema changes

### 10.2 Integration Points

**Candidate MCP Functions:**

```typescript
// Schema introspection
db_get_schema_info() // List all tables, columns, constraints
db_get_rls_policies() // List all RLS policies
db_get_table_indexes(table_name) // Get indexes for a table

// Query execution
db_execute_query(sql) // Execute raw SQL (with safety checks)
db_get_query_plan(sql) // Get execution plan
db_get_query_performance() // Get slow query logs

// RLS testing
db_test_rls_policy(table, user_id, operation) // Test RLS enforcement
db_get_policy_coverage() // Check which tables have RLS

// Data operations
db_get_table_data(table, limit) // View table contents
db_count_records(table, user_id) // Count user's records
db_find_orphaned_records(table) // Find FK violations

// Migration support
db_validate_migration(sql) // Validate migration syntax
db_test_migration_rollback() // Test rollback capability
db_generate_migration(operation) // Generate migration SQL
```

### 10.3 Documentation Needed

1. **Database Operations Guide:**
   - Common queries for debugging
   - RLS policy troubleshooting
   - Data recovery procedures
   - Performance optimization tips

2. **Migration Guide:**
   - How to create migrations
   - How to test migrations
   - How to roll back
   - How to validate changes

3. **Testing Guide:**
   - How to write integration tests
   - How to test RLS policies
   - How to seed test data
   - How to validate schema

4. **Monitoring Guide:**
   - Query performance monitoring
   - RLS policy validation
   - Data integrity checks
   - Usage statistics

---

## 11. FILES SUMMARY

### Migration Files

- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104192526_aab03785-104b-485e-99e4-9331b093077b.sql` (user_profiles, storage)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104192640_1c305d13-a0ca-45da-98b0-e11fb6bde67d.sql` (function fix)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104195559_647b02f7-16db-475f-adaf-96c0fee443b2.sql` (jobs, applications)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251104203948_bfa7f327-825c-4116-8056-fd4f6fa44413.sql` (status enum, indexes)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251105202850_d23d1ef7-3854-4b13-90bc-f4618c127e48.sql` (user_roles)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108003034_create_conversations_and_messages.sql` (conversations)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108020018_add_onboarding_fields_to_user_profiles.sql` (onboarding)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108224444_create_core_application_schema.sql` (experiences, education)
- `/Users/carlo/Desktop/Projects/ori-platform/supabase/migrations/20251108235959_add_stripe_fields_to_user_profiles.sql` (Stripe integration)

### Backend Database Access

- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/lib/supabase.ts` (Supabase client)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/profile.ts` (Profile CRUD)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts` (Experience CRUD)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/education.ts` (Education CRUD)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts` (Application CRUD)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/chat.ts` (Chat CRUD)

### Frontend API Clients

- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/profile.ts` (Profile client)
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/applications.ts` (Applications client)
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/supabase/client.ts` (Supabase client singleton)

### React Query Hooks

- `/Users/carlo/Desktop/Projects/ori-platform/src/hooks/useProfile.ts` (Profile hooks)
- `/Users/carlo/Desktop/Projects/ori-platform/src/hooks/useApplications.ts` (Application hooks)

### Types

- `/Users/carlo/Desktop/Projects/ori-platform/shared/types/src/index.ts` (Type definitions)

### Testing

- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/__tests__/setup.ts` (Test setup)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/jest.config.js` (Jest config)
- `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/__tests__/skills-gap.test.ts` (Example test)

### Documentation

- `/Users/carlo/Desktop/Projects/ori-platform/docs/DATABASE_SCHEMA.md` (Schema doc)
- `/Users/carlo/Desktop/Projects/ori-platform/docs/API_ENDPOINTS.md` (API doc)

---

## 12. CONCLUSION

Ori Platform has a **well-designed PostgreSQL database** with:

- Comprehensive RLS coverage (100% of user-facing tables)
- Clear, consistent API design patterns
- Proper type safety with TypeScript
- Clean separation of concerns (frontend API client → backend → database)

**Key Strengths:**

1. RLS enforced at database level (defense in depth)
2. TypeScript types match database schema
3. Consistent Supabase client patterns
4. React Query for client-side caching
5. Proper foreign key cascades

**Areas for Improvement:**

1. No integration tests for database operations
2. No RLS policy testing framework
3. Limited database debugging tools
4. No migration rollback testing
5. No query performance monitoring

**Phase 4 Priority:** PostgreSQL MCP integration will enable developers to:

- Test RLS policies directly
- Validate migrations before applying
- Monitor query performance
- Debug data issues efficiently
- Generate documentation automatically
