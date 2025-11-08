/**
 * Type definitions for the Ori application
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // raw HTML/markdown-rendered string or rich data
  author: string;
  date: string; // ISO string
  readingTimeMinutes: number;
  category?: string;
  tags?: string[];
  featureImageUrl?: string;
}

/**
 * Recommendation types
 */
export type RecommendationType = 'jobs' | 'advice';

/**
 * Skills Gap Analysis types
 */
export interface Skill {
  name: string;
  status: 'matched' | 'missing'; // Indicates if the user has this skill for the job
}

export interface SkillsGap {
  userSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location?: string;
  matchScore?: number; // 0–100
  summary: string;
  datePosted: string; // ISO string
  detailHref?: string;
  applyHref?: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  employmentType?: string;
  salaryRange?: string;
  analysis?: {
    skillMatch?: string;
    goalAlignment?: string;
    companyInsight?: string;
  };
  skills_analysis?: Skill[]; // Legacy skills gap analysis (matched/missing status per skill)
  skillsGap?: SkillsGap; // New skills gap analysis from AI Engine
}

export interface CareerAdvice {
  id: string;
  title: string;
  summary: string;
  category?: string; // e.g., "Upskilling", "Networking"
  detailHref?: string;
  content?: string; // Full article body as HTML or markdown string
}

/**
 * Application tracking types
 */
export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'paused';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  applicationDate: string; // ISO string
  status: ApplicationStatus;
  lastUpdated: string; // ISO string
  detailsHref?: string;
  applyHref?: string;
}

/**
 * Settings types
 */
export interface NotificationPreferences {
  newJobRecommendations: boolean;
  applicationStatusUpdates: boolean;
  insightsAndTips: boolean;
}

export interface SubscriptionDetails {
  planName: string;
  planId: string;
  billingInterval: 'monthly' | 'annual';
  nextBillingDate?: string;
  nextBillingAmount?: number;
  currency?: string;
  paymentMethodSummary?: string;
}

export interface UserSettings {
  email: string;
}

/**
 * Onboarding types
 */
export interface OnboardingData {
  basicInfo: {
    headline: string;
    location: string;
  };
  skills: string[];
  goals: {
    longTermVision: string;
    targetRoles: string[];
  };
}

export type OnboardingStepKey = 'welcome' | 'basicInfo' | 'skills' | 'goals' | 'finalizing';
