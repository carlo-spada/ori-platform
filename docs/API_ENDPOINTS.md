# Ori Platform - Complete API Documentation

## Overview

The Ori Platform API is built with Express.js and runs on port 3001. All API endpoints are prefixed with `/api/v1/`. Authentication is required for all endpoints except for public beta tester registration.

**Base URL**: `http://localhost:3001` (development) or `https://api.getori.app` (production)

---

## Authentication

### Authentication Method: JWT Bearer Token

All authenticated endpoints require an `Authorization` header with a JWT token from Supabase:

```
Authorization: Bearer <supabase_access_token>
```

The token is obtained from Supabase's session after user authentication. Frontend makes requests with this token via `getAuthHeaders()` function.

---

## API Endpoints

### 1. PROFILE ENDPOINTS

#### GET `/api/v1/profile`
**Purpose**: Fetch the authenticated user's profile

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "id": "string",
  "user_id": "uuid",
  "full_name": "string",
  "headline": "string",
  "location": "string",
  "about": "string",
  "skills": ["string"],
  "target_roles": ["string"],
  "work_style": "Remote | Hybrid | On-site",
  "industries": ["string"],
  "goal": "string",
  "long_term_vision": "string",
  "cv_url": "string",
  "experience_level": "entry | mid | senior | executive",
  "years_of_experience": "number",
  "willing_to_relocate": "boolean",
  "subscription_status": "free | plus_monthly | plus_yearly | premium_monthly | premium_yearly",
  "stripe_customer_id": "string",
  "stripe_subscription_id": "string",
  "onboarding_completed": "boolean",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/profile.ts`

---

#### PUT `/api/v1/profile`
**Purpose**: Update the authenticated user's profile

**Authentication**: Required  
**Method**: PUT

**Request Body**:
```json
{
  "full_name": "string (max 200 chars)",
  "headline": "string (max 200 chars)",
  "location": "string (max 100 chars)",
  "about": "string (max 5000 chars)",
  "long_term_vision": "string (max 2000 chars)",
  "skills": ["string"],
  "target_roles": ["string"],
  "work_style": "Remote | Hybrid | On-site",
  "industries": ["string"],
  "goal": "string (max 1000 chars)",
  "cv_url": "string (URL format)"
}
```

All fields are optional. Only provided fields will be updated.

**Response** (200 OK): Returns updated profile object

**Validation Rules**:
- `work_style`: Must be one of "Remote", "Hybrid", "On-site"
- `full_name`: Max 200 characters
- `headline`: Max 200 characters
- `location`: Max 100 characters
- `about`: Max 5000 characters
- `long_term_vision`: Max 2000 characters
- `goal`: Max 1000 characters

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/profile.ts`

---

#### PUT `/api/v1/profile/onboarding`
**Purpose**: Complete onboarding and update profile. Marks onboarding as complete and ensures Stripe customer exists.

**Authentication**: Required  
**Method**: PUT

**Request Body**: Same as `PUT /api/v1/profile`

**Response** (200 OK): Returns updated profile with `onboarding_completed: true`

**Side Effects**:
- Creates Stripe customer if doesn't exist
- Sets `onboarding_completed` to `true`
- Calls `ensureStripeCustomer()` helper

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/profile.ts`

---

### 2. EXPERIENCE ENDPOINTS

#### GET `/api/v1/experiences`
**Purpose**: Fetch all work experiences for the authenticated user

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "experiences": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "company": "string",
      "role": "string",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD | null",
      "is_current": "boolean",
      "description": "string | null",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ]
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts`

---

#### POST `/api/v1/experiences`
**Purpose**: Create a new work experience record

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "company": "string (required)",
  "role": "string (required)",
  "start_date": "YYYY-MM-DD (required)",
  "end_date": "YYYY-MM-DD (optional)",
  "is_current": "boolean (default: false)",
  "description": "string (optional)"
}
```

**Response** (201 Created): Returns created experience object

**Validation**:
- `company`: Required, non-empty
- `role`: Required, non-empty
- `start_date`: Required, ISO 8601 format (YYYY-MM-DD)
- `end_date`: Optional, ISO 8601 format (YYYY-MM-DD)

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts`

