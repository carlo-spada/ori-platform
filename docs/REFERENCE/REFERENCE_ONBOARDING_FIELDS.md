---
type: reference-doc
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: reference, onboarding, fields.md, implementation, field, mapping, step
priority: medium
quick-read-time: 10min
deep-dive-time: 16min
---

# Onboarding Implementation - Field Reference Guide

**Purpose**: Single source of truth for all onboarding form fields, their labels, validation, and storage locations

---

## ONBOARDING FIELD MAPPING

### Step 1: Basic Info

| Field                 | Frontend Type | Field Name           | Label                   | Placeholder                          | Validation           | DB Column   | DB Type      | Max Length |
| --------------------- | ------------- | -------------------- | ----------------------- | ------------------------------------ | -------------------- | ----------- | ------------ | ---------- |
| Professional Headline | Text Input    | `basicInfo.headline` | "Professional headline" | "Software Engineer \| AI Enthusiast" | Required, trim() > 0 | `headline`  | TEXT         | 200 chars  |
| Location              | Text Input    | `basicInfo.location` | "Location"              | "San Francisco, CA"                  | Required, trim() > 0 | `location`  | TEXT         | 100 chars  |
| **Full Name** ❌      | **MISSING**   | N/A                  | "Full Name"             | "Jane Doe"                           | **NOT CAPTURED**     | `full_name` | VARCHAR(200) | 200 chars  |

**Issue**: Full Name not captured in onboarding but exists in database schema

---

### Step 2: Skills

| Field     | Frontend Type | Field Name  | Label                       | Placeholder                                                 | Validation                                   | DB Column | DB Type | Notes                  |
| --------- | ------------- | ----------- | --------------------------- | ----------------------------------------------------------- | -------------------------------------------- | --------- | ------- | ---------------------- |
| Skill 1-N | Tag Input     | `skills[i]` | "What are your top skills?" | "Add a skill (e.g., Python, UX Research, Product Strategy)" | Minimum 3, no duplicates, whitespace trimmed | `skills`  | TEXT[]  | Array of skill strings |

**Validation Logic**:

```typescript
// Shown when < 3 skills
if (skills.length > 0 && skills.length < 3) {
  <p>"Please add at least 3 skills to continue"</p>
}

// Can proceed when >= 3
if (skills.length >= 3) {
  // Next button enabled
}
```

**Helper Text**: "Aim for 5–10 of your most relevant skills."

---

### Step 3: Goals

| Field            | Frontend Type     | Field Name             | Label              | Placeholder                                                                      | Validation                 | DB Column          | DB Type | Max Length            |
| ---------------- | ----------------- | ---------------------- | ------------------ | -------------------------------------------------------------------------------- | -------------------------- | ------------------ | ------- | --------------------- |
| Long-term Vision | Textarea (4 rows) | `goals.longTermVision` | "Long-term vision" | "Briefly describe the kind of work and impact you'd like to have in the future…" | Either vision OR >= 1 role | `long_term_vision` | TEXT    | 2000 chars            |
| Target Role 1-N  | Tag Input         | `goals.targetRoles[i]` | "Target roles"     | "Add a role (e.g., Senior Data Scientist, Head of Product)"                      | Either vision OR >= 1 role | `target_roles`     | TEXT[]  | Array of role strings |

**Validation Logic**:

```typescript
// Can proceed if EITHER:
data.goals.longTermVision.trim().length > 0 || // Has vision
  data.goals.targetRoles.length > 0 // OR has roles
```

**Helper Text**: "Add 1–3 roles you'd be excited to grow into."

---

## FORM DATA STRUCTURE

### Frontend (Before Submission)

```typescript
interface OnboardingData {
  basicInfo: {
    headline: string // "Software Engineer | AI Enthusiast"
    location: string // "San Francisco, CA"
    // ❌ MISSING: fullName
  }
  skills: string[] // ["Python", "React", "TypeScript"]
  goals: {
    longTermVision: string // "I want to lead AI product teams..."
    targetRoles: string[] // ["Engineering Manager", "AI Lead"]
  }
}
```

### API Request (After Transformation)

```typescript
// In page.tsx handleNext() when on goals step
const profileData = {
  headline: data.basicInfo.headline,
  location: data.basicInfo.location,
  // ❌ MISSING: full_name would go here
  skills: data.skills,
  long_term_vision: data.goals.longTermVision,
  target_roles: data.goals.targetRoles,
}

// POST body to: PUT /api/v1/profile/onboarding
```

