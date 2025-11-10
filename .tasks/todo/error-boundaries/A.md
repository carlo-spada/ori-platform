---
Task ID: A
Feature: Error Boundaries
Title: Implement React Error Boundaries for Graceful Error Handling
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: Medium
---

### Objective

Add React error boundaries throughout the application to catch JavaScript errors, prevent white screens, and provide users with helpful error messages and recovery options.

### Context

Currently, the application lacks error boundaries. If a React component throws an error, it crashes the entire app showing a white screen. Error boundaries will catch these errors, log them for debugging, and show user-friendly fallback UI.

### Files to Create/Modify

**Components:**

- `src/components/ErrorBoundary.tsx` - Main error boundary component (NEW)
- `src/components/RouteErrorBoundary.tsx` - Route-level error boundary (NEW)
- `src/components/error/ErrorFallback.tsx` - Default error UI (NEW)
- `src/components/error/NotFound.tsx` - 404 page component (NEW)

**Layout Integration:**

- `src/app/layout.tsx` - Wrap root with error boundary
- `src/app/app/layout.tsx` - Wrap app routes with error boundary
- `src/app/error.tsx` - Next.js error page
- `src/app/not-found.tsx` - Next.js 404 page

**Utilities:**

- `src/lib/error-logging.ts` - Error logging service (NEW)

### Implementation Steps

#### 1. Create Base Error Boundary Component

`src/components/ErrorBoundary.tsx`:

```typescript
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />
    }
    return this.props.children
  }
}
```

#### 2. Create Error Fallback UI

`src/components/error/ErrorFallback.tsx`:

- Display user-friendly error message
- "Try Again" button to reset error boundary
- "Go Home" button to navigate to dashboard
- Error details in development mode only
- Optional: "Report Issue" button to send error report

Design elements:

- Use alert-triangle icon from lucide-react
- Red/orange color scheme for visual alert
- Keep it simple and non-technical
- Include encouraging message

#### 3. Create Route Error Boundary

`src/components/RouteErrorBoundary.tsx`:

- Specialized error boundary for route-level errors
- Shows error within page layout (preserves navigation)
- Different styling from full-page errors

#### 4. Create 404 Not Found Page

`src/app/not-found.tsx`:

- Custom 404 page design
- Search bar to find what user was looking for
- Links to main sections (Dashboard, Profile, Applications)
- Fun illustration or animation (optional)

#### 5. Create Next.js Error Pages

`src/app/error.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { ErrorFallback } from '@/components/error/ErrorFallback'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error monitoring service
    console.error('Page error:', error)
  }, [error])

  return <ErrorFallback error={error} reset={reset} />
}
```

#### 6. Create Error Logging Service

`src/lib/error-logging.ts`:

- Function to log errors to external service (Sentry, LogRocket, etc.)
- For now, log to console in development
- Prepare structure for future integration
- Include user context (userId, route, etc.)
- Sanitize sensitive data before logging

#### 7. Integrate Error Boundaries

**Root Layout** (`src/app/layout.tsx`):

```typescript
<ErrorBoundary fallback={<GlobalErrorFallback />}>
  {children}
</ErrorBoundary>
```

**App Layout** (`src/app/app/layout.tsx`):

```typescript
<ErrorBoundary fallback={<AppErrorFallback />}>
  <Navigation />
  <main>{children}</main>
</ErrorBoundary>
```

**Critical Components** (wrap individually):

- Dashboard page
- Profile forms
- Payment checkout
- Job recommendations

#### 8. Add Error Recovery Actions

Implement smart recovery in ErrorFallback:

- Clear localStorage and retry (for cache-related errors)
- Refresh page
- Navigate to safe route (dashboard)
- Offer to report the issue

#### 9. Add Development Mode Features

In development:

- Show full error stack trace
- Show component stack
- Show error boundary tree
- Add "Open in Editor" link (if using local dev server)

#### 10. Testing

Create test scenarios:

- Component that throws in render
- Component that throws in useEffect
- Async error in event handler
- Network error handling
- 404 navigation
- Nested error boundaries

### Acceptance Criteria

- Error boundaries are present at root, layout, and critical component levels
- Throwing an error shows fallback UI instead of white screen
- Users can recover from errors with "Try Again" button
- 404 page is custom and helpful
- Error boundaries don't catch errors in:
  - Event handlers (these need try/catch)
  - Async code (these need .catch())
  - Server-side rendering errors
- Error details are logged for debugging
- Development mode shows full error information
- Production mode shows user-friendly messages only

### Technical Notes

- Error boundaries only work in React components (client-side)
- Next.js app router uses `error.tsx` convention for route errors
- Event handlers need manual try/catch blocks
- Consider using react-error-boundary library for advanced features
- Sentry integration is recommended for production error tracking

### Error Boundary Strategy

**Level 1: Root Boundary**

- Catches catastrophic errors
- Full-page error fallback
- Last line of defense

**Level 2: Layout Boundaries**

- Preserve navigation/header
- Show error in content area
- Maintains app context

**Level 3: Component Boundaries**

- Wrap complex/critical components
- Show inline error state
- Rest of page remains functional

### Design System Integration

Use existing UI components:

- `Alert` component for error messages
- `Button` component for actions
- `Card` component for error containers
- Consistent with shadcn/ui design system

### Future Enhancements

- Integrate with Sentry or LogRocket
- Add user feedback form in error fallback
- Implement automatic error recovery attempts
- Add error analytics dashboard
- Create custom error pages per error type

### Estimated Effort

3-4 hours (including implementation, testing, and polish)
