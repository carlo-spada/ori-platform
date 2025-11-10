# PostgreSQL Database Quick Reference - Ori Platform

## Essential Stats

- **Tables:** 8 (6 user-facing, 2 supporting)
- **RLS Policies:** 41 (100% coverage)
- **Indexes:** 14
- **Triggers:** 9
- **Migrations:** 9 files
- **Database:** Supabase PostgreSQL (zkdgtofxtzqnzgncqlyc.supabase.co)

---

## Quick Links

### Core Tables

| Table           | Purpose           | Rows per User |
| --------------- | ----------------- | ------------- |
| `user_profiles` | Main user data    | 1             |
| `experiences`   | Work history      | N             |
| `education`     | Education history | N             |
| `applications`  | Job applications  | N             |
| `conversations` | Chat threads      | N             |
| `messages`      | Chat messages     | N             |

### Common Queries (for debugging)

**Check user's data:**

```sql
-- Profile
SELECT * FROM user_profiles WHERE user_id = 'USER_UUID';

-- All experiences
SELECT * FROM experiences WHERE user_id = 'USER_UUID';

-- All applications
SELECT * FROM applications WHERE user_id = 'USER_UUID';

-- Count messages in conversation
SELECT COUNT(*) FROM messages WHERE conversation_id = 'CONV_UUID';
```

**Check RLS enforcement:**

```sql
-- View RLS policies on a table
SELECT * FROM pg_policies WHERE tablename = 'applications';

-- List all RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies
WHERE schemaname = 'public' ORDER BY tablename;
```

**Check indexes:**

```sql
-- View indexes on a table
SELECT indexname FROM pg_indexes
WHERE tablename = 'applications';
```

---

## API Client Pattern (Frontend)

```typescript
// 1. API client function (src/integrations/api/*.ts)
export async function fetchApplications(): Promise<Application[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/v1/applications`, {
    method: 'GET',
    headers,
  })
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
}

// 2. React Query hook (src/hooks/use*.ts)
export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 1000 * 60 * 5,
  })
}

// 3. Use in component
const { data: apps, isLoading } = useApplications()
```

---

## Backend Route Pattern (API)

```typescript
// services/core-api/src/routes/applications.ts
import { supabase } from '../lib/supabase.js'

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', req.user.id) // RLS enforced by this

    if (error) throw error
    return res.status(200).json({ applications: data })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})
```

---

## Database Access Checklist

Before querying the database:

- [ ] User authenticated? (middleware checks this)
- [ ] Add `.eq('user_id', req.user.id)` to Supabase query
- [ ] RLS will reject requests if user_id mismatch (defense in depth)
- [ ] Return `{ data, error }` from Supabase
- [ ] Check error and return 500 if present
- [ ] Never catch and hide database errors in production

---

## RLS Security Model

**Every table follows this pattern:**

```sql
-- Users can ONLY access their own records
CREATE POLICY "policy_name" ON table_name
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "policy_name" ON table_name
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "policy_name" ON table_name
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "policy_name" ON table_name
FOR DELETE USING (auth.uid() = user_id);
```

**Exception:** `messages` table uses subquery to check conversation ownership.

---

## Migration Workflow

**Create new migration:**

```bash
# File: supabase/migrations/TIMESTAMP_description.sql
CREATE TABLE IF NOT EXISTS public.my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ...
);

ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own records" ON public.my_table
FOR SELECT USING (auth.uid() = user_id);
```

**Apply migration:**

```bash
supabase db push
```

---

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`services/core-api/.env`)

```env
SUPABASE_URL=https://zkdgtofxtzqnzgncqlyc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...  # Admin access
STRIPE_SECRET_KEY=...
```

---

## Common Debugging

**"User not authenticated"**

- Check if JWT token in Authorization header
- Verify `getAuthHeaders()` is called before fetch

**"Failed to fetch [data]"**

- Check RLS policy on table
- Verify `.eq('user_id', req.user.id)` in query
- Check if column `user_id` exists in table

**"No policy exists for SELECT"**

- Add RLS policy to table
- Enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

**Performance issues**

- Check if index exists on `user_id`
- Check index on filter columns
- Use EXPLAIN to analyze queries

---

## File Locations

**Migrations:**
`/supabase/migrations/*.sql`

**Backend DB Client:**
`/services/core-api/src/lib/supabase.ts`

**Backend Routes:**
`/services/core-api/src/routes/*.ts`

**Frontend API Clients:**
`/src/integrations/api/*.ts`

**React Query Hooks:**
`/src/hooks/use*.ts`

**Types:**
`/shared/types/src/index.ts`

**Tests:**
`/services/core-api/src/routes/__tests__/*.test.ts`

---

## Typical Development Loop

1. **Add column to table:**

   ```bash
   # Create migration file
   nano supabase/migrations/TIMESTAMP_description.sql

   # Apply to Supabase
   supabase db push
   ```

2. **Create API endpoint:**

   ```bash
   # Add route handler in services/core-api/src/routes/
   nano services/core-api/src/routes/my-feature.ts

   # Mount in services/core-api/src/index.ts
   app.use('/api/v1/my-feature', myFeatureRoutes)
   ```

3. **Connect frontend:**

   ```bash
   # Create API client
   nano src/integrations/api/my-feature.ts

   # Create React Query hook
   nano src/hooks/useMyFeature.ts

   # Use in component
   const { data } = useMyFeature()
   ```

---

## Production Considerations

- RLS is enforced by Supabase (database level)
- Service Role Key used by backend (admin access)
- Anon Key used by frontend (for auth only)
- Never pass raw user input to database
- Always validate input on backend
- Use Zod schemas for validation
- Log errors but don't expose details to clients

---

## Resources

- [Supabase Dashboard](https://app.supabase.com/project/zkdgtofxtzqnzgncqlyc)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Full analysis: `docs/DATABASE_SYSTEM_COMPREHENSIVE_ANALYSIS.md`

---

**Last Updated:** November 9, 2025