### Database (user_profiles table)

```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  full_name: string | null         // ❌ NOT SET BY ONBOARDING
  headline: string | null
  location: string | null
  skills: string[] (TEXT[])
  long_term_vision: string | null
  target_roles: string[] (TEXT[])
  onboarding_completed: boolean    // Set to TRUE
  updated_at: timestamp
  // ... other fields
}
```

---

## STEP-BY-STEP FIELD PROGRESSION

```
┌──────────────────────────────────────────────────────────┐
│ STEP 0: Welcome                                          │
├──────────────────────────────────────────────────────────┤
│ Data Captured: NONE                                       │
│ Fields: Just a greeting button                            │
│ Validation: Always valid                                  │
│ Next: Clears nothing, advances to basicInfo               │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 1: Basic Info                                       │
├──────────────────────────────────────────────────────────┤
│ Fields Input:                                             │
│   - Headline (Text)      →  data.basicInfo.headline      │
│   - Location (Text)      →  data.basicInfo.location      │
│                                                           │
│ Validation:                                               │
│   ✓ headline.trim().length > 0                            │
│   ✓ location.trim().length > 0                            │
│   ✗ Missing: Full Name field                              │
│                                                           │
│ Back: Returns to welcome (data preserved)                 │
│ Next: Disabled until both fields filled                   │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 2: Skills                                           │
├──────────────────────────────────────────────────────────┤
│ Fields Input:                                             │
│   - Skill Input (Text + Add)  →  data.skills[i]          │
│   - Skill Tags (Removable)                                │
│                                                           │
│ Current Data:                                             │
│   data.basicInfo = { headline, location }  (preserved)   │
│   data.skills = ["Python", "React", ...]  (building)     │
│   data.goals = { ... }  (empty from defaults)             │
│                                                           │
│ Validation:                                               │
│   ✓ skills.length >= 3                                    │
│   ✗ Until 3 skills: shows error message                   │
│                                                           │
│ Add Behavior:                                             │
│   - Enter key: adds skill                                 │
│   - Click button: adds skill                              │
│   - Trimmed, no duplicates                                │
│                                                           │
│ Back: Returns to basicInfo (skills preserved)             │
│ Next: Disabled until >= 3 skills                          │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 3: Goals                                            │
├──────────────────────────────────────────────────────────┤
│ Fields Input:                                             │
│   - Long-term Vision (Textarea) → data.goals.longTermVision
│   - Target Roles (Text + Add)  → data.goals.targetRoles  │
│   - Role Tags (Removable)                                 │
│                                                           │
│ Current Data:                                             │
│   data.basicInfo = { headline, location }  (preserved)   │
│   data.skills = [...]                     (preserved)    │
│   data.goals = {                                          │
│     longTermVision: "...",                                │
│     targetRoles: [...]                                    │
│   }  (building)                                           │
│                                                           │
│ Validation:                                               │
│   ✓ longTermVision.trim().length > 0  OR  targetRoles > 0│
│   ✗ Both empty: Next button disabled                      │
│                                                           │
│ Back: Returns to skills (goals preserved)                 │
│ Next Button Label: "Finish" (not "Next")                  │
│ Next Click: Triggers submit + advances to finalizing      │
└──────────────────────────────────────────────────────────┘
                            ↓
         ╔════════════════════════════════════╗
         ║  Data Transformation & Submission  ║
         ╚════════════════════════════════════╝

         OnboardingData → ProfileData
         {
           basicInfo.headline → headline
           basicInfo.location → location
           skills → skills
           goals.longTermVision → long_term_vision
           goals.targetRoles → target_roles
         }

         ↓ API Call (with JWT auth)
         PUT /api/v1/profile/onboarding

         ↓ Backend Processing
         1. Validate auth
         2. Validate fields
         3. Create Stripe customer
         4. Update user_profiles
         5. Set onboarding_completed = true
         6. Return updated profile

                            ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 4: Finalizing (Loading)                             │
├──────────────────────────────────────────────────────────┤
│ Data Captured: NONE (read-only)                           │
│ Display: Loading animation + message                      │
│ Validation: Always invalid (prevents next)                │
│                                                           │
│ On Success:                                               │
│   1. Wait 1.5s                                            │
│   2. Show toast: "Welcome to Ori! ..."                    │
│   3. Redirect to /dashboard                              │
│   4. React Query updates ['profile'] cache                │
│                                                           │
│ On Error:                                                 │
│   1. Show toast: "Failed to save..."                      │
│   2. Return to STEP 3 (goals)    ❌ BUG: uses wrong index │
│   3. Preserve all data                                    │
│   4. User can retry                                       │
└──────────────────────────────────────────────────────────┘
```

