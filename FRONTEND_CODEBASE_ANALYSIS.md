---
title: Ori Platform Frontend Codebase Analysis
date: 2025-11-13
type: technical-documentation
scope: frontend-architecture
completeness: exhaustive
---

# Ori Platform Frontend - Comprehensive Analysis

This document provides an exhaustive analysis of the Ori Platform frontend codebase located at `/Users/carlo/Desktop/Projects/ori-platform/src/`.

## Table of Contents

1. [API Endpoints Used](#1-api-endpoints-used)
2. [Data Models](#2-data-models)
3. [UI Components Inventory](#3-ui-components-inventory)
4. [State Management Patterns](#4-state-management-patterns)
5. [Routing Structure](#5-routing-structure)
6. [Authentication Flow](#6-authentication-flow)
7. [Integration Points](#7-integration-points)
8. [Architectural Summary](#8-architectural-summary)

---

## 1. API Endpoints Used

All API client functions are located in `/src/integrations/api/` and follow a consistent pattern:
- Authentication via Supabase JWT tokens
- Base URL: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`)
- Error handling with structured error responses

### 1.1 Profile API (`/src/integrations/api/profile.ts`)

#### GET /api/v1/profile
**Purpose**: Fetch user profile  
**Request**: Headers with JWT token  
**Response**: `UserProfile` object  
**Used By**: `useProfile()` hook

```typescript
interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  headline?: string
  location?: string
  about?: string
  skills?: string[]
  target_roles?: string[]
  long_term_vision?: string
  onboarding_completed?: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at?: string
  updated_at?: string
}
```

#### PUT /api/v1/profile
**Purpose**: Update user profile  
**Request**: Partial `UserProfile` object  
**Response**: Updated `UserProfile`  
**Used By**: `useUpdateProfile()` hook

#### PUT /api/v1/profile/onboarding
**Purpose**: Complete onboarding and create initial profile  
**Request**: Onboarding data transformed to profile fields  
**Response**: `UserProfile` with `onboarding_completed: true`  
**Used By**: `useCompleteOnboarding()` hook

#### GET /api/v1/experiences
**Purpose**: Fetch all work experiences  
**Response**: `{ experiences: Experience[] }`  
**Used By**: `useExperiences()` hook

#### POST /api/v1/experiences
**Purpose**: Create new experience  
**Request**: Experience data (without id, user_id, timestamps)  
**Response**: Created `Experience`  
**Used By**: `useCreateExperience()` hook

#### PUT /api/v1/experiences/:id
**Purpose**: Update experience  
**Request**: Partial `Experience` data  
**Response**: Updated `Experience`  
**Used By**: `useUpdateExperience()` hook

#### DELETE /api/v1/experiences/:id
**Purpose**: Delete experience  
**Used By**: `useDeleteExperience()` hook

#### GET /api/v1/education
**Purpose**: Fetch all education records  
**Response**: `{ education: Education[] }`  
**Used By**: `useEducation()` hook

#### POST /api/v1/education
**Purpose**: Create education record  
**Used By**: `useCreateEducation()` hook

#### PUT /api/v1/education/:id
**Purpose**: Update education record  
**Used By**: `useUpdateEducation()` hook

#### DELETE /api/v1/education/:id
**Purpose**: Delete education record  
**Used By**: `useDeleteEducation()` hook

---

### 1.2 Applications API (`/src/integrations/api/applications.ts`)

#### GET /api/v1/applications
**Purpose**: Fetch user's job applications  
**Query Params**: `status` (optional filter)  
**Response**: `{ applications: Application[] }`  
**Used By**: `useApplications()` hook

#### GET /api/v1/applications/stats
**Purpose**: Get application statistics  
**Response**: 
```typescript
{
  total: number
  applied: number
  interviewing: number
  offers: number
  rejected: number
  paused: number
}
```
**Used By**: `useApplicationStats()` hook

#### POST /api/v1/applications
**Purpose**: Create new application  
**Request**:
```typescript
{
  job_title: string
  company: string
  location?: string
  job_url?: string
  status: ApplicationStatus
  notes?: string
}
```
**Used By**: `useCreateApplication()` hook

#### PUT /api/v1/applications/:id
**Purpose**: Update application  
**Request**: Partial `Application` data  
**Used By**: `useUpdateApplication()` hook

#### PATCH /api/v1/applications/:id/status
**Purpose**: Quick status update  
**Request**: `{ status: ApplicationStatus }`  
**Used By**: `useUpdateApplicationStatus()` hook

#### DELETE /api/v1/applications/:id
**Purpose**: Delete application  
**Used By**: `useDeleteApplication()` hook

---

### 1.3 Jobs/Recommendations API (`/src/integrations/api/jobs.ts`)

#### POST /api/v1/jobs/find-matches
**Purpose**: Fetch AI-powered job recommendations  
**Request**:
```typescript
{
  userId: string
  limit?: number  // default 6
  filters?: {
    location?: string
    workType?: 'remote' | 'hybrid' | 'onsite'
    salaryMin?: number
  }
}
```
**Response**:
```typescript
{
  matches: Array<{
    id: string
    title: string
    company: string
    location: string
    description?: string
    salary_min?: number
    salary_max?: number
    work_type?: 'remote' | 'hybrid' | 'onsite'
    matchScore: number
    keyMatches: string[]
    reasoning?: string
    skills_analysis?: Array<{
      name: string
      status: 'matched' | 'missing'
    }>
    skillsGap?: {
      userSkills: string[]
      requiredSkills: string[]
      missingSkills: string[]
    }
    posted_date?: string
    created_at: string
  }>
  usage: {
    used: number
    limit: number
  }
}
```
**Used By**: Recommendations page query

---

### 1.4 Dashboard API (`/src/integrations/api/dashboard.ts`)

#### GET /api/v1/dashboard
**Purpose**: Fetch dashboard statistics and recent activity  
**Response**:
```typescript
{
  stats: {
    activeApplications: number
    jobRecommendations: number
    skillsAdded: number
    profileCompletion: number
  }
  recentActivity: Array<{
    id: string
    type: 'application' | 'skill' | 'favorite' | 'profile'
    title: string
    subtitle: string
    timestamp: string
  }>
}
```
**Used By**: Dashboard page

---

### 1.5 Chat API (`/src/integrations/api/chat.ts`)

#### GET /api/v1/chat/history
**Purpose**: Fetch conversation history  
**Response**:
```typescript
{
  conversation: {
    id: string
    user_id: string
    created_at: string
    updated_at: string
  } | null
  messages: Array<{
    id: string
    conversation_id: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
  }>
}
```
**Used By**: Dashboard chat component

#### POST /api/v1/chat/message
**Purpose**: Send message to AI assistant  
**Request**:
```typescript
{
  content: string
  conversation_id?: string  // for continuing conversation
}
```
**Response**:
```typescript
{
  message: ChatMessage
  conversation_id: string
}
```
**Used By**: Dashboard chat component

---

### 1.6 Payments API (`/src/integrations/api/payments.ts`)

#### POST /api/v1/setup-intent
**Purpose**: Create Stripe Setup Intent for payment method  
**Request**: `{ planId: string }`  
**Response**:
```typescript
{
  clientSecret: string
  setupIntentId: string
}
```
**Used By**: Payment flow

#### POST /api/v1/subscriptions
**Purpose**: Create subscription after payment method confirmed  
**Request**:
```typescript
{
  planId: string
  paymentMethodId: string
}
```
**Response**: `{ subscriptionId: string }`  
**Used By**: Subscription flow

---

### 1.7 Beta Testers API (`/src/integrations/api/betaTesters.ts`)

#### POST /api/v1/beta-testers
**Purpose**: Submit email for beta waitlist  
**Request**:
```typescript
{
  email: string
  firstName?: string
  source?: 'signup' | 'login' | 'landing'
}
```
**Response**:
```typescript
{
  message: string
  alreadyExists?: boolean
  data?: {
    id: string
    email: string
    first_name?: string
    source: string
    created_at: string
  }
}
```
**Used By**: Early access modal

---

## 2. Data Models

### 2.1 Core User Models

#### User (Supabase Auth)
```typescript
interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}
```

#### UserProfile (Database)
```typescript
interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  headline?: string
  location?: string
  about?: string
  skills?: string[]
  target_roles?: string[]
  long_term_vision?: string
  onboarding_completed?: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?: string
  created_at?: string
  updated_at?: string
}
```

#### Experience
```typescript
interface Experience {
  id: string
  user_id: string
  company: string
  role: string
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}
```

#### Education
```typescript
interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study?: string | null
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}
```

---

### 2.2 Job & Application Models

#### Application
```typescript
interface Application {
  id: string
  user_id: string
  job_title: string
  company: string
  location?: string | null
  job_url?: string | null
  application_date: string
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'paused'
  notes?: string | null
  last_updated: string
  created_at: string
}
```

#### JobMatch (from AI recommendations)
```typescript
interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  description?: string
  salary_min?: number
  salary_max?: number
  work_type?: 'remote' | 'hybrid' | 'onsite'
  matchScore: number
  keyMatches: string[]
  reasoning?: string
  skills_analysis?: Array<{
    name: string
    status: 'matched' | 'missing'
  }>
  skillsGap?: {
    userSkills: string[]
    requiredSkills: string[]
    missingSkills: string[]
  }
  posted_date?: string
  created_at: string
}
```

---

### 2.3 Chat Models

#### ChatMessage
```typescript
interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
```

#### Conversation
```typescript
interface Conversation {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  summary?: string
  messages?: ChatMessage[]
}
```

---

### 2.4 Onboarding Models (v2)

#### OnboardingData (Progressive Disclosure)
```typescript
interface OnboardingData {
  identity: {
    fullName: string
    preferredName: string
    profilePhotoUrl?: string
  }
  context: {
    currentStatus: 'student' | 'professional' | 'transitioning' | 'exploring'
    yearsExperience: number
    location: string
    isRemoteOpen: boolean
  }
  import?: {
    cvUrl?: string
    linkedinUrl?: string
    importedData?: any
  }
  expertise: {
    skills: string[]
    skillLevels?: Record<string, number>  // {"React": 8}
    hiddenTalents?: string[]
  }
  aspirations: {
    dreamRole?: string
    timelineMonths?: 6 | 12 | 24 | 36 | 60
    successMetrics?: {
      salaryTarget?: number
      impactScope?: 'team' | 'department' | 'company' | 'industry'
      teamSize?: number
      technicalDepth?: number
      leadershipScope?: number
    }
    longTermVision?: string
    targetRoles?: string[]
  }
  preferences: {
    workStyles?: {
      remote?: number  // 0-10 scale
      async?: number
      collaborative?: number
      independent?: number
    }
    cultureValues?: string[]
    dealBreakers?: string[]
    industries?: string[]
  }
}
```

#### OnboardingSession (Persistence)
```typescript
interface OnboardingSession {
  id: string
  userId: string
  currentStep: number
  completedSteps: number[]
  formData: Partial<OnboardingData>
  startedAt: Date
  lastSavedAt: Date
  completedAt?: Date
  reminderSentAt?: Date
  reminderCount: number
}
```

---

### 2.5 UI-Specific Models

#### DashboardStats
```typescript
interface DashboardStats {
  activeApplications: number
  jobRecommendations: number
  skillsAdded: number
  profileCompletion: number
}
```

#### ActivityItem
```typescript
interface ActivityItem {
  id: string
  type: 'application' | 'skill' | 'favorite' | 'profile'
  title: string
  subtitle: string
  timestamp: string
}
```

---

## 3. UI Components Inventory

### 3.1 Authentication Components (`/src/components/auth/`)

#### OnboardingGuard.tsx
**Purpose**: Route guard that redirects users to onboarding if not completed  
**State**: Uses `useAuth()` and `useProfile()` hooks  
**Logic**:
- Checks if `profile.onboarding_completed === true`
- Redirects to `/select-plan` → `/onboarding` if false
- Allows public routes and onboarding routes without checks
- Shows loading spinner during auth/profile fetch

#### SocialAuthButtons.tsx
**Purpose**: Google & Apple OAuth buttons  
**Props**: `mode: 'login' | 'signup'`  
**Integration**: Uses `useAuth()` context for `signInWithGoogle()`, `signInWithApple()`

---

### 3.2 Application Shell (`/src/components/app/`)

#### AppShell.tsx
**Purpose**: Main layout wrapper for authenticated app  
**Structure**:
- Desktop: Sidebar (md+) + Content area
- Mobile: Content area + Bottom nav
- Full-screen, no-scroll PWA design

#### SidebarNav.tsx
**Purpose**: Desktop/tablet vertical navigation  
**Features**:
- Logo/brand at top
- Navigation items from `NAV_ITEMS` config
- Active state highlighting
- User profile section at bottom
- Logout button

#### BottomNav.tsx
**Purpose**: Mobile bottom navigation bar  
**Features**:
- Fixed to bottom on mobile (hidden md+)
- Icon-based navigation
- Active state indication

---

### 3.3 Dashboard Components (`/src/components/dashboard/`)

#### DashboardHeader.tsx
**Purpose**: Welcome header with user greeting  
**Props**: `userName: string`  
**Display**: "Welcome back, {userName}!"

#### QuickStats.tsx
**Purpose**: 4-card statistics grid  
**Props**: 
```typescript
{
  activeApplications: number
  jobRecommendations: number
  skillsAdded: number
  profileCompletion: number
}
```
**Layout**: Responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop)

#### WhatsNextCard.tsx
**Purpose**: Actionable next steps card  
**Props**:
```typescript
{
  title: string
  message: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}
```

#### RecentActivity.tsx
**Purpose**: Timeline of user actions  
**Props**: `activities: ActivityItem[]`  
**Display**: Chronological list with icons by activity type

---

### 3.4 Chat Component (`/src/components/chat/`)

#### ChatWindow.tsx
**Purpose**: Real-time AI assistant chat interface  
**Props**:
```typescript
{
  messages: ChatMessage[]
  onSend?: (message: string) => void
  isLoading?: boolean
}
```
**Features**:
- Gradient card design with glow effect
- Auto-scroll to latest message
- User/assistant avatars
- Textarea input with Enter-to-send
- Empty state with call-to-action
- Loading state with animated sparkles

**State Management**:
- Optimistic updates on message send
- React Query for history fetching
- Mutation for sending messages

---

### 3.5 Profile Components (`/src/components/profile/`)

#### ProfileTabs.tsx
**Purpose**: Tab navigation for profile sections  
**Tabs**: Profile | Qualifications | Goals  
**Props**: `activeTab`, `onTabChange`, `labels`

#### ProfileForm.tsx
**Purpose**: Basic profile information form  
**Fields**:
- Full Name (editable)
- Email (read-only, from auth)
- Headline (optional)
- Location (optional)
- About (textarea, optional)
**Actions**: Save button with loading state

#### QualificationsSection.tsx
**Purpose**: Skills, experiences, and education management  
**Features**:
- Skills: Tag-based input with add/remove
- Experiences: CRUD operations with modal forms
- Education: CRUD operations with modal forms
- Empty states for each section

#### ExperienceForm.tsx
**Purpose**: Modal form for adding/editing experience  
**Fields**: Company, Role, Start Date, End Date, Is Current, Description  
**Validation**: Required fields marked

#### EducationForm.tsx
**Purpose**: Modal form for adding/editing education  
**Fields**: Institution, Degree, Start Date, End Date, Is Current, Description

#### GoalsSection.tsx
**Purpose**: Career goals and aspirations form  
**Fields**:
- Long-term Vision (textarea)
- Target Roles (tag input)
- Milestones (list, not in DB yet)

---

### 3.6 Recommendations Components (`/src/components/recommendations/`)

#### JobRecommendationCard.tsx
**Purpose**: Display single job match with AI analysis  
**Props**: `job: JobRecommendation`, `labels`  
**Features**:
- Match score badge
- Company, location, date posted
- Skills gap visualization via `SkillsGapDisplay`
- Apply and View Details buttons

#### SkillsGapDisplay.tsx
**Purpose**: Visual breakdown of skill matching  
**Props**: 
```typescript
{
  skillsGap?: SkillsGap
  skills?: Skill[]  // Legacy format
}
```
**Display**: 
- Matched skills (green badges)
- Missing skills (yellow/red badges)
- Expandable/collapsible

#### CareerAdviceCard.tsx
**Purpose**: Display career advice article  
**Props**: `advice: CareerAdvice`, `labels`  
**Display**: Title, summary, category badge, "Learn More" link

#### OriAnalysisCard.tsx
**Purpose**: AI-generated insights on job match  
**Usage**: Currently unused, planned feature

#### AuraAnalysisCard.tsx
**Purpose**: Cultural fit analysis  
**Usage**: Currently unused, planned feature

---

### 3.7 Applications Components (`/src/components/applications/`)

#### ApplicationTable.tsx
**Purpose**: Responsive table/card list of applications  
**Features**:
- Desktop: Table with all columns
- Mobile: Card-based layout
- Status dropdown for quick updates
- View Details button
- Formatted dates (relative time)

#### ApplicationStatusBadge.tsx
**Purpose**: Colored badge for application status  
**Variants**:
- Applied: blue
- Interviewing: yellow
- Offer: green
- Rejected: red
- Paused: gray

#### EmptyApplicationsState.tsx
**Purpose**: Empty state when no applications  
**Display**: Illustration, message, CTA to improve profile

---

### 3.8 Onboarding Components (v1 - Legacy)

Located in `/src/components/onboarding/`:

#### WelcomeStep.tsx
**Purpose**: Welcome screen with personalized greeting

#### BasicInfoStep.tsx
**Purpose**: Collect headline and location

#### SkillsStep.tsx
**Purpose**: Tag-based skill input (min 3 required)

#### GoalsStep.tsx
**Purpose**: Long-term vision and target roles

#### FinalizingStep.tsx
**Purpose**: Loading/success screen during profile creation

---

### 3.9 Onboarding Components (v2 - Advanced)

Located in `/src/components/onboarding/v2/`:

#### IdentityStep.tsx
**Purpose**: Full name, preferred name, photo upload

#### ContextStep.tsx
**Purpose**: Current status, years experience, location, remote preference

#### ExpertiseStep.tsx
**Purpose**: Skills with proficiency levels (1-10), hidden talents

#### AspirationsStep.tsx
**Purpose**: Dream role, timeline, success metrics, long-term vision

#### PreferencesStep.tsx
**Purpose**: Work styles (sliders), culture values, deal breakers, industries

#### ActivationStep.tsx
**Purpose**: Profile generation success screen

#### ImportProfileDialog.tsx
**Purpose**: Modal for importing CV or LinkedIn data

---

### 3.10 Settings Components (`/src/components/settings/`)

#### AccountSettings.tsx
**Purpose**: Email, password, data export, logout, delete account  
**Features**:
- Read-only email display
- "Change Password" button (planned)
- Export data button
- Logout button
- Danger zone with delete account modal

#### NotificationSettings.tsx
**Purpose**: Email notification preferences  
**Fields**:
- New job recommendations (toggle)
- Application status updates (toggle)
- Insights and tips (toggle)
**Actions**: Save button

#### BillingSettings.tsx
**Purpose**: Subscription and payment management  
**Display**:
- Current plan name
- Billing cycle
- Next billing date & amount
- Payment method summary
**Actions**: Change plan, update payment, view history, cancel subscription

#### DeleteAccountModal.tsx
**Purpose**: Confirmation modal for account deletion  
**Security**: Requires typing email to confirm

---

### 3.11 Landing Page Components (`/src/components/landing/`)

#### HeroSection.tsx
**Purpose**: Hero with headline, CTA, illustration  
**CTA**: Sign up / Login buttons (trigger early access modal)

#### ValuePropositionSection.tsx
**Purpose**: 3-column feature highlights

#### HowItWorksSection.tsx
**Purpose**: Step-by-step onboarding preview

#### SocialProofSection.tsx
**Purpose**: Testimonials/user quotes

#### FAQSection.tsx
**Purpose**: Accordion-based FAQ

#### BottomCTASection.tsx
**Purpose**: Final CTA before footer

#### Illustration.tsx
**Purpose**: Reusable SVG illustrations

---

### 3.12 Layout Components (`/src/components/layout/`)

#### PublicLayout.tsx
**Purpose**: Layout wrapper for marketing pages  
**Structure**: Header + Main Content + Footer

#### SharedHeader.tsx
**Purpose**: Navigation header for public pages  
**Features**: Logo, nav links, language switcher, CTA buttons

#### SharedFooter.tsx
**Purpose**: Site footer with links  
**Sections**: Product, Company, Legal, Social

#### LanguageSwitcher.tsx
**Purpose**: Dropdown for locale selection  
**Integration**: Uses i18next

---

### 3.13 Payments Components (`/src/components/payments/`)

#### PaymentForm.tsx
**Purpose**: Stripe Elements payment form  
**Features**:
- Card input (Stripe Element)
- Payment method submission
- Error handling
- Loading states

---

### 3.14 Pricing Components (`/src/components/pricing/`)

#### PricingCard.tsx
**Purpose**: Subscription tier card  
**Props**: Tier details (name, price, features, highlighted)  
**Features**: Monthly/yearly toggle, feature list, CTA button

#### FeatureComparisonTable.tsx
**Purpose**: Side-by-side tier comparison  
**Display**: Table with checkmarks for included features

---

### 3.15 UI Primitives (`/src/components/ui/`)

**shadcn/ui components** (customized with Ori theme):
- Accordion, Alert, AlertDialog, Avatar
- Badge, Breadcrumb, Button
- Calendar, Card, Carousel, Chart, Checkbox
- Collapsible, Command, ContextMenu
- Dialog, Drawer, DropdownMenu
- Form, HoverCard, Input, InputOTP, Label
- Menubar, Modal, NavigationMenu
- Pagination, Popover, Progress, RadioGroup
- Resizable, ScrollArea, Select, Separator
- Sheet, Sidebar, Skeleton, Slider
- Sonner (toast), Switch, Table, Tabs
- Textarea, Toast, Toggle, ToggleGroup, Tooltip

**Custom UI components**:
- Section.tsx: Container with max-width
- VisuallyHidden.tsx: Accessibility helper

---

## 4. State Management Patterns

### 4.1 React Query (TanStack Query)

**Configuration** (`/src/lib/react-query.ts`):
```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

**Hook Patterns** (`/src/hooks/`):

#### Profile Hooks (`useProfile.ts`)
```typescript
// Queries
useProfile()           // GET /api/v1/profile
useExperiences()       // GET /api/v1/experiences
useEducation()         // GET /api/v1/education

// Mutations (with cache invalidation)
useUpdateProfile()     // PUT /api/v1/profile
useCompleteOnboarding() // PUT /api/v1/profile/onboarding
useCreateExperience()  // POST /api/v1/experiences
useUpdateExperience()  // PUT /api/v1/experiences/:id
useDeleteExperience()  // DELETE /api/v1/experiences/:id
useCreateEducation()   // POST /api/v1/education
useUpdateEducation()   // PUT /api/v1/education/:id
useDeleteEducation()   // DELETE /api/v1/education/:id
```

**Cache Update Strategy**:
- Queries: Use `staleTime` to prevent excessive refetches
- Mutations: Call `queryClient.invalidateQueries()` to refetch
- Optimistic updates: Used in chat for instant UI feedback

#### Applications Hooks (`useApplications.ts`)
```typescript
useApplications(status?: string)
useApplicationStats()
useCreateApplication()
useUpdateApplication()
useUpdateApplicationStatus()
useDeleteApplication()
```

#### Other Hooks
```typescript
useBetaTesters()    // Beta waitlist submission
useEarlyAccess()    // Local storage state for early access modal
useIsMobile()       // Responsive breakpoint detection
```

---

### 4.2 React Context

#### AuthContext (`/src/contexts/AuthProvider.tsx`)
**Provides**:
```typescript
{
  session: Session | null
  user: User | null
  signUp: (email, password) => Promise
  signInWithPassword: (email, password) => Promise
  signInWithGoogle: () => Promise
  signInWithApple: () => Promise
  signOut: () => Promise
}
```
**State Source**: Supabase Auth  
**Listeners**: `onAuthStateChange` subscription  
**Usage**: `useAuth()` hook

#### OnboardingContext (`/src/contexts/OnboardingContext.tsx`)
**Note**: v2 onboarding only, not used in current v1 flow  
**Provides**:
```typescript
{
  data: Partial<OnboardingData>
  session: OnboardingSession | null
  progress: OnboardingProgress
  currentStep: OnboardingStepKey
  updateData: (updates) => void
  nextStep: () => Promise<void>
  previousStep: () => void
  skipStep: () => void
  validateCurrentStep: () => ValidationResult
  saveSession: () => Promise<void>
  loadSession: () => Promise<void>
  clearSession: () => Promise<void>
  isLoading: boolean
  isSaving: boolean
  errors: Record<string, string>
  welcomeBack: WelcomeBackState | null
}
```
**Features**:
- Auto-save to localStorage (2s debounce)
- Backend session persistence
- Validation per step
- Welcome back state for returning users

---

### 4.3 Local Component State

**Common Pattern**:
```typescript
// Form state
const [formData, setFormData] = useState<FormType>(initialValue)

// UI state
const [activeTab, setActiveTab] = useState<TabKey>('default')
const [isOpen, setIsOpen] = useState(false)

// Loading state (managed by React Query for API calls)
const { data, isLoading, error } = useQuery(...)
```

---

### 4.4 Form State Management

**No form library used** - Raw React state with controlled inputs:

```typescript
// Example from ProfileForm.tsx
const [formData, setFormData] = useState<ProfileFormValue>(initialValue)

const handleChange = (field: keyof ProfileFormValue, newValue: string) => {
  const updated = { ...formData, [field]: newValue }
  setFormData(updated)
  onChange?.(updated)  // Notify parent
}

const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  onSubmit?.()  // Trigger mutation
}
```

**Validation**: Ad-hoc in components, no schema validation library

---

## 5. Routing Structure

### 5.1 App Router (Next.js 14+)

**File-based routing** in `/src/app/`

#### Public Marketing Routes

```
/                           → Landing page (HeroSection, ValueProp, etc.)
/about                      → About page
/pricing                    → Pricing plans
/blog                       → Blog index
/blog/[slug]                → Individual blog post
/features                   → Features overview
/journey                    → User journey/how it works
/contact                    → Contact form
/legal/privacy-policy       → Privacy policy
/legal/terms-of-service     → Terms of service
/legal/cookie-policy        → Cookie policy
```

#### Authentication Routes

```
/login                      → Email/password + social auth
/signup                     → Registration form
/auth/callback              → OAuth callback handler (route.ts)
```

#### Onboarding Routes

```
/select-plan                → Plan selection after signup
/onboarding                 → v1 onboarding flow (5 steps)
/onboarding/v2              → v2 onboarding (6 steps, not active)
```

#### Protected App Routes

**All under `/app/` prefix** (rewritten from app subdomain in production):

```
/app/dashboard              → Dashboard with stats, chat, quick actions
/app/profile                → Profile & Goals (3 tabs)
/app/recommendations        → Job matches (AI-powered) + Career advice
/app/applications           → Application tracking table
/app/settings               → Account, Notifications, Billing
```

---

### 5.2 Route Protection

**Guard**: `OnboardingGuard` wrapper in `app/layout.tsx`

**Logic**:
1. Public routes: Always accessible
2. Auth routes (/login, /signup): Accessible, redirect if already logged in
3. Onboarding routes: Accessible even if onboarding incomplete
4. Protected routes: Require auth + `profile.onboarding_completed === true`

**Redirect Flow**:
```
User signs up
  → Email verification (Supabase)
  → Redirected to /select-plan
  → Redirected to /onboarding
  → onboarding_completed = true
  → Can access /app/* routes
```

---

### 5.3 Subdomain Routing (`/src/proxy.ts`)

**Middleware** for production subdomain handling:

**Rules**:
- `getori.app` → Marketing site (landing, about, pricing, blog)
- `app.getori.app` → Authenticated app routes
- Localhost: All routes accessible on single domain

**Redirects**:
- `/app/*` on main domain → `app.getori.app/*` (removes `/app` prefix)
- Marketing pages on app subdomain → `www.getori.app`
- `/` on app subdomain → `/dashboard`

**Rewrites** (internal, no URL change):
- `app.getori.app/dashboard` → `/app/dashboard` (file path)
- `app.getori.app/profile` → `/app/profile`

---

## 6. Authentication Flow

### 6.1 Supabase Auth Integration

**Client Setup** (`/src/integrations/supabase/client.ts`):
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

**Singleton Pattern**: `getSupabaseClient()` ensures one instance

---

### 6.2 Auth Methods

#### Email/Password Signup
```typescript
supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
})
```

#### Email/Password Login
```typescript
supabase.auth.signInWithPassword({ email, password })
```

#### Google OAuth
```typescript
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
})
```

#### Apple OAuth
```typescript
supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

---

### 6.3 Session Management

**Auth State Listener** in `AuthProvider.tsx`:
```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    }
  )

  // Check for existing session on mount
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    setUser(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}, [])
```

**Session Persistence**: Supabase handles localStorage automatically

---

### 6.4 JWT Token Usage

**Pattern in API clients**:
```typescript
async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) throw new Error('No active session')
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  }
}
```

**Used by**: All API endpoints that require authentication

---

### 6.5 Profile Creation Flow

1. User signs up → Supabase creates auth user
2. **Database trigger** creates empty `user_profiles` row
3. User completes onboarding → `PUT /api/v1/profile/onboarding`
4. Backend sets `onboarding_completed: true`
5. `OnboardingGuard` allows access to protected routes

---

## 7. Integration Points

### 7.1 Supabase

**Client Location**: `/src/integrations/supabase/`

#### client.ts
- Singleton Supabase client
- Environment variable validation
- Browser-only initialization

#### types.ts
- Generated TypeScript types from Supabase schema
- Currently empty (no public schema exposed to frontend)

**Usage**:
- Auth (signup, login, OAuth, session)
- JWT token retrieval for API calls
- **Not used for direct database queries** (all via core-api)

---

### 7.2 Stripe

**Client Location**: `/src/lib/stripe.ts`

#### Lazy Loading Pattern
```typescript
let _stripePromise: Promise<Stripe | null> | null = null

