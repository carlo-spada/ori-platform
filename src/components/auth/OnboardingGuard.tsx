'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { useProfile } from '@/hooks/useProfile'

/**
 * OnboardingGuard ensures users complete onboarding before accessing protected routes
 *
 * Flow:
 * 1. New user signs up → profile created with onboarding_completed = false
 * 2. User verifies email → redirected to /select-plan
 * 3. After plan selection → redirected to /onboarding
 * 4. After onboarding → onboarding_completed set to true → can access dashboard
 *
 * This component checks onboarding status and redirects accordingly
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, session } = useAuth()
  const { data: profile, isLoading: isProfileLoading } = useProfile()

  // Routes that don't require onboarding check
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/about',
    '/pricing',
    '/blog',
    '/features',
    '/legal',
  ]

  // Routes that are part of the onboarding flow (allow access even if onboarding not complete)
  const onboardingRoutes = ['/select-plan', '/onboarding']

  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || (route !== '/' && pathname?.startsWith(route)),
  )
  const isOnboardingRoute = onboardingRoutes.some((route) =>
    pathname?.startsWith(route),
  )

  useEffect(() => {
    // Don't redirect on public routes
    if (isPublicRoute) return

    // Don't redirect if we're already on an onboarding route
    if (isOnboardingRoute) return

    // Wait for auth and profile to load
    if (!user || isProfileLoading) return

    // If user is authenticated but profile hasn't loaded, they might need to complete onboarding
    if (!profile) {
      // Profile should exist (created by trigger), but if it doesn't, send to onboarding
      console.warn('User authenticated but no profile found, redirecting to onboarding')
      router.push('/onboarding')
      return
    }

    // Check if onboarding is complete
    if (!profile.onboarding_completed) {
      console.log('Onboarding not completed, redirecting to select-plan')
      router.push('/select-plan')
    }
  }, [user, profile, isProfileLoading, pathname, isPublicRoute, isOnboardingRoute, router])

  // Show loading state while checking auth/profile
  if (!isPublicRoute && !isOnboardingRoute && user && isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
