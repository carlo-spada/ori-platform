import { getSupabaseClient } from '@/integrations/supabase/client'
import type { Application } from '@ori/types'

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
 * Fetch all applications for the user
 */
export async function fetchApplications(
  status?: string,
): Promise<Application[]> {
  const headers = await getAuthHeaders()

  const url = new URL(`${API_URL}/api/v1/applications`)
  if (status) {
    url.searchParams.set('status', status)
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch applications' }))
    throw new Error(error.error || 'Failed to fetch applications')
  }

  const data = await response.json()
  return data.applications || []
}

/**
 * Fetch application statistics
 */
export async function fetchApplicationStats(): Promise<{
  total: number
  applied: number
  interviewing: number
  offers: number
  rejected: number
  paused: number
}> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/applications/stats`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch stats' }))
    throw new Error(error.error || 'Failed to fetch stats')
  }

  return response.json()
}

/**
 * Create a new application
 */
export async function createApplication(
  data: Pick<
    Application,
    'job_title' | 'company' | 'location' | 'job_url' | 'status' | 'notes'
  >,
): Promise<Application> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/applications`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to create application' }))
    throw new Error(error.error || 'Failed to create application')
  }

  return response.json()
}

/**
 * Update an existing application
 */
export async function updateApplication(
  id: string,
  data: Partial<Application>,
): Promise<Application> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/applications/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to update application' }))
    throw new Error(error.error || 'Failed to update application')
  }

  return response.json()
}

/**
 * Update only the status of an application
 */
export async function updateApplicationStatus(
  id: string,
  status: Application['status'],
): Promise<Application> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/applications/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to update status' }))
    throw new Error(error.error || 'Failed to update status')
  }

  return response.json()
}

/**
 * Delete an application
 */
export async function deleteApplication(id: string): Promise<void> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/applications/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to delete application' }))
    throw new Error(error.error || 'Failed to delete application')
  }
}
