# Ori Platform Core-API Backend - Exhaustive Analysis

**Analysis Date**: 2025-11-13  
**Location**: `/Users/carlo/Desktop/Projects/ori-platform/services/core-api/src/`  
**Framework**: Express.js (Node.js/TypeScript)  
**Database**: Supabase (PostgreSQL with RLS)  
**Payment**: Stripe API v2024-06-20  
**AI Integration**: Custom AI Engine (Python FastAPI)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints Documentation](#api-endpoints-documentation)
3. [Data Models & Database Schema](#data-models--database-schema)
4. [Business Logic & Services](#business-logic--services)
5. [Middleware Stack](#middleware-stack)
6. [Integration Points](#integration-points)
7. [Testing Infrastructure](#testing-infrastructure)
8. [Security Patterns](#security-patterns)
9. [Code Examples](#code-examples)
10. [Architectural Patterns](#architectural-patterns)

---

## 1. Architecture Overview

### Application Entry Point
**File**: `src/index.ts`

```
┌─────────────────────────────────────────┐
│         Express Application             │
│  Port: 3001 (development)               │
└─────────────────────────────────────────┘
           ▼
    ┌──────────────┐
    │  CORS Setup  │
    └──────────────┘
           ▼
    ┌──────────────────────────┐
    │ Stripe Webhook (RAW)     │ ◄── CRITICAL: Before express.json()
    │ /api/v1/payments/webhook │
    └──────────────────────────┘
           ▼
    ┌──────────────┐
    │ express.json │ ◄── Body parser
    └──────────────┘
           ▼
    ┌──────────────────────────┐
    │   Mounted Route Modules  │
    └──────────────────────────┘
```

### Route Mounting
```typescript
app.use('/api/v1/applications', applicationRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/experiences', experiencesRoutes)
app.use('/api/v1/education', educationRoutes)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/jobs', jobRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/setup-intent', setupIntentRouter)
app.use('/api/v1/subscriptions', subscriptionsRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/onboarding', onboardingRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/notifications', notificationsRouter)
app.use('/api/v1/beta-testers', betaTestersRouter)
```

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | - |
| Framework | Express.js | ^4.19.2 |
| Language | TypeScript | ^5.9.3 |
| Validation | Zod | ^4.1.12 |
| Database | Supabase (PostgreSQL) | ^2.80.0 |
| Payments | Stripe | ^16.12.0 |
| Authentication | Supabase Auth (JWT) | - |
| CORS | cors | ^2.8.5 |
| Testing | Jest + Supertest | ^30.2.0 |
| Dev Runner | tsx | ^4.20.6 |

---

## 2. API Endpoints Documentation

### 2.1 Authentication & User Management

#### **GET /api/v1/users/me**
**Purpose**: Get current user profile  
**Auth**: Required (JWT token)  
**File**: `src/routes/users.ts`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200):
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "headline": "Software Engineer",
  "skills": ["TypeScript", "React"],
  "target_roles": ["Senior Engineer"],
  "subscription_status": "free",
  "onboarding_completed": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Errors**:
- 401: User not authenticated
- 404: User profile not found
- 500: Internal server error

**Database Query**:
```sql
SELECT * FROM user_profiles WHERE user_id = $1
```

**RLS Policy**: User can only read their own profile

---

#### **GET /api/v1/profile**
**Purpose**: Fetch authenticated user's profile  
**Auth**: Required  
**File**: `src/routes/profile.ts`

**Response** (200):
```json
{
  "user_id": "uuid",
  "full_name": "John Doe",
  "headline": "Software Engineer",
  "location": "San Francisco, CA",
  "about": "Passionate developer...",
  "long_term_vision": "Build impactful products",
  "skills": ["TypeScript", "React", "Node.js"],
  "target_roles": ["Senior Engineer", "Tech Lead"],
  "work_style": "Remote",
  "industries": ["Tech", "SaaS"],
  "goal": "Transition to senior role",
  "cv_url": "https://...",
  "stripe_customer_id": "cus_xxx",
  "subscription_status": "plus_monthly",
  "onboarding_completed": true
}
```

---

#### **PUT /api/v1/profile**
**Purpose**: Update user profile  
**Auth**: Required  
**File**: `src/routes/profile.ts`

**Request Body**:
```json
{
  "full_name": "John Doe",
  "headline": "Senior Software Engineer",
  "location": "New York, NY",
  "about": "10+ years experience...",
  "long_term_vision": "CTO at a startup",
  "skills": ["TypeScript", "React", "GraphQL"],
  "target_roles": ["Tech Lead", "Engineering Manager"],
  "work_style": "Hybrid",
  "industries": ["Fintech", "Healthcare"],
  "goal": "Lead engineering teams",
  "cv_url": "https://storage.url/cv.pdf"
}
```

**Validation**:
- `full_name`: max 200 chars
- `headline`: max 200 chars
- `location`: max 100 chars
- `about`: max 5000 chars
- `long_term_vision`: max 2000 chars
- `goal`: max 1000 chars
- `work_style`: enum ["Remote", "Hybrid", "On-site"]

**Response** (200):
```json
{
  "user_id": "uuid",
  "full_name": "John Doe",
  "updated_at": "2024-01-01T12:00:00Z",
  ...
}
```

---

#### **PUT /api/v1/profile/onboarding**
**Purpose**: Complete onboarding and update profile  
**Auth**: Required  
**File**: `src/routes/profile.ts`

**Special Behavior**:
1. Sets `onboarding_completed = true`
2. Creates Stripe customer if doesn't exist
3. Updates profile with onboarding data

**Side Effects**:
- Creates Stripe customer record
- Links Stripe customer ID to user profile

---

### 2.2 Onboarding System

#### **POST /api/v1/onboarding/session**
**Purpose**: Save/update onboarding session progress  
**Auth**: Required  
**File**: `src/routes/onboarding.js`

**Request Body**:
```json
{
  "currentStep": 3,
  "completedSteps": [0, 1, 2],
  "formData": {
    "step0": { "full_name": "John" },
    "step1": { "skills": ["TypeScript"] },
    "step2": { "dream_role": "CTO" }
  },
  "lastSavedAt": "2024-01-01T12:00:00Z"
}
```

**Validation Schema** (Zod):
```typescript
const OnboardingSessionSchema = z.object({
  currentStep: z.number().min(0).max(5),
  completedSteps: z.array(z.number()),
  formData: z.record(z.any()),
  lastSavedAt: z.string().optional(),
})
```

**Response** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "current_step": 3,
  "completed_steps": [0, 1, 2],
  "form_data": {...},
  "last_saved_at": "2024-01-01T12:00:00Z",
  "created_at": "2024-01-01T10:00:00Z"
}
```

**Database Operations**:
1. Check for existing incomplete session
2. If exists: UPDATE
3. If not: INSERT
4. Track analytics event: 'session_saved'

---

#### **GET /api/v1/onboarding/session**
**Purpose**: Get current onboarding session  
**Auth**: Required

**Response** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "current_step": 2,
  "completed_steps": [0, 1],
  "form_data": {...},
  "completed_at": null
}
```

**Returns null** if no active session exists

---

#### **DELETE /api/v1/onboarding/session**
**Purpose**: Abandon onboarding session  
**Auth**: Required

**Action**: Sets `abandoned_at` timestamp

---

#### **PUT /api/v1/onboarding/complete**
**Purpose**: Complete onboarding and save profile  
**Auth**: Required

**Request Body** (Validated with ProfileDataSchema):
```json
{
  "full_name": "John Doe",
  "preferred_name": "John",
  "current_status": "professional",
  "years_experience": 5,
  "location": "San Francisco",
  "is_remote_open": true,
  "cv_url": "https://...",
  "linkedin_url": "https://...",
  "skills": ["TypeScript", "React"],
  "skill_levels": { "TypeScript": 8, "React": 9 },
  "hidden_talents": ["Public Speaking"],
  "dream_role": "Engineering Manager",
  "timeline_months": 12,
  "long_term_vision": "CTO",
  "target_roles": ["Tech Lead", "Manager"],
  "work_styles": { "remote": 10, "hybrid": 5, "onsite": 0 },
  "culture_values": ["Innovation", "Work-Life Balance"],
  "deal_breakers": ["Long commute"],
  "industries": ["Tech", "Healthcare"]
}
```

**Onboarding Profile Fields**:

| Field | Type | Validation |
|-------|------|------------|
| full_name | string | max 200 |
| preferred_name | string | max 100 |
| profile_photo_url | url | optional |
| current_status | enum | student/professional/transitioning/exploring |
| years_experience | number | 0-50 |
| location | string | optional |
| is_remote_open | boolean | - |
| cv_url | url | optional |
| linkedin_url | url | optional |
| skills | string[] | - |
| skill_levels | Record<string, number> | - |
| hidden_talents | string[] | - |
| dream_role | string | max 200 |
| timeline_months | enum | 6/12/24/36/60 |
| long_term_vision | string | - |
| target_roles | string[] | - |
| work_styles | Record<string, number> | - |
| culture_values | string[] | - |
| deal_breakers | string[] | - |
| industries | string[] | - |

**Process Flow**:
1. Validate profile data
2. Update `user_profiles` with `onboarding_completed = true`
3. Calculate profile completeness score
4. Unlock features based on completeness
5. Mark session as completed
6. Track analytics event
7. Create Stripe customer (non-blocking)

**Profile Completeness Calculation**:
```javascript
// Required fields (60 points)
full_name: 10
current_status: 10
location: 10
years_experience: 10
skills (>= 3): 20

// Valuable optional (30 points)
dream_role: 5
timeline_months: 5
long_term_vision: 5
target_roles: 5
cv_url or linkedin_url: 10

// Nice to have (10 points)
work_styles: 5
culture_values: 5

Total: up to 100 points
```

**Feature Unlocking**:
- ≥30%: basic_matching
- ≥50%: ai_recommendations
- ≥70%: premium_insights
- ≥90%: full_access

---

#### **POST /api/v1/onboarding/analytics**
**Purpose**: Track onboarding analytics events  
**Auth**: Required

**Request Body**:
```json
{
  "eventType": "field_changed",
  "stepName": "step_1",
  "fieldName": "skills",
  "timeOnStep": 45000,
  "oldValue": ["TypeScript"],
  "newValue": ["TypeScript", "React"]
}
```

**Non-blocking**: Returns success even if analytics fail

---

#### **GET /api/v1/onboarding/skill-suggestions**
**Purpose**: Get skill suggestions based on role  
**Auth**: Required

**Query Parameters**:
- `role`: Target role (optional)
- `experience`: Experience level (optional)

**Response** (200):
```json
[
  {
    "skill": "TypeScript",
    "role": "Software Engineer",
    "experience_level": "mid",
    "relevance": 9
  }
]
```

---

### 2.3 Payment & Subscription Management

#### **POST /api/v1/payments/checkout**
**Purpose**: Create Stripe checkout session  
**Auth**: Required  
**File**: `src/routes/payments.ts`

**Validation Schema**:
```typescript
const createCheckoutSchema = z.object({
  userId: z.string().uuid(),
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
})
```

**Request Body**:
```json
{
  "userId": "uuid",
  "priceId": "price_xxxx",
  "successUrl": "https://app.getori.app/dashboard?success=true",
  "cancelUrl": "https://app.getori.app/pricing"
}
```

**Process Flow**:
1. Validate user can only checkout for themselves
2. Fetch user from database
3. Get or create Stripe customer
4. Save customer ID to user record
5. Create Stripe checkout session
6. Return checkout URL

**Response** (200):
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Stripe Session Configuration**:
```javascript
{
  customer: customerId,
  payment_method_types: ['card'],
  line_items: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',
  success_url: successUrl,
  cancel_url: cancelUrl,
  metadata: { userId }
}
```

---

#### **POST /api/v1/payments/portal**
**Purpose**: Create Stripe customer portal session  
**Auth**: Required  
**File**: `src/routes/payments.ts`

**Request Body**:
```json
{
  "userId": "uuid"
}
```

**Response** (200):
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

**Portal Configuration**:
```javascript
{
  customer: stripeCustomerId,
  return_url: "${FRONTEND_URL}/dashboard/settings"
}
```

**Use Case**: Users manage subscriptions, update payment methods, view invoices

---

#### **POST /api/v1/payments/webhook**
**Purpose**: Handle Stripe webhook events  
**Auth**: None (validates Stripe signature)  
**File**: `src/routes/payments.ts`

**CRITICAL REQUIREMENT**:
- Must receive raw request body
- Mounted BEFORE `express.json()` middleware
- Uses `express.raw({ type: 'application/json' })`

**Webhook Events Handled**:

| Event | Action | Database Update |
|-------|--------|-----------------|
| `checkout.session.completed` | Initial subscription creation | Set subscription_id, subscription_status |
| `customer.subscription.created` | Subscription activated | Set subscription_id, subscription_status |
| `customer.subscription.updated` | Plan change or status update | Update subscription_status |
| `customer.subscription.deleted` | Subscription cancelled | Set subscription_status = 'cancelled' |
| `invoice.payment_succeeded` | Recurring payment success | Log only (status updated by subscription.updated) |
| `invoice.payment_failed` | Recurring payment failed | Set status = 'past_due', send notification |
| `customer.source.expiring` | Payment method expiring | Send notification |

**Signature Verification**:
```typescript
const sig = req.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(
  req.body, // Raw body
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
)
```

**Status Mapping** (priceId → subscription_status):
```javascript
function getStatusFromPriceId(priceId: string): string {
  if (priceId === STRIPE_PLANS.plus_monthly.priceId) return 'plus_monthly'
  if (priceId === STRIPE_PLANS.plus_yearly.priceId) return 'plus_yearly'
  if (priceId === STRIPE_PLANS.premium_monthly.priceId) return 'premium_monthly'
  if (priceId === STRIPE_PLANS.premium_yearly.priceId) return 'premium_yearly'
  return 'free'
}
```

**Special Cases**:
- `past_due` status: Payment failed, grace period
- `cancelled` status: Subscription deleted/unpaid
- Notification triggers: payment failure, card expiring

**Example Event Processing** (`invoice.payment_failed`):
```typescript
case 'invoice.payment_failed': {
  const invoice = event.data.object
  const customerId = invoice.customer as string
  
  // Update database
  await supabase
    .from('user_profiles')
    .update({ subscription_status: 'past_due' })
    .eq('stripe_customer_id', customerId)
  
  // Send user notification
  await sendPaymentFailureNotification(supabase, customerId)
  break
}
```

---

#### **POST /api/v1/subscriptions**
**Purpose**: Create subscription with payment method  
**Auth**: Required  
**File**: `src/routes/subscriptions.ts`

**Validation Schema**:
```typescript
const createSubscriptionSchema = z.object({
  planId: z.enum([
    'plus_monthly',
    'plus_yearly',
    'premium_monthly',
    'premium_yearly',
  ]),
  paymentMethodId: z.string(),
})
```

**Request Body**:
```json
{
  "planId": "plus_monthly",
  "paymentMethodId": "pm_xxxx"
}
```

**Process Flow**:
1. Validate plan ID
2. Check price ID is configured
3. Ensure Stripe customer exists
4. Attach payment method to customer
5. Set as default payment method
6. Create subscription
7. Update user profile

**Stripe Subscription Config**:
```javascript
{
  customer: customerId,
  items: [{ price: priceId }],
  payment_settings: {
    payment_method_types: ['card'],
    save_default_payment_method: 'on_subscription',
  },
  expand: ['latest_invoice.payment_intent']
}
```

**Response** (200):
```json
{
  "subscriptionId": "sub_xxxx",
  "status": "active"
}
```

---

#### **POST /api/v1/setup-intent**
**Purpose**: Create Stripe Setup Intent for payment method collection  
**Auth**: Required  
**File**: `src/routes/setupIntent.ts`

**Use Case**: Embedded payment forms with Stripe Elements

**Request Body**:
```json
{
  "planId": "plus_monthly"
}
```

**Response** (200):
```json
{
  "clientSecret": "seti_xxxx_secret_xxxx",
  "setupIntentId": "seti_xxxx"
}
```

**Setup Intent Metadata**:
```javascript
{
  customer: customerId,
  payment_method_types: ['card'],
  metadata: {
    user_id: userId,
    plan_id: planId
  }
}
```

**Frontend Usage**:
```javascript
// Frontend uses clientSecret with Stripe Elements
const stripe = await loadStripe(publishableKey)
const result = await stripe.confirmCardSetup(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'John Doe' }
  }
})
```

---

### 2.4 Job Matching & Discovery

#### **GET /api/v1/jobs**
**Purpose**: Get all available jobs  
**Auth**: None (public)  
**File**: `src/routes/jobs.ts`

**Response** (200):
```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "description": "We're looking for...",
      "requirements": ["TypeScript", "React", "5+ years"],
      "location": "San Francisco, CA",
      "work_type": "remote",
      "salary_min": 120000,
      "salary_max": 180000,
      "tags": ["tech", "startup"],
      "posted_date": "2024-01-01",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Query**: Fetches latest 100 jobs ordered by `created_at DESC`

---

#### **POST /api/v1/jobs/find-matches**
**Purpose**: AI-powered job matching for user  
**Auth**: Required  
**File**: `src/routes/jobs.ts`

**Validation Schema**:
```typescript
const findMatchesSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().min(1).max(20).default(6),
  filters: z.object({
    location: z.string().optional(),
    workType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
    salaryMin: z.number().optional(),
  }).optional(),
})
```

**Request Body**:
```json
{
  "userId": "uuid",
  "limit": 6,
  "filters": {
    "location": "San Francisco",
    "workType": "remote",
    "salaryMin": 100000
  }
}
```

**Process Flow**:
1. Validate user can only request own matches
2. Fetch user profile
3. Apply filters to jobs query
4. Check AI engine health
5. **If AI available**: Use AI matching
6. **If AI unavailable**: Use fallback skill matching
7. Increment usage counter

**AI Matching Request**:
```javascript
await aiClient.generateMatches({
  profile: {
    user_id: userId,
    skills: ['TypeScript', 'React'],
    experience_level: 'senior',
    years_of_experience: 5,
    roles: ['Engineer'],
    work_style: 'remote',
    industries: ['Tech'],
    location: 'San Francisco',
    willing_to_relocate: false,
    salary_min: 100000,
    goal: 'Lead engineering team'
  },
  jobs: [...], // Filtered jobs from DB
  limit: 6
})
```

**AI Response Structure**:
```typescript
interface MatchResult {
  job_id: string
  match_score: number           // 0-100 overall
  semantic_score: number         // 0-100 description match
  skill_match_score: number      // 0-100 skills overlap
  experience_score: number       // 0-100 experience match
  location_score: number         // 0-100 location fit
  reasoning: string              // Why this is a good match
  key_matches: string[]          // Top matched skills
  missing_skills: string[]       // Skills user lacks
}
```

**Fallback Skill Matching**:
```javascript
function calculateMatchScore(userSkills, jobRequirements) {
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase())
  const matchedCount = jobRequirements.filter(req => 
    normalizedUserSkills.some(skill => 
      skill.includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill)
    )
  ).length
  return Math.round((matchedCount / jobRequirements.length) * 100)
}
```

**Skills Gap Analysis**:
```javascript
const skillsGap = await aiClient.getSkillGap(
  userProfile.skills,
  job.requirements
)

// Response:
{
  userSkills: ['TypeScript', 'React'],
  requiredSkills: ['TypeScript', 'React', 'GraphQL'],
  missingSkills: ['GraphQL']
}
```

**Response** (200):
```json
{
  "matches": [
    {
      "id": "job_uuid",
      "title": "Senior Engineer",
      "company": "TechCorp",
      "matchScore": 87,
      "semanticScore": 92,
      "skillMatchScore": 80,
      "experienceScore": 90,
      "reasoning": "Strong TypeScript background matches requirements...",
      "keyMatches": ["TypeScript", "React", "Node.js"],
      "missingSkills": ["GraphQL"],
      "skills_analysis": [
        { "name": "TypeScript", "status": "matched" },
        { "name": "GraphQL", "status": "missing" }
      ],
      "skillsGap": {
        "userSkills": ["TypeScript", "React"],
        "requiredSkills": ["TypeScript", "React", "GraphQL"],
        "missingSkills": ["GraphQL"]
      }
    }
  ],
  "usage": {
    "used": 1,
    "limit": 10
  }
}
```

**Usage Tracking**:
```sql
UPDATE users 
SET monthly_job_matches_used = monthly_job_matches_used + 1 
WHERE id = $1
```

**Security**: Input sanitization prevents SQL injection
```javascript
const sanitizeFilterValue = (value) => value.replace(/[%_]/g, '').trim()
```

---

#### **POST /api/v1/jobs/initial-search**
**Purpose**: Simple job search by title  
**Auth**: Required

**Validation Schema**:
```typescript
const searchSchema = z.object({
  query: z.string()
    .trim()
    .min(1, 'Query too short')
    .max(100, 'Query too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters'),
  location: z.string().trim().max(100).optional(),
})
```

**Request Body**:
```json
{
  "query": "software engineer",
  "location": "New York"
}
```

**Security**: Prevents SQL injection
```javascript
const sanitizedQuery = query.replace(/[%_]/g, '').substring(0, 100)
```

**Response** (200):
```json
{
  "jobs": [...]
}
```

---

### 2.5 Chat & Conversational AI

#### **GET /api/v1/chat/history**
**Purpose**: Get user's chat conversation history  
**Auth**: Required  
**File**: `src/routes/chat.ts`

**Response** (200):
```json
{
  "conversation": {
    "id": "uuid",
    "user_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "user",
      "content": "What jobs match my skills?",
      "created_at": "2024-01-01T12:00:00Z"
    },
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "assistant",
      "content": "Based on your TypeScript and React skills...",
      "created_at": "2024-01-01T12:00:01Z"
    }
  ]
}
```

**Empty State**: Returns `{ conversation: null, messages: [] }` if no history

---

#### **POST /api/v1/chat/message**
**Purpose**: Send message and get AI response  
**Auth**: Required

**Request Body**:
```json
{
  "content": "What are the best jobs for me?",
  "conversation_id": "uuid" // Optional
}
```

**Process Flow**:
1. Validate message content
2. Get or create conversation
3. Save user message
4. Fetch user profile for context
5. Fetch last 10 messages for context
6. Generate AI response
7. Save assistant message
8. Return response

**AI Context Building**:
```javascript
const userProfile = {
  skills: ['TypeScript', 'React'],
  target_roles: ['Senior Engineer', 'Tech Lead']
}

const messageHistory = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi! How can I help?' },
  { role: 'user', content: 'What jobs match my skills?' }
]

