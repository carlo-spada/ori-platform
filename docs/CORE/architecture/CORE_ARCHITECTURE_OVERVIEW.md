# Architecture Overview

Comprehensive architectural documentation for the Ori Platform.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [High-Level Architecture](#high-level-architecture)
4. [Data Flow Patterns](#data-flow-patterns)
5. [Authentication & Authorization](#authentication--authorization)
6. [State Management](#state-management)
7. [API Communication](#api-communication)
8. [Database Architecture](#database-architecture)
9. [Payment Processing](#payment-processing)
10. [AI Engine Integration](#ai-engine-integration)
11. [Security Architecture](#security-architecture)
12. [Caching & Performance](#caching--performance)
13. [Error Handling](#error-handling)

---

## System Overview

Ori Platform is a **polyglot monorepo** architecture consisting of:

- **Frontend**: Next.js 16 (React 19 + TypeScript)
- **Core API**: Node.js 20 + Express.js
- **AI Engine**: Python 3.11 + FastAPI
- **Database**: Supabase (PostgreSQL)
- **Payment**: Stripe integration
- **Authentication**: Supabase Auth (JWT-based)

### Key Design Principles

1. **Separation of Concerns**: Frontend, backend, and AI services are independently deployable
2. **Graceful Degradation**: System functions even if AI Engine is unavailable
3. **Security First**: Row-Level Security (RLS), JWT authentication, service role key isolation
4. **Type Safety**: End-to-end TypeScript types from database to frontend
5. **Serverless-First**: Leverages Vercel's serverless architecture for auto-scaling

---

## Technology Stack

### Frontend (Next.js)

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 16 (App Router) | React framework with SSR/SSG |
| UI Library | React 19 | Component-based UI |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS | Utility-first CSS |
| Component Library | shadcn/ui + Radix UI | Accessible UI components |
| State Management | React Query (TanStack Query) | Server state management |
| Forms | React Hook Form | Form validation & handling |
| Authentication | Supabase Auth | User authentication |
| Internationalization | next-i18next | Multi-language support |

### Backend (Core API)

| Category | Technology | Purpose |
|----------|-----------|---------|
| Runtime | Node.js 20 | JavaScript runtime |
| Framework | Express.js | Web framework |
| Language | JavaScript (ESM) | Server-side logic |
| Validation | Zod | Schema validation |
| Database Client | Supabase JS | Database operations |
| Payment Processing | Stripe | Payment integration |
| Testing | Jest + Supertest | Unit & integration tests |

### AI Engine

| Category | Technology | Purpose |
|----------|-----------|---------|
| Language | Python 3.11 | AI/ML development |
| Framework | FastAPI | High-performance async API |
| Embeddings | Sentence-Transformers | Semantic similarity |
| Model | all-MiniLM-L6-v2 | Lightweight embedding model |
| HTTP Client | httpx | Async HTTP requests |
| Testing | pytest | Python testing |

### Database & Infrastructure

| Category | Technology | Purpose |
|----------|-----------|---------|
| Database | PostgreSQL (Supabase) | Relational database |
| Authentication | Supabase Auth | User management |
| Storage | Supabase Storage | File storage (future) |
| Hosting (Frontend) | Vercel | Serverless deployment |
| Hosting (AI) | Google Cloud Run | Containerized AI service |
| CI/CD | GitHub Actions | Automated deployments |
| Monorepo | pnpm workspaces | Dependency management |

---

## High-Level Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet / Users                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                ┌───────────────┴────────────────┐
                │                                │
         getori.app                        app.getori.app
      (Marketing Site)                   (Application)
                │                                │
                └────────────┬───────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   Vercel Edge    │
                    │   CDN + Routing  │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌───────▼────────┐   ┌──────▼──────┐
   │          │      │                │   │             │
   │ Frontend │      │   Core API     │   │   Stripe    │
   │ (Next.js)│◄─────┤  (Express.js)  │──►│  Webhooks   │
   │          │      │                │   │             │
   └────┬─────┘      └───────┬────────┘   └─────────────┘
        │                    │
        │                    │
        │            ┌───────┴────────┐
        │            │                │
        │     ┌──────▼─────┐   ┌──────▼──────┐
        │     │            │   │             │
        │     │  Supabase  │   │ AI Engine   │
        │     │  (Auth +   │   │  (FastAPI)  │
        └────►│  Database) │   │             │
              │            │   │ Embeddings  │
              └────────────┘   └─────────────┘
                                      │
                              ┌───────▼────────┐
                              │ Hugging Face   │
                              │ Model Cache    │
                              └────────────────┘
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                         (main branch)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Merge PR
                           ↓
              ┌────────────────────────┐
              │   GitHub Actions       │
              │   (CI/CD Pipeline)     │
              └────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ↓               ↓               ↓
    ┌──────────┐    ┌──────────┐   ┌──────────────┐
    │  Verify  │    │  Deploy  │   │   Deploy     │
    │  (Lint,  │    │ Frontend │   │  AI Engine   │
    │  Build,  │    │    to    │   │     to       │
    │  Test)   │    │  Vercel  │   │  Cloud Run   │
    └──────────┘    └──────────┘   └──────────────┘
                           │
                           ↓
                  ┌────────────────┐
                  │   Run Supabase │
                  │   Migrations   │
                  └────────────────┘
                           │
                           ↓
                  ✅ Production Deployed
```

---

## Data Flow Patterns

### 1. User Authentication Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │                │          │                │          │
│  User    │───Sign In─────►│ Frontend │───POST /auth──►│ Supabase │
│          │                │          │                │   Auth   │
│          │                │          │◄──JWT Token────│          │
└──────────┘                └─────┬────┘                └──────────┘
                                  │
                                  │ Store token in:
                                  │ - HTTP-only cookie (secure)
                                  │ - AuthContext (React)
                                  ↓
                            ┌──────────┐
                            │ Protected│
                            │  Routes  │
                            │ Unlocked │
                            └──────────┘
```

**Detailed Steps**:

1. **User Action**: Click "Sign In" or "Sign Up"
2. **Frontend**:
   - Collects credentials (email + password)
   - Calls `supabase.auth.signInWithPassword()`
3. **Supabase Auth**:
   - Validates credentials
   - Returns JWT access token + refresh token
4. **Frontend**:
   - Stores tokens in HTTP-only cookies
   - Updates `AuthContext` with user object
   - Redirects to `/app/dashboard`
5. **Subsequent Requests**:
   - Include `Authorization: Bearer <token>` header
   - Core API validates JWT signature
   - Supabase RLS enforces user-level access

### 2. Data Fetching Flow (React Query Pattern)

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│          │          │          │          │          │          │          │
│Component │─useHook─►│React Hook│─API Call►│Core API  │─Query───►│ Database │
│          │          │(useQuery)│          │          │          │          │
│          │◄─Data────│          │◄Response─│          │◄─Rows────│          │
└──────────┘          └──────────┘          └──────────┘          └──────────┘
                            │
                            │ Cache (5 min default)
                            ↓
                      ┌──────────┐
                      │  React   │
                      │  Query   │
                      │  Cache   │
                      └──────────┘
```

**Example: Fetching User Profile**

```typescript
// 1. API Client (src/integrations/api/profile.ts)
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders() // Gets JWT from cookies
  const res = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

// 2. React Hook (src/hooks/useProfile.ts)
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

// 3. Component Usage (src/components/profile/ProfilePage.tsx)
export function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage />
  return <ProfileDisplay profile={profile} />
}
```

**Key Features**:
- ✅ Automatic caching (5-minute stale time)
- ✅ Background refetching
- ✅ Retry on failure (3 attempts)
- ✅ Loading & error states
- ✅ No manual state management
- ❌ No mock data in components

### 3. Profile Update Flow (Mutation)

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│          │          │          │          │          │          │          │
│  User    │─Submit──►│ Frontend │─PUT /api►│Core API  │─UPDATE──►│ Database │
│  Edits   │          │  (Form)  │          │          │          │          │
│  Form    │          │          │          │  Zod     │          │   RLS    │
│          │          │          │          │Validation│          │  Check   │
└──────────┘          └─────┬────┘          └─────┬────┘          └─────┬────┘
                            │                     │                     │
                            │                     │                     │
                            ↓                     ↓                     ↓
                      ┌──────────┐          ┌──────────┐          ┌──────────┐
                      │  React   │          │  Stripe  │          │  Return  │
                      │  Query   │          │  Webhook │          │  Updated │
                      │Invalidate│          │(if plan) │          │   Row    │
                      └──────────┘          └──────────┘          └──────────┘
```

**Detailed Steps**:

1. **User Action**: Edit profile field, click "Save"
2. **Frontend Validation**:
   - React Hook Form validates input
   - Client-side Zod schema check
3. **API Request**:
   - `PUT /api/v1/profile`
   - Includes JWT in `Authorization` header
   - Payload: `{ name: "...", bio: "..." }`
4. **Core API Processing**:
   - Express route handler receives request
   - Validates JWT (extracts `user_id`)
   - Zod schema validation on payload
   - Calls Supabase with service role key
5. **Database Update**:
   - PostgreSQL executes UPDATE query
   - RLS policy: `auth.uid() = user_id` (enforces ownership)
   - Returns updated row
6. **Response**:
   - Core API returns updated profile
   - Frontend receives response
7. **Cache Invalidation**:
   - React Query invalidates `['profile']` cache
   - Triggers automatic refetch
   - UI updates with new data

### 4. Job Search & AI Matching Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│          │          │          │          │          │          │          │
│  User    │─Search──►│ Frontend │─POST────►│Core API  │─Forward─►│AI Engine │
│  Query   │          │          │          │          │          │          │
└──────────┘          └──────────┘          └─────┬────┘          └─────┬────┘
                                                  │                     │
                                                  │                     │
                                       Timeout    │           Generate  │
                                       30s        │           Embeddings│
                                                  │                     │
                                                  │                     ↓
                                                  │              ┌──────────┐
                                                  │              │  Compare │
                                                  │              │   with   │
                                                  │              │Job Store │
                                                  │              └─────┬────┘
                                                  │                    │
                                                  │◄───Return Top 10───┘
                                                  │
                                       ┌──────────▼─────────┐
                                       │  Fallback to       │
                                       │  Skill-Based       │
                                       │  Matching          │
                                       │  (if AI fails)     │
                                       └──────────┬─────────┘
                                                  │
                                                  ↓
                                          ┌──────────────┐
                                          │   Return     │
                                          │   Results    │
                                          └──────────────┘
```

**AI-Powered Matching Algorithm**:

```python
# services/ai-engine/main.py

# 1. User submits skills: ["JavaScript", "React", "TypeScript"]
user_skills = request.skills

# 2. Generate embedding vector (384 dimensions)
user_embedding = model.encode(user_skills)
# Output: [0.234, -0.112, 0.445, ..., 0.167]

# 3. Compare with job embeddings (cosine similarity)
job_scores = []
for job in job_database:
    job_embedding = precomputed_embeddings[job.id]
    similarity = cosine_similarity(user_embedding, job_embedding)
    job_scores.append((job, similarity))

# 4. Sort by similarity score (descending)
top_jobs = sorted(job_scores, key=lambda x: x[1], reverse=True)[:10]

# 5. Return ranked results
return {
    "jobs": [
        {
            "id": job.id,
            "title": job.title,
            "match_score": similarity,
            "company": job.company
        }
        for job, similarity in top_jobs
    ]
}
```

**Graceful Degradation**:

If AI Engine is unavailable:

```javascript
// services/core-api/src/routes/jobs.js

try {
  // Attempt AI-powered matching
  const aiResults = await fetch(`${AI_ENGINE_URL}/match`, {
    timeout: 30000 // 30 seconds
  })
  return aiResults
} catch (error) {
  // Fallback to skill-based filtering
  const fallbackResults = await supabase
    .from('jobs')
    .select('*')
    .contains('required_skills', userSkills)
    .order('posted_at', { ascending: false })
    .limit(10)

  return fallbackResults
}
```

### 5. Payment Processing Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│          │          │          │          │          │          │          │
│  User    │─Subscribe►│ Frontend │─Checkout►│Core API  │─Create──►│  Stripe  │
│          │          │          │          │          │  Session │          │
│          │◄─────────│          │◄─URL─────│          │◄─────────│          │
└──────────┘          └──────────┘          └──────────┘          └──────────┘
     │                                                                    │
     │                                                                    │
     └──────────────────Redirect to Stripe Checkout──────────────────────┘
                                    │
                                    │ User completes payment
                                    ↓
                           ┌────────────────┐
                           │  Stripe sends  │
                           │  webhook event │
                           └───────┬────────┘
                                   │
                                   ↓
                           ┌────────────────┐
                           │   Core API     │
                           │   /webhooks    │
                           │   /stripe      │
                           └───────┬────────┘
                                   │
                        ┌──────────┼──────────┐
                        │          │          │
                        ↓          ↓          ↓
                  ┌─────────┐ ┌────────┐ ┌────────┐
                  │ Verify  │ │Update  │ │ Send   │
                  │Signature│ │Database│ │ Email  │
                  └─────────┘ └────────┘ └────────┘
```

**Detailed Webhook Processing**:

```javascript
// services/core-api/src/routes/webhooks.js

// CRITICAL: Stripe webhook MUST be before express.json()
// Reason: Stripe signature verification requires raw body

app.post('/api/v1/webhooks/stripe',
  express.raw({ type: 'application/json' }), // Keep raw body
  async (req, res) => {
    const sig = req.headers['stripe-signature']

    // 1. Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // 2. Handle event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        await handleCheckoutComplete(session)
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        await handleSubscriptionUpdate(subscription)
        break

      case 'invoice.payment_failed':
        const invoice = event.data.object
        await handlePaymentFailed(invoice)
        break
    }

    res.json({ received: true })
  }
)

async function handleCheckoutComplete(session) {
  // 1. Extract user ID from metadata
  const userId = session.metadata.user_id

  // 2. Update user subscription in database
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      stripe_subscription_id: session.subscription,
      stripe_customer_id: session.customer,
      current_period_end: new Date(session.subscription.current_period_end * 1000)
    })
    .eq('user_id', userId)

  // 3. Grant access to premium features
  await supabase
    .from('user_profiles')
    .update({ subscription_tier: 'premium' })
    .eq('id', userId)

  // 4. Send confirmation email (future)
  // await sendEmail({ to: session.customer_email, template: 'welcome' })
}
```

---

## Authentication & Authorization

### JWT-Based Authentication

```
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Auth Flow                         │
└─────────────────────────────────────────────────────────────┘

1. User signs in with email + password
   ↓
2. Supabase Auth validates credentials
   ↓
3. Supabase generates JWT tokens:
   - Access Token (1 hour expiry)
   - Refresh Token (30 days expiry)
   ↓
4. Frontend stores tokens in HTTP-only cookies
   ↓
5. Every request includes: Authorization: Bearer <access_token>
   ↓
6. Backend validates JWT signature using Supabase public key
   ↓
7. Extract user_id from JWT payload
   ↓
8. Use user_id for database queries (RLS enforced)
```

### Row-Level Security (RLS)

**Problem**: How to ensure users can only access their own data?

**Solution**: PostgreSQL Row-Level Security policies

```sql
-- Example: User profiles RLS policy
CREATE POLICY "Users can only view their own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id);
```

**How It Works**:

1. **Frontend Request**: `GET /api/v1/profile`
2. **JWT Included**: `Authorization: Bearer eyJhbG...`
3. **Core API Extracts User ID**: `user_id = jwt.payload.sub`
4. **Database Query**:
   ```javascript
   const { data } = await supabase
     .from('user_profiles')
     .select('*')
     .eq('id', user_id)
     .single()
   ```
5. **RLS Policy Enforced**: Database automatically filters rows where `id = user_id`
6. **User Can Only See Their Data**: Even if Core API tries to query other users' data, RLS blocks it

### Authorization Levels

| Key Type | Access Level | Where Used | Can Access |
|----------|--------------|------------|------------|
| **Anon Key** | Public | Frontend (`NEXT_PUBLIC_*`) | Public tables only |
| **User JWT** | User-level | Frontend + Core API | Own data (via RLS) |
| **Service Role** | Admin | Core API only (backend) | All data (bypasses RLS) |

**Security Rules**:
- ✅ Frontend uses anon key for public operations
- ✅ User JWT for authenticated operations (RLS enforced)
- ✅ Service role key ONLY in backend (never exposed)
- ❌ Never use service role key in frontend
- ❌ Never log or expose service role key

---

## State Management

### React Query for Server State

**Philosophy**: Server state ≠ Client state

- **Server State**: Data from APIs (profiles, jobs, applications)
- **Client State**: UI state (modals, forms, local toggles)

```typescript
// ✅ GOOD: React Query for server state
const { data: profile } = useQuery({
  queryKey: ['profile'],
  queryFn: fetchProfile,
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// ✅ GOOD: React Context for client state
const { theme, setTheme } = useTheme() // UI preference
const { isModalOpen, openModal } = useModal() // UI state

// ❌ BAD: useState for server data
const [profile, setProfile] = useState(null) // Don't do this!
```

### State Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend State Layers                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Component State (useState, useReducer)            │    │
│  │  - Form inputs                                      │    │
│  │  - Temporary UI state                               │    │
│  │  - Component-specific toggles                       │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────┐    │
│  │  React Context (AuthProvider, ThemeProvider)       │    │
│  │  - User authentication state                        │    │
│  │  - Theme (light/dark mode)                          │    │
│  │  - Language preference                              │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────┐    │
│  │  React Query (Server State Cache)                  │    │
│  │  - User profiles                                    │    │
│  │  - Job listings                                     │    │
│  │  - Applications                                     │    │
│  │  - Dashboard statistics                             │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │                                          │
│                   ↓                                          │
│          ┌─────────────────┐                                │
│          │   Core API      │                                │
│          │   Database      │                                │
│          └─────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

### Cache Management

**React Query Cache Strategy**:

```typescript
// Global cache configuration (src/app/providers.tsx)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (data considered fresh)
      cacheTime: 10 * 60 * 1000, // 10 minutes (keep in memory)
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
})
```

**Cache Invalidation Patterns**:

```typescript
// 1. After mutation (automatic)
const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] })
  },
})

// 2. Manual invalidation
queryClient.invalidateQueries({ queryKey: ['jobs'] })

// 3. Optimistic updates
const mutation = useMutation({
  mutationFn: updateProfile,
  onMutate: async (newProfile) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['profile'] })

    // Get current cached data
    const previous = queryClient.getQueryData(['profile'])

    // Optimistically update cache
    queryClient.setQueryData(['profile'], newProfile)

    return { previous }
  },
  onError: (err, newProfile, context) => {
    // Rollback on error
    queryClient.setQueryData(['profile'], context.previous)
  },
})
```

---

## API Communication

### API Client Pattern

**File Structure**:
```
src/integrations/api/
├── index.ts                 # Exports all API functions
├── auth.ts                  # Authentication API calls
├── profile.ts               # Profile CRUD operations
├── jobs.ts                  # Job search & matching
├── applications.ts          # Job applications
├── payments.ts              # Stripe payment operations
└── utils/
    ├── getAuthHeaders.ts    # JWT token extraction
    ├── handleApiError.ts    # Error handling utility
    └── config.ts            # API URL configuration
```

**Example API Client**:

```typescript
// src/integrations/api/profile.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  }
}

export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  return res.json()
}
```

### Error Handling Strategy

**API Error Response Format**:

```typescript
// Standardized error response from Core API
interface ApiError {
  error: {
    message: string
    code: string
    details?: unknown
  }
}

// Example error responses:
// 400 Bad Request
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": { "field": "email", "issue": "Invalid email format" }
  }
}

// 401 Unauthorized
{
  "error": {
    "message": "Invalid or expired token",
    "code": "UNAUTHORIZED"
  }
}

// 500 Internal Server Error
{
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR"
  }
}
```

---

## Database Architecture

### Schema Structure

See [`CORE_DATABASE_SCHEMA.md`](../CORE_DATABASE_SCHEMA.md) for complete schema documentation.

**Key Tables**:

| Table | Purpose | RLS Policy |
|-------|---------|------------|
| `user_profiles` | User account information | User can only access own profile |
| `experiences` | Work experience entries | User owns via `user_id` FK |
| `education` | Education history | User owns via `user_id` FK |
| `applications` | Job applications tracking | User owns via `user_id` FK |
| `subscriptions` | Stripe subscription data | User owns via `user_id` FK |
| `notification_preferences` | Notification settings | User owns via `user_id` FK |
| `onboarding_sessions` | Onboarding progress | User owns via `user_id` FK |

### Type Generation Flow

```
┌────────────────────────────────────────────────────────────┐
│         Database-First Type Generation                      │
└────────────────────────────────────────────────────────────┘

1. Define schema in SQL migrations (supabase/migrations/)
   ↓
2. Apply migrations: supabase db push
   ↓
3. Generate TypeScript types: supabase gen types typescript
   ↓
4. Types available in shared/types/src/database.types.ts
   ↓
5. Frontend and backend use these types
   ↓
Result: End-to-end type safety from database to UI
```

---

## Payment Processing

### Stripe Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Stripe Payment Flow                             │
└─────────────────────────────────────────────────────────────┘

Frontend                Core API                    Stripe
   │                        │                          │
   │──POST /checkout───────►│                          │
   │   {priceId: "..."}     │                          │
   │                        │──createCheckoutSession──►│
   │                        │                          │
   │◄───checkout URL────────│◄────session object──────│
   │                        │                          │
   │                                                    │
   │──────────Redirect to Stripe Checkout──────────────►│
   │                                                    │
   │◄──────────Payment Form (Stripe hosted)────────────│
   │                                                    │
   │──────────User completes payment────────────────────►│
   │                                                    │
   │                        │◄───Webhook event─────────│
   │                        │    (async, server-to-     │
   │                        │     server)               │
   │                        │                          │
   │                        │──Update database─────────►│
   │                        │  (subscription active)    │
   │                        │                          │
   │◄───Redirect to success page with session_id───────│
   │                        │                          │
   │──GET /subscription─────►│                          │
   │                        │──Query database───►      │
   │◄───{status: "active"}──│◄──subscription data──    │
```

### Webhook Security

**Critical Requirements**:

1. **Webhook Endpoint MUST Process Raw Body**:
   ```javascript
   // ❌ WRONG: Don't use express.json() before webhook route
   app.use(express.json())
   app.post('/webhooks/stripe', ...) // Body is already parsed!

   // ✅ CORRECT: Use express.raw() for webhook route
   app.post('/webhooks/stripe',
     express.raw({ type: 'application/json' }),
     stripeWebhookHandler
   )
   ```

2. **Always Verify Signature**:
   ```javascript
   const sig = req.headers['stripe-signature']
   const event = stripe.webhooks.constructEvent(
     req.body, // Must be raw buffer
     sig,
     process.env.STRIPE_WEBHOOK_SECRET
   )
   ```

3. **Handle Idempotency**:
   ```javascript
   // Store event IDs to prevent duplicate processing
   const eventId = event.id
   const existing = await supabase
     .from('processed_webhooks')
     .select('id')
     .eq('event_id', eventId)
     .single()

   if (existing) {
     return res.json({ received: true }) // Already processed
   }

   // Process event...

   // Store event ID
   await supabase
     .from('processed_webhooks')
     .insert({ event_id: eventId })
   ```

---

## AI Engine Integration

### Semantic Job Matching

**How It Works**:

1. **User Skills Input**: `["JavaScript", "React", "Node.js"]`
2. **Generate Embedding**:
   ```python
   from sentence_transformers import SentenceTransformer

   model = SentenceTransformer('all-MiniLM-L6-v2')
   user_embedding = model.encode(user_skills)
   # Output: 384-dimensional vector
   # [0.123, -0.456, 0.789, ..., 0.234]
   ```

3. **Compare with Job Embeddings**:
   ```python
   from sklearn.metrics.pairwise import cosine_similarity

   for job in jobs:
       job_embedding = job.skills_embedding
       similarity = cosine_similarity([user_embedding], [job_embedding])[0][0]
       scores.append((job, similarity))
   ```

4. **Rank and Return Top Matches**:
   ```python
   top_jobs = sorted(scores, key=lambda x: x[1], reverse=True)[:10]
   ```

**Advantages Over Keyword Matching**:
- ✅ Understands semantic similarity ("JavaScript" ≈ "JS" ≈ "ECMAScript")
- ✅ Finds related skills ("React" → suggests "Redux", "Next.js")
- ✅ Tolerates typos and variations
- ✅ Better ranking (relevance score)

**Fallback Strategy**:

If AI Engine is down:
```javascript
// Core API falls back to skill-based filtering
const jobs = await supabase
  .from('jobs')
  .select('*')
  .contains('required_skills', userSkills)
  .order('posted_at', { ascending: false })
```

---

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│              Security Layers                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Edge (Vercel CDN)                                 │
│  - DDoS protection                                           │
│  - HTTPS enforcement                                         │
│  - Rate limiting (IP-based)                                  │
│                                                              │
│  Layer 2: Frontend (Next.js)                                │
│  - Client-side validation                                    │
│  - CSRF protection (SameSite cookies)                        │
│  - XSS prevention (React escaping)                           │
│                                                              │
│  Layer 3: API Gateway (Core API)                            │
│  - JWT validation                                            │
│  - Request validation (Zod schemas)                          │
│  - Rate limiting (user-based)                                │
│  - CORS configuration                                        │
│                                                              │
│  Layer 4: Database (PostgreSQL RLS)                         │
│  - Row-Level Security policies                               │
│  - Column permissions                                        │
│  - Audit logging                                             │
│                                                              │
│  Layer 5: Payment (Stripe)                                  │
│  - Webhook signature verification                            │
│  - Idempotency checks                                        │
│  - Test/Live mode separation                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Checklist

- [x] HTTPS enforced everywhere
- [x] JWT-based authentication
- [x] Row-Level Security (RLS) on all tables
- [x] Service role key isolated to backend only
- [x] Stripe webhook signature verification
- [x] Input validation (Zod schemas)
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (React escaping)
- [x] CSRF protection (SameSite cookies)
- [x] Rate limiting on API endpoints
- [x] CORS configured for specific origins
- [ ] Two-factor authentication (future)
- [ ] Security headers (CSP, HSTS) (future)
- [ ] Audit logging (future)

---

## Caching & Performance

### Frontend Caching Strategy

| Data Type | Cache Duration | Strategy | Invalidation |
|-----------|----------------|----------|--------------|
| User Profile | 5 minutes | React Query | On mutation |
| Job Listings | 2 minutes | React Query | Manual refresh |
| Dashboard Stats | 1 minute | React Query | On navigation |
| Static Content | 1 hour | Next.js Cache | Build time |
| API Responses | 5 minutes | React Query | On mutation |

### CDN & Edge Caching

**Vercel Edge Network**:
- Static assets: Cached globally (immutable)
- Dynamic pages: Smart caching based on headers
- API routes: No edge caching (serverless execution)

### Performance Optimizations

1. **Code Splitting**:
   ```typescript
   // Dynamic imports for large components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Spinner />,
     ssr: false // Client-side only
   })
   ```

2. **Image Optimization**:
   ```tsx
   <Image
     src="/logo.png"
     width={200}
     height={100}
     alt="Logo"
     priority // LCP optimization
   />
   ```

3. **Database Query Optimization**:
   ```sql
   -- Use indexes on frequently queried columns
   CREATE INDEX idx_applications_user_id ON applications(user_id);
   CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
   ```

---

## Error Handling

### Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Error Handling Layers                       │
└─────────────────────────────────────────────────────────────┘

Frontend Error:
  Try/Catch → React Query Error State → ErrorBoundary → User Message

API Error:
  Validation → Zod Error → Express Error Handler → Formatted Response

Database Error:
  RLS Violation → Supabase Error → API Error Handler → User Message

External API Error:
  Timeout → Retry Logic → Fallback → Graceful Degradation
```

### Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx

export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service (future)
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

---

## Additional Resources

- **API Reference**: [`docs/API_ENDPOINTS.md`](../API_ENDPOINTS.md)
- **Database Schema**: [`docs/CORE/CORE_DATABASE_SCHEMA.md`](../CORE_DATABASE_SCHEMA.md)
- **Environment Variables**: [`docs/REFERENCE/REFERENCE_ENV_VARS.md`](../../REFERENCE/REFERENCE_ENV_VARS.md)
- **Deployment**: [`docs/OPERATIONS/OPS_DEPLOYMENT_RUNBOOK.md`](../../OPERATIONS/OPS_DEPLOYMENT_RUNBOOK.md)
- **Implementation Guide**: [`CLAUDE.md`](../../../CLAUDE.md)

---

**Last Updated**: 2025-11-10
**Version**: 2.0
**Maintainer**: Ori Platform Team