export const getStripe = (): Promise<Stripe | null> => {
  if (_stripePromise) return _stripePromise
  
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) throw new Error('Stripe key not set')
  
  _stripePromise = loadStripe(key)
  return _stripePromise
}
```

**Integration**: `Elements` provider in `app/providers.tsx`

**Components Using Stripe**:
- `PaymentForm.tsx`: Card element, payment method submission
- Billing flow: Setup Intent → Subscription creation

---

### 7.3 React Query

**Client**: `/src/lib/react-query.ts`  
**Provider**: `app/providers.tsx`

**Query Keys Convention**:
```typescript
['profile']                    // User profile
['experiences']                // All experiences
['education']                  // All education
['applications']               // All applications
['applications', status]       // Filtered applications
['applications', 'stats']      // Application statistics
['dashboard']                  // Dashboard data
['chat-history']               // Chat messages
['jobRecommendations', userId] // Job matches
```

---

### 7.4 i18next (Internationalization)

**Config**: `/src/i18n.ts`

**Features**:
- Browser language detection
- Fallback to English
- Namespace support (not currently used)
- LocalStorage persistence

**Usage**:
```typescript
const { t } = useTranslation()
t('dashboardPage.header.title')
```

**Translation Keys**: All hardcoded in components, no separate JSON files yet

---

### 7.5 Tailwind CSS + shadcn/ui

**Config**: `tailwind.config.ts`  
**Theme**: Dark mode by default, custom accent colors

**CSS Variables** (`globals.css`):
```css
--background: 0 0% 5%
--foreground: 0 0% 98%
--card: 0 0% 7%
--accent: 142 76% 36%
--primary: 142 76% 36%
--muted: 0 0% 15%
--border: 0 0% 14.9%
```

**Component Library**: shadcn/ui (Radix UI primitives + Tailwind)

---

### 7.6 Vercel Analytics & Speed Insights

**Integration**: `app/layout.tsx`

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
```