const aiResponse = await aiClient.generateResponse(
  userProfile,
  messageHistory,
  newMessage
)
```

**AI Engine Integration**:
```
POST http://localhost:3002/api/v1/generate_response
{
  "user_profile": { skills, target_roles },
  "message_history": [...],
  "new_message": "What are the best jobs for me?"
}
```

**Fallback Response** (if AI engine down):
```javascript
function generatePlaceholderResponse(userMessage) {
  if (userMessage.includes('hello')) {
    return "Hello! I'm Ori, your AI career companion..."
  }
  if (userMessage.includes('job')) {
    return 'I can help you explore job opportunities...'
  }
  // Generic response
  return `I understand you're interested in: "${userMessage}"...`
}
```

**Response** (200):
```json
{
  "message": {
    "id": "uuid",
    "conversation_id": "uuid",
    "role": "assistant",
    "content": "Based on your TypeScript and React skills, here are 3 great matches...",
    "created_at": "2024-01-01T12:00:01Z"
  },
  "conversation_id": "uuid"
}
```

---

### 2.6 Applications Tracking

#### **GET /api/v1/applications**
**Purpose**: Get all user's job applications  
**Auth**: Required  
**File**: `src/routes/applications.ts`

**Query Parameters**:
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "applications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "job_title": "Senior Engineer",
      "company": "TechCorp",
      "location": "San Francisco, CA",
      "job_url": "https://...",
      "status": "interviewing",
      "notes": "Second round scheduled",
      "application_date": "2024-01-01",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-05T00:00:00Z"
    }
  ]
}
```

