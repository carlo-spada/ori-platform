# API Structure Summary

## Quick Reference

**API Base URL**: `http://localhost:3001/api/v1` (development)

**Authentication**: JWT Bearer token in `Authorization` header (from Supabase)

---

## Endpoint Overview

### Profile Management (5 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/profile` | Fetch user profile |
| PUT | `/profile` | Update profile |
| PUT | `/profile/onboarding` | Complete onboarding |

### Experiences (4 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/experiences` | List all experiences |
| POST | `/experiences` | Create experience |
| PUT | `/experiences/:id` | Update experience |
| DELETE | `/experiences/:id` | Delete experience |

### Education (4 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/education` | List all education |
| POST | `/education` | Create education |
| PUT | `/education/:id` | Update education |
| DELETE | `/education/:id` | Delete education |

### Jobs (3 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/jobs` | Get all jobs |
| POST | `/jobs/find-matches` | Find AI-matched jobs |
| POST | `/jobs/initial-search` | Search jobs by query |

### Applications (6 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/applications` | List applications |
| GET | `/applications/stats` | Get stats |
| POST | `/applications` | Create application |
| PUT | `/applications/:id` | Update application |
| PATCH | `/applications/:id/status` | Update status only |
| DELETE | `/applications/:id` | Delete application |

### Dashboard (1 endpoint)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard` | Get dashboard data |

### Chat (2 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/chat/history` | Fetch conversation history |
| POST | `/chat/message` | Send message |

### Payments (3 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/payments/checkout` | Create checkout session |
| POST | `/payments/portal` | Create portal session |
| POST | `/payments/webhook` | Handle Stripe webhooks |

### Subscriptions (1 endpoint)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/subscriptions` | Create subscription |

### Setup Intent (1 endpoint)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/setup-intent` | Create setup intent |

### Notifications (7 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications/preferences` | Get preferences |
| PUT | `/notifications/preferences` | Update preferences |
| GET | `/notifications/history` | Get history |
| GET | `/notifications/by-type/:type` | Get by type |
| POST | `/notifications/unsubscribe` | Unsubscribe (auth) |
| POST | `/notifications/unsubscribe/:token` | Unsubscribe (token) |
| GET | `/notifications/stats` | Get stats |

### Onboarding (6 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/onboarding/session` | Save session |
| GET | `/onboarding/session` | Get session |
| DELETE | `/onboarding/session` | Delete session |
| PUT | `/onboarding/complete` | Complete onboarding |
| POST | `/onboarding/analytics` | Track analytics |
| GET | `/onboarding/skill-suggestions` | Get suggestions |

### Beta Testers (1 endpoint)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/beta-testers` | Register for beta (public) |

### Users (1 endpoint)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/me` | Get current user |

---

## Total Endpoints: 41

### By Category
- **Profile & User Data**: 5
- **Experiences**: 4
- **Education**: 4
- **Jobs**: 3
- **Applications**: 6
- **Dashboard**: 1
- **Chat**: 2
- **Payments**: 3
- **Subscriptions**: 1
- **Setup Intent**: 1
- **Notifications**: 7
- **Onboarding**: 6
- **Beta Testers**: 1
- **Users**: 1

---

## Key Features

### Authentication
- All endpoints except `/beta-testers` and `/payments/webhook` require JWT token
- Token obtained from Supabase auth session
- Header format: `Authorization: Bearer <token>`

### Data Isolation
- Row-Level Security (RLS) at database level
- Users can only access their own data
- 403 Forbidden if accessing other user's data

### Job Matching
- AI-powered matching when AI engine available
- Fallback to skill-based scoring
- Returns multiple scores: matchScore, semanticScore, skillMatchScore, experienceScore
- Includes skills gap analysis

### Payment Processing
- Stripe integration for subscriptions
- Two paths: checkout session or setup intent + subscription
- Webhook handler for subscription lifecycle
- Updates user profile on subscription changes

