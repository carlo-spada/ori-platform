// User related types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'plus' | 'premium'
  subscription_status: 'active' | 'trialing' | 'canceled' | 'past_due'
  stripe_customer_id?: string
  monthly_job_matches_limit: number
  monthly_job_matches_used: number
  badge_size?: number
  badge_frequency?: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  name?: string
  cv_url?: string
  headline?: string
  location?: string
  about?: string
  roles?: string[]
  target_roles?: string[]
  work_style?: 'remote' | 'hybrid' | 'onsite'
  industries?: string[]
  goal?: string
  long_term_vision?: string
  skills?: string[]
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  years_of_experience?: number
  willing_to_relocate?: boolean
  onboarding_completed?: boolean
  // Stripe billing fields
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?:
    | 'free'
    | 'plus_monthly'
    | 'plus_yearly'
    | 'premium_monthly'
    | 'premium_yearly'
    | 'past_due'
    | 'cancelled'
  created_at?: string
  updated_at?: string
}

// AI Analysis types
export interface AIAnalysis {
  summary: string
  pros: string[]
  cons: string[]
}

// Skills Gap Analysis types
export interface Skill {
  name: string
  status: 'matched' | 'missing' // Indicates if the user has this skill for the job
}

// Job related types
export interface Job {
  id: string
  title: string
  company: string
  location: string
  description?: string
  requirements?: string[]
  salary_min?: number
  salary_max?: number
  work_type?: 'remote' | 'hybrid' | 'onsite'
  highlights?: string[]
  match_score?: number
  ai_analysis?: AIAnalysis
  tags?: string[]
  posted_date?: string
  expires_date?: string
  created_at: string
  updated_at: string
}

export interface SkillsGap {
  userSkills: string[]
  requiredSkills: string[]
  missingSkills: string[]
}

export interface JobMatch extends Job {
  matchScore: number
  keyMatches: string[]
  reasoning?: string
  skills_analysis?: Skill[] // Array of skills with their match status
  skillsGap?: SkillsGap // Skills gap analysis from AI Engine
}

// Work Experience types
export interface Experience {
  id: string
  user_id: string
  company: string
  role: string
  start_date: string // ISO date string
  end_date?: string | null // ISO date string
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}

// Education types
export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study?: string | null
  start_date: string // ISO date string
  end_date?: string | null // ISO date string
  is_current: boolean
  description?: string | null
  created_at: string
  updated_at: string
}

// Application related types
export type ApplicationStatus =
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'paused'

export interface Application {
  id: string
  user_id: string
  job_title: string
  company: string
  location?: string | null
  job_url?: string | null
  application_date: string
  status: ApplicationStatus
  notes?: string | null
  last_updated: string
  created_at: string
  // Legacy fields for backward compatibility
  job_id?: string
  rating?: number
  applied?: boolean
  updated_at?: string
  job?: Job
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

// Subscription types
export interface SubscriptionTier {
  id: 'free' | 'plus' | 'premium'
  name: string
  price: number
  priceYearly: number
  features: string[]
  matchLimit: number
  highlighted?: boolean
}

// Preference types
export interface UserPreferences {
  desired_roles?: string[]
  industries?: string[]
  locations?: string[]
  salary_min?: number
  salary_max?: number
  work_type?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  visa_sponsorship_needed?: boolean
  willing_to_relocate?: boolean
}

// Onboarding types
export interface OnboardingData {
  step: number
  completed: boolean
  cv?: string // URL or base64 string instead of File
  preferences?: UserPreferences
  skills?: string[]
  profile?: Partial<UserProfile>
}

// Chat/Conversation types
export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  summary?: string
  messages?: ChatMessage[]
}

export interface ChatHistoryResponse {
  conversation: Conversation | null
  messages: ChatMessage[]
}

export interface SendMessageRequest {
  content: string
  conversation_id?: string
}

export interface SendMessageResponse {
  message: ChatMessage
  conversation_id: string
}

// Notification types
export type NotificationType =
  | 'welcome'
  | 'payment_failure'
  | 'card_expiring'
  | 'trial_ending'
  | 'subscription_confirmation'
  | 'recommendations'
  | 'application_status'

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'failed'
  | 'bounced'
  | 'complained'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  subject: string
  recipient_email: string
  status: NotificationStatus
  sent_at?: string
  failed_at?: string
  error_message?: string
  resend_email_id?: string
  triggered_by_event?: string
  idempotency_key?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  payment_failure_emails: boolean
  card_expiring_emails: boolean
  trial_ending_emails: boolean
  subscription_emails: boolean
  recommendation_emails: boolean
  application_status_emails: boolean
  security_emails: boolean
  weekly_digest: boolean
  unsubscribed: boolean
  unsubscribed_at?: string
  unsubscribe_token: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}