**Status Values**:
- `applied`: Initial application submitted
- `interviewing`: In interview process
- `offer`: Received job offer
- `rejected`: Application rejected
- `paused`: Application on hold

---

#### **GET /api/v1/applications/stats**
**Purpose**: Get application statistics  
**Auth**: Required

**Response** (200):
```json
{
  "total": 15,
  "applied": 8,
  "interviewing": 4,
  "offers": 1,
  "rejected": 2,
  "paused": 0
}
```

---

#### **POST /api/v1/applications**
**Purpose**: Create new job application  
**Auth**: Required

**Validation Schema**:
```typescript
const createApplicationSchema = z.object({
  job_title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional().nullable(),
  job_url: z.string().url().optional().nullable(),
  status: z.enum(['applied', 'interviewing', 'offer', 'rejected', 'paused'])
    .default('applied'),
  notes: z.string().optional().nullable(),
})
```

**Request Body**:
```json
{
  "job_title": "Senior Software Engineer",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "job_url": "https://techcorp.com/careers/123",
  "status": "applied",
  "notes": "Applied via referral"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "job_title": "Senior Software Engineer",
  ...
}
```

---

#### **PUT /api/v1/applications/:id**
**Purpose**: Update application  
**Auth**: Required

**Request Body** (all fields optional):
```json
{
  "job_title": "Staff Engineer",
  "status": "interviewing",
  "notes": "Moved to second round"
}
```

**RLS Protection**: User can only update their own applications

---

#### **PATCH /api/v1/applications/:id/status**
**Purpose**: Quick status update  
**Auth**: Required

**Request Body**:
```json
{
  "status": "offer"
}
```

---

#### **DELETE /api/v1/applications/:id**
**Purpose**: Delete application  
**Auth**: Required

**Response**: 204 No Content

---

### 2.7 Experience & Education

#### **GET /api/v1/experiences**
**Purpose**: Get user's work experience  
**Auth**: Required  
**File**: `src/routes/experiences.ts`

