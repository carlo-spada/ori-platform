'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'
import type {
  OnboardingData,
  OnboardingSession,
  OnboardingProgress,
  ValidationResult,
  WelcomeBackState,
  OnboardingStepKey,
  ONBOARDING_STEPS,
} from '@/lib/types/onboarding'

interface OnboardingContextType {
  // Data
  data: Partial<OnboardingData>
  session: OnboardingSession | null

  // Progress
  progress: OnboardingProgress
  currentStep: OnboardingStepKey

  // Actions
  updateData: (updates: Partial<OnboardingData>) => void
  nextStep: () => Promise<void>
  previousStep: () => void
  skipStep: () => void
  goToStep: (step: OnboardingStepKey) => void

  // Validation
  validateCurrentStep: () => ValidationResult

  // Session
  saveSession: () => Promise<void>
  loadSession: () => Promise<void>
  clearSession: () => Promise<void>

  // State
  isLoading: boolean
  isSaving: boolean
  errors: Record<string, string>
  welcomeBack: WelcomeBackState | null
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

const ONBOARDING_STEPS_ARRAY: OnboardingStepKey[] = [
  'identity',
  'context',
  'expertise',
  'aspirations',
  'preferences',
  'activation',
]

const AUTOSAVE_DELAY = 2000 // 2 seconds
const SESSION_KEY = 'onboarding_session'

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  // State
  const [data, setData] = useState<Partial<OnboardingData>>({})
  const [session, setSession] = useState<OnboardingSession | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [welcomeBack, setWelcomeBack] = useState<WelcomeBackState | null>(null)

  // Refs for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedDataRef = useRef<string>('')

  const currentStep = ONBOARDING_STEPS_ARRAY[currentStepIndex]

  // Calculate progress
  const progress: OnboardingProgress = {
    currentStep: currentStepIndex,
    totalSteps: ONBOARDING_STEPS_ARRAY.length,
    completedSteps,
    percentComplete: Math.round((completedSteps.length / (ONBOARDING_STEPS_ARRAY.length - 1)) * 100), // -1 because activation doesn't count
    canProceed: true, // Will be updated by validation
    canGoBack: currentStepIndex > 0,
    isLastStep: currentStepIndex === ONBOARDING_STEPS_ARRAY.length - 1,
  }

  // Load session on mount
  useEffect(() => {
    loadSession()
  }, [])

  // Auto-save on data changes
  useEffect(() => {
    const dataString = JSON.stringify(data)

    // Skip if data hasn't changed
    if (dataString === lastSavedDataRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveSession()
      lastSavedDataRef.current = dataString
    }, AUTOSAVE_DELAY)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [data])

