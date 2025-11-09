---
Task ID: A
Feature: Notifications Table
Title: Create In-App Notifications System with Database Schema
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: Medium
---

### Objective

Create a complete in-app notifications system with database schema, API endpoints, and frontend components to display user notifications for payment alerts, profile updates, and other important events.

### Context

The payment notification system (`services/core-api/src/utils/notifications.ts`) references a `notifications` table that doesn't exist yet. This task will create the database schema, API endpoints, and frontend UI for managing user notifications.

### Files to Modify/Create

**Backend:**
- `supabase/migrations/XXXXXX_create_notifications_table.sql` - Database schema
- `services/core-api/src/routes/notifications.ts` - API endpoints (NEW)
- `services/core-api/src/utils/notifications.ts` - Update to use real table
- `shared/types/src/index.ts` - Add Notification types

**Frontend:**
- `src/integrations/api/notifications.ts` - API client (NEW)
- `src/hooks/useNotifications.ts` - React Query hook (NEW)
- `src/components/notifications/NotificationBell.tsx` - Bell icon with count (NEW)
- `src/components/notifications/NotificationsList.tsx` - Dropdown list (NEW)
- `src/components/notifications/NotificationItem.tsx` - Individual notification (NEW)
- `src/app/app/notifications/page.tsx` - Full notifications page (NEW)

### Implementation Steps

#### 1. Create Database Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'payment_alert', 'profile_update', 'application_update', 'recommendation'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT, -- Optional link to relevant page
  metadata JSONB DEFAULT '{}', -- Additional data
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

#### 2. Create Backend API Endpoints

In `services/core-api/src/routes/notifications.ts`:

```typescript
// GET /api/v1/notifications - Get all notifications for user
// GET /api/v1/notifications/unread - Get unread count
// PATCH /api/v1/notifications/:id/read - Mark as read
// PATCH /api/v1/notifications/read-all - Mark all as read
// DELETE /api/v1/notifications/:id - Delete notification
```

#### 3. Update Notification Utility

Update `services/core-api/src/utils/notifications.ts`:
- Remove placeholder comment about notifications table
- Ensure it uses the real table structure
- Add support for `action_url` and `metadata` fields

#### 4. Create Frontend API Client

`src/integrations/api/notifications.ts`:
- `fetchNotifications()`
- `getUnreadCount()`
- `markAsRead(id)`
- `markAllAsRead()`
- `deleteNotification(id)`

#### 5. Create React Query Hooks

`src/hooks/useNotifications.ts`:
- `useNotifications()` - Query for all notifications
- `useUnreadCount()` - Query for unread count
- `useMarkAsRead()` - Mutation to mark as read
- `useMarkAllAsRead()` - Mutation to mark all as read
- `useDeleteNotification()` - Mutation to delete

#### 6. Create Notification Bell Component

`src/components/notifications/NotificationBell.tsx`:
- Bell icon in header (lucide-react Bell icon)
- Badge with unread count
- Opens dropdown on click
- Shows recent 5 notifications
- "View All" link to full page

#### 7. Create Notifications List Component

`src/components/notifications/NotificationsList.tsx`:
- Dropdown list of recent notifications
- Infinite scroll or pagination
- "Mark all as read" button
- Empty state when no notifications

#### 8. Create Notification Item Component

`src/components/notifications/NotificationItem.tsx`:
- Display title, message, timestamp
- Visual indicator for read/unread
- Click to mark as read and navigate to action_url
- Delete button
- Icon based on notification type

#### 9. Create Full Notifications Page

`src/app/app/notifications/page.tsx`:
- Complete list of all notifications
- Filters (All, Unread, Read, By Type)
- Bulk actions (Mark all as read, Delete all read)
- Pagination

#### 10. Integrate into Layout

Update `src/app/app/layout.tsx`:
- Add NotificationBell to header/navbar
- Real-time updates using Supabase subscriptions (optional)

#### 11. Add Real-Time Subscriptions (Optional)

Use Supabase real-time to update notifications automatically:
```typescript
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Invalidate React Query cache
    queryClient.invalidateQueries(['notifications'])
  })
  .subscribe()
```

### Acceptance Criteria

- Notifications table exists in Supabase with proper RLS policies
- Backend API endpoints return correct notification data
- Notification bell appears in app header with unread count badge
- Clicking bell shows dropdown with recent notifications
- Clicking notification marks it as read and navigates to action URL
- Full notifications page shows all notifications with filters
- "Mark all as read" functionality works
- Notifications are created when payment failures occur
- UI is polished and matches design system
- Real-time updates work (if implemented)

### Technical Notes

- Use Radix UI Dropdown for notification bell dropdown
- Implement optimistic updates for mark as read actions
- Use react-query's `useMutation` with `onSuccess` to update cache
- Add toast notification when new notification arrives (optional)
- Consider batching notification creation to prevent spam
- Add notification preferences in settings (future task)

### Design Considerations

- Notification types should have different icons (Bell, CreditCard, User, Briefcase)
- Use color coding: red for alerts, blue for info, green for success
- Timestamp should be relative ("2 hours ago", "Yesterday")
- Unread notifications should have visual weight (bold, background color)
- Empty state should encourage user actions ("No notifications yet!")

### Estimated Effort

5-7 hours (including database, backend, frontend, and polish)