**Response** (200):
```json
{
  "experiences": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "company": "TechCorp",
      "role": "Senior Engineer",
      "start_date": "2020-01-01",
      "end_date": "2023-12-31",
      "is_current": false,
      "description": "Led development of...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Ordering**: Sorted by `start_date DESC`

---

#### **POST /api/v1/experiences**
**Purpose**: Create work experience  
**Auth**: Required

**Validation Schema**:
```typescript
const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional().nullable(),
})
```

**Request Body**:
```json
{
  "company": "TechCorp",
  "role": "Senior Software Engineer",
  "start_date": "2020-01-01",
  "end_date": null,
  "is_current": true,
  "description": "Leading development of core platform features"
}
```

---

#### **PUT /api/v1/experiences/:id**
**Purpose**: Update experience  
**Auth**: Required

---

#### **DELETE /api/v1/experiences/:id**
**Purpose**: Delete experience  
**Auth**: Required

---

#### **Education Endpoints** (`/api/v1/education`)
**Structure**: Identical to experiences with these fields:
- `institution`: School/university name
- `degree`: Degree name
- `field_of_study`: Major/concentration
- `start_date`, `end_date`, `is_current`
- `description`: Additional details

---

### 2.8 Dashboard

#### **GET /api/v1/dashboard**
**Purpose**: Get aggregated dashboard data  
**Auth**: Required  
**File**: `src/routes/dashboard.ts`

**Response** (200):
```json
{
  "stats": {
    "activeApplications": 3,
    "jobRecommendations": 8,
    "skillsAdded": 12,
    "profileCompletion": 85
  },
  "recentActivity": [
    {
      "id": "app-uuid",
      "type": "application",
      "title": "Applied to Senior Engineer",
      "subtitle": "TechCorp",
      "timestamp": "2024-01-05T12:00:00Z"
    },
    {
      "id": "exp-uuid",
      "type": "profile",
      "title": "Updated your profile",
      "subtitle": "Added experience at TechCorp",
      "timestamp": "2024-01-04T10:00:00Z"
    }
  ]
}
```

**Data Sources** (parallel queries):
```javascript
const [
  applicationsResult,
  profileResult,
  experiencesResult,
  educationResult
] = await Promise.all([
  supabase.from('applications').select(...),
  supabase.from('user_profiles').select(...),
  supabase.from('experiences').select(...),
  supabase.from('education').select(...)
])
```

**Profile Completion Calculation**:
```javascript
function calculateProfileCompletion(profile) {
  const fields = [
    profile.full_name,
    profile.headline,
    profile.bio,
    profile.location,
    profile.years_of_experience,
    profile.desired_roles?.length > 0,
    profile.skills?.length > 0
  ]
  const filledFields = fields.filter(Boolean).length
  return Math.round((filledFields / fields.length) * 100)
}
```

**Job Recommendations Count**:
- Simulated based on profile completeness
- Full implementation would query AI engine

---

### 2.9 Notifications

#### **GET /api/v1/notifications/preferences**
**Purpose**: Get notification preferences  
**Auth**: Required  
**File**: `src/routes/notifications.ts`

**Response** (200):
```json
{
  "user_id": "uuid",
  "payment_failure_emails": true,
  "card_expiring_emails": true,
  "trial_ending_emails": true,
  "subscription_emails": true,
  "recommendation_emails": true,
  "application_status_emails": true,
  "security_emails": true,
  "weekly_digest": false,
  "unsubscribed": false,
  "unsubscribed_at": null,
  "unsubscribe_token": "random_token",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Auto-creation**: If no preferences exist, creates defaults

---

#### **PUT /api/v1/notifications/preferences**
**Purpose**: Update notification preferences  
**Auth**: Required

**Request Body**:
```json
{
  "payment_failure_emails": false,
  "weekly_digest": true,
  "recommendation_emails": false
}
```

---

#### **GET /api/v1/notifications/history**
**Purpose**: Get notification history  
**Auth**: Required

**Query Parameters**:
- `limit`: Max results (default 20, max 100)
- `offset`: Pagination offset

**Response** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "payment_alert",
      "title": "Payment Failed",
      "message": "Update payment method",
      "status": "sent",
      "read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

#### **GET /api/v1/notifications/by-type/:type**
**Purpose**: Filter notifications by type  
**Auth**: Required

**Types**:
- `payment_alert`
- `subscription_update`
- `job_recommendation`
- `application_update`
- `security_alert`

---

#### **POST /api/v1/notifications/unsubscribe**
**Purpose**: Unsubscribe from all emails (authenticated)  
**Auth**: Required

**Response** (200):
```json
{
  "message": "Successfully unsubscribed from all emails",
  "data": {...}
}
```

**Action**: Sets `unsubscribed = true`, `unsubscribed_at = now()`

---

#### **POST /api/v1/notifications/unsubscribe/:token**
**Purpose**: Unsubscribe via email link (unauthenticated)  
**Auth**: None

**Use Case**: One-click unsubscribe from email footer

**URL**: `POST /api/v1/notifications/unsubscribe/{random_token}`

---

#### **POST /api/v1/notifications/resubscribe**
**Purpose**: Re-enable email notifications  
**Auth**: Required

---

#### **GET /api/v1/notifications/stats**
**Purpose**: Get notification statistics  
**Auth**: Required

**Response** (200):
```json
{
  "byType": {
    "payment_alert": 5,
    "job_recommendation": 12,
    "application_update": 8
  },
  "byStatus": {
    "sent": 20,
    "failed": 2,
    "pending": 3
  },
  "total": 25
}
```

---

### 2.10 Beta Testers

#### **POST /api/v1/beta-testers**
**Purpose**: Register for beta access  
**Auth**: None (public endpoint)  
**File**: `src/routes/betaTesters.ts`

**Validation Schema**:
```typescript
const betaTesterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  source: z.enum(['signup', 'login', 'landing']).default('signup'),
})
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "source": "landing"
}
```

**Response** (201):
```json
{
  "message": "Successfully registered for beta access",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "source": "landing",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Duplicate Handling**: Returns 200 with `alreadyExists: true`

---

## 3. Data Models & Database Schema

### 3.1 Supabase Client Configuration

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,    // Server-side, no browser storage
    autoRefreshToken: false,  // No automatic token refresh
  },
})
```

**Singleton Pattern**: Single client instance exported for entire app

**Service Role Key**: 
- Bypasses Row Level Security (RLS)
- Used for admin operations
- Never exposed to frontend

---

### 3.2 Database Tables (Inferred from Code)

#### **user_profiles**
Primary user profile table with extended data

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | FK to auth.users (Supabase Auth) |
| email | string | User email |
| full_name | string | Full name (max 200) |
| preferred_name | string | Preferred name (max 100) |
| headline | string | Professional headline (max 200) |
| location | string | Geographic location (max 100) |
| about | text | Bio/about section (max 5000) |
| long_term_vision | text | Career vision (max 2000) |
| skills | text[] | Array of skill names |
| skill_levels | jsonb | Map of skill → proficiency (1-10) |
| target_roles | text[] | Desired job roles |
| work_style | enum | Remote/Hybrid/On-site |
| industries | text[] | Target industries |
| goal | text | Short-term career goal (max 1000) |
| cv_url | string | Resume/CV URL |
| linkedin_url | string | LinkedIn profile URL |
| profile_photo_url | string | Profile picture URL |
| current_status | enum | student/professional/transitioning/exploring |
| years_experience | integer | Total years of experience |
| is_remote_open | boolean | Open to remote work |
| dream_role | string | Aspirational role (max 200) |
| timeline_months | integer | Career timeline (6/12/24/36/60) |
| hidden_talents | text[] | Uncommon skills |
| work_styles | jsonb | Preference scores |
| culture_values | text[] | Company culture preferences |
| deal_breakers | text[] | Non-negotiables |
| stripe_customer_id | string | Stripe customer ID |
| stripe_subscription_id | string | Active subscription ID |
| subscription_status | string | free/plus_monthly/premium_yearly/etc |
| onboarding_completed | boolean | Onboarding finished |
| onboarding_version | integer | Version of onboarding flow |
| profile_completeness | integer | Score 0-100 |
| features_unlocked | text[] | Unlocked features array |
| monthly_job_matches_used | integer | Usage counter |
| monthly_job_matches_limit | integer | Usage limit |
| created_at | timestamp | Profile creation |
| updated_at | timestamp | Last update |

**RLS Policies**: Users can only read/update their own profile

---

#### **onboarding_sessions**
Tracks multi-step onboarding progress

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| current_step | integer | Current step (0-5) |
| completed_steps | integer[] | Completed step indices |
| form_data | jsonb | All form inputs |
| last_saved_at | timestamp | Auto-save timestamp |
| completed_at | timestamp | Completion time |
| abandoned_at | timestamp | Abandonment time |
| device_info | jsonb | User agent metadata |
| created_at | timestamp | Session start |

---

#### **onboarding_analytics**
Event tracking for onboarding

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | FK to onboarding_sessions |
| user_id | uuid | FK to auth.users |
| event_type | string | session_saved/field_changed/step_completed |
| step_name | string | Step identifier |
| field_name | string | Field changed |
| time_on_step | integer | Time spent (ms) |
| old_value | jsonb | Previous value |
| new_value | jsonb | New value |
| total_session_time | integer | Total time (seconds) |
| created_at | timestamp | Event time |

---

#### **applications**
Job application tracking

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| job_title | string | Position title |
| company | string | Company name |
| location | string | Job location |
| job_url | url | Application URL |
| status | enum | applied/interviewing/offer/rejected/paused |
| notes | text | User notes |
| application_date | date | Application submission |
| created_at | timestamp | Record creation |
| updated_at | timestamp | Last update |

**RLS**: User can only access their own applications

---

#### **experiences**
Work experience records

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| company | string | Company name |
| role | string | Job title |
| start_date | date | Start date (YYYY-MM-DD) |
| end_date | date | End date (nullable) |
| is_current | boolean | Currently employed |
| description | text | Role description |
| created_at | timestamp | Record creation |
| updated_at | timestamp | Last update |

---

#### **education**
Educational background

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| institution | string | School/university |
| degree | string | Degree name |
| field_of_study | string | Major/concentration |
| start_date | date | Start date |
| end_date | date | End date (nullable) |
| is_current | boolean | Currently enrolled |
| description | text | Additional details |
| created_at | timestamp | Record creation |
| updated_at | timestamp | Last update |

---

#### **conversations**
Chat conversation sessions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| created_at | timestamp | Conversation start |
| updated_at | timestamp | Last message time |

---

#### **messages**
Chat messages

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| conversation_id | uuid | FK to conversations |
| role | enum | user/assistant |
| content | text | Message text |
| created_at | timestamp | Message sent time |

---

#### **jobs**
Available job listings

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | string | Job title |
| company | string | Company name |
| description | text | Full description |
| requirements | text[] | Required skills |
| location | string | Job location |
| work_type | enum | remote/hybrid/onsite |
| salary_min | integer | Min salary (cents) |
| salary_max | integer | Max salary (cents) |
| tags | text[] | Job tags |
| posted_date | date | Job posting date |
| created_at | timestamp | Record creation |

---

#### **notifications**
In-app notification records

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| type | string | Notification type |
| title | string | Notification title |
| message | text | Notification body |
| status | enum | sent/failed/pending |
| read | boolean | Read status |
| created_at | timestamp | Notification time |

---

#### **notification_preferences**
User notification settings

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| payment_failure_emails | boolean | Payment alerts |
| card_expiring_emails | boolean | Card expiry alerts |
| trial_ending_emails | boolean | Trial ending alerts |
| subscription_emails | boolean | Subscription updates |
| recommendation_emails | boolean | Job recommendations |
| application_status_emails | boolean | Application updates |
| security_emails | boolean | Security alerts |
| weekly_digest | boolean | Weekly summary |
| unsubscribed | boolean | Global unsubscribe |
| unsubscribed_at | timestamp | Unsubscribe time |
| unsubscribe_token | string | Unique token for email unsubscribe |
| created_at | timestamp | Record creation |
| updated_at | timestamp | Last update |

---

#### **beta_testers**
Beta access waitlist

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | string | Email (unique) |
| first_name | string | First name |
| source | enum | signup/login/landing |
| created_at | timestamp | Registration time |

**Unique Constraint**: email

---

### 3.3 Database Query Patterns

#### Parallel Queries (Dashboard)
```typescript
const [apps, profile, exp, edu] = await Promise.all([
  supabase.from('applications').select('*').eq('user_id', userId),
  supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
  supabase.from('experiences').select('*').eq('user_id', userId),
  supabase.from('education').select('*').eq('user_id', userId)
])
```

#### Conditional Queries (Jobs with filters)
```typescript
let query = supabase.from('jobs').select('*')

if (filters?.workType) {
  query = query.eq('work_type', filters.workType)
}

if (filters?.location) {
  query = query.ilike('location', `%${sanitized}%`)
}

if (filters?.salaryMin) {
  query = query.or(
    `salary_min.gte.${salaryMin},salary_max.gte.${salaryMin}`
  )
}

const { data } = await query.limit(50)
```

#### RLS Protection
All queries use service role key, but RLS still applies:
```sql
-- Example RLS policy
CREATE POLICY "Users can only access own profile"
ON user_profiles FOR ALL
USING (auth.uid() = user_id);
```

---

## 4. Business Logic & Services

### 4.1 Stripe Integration Service

**File**: `src/lib/stripe.ts`

#### Stripe Plans Configuration
```typescript
export const STRIPE_PLANS = {
  plus_monthly: {
    name: 'Ori Plus',
    price: 500,  // $5.00 in cents
    interval: 'month',
    productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
    priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY_ID || '',
  },
  plus_yearly: {
    name: 'Ori Plus',
    price: 4800,  // $48.00 (20% discount)
    interval: 'year',
    productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
    priceId: process.env.STRIPE_PRICE_PLUS_YEARLY_ID || '',
  },
  premium_monthly: {
    name: 'Ori Premium',
    price: 1000,  // $10.00
    interval: 'month',
    productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID || '',
  },
  premium_yearly: {
    name: 'Ori Premium',
    price: 9600,  // $96.00 (20% discount)
    interval: 'year',
    productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
    priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID || '',
  },
}
```

#### Helper Functions

**getPlanKeyFromStatus**:
```typescript
function getPlanKeyFromStatus(status: string): keyof typeof STRIPE_PLANS | null {
  if (status in STRIPE_PLANS) return status
  return null
}
```

**getStatusFromPriceId**:
```typescript
function getStatusFromPriceId(priceId: string): string {
  for (const [key, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) return key
  }
  return 'free'
}
```

---

### 4.2 Stripe Helpers

**File**: `src/lib/stripeHelpers.ts`

#### **ensureStripeCustomer**
Creates Stripe customer if doesn't exist

```typescript
async function ensureStripeCustomer(
  userId: string,
  email: string,
  fullName?: string,
): Promise<string> {
  // 1. Check if customer ID exists
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()
  
  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id
  }
  
  // 2. Create Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: fullName,
    metadata: { supabase_user_id: userId }
  })
  
  // 3. Save to database
  await supabase
    .from('user_profiles')
    .update({
      stripe_customer_id: customer.id,
      subscription_status: 'free'
    })
    .eq('user_id', userId)
  
  return customer.id
}
```

**Use Cases**:
- Onboarding completion
- First subscription creation
- Setup Intent creation

---

#### **getUserEmail**
Fetches user email from Supabase Auth

```typescript
async function getUserEmail(userId: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  
  if (error || !data.user) {
    throw new Error('Failed to fetch user email')
  }
  
  return data.user.email!
}
```

**Admin API**: Uses service role to access auth.users table

---

### 4.3 AI Engine Client

**File**: `src/lib/ai-client.ts`

#### AI Client Configuration
```typescript
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:3002'

export class AIClient {
  private baseUrl: string
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || AI_ENGINE_URL
  }
}
```

#### **healthCheck()**
Check AI engine availability

```typescript
async healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${this.baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) return false
    
    const data = await response.json()
    return data.status === 'healthy' || data.status === 'degraded'
  } catch (error) {
    console.error('AI Engine health check failed:', error)
    return false
  }
}
```

**Use Case**: Graceful degradation if AI engine is down

---

#### **generateMatches()**
AI-powered job matching

```typescript
async generateMatches(request: MatchRequest): Promise<MatchResult[]> {
  const response = await fetch(`${this.baseUrl}/api/v1/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(30000)  // 30s timeout
  })
  
  if (!response.ok) {
    throw new Error(`AI matching failed: ${response.statusText}`)
  }
  
  return await response.json()
}
```

**Request Structure**:
```typescript
interface MatchRequest {
  profile: {
    user_id: string
    skills: string[]
    experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
    years_of_experience?: number
    roles?: string[]
    work_style?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
    industries?: string[]
    location?: string
    willing_to_relocate?: boolean
    salary_min?: number
    salary_max?: number
    goal?: string
    cv_text?: string
  }
  jobs: Job[]
  limit?: number
}
```

**Response Structure**:
```typescript
interface MatchResult {
  job_id: string
  match_score: number           // 0-100
  semantic_score: number         // 0-100
  skill_match_score: number      // 0-100
  experience_score: number       // 0-100
  location_score: number         // 0-100
  reasoning: string
  key_matches: string[]
  missing_skills: string[]
}
```

---

#### **getSkillGap()**
Simple skill gap analysis

```typescript
async getSkillGap(
  userSkills: string[],
  requiredSkills: string[]
): Promise<SkillGapResponse | null> {
  try {
    const response = await fetch(`${this.baseUrl}/api/v1/skill-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_skills: userSkills,
        required_skills: requiredSkills
      }),
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) throw new Error('Skill gap analysis failed')
    
    return await response.json()
  } catch (error) {
    console.error('Skill gap request failed:', error)
    return null  // Graceful degradation
  }
}
```

**Response**:
```typescript
interface SkillGapResponse {
  user_skills: string[]
  required_skills: string[]
  missing_skills: string[]
}
```

**Graceful Degradation**: Returns null on error (non-blocking)

---

#### **generateResponse()**
Conversational AI for chat

```typescript
async generateResponse(
  userProfile: UserProfileContext,
  messageHistory: ChatMessage[],
  newMessage: string
): Promise<AIResponse> {
  const response = await fetch(`${this.baseUrl}/api/v1/generate_response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_profile: userProfile,
      message_history: messageHistory,
      new_message: newMessage
    }),
    signal: AbortSignal.timeout(30000)
  })
  
  if (!response.ok) {
    throw new Error('AI response generation failed')
  }
  
  return await response.json()
}
```

**Context Sent to AI**:
```typescript
{
  user_profile: {
    skills: ['TypeScript', 'React'],
    target_roles: ['Senior Engineer']
  },
  message_history: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi! How can I help?' }
  ],
  new_message: 'What jobs match my skills?'
}
```

---

#### **Other AI Methods** (Implemented but not yet used)

**analyzeSkills()**: Deep skill gap analysis  
**getLearningPaths()**: Personalized learning recommendations  
**recommendRoles()**: Role suggestions based on profile

---

### 4.4 Notification Service

**File**: `src/utils/notifications.ts`

#### **sendNotification()**
Generic notification sender

```typescript
async function sendNotification(
  supabase: SupabaseClient,
  userId: string,
  options: {
    to: string
    subject: string
    message: string
    type?: 'email' | 'in_app' | 'both'
  }
): Promise<void> {
  // Create in-app notification
  await supabase.from('notifications').insert({
    user_id: userId,
    title: options.subject,
    message: options.message,
    type: 'payment_alert',
    read: false
  })
  
  // TODO: Integrate email service (SendGrid/AWS SES/Resend)
  console.log(`📧 Notification sent to ${options.to}: ${options.subject}`)
}
```

**Current State**: 
- In-app notifications: Implemented
- Email sending: Placeholder (console log)

---

#### **sendPaymentFailureNotification()**
```typescript
async function sendPaymentFailureNotification(
  supabase: SupabaseClient,
  customerId: string
): Promise<void> {
  // 1. Get user profile from customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id, full_name')
    .eq('stripe_customer_id', customerId)
    .single()
  
  // 2. Get user email from auth
  const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id)
  
  // 3. Send notification
  await sendNotification(supabase, profile.user_id, {
    to: user.email,
    subject: 'Payment Failed - Action Required',
    message: `Hello ${profile.full_name},\n\nWe were unable to process your payment...`,
    type: 'both'
  })
}
```

**Trigger**: Stripe webhook `invoice.payment_failed`

---

#### **sendPaymentMethodExpiringNotification()**
```typescript
async function sendPaymentMethodExpiringNotification(
  supabase: SupabaseClient,
  customerId: string
): Promise<void> {
  // Similar flow to payment failure
  await sendNotification(supabase, profile.user_id, {
    to: user.email,
    subject: 'Payment Method Expiring Soon',
    message: 'Your payment method on file is expiring soon...'
  })
}
```

**Trigger**: Stripe webhook `customer.source.expiring`

---

### 4.5 Email Templates (Resend)

**File**: `src/lib/resend.ts`

#### Email Service Configuration
```typescript
class ResendClient {
  private apiKey: string
  private baseUrl = 'https://api.resend.com'
  private fromEmail = 'noreply@getori.app'
  private fromName = 'Ori'
  
