import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Application } from '@ori/types'
import {
  fetchApplications,
  fetchApplicationStats,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from '@/integrations/api/applications'

/**
 * Hook to fetch all applications
 */
export function useApplications(status?: string) {
  return useQuery({
    queryKey: status ? ['applications', status] : ['applications'],
    queryFn: () => fetchApplications(status),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch application statistics
 */
export function useApplicationStats() {
  return useQuery({
    queryKey: ['applications', 'stats'],
    queryFn: fetchApplicationStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to create a new application
 */
export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Pick<
        Application,
        'job_title' | 'company' | 'location' | 'job_url' | 'status' | 'notes'
      >,
    ) => createApplication(data),
    onSuccess: () => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Hook to update an existing application
 */
export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      updateApplication(id, data),
    onSuccess: () => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Hook to update application status (quick update)
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: Application['status']
    }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Hook to delete an application
 */
export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