### Chat System
- Conversation-based messaging
- Auto-creates conversation on first message
- AI responses (with fallback placeholders)
- Message history with up to 10 recent messages for context

### Notifications
- Preference-based email system
- Supports unsubscribe via token (email links)
- Notification history with type filtering
- Statistics tracking

### Onboarding
- Multi-step session tracking
- Analytics event logging
- Profile completeness calculation
- Feature unlock system based on profile completion

---

## Data Types

### User Status Fields
- `subscription_status`: "free" | "plus_monthly" | "plus_yearly" | "premium_monthly" | "premium_yearly" | "past_due" | "cancelled"
- `subscription_tier`: "free" | "plus" | "premium"

### Application Status
- "applied" | "interviewing" | "offer" | "rejected" | "paused"

### Work Style
- "Remote" | "Hybrid" | "On-site"

### Job Match Scores (0-100)
- `matchScore`: Overall match
- `semanticScore`: Semantic similarity
- `skillMatchScore`: Skills match
- `experienceScore`: Experience level match

### Notification Types
- "welcome"
- "payment_failure"
- "card_expiring"
- "trial_ending"
- "subscription_confirmation"
- "recommendations"
- "application_status"

---

## Common Patterns

### Paginated Responses
Used in: notifications history, notifications by type

```json
{
  "data": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Stats Responses
Used in: applications stats, notifications stats, dashboard stats

```json
{
  "total": 50,
  "category1": 10,
  "category2": 15,
  ...
}
```

### Usage Tracking
Used in: job matches

```json
{
  "used": 5,
  "limit": 10
}
```

---

## Frontend Integration Files

**API Clients** (`src/integrations/api/`):
- `profile.ts` - Profile, experiences, education
- `jobs.ts` - Job recommendations
- `applications.ts` - Applications management
- `payments.ts` - Payment/subscription flows
- `chat.ts` - Chat messaging
- `dashboard.ts` - Dashboard data
- `betaTesters.ts` - Beta signup

**React Query Hooks** (`src/hooks/`):
- Use these for all data fetching
- Never use mock data
- Handles caching and stale time

---

## Route Implementation Files

All routes are in: `/services/core-api/src/routes/`

- `profile.ts` - Profile endpoints
- `experiences.ts` - Experience CRUD
- `education.ts` - Education CRUD
- `jobs.ts` - Job search & matching
- `applications.ts` - Application tracking
- `dashboard.ts` - Dashboard aggregation
- `chat.ts` - Chat/conversation
- `payments.ts` - Stripe checkout & webhooks
- `subscriptions.ts` - Subscription creation
- `setupIntent.ts` - Setup intent creation
- `notifications.ts` - Notification preferences & history
- `onboarding.js` - Onboarding flow
- `betaTesters.ts` - Beta tester registration
- `users.ts` - User fetch

---

## Middleware

**Auth Middleware** (`middleware/auth.ts`):
- Extracts JWT from Authorization header
- Validates token with Supabase
- Attaches user to request

**Validation Middleware** (`middleware/validation.ts`):
- Uses Zod for request body validation
- Returns 400 with validation errors

---

## Important Notes

1. **Stripe Webhook**: Must use raw body before `express.json()`
2. **AI Engine**: Optional - API gracefully degrades if unavailable
3. **Job Matches**: Limited by subscription tier (monthly quota)
4. **Chat Context**: Uses last 10 messages for AI context
5. **Onboarding**: Creates Stripe customer on completion
6. **Notifications**: Default preferences created on first access

---

## Error Handling

All errors return standard format:
```json
{
  "error": "string message"
}
```

With appropriate HTTP status codes:
- 200 - Success
- 201 - Created
- 204 - No content (delete)
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

---

**Total Lines of Code**: ~2000+ (routes only)  
**Database Tables Used**: 20+  
**External Services**: Supabase, Stripe, OpenAI (via AI Engine)

---

Generated: November 10, 2025
