# Onboarding Implementation - Complete Architecture Analysis

**Date**: 2025-11-10  
**Codebase**: Ori Platform (Next.js + Express + React Query)  
**Scope**: Frontend onboarding flow, API endpoints, database schema, type system

---

## Executive Summary

The onboarding implementation follows a **5-step multi-page flow** with state management through React hooks, API integration via React Query, and backend persistence in Supabase. The system captures professional profile data (headline, location, skills, career goals) to complete user profiles and enable job matching.

**Key Files**:

- Frontend: `/src/app/onboarding/page.tsx` (main orchestrator)
- Components: `/src/components/onboarding/*.tsx` (5 step components)
- API Client: `/src/integrations/api/profile.ts`
- React Hook: `/src/hooks/useProfile.ts`
- Backend: `/services/core-api/src/routes/profile.ts`
- Types: `/src/lib/types.ts`, `/shared/types/src/index.ts`
- Translations: `/public/locales/en/translation.json`
- DB Schema: `/supabase/migrations/20251108020018_*.sql`
- Guard: `/src/components/auth/OnboardingGuard.tsx`

---

## 1. ONBOARDING FLOW ARCHITECTURE

### 1.1 Step Sequence (5 Steps)

```typescript
const STEPS: OnboardingStepKey[] = [
  'welcome', // Step 0: Introduction with user's name
  'basicInfo', // Step 1: Professional headline + location
  'skills', // Step 2: Add 3+ skills
  'goals', // Step 3: Long-term vision + target roles
  'finalizing', // Step 4: Loading state (auto-submits)
]
```

**Progress Display**:

- Only shows for steps 1-3 (not welcome/finalizing)
- Progress = `(currentStepIndex / 4) * 100`
- Uses simple progress bar with percentage label

---

### 1.2 Data Structure

```typescript
// Frontend state structure (src/lib/types.ts)
export interface OnboardingData {
  basicInfo: {
    headline: string // "Software Engineer | AI Enthusiast"
    location: string // "San Francisco, CA"
  }
  skills: string[] // ["Python", "React", "AWS"]
  goals: {
    longTermVision: string // Multi-line text field
    targetRoles: string[] // ["Senior Engineer", "Tech Lead"]
  }
}
```

**Default Values**:

```typescript
const DEFAULT_BASIC_INFO = { headline: '', location: '' }
const DEFAULT_GOALS = {
  longTermVision: '',
  targetRoles: [],
}
```

---

### 1.3 Validation Rules

| Step         | Validation Logic                                                   |
| ------------ | ------------------------------------------------------------------ |
| `welcome`    | Always valid (no form input)                                       |
| `basicInfo`  | `headline.trim().length > 0` AND `location.trim().length > 0`      |
| `skills`     | `skills.length >= 3`                                               |
| `goals`      | `longTermVision.trim().length > 0` OR `targetRoles.length > 0`     |
| `finalizing` | Always invalid (disables next button, prevents further navigation) |

**Implementation**:

```typescript
const isStepValid = (): boolean => {
  switch (currentStep) {
    case 'basicInfo':
      return (
        data.basicInfo.headline.trim().length > 0 &&
        data.basicInfo.location.trim().length > 0
      )
    // ... other cases
  }
}
```

---

## 2. FRONTEND COMPONENTS

### 2.1 Main Page: `/src/app/onboarding/page.tsx`

**Responsibilities**:

- State management (current step, form data)
- Step progression logic
- Data transformation for API submission
- Auth/profile checks with redirects
- Navigation between steps
- Submit trigger on goals step completion

**Key State Variables**:

```typescript
const [currentStepIndex, setCurrentStepIndex] = useState(0)
const [data, setData] = useState<OnboardingData>({
  basicInfo: { ...DEFAULT_BASIC_INFO },
  skills: [],
  goals: { ...DEFAULT_GOALS },
})
```

**User Injection**:

```typescript
const userName =
  user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
```

**Auth Guards**:

1. Redirects to `/login` if not authenticated
2. Redirects to `/dashboard` if `profile.onboarding_completed === true`

---

### 2.2 Step Components

#### **WelcomeStep** (`/src/components/onboarding/WelcomeStep.tsx`)

- **Input**: Copy object with interpolated username
- **Output**: Single "Let's begin" button
- **Interaction**: Click to advance to basicInfo

```typescript
interface WelcomeStepProps {
  copy: {
    headline: string // "Welcome to Ori, {{name}}."
    body: string
    primaryButton: string
  }
  onNext: () => void
}
```