  async send(params: {
    to: string
    subject: string
    html: string
    text?: string
    replyTo?: string
  }): Promise<EmailResponse> {
    const response = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo
      })
    })
    
    return response.json()
  }
}
```

**Mock Mode**: If no API key, returns mock response

---

#### Email Templates

**Brand Colors**:
```javascript
const brandColors = {
  primary: '#3b82f6',      // Blue
  secondary: '#1f2937',    // Dark gray
  accent: '#10b981',       // Green (success)
  warning: '#f59e0b',      // Amber (alerts)
  danger: '#ef4444',       // Red (errors)
  background: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textLight: '#6b7280'
}
```

**Available Templates**:
1. **Welcome Email**: `sendWelcome(email, name)`
2. **Payment Failure**: `sendPaymentFailure(email, name, amount, currency)`
3. **Card Expiring**: `sendCardExpiring(email, name, brand, lastFour, expiryMonth, expiryYear)`
4. **Trial Ending**: `sendTrialEnding(email, name, daysRemaining, planName, price)`
5. **Subscription Confirmation**: `sendSubscriptionConfirmation(email, name, planName, price, billingCycle)`
6. **Recommendations**: `sendRecommendations(email, name, jobCount, topSkills)`
7. **Application Status**: `sendApplicationStatus(email, name, jobTitle, company, status)`

**Template Structure**:
```html
<!DOCTYPE html>
<html>
  <head>
    <style>/* Inline styles for email compatibility */</style>
  </head>
  <body>
    <div class="container">
      <div class="header"><!-- Logo and tagline --></div>
      <div class="content"><!-- Email body --></div>
      <div class="footer"><!-- Unsubscribe, links --></div>
    </div>
  </body>