---

#### PUT `/api/v1/experiences/:id`
**Purpose**: Update an existing work experience

**Authentication**: Required  
**Method**: PUT

**URL Parameters**:
- `id`: Experience UUID

**Request Body**: Same fields as POST, all optional

**Response** (200 OK): Returns updated experience object

**Error Handling**:
- 404: Experience not found
- 401: User not authenticated

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts`

---

#### DELETE `/api/v1/experiences/:id`
**Purpose**: Delete a work experience

**Authentication**: Required  
**Method**: DELETE

**URL Parameters**:
- `id`: Experience UUID

**Response** (204 No Content): No response body

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/experiences.ts`

---

### 3. EDUCATION ENDPOINTS

#### GET `/api/v1/education`
**Purpose**: Fetch all education records for the authenticated user

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "education": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "institution": "string",
      "degree": "string",
      "field_of_study": "string | null",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD | null",
      "is_current": "boolean",
      "description": "string | null",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ]
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/education.ts`

---

#### POST `/api/v1/education`
**Purpose**: Create a new education record

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "institution": "string (required)",
  "degree": "string (required)",
  "field_of_study": "string (optional)",
  "start_date": "YYYY-MM-DD (required)",
  "end_date": "YYYY-MM-DD (optional)",
  "is_current": "boolean (default: false)",
  "description": "string (optional)"
}
```

**Response** (201 Created): Returns created education object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/education.ts`

---

#### PUT `/api/v1/education/:id`
**Purpose**: Update an existing education record

**Authentication**: Required  
**Method**: PUT

**URL Parameters**:
- `id`: Education UUID

**Request Body**: Same fields as POST, all optional

**Response** (200 OK): Returns updated education object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/education.ts`

---

#### DELETE `/api/v1/education/:id`
**Purpose**: Delete an education record

**Authentication**: Required  
**Method**: DELETE

**URL Parameters**:
- `id`: Education UUID

**Response** (204 No Content): No response body

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/education.ts`

---

### 4. JOBS ENDPOINTS

#### GET `/api/v1/jobs`
**Purpose**: Get all available jobs (paginated)

**Authentication**: Not required  
**Method**: GET

**Response** (200 OK):
```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "string",
      "company": "string",
      "location": "string",
      "description": "string",
      "requirements": ["string"],
      "salary_min": "number",
      "salary_max": "number",
      "work_type": "remote | hybrid | onsite",
      "tags": ["string"],
      "posted_date": "ISO 8601 timestamp",
      "expires_date": "ISO 8601 timestamp",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ]
}
```

**Limits**:
- Returns max 100 jobs
- Sorted by `created_at` descending

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/jobs.ts`

---

#### POST `/api/v1/jobs/find-matches`
**Purpose**: Find job matches for the authenticated user with AI-powered scoring

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "userId": "uuid (required)",
  "limit": "number (1-20, default: 6)",
  "filters": {
    "location": "string (optional)",
    "workType": "remote | hybrid | onsite (optional)",
    "salaryMin": "number (optional)"
  }
}
```

**Response** (200 OK):
```json
{
  "matches": [
    {
      "id": "uuid",
      "title": "string",
      "company": "string",
      "location": "string",
      "description": "string",
      "requirements": ["string"],
      "salary_min": "number",
      "salary_max": "number",
      "work_type": "remote | hybrid | onsite",
      "tags": ["string"],
      "posted_date": "ISO 8601 timestamp",
      "expires_date": "ISO 8601 timestamp",
      "matchScore": "number (0-100)",
      "semanticScore": "number (0-100)",
      "skillMatchScore": "number (0-100)",
      "experienceScore": "number (0-100)",
      "reasoning": "string",
      "keyMatches": ["string"],
      "missingSkills": ["string"],
      "skills_analysis": [
        {
          "name": "string",
          "status": "matched | missing"
        }
      ],
      "skillsGap": {
        "userSkills": ["string"],
        "requiredSkills": ["string"],
        "missingSkills": ["string"]
      }
    }
  ],
  "usage": {
    "used": "number",
    "limit": "number"
  }
}
```

**Scoring**:
- **matchScore**: Overall match percentage (0-100)
- **semanticScore**: Semantic similarity score (0-100)
- **skillMatchScore**: Skills match score (0-100)
- **experienceScore**: Experience level match (0-100)

**AI Matching**:
- If AI engine is available: Uses intelligent semantic matching
- Fallback: Uses skill-based scoring if AI unavailable
- Returns up to 50 jobs for evaluation, filters to requested limit

**Side Effects**:
- Updates user's `monthly_job_matches_used` counter

**Error Handling**:
- 403: User can only request their own matches
- Returns empty array if no AI engine available and fallback fails

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/jobs.ts`