#### **BasicInfoStep** (`/src/components/onboarding/BasicInfoStep.tsx`)

- **Inputs**:
  - `headline` (Text input) - max 200 chars
  - `location` (Text input) - max 100 chars
- **Labels**: "Professional headline" / "Location"
- **Placeholders**: "Software Engineer | AI Enthusiast" / "San Francisco, CA"
- **Validation**: Both fields required

```typescript
interface BasicInfoStepProps {
  value: OnboardingData['basicInfo']
  copy: { ... }
  onChange: (value: OnboardingData['basicInfo']) => void
}
```

#### **SkillsStep** (`/src/components/onboarding/SkillsStep.tsx`)

- **Input**: Text field + Add button (or Enter key)
- **Storage**: Badge display, X button to remove
- **Validation**: Requires 3+ skills
- **Helper Text**: "Aim for 5–10 of your most relevant skills."
- **Warning**: Shows amber error if < 3 skills added

```typescript
const handleAdd = () => {
  const trimmed = input.trim()
  if (trimmed && !skills.includes(trimmed)) {
    onChange([...skills, trimmed])
    setInput('')
  }
}
```

**Badge Display**:

```tsx
<Badge variant="secondary" className="flex items-center gap-1.5">
  {skill}
  <button onClick={() => handleRemove(skill)}>
    <X className="h-3 w-3" />
  </button>
</Badge>
```

#### **GoalsStep** (`/src/components/onboarding/GoalsStep.tsx`)

- **Inputs**:
  - `longTermVision` (Textarea, 4 rows)
  - `targetRoles` (Text + Add button, like skills)
- **Labels**: "Long-term vision" / "Target roles"
- **Validation**: Either vision OR at least 1 target role required
- **Helper**: "Add 1–3 roles you'd be excited to grow into."

```typescript
interface GoalsStepProps {
  value: OnboardingData['goals']
  copy: { ... }
  onChange: (value: OnboardingData['goals']) => void
}
```

#### **FinalizingStep** (`/src/components/onboarding/FinalizingStep.tsx`)

- **Display**: Loading animation with 3 pulsing dots
- **Copy**: "Calibrating your Ori…" / "We're aligning your profile…"
- **No Inputs**: Pure display component

---

### 2.3 Navigation

**Visible On**:

- Progress bar: Steps 1-3 only (not welcome/finalizing)
- Back button: Steps 1-3 only (not welcome/finalizing)
- Next button: Always visible except finalizing
- Finish button: On goals step (Next label changes to "Finish")

**Button States**:

- Back: `onClick={handleBack}` (decrement index)
- Next/Finish: `disabled={!isStepValid() || isSubmitting}`

---

## 3. API INTEGRATION

### 3.1 API Client (`/src/integrations/api/profile.ts`)

**Primary Endpoint**:

```
PUT /api/v1/profile/onboarding
```

**Request Body Transformation**:

```typescript
// Frontend data structure → Backend field names
const profileData = {
  headline: data.basicInfo.headline, // string
  location: data.basicInfo.location, // string
  skills: data.skills, // string[]
  long_term_vision: data.goals.longTermVision, // string
  target_roles: data.goals.targetRoles, // string[]
}
```

**Function Definition**:

```typescript
export async function completeOnboarding(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  const headers = await getAuthHeaders()

  const response = await fetch(
    `${API_URL}/api/v1/profile/onboarding`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) throw new Error(...)
  return response.json()
}
```

**Auth**:

- JWT token from Supabase session in Authorization header
- Managed by `getAuthHeaders()` utility

---

### 3.2 React Query Hook (`/src/hooks/useProfile.ts`)

```typescript
export function useCompleteOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => completeOnboarding(data),
    onSuccess: (updatedProfile) => {
      // Update cache
      queryClient.setQueryData(['profile'], updatedProfile)
    },
  })
}
```

**Usage in Page**:

```typescript
const { mutate: submitOnboarding, isPending: isSubmitting } =
  useCompleteOnboarding()

// In handleNext when on goals step:
submitOnboarding(profileData, {
  onSuccess: () => {
    setTimeout(() => {
      toast.success('Welcome to Ori! Your profile has been created.')
      router.push('/dashboard')
    }, 1500)
  },
  onError: (error) => {
    toast.error('Failed to save your profile. Please try again.')
    setCurrentStepIndex(currentStepIndex) // Return to goals
  },
})
```

