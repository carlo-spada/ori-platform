'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { BetaWarningModal } from '@/components/BetaWarningModal'
import { getSupabaseClient } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/sonner'
import { SharedHeader } from '@/components/layout/SharedHeader'
import { SharedFooter } from '@/components/layout/SharedFooter'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'

export default function Signup() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [showBetaWarning, setShowBetaWarning] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDocumentMeta({
      title: t('auth.signup.title'),
      description: t('auth.signup.description'),
    })
  }, [t])

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSignupClick = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!email || !password) {
      toast.error(t('auth.signup.errors.fillFields'))
      return
    }

    if (password.length < 6) {
      toast.error(t('auth.signup.errors.passwordLength'))
      return
    }

    // Show beta warning modal first
    setShowBetaWarning(true)
  }

  const handleProceedWithSignup = async (betaEmail: string) => {
    setShowBetaWarning(false)
    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client is not configured')
      }

      // Use the email from beta form if provided, otherwise use the signup email
      const signupEmail = betaEmail || email

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/select-plan`,
        },
      })

      if (error) throw error

      if (data.user) {
        setShowConfirmation(true)
        toast.success(t('auth.signup.success'))
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || t('auth.signup.errors.failed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <>
        <SharedHeader />
        <main
          id="main"
          className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-16"
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="mb-4 inline-block text-2xl font-semibold text-foreground transition-colors hover:text-accent"
              >
                Ori
              </Link>
            </div>

            <div className="space-y-6 rounded-xl border border-border bg-card p-8">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-accent" />
              </div>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  {t('auth.signup.confirmation.heading')}
                </h1>
                <p className="text-muted-foreground">
                  {t('auth.signup.confirmation.message')}
                </p>
              </div>

              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    {t('auth.signup.confirmation.loginButton')}
                  </Button>
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t('auth.signup.backToHome')}
              </Link>
            </p>
          </div>
        </main>
        <SharedFooter />
      </>
    )
  }

  return (
    <>
      <SharedHeader />
      <main
        id="main"
        className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-16"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-4 inline-block text-2xl font-semibold text-foreground transition-colors hover:text-accent"
            >
              Ori
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {t('auth.signup.heading')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.signup.subheading')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Auth Buttons */}
            <div className="rounded-xl border border-border bg-card p-8">
              <SocialAuthButtons mode="signup" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSignupClick} className="space-y-6">
              <div className="space-y-4 rounded-xl border border-border bg-card p-8">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t('auth.signup.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('auth.signup.emailPlaceholder')}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t('auth.signup.passwordLabel')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('auth.signup.passwordPlaceholder')}
                  minLength={6}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('auth.signup.passwordHelper')}
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.signup.submitting')}
                  </>
                ) : (
                  t('auth.signup.submitButton')
                )}
              </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.signup.hasAccount')}{' '}
                <Link
                  href="/login"
                  className="text-accent underline underline-offset-2 hover:text-accent/80"
                >
                  {t('auth.signup.loginLink')}
                </Link>
              </p>

              <p className="text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t('auth.signup.backToHome')}
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Beta Warning Modal */}
        <BetaWarningModal
          isOpen={showBetaWarning}
          onClose={() => setShowBetaWarning(false)}
          onProceed={handleProceedWithSignup}
          defaultEmail={email}
        />
      </main>
      <SharedFooter />
    </>
  )
}