---

#### POST `/api/v1/jobs/initial-search`
**Purpose**: Initial job search with validation and sanitization

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "query": "string (required, 1-100 chars, alphanumeric + dash/underscore/space)",
  "location": "string (optional, max 100 chars)"
}
```

**Response** (200 OK):
```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "string",
      "company": "string",
      "location": "string",
      ...
    }
  ]
}
```

**Validation**:
- Query is case-insensitive
- SQL wildcards are stripped for security
- Max 20 results returned
- Search is performed on job title (ilike)

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/jobs.ts`

---

### 5. APPLICATIONS ENDPOINTS

#### GET `/api/v1/applications`
**Purpose**: Get all applications for the authenticated user

**Authentication**: Required  
**Method**: GET

**Query Parameters**:
- `status` (optional): Filter by status - "applied" | "interviewing" | "offer" | "rejected" | "paused"

**Response** (200 OK):
```json
{
  "applications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "job_title": "string",
      "company": "string",
      "location": "string | null",
      "job_url": "string (URL) | null",
      "status": "applied | interviewing | offer | rejected | paused",
      "notes": "string | null",
      "application_date": "ISO 8601 timestamp",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ]
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

#### GET `/api/v1/applications/stats`
**Purpose**: Get application statistics for dashboard

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "total": "number",
  "applied": "number",
  "interviewing": "number",
  "offers": "number",
  "rejected": "number",
  "paused": "number"
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

#### POST `/api/v1/applications`
**Purpose**: Create a new job application

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "job_title": "string (required)",
  "company": "string (required)",
  "location": "string (optional)",
  "job_url": "string (URL format, optional)",
  "status": "applied | interviewing | offer | rejected | paused (default: applied)",
  "notes": "string (optional)"
}
```

**Response** (201 Created): Returns created application object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

#### PUT `/api/v1/applications/:id`
**Purpose**: Update an existing application

**Authentication**: Required  
**Method**: PUT

**URL Parameters**:
- `id`: Application UUID

**Request Body**: All fields optional
```json
{
  "job_title": "string",
  "company": "string",
  "location": "string",
  "job_url": "string (URL format)",
  "status": "applied | interviewing | offer | rejected | paused",
  "notes": "string"
}
```

**Response** (200 OK): Returns updated application object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

#### PATCH `/api/v1/applications/:id/status`
**Purpose**: Update only the status of an application (quick update)

**Authentication**: Required  
**Method**: PATCH

**URL Parameters**:
- `id`: Application UUID

**Request Body**:
```json
{
  "status": "applied | interviewing | offer | rejected | paused (required)"
}
```

**Response** (200 OK): Returns updated application object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

#### DELETE `/api/v1/applications/:id`
**Purpose**: Delete an application

**Authentication**: Required  
**Method**: DELETE

**URL Parameters**:
- `id`: Application UUID

**Response** (204 No Content): No response body

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/applications.ts`

---

### 6. DASHBOARD ENDPOINTS

#### GET `/api/v1/dashboard`
**Purpose**: Get aggregated dashboard data including stats and recent activity

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "stats": {
    "activeApplications": "number",
    "jobRecommendations": "number",
    "skillsAdded": "number",
    "profileCompletion": "number (0-100)"
  },
  "recentActivity": [
    {
      "id": "string",
      "type": "application | skill | favorite | profile",
      "title": "string",
      "subtitle": "string",
      "timestamp": "ISO 8601 timestamp"
    }
  ]
}
```