**Usage**: Automatic performance tracking in production

---

### 7.7 PWA Support

**Manifest**: `/public/manifest.webmanifest`

**Features**:
- Installable web app
- Full-screen mode (`display: "standalone"`)
- App icon variants
- iOS-specific meta tags

---

## 8. Architectural Summary

### 8.1 Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| UI Library | React 18 |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | React Query + React Context |
| Auth | Supabase Auth (JWT) |
| Payments | Stripe Elements |
| API Client | Fetch API (no Axios) |
| i18n | react-i18next |
| Date Formatting | date-fns |
| Form Validation | Manual (no library) |
| Testing | Vitest + React Testing Library (setup, minimal tests) |

---

### 8.2 Architectural Patterns

#### 1. API Client Pattern
- **Location**: `/src/integrations/api/`
- **Pattern**: One file per resource (profile, applications, jobs, etc.)
- **Auth**: JWT from Supabase session in every request
- **Error Handling**: Throws errors, caught by React Query

#### 2. Hook-First Data Fetching
- **Pattern**: React Query hooks wrap API clients
- **Location**: `/src/hooks/`
- **Benefits**: Caching, loading states, error handling, optimistic updates
- **Cache Strategy**: Invalidate on mutations, 5-minute stale time

#### 3. Component Composition
- **Pattern**: Small, focused components with clear props
- **No prop drilling**: Context for global state (auth), props for local
- **Presentation vs Container**: Pages fetch data, components receive props