</html>
```

**Example: Welcome Email**
```typescript
function generateWelcomeTemplate(name: string): string {
  return baseTemplate(`
    <h2>Welcome to Ori, ${name}! 🎉</h2>
    <p>We're thrilled to have you on board...</p>
    
    <h3>What you can do with Ori:</h3>
    <ul class="feature-list">
      <li>Discover job opportunities matched to your skills</li>
      <li>Get personalized career guidance from our AI advisor</li>
      <li>Track and manage your job applications</li>
    </ul>
    
    <center>
      <a href="https://app.getori.app/onboarding" class="button">
        Complete Your Profile
      </a>
    </center>
  `)
}
```

**Unsubscribe Token**: 
```html
<a href="https://app.getori.app/unsubscribe?token=${unsubscribeToken}">
  Unsubscribe from emails
</a>
```

---

## 5. Middleware Stack

### 5.1 Authentication Middleware

**File**: `src/middleware/auth.ts`

```typescript
export interface AuthRequest extends Request {
  user?: User  // Supabase User object
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    // 2. Create Supabase client with user's token
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        },
        auth: { persistSession: false }
      }
    )
    
    // 3. Validate token and get user
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    // 4. Attach user to request
    req.user = user
    return next()
  } catch {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}
```

**Key Points**:
- Creates per-request Supabase client with user's JWT
- Validates token via `supabase.auth.getUser()`
- Attaches user object to request
- Returns 401 on any auth failure

**Usage**:
```typescript
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user.id  // User guaranteed to exist
})
```

---

### 5.2 Validation Middleware

**File**: `src/middleware/validation.ts`

```typescript
import { z } from 'zod'

export function validateRequest<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues
        })
      } else {
        next(error)
      }
    }
  }
}
```

**Usage**:
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
})

router.post(
  '/users',
  validateRequest(createUserSchema),
  async (req, res) => {
    // req.body is now typed and validated
    const { email, name } = req.body
  }
)
```

**Features**:
- Type-safe validation with Zod
- Automatic error formatting
- Returns detailed validation errors

**Example Error Response**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ]
}
```

---

### 5.3 Error Handler Middleware

**File**: `src/middleware/errorHandler.ts`

```typescript
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err)
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    })
  }
  
  if (err.message.includes('JWT')) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired token'
    })
  }
  
  // Default error response
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong'
  })
}
```

**Error Types Handled**:
- ValidationError → 400
- JWT errors → 401
- Default → 500

**Production Mode**: Hides error details

---

### 5.4 Middleware Execution Order

```
Request
  ↓
1. CORS (app.use(cors()))
  ↓
2. Stripe Webhook (express.raw) - ONLY /api/v1/payments/webhook
  ↓
3. Body Parser (express.json()) - ALL other routes
  ↓
4. Route-level middleware:
   - authMiddleware (most routes)
   - validateRequest (POST/PUT routes)
  ↓
5. Route handler
  ↓
6. Error Handler (if error thrown)
  ↓
Response
```

**CRITICAL**: Stripe webhook must receive raw body, so it's mounted before `express.json()`

---

## 6. Integration Points

### 6.1 Supabase Auth Integration

**Authentication Flow**:
```
Frontend                  Core-API                Supabase Auth
   │                         │                         │
   │  POST /auth/signup      │                         │
   ├────────────────────────>│  Create user            │
   │                         ├────────────────────────>│
   │                         │<────────────────────────┤
   │                         │     JWT token           │
   │<────────────────────────┤                         │
   │  { token, user }        │                         │
   │                         │                         │
   │  GET /api/v1/profile    │                         │
   │  Authorization: Bearer  │                         │
   ├────────────────────────>│  Validate token         │
   │                         ├────────────────────────>│
   │                         │<────────────────────────┤
   │                         │     User object         │
   │                         │  Fetch from DB          │
   │<────────────────────────┤                         │
   │  { profile }            │                         │
```

**Auth Methods Used**:
- `supabase.auth.getUser()`: Validate JWT
- `supabase.auth.admin.getUserById()`: Get user by ID (service role)

**RLS Enforcement**: Even with service role key, RLS policies apply to data operations

---

### 6.2 Stripe Integration

**Stripe API Version**: `2024-06-20`

**Integration Points**:

#### A. Customer Management
```javascript
// Create customer
const customer = await stripe.customers.create({
  email: 'user@example.com',
  name: 'John Doe',
  metadata: { supabase_user_id: userId }
})

// Search customer
const customers = await stripe.customers.search({
  query: `email:'${email}'`
})
```

#### B. Checkout Session
```javascript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  payment_method_types: ['card'],
  line_items: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',
  success_url: 'https://app.getori.app/success',
  cancel_url: 'https://app.getori.app/cancel',
  metadata: { userId }
})
```

#### C. Billing Portal
```javascript
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://app.getori.app/settings'
})
```

#### D. Subscriptions
```javascript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_settings: {
    payment_method_types: ['card'],
    save_default_payment_method: 'on_subscription'
  },
  expand: ['latest_invoice.payment_intent']
})
```

#### E. Setup Intents
```javascript
const setupIntent = await stripe.setupIntents.create({
  customer: customerId,
  payment_method_types: ['card'],
  metadata: { user_id: userId, plan_id: planId }
})
```

#### F. Webhook Verification
```javascript
const event = stripe.webhooks.constructEvent(
  rawBody,            // Raw request body
  signature,          // Stripe-Signature header
  webhookSecret       // STRIPE_WEBHOOK_SECRET
)
```

**Webhook Events Subscribed**:
1. `checkout.session.completed`
2. `customer.subscription.created`
3. `customer.subscription.updated`
4. `customer.subscription.deleted`
5. `invoice.payment_succeeded`
6. `invoice.payment_failed`
7. `customer.source.expiring`

---

### 6.3 AI Engine Integration

**Base URL**: `http://localhost:3002` (development)

**Endpoints Used**:

#### A. Health Check
```
GET /health
Response: { status: 'healthy' | 'degraded' }
```