**Data Included**:
- **activeApplications**: Count of applications with status "applied" or "interviewing"
- **jobRecommendations**: Estimated count based on profile completeness
- **skillsAdded**: Count of skills in user profile
- **profileCompletion**: Percentage based on filled profile fields
- **recentActivity**: Last 5 activities (applications, experiences, education updates)

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/dashboard.ts`

---

### 7. CHAT ENDPOINTS

#### GET `/api/v1/chat/history`
**Purpose**: Fetch chat conversation history and messages

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "conversation": {
    "id": "uuid",
    "user_id": "uuid",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp",
    "summary": "string (optional)"
  },
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "user | assistant",
      "content": "string",
      "created_at": "ISO 8601 timestamp"
    }
  ]
}
```

**Returns Empty State**:
- If no conversation exists: `{ "conversation": null, "messages": [] }`

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/chat.ts`

---

#### POST `/api/v1/chat/message`
**Purpose**: Send a message and receive AI response

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "content": "string (required, non-empty)",
  "conversation_id": "uuid (optional)"
}
```

**Response** (200 OK):
```json
{
  "message": {
    "id": "uuid",
    "conversation_id": "uuid",
    "role": "assistant",
    "content": "string",
    "created_at": "ISO 8601 timestamp"
  },
  "conversation_id": "uuid"
}
```

**Behavior**:
- Creates new conversation if `conversation_id` not provided
- Saves user message to database
- Generates AI response (or fallback placeholder if AI engine unavailable)
- Saves assistant response to database
- Returns the assistant message

**AI Context**:
- Uses last 10 messages for conversation history
- Includes user's skills and target_roles from profile
- Falls back to placeholder responses if AI engine unavailable

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/chat.ts`

---

### 8. PAYMENT ENDPOINTS

#### POST `/api/v1/payments/checkout`
**Purpose**: Create a Stripe checkout session for subscription

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "userId": "uuid (required)",
  "priceId": "string (Stripe price ID, required)",
  "successUrl": "string (URL, required)",
  "cancelUrl": "string (URL, required)"
}
```

**Response** (200 OK):
```json
{
  "url": "string (Stripe checkout URL)"
}
```

**Side Effects**:
- Creates Stripe customer if doesn't exist
- Creates checkout session in subscription mode
- Stores `stripe_customer_id` in database

**Errors**:
- 403: User can only create checkout for themselves

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/payments.ts`

---

#### POST `/api/v1/payments/portal`
**Purpose**: Create a Stripe billing portal session for subscription management

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "userId": "uuid (required)"
}
```

**Response** (200 OK):
```json
{
  "url": "string (Stripe portal URL)"
}
```

**Errors**:
- 403: User can only access their own portal
- 400: No subscription found (no stripe_customer_id)

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/payments.ts`

---

#### POST `/api/v1/payments/webhook`
**Purpose**: Handle Stripe webhooks for subscription lifecycle events

**Authentication**: Not required (validates Stripe signature instead)  
**Method**: POST

**Important**: Webhook must be processed with **raw body** (not parsed JSON). In `index.ts`:
```javascript
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhookRoutes,
)
```

**Handled Events**:
1. `checkout.session.completed` - Subscription created via checkout
2. `customer.subscription.created` - New subscription created
3. `customer.subscription.updated` - Subscription updated (plan change, trial ending)
4. `customer.subscription.deleted` - Subscription cancelled
5. `invoice.payment_succeeded` - Recurring payment successful
6. `invoice.payment_failed` - Recurring payment failed
7. `customer.source.expiring` - Payment method expiring soon

**Response** (200 OK):
```json
{
  "received": true
}
```

**Side Effects**:
- Updates `subscription_status` in database
- Sends notification emails on payment failure or card expiring
- Handles gracefully with `try-catch`

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/payments.ts`