#### 4. Type Safety
- **Shared types**: `/shared/types/src/index.ts` (monorepo package)
- **Local types**: `/src/lib/types.ts` and `/src/lib/types/onboarding.ts`
- **API contracts**: TypeScript interfaces for request/response

#### 5. Progressive Enhancement
- **Mobile-first**: Responsive design with Tailwind breakpoints
- **PWA-ready**: Manifest, viewport config, full-screen support
- **Optimistic UI**: Chat messages appear instantly, rollback on error

#### 6. Subdomain Architecture
- **Production**: `getori.app` (marketing) + `app.getori.app` (app)
- **Development**: Single domain (`localhost:3000`)
- **Middleware**: `/src/proxy.ts` handles routing and rewrites

---

### 8.3 Data Flow

```
User Action (UI)
  ↓
Component Event Handler
  ↓
React Query Mutation (useCreateApplication, etc.)
  ↓
API Client Function (createApplication)
  ↓
Get JWT from Supabase (getAuthHeaders)
  ↓
HTTP Request to core-api (localhost:3001)
  ↓
Response
  ↓
React Query Cache Update (invalidateQueries)
  ↓
UI Re-render (automatic via React Query)
```

---

### 8.4 File Organization

```
src/
├── app/                        # Next.js App Router pages
│   ├── (public routes)/        # Landing, about, pricing, blog
│   ├── (auth routes)/          # Login, signup, callback
│   ├── (onboarding routes)/    # Select plan, onboarding v1/v2
│   ├── app/                    # Protected app routes
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── recommendations/
│   │   ├── applications/
│   │   └── settings/
│   ├── layout.tsx              # Root layout (providers, auth guard)
│   ├── providers.tsx           # React Query, Auth, Stripe providers
│   └── globals.css             # Tailwind + CSS variables
├── components/                 # React components
│   ├── ui/                     # shadcn/ui primitives
│   ├── app/                    # AppShell, SidebarNav, BottomNav
│   ├── auth/                   # OnboardingGuard, SocialAuthButtons
│   ├── dashboard/              # Dashboard-specific components
│   ├── profile/                # Profile forms and tabs
│   ├── recommendations/        # Job cards, advice cards
│   ├── applications/           # Application table
│   ├── settings/               # Settings forms
│   ├── onboarding/             # Onboarding steps (v1 and v2)
│   ├── chat/                   # ChatWindow
│   ├── landing/                # Landing page sections
│   ├── layout/                 # PublicLayout, headers, footers
│   ├── payments/               # Stripe payment form
│   └── pricing/                # Pricing cards
├── contexts/                   # React Context providers
│   ├── AuthProvider.tsx        # Supabase auth context
│   └── OnboardingContext.tsx   # v2 onboarding state (not active)
├── hooks/                      # Custom React hooks
│   ├── useProfile.ts           # Profile + experience + education
│   ├── useApplications.ts      # Applications CRUD
│   ├── useBetaTesters.ts       # Beta signup
│   ├── useEarlyAccess.ts       # Early access modal state
│   └── use-mobile.tsx          # Responsive breakpoint
├── integrations/               # External service integrations
│   ├── api/                    # API client functions
│   │   ├── profile.ts
│   │   ├── applications.ts
│   │   ├── jobs.ts
│   │   ├── dashboard.ts
│   │   ├── chat.ts
│   │   ├── payments.ts
│   │   └── betaTesters.ts
│   └── supabase/               # Supabase client
│       ├── client.ts
│       └── types.ts
├── lib/                        # Utility libraries
│   ├── types.ts                # Local TypeScript types
│   ├── types/onboarding.ts     # v2 onboarding types
│   ├── utils.ts                # cn() helper (clsx + twMerge)
│   ├── react-query.ts          # Query client config
│   ├── stripe.ts               # Stripe loader
│   ├── seo.ts                  # Meta tag helpers
│   └── navConfig.ts            # Navigation items config
├── i18n.ts                     # i18next configuration
└── proxy.ts                    # Subdomain routing middleware
```

