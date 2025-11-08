import { getSupabaseClient } from '@/integrations/supabase/client';

export interface JobMatchFilters {
  location?: string;
  workType?: 'remote' | 'hybrid' | 'onsite';
  salaryMin?: number;
}

export interface JobMatchRequest {
  userId: string;
  limit?: number;
  filters?: JobMatchFilters;
}

export interface JobMatchResponse {
  matches: Array<{
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
    tags?: string[];
    posted_date?: string;
    expires_date?: string;
    created_at: string;
    updated_at: string;
    matchScore: number;
    keyMatches: string[];
    reasoning?: string;
    skills_analysis?: Array<{
      name: string;
      status: 'matched' | 'missing';
    }>;
  }>;
  usage: {
    used: number;
    limit: number;
  };
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: string;
}

/**
 * Fetch job recommendations for a user from the core-api
 */
export async function fetchJobRecommendations(
  request: JobMatchRequest
): Promise<JobMatchResponse> {
  const supabase = getSupabaseClient();

  // Get the current session to access the auth token
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No active session');
  }

  // Get the API URL from environment or default to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Get the API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const response = await fetch(`${apiUrl}/api/v1/jobs/find-matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      userId: request.userId,
      limit: request.limit || 6,
      filters: request.filters,
    }),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    
    try {
      const errorData: ApiErrorResponse = await response.json();
      // Try to extract error message from various possible fields
      const apiError = errorData.error || errorData.message || errorData.details;
      if (apiError) {
        errorMessage = `${apiError} (HTTP ${response.status})`;
      } else {
        errorMessage = `${response.statusText} (HTTP ${response.status})`;
      }
    } catch {
      // If JSON parsing fails, use status text with status code
      errorMessage = `${response.statusText} (HTTP ${response.status})`;
    }
    
    throw new Error(errorMessage);
  }

  return await response.json() as JobMatchResponse;
}
