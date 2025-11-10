'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Sparkles, Briefcase, BookOpen, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { OnboardingData } from '@/lib/types/onboarding'

interface ActivationStepProps {
  data: Partial<OnboardingData>
  profileCompleteness?: number
  isLoading?: boolean
}

export function ActivationStep({
  data,
  profileCompleteness = 0,
  isLoading,
}: ActivationStepProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  // Animate success state
  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Progressive animations
  useEffect(() => {
    if (showSuccess) {
      const timers = [1, 2, 3].map((step, index) =>
        setTimeout(() => setAnimationStep(step), 200 * (index + 1)),
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [showSuccess])

  // Calculate what features are unlocked
  const getUnlockedFeatures = () => {
    const features = []
    if (profileCompleteness >= 30) features.push('Basic job matching')
    if (profileCompleteness >= 50) features.push('AI recommendations')
    if (profileCompleteness >= 70) features.push('Premium insights')
    if (profileCompleteness >= 90) features.push('Full platform access')
    return features
  }

  // Get initials for avatar
  const getInitials = () => {
    const name = data.identity?.fullName || ''
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name[0]?.toUpperCase() || ''
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <Sparkles className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Calibrating your Ori...</h2>
          <p className="text-muted-foreground">
            We're setting up your personalized experience
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Success Animation */}
      {showSuccess && (
        <div className="flex justify-center duration-500 animate-in zoom-in-50">
          <div className="relative">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
            <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-green-500/20" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold">Your Ori is ready!</h2>
        <p className="text-lg text-muted-foreground">
          Here's your personalized profile
        </p>
      </div>

      {/* Profile Preview Card */}
      <div
        className={`mx-auto max-w-2xl rounded-xl border bg-card p-6 transition-all duration-500 ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
      >
        <div className="mb-6 flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            {data.identity?.profilePhotoUrl ? (
              <AvatarImage
                src={data.identity.profilePhotoUrl}
                alt={data.identity.fullName}
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xl">
                {getInitials() || <User className="h-8 w-8" />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {data.identity?.preferredName || 'User'}
            </h3>
            <p className="text-muted-foreground">
              {data.context?.currentStatus === 'student' && 'Student'}
              {data.context?.currentStatus === 'professional' && 'Professional'}
              {data.context?.currentStatus === 'transitioning' &&
                'Career Changer'}
              {data.context?.currentStatus === 'exploring' && 'Explorer'}
              {data.context?.yearsExperience &&
                data.context.yearsExperience > 0 &&
                ` • ${data.context.yearsExperience} years experience`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.context?.location}
              {data.context?.isRemoteOpen && ' • Open to remote'}
            </p>
          </div>
        </div>

        {/* Skills */}
        {data.expertise?.skills && data.expertise.skills.length > 0 && (
          <div
            className={`mb-6 transition-all delay-100 duration-500 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
          >
            <p className="mb-2 text-sm font-medium">Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.expertise.skills.slice(0, 6).map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {data.expertise.skills.length > 6 && (
                <Badge variant="outline">
                  +{data.expertise.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Aspirations */}
        {(data.aspirations?.dreamRole || data.aspirations?.targetRoles) && (
          <div
            className={`mb-6 transition-all delay-200 duration-500 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
          >
            <p className="mb-2 text-sm font-medium">Career Goals</p>
            {data.aspirations.dreamRole && (
              <p className="text-sm text-muted-foreground">
                Dream role: {data.aspirations.dreamRole}
              </p>
            )}
            {data.aspirations.targetRoles &&
              data.aspirations.targetRoles.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Target: {data.aspirations.targetRoles.join(', ')}
                </p>
              )}
          </div>
        )}

        {/* Profile Completeness */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Profile completeness</span>
            <span className="text-muted-foreground">
              {profileCompleteness}%
            </span>
          </div>
          <Progress value={profileCompleteness} className="h-2" />
        </div>
      </div>

      {/* Unlocked Features */}
      {getUnlockedFeatures().length > 0 && (
        <div className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="mb-2 text-sm font-medium text-primary">
            Features unlocked:
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {getUnlockedFeatures().map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          variant="default"
          size="lg"
          className="group"
          onClick={() => (window.location.href = '/dashboard')}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          See Matches
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="group"
          onClick={() => (window.location.href = '/learning')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Explore Learning
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="group"
          onClick={() => (window.location.href = '/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          Complete Profile
        </Button>
      </div>

      {/* Footer Message */}
      <div className="pt-4 text-center">
        <p className="text-sm text-muted-foreground">
          You'll be redirected to your dashboard in a moment...
        </p>
      </div>
    </div>
  )
}