---

## 4. BACKEND IMPLEMENTATION

### 4.1 Endpoint: `PUT /api/v1/profile/onboarding`

**Location**: `/services/core-api/src/routes/profile.ts`

**Handler Logic**:

1. Validates JWT (authMiddleware)
2. Validates `work_style` enum (if provided)
3. Validates string length limits:
   - `full_name`: max 200 chars
   - `headline`: max 200 chars
   - `location`: max 100 chars
   - `about`: max 5000 chars
   - `long_term_vision`: max 2000 chars
   - `goal`: max 1000 chars

4. **Creates Stripe Customer** (new feature):

   ```typescript
   const userEmail = await getUserEmail(req.user.id)
   await ensureStripeCustomer(req.user.id, userEmail, full_name)
   ```

5. **Updates user_profiles table**:

   ```typescript
   const updateData = {
     onboarding_completed: true,
     headline,
     location,
     skills,
     target_roles,
     long_term_vision,
     // ... other fields
     updated_at: new Date().toISOString(),
   }

   const { data: profile, error } = await supabase
     .from('user_profiles')
     .update(updateData)
     .eq('user_id', req.user.id)
     .select()
     .single()
   ```

6. **Response**: Returns updated profile object

---

### 4.2 Database Schema

**Table**: `public.user_profiles`

**Onboarding-Related Columns** (from migration `20251108020018_*.sql`):

```sql
ALTER TABLE public.user_profiles
ADD COLUMN headline TEXT,
ADD COLUMN location TEXT,
ADD COLUMN target_roles TEXT[] DEFAULT '{}';

CREATE INDEX idx_user_profiles_target_roles
  ON public.user_profiles USING GIN (target_roles);
```

**Existing Related Columns** (other migrations):

- `skills` - text array (used for matching)
- `long_term_vision` - text (captured during onboarding)
- `onboarding_completed` - boolean (set to true on completion)

---

## 5. TYPE SYSTEM

### 5.1 Frontend Types (`/src/lib/types.ts`)

```typescript
export interface OnboardingData {
  basicInfo: {
    headline: string
    location: string
  }
  skills: string[]
  goals: {
    longTermVision: string
    targetRoles: string[]
  }
}

export type OnboardingStepKey =
  | 'welcome'
  | 'basicInfo'
  | 'skills'
  | 'goals'
  | 'finalizing'
```

### 5.2 Shared Backend Types (`/shared/types/src/index.ts`)

```typescript
export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  headline?: string // Professional headline
  location?: string // Location
  skills?: string[] // List of skills
  target_roles?: string[] // Career targets
  long_term_vision?: string // Career vision
  onboarding_completed?: boolean // Flag
  // ... other fields
}

export interface OnboardingData {
  step: number
  completed: boolean
  skills?: string[]
  preferences?: UserPreferences
  profile?: Partial<UserProfile>
}
```

---

## 6. AUTHENTICATION & GUARDS

### 6.1 OnboardingGuard Component (`/src/components/auth/OnboardingGuard.tsx`)

**Purpose**: Enforce onboarding flow before dashboard access

**Redirect Logic**:

```typescript
// Public routes (no check needed)
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/pricing',
  '/blog',
  '/features',
  '/legal',
]

// Onboarding routes (allowed even if incomplete)
const onboardingRoutes = ['/select-plan', '/onboarding']

// Protected routes (require onboarding_completed = true)
// → Everything else
```

**Behavior**:

1. If authenticated + onboarding NOT complete → redirect to `/select-plan`
2. If authenticated + onboarding complete → allow access
3. If not authenticated + not on public/onboarding route → redirect to `/login`

---

### 6.2 In Onboarding Page

```typescript
// Redirect if not authenticated
useEffect(() => {
  if (!user && !isProfileLoading) {
    router.push('/login')
  }
}, [user, isProfileLoading, router])

// Redirect if onboarding already completed
useEffect(() => {
  if (profile?.onboarding_completed) {
    router.push('/dashboard')
  }
}, [profile, router])
```

---

## 7. TRANSLATIONS/COPY

### 7.1 Translation Keys

**Path**: `/public/locales/en/translation.json`

**Onboarding Section**:

```json
{
  "onboardingPage": {
    "progressLabel": "Step {{current}} of {{total}}",
    "welcome": {
      "headline": "Welcome to Ori, {{name}}.",
      "body": "To get started, we'll ask a few focused questions about your skills and goals. This only takes a couple of minutes, and it helps Ori guide you more effectively.",
      "primaryButton": "Let's begin"
    },
    "basicInfo": {
      "headline": "Tell us a bit about yourself.",
      "description": "Ori uses this information to better contextualize your opportunities.",
      "headlineLabel": "Professional headline",
      "headlinePlaceholder": "Software Engineer | AI Enthusiast",
      "locationLabel": "Location",
      "locationPlaceholder": "San Francisco, CA"
    },
    "skills": {
      "headline": "What are your top skills?",
      "description": "We'll use these to match you with roles and learning paths that fit you.",
      "inputPlaceholder": "Add a skill (e.g., Python, UX Research, Product Strategy)",
      "helper": "Aim for 5–10 of your most relevant skills.",
      "validationError": "Please add at least 3 skills to continue"
    },
    "goals": {
      "headline": "What are you aiming for?",
      "description": "Share the direction you'd like your career to move in.",
      "longTermVisionLabel": "Long-term vision",
      "longTermVisionPlaceholder": "Briefly describe the kind of work and impact you'd like to have in the future…",
      "targetRolesLabel": "Target roles",
      "targetRolesPlaceholder": "Add a role (e.g., Senior Data Scientist, Head of Product)",
      "helper": "Add 1–3 roles you'd be excited to grow into."
    },
    "finalizing": {
      "headline": "Calibrating your Ori…",
      "body": "We're aligning your profile with current opportunities and growth paths. You'll see your personalized dashboard in just a moment."
    },
    "nav": {
      "backLabel": "Back",
      "nextLabel": "Next",
      "finishLabel": "Finish"
    }
  }
}
```

---

## 8. COMPLETE DATA FLOW DIAGRAM

```
User Signs Up
    ↓
Email Verification
    ↓
Redirected to /select-plan (OnboardingGuard)
    ↓
Select Subscription Plan
    ↓
Redirected to /onboarding (OnboardingGuard)
    ↓
┌─────────────────────────────────────┐
│ /app/onboarding/page.tsx            │
│  - State: OnboardingData             │
│  - Current Step: welcome             │
└─────────────────────────────────────┘
    ↓ (Click "Let's begin")
┌─────────────────────────────────────┐
│ BasicInfoStep                       │
│  - headline: ""                      │
│  - location: ""                      │
│ Validation: Both required            │
└─────────────────────────────────────┘
    ↓ (Click "Next")
┌─────────────────────────────────────┐
│ SkillsStep                          │
│  - skills: []                        │
│ Validation: >= 3 skills              │
└─────────────────────────────────────┘
    ↓ (Click "Next")
┌─────────────────────────────────────┐
│ GoalsStep                           │
│  - longTermVision: ""                │
│  - targetRoles: []                   │
│ Validation: vision OR roles           │
└─────────────────────────────────────┘
    ↓ (Click "Finish")
┌─────────────────────────────────────┐
│ Transform Data:                      │
│  basicInfo.headline → headline       │
│  basicInfo.location → location       │
│  skills → skills                     │
│  goals.longTermVision → long_term_   │
│                        vision        │
│  goals.targetRoles → target_roles    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ API Call:                            │
│ PUT /api/v1/profile/onboarding       │
│  Headers: { Authorization: JWT }     │
│  Body: { headline, location,         │
│          skills, long_term_vision,   │
│          target_roles }              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Backend Processing:                  │
│  1. Validate JWT                     │
│  2. Create Stripe customer           │
│  3. Update user_profiles table       │
│  4. Set onboarding_completed = true  │
│  5. Return updated profile           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ FinalizingStep                      │
│  - Loading animation                 │
│  - 1.5s delay                        │
└─────────────────────────────────────┘
    ↓ (Auto-redirect after success)
┌─────────────────────────────────────┐
│ Toast: "Welcome to Ori! Your        │
│         profile has been created."   │
│                                     │
│ Redirect to /dashboard              │
│ (OnboardingGuard allows access)      │
└─────────────────────────────────────┘
```

---

## 9. ERROR HANDLING

### 9.1 Frontend

**Submission Error**:

```typescript
submitOnboarding(profileData, {
  onError: (error) => {
    console.error('Onboarding submission failed:', error)
    toast.error('Failed to save your profile. Please try again.')
    // Return user to goals step (previous step)
    setCurrentStepIndex(currentStepIndex)
  },
})
```

**Auth Error**:

- API client throws if no session
- Page redirects to `/login`

### 9.2 Backend

