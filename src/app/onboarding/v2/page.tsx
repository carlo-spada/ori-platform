'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext'
import { useAuth } from '@/contexts/AuthProvider'

// Import step components
import { IdentityStep } from '@/components/onboarding/v2/IdentityStep'
import { ContextStep } from '@/components/onboarding/v2/ContextStep'
import { ExpertiseStep } from '@/components/onboarding/v2/ExpertiseStep'
import { AspirationsStep } from '@/components/onboarding/v2/AspirationsStep'
import { PreferencesStep } from '@/components/onboarding/v2/PreferencesStep'
import { ActivationStep } from '@/components/onboarding/v2/ActivationStep'

// Optional: Import component for CV/LinkedIn
import { ImportProfileDialog } from '@/components/onboarding/v2/ImportProfileDialog'

const STEP_TITLES = {
  identity: 'Identity',
  context: 'Context',
  expertise: 'Expertise',
  aspirations: 'Aspirations',
  preferences: 'Preferences',
  activation: 'Complete!',
} as const

function OnboardingContent() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    data,
    currentStep,
    progress,
    updateData,
    nextStep,
    previousStep,
    skipStep,
    validateCurrentStep,
    isLoading,
    isSaving,
    errors,
    welcomeBack,
  } = useOnboarding()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Render the current step component
  const renderStep = () => {
    const stepProps = {
      data,
      onChange: updateData,
      errors,
      onNext: nextStep,
      onBack: previousStep,
      onSkip: skipStep,
      isLoading,
    }

    switch (currentStep) {
      case 'identity':
        return <IdentityStep {...stepProps} />
      case 'context':
        return <ContextStep {...stepProps} />
      case 'expertise':
        return <ExpertiseStep {...stepProps} />
      case 'aspirations':
        return <AspirationsStep {...stepProps} />
      case 'preferences':
        return <PreferencesStep {...stepProps} />
      case 'activation':
        return (
          <ActivationStep
            data={data}
            profileCompleteness={progress.percentComplete}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // Check if current step is valid for navigation
  const canProceed = () => {
    const validation = validateCurrentStep()
    return validation.isValid
  }

  // Check if step is optional
  const isOptionalStep = () => {
    return ['aspirations', 'preferences'].includes(currentStep)
  }

  // Show loading state
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header with progress */}
        <div className="max-w-4xl mx-auto mb-8">
          {/* Welcome back message */}
          {welcomeBack && progress.currentStep > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 animate-in slide-in-from-top">
              <p className="text-sm font-medium">
                Welcome back! {welcomeBack.message}
              </p>
            </div>
          )}

          {/* Progress bar */}
          {currentStep !== 'activation' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-medium text-muted-foreground">
                  Step {progress.currentStep + 1} of {progress.totalSteps - 1}
                </h1>
                {isSaving && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </p>
                )}
              </div>
              <Progress
                value={progress.percentComplete}
                className="h-2 transition-all duration-300"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{STEP_TITLES[currentStep]}</span>
                <span>{progress.percentComplete}% complete</span>
              </div>
            </div>
          )}
        </div>

        {/* Main content card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border shadow-lg p-8 md:p-12">
            {/* Optional: Import profile button */}
            {currentStep === 'context' && (
              <div className="absolute top-4 right-4">
                <ImportProfileDialog onImport={updateData} />
              </div>
            )}

            {/* Step content with animation */}
            <div
              key={currentStep}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
            >
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            {currentStep !== 'activation' && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                {/* Back button */}
                <Button
                  variant="ghost"
                  onClick={previousStep}
                  disabled={!progress.canGoBack || isLoading}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {/* Middle section - Skip for optional steps */}
                <div className="text-center">
                  {isOptionalStep() && (
                    <button
                      onClick={skipStep}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Skip this step
                    </button>
                  )}
                </div>

                {/* Next button */}
                <Button
                  onClick={nextStep}
                  disabled={!canProceed() || isLoading}
                  className="gap-2"
                >
                  {progress.isLastStep ? 'Complete' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Help text */}
          {currentStep !== 'activation' && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Your progress is saved automatically. You can come back anytime.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Main page component with provider
export default function OnboardingV2Page() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
}