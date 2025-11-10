# Database Migration Guide

## Current Status

The database schemas have been created and are stored in `supabase/migrations/`. However, they need to be applied to your production Supabase database.

## Migrations Overview

The following migrations exist and need to be applied:

1. **Initial setup migrations** (Nov 4-5, 2024)
   - User profiles base schema
   - Authentication setup

2. **Conversations and messages** (Nov 8, 2024)
   - `20251108003034_create_conversations_and_messages.sql`
   - Chat functionality tables

3. **Onboarding fields** (Nov 8, 2024)
   - `20251108020018_add_onboarding_fields_to_user_profiles.sql`
   - Added onboarding tracking fields

4. **Core application schema** (Nov 8, 2024)
   - `20251108224444_create_core_application_schema.sql`
   - Experiences table
   - Education table
   - Applications table
   - Complete user profile fields

5. **Stripe integration** (Nov 8, 2024)
   - `20251108235959_add_stripe_fields_to_user_profiles.sql`
   - Stripe customer/subscription fields
   - Subscription status tracking

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**

   ```bash
   supabase login
   ```

3. **Link your project:**

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   Your project ref can be found in your Supabase project URL:
   `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

4. **Push migrations:**

   ```bash
   supabase db push
   ```

   This will apply all pending migrations to your remote database.

### Option 2: Manual Application via Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

2. Click **SQL Editor** in the left sidebar

3. Apply each migration file in chronological order:

   a. Copy the contents of each file from `supabase/migrations/` (in order by timestamp)

   b. Paste into SQL Editor

   c. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

   d. Verify success message

   e. Repeat for next migration

4. **Order of execution:**
   ```
   20251104192526_*.sql
   20251104192640_*.sql
   20251104195559_*.sql
   20251104203948_*.sql
   20251105202850_*.sql
   20251108003034_create_conversations_and_messages.sql
   20251108020018_add_onboarding_fields_to_user_profiles.sql
   20251108224444_create_core_application_schema.sql
   20251108235959_add_stripe_fields_to_user_profiles.sql
   ```

## Verification

After applying migrations, verify the schema:

### Check Tables Exist

Run this query in SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:

- `user_profiles`
- `experiences`
- `education`
- `applications`
- `conversations`
- `messages`

### Check RLS Policies

Run this query:

```sql
SELECT
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Each table should have RLS policies for SELECT, INSERT, UPDATE, DELETE.

### Check User Profile Columns

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY column_name;
```

Should include:

- `id`, `user_id`, `created_at`, `updated_at`
- `full_name`, `headline`, `location`, `about`
- `skills`, `target_roles`, `long_term_vision`
- `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`
- `onboarding_completed`

## Common Issues

### Issue: "relation already exists"

**Cause:** Migration was partially applied or run multiple times

**Solution:**

- If using CLI: Supabase tracks applied migrations, skip this error
- If manual: Skip the CREATE TABLE statement that already exists

### Issue: "column already exists"

**Cause:** ALTER TABLE ADD COLUMN for existing column

**Solution:**
Most migrations use `ADD COLUMN IF NOT EXISTS`, so this should not happen. If it does, the column already exists and you can continue.

### Issue: RLS policies prevent access

**Cause:** Row Level Security is enabled but user context not set

**Solution:**
Make sure you're authenticated in the app before trying to query tables. RLS policies require `auth.uid()` to match the row's `user_id`.

## Post-Migration Setup

After migrations are applied:

1. **Verify Supabase Auth is configured:**
   - Go to Authentication → URL Configuration
   - Site URL: `https://app.getori.app`
   - Redirect URLs: `https://app.getori.app/**`

2. **Test creating a user:**

   ```bash
   # Via app
   Visit https://app.getori.app/signup
   Create test account
   ```

3. **Verify data flows:**
   - Sign up → user_profiles row created
   - Complete onboarding → profile updated
   - Add experience → experiences row created

## Development vs Production

### Development (Local)

If you're developing locally, you can use Supabase local development:

```bash
supabase start
supabase db reset  # Applies all migrations
```

### Production

For production, always use `supabase db push` or manually apply migrations via dashboard.

**Never** use `db reset` in production - it will delete all data!

## Rolling Back Migrations

If you need to rollback a migration:

### Using CLI

Supabase CLI doesn't support automatic rollback. You need to write a manual rollback migration.

### Manual Rollback

Create a new migration that undoes the changes:

```bash
supabase migration new rollback_feature_name
```

Then write SQL to reverse the changes (DROP TABLE, DROP COLUMN, etc.)

## Next Steps

After migrations are applied:

1. ✅ Verify all tables exist
2. ✅ Test user signup flow
3. ✅ Test data creation (experiences, education, applications)
4. ✅ Verify RLS policies work correctly
5. ✅ Test Stripe integration (customer creation, subscription)

## Support

If you encounter issues:

- **Supabase Docs**: https://supabase.com/docs/guides/database/migrations
- **SQL Reference**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

## Migration History

All migrations are tracked in `supabase/migrations/` with timestamps. Each file is named:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

This ensures they're applied in the correct order.
