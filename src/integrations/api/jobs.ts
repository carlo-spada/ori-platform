import { useQuery } from '@tanstack/react-query';
import { JobMatch } from '@/shared/types/src';

// This would typically be in a more generic API client file
const apiClient = {
  post: async <T>(url: string, body: unknown): Promise<T> => {
    // In a real app, this would make a POST request to the backend API.
    // For now, we'll simulate a delay and return mock data that includes skills_analysis.
    console.log('Making API call to:', url, 'with body:', body);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'Innovate Inc.',
            location: 'Remote',
            matchScore: 95,
            summary: 'Lead the development of our next-generation user interface, focusing on performance and user experience.',
            datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            detailHref: '#',
            applyHref: '#',
            skills_analysis: [
              { name: 'React', status: 'matched' },
              { name: 'TypeScript', status: 'matched' },
              { name: 'GraphQL', status: 'missing' },
            ],
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'DataDriven Co.',
            location: 'New York, NY',
            matchScore: 89,
            summary: 'Work across the stack to build and maintain our data analytics platform. Strong Node.js and Python skills required.',
            datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            detailHref: '#',
            applyHref: '#',
            skills_analysis: [
              { name: 'Node.js', status: 'matched' },
              { name: 'Python', status: 'matched' },
              { name: 'React', status: 'matched' },
              { name: 'Kubernetes', status: 'missing' },
            ],
          },
        ] as unknown as T);
      }, 1500); // Simulate 1.5 second network delay
    });
  },
};

/**
 * Fetches job recommendations from the backend API.
 * @param userId - The ID of the user to get recommendations for.
 * @param filters - Any filters to apply to the recommendations.
 * @returns A promise that resolves to an array of JobMatch objects.
 */
export async function fetchJobRecommendations(
  userId: string,
  filters?: Record<string, unknown>
): Promise<JobMatch[]> {
  // In a real implementation, you would pass the userId and filters in the request body.
  const response = await apiClient.post<JobMatch[]>('/api/jobs/find-matches', { userId, filters });
  return response;
}

/**
 * A React Query hook for fetching job recommendations.
 * @param userId - The ID of the user.
 * @param filters - Optional filters.
 */
export function useJobRecommendations(userId: string | null, filters?: Record<string, unknown>) {
  return useQuery<JobMatch[], Error>({
    queryKey: ['jobRecommendations', userId, filters],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]); // Or reject, depending on desired behavior
      }
      return fetchJobRecommendations(userId, filters);
    },
    enabled: !!userId, // Only run the query if the userId is available
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
