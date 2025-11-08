import { getSupabaseClient } from '@/integrations/supabase/client'
import type { UserProfile, Experience, Education } from '@ori/types'

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
 * Fetch user profile
 */
export async function fetchProfile(): Promise<UserProfile> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch profile' }))
    throw new Error(error.error || 'Failed to fetch profile')
  }

  return response.json()
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update profile' }))
    throw new Error(error.error || 'Failed to update profile')
  }

  return response.json()
}

/**
 * Complete onboarding and update profile
 */
export async function completeOnboarding(data: Partial<UserProfile>): Promise<UserProfile> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/profile/onboarding`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to complete onboarding' }))
    throw new Error(error.error || 'Failed to complete onboarding')
  }

  return response.json()
}

/**
 * Fetch all experiences for the user
 */
export async function fetchExperiences(): Promise<Experience[]> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/experiences`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch experiences' }))
    throw new Error(error.error || 'Failed to fetch experiences')
  }

  const data = await response.json()
  return data.experiences || []
}

/**
 * Create a new experience
 */
export async function createExperience(data: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Experience> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/experiences`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create experience' }))
    throw new Error(error.error || 'Failed to create experience')
  }

  return response.json()
}

/**
 * Update an existing experience
 */
export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/experiences/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update experience' }))
    throw new Error(error.error || 'Failed to update experience')
  }

  return response.json()
}

/**
 * Delete an experience
 */
export async function deleteExperience(id: string): Promise<void> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/experiences/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete experience' }))
    throw new Error(error.error || 'Failed to delete experience')
  }
}

/**
 * Fetch all education records for the user
 */
export async function fetchEducation(): Promise<Education[]> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/education`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch education' }))
    throw new Error(error.error || 'Failed to fetch education')
  }

  const data = await response.json()
  return data.education || []
}

/**
 * Create a new education record
 */
export async function createEducation(data: Omit<Education, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Education> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/education`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create education' }))
    throw new Error(error.error || 'Failed to create education')
  }

  return response.json()
}

/**
 * Update an existing education record
 */
export async function updateEducation(id: string, data: Partial<Education>): Promise<Education> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/education/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update education' }))
    throw new Error(error.error || 'Failed to update education')
  }

  return response.json()
}

/**
 * Delete an education record
 */
export async function deleteEducation(id: string): Promise<void> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/education/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete education' }))
    throw new Error(error.error || 'Failed to delete education')
  }
}
