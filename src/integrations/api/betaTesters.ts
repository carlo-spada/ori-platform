const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface BetaTesterData {
  email: string
  firstName?: string
  source?: 'signup' | 'login' | 'landing'
}

export interface BetaTesterResponse {
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

/**
 * Submit email for beta testing waitlist
 */
export async function submitBetaTester(
  data: BetaTesterData,
): Promise<BetaTesterResponse> {
  const res = await fetch(`${API_URL}/api/v1/beta-testers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to submit beta tester email')
  }

  return res.json()
}
