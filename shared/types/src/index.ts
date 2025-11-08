// User related types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'plus' | 'premium';
  subscription_status: 'active' | 'trialing' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  monthly_job_matches_limit: number;
  monthly_job_matches_used: number;
  badge_size?: number;
  badge_frequency?: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name?: string;
  cv_url?: string;
  roles?: string[];
  work_style?: 'remote' | 'hybrid' | 'onsite';
  industries?: string[];
  goal?: string;
  skills?: string[];
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  years_of_experience?: number;
  location?: string;
  willing_to_relocate?: boolean;
}

// AI Analysis types
export interface AIAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
}

// Skills Gap Analysis types
export interface Skill {
  name: string;
  status: 'matched' | 'missing'; // Indicates if the user has this skill for the job
}

// Job related types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  requirements?: string[];
  salary_min?: number;
  salary_max?: number;
  work_type?: 'remote' | 'hybrid' | 'onsite';
  highlights?: string[];
  match_score?: number;
  ai_analysis?: AIAnalysis;
  tags?: string[];
  posted_date?: string;
  expires_date?: string;
  created_at: string;
  updated_at: string;
}

export interface JobMatch extends Job {
  matchScore: number;
  keyMatches: string[];
  reasoning?: string;
  skills_analysis?: Skill[]; // Array of skills with their match status
}

// Application related types
export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  rating?: number;
  applied: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  job?: Job;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Subscription types
export interface SubscriptionTier {
  id: 'free' | 'plus' | 'premium';
  name: string;
  price: number;
  priceYearly: number;
  features: string[];
  matchLimit: number;
  highlighted?: boolean;
}

// Preference types
export interface UserPreferences {
  desired_roles?: string[];
  industries?: string[];
  locations?: string[];
  salary_min?: number;
  salary_max?: number;
  work_type?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  visa_sponsorship_needed?: boolean;
  willing_to_relocate?: boolean;
}

// Onboarding types
export interface OnboardingData {
  step: number;
  completed: boolean;
  cv?: string; // URL or base64 string instead of File
  preferences?: UserPreferences;
  skills?: string[];
  profile?: Partial<UserProfile>;
}