import { getSupabaseClient } from '@/integrations/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Get authenticated headers with JWT token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client is not configured')
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

/**
 * Dashboard stats response type
 */
export interface DashboardStats {
  activeApplications: number
  jobRecommendations: number
  skillsAdded: number
  profileCompletion: number
}

/**
 * Activity item type
 */
export interface ActivityItem {
  id: string
  type: 'application' | 'skill' | 'favorite' | 'profile'
  title: string
  subtitle: string
  timestamp: string
}

/**
 * Dashboard data response type
 */
export interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
}

/**
 * Fetch dashboard data including stats and recent activity
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/dashboard`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch dashboard data' }))
    throw new Error(error.error || 'Failed to fetch dashboard data')
  }

  return response.json()
}
