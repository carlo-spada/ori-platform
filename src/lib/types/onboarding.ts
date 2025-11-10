/**
 * Revolutionary Onboarding Types
 * Progressive disclosure with rich data capture
 */

// User status types
export type UserStatus = 'student' | 'professional' | 'transitioning' | 'exploring'

// Timeline options in months
export type TimelineMonths = 6 | 12 | 24 | 36 | 60

// Work style preferences
export interface WorkStyles {
  remote?: number // 0-10 scale
  async?: number
  collaborative?: number
  independent?: number
  structured?: number
  flexible?: number
}

// Skill with proficiency level
export interface SkillLevel {
  name: string
  level: number // 1-10
}

// Success metrics based on role type
export interface SuccessMetrics {
  salaryTarget?: number
  impactScope?: 'team' | 'department' | 'company' | 'industry'
  teamSize?: number
  technicalDepth?: number // 1-10
  leadershipScope?: number // 1-10
}

// Complete onboarding data structure
export interface OnboardingData {
  // Step 0: Identity
  identity: {
    fullName: string
    preferredName: string
    profilePhotoUrl?: string
  }

  // Step 1: Context
  context: {
    currentStatus: UserStatus
    yearsExperience: number
    location: string
    isRemoteOpen: boolean
  }

  // Professional Import (optional)
  import?: {
    cvUrl?: string
    linkedinUrl?: string
    importedData?: any // Parsed CV/LinkedIn data
  }

  // Step 2: Expertise
  expertise: {
    skills: string[]
    skillLevels?: Record<string, number> // {"React": 8, "Python": 6}
    hiddenTalents?: string[]
  }

  // Step 3: Aspirations
  aspirations: {
    dreamRole?: string
    timelineMonths?: TimelineMonths
    successMetrics?: SuccessMetrics
    longTermVision?: string
    targetRoles?: string[]
  }

  // Step 4: Preferences
  preferences: {
    workStyles?: WorkStyles
    cultureValues?: string[] // Ordered by preference
    dealBreakers?: string[]
    industries?: string[]
  }
}

// Session state for persistence
export interface OnboardingSession {
  id: string
  userId: string
  currentStep: number
  completedSteps: number[]
  formData: Partial<OnboardingData>
  startedAt: Date
  lastSavedAt: Date
  completedAt?: Date
  abandonedAt?: Date
  deviceInfo?: any
  browserInfo?: any
  reminderSentAt?: Date
  reminderCount: number
}

// Analytics event for tracking
export interface OnboardingAnalyticsEvent {
  id: string
  sessionId: string
  userId: string
  eventType: 'step_started' | 'step_completed' | 'field_changed' | 'abandoned' | 'resumed' | 'imported_cv' | 'imported_linkedin'
  stepName?: string
  fieldName?: string
  timeOnStep?: number
  totalSessionTime?: number
  oldValue?: any
  newValue?: any
  validationErrors?: string[]
  createdAt: Date
}

// User profile after onboarding
export interface UserProfile {
  id: string
  userId: string

  // Identity
  fullName?: string
  preferredName?: string
  profilePhotoUrl?: string

  // Context
  currentStatus?: UserStatus
  yearsExperience?: number
  location?: string
  isRemoteOpen?: boolean

  // Professional
  cvUrl?: string
  linkedinUrl?: string
  importedData?: any

  // Expertise
  skills?: string[]
  skillLevels?: Record<string, number>
  hiddenTalents?: string[]

  // Aspirations
  dreamRole?: string
  timelineMonths?: TimelineMonths
  successMetrics?: SuccessMetrics
  longTermVision?: string
  targetRoles?: string[]

  // Preferences
  workStyles?: WorkStyles
  cultureValues?: string[]
  dealBreakers?: string[]
  industries?: string[]

  // Subscription
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  subscriptionTier?: 'free' | 'plus' | 'pro'
  subscriptionStatus?: 'active' | 'cancelled' | 'expired' | 'trialing'

  // Metadata
  onboardingCompleted: boolean
  onboardingVersion?: number
  profileCompleteness: number // 0-100
  featuresUnlocked?: string[]
  createdAt: Date
  updatedAt: Date
  lastSeenAt?: Date
}

// Skill suggestion from AI
export interface SkillSuggestion {
  id: string
  role: string
  experienceLevel?: string
  suggestedSkills: string[]
  industry?: string
  relevanceScore: number
}

// Step configuration for dynamic flow
export interface OnboardingStepConfig {
  id: string
  title: string
  subtitle?: string
  description?: string
  fields: OnboardingFieldConfig[]
  isRequired: boolean
  isSkippable: boolean
  unlockAt?: number // Profile completeness threshold
}

// Field configuration for dynamic forms
export interface OnboardingFieldConfig {
  name: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'slider' | 'tags' | 'upload' | 'import'
  label: string
  placeholder?: string
  helpText?: string
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
    custom?: (value: any) => string | null // Returns error message or null
  }
  options?: Array<{ value: string; label: string; description?: string }>
  aiSuggestions?: boolean
  conditionalShow?: (data: Partial<OnboardingData>) => boolean
}

// Progress state
export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  percentComplete: number
  canProceed: boolean
  canGoBack: boolean
  isLastStep: boolean
}

// Validation result
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  warnings?: Record<string, string>
}

// Step component props
export interface StepComponentProps {
  data: Partial<OnboardingData>
  onChange: (updates: Partial<OnboardingData>) => void
  onValidate?: () => ValidationResult
  onNext?: () => void
  onBack?: () => void
  onSkip?: () => void
  isLoading?: boolean
  errors?: Record<string, string>
}

// Welcome back state for returning users
export interface WelcomeBackState {
  lastStepName: string
  percentComplete: number
  timeAway: string // "2 hours ago", "yesterday", etc.
  message: string
}

// Feature unlock thresholds
export const FEATURE_UNLOCK_THRESHOLDS = {
  basicMatching: 30, // 30% complete to see job matches
  aiRecommendations: 50, // 50% for AI recommendations
  premiumInsights: 70, // 70% for advanced insights
  fullAccess: 90, // 90% for all features
} as const

// Step order
export const ONBOARDING_STEPS = [
  'identity',
  'context',
  'expertise',
  'aspirations',
  'preferences',
  'activation',
] as const

export type OnboardingStepKey = typeof ONBOARDING_STEPS[number]