---

## TRANSLATION KEYS (i18n)

**File**: `/public/locales/en/translation.json`

**Section**: `onboardingPage.*`

### Welcome Keys

```json
{
  "welcome": {
    "headline": "Welcome to Ori, {{name}}.",
    "body": "To get started, we'll ask a few focused questions...",
    "primaryButton": "Let's begin"
  }
}
```

### Basic Info Keys

```json
{
  "basicInfo": {
    "headline": "Tell us a bit about yourself.",
    "description": "Ori uses this information to better contextualize your opportunities.",
    "headlineLabel": "Professional headline",
    "headlinePlaceholder": "Software Engineer | AI Enthusiast",
    "locationLabel": "Location",
    "locationPlaceholder": "San Francisco, CA"
  }
}
```

### Skills Keys

```json
{
  "skills": {
    "headline": "What are your top skills?",
    "description": "We'll use these to match you with roles and learning paths that fit you.",
    "inputPlaceholder": "Add a skill (e.g., Python, UX Research, Product Strategy)",
    "helper": "Aim for 5–10 of your most relevant skills.",
    "validationError": "Please add at least 3 skills to continue"
  }
}
```

### Goals Keys

```json
{
  "goals": {
    "headline": "What are you aiming for?",
    "description": "Share the direction you'd like your career to move in.",
    "longTermVisionLabel": "Long-term vision",
    "longTermVisionPlaceholder": "Briefly describe the kind of work and impact you'd like to have in the future…",
    "targetRolesLabel": "Target roles",
    "targetRolesPlaceholder": "Add a role (e.g., Senior Data Scientist, Head of Product)",
    "helper": "Add 1–3 roles you'd be excited to grow into."
  }
}
```

### Navigation Keys

```json
{
  "nav": {
    "backLabel": "Back",
    "nextLabel": "Next",
    "finishLabel": "Finish"
  }
}
```

### Other Keys

```json
{
  "progressLabel": "Step {{current}} of {{total}}",
  "finalizing": {
    "headline": "Calibrating your Ori…",
    "body": "We're aligning your profile with current opportunities..."
  }
}
```

---

## VALIDATION RULES (COMPLETE REFERENCE)

### Field-Level Validations

| Field          | Type     | Validation                          | Error Message                                      | Where Enforced |
| -------------- | -------- | ----------------------------------- | -------------------------------------------------- | -------------- |
| headline       | string   | Non-empty after trim                | (Disables next button)                             | Frontend       |
| headline       | string   | Max 200 characters                  | "Headline must be 200 characters or less"          | Backend        |
| location       | string   | Non-empty after trim                | (Disables next button)                             | Frontend       |
| location       | string   | Max 100 characters                  | "Location must be 100 characters or less"          | Backend        |
| skills         | string[] | Minimum 3 items                     | "Please add at least 3 skills to continue"         | Frontend       |
| skills         | string[] | No duplicates                       | (Checked on add)                                   | Frontend       |
| skills         | string[] | No empty strings                    | (Trimmed before adding)                            | Frontend       |
| longTermVision | string   | Non-empty OR targetRoles.length > 0 | (Disables next button)                             | Frontend       |
| longTermVision | string   | Max 2000 characters                 | "Long term vision must be 2000 characters or less" | Backend        |
| targetRoles    | string[] | Min 0 (optional if vision filled)   | (Disables next button)                             | Frontend       |
| targetRoles    | string[] | No duplicates                       | (Checked on add)                                   | Frontend       |

### Step-Level Validations

| Step       | Passes If                         | Fails If                |
| ---------- | --------------------------------- | ----------------------- |
| welcome    | Always                            | Never (no form)         |
| basicInfo  | headline ✓ AND location ✓         | Either empty/whitespace |
| skills     | skills.length >= 3                | skills.length < 3       |
| goals      | longTermVision ✓ OR targetRoles ✓ | Both empty              |
| finalizing | Never (always disabled)           | Always (read-only)      |

---

## API PAYLOAD EXAMPLES

### Success Request

