import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserProfile, Experience, Education } from '@ori/types'
import {
  fetchProfile,
  updateProfile,
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/integrations/api/profile'

// ============================================================================
// PROFILE HOOKS
// ============================================================================

/**
 * Hook to fetch user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Update the cache with the new data
      queryClient.setQueryData(['profile'], updatedProfile)
    },
  })
}

// ============================================================================
// EXPERIENCES HOOKS
// ============================================================================

/**
 * Hook to fetch all experiences
 */
export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new experience
 */
export function useCreateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    ) => createExperience(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

/**
 * Hook to update an existing experience
 */
export function useUpdateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
      updateExperience(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

/**
 * Hook to delete an experience
 */
export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

// ============================================================================
// EDUCATION HOOKS
// ============================================================================

/**
 * Hook to fetch all education records
 */
export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: fetchEducation,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new education record
 */
export function useCreateEducation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Omit<Education, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    ) => createEducation(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}

/**
 * Hook to update an existing education record
 */
export function useUpdateEducation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) =>
      updateEducation(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}

/**
 * Hook to delete an education record
 */
export function useDeleteEducation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}
