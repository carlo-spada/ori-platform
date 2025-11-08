'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { BasicInfoStep } from "@/components/onboarding/BasicInfoStep";
import { SkillsStep } from "@/components/onboarding/SkillsStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { FinalizingStep } from "@/components/onboarding/FinalizingStep";
import type { OnboardingData, OnboardingStepKey } from "@/lib/types";

const STEPS: OnboardingStepKey[] = ['welcome', 'basicInfo', 'skills', 'goals', 'finalizing'];
const DEFAULT_BASIC_INFO = { headline: "", location: "" } as const;
const DEFAULT_GOALS = { longTermVision: "", targetRoles: [] as string[] };

export default function OnboardingPage() {
  const userName = "there"; // Placeholder until onboarding is wired to real user data
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    basicInfo: { ...DEFAULT_BASIC_INFO },
    skills: [],
    goals: { ...DEFAULT_GOALS },
  });

  const currentStep = STEPS[currentStepIndex];
  const totalSteps = STEPS.length - 1; // Don't count finalizing in progress
  const progressPercent = (currentStepIndex / totalSteps) * 100;

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'basicInfo':
        return data.basicInfo.headline.trim().length > 0 &&
               data.basicInfo.location.trim().length > 0;
      case 'skills':
        return data.skills.length >= 3;
      case 'goals':
        return data.goals.longTermVision.trim().length > 0 ||
               data.goals.targetRoles.length > 0;
      case 'finalizing':
        return false;
      default:
        return false;
    }
  };

  const handleSubmit = async (_payload: OnboardingData) => {
    // Placeholder for API integration (Supabase, etc.)
    return Promise.resolve();
  };

  const handleNext = async () => {
    if (currentStep === 'goals') {
      // This is the last data-entry step
      setIsSubmitting(true);
      setCurrentStepIndex(currentStepIndex + 1); // Move to finalizing

      try {
        await handleSubmit(data);
        // Simulate brief processing for UX
        setTimeout(() => {
          router.push('/app/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Onboarding submission failed:', error);
        setIsSubmitting(false);
        // In a real app, show error toast
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep
            copy={{
              headline: t('onboardingPage.welcome.headline', { name: userName }),
              body: t('onboardingPage.welcome.body'),
              primaryButton: t('onboardingPage.welcome.primaryButton'),
            }}
            onNext={handleNext}
          />
        );
      case 'basicInfo':
        return (
          <BasicInfoStep
            value={data.basicInfo}
            copy={{
              headline: t('onboardingPage.basicInfo.headline'),
              description: t('onboardingPage.basicInfo.description'),
              headlineLabel: t('onboardingPage.basicInfo.headlineLabel'),
              headlinePlaceholder: t('onboardingPage.basicInfo.headlinePlaceholder'),
              locationLabel: t('onboardingPage.basicInfo.locationLabel'),
              locationPlaceholder: t('onboardingPage.basicInfo.locationPlaceholder'),
            }}
            onChange={(basicInfo) => setData({ ...data, basicInfo })}
          />
        );
      case 'skills':
        return (
          <SkillsStep
            skills={data.skills}
            copy={{
              headline: t('onboardingPage.skills.headline'),
              description: t('onboardingPage.skills.description'),
              inputPlaceholder: t('onboardingPage.skills.inputPlaceholder'),
              helper: t('onboardingPage.skills.helper'),
              validationError: t('onboardingPage.skills.validationError'),
            }}
            onChange={(skills) => setData({ ...data, skills })}
          />
        );
      case 'goals':
        return (
          <GoalsStep
            value={data.goals}
            copy={{
              headline: t('onboardingPage.goals.headline'),
              description: t('onboardingPage.goals.description'),
              longTermVisionLabel: t('onboardingPage.goals.longTermVisionLabel'),
              longTermVisionPlaceholder: t('onboardingPage.goals.longTermVisionPlaceholder'),
              targetRolesLabel: t('onboardingPage.goals.targetRolesLabel'),
              targetRolesPlaceholder: t('onboardingPage.goals.targetRolesPlaceholder'),
              helper: t('onboardingPage.goals.helper'),
            }}
            onChange={(goals) => setData({ ...data, goals })}
          />
        );
      case 'finalizing':
        return (
          <FinalizingStep
            copy={{
              headline: t('onboardingPage.finalizing.headline'),
              body: t('onboardingPage.finalizing.body'),
            }}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const showNavigation = currentStep !== 'welcome' && currentStep !== 'finalizing';
  const showBackButton = currentStep !== 'welcome' && currentStep !== 'finalizing';

  return (
    <div className="min-h-screen w-screen bg-background text-foreground flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-lg shadow-black/40 flex flex-col gap-6">
        {/* Progress Indicator */}
        {currentStep !== 'welcome' && currentStep !== 'finalizing' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              {t('onboardingPage.progressLabel', { current: currentStepIndex, total: totalSteps })}
            </p>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1">
          {renderStep()}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            {showBackButton ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
              >
                {t('onboardingPage.nav.backLabel')}
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="min-w-[120px]"
            >
              {currentStep === 'goals'
                ? t('onboardingPage.nav.finishLabel')
                : t('onboardingPage.nav.nextLabel')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