---

### 8.5 Key Architectural Decisions

#### No Direct Database Access
- Frontend NEVER queries Supabase database directly
- All data flows through core-api (Express.js backend)
- Benefits: Authorization logic centralized, API contracts enforced

#### React Query for Server State
- Replaces Redux/Zustand for API data
- Built-in caching, refetching, optimistic updates
- Mutations invalidate queries automatically

#### Context for Client State
- Auth: User session, sign in/out methods
- Onboarding: Form state, step navigation (v2 only)
- UI state: Local component state (no global store)

#### No Form Library
- Controlled inputs with React state
- Manual validation (future: Zod schemas)
- Trade-off: More boilerplate, but no library overhead

#### TypeScript Everywhere
- Strict mode enabled
- No implicit `any`
- Shared types in monorepo package (`@ori/types`)

#### Mobile-First PWA
- Full-screen app experience
- Bottom nav on mobile, sidebar on desktop
- AppShell wrapper for consistent layout

#### Subdomain Separation (Production)
- Marketing: SEO-optimized, fast landing pages
- App: Authenticated, dynamic, real-time features
- Middleware handles routing transparently

---

### 8.6 Performance Optimizations

1. **React Query Caching**: 5-minute stale time reduces API calls
2. **Lazy Stripe Loading**: Only loads when payment flow accessed
3. **Code Splitting**: Next.js automatic route-based splitting
4. **Optimistic UI**: Chat messages, application status updates
5. **Image Optimization**: Next.js `<Image>` component
6. **Font Optimization**: Next.js font loading strategy