---

### 9. SUBSCRIPTIONS ENDPOINTS

#### POST `/api/v1/subscriptions`
**Purpose**: Create a new Stripe subscription with payment method

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "planId": "plus_monthly | plus_yearly | premium_monthly | premium_yearly (required)",
  "paymentMethodId": "string (Stripe payment method ID, required)"
}
```

**Response** (200 OK):
```json
{
  "subscriptionId": "string (Stripe subscription ID)",
  "status": "string (Stripe subscription status)"
}
```

**Side Effects**:
- Creates/gets Stripe customer
- Attaches payment method to customer
- Sets payment method as default
- Creates subscription with plan
- Updates user profile with subscription info

**Errors**:
- 400: Invalid plan ID
- 500: Plan price ID not configured

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/subscriptions.ts`

---

### 10. SETUP INTENT ENDPOINTS

#### POST `/api/v1/setup-intent`
**Purpose**: Create a Stripe Setup Intent for embedded payment flows

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "planId": "plus_monthly | plus_yearly | premium_monthly | premium_yearly (required)"
}
```

**Response** (200 OK):
```json
{
  "clientSecret": "string (Stripe client secret)",
  "setupIntentId": "string (Stripe setup intent ID)"
}
```

**Usage**:
- Use `clientSecret` with Stripe Elements on frontend
- Confirm with payment details on client
- Pass returned `paymentMethodId` to subscription creation

**Side Effects**:
- Creates/gets Stripe customer
- Creates setup intent with metadata (user_id, plan_id)

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/setupIntent.ts`

---

### 11. NOTIFICATIONS ENDPOINTS

#### GET `/api/v1/notifications/preferences`
**Purpose**: Retrieve user's notification preferences

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "payment_failure_emails": "boolean",
  "card_expiring_emails": "boolean",
  "trial_ending_emails": "boolean",
  "subscription_emails": "boolean",
  "recommendation_emails": "boolean",
  "application_status_emails": "boolean",
  "security_emails": "boolean",
  "weekly_digest": "boolean",
  "unsubscribed": "boolean",
  "unsubscribed_at": "ISO 8601 timestamp | null",
  "unsubscribe_token": "string",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Auto-Create**:
- If no preferences exist, creates defaults with all notifications enabled

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### PUT `/api/v1/notifications/preferences`
**Purpose**: Update user's notification preferences

**Authentication**: Required  
**Method**: PUT

**Request Body**: All fields optional
```json
{
  "payment_failure_emails": "boolean",
  "card_expiring_emails": "boolean",
  "trial_ending_emails": "boolean",
  "subscription_emails": "boolean",
  "recommendation_emails": "boolean",
  "application_status_emails": "boolean",
  "security_emails": "boolean",
  "weekly_digest": "boolean"
}
```

**Response** (200 OK): Returns updated preferences object

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### GET `/api/v1/notifications/history`
**Purpose**: Retrieve user's notification history with pagination

**Authentication**: Required  
**Method**: GET

**Query Parameters**:
- `limit` (optional): Max 100, default 20
- `offset` (optional): Pagination offset, default 0

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "string",
      "subject": "string",
      "recipient_email": "string",
      "status": "pending | sent | failed | bounced | complained",
      "sent_at": "ISO 8601 timestamp | null",
      "failed_at": "ISO 8601 timestamp | null",
      "error_message": "string | null",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### GET `/api/v1/notifications/by-type/:type`
**Purpose**: Retrieve notifications of a specific type with pagination

**Authentication**: Required  
**Method**: GET

**URL Parameters**:
- `type`: Notification type (e.g., "payment_failure", "recommendation")

**Query Parameters**:
- `limit` (optional): Max 100, default 20
- `offset` (optional): Pagination offset, default 0

**Response** (200 OK): Same as history endpoint

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### POST `/api/v1/notifications/unsubscribe`
**Purpose**: Unsubscribe from all emails (authenticated)

**Authentication**: Required  
**Method**: POST

