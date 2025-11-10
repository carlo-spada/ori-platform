-- Script to delete all test users and their associated data
-- Run this with: psql YOUR_DATABASE_URL -f scripts/clear-test-users.sql
-- Or in Supabase Dashboard: SQL Editor

-- WARNING: This will delete ALL users. Use with caution!

BEGIN;

-- First, let's see what we're about to delete
SELECT
  'Users to delete:' as info,
  COUNT(*) as count
FROM auth.users;

SELECT
  'Profiles to delete:' as info,
  COUNT(*) as count
FROM public.user_profiles;

-- Delete all user-related data (cascades will handle most of this)
-- The foreign key CASCADE on user_profiles should handle cleanup

-- Delete from beta_testers (no FK constraint)
DELETE FROM public.beta_testers;
RAISE NOTICE 'Deleted beta testers';

-- Delete conversations and messages (if they exist)
DELETE FROM public.messages;
RAISE NOTICE 'Deleted messages';

DELETE FROM public.conversations;
RAISE NOTICE 'Deleted conversations';

-- Delete applications (if they exist)
DELETE FROM public.applications;
RAISE NOTICE 'Deleted applications';

-- Delete experiences and education
DELETE FROM public.experiences;
RAISE NOTICE 'Deleted experiences';

DELETE FROM public.education;
RAISE NOTICE 'Deleted education';

-- Delete notifications
DELETE FROM public.notifications;
RAISE NOTICE 'Deleted notifications';

DELETE FROM public.notification_preferences;
RAISE NOTICE 'Deleted notification preferences';

-- Delete user profiles (this should cascade from auth.users, but just in case)
DELETE FROM public.user_profiles;
RAISE NOTICE 'Deleted user profiles';

-- Finally, delete all auth users (this should CASCADE to user_profiles)
DELETE FROM auth.users;
RAISE NOTICE 'Deleted all users from auth.users';

-- Verify deletion
SELECT
  'Users remaining:' as info,
  COUNT(*) as count
FROM auth.users;

SELECT
  'Profiles remaining:' as info,
  COUNT(*) as count
FROM public.user_profiles;

COMMIT;

-- If you want to rollback instead:
-- ROLLBACK;
