# API Endpoints Reference

## Base URLs

- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://app.getori.app/api/v1`

## Subdomain Architecture

The platform uses subdomain-based routing:

- **Marketing:** `https://getori.app` - Public pages
- **Application:** `https://app.getori.app` - All API endpoints, authentication, and app features

All API endpoints are served from the app subdomain (`app.getori.app/api/v1/*`).

## Authentication

All endpoints require JWT token in `Authorization: Bearer <token>` header (except `/health`).

Supabase authentication is handled client-side, with tokens automatically included in requests via the API client layer.

---

## Profile

### GET /profile

Get the authenticated user's complete profile

**Auth:** Required
**Response:** `UserProfile` object

### PUT /profile

Update user profile

**Auth:** Required
**Body:**

```json
{
  "full_name": "string",
  "headline": "string",
  "location": "string",
  "about": "string",
  "long_term_vision": "string",
  "skills": ["string"],
  "target_roles": ["string"],
  "work_style": "Remote | Hybrid | On-site",
  "industries": ["string"],
  "goal": "string",
  "cv_url": "string"
}
```

**Response:** Updated `UserProfile`

### PUT /profile/onboarding

Complete onboarding and update profile

**Auth:** Required
**Body:** Same as PUT /profile
**Response:** Updated `UserProfile` with `onboarding_completed: true`

---

## Experiences

### GET /experiences

Get all work experiences for the user

**Auth:** Required
**Response:**

```json
{
  "experiences": [Experience]
}
```

### POST /experiences

Create a new work experience

**Auth:** Required
**Body:**

```json
{
  "company": "string",
  "role": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD | null",
  "is_current": boolean,
  "description": "string | null"
}
```

**Response:** Created `Experience`

### PUT /experiences/:id

Update an existing work experience

**Auth:** Required
**Params:** `id` (UUID)
**Body:** Partial `Experience` object
**Response:** Updated `Experience`

### DELETE /experiences/:id

Delete a work experience

**Auth:** Required
**Params:** `id` (UUID)
**Response:** 204 No Content

---

## Education

### GET /education

Get all education records for the user

**Auth:** Required
**Response:**

```json
{
  "education": [Education]
}
```

### POST /education

Create a new education record

**Auth:** Required
**Body:**

```json
{
  "institution": "string",
  "degree": "string",
  "field_of_study": "string | null",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD | null",
  "is_current": boolean,
  "description": "string | null"
}
```

**Response:** Created `Education`

### PUT /education/:id

Update an existing education record

**Auth:** Required
**Params:** `id` (UUID)
**Body:** Partial `Education` object
**Response:** Updated `Education`

### DELETE /education/:id

Delete an education record

**Auth:** Required
**Params:** `id` (UUID)
**Response:** 204 No Content

---

## Applications

### GET /applications

Get all job applications for the user

**Auth:** Required
**Query Params:**

- `status` (optional): Filter by status (applied, interviewing, offer, rejected, paused)

**Response:**

```json
{
  "applications": [Application]
}
```

### GET /applications/stats

Get application statistics for dashboard

**Auth:** Required
**Response:**

```json
{
  "total": number,
  "applied": number,
  "interviewing": number,
  "offers": number,
  "rejected": number,
  "paused": number
}
```

### POST /applications

Create a new job application

**Auth:** Required
**Body:**

```json
{
  "job_title": "string",
  "company": "string",
  "location": "string | null",
  "job_url": "string | null",
  "status": "applied | interviewing | offer | rejected | paused",
  "notes": "string | null"
}
```

**Response:** Created `Application`

### PUT /applications/:id

Update an existing application

**Auth:** Required
**Params:** `id` (UUID)
**Body:** Partial `Application` object
**Response:** Updated `Application`

### PATCH /applications/:id/status

Update only the status of an application

**Auth:** Required
**Params:** `id` (UUID)
**Body:**

```json
{
  "status": "applied | interviewing | offer | rejected | paused"
}
```

**Response:** Updated `Application`

### DELETE /applications/:id

Delete an application

**Auth:** Required
**Params:** `id` (UUID)
**Response:** 204 No Content

---

## Jobs

### POST /jobs/find-matches

Find job matches for the user

**Auth:** Required
**Body:**

```json
{
  "query": "string",
  "location": "string",
  "limit": number
}
```

**Response:** Array of `JobMatch` objects with `skillsGap`

---

## Chat

### GET /chat/history

Get chat conversation history

**Auth:** Required
**Response:** `ChatHistoryResponse`

### POST /chat/message

Send a chat message

**Auth:** Required
**Body:**

```json
{
  "content": "string",
  "conversation_id": "string | undefined"
}
```

**Response:** `SendMessageResponse`

---

## Error Responses

All endpoints may return these error codes:

**401 Unauthorized:**

```json
{
  "error": "User not authenticated"
}
```

**403 Forbidden:**

```json
{
  "error": "Forbidden - Can only access your own data"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error"
}
```

---

## Testing Endpoints

Use curl or Postman with JWT token:

```bash
# Get profile
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/v1/profile

# Create experience
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company":"Acme","role":"Engineer","start_date":"2020-01-01","is_current":true}' \
  http://localhost:3001/api/v1/experiences

# Get application stats
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/v1/applications/stats
```

---

**Last Updated:** 2025-11-08
**Version:** 1.0 (Task B Complete)