**Response** (200 OK):
```json
{
  "message": "Successfully unsubscribed from all emails",
  "data": { ... }
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### POST `/api/v1/notifications/unsubscribe/:token`
**Purpose**: Unsubscribe from emails via token link (unauthenticated)

**Authentication**: Not required  
**Method**: POST

**URL Parameters**:
- `token`: Unsubscribe token from email

**Response** (200 OK): Same as authenticated unsubscribe

**Errors**:
- 404: Invalid or expired token

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### POST `/api/v1/notifications/resubscribe`
**Purpose**: Re-subscribe to emails

**Authentication**: Required  
**Method**: POST

**Response** (200 OK):
```json
{
  "message": "Successfully resubscribed to emails",
  "data": { ... }
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

#### GET `/api/v1/notifications/stats`
**Purpose**: Get notification statistics

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "byType": {
    "payment_failure": "number",
    "recommendation": "number",
    ...
  },
  "byStatus": {
    "sent": "number",
    "failed": "number",
    "pending": "number",
    ...
  },
  "total": "number"
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/notifications.ts`

---

### 12. ONBOARDING ENDPOINTS

#### POST `/api/v1/onboarding/session`
**Purpose**: Save or update onboarding session state

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "currentStep": "number (0-5, required)",
  "completedSteps": ["number"],
  "formData": "object"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "current_step": "number",
  "completed_steps": ["number"],
  "form_data": "object",
  "device_info": "object",
  "last_saved_at": "ISO 8601 timestamp",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Side Effects**:
- Creates new session if none exists
- Tracks analytics event

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

#### GET `/api/v1/onboarding/session`
**Purpose**: Fetch current onboarding session

**Authentication**: Required  
**Method**: GET

**Response** (200 OK): Returns session object or null if none active

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

#### DELETE `/api/v1/onboarding/session`
**Purpose**: Abandon onboarding session

**Authentication**: Required  
**Method**: DELETE

**Response** (200 OK):
```json
{
  "message": "Session cleared"
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

#### PUT `/api/v1/onboarding/complete`
**Purpose**: Complete onboarding and update profile

**Authentication**: Required  
**Method**: PUT

**Request Body**:
```json
{
  "full_name": "string",
  "preferred_name": "string",
  "profile_photo_url": "string (URL)",
  "current_status": "student | professional | transitioning | exploring",
  "years_experience": "number",
  "location": "string",
  "is_remote_open": "boolean",
  "cv_url": "string (URL)",
  "linkedin_url": "string (URL)",
  "skills": ["string"],
  "skill_levels": "object",
  "hidden_talents": ["string"],
  "dream_role": "string",
  "timeline_months": "number",
  "long_term_vision": "string",
  "target_roles": ["string"],
  "work_styles": "object",
  "culture_values": ["string"],
  "deal_breakers": ["string"],
  "industries": ["string"]
}
```

**Response** (200 OK):
```json
{
  ...profile,
  "profile_completeness": "number (0-100)",
  "features_unlocked": ["string"]
}
```

**Side Effects**:
- Updates user profile with all fields
- Calculates profile completeness
- Determines features to unlock
- Marks onboarding as complete
- Creates Stripe customer if doesn't exist
- Tracks completion analytics

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

#### POST `/api/v1/onboarding/analytics`
**Purpose**: Track onboarding analytics events

**Authentication**: Required  
**Method**: POST

**Request Body**:
```json
{
  "eventType": "string",
  "stepName": "string",
  "fieldName": "string",
  "timeOnStep": "number",
  "oldValue": "any",
  "newValue": "any"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

#### GET `/api/v1/onboarding/skill-suggestions`
**Purpose**: Get skill suggestions based on role and experience

**Authentication**: Required  
**Method**: GET

**Query Parameters**:
- `role` (optional): Target role
- `experience` (optional): Experience level

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "role": "string",
    "experience_level": "string",
    "skill": "string"
  }
]
```

**Returns**: Max 10 suggestions

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/onboarding.js`

---

### 13. BETA TESTERS ENDPOINT

#### POST `/api/v1/beta-testers`
**Purpose**: Register email for beta testing waitlist

**Authentication**: Not required (public endpoint)  
**Method**: POST

**Request Body**:
```json
{
  "email": "string (valid email, required)",
  "firstName": "string (optional)",
  "source": "signup | login | landing (default: signup)"
}
```

**Response** (201 Created):
```json
{
  "message": "Successfully registered for beta access",
  "data": {
    "id": "uuid",
    "email": "string",
    "first_name": "string | null",
    "source": "string",
    "created_at": "ISO 8601 timestamp"
  }
}
```

**Response** (200 OK) - Duplicate Email:
```json
{
  "message": "Email already registered for beta access",
  "alreadyExists": true
}
```

**Validation**:
- `email`: Must be valid email format
- Unique constraint on email

**Errors**:
- 400: Validation failed (invalid email format)
- 500: Database insert error

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/betaTesters.ts`

---

### 14. USERS ENDPOINT

#### GET `/api/v1/users/me`
**Purpose**: Fetch the authenticated user's profile from users table

**Authentication**: Required  
**Method**: GET

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "string",
  "full_name": "string",
  "avatar_url": "string",
  ...
}
```

**File Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/users.ts`

---

## Error Handling

### Standard Error Response Format

All endpoints return errors in this format:

```json
{
  "error": "string (error message)"
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET or PUT request
- **201 Created**: Successful POST request (resource created)
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid request body or validation failed
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have permission (e.g., accessing other user's data)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Authentication Errors

- Missing `Authorization` header → 401
- Invalid token → 401 (Supabase RLS)
- Expired session → 401

### Validation Errors

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "string",
      "path": ["field_name"],
      "message": "string"
    }
  ]
}
```

---

## Frontend API Integration

### Pattern: API Client + React Query Hook

All API calls follow this pattern:

1. **API Client** (`src/integrations/api/*.ts`): Raw fetch functions
2. **React Query Hook** (`src/hooks/*.ts`): Data fetching with caching
3. **Component**: Uses hook, never mock data

### Example

```typescript
// API Client
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/v1/profile`, { headers })
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}