**Validation Errors**:

- Returns 400 with error message for validation failures
- Validates work_style enum, string lengths

**Auth Errors**:

- Returns 401 if user not authenticated
- Returns 401 if no active session

**Server Errors**:

- Returns 500 for database errors, Stripe errors, etc.
- Logs error to console for debugging

---

## 10. STATE MANAGEMENT ARCHITECTURE

### 10.1 Frontend State

**Local Component State** (in `/src/app/onboarding/page.tsx`):

```typescript
const [currentStepIndex, setCurrentStepIndex] = useState(0)
const [data, setData] = useState<OnboardingData>({...})
```

**React Query Cache** (in `useCompleteOnboarding`):

```typescript
queryClient.setQueryData(['profile'], updatedProfile)
```

**Auth Context** (global):

```typescript
const { user } = useAuth() // Supabase user object
```

**Profile Hook** (global):

```typescript
const { data: profile, isLoading } = useProfile()
```

---

## 11. EDGE CASES & SPECIAL BEHAVIORS

### 11.1 Edge Cases

| Case                           | Behavior                                        |
| ------------------------------ | ----------------------------------------------- |
| User already onboarded         | Redirect to `/dashboard` before page loads      |
| User not authenticated         | Redirect to `/login` before page loads          |
| Network error on submit        | Show toast, return to goals step, preserve data |
| Skills field - duplicate       | Ignored (input.includes check)                  |
| Skills field - whitespace trim | Trimmed before adding                           |
| Target roles - order           | Preserved as added                              |
| Going back then forward        | Data preserved from previous entries            |
| Leaving page mid-onboarding    | Data lost (stored only in component state)      |

### 11.2 Special Behaviors

**Username Interpolation**:

```typescript
const userName =
  user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

// Passed to WelcomeStep as pre-formatted copy
```

**Skip Button on Welcome**: Not implemented (Welcome step only has "Let's begin")

**Progress Text**: Shows "Step 1 of 4", "Step 2 of 4", etc. (not counting finalizing)

**Toast Messages**:

- Success: "Welcome to Ori! Your profile has been created."
- Error: "Failed to save your profile. Please try again."

---

## 12. TESTING CONSIDERATIONS

### Frontend Tests

**What to test**:

- Step progression (next/back buttons)
- Validation logic per step
- Data transformation before API call
- Toast messages on success/error
- Redirect behavior (authenticated, not onboarded)
- Skip functionality (if added)
- Keyboard input (Enter to add skill/role)

**Mocking needed**:

- `useAuth()` hook
- `useProfile()` hook
- `completeOnboarding()` API call
- Next.js router

### Backend Tests

**What to test**:

- 400 errors for invalid work_style
- 400 errors for string length violations
- 401 errors for missing auth
- 200 success with profile returned
- Stripe customer creation
- `onboarding_completed` flag set correctly
- Profile data persisted to database

---

## 13. KEY OBSERVATIONS & POTENTIAL ISSUES

### 13.1 Strengths

1. **Clean separation of concerns**: Each step is a self-contained component
2. **Type safety**: Full TypeScript with interface definitions
3. **Internationalization ready**: All copy in translation files
4. **Progressive validation**: Can't proceed without valid data
5. **Graceful error handling**: Toast notifications, retry logic
6. **Auth protection**: OnboardingGuard ensures flow enforcement
7. **State preservation**: Back button preserves previously entered data

### 13.2 Potential Issues & Gaps

#### Issue #1: Missing "Full Name" Capture

- **Current**: Only captures `headline` and `location` in basicInfo
- **Expected**: `full_name` is a profile field but NOT captured in onboarding
- **Impact**: Profile is missing user's full name
- **Fix**: Add `fullName` field to basicInfo step

#### Issue #2: Data Persistence on Navigation

- **Current**: Form data only in component state
- **Risk**: If user closes browser, all data is lost (no auto-save)
- **Impact**: User must restart onboarding
- **Consideration**: Could add localStorage or backend auto-save

#### Issue #3: Profile.full_name Never Set

- **Current**: Backend can accept `full_name` in request, but onboarding doesn't send it
- **Implementation**: `full_name` field added to BasicInfoStep needed
- **Location**: Transform in `handleNext()` for goals → finalizing

#### Issue #4: Translation Key Structure

- **Current**: Keys like `onboardingPage.basicInfo.headlineLabel`
- **Works**: Yes, i18n correctly interpolates
- **Note**: Some keys have variations (e.g., profileForm.headlineLabel differs from onboardingPage.basicInfo.headlineLabel)

