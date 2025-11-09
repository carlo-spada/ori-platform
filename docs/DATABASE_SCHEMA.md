# Database Schema Reference

**Last Updated:** 2025-11-08
**Database:** Supabase PostgreSQL

---

## Tables Overview

| Table           | Purpose                           | RLS Enabled |
| --------------- | --------------------------------- | ----------- |
| `user_profiles` | User profile data and preferences | ✅          |
| `experiences`   | Work experience history           | ✅          |
| `education`     | Education and qualifications      | ✅          |
| `applications`  | Job application tracking          | ✅          |
| `conversations` | Chat conversation threads         | ✅          |
| `messages`      | Chat messages                     | ✅          |

---

## user_profiles

**Purpose:** Complete user profile including onboarding data and preferences

**Key Columns:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users, UNIQUE)
- `full_name` (TEXT) - User's full name
- `headline` (TEXT) - Professional headline
- `location` (TEXT) - Current/preferred location
- `about` (TEXT) - Bio/about section
- `long_term_vision` (TEXT) - Career vision/goals
- `skills` (TEXT[]) - User's skills
- `target_roles` (TEXT[]) - Desired roles
- `roles` (TEXT[]) - Current/past roles
- `work_style` (TEXT) - Remote/Hybrid/On-site
- `industries` (TEXT[]) - Target industries
- `goal` (TEXT) - Career goal
- `cv_url` (TEXT) - Resume URL
- `onboarding_completed` (BOOLEAN)

**Indexes:**

- `idx_user_profiles_target_roles` (GIN) on target_roles

**RLS:** Users can view/update only their own profile

---

## experiences

**Purpose:** User work experience and employment history

**Schema:**

```sql
id              UUID (PK, default: gen_random_uuid())
user_id         UUID (FK → auth.users, ON DELETE CASCADE)
company         TEXT (NOT NULL)
role            TEXT (NOT NULL)
start_date      DATE (NOT NULL)
end_date        DATE (nullable)
is_current      BOOLEAN (default: false)
description     TEXT (nullable)
created_at      TIMESTAMPTZ (default: NOW())
updated_at      TIMESTAMPTZ (default: NOW())
```

**Indexes:**

- `idx_experiences_user_id` on user_id

**RLS:** Users can CRUD only their own experiences

---

## education

**Purpose:** User education history and qualifications

**Schema:**

```sql
id              UUID (PK, default: gen_random_uuid())
user_id         UUID (FK → auth.users, ON DELETE CASCADE)
institution     TEXT (NOT NULL)
degree          TEXT (NOT NULL)
field_of_study  TEXT (nullable)
start_date      DATE (NOT NULL)
end_date        DATE (nullable)
is_current      BOOLEAN (default: false)
description     TEXT (nullable)
created_at      TIMESTAMPTZ (default: NOW())
updated_at      TIMESTAMPTZ (default: NOW())
```

**Indexes:**

- `idx_education_user_id` on user_id

**RLS:** Users can CRUD only their own education records

---

## applications

**Purpose:** Job applications tracked by users

**Schema:**

```sql
id                UUID (PK, default: gen_random_uuid())
user_id           UUID (FK → auth.users, ON DELETE CASCADE)
job_title         TEXT (NOT NULL)
company           TEXT (NOT NULL)
location          TEXT (nullable)
job_url           TEXT (nullable)
application_date  TIMESTAMPTZ (NOT NULL, default: NOW())
status            application_status (NOT NULL, default: 'applied')
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

- `idx_applications_user_id` on user_id
- `idx_applications_status` on status
- `idx_applications_user_status` on (user_id, status)
- `idx_applications_date` on application_date DESC

**RLS:** Users can CRUD only their own applications

---

## conversations

**Purpose:** Chat conversation threads

**Schema:**

```sql
id          UUID (PK)
user_id     UUID (FK → auth.users)
summary     TEXT (nullable)
created_at  TIMESTAMPTZ (default: NOW())
updated_at  TIMESTAMPTZ (default: NOW())
```

**RLS:** Users can CRUD only their own conversations

---

## messages

**Purpose:** Individual chat messages

**Schema:**

```sql
id               UUID (PK)
conversation_id  UUID (FK → conversations)
role             TEXT ('user' | 'assistant')
content          TEXT (NOT NULL)
created_at       TIMESTAMPTZ (default: NOW())
```

**RLS:** Users can SELECT/INSERT messages only for their own conversations

---

## Migrations

**Migration Files:**

1. `20251104192526_*.sql` - Initial user_profiles table
2. `20251108003034_*.sql` - Conversations and messages tables
3. `20251108020018_*.sql` - Onboarding fields (headline, location, target_roles)
4. `20251108224444_*.sql` - Core schema (experiences, education, applications) ⭐ NEW

**Applying Migrations:**

```bash
# Via Supabase CLI (when connected to project)
supabase db push

# Or apply manually via Supabase Dashboard SQL Editor
```

---

## TypeScript Types

**Location:** `shared/types/src/index.ts`

**Exports:**

- `UserProfile`
- `Experience`
- `Education`
- `Application`
- `ApplicationStatus`
- `Conversation`
- `ChatMessage`

**Usage:**

```typescript
import type { UserProfile, Experience, Application } from '@ori/types'
```

---

## Security

**Row Level Security (RLS):** Enabled on ALL tables

**Policy Pattern:** All tables follow the same RLS pattern:

```sql
-- Users can only access their own data
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

**Foreign Key Cascades:** All user data is deleted when user account is deleted (`ON DELETE CASCADE`)

---

## Next Steps

1. **Task B:** Create backend CRUD APIs for these tables
2. **Task C:** Connect frontend to real APIs (remove mock data)
3. **Task D:** Implement dashboard with real statistics