```json
PUT /api/v1/profile/onboarding
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "headline": "Software Engineer | AI Enthusiast",
  "location": "San Francisco, CA",
  "skills": ["Python", "React", "Machine Learning"],
  "long_term_vision": "Lead AI product teams and drive innovation in human-centered AI",
  "target_roles": ["Engineering Manager", "AI Lead"]
}
```

### Success Response

```json
200 OK
Content-Type: application/json

{
  "id": "uuid-profile-id",
  "user_id": "uuid-user-id",
  "headline": "Software Engineer | AI Enthusiast",
  "location": "San Francisco, CA",
  "skills": ["Python", "React", "Machine Learning"],
  "long_term_vision": "Lead AI product teams and drive innovation in human-centered AI",
  "target_roles": ["Engineering Manager", "AI Lead"],
  "onboarding_completed": true,
  "updated_at": "2025-11-10T12:34:56.789Z",
  "created_at": "2025-11-10T12:00:00.000Z"
}
```

### Error Response (Validation)

```json
400 Bad Request
Content-Type: application/json

{
  "error": "Headline must be 200 characters or less"
}
```

### Error Response (Auth)

```json
401 Unauthorized
Content-Type: application/json

{
  "error": "User not authenticated"
}
```

---

## DATABASE SCHEMA (Relevant Columns)

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Onboarding fields
  full_name VARCHAR(200),                    -- ❌ NOT SET BY ONBOARDING
  headline TEXT,
  location TEXT,
  skills TEXT[],
  long_term_vision TEXT,
  target_roles TEXT[],

  -- Other fields
  about TEXT,
  cv_url TEXT,
  work_style TEXT,
  industries TEXT[],
  goal TEXT,
  experience_level TEXT,
  years_of_experience INTEGER,
  willing_to_relocate BOOLEAN,

  -- Subscription fields
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  subscription_status TEXT,

  -- Status
  onboarding_completed BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_target_roles ON user_profiles USING GIN(target_roles);
-- ❌ MISSING: Index on skills array for search performance
```

---

## COMPONENT PROPS REFERENCE

### WelcomeStep Props

```typescript
interface WelcomeStepProps {
  copy: {
    headline: string
    body: string
    primaryButton: string
  }
  onNext: () => void
}
```

### BasicInfoStep Props

```typescript
interface BasicInfoStepProps {
  value: OnboardingData['basicInfo'] // { headline, location }
  copy: {
    headline: string
    description: string
    headlineLabel: string
    headlinePlaceholder: string
    locationLabel: string
    locationPlaceholder: string
  }
  onChange: (value: OnboardingData['basicInfo']) => void
}
```

### SkillsStep Props

```typescript
interface SkillsStepProps {
  skills: string[]
  copy: {
    headline: string
    description: string
    inputPlaceholder: string
    helper: string
    validationError: string
  }
  onChange: (skills: string[]) => void
}
```

### GoalsStep Props

```typescript
interface GoalsStepProps {
  value: OnboardingData['goals'] // { longTermVision, targetRoles }
  copy: {
    headline: string
    description: string
    longTermVisionLabel: string
    longTermVisionPlaceholder: string
    targetRolesLabel: string
    targetRolesPlaceholder: string
    helper: string
  }
  onChange: (value: OnboardingData['goals']) => void
}
```

### FinalizingStep Props

```typescript
interface FinalizingStepProps {
  copy: {
    headline: string
    body: string
  }
  isLoading: boolean
}
```

---

## QUICK LOOKUP TABLE

**Where is field X stored?**

| Field                 | Step | Component          | Data Path                    | DB Column            | Type    |
| --------------------- | ---- | ------------------ | ---------------------------- | -------------------- | ------- |
| User's name           | -    | From user metadata | user.user_metadata.full_name | full_name            | string  |
| Professional headline | 1    | BasicInfoStep      | data.basicInfo.headline      | headline             | text    |
| Location              | 1    | BasicInfoStep      | data.basicInfo.location      | location             | text    |
| Skills                | 2    | SkillsStep         | data.skills[i]               | skills               | text[]  |
| Long-term vision      | 3    | GoalsStep          | data.goals.longTermVision    | long_term_vision     | text    |
| Target roles          | 3    | GoalsStep          | data.goals.targetRoles[i]    | target_roles         | text[]  |
| Onboarding completed  | N/A  | Backend only       | N/A                          | onboarding_completed | boolean |

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Status**: Complete field reference guide