---

### 8.7 Testing Strategy

**Setup** (`/src/__tests__/setup.ts`):
- Vitest + React Testing Library
- jsdom environment
- Mock IntersectionObserver

**Coverage** (as of analysis):
- Example test file exists
- Most components lack tests
- API clients not mocked in components (uses real hooks)

**Pattern**:
```typescript
import { vi } from 'vitest'

vi.mock('@/integrations/api/profile', () => ({
  fetchProfile: vi.fn().mockResolvedValue({ id: '1', name: 'Test' })
}))
```

---

### 8.8 Known Limitations & Future Work

#### Limitations
1. **Validation**: No schema validation (Zod planned)
2. **Error Boundaries**: Not implemented (errors crash app)
3. **Loading States**: Inconsistent across pages
4. **i18n**: Translation keys hardcoded, no JSON files
5. **Testing**: Minimal test coverage
6. **Accessibility**: Not audited (ARIA labels present but incomplete)

#### Planned Features (from components)
- "Change Password" button (disabled)
- "Add Application" button (disabled)
- Beta warning modal (code exists, not shown)
- Onboarding v2 (advanced flow built but not active)
- OriAnalysisCard, AuraAnalysisCard (not used)

---

## Conclusion

The Ori Platform frontend is a **modern, type-safe Next.js application** built with:
- **React Query** for efficient server state management
- **Supabase Auth** for secure authentication
- **shadcn/ui** for consistent, accessible UI components
- **Progressive Web App** capabilities for mobile-first experience
- **Monorepo architecture** with shared types

The codebase follows clear patterns:
- API clients → React Query hooks → UI components
- Context for global state, props for local state
- Route protection via `OnboardingGuard`
- Subdomain routing for marketing vs app separation

All data flows through the core-api backend, with JWT authentication on every request. The frontend never directly accesses the database, maintaining a clean separation of concerns.

---

**Generated**: 2025-11-13  
**Codebase Version**: dev branch (commit 8fd3d18)  
**Lines of Code**: ~10,000+ TypeScript/TSX lines  
**Components**: 100+ React components  
**API Endpoints**: 30+ endpoints across 7 resource types