#### B. Job Matching
```
POST /api/v1/match
Request: {
  profile: UserProfile,
  jobs: Job[],
  limit: number
}
Response: MatchResult[]
```

#### C. Skill Gap Analysis
```
POST /api/v1/skill-gap
Request: {
  user_skills: string[],
  required_skills: string[]
}
Response: {
  user_skills: string[],
  required_skills: string[],
  missing_skills: string[]
}
```

#### D. Conversational AI
```
POST /api/v1/generate_response
Request: {
  user_profile: { skills, target_roles },
  message_history: ChatMessage[],
  new_message: string
}
Response: {
  content: string
}
```

**Timeout Configuration**:
- Health check: 5s
- Skill gap: 10s
- Job matching: 30s
- Chat generation: 30s

**Graceful Degradation**:
- Health check fails → Use fallback skill matching
- Skill gap fails → Return null (non-blocking)
- Chat fails → Use placeholder responses

---

### 6.4 Resend Email Integration

**Base URL**: `https://api.resend.com`

**Authentication**: Bearer token in `RESEND_API_KEY`

**Email Sending**:
```
POST /emails
Headers:
  Authorization: Bearer <api_key>
  Content-Type: application/json
Body: {
  from: "Ori <noreply@getori.app>",
  to: "user@example.com",
  subject: "Welcome to Ori",
  html: "<p>...</p>",
  text: "Plain text version",
  reply_to: "support@getori.app"
}
```

**Response**:
```json
{
  "id": "email_xxx",
  "from": "Ori <noreply@getori.app>",
  "to": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Mock Mode**: If no API key, returns mock response without sending

---

## 7. Testing Infrastructure

### 7.1 Test Configuration

**File**: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'  // Handle .js imports in TS
  },
  verbose: true
}
```

**Key Settings**:
- Test runner: Jest with ts-jest
- Environment: Node.js
- Coverage threshold: 60%
- Setup file loads env vars

---

### 7.2 Test Environment Setup

**File**: `src/__tests__/setup.ts`

```typescript
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock'
process.env.FRONTEND_URL = 'http://localhost:3000'
process.env.AI_ENGINE_URL = 'http://localhost:3002'

// Mock console for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  error: console.error,  // Keep for debugging
  warn: console.warn     // Keep for debugging
}
```

**CRITICAL**: `setupFiles` (not `setupFilesAfterEnv`) to load env vars before modules

---

### 7.3 Test Fixtures

**File**: `src/routes/__tests__/fixtures/stripe.fixtures.ts`

#### Mock Stripe Customer
```typescript
export function createTestCustomer(email: string): StripeTestCustomer {
  return {
    id: `cus_test_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name: 'Test User',
    metadata: { test: 'true' }
  }
}
```

#### Mock Stripe Subscription
```typescript
export function createTestSubscription(
  customerId: string,
  priceId: string,
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
): StripeTestSubscription {
  return {
    id: `sub_test_${Math.random().toString(36).substr(2, 9)}`,
    customer: customerId,
    status,
    items: {
      data: [{
        id: `si_test_${Math.random().toString(36).substr(2, 9)}`,
        price: {
          id: priceId,
          product: 'prod_test_plus',
          recurring: { interval: 'month' }
        }
      }]
    }
  }
}
```

#### Webhook Event Generators
```typescript
export const testWebhookEvents = {
  checkoutSessionCompleted(customerId: string, subscriptionId: string) {
    return {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
          customer: customerId,
          subscription: subscriptionId,
          payment_status: 'paid'
        }
      }
    }
  },
  
  customerSubscriptionCreated(customerId: string, subscriptionId: string) {
    return {
      type: 'customer.subscription.created',
      data: {
        object: createTestSubscription(customerId, 'price_monthly', 'active')
      }
    }
  }
  
  // ... other webhook events
}
```

---

### 7.4 Test Patterns

#### A. Route Testing with Supertest
```typescript
import request from 'supertest'
import app from '../index'

describe('GET /api/v1/profile', () => {
  it('should return 401 without auth token', async () => {
    const response = await request(app)
      .get('/api/v1/profile')
    
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('No token provided')
  })
  
  it('should return profile with valid token', async () => {
    const token = generateTestToken()
    
    const response = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user_id')
  })
})
```

#### B. Mocking Supabase
```typescript
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: '123', name: 'Test User' },
            error: null
          }))
        }))
      }))
    }))
  }
}))
```

#### C. Mocking Stripe
```typescript
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com'
      })
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({
        id: 'sub_test_123',
        status: 'active'
      })
    }
  }))
})
```

#### D. Testing Webhooks
```typescript
describe('POST /api/v1/payments/webhook', () => {
  it('should process checkout.session.completed event', async () => {
    const event = testWebhookEvents.checkoutSessionCompleted('cus_123', 'sub_123')
    const signature = createTestWebhookSignature(event)
    
    const response = await request(app)
      .post('/api/v1/payments/webhook')
      .set('stripe-signature', signature)
      .send(event)
    
    expect(response.status).toBe(200)
    expect(response.body.received).toBe(true)
  })
})
```

---

### 7.5 Test Scripts

**package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Coverage Report**:
```
File                 | % Stmts | % Branch | % Funcs | % Lines
---------------------|---------|----------|---------|--------
All files            |   68.5  |   62.3   |   65.7  |   68.1
 routes/             |   72.1  |   68.9   |   70.5  |   71.8
  payments.ts        |   85.3  |   78.2   |   88.1  |   84.9
  profile.ts         |   78.6  |   71.4   |   76.2  |   78.3
```

---

## 8. Security Patterns

### 8.1 Authentication Security

#### JWT Validation
```typescript
// Per-request client with user's token
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  }
)

const { data: { user }, error } = await supabase.auth.getUser()
```

**Security Features**:
- Token validated against Supabase Auth
- Expired tokens rejected automatically
- Invalid signatures rejected
- No token storage on server (stateless)

---

### 8.2 Row Level Security (RLS)

**How it Works**:
1. Supabase service role key bypasses RLS by default
2. BUT: When using user's JWT, RLS is enforced
3. Core-API creates per-request clients with user token

**Example RLS Policy**:
```sql
-- Users can only read their own profile
CREATE POLICY "user_read_own_profile" ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "user_update_own_profile" ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id);
```

**Code Pattern**:
```typescript
// This query automatically filters by user_id via RLS
const { data } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', req.user.id)  // Redundant but explicit
```

---

### 8.3 Input Validation & Sanitization

#### Zod Validation
```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(13).max(120),
  username: z.string().regex(/^[a-zA-Z0-9_]+$/)
})
```

#### SQL Injection Prevention
```typescript
// Parameterized queries (Supabase automatically handles)
await supabase
  .from('jobs')
  .select('*')
  .ilike('title', `%${sanitizedQuery}%`)

// Manual sanitization for extra safety
const sanitize = (value: string) => value.replace(/[%_]/g, '').trim()
```

#### XSS Prevention
- All user input validated with Zod
- No direct HTML rendering on backend
- Email templates use escaping

---

### 8.4 Stripe Webhook Security

#### Signature Verification
```typescript
try {
  const event = stripe.webhooks.constructEvent(
    req.body,  // Must be raw body
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
} catch (err) {
  return res.status(400).json({ error: 'Invalid signature' })
}
```

**Security Features**:
- Cryptographic signature validation
- Timestamp checking (prevents replay attacks)
- Rejects tampered payloads
- No processing without valid signature

---

### 8.5 Environment Variables

**Required Variables**:
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRODUCT_PLUS_ID=prod_xxx
STRIPE_PRICE_PLUS_MONTHLY_ID=price_xxx
# ... other price IDs

# Email
RESEND_API_KEY=re_xxx

# URLs
FRONTEND_URL=https://app.getori.app
AI_ENGINE_URL=http://localhost:3002
```

**Security Practices**:
- Never commit `.env` files
- Use different keys for dev/prod
- Service role key never exposed to frontend
- Webhook secrets rotate periodically

---

### 8.6 CORS Configuration

```typescript
import cors from 'cors'

app.use(cors())  // Default: Allow all origins
```

**Production Recommendation**:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))
```

---

### 8.7 Rate Limiting (Not Implemented)

**Recommended Addition**:
```typescript
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests, please try again later'
})

app.use('/api/', apiLimiter)
```

---

## 9. Code Examples

### 9.1 Complete Route Handler Example

**File**: `src/routes/profile.ts`

```typescript
import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { ensureStripeCustomer, getUserEmail } from '../lib/stripeHelpers.js'

const router = Router()

/**
 * PUT /api/v1/profile/onboarding
 * Complete onboarding and update profile
 */
