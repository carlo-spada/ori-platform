import { getSupabaseClient } from '@/integrations/supabase/client'
import type {
  ChatMessage as BackendChatMessage,
  ChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@ori/types'

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error?: string
  message?: string
  details?: string
}

/**
 * Fetch conversation history from the API
 */
export async function fetchChatHistory(): Promise<ChatHistoryResponse> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client is not configured')
  }

  // Get the current session to access the auth token
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session')
  }

  // Get the API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined')
  }

  const response = await fetch(`${apiUrl}/api/v1/chat/history`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  if (!response.ok) {
    let errorMessage: string

    try {
      const errorData: ApiErrorResponse = await response.json()
      const apiError = errorData.error || errorData.message || errorData.details
      if (apiError) {
        errorMessage = `${apiError} (HTTP ${response.status})`
      } else {
        errorMessage = `${response.statusText} (HTTP ${response.status})`
      }
    } catch {
      errorMessage = `${response.statusText} (HTTP ${response.status})`
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as ChatHistoryResponse
}

/**
 * Send a message to the chat API
 */
export async function sendChatMessage(
  content: string,
  conversationId?: string,
): Promise<SendMessageResponse> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client is not configured')
  }

  // Get the current session to access the auth token
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session')
  }

  // Get the API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined')
  }

  const requestBody: SendMessageRequest = {
    content,
    ...(conversationId && { conversation_id: conversationId }),
  }

  const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    let errorMessage: string

    try {
      const errorData: ApiErrorResponse = await response.json()
      const apiError = errorData.error || errorData.message || errorData.details
      if (apiError) {
        errorMessage = `${apiError} (HTTP ${response.status})`
      } else {
        errorMessage = `${response.statusText} (HTTP ${response.status})`
      }
    } catch {
      errorMessage = `${response.statusText} (HTTP ${response.status})`
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as SendMessageResponse
}

/**
 * Helper function to convert backend ChatMessage to frontend format
 */
export function mapBackendMessageToFrontend(message: BackendChatMessage) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.created_at,
  }
}