#### Issue #5: Error on Return to Goals Step

- **Current**: On submission error, code does: `setCurrentStepIndex(currentStepIndex)`
- **Issue**: `currentStepIndex` is 4 (finalizing), so this sets it to 4 again (no change)
- **Fix**: Should be `setCurrentStepIndex(currentStepIndex - 1)`

#### Issue #6: Skills Array Handling

- **Current**: Skills stored as string array in database
- **Query**: How are skills indexed/searched? (GIN index on target_roles, but not skills)
- **Consideration**: Performance for large datasets

#### Issue #7: Stripe Customer Creation Timing

- **Current**: Created during onboarding completion
- **Not visible to frontend**: User doesn't see confirmation
- **Risk**: If Stripe call fails, onboarding fails (no fallback)
- **Consideration**: Could be handled asynchronously or with error tolerance

---

## 14. RELATED PAGES & INTEGRATION POINTS

### 14.1 Post-Onboarding Pages

**Profile Page** (`/src/app/app/profile/page.tsx`):

- Uses same fields (`headline`, `location`, `skills`, `long_term_vision`, `target_roles`)
- Can edit after onboarding
- Additional fields: `about`, `experience`, `education`

**Dashboard** (`/src/app/app/dashboard/page.tsx`):

- Checks if `onboarding_completed === true`
- Uses `headline` in greeting
- Displays recommendations based on skills/goals

**Settings** (`/src/app/app/settings/page.tsx`):

- Can delete account (which cascades to profile deletion)
- Subscription management

### 14.2 Authentication Flow

**Signup** → **Email Verification** → **Select Plan** → **Onboarding** → **Dashboard**

---

## 15. DEPLOYMENT & ENVIRONMENT

### 15.1 Environment Variables Needed

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # or production API
```

**Backend** (`services/core-api/.env`):

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
```

### 15.2 Database Migrations

Must be applied before onboarding works:

1. `20251108020018_add_onboarding_fields_to_user_profiles.sql`
   - Adds `headline`, `location`, `target_roles` columns
   - Creates GIN index on `target_roles`

---

## SUMMARY TABLE

| Component        | File                                            | Responsibility                                     |
| ---------------- | ----------------------------------------------- | -------------------------------------------------- |
| **Page**         | `/src/app/onboarding/page.tsx`                  | Orchestration, state, navigation, submission       |
| **Welcome**      | `/src/components/onboarding/WelcomeStep.tsx`    | Greeting + "begin" button                          |
| **BasicInfo**    | `/src/components/onboarding/BasicInfoStep.tsx`  | Headline + location inputs                         |
| **Skills**       | `/src/components/onboarding/SkillsStep.tsx`     | Add skills via tag input                           |
| **Goals**        | `/src/components/onboarding/GoalsStep.tsx`      | Vision + target roles                              |
| **Finalizing**   | `/src/components/onboarding/FinalizingStep.tsx` | Loading state                                      |
| **Hook**         | `/src/hooks/useProfile.ts`                      | React Query mutation for submission                |
| **API Client**   | `/src/integrations/api/profile.ts`              | HTTP PUT to `/api/v1/profile/onboarding`           |
| **Backend**      | `/services/core-api/src/routes/profile.ts`      | PUT handler, validation, Stripe setup, DB update   |
| **Guard**        | `/src/components/auth/OnboardingGuard.tsx`      | Enforce onboarding completion before dashboard     |
| **Types**        | `/src/lib/types.ts`                             | Frontend types (OnboardingData, OnboardingStepKey) |
| **DB Schema**    | `/supabase/migrations/...sql`                   | user_profiles columns & indexes                    |
| **Translations** | `/public/locales/en/translation.json`           | All copy & labels                                  |

---

## NEXT STEPS (If Implementing Fixes)

1. **Add Full Name Capture**: Modify BasicInfoStep to include full name input
2. **Fix Error Redirect**: Change `setCurrentStepIndex(currentStepIndex)` to `setCurrentStepIndex(currentStepIndex - 1)`
3. **Add Error Handling for Stripe**: Consider graceful degradation if Stripe customer creation fails
4. **Add Auto-Save**: Optionally implement localStorage or backend draft auto-save
5. **Add Skills Index**: If needed for search/filtering performance
6. **Test Edge Cases**: Browser close mid-flow, slow networks, auth timeouts

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Status**: Complete architecture analysis