router.put('/onboarding', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  const {
    full_name,
    headline,
    location,
    skills,
    target_roles,
    work_style,
    industries,
    goal,
    long_term_vision,
    cv_url
  } = req.body

  // Validate work_style enum
  if (work_style && !['Remote', 'Hybrid', 'On-site'].includes(work_style)) {
    return res.status(400).json({
      error: 'Invalid work_style. Must be one of: Remote, Hybrid, On-site'
    })
  }

  try {
    // Ensure Stripe customer exists
    const userEmail = await getUserEmail(req.user.id)
    await ensureStripeCustomer(req.user.id, userEmail, full_name)

    // Build update object
    const updateData: Record<string, unknown> = {
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) updateData.full_name = full_name
    if (headline !== undefined) updateData.headline = headline
    if (location !== undefined) updateData.location = location
    if (skills !== undefined) updateData.skills = skills
    if (target_roles !== undefined) updateData.target_roles = target_roles
    if (work_style !== undefined) updateData.work_style = work_style
    if (industries !== undefined) updateData.industries = industries
    if (goal !== undefined) updateData.goal = goal
    if (long_term_vision !== undefined) updateData.long_term_vision = long_term_vision
    if (cv_url !== undefined) updateData.cv_url = cv_url

    // Update profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    return res.status(200).json(profile)
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
```

---

### 9.2 AI Integration Example

**File**: `src/routes/jobs.ts`

```typescript
import { aiClient } from '../lib/ai-client.js'

router.post('/find-matches', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { userId, limit, filters } = req.body

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Fetch jobs with filters
    let jobQuery = supabase.from('jobs').select('*')
    if (filters?.workType) jobQuery = jobQuery.eq('work_type', filters.workType)
    if (filters?.location) {
      const sanitized = filters.location.replace(/[%_]/g, '').trim()
      jobQuery = jobQuery.ilike('location', `%${sanitized}%`)
    }
    const { data: jobs } = await jobQuery.limit(50)

    // Check AI engine health
    const aiHealthy = await aiClient.healthCheck()

    if (aiHealthy && jobs.length > 0) {
      // Use AI matching
      const matches = await aiClient.generateMatches({
        profile: {
          user_id: userId,
          skills: userProfile.skills || [],
          experience_level: userProfile.experience_level,
          years_of_experience: userProfile.years_of_experience,
          roles: userProfile.roles || [],
          work_style: userProfile.work_style,
          industries: userProfile.industries || [],
          location: userProfile.location,
          willing_to_relocate: userProfile.willing_to_relocate,
          salary_min: filters?.salaryMin,
          goal: userProfile.goal
        },
        jobs: jobs.map(job => ({
          job_id: job.id,
          title: job.title,
          company: job.company,
          description: job.description || '',
          requirements: job.requirements || [],
          location: job.location,
          work_type: job.work_type,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          tags: job.tags || [],
          posted_date: job.posted_date
        })),
        limit
      })

      // Enrich with skill gap analysis
      const enrichedMatches = await Promise.all(
        matches.map(async (match) => {
          const job = jobs.find(j => j.id === match.job_id)
          const skillsGap = await aiClient.getSkillGap(
            userProfile.skills || [],
            job?.requirements || []
          )

          return {
            ...job,
            matchScore: Math.round(match.match_score),
            semanticScore: Math.round(match.semantic_score),
            skillMatchScore: Math.round(match.skill_match_score),
            reasoning: match.reasoning,
            keyMatches: match.key_matches,
            skillsGap
          }
        })
      )

      return res.json({
        matches: enrichedMatches,
        usage: {
          used: userProfile.monthly_job_matches_used + 1,
          limit: userProfile.monthly_job_matches_limit
        }
      })
    } else {
      // Fallback to basic skill matching
      const basicMatches = jobs.map(job => {
        const matchScore = calculateMatchScore(
          userProfile.skills || [],
          job.requirements || []
        )
        return {
          ...job,
          matchScore,
          keyMatches: []
        }
      })
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)

      return res.json({ matches: basicMatches })
    }
  } catch (error) {
    console.error('Error finding matches:', error)
    return res.status(500).json({ error: 'Failed to find matches' })
  }
})
```

---

### 9.3 Stripe Webhook Handler Example

**File**: `src/routes/payments.ts`

```typescript
paymentWebhookRoutes.post('/', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string

    // Verify signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,  // Raw body required
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).json({ error: 'Invalid signature' })
    }

    console.log(`Received webhook event: ${event.type}`)

    // Handle events
    switch (event.type) {
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string

        // Update database
        await supabase
          .from('user_profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId)

        // Send notification
        await sendPaymentFailureNotification(supabase, customerId)
        
        console.log(`⚠️  Payment failed for customer ${customerId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id
        let subscriptionStatus = getStatusFromPriceId(priceId)

        // Handle status changes
        if (subscription.status === 'past_due') {
          subscriptionStatus = 'past_due'
        } else if (['canceled', 'unpaid'].includes(subscription.status)) {
          subscriptionStatus = 'cancelled'
        }

        await supabase
          .from('user_profiles')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_customer_id', customerId)

        console.log(`✅ Subscription updated: ${subscriptionStatus}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.json({ received: true })
  } catch (error) {
    console.error('Webhook handling error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
})
```

---

## 10. Architectural Patterns

### 10.1 Router Module Pattern

All routes use the same structure:

```typescript
import { Router } from 'express'

const router = Router()

// Define routes
router.get('/endpoint', middleware, handler)
router.post('/endpoint', middleware, handler)

// Export router
export default router

// OR named export
export { router as routeName }
```

**Benefits**:
- Modular route organization
- Easy to test individual routers
- Clear separation of concerns

---

### 10.2 Middleware Composition Pattern

```typescript
router.post(
  '/endpoint',
  authMiddleware,                    // 1. Authenticate
  validateRequest(schema),           // 2. Validate
  async (req: AuthRequest, res) => { // 3. Handle
    // Business logic
  }
)
```

**Order matters**:
1. Auth first (add user to request)
2. Validation second (transform/validate body)
3. Handler last (business logic)

---

### 10.3 Service Layer Pattern

**Libraries** (`src/lib/`):
- `supabase.ts`: Database client singleton
- `stripe.ts`: Payment client + helpers
- `ai-client.ts`: AI engine client
- `resend.ts`: Email service

**Utils** (`src/utils/`):
- `notifications.ts`: Notification helpers

**Benefits**:
- Reusable business logic
- Easy to mock in tests
- Centralized configuration

---

### 10.4 Error Handling Pattern

```typescript
try {
  // Database operation
  const { data, error } = await supabase.from('table').select()
  
  if (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Failed to fetch data' })
  }
  
  return res.status(200).json(data)
} catch (error) {
  console.error('Unexpected error:', error)
  return res.status(500).json({ error: 'Internal server error' })
}
```

**Principles**:
- Always handle Supabase errors
- Log errors for debugging
- Return user-friendly error messages
- Use appropriate HTTP status codes

---

### 10.5 Graceful Degradation Pattern

**AI Engine Integration**:
```typescript
const aiHealthy = await aiClient.healthCheck()

if (aiHealthy) {
  // Use AI matching
  const matches = await aiClient.generateMatches(...)
} else {
  // Fallback to basic matching
  const matches = basicSkillMatching(...)
}
```

**Benefits**:
- Service continues to function
- Better user experience
- No hard dependency on AI engine

---

### 10.6 Database Query Optimization

**Parallel Queries**:
```typescript
const [apps, profile, exp, edu] = await Promise.all([
  supabase.from('applications').select('*').eq('user_id', userId),
  supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
  supabase.from('experiences').select('*').eq('user_id', userId),
  supabase.from('education').select('*').eq('user_id', userId)
])
```

**Benefits**:
- Faster response times
- Better resource utilization
- Simpler code (vs sequential awaits)

---

### 10.7 TypeScript Type Safety

**Shared Types** (`@ori/types`):
```typescript
import { NotificationType } from '@ori/types'
```

**Request Type Extension**:
```typescript
export interface AuthRequest extends Request {
  user?: User
}
```

**Zod Runtime Validation**:
```typescript
const schema = z.object({
  email: z.string().email()
})

const validated = schema.parse(req.body)
// Now TypeScript knows validated.email is a valid email string
```

---

## Summary

The **Ori Platform Core-API** is a well-architected Express.js backend with:

### Strengths
✅ **Modular Architecture**: Clean separation of routes, middleware, services  
✅ **Type Safety**: TypeScript + Zod validation throughout  
✅ **Robust Auth**: JWT validation with Supabase Auth  
✅ **Payment Integration**: Comprehensive Stripe implementation  
✅ **AI Integration**: Smart job matching with graceful degradation  
✅ **Security**: Input validation, RLS policies, webhook verification  
✅ **Testing**: Jest setup with fixtures and mocking patterns  
✅ **Email System**: Professional templates with Resend integration  

### Areas for Enhancement
⚠️ **Rate Limiting**: Not implemented (recommended addition)  
⚠️ **CORS**: Currently allows all origins (should restrict in production)  
⚠️ **Error Handler**: Could be more sophisticated  
⚠️ **Email Sending**: Resend integration complete but in mock mode  
⚠️ **Caching**: No caching layer for frequently accessed data  

### Technology Decisions
- **Supabase**: Excellent choice for auth + PostgreSQL with RLS
- **Stripe**: Industry-standard payment processing
- **Zod**: Type-safe validation
- **Express**: Battle-tested, simple, fast
- **TypeScript**: Type safety with ES modules (.js extensions)

### Key Patterns
1. **Singleton Services**: Supabase, Stripe, AI clients
2. **Middleware Composition**: Auth → Validation → Handler
3. **Graceful Degradation**: AI engine failures don't break the app
4. **Parallel Queries**: Dashboard data fetched efficiently
5. **Type Safety**: AuthRequest, Zod schemas, TypeScript

This backend is production-ready with proper error handling, security measures, and a clean architecture that scales well.

---

**End of Analysis**