// Hook
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

// Component
function ProfileCard() {
  const { data: profile, isLoading } = useProfile()
  if (isLoading) return <Skeleton />
  return <div>{profile.full_name}</div>
}
```

### Available API Client Files

- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/profile.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/jobs.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/applications.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/payments.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/chat.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/dashboard.ts`
- `/Users/carlo/Desktop/Projects/ori-platform/src/integrations/api/betaTesters.ts`

---

## Environment Variables

### Backend (services/core-api/.env)

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://zvngsecxzcgxafbzjewh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AI_ENGINE_URL=http://localhost:3002
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://zvngsecxzcgxafbzjewh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Rate Limiting & Quotas

### Job Matches

- **Monthly Limit**: Defined by subscription tier
- **Tracked in**: `user_profiles.monthly_job_matches_used`
- **Updated**: After each `/api/v1/jobs/find-matches` call
- **Returns**: `usage.used` and `usage.limit` in response

---

## Related Files

**Route Definitions**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/routes/`

**Middleware**:
- Auth: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/middleware/auth.ts`
- Validation: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/middleware/validation.ts`

**Type Definitions**: `/Users/carlo/Desktop/Projects/ori-platform/shared/types/src/index.ts`

**Main Entry**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/index.ts`

---

## Key Architectural Decisions

1. **Authentication**: JWT tokens from Supabase, sent via `Authorization` header
2. **Data Isolation**: Row-Level Security (RLS) at database level ensures users can only access their own data
3. **Job Matching**: Hybrid approach - AI-powered when available, falls back to skill-based scoring
4. **Stripe Integration**: Webhook handler must use raw body, before `express.json()` middleware
5. **AI Engine**: Core API gracefully degrades if AI engine is unavailable
6. **Validation**: Zod schemas on backend, all inputs sanitized before use

---

Last Updated: 2025-11-10  
Auto-generated from source code exploration