  // Update data
  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
    }))

    // Clear errors for updated fields
    const updatedFields = Object.keys(updates)
    setErrors(prev => {
      const newErrors = { ...prev }
      updatedFields.forEach(field => {
        delete newErrors[field]
      })
      return newErrors
    })
  }, [])

  // Validate current step
  const validateCurrentStep = useCallback((): ValidationResult => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    switch (currentStep) {
      case 'identity':
        if (!data.identity?.fullName?.trim()) {
          stepErrors.fullName = 'Please enter your full name'
          isValid = false
        }
        if (!data.identity?.preferredName?.trim()) {
          stepErrors.preferredName = 'Please enter your preferred name'
          isValid = false
        }
        break

      case 'context':
        if (!data.context?.currentStatus) {
          stepErrors.currentStatus = 'Please select your current status'
          isValid = false
        }
        if (data.context?.yearsExperience === undefined) {
          stepErrors.yearsExperience = 'Please enter your years of experience'
          isValid = false
        }
        if (!data.context?.location?.trim()) {
          stepErrors.location = 'Please enter your location'
          isValid = false
        }
        break

      case 'expertise':
        if (!data.expertise?.skills || data.expertise.skills.length < 3) {
          stepErrors.skills = 'Please add at least 3 skills'
          isValid = false
        }
        break

      case 'aspirations':
        // Optional step - always valid but we can add warnings
        break

      case 'preferences':
        // Optional step - always valid
        break

      case 'activation':
        // No validation needed
        break
    }

    setErrors(stepErrors)
    return { isValid, errors: stepErrors }
  }, [currentStep, data])

  // Save session to localStorage and backend
  const saveSession = useCallback(async () => {
    if (!user) return

    setIsSaving(true)

    try {
      // Save to localStorage for immediate recovery
      const sessionData = {
        userId: user.id,
        currentStep: currentStepIndex,
        completedSteps,
        formData: data,
        lastSavedAt: new Date().toISOString(),
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))

      // Save to backend
      const response = await fetch('/api/v1/onboarding/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(sessionData),
      })

      if (!response.ok) {
        throw new Error('Failed to save session')
      }

      const savedSession = await response.json()
      setSession(savedSession)
    } catch (error) {
      console.error('Failed to save onboarding session:', error)
      // Don't show error toast for auto-save failures
    } finally {
      setIsSaving(false)
    }
  }, [user, currentStepIndex, completedSteps, data])

  // Load session from localStorage or backend
  const loadSession = useCallback(async () => {
    if (!user) return

    setIsLoading(true)

    try {
      // Try localStorage first
      const localData = localStorage.getItem(SESSION_KEY)
      if (localData) {
        const parsed = JSON.parse(localData)
        if (parsed.userId === user.id) {
          setData(parsed.formData || {})
          setCurrentStepIndex(parsed.currentStep || 0)
          setCompletedSteps(parsed.completedSteps || [])

          // Calculate welcome back state
          const lastSaved = new Date(parsed.lastSavedAt)
          const hoursAgo = Math.floor((Date.now() - lastSaved.getTime()) / (1000 * 60 * 60))

          if (hoursAgo < 24 && parsed.currentStep > 0) {
            setWelcomeBack({
              lastStepName: ONBOARDING_STEPS_ARRAY[parsed.currentStep],
              percentComplete: Math.round((parsed.completedSteps?.length || 0) / (ONBOARDING_STEPS_ARRAY.length - 1) * 100),
              timeAway: hoursAgo < 1 ? 'a few moments ago' : `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`,
              message: `Welcome back! You were ${Math.round((parsed.completedSteps?.length || 0) / (ONBOARDING_STEPS_ARRAY.length - 1) * 100)}% through the setup.`,
            })
          }
        }
      }

      // Try backend if no local data
      if (!localData) {
        const response = await fetch('/api/v1/onboarding/session', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
        })

        if (response.ok) {
          const backendSession = await response.json()
          if (backendSession) {
            setData(backendSession.formData || {})
            setCurrentStepIndex(backendSession.currentStep || 0)
            setCompletedSteps(backendSession.completedSteps || [])
            setSession(backendSession)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding session:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Clear session
  const clearSession = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY)
    setData({})
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setSession(null)
    setWelcomeBack(null)

    if (user) {
      try {
        await fetch('/api/v1/onboarding/session', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
        })
      } catch (error) {
        console.error('Failed to clear session:', error)
      }
    }
  }, [user])

  // Navigation
  const nextStep = useCallback(async () => {
    const validation = validateCurrentStep()

    if (!validation.isValid) {
      toast.error('Please complete all required fields')
      return
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex])
    }

    // If on the last real step (preferences), submit and go to activation
    if (currentStep === 'preferences') {
      setIsLoading(true)

      try {
        // Transform data for API
        const profileData = {
          // Identity
          full_name: data.identity?.fullName,
          preferred_name: data.identity?.preferredName,
          profile_photo_url: data.identity?.profilePhotoUrl,

          // Context
          current_status: data.context?.currentStatus,
          years_experience: data.context?.yearsExperience,
          location: data.context?.location,
          is_remote_open: data.context?.isRemoteOpen,

          // Import
          cv_url: data.import?.cvUrl,
          linkedin_url: data.import?.linkedinUrl,
          imported_data: data.import?.importedData,

          // Expertise
          skills: data.expertise?.skills,
          skill_levels: data.expertise?.skillLevels,
          hidden_talents: data.expertise?.hiddenTalents,

          // Aspirations
          dream_role: data.aspirations?.dreamRole,
          timeline_months: data.aspirations?.timelineMonths,
          success_metrics: data.aspirations?.successMetrics,
          long_term_vision: data.aspirations?.longTermVision,
          target_roles: data.aspirations?.targetRoles,

          // Preferences
          work_styles: data.preferences?.workStyles,
          culture_values: data.preferences?.cultureValues,
          deal_breakers: data.preferences?.dealBreakers,
          industries: data.preferences?.industries,
        }

        const response = await fetch('/api/v1/profile/onboarding', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user?.getIdToken()}`,
          },
          body: JSON.stringify(profileData),
        })

        if (!response.ok) {
          throw new Error('Failed to complete onboarding')
        }

        // Clear session on success
        await clearSession()

        // Move to activation step
        setCurrentStepIndex(prev => prev + 1)

        // Redirect after showing activation
        setTimeout(() => {
          toast.success('Welcome to Ori! Your profile is ready.')
          router.push('/dashboard')
        }, 3000)
      } catch (error) {
        console.error('Failed to complete onboarding:', error)
        toast.error('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      // Just move to next step
      setCurrentStepIndex(prev => Math.min(prev + 1, ONBOARDING_STEPS_ARRAY.length - 1))
    }

    // Save session after navigation
    await saveSession()
  }, [currentStep, currentStepIndex, completedSteps, data, user, router, validateCurrentStep, saveSession, clearSession])

  const previousStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0))
  }, [])

  const skipStep = useCallback(() => {
    // Mark as completed even though skipped
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex])
    }
    setCurrentStepIndex(prev => Math.min(prev + 1, ONBOARDING_STEPS_ARRAY.length - 1))
  }, [currentStepIndex, completedSteps])

  const goToStep = useCallback((step: OnboardingStepKey) => {
    const index = ONBOARDING_STEPS_ARRAY.indexOf(step)
    if (index !== -1) {
      setCurrentStepIndex(index)
    }
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        data,
        session,
        progress,
        currentStep,
        updateData,
        nextStep,
        previousStep,
        skipStep,
        goToStep,
        validateCurrentStep,
        saveSession,
        loadSession,
        clearSession,
        isLoading,
        isSaving,
        errors,
        welcomeBack,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}