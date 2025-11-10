import type { User, SubscriptionTier } from '@ori/types'

// Subscription tier definitions
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    features: [
      '2 job matches per month',
      'Basic job search',
      'Application tracking',
      'Community support',
    ],
    matchLimit: 2,
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 5,
    priceYearly: 48,
    features: [
      '6 job matches per month',
      'AI-powered matching',
      'Application generation',
      'Priority ranking',
      'Email support',
    ],
    matchLimit: 6,
    highlighted: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 10,
    priceYearly: 96,
    features: [
      'Unlimited job matches',
      'Advanced AI matching',
      'Career coaching AI',
      'API access',
      'Priority support',
    ],
    matchLimit: -1, // Unlimited
  },
}

// Check if user has reached their match limit
export function hasReachedMatchLimit(user: User): boolean {
  if (user.subscription_tier === 'premium') return false
  return user.monthly_job_matches_used >= user.monthly_job_matches_limit
}

// Get remaining matches for user
export function getRemainingMatches(user: User): number {
  if (user.subscription_tier === 'premium') return -1 // Unlimited
  return Math.max(
    0,
    user.monthly_job_matches_limit - user.monthly_job_matches_used,
  )
}

// Format salary range
export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Not specified'
  if (min && !max) return `$${min.toLocaleString()}+`
  if (!min && max) return `Up to $${max.toLocaleString()}`
  return `$${min!.toLocaleString()} - $${max!.toLocaleString()}`
}

// Calculate match percentage (placeholder for actual AI logic)
export function calculateMatchScore(
  userSkills: string[],
  jobRequirements: string[],
): number {
  if (!userSkills.length || !jobRequirements.length) return 0

  const matches = jobRequirements.filter((req) =>
    userSkills.some(
      (skill) =>
        skill.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(skill.toLowerCase()),
    ),
  )

  return Math.round((matches.length / jobRequirements.length) * 100)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  // Prevent ReDoS attacks by limiting input length
  if (!email || email.length > 320) {
    // RFC 5321 specifies 320 as max email length
    return false
  }

  // Use a more efficient regex pattern that avoids catastrophic backtracking
  // This pattern is less permissive but safer and follows common email formats
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  // Additional validation to prevent edge cases
  if (
    email.indexOf('@') === -1 ||
    email.indexOf('@') !== email.lastIndexOf('@')
  ) {
    return false // Must have exactly one @ symbol
  }

  const parts = email.split('@')
  if (parts[0].length > 64 || parts[1].length > 255) {
    return false // Local part max 64 chars, domain part max 255 chars
  }

  return emailRegex.test(email)
}

// Generate initials from name
export function getInitials(name?: string): string {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Format date relative to now
export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length - 3) + '...'
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
