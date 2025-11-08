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
 * Fetch job recommendations for a user from the core-api
 */
export async function fetchJobRecommendations(
  request: JobMatchRequest
): Promise<JobMatchResponse> {
  const supabase = getSupabaseClient();

  // Get the current session to access the auth token
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Authentication required: No active session found. Please sign in to view job recommendations.');
  }

  // Get the API URL from environment or default to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('No active session or authentication error.');
  }
  const { session } = data;
  const response = await fetch(`${apiUrl}/api/v1/jobs/find-matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
    body: JSON.stringify({
      userId: request.userId,
      limit: request.limit || 6,
      filters: request.filters,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API request failed: ${response.statusText}`);
  }

  return await response.json() as JobMatchResponse;
}
