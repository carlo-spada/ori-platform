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
 * Create a Setup Intent for collecting payment method
 */
export async function createSetupIntent(planId: string): Promise<{
  clientSecret: string
  setupIntentId: string
}> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/setup-intent`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ planId }),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to create setup intent' }))
    throw new Error(error.error || 'Failed to create setup intent')
  }

  return response.json()
}

/**
 * Create a subscription after payment method is confirmed
 */
export async function createSubscription(
  planId: string,
  paymentMethodId: string,
): Promise<{ subscriptionId: string }> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/api/v1/subscriptions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ planId, paymentMethodId }),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to create subscription' }))
    throw new Error(error.error || 'Failed to create subscription')
  }

  return response.json()
}
