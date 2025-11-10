'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { BetaWarningModal } from '@/components/BetaWarningModal'
import { getSupabaseClient } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/sonner'

export default function Signup() {
  const router = useRouter()
  const { user } = useAuth()
  const [showBetaWarning, setShowBetaWarning] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDocumentMeta({
      title: 'Sign Up - Ori',
      description:
        'Create your Ori account and start your personalized career journey.',
    })
  }, [])

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
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
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
        toast.success('Welcome to Ori Beta! Check your email to verify your account.')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(
        error.message || 'Failed to create account. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
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
                Check your email
              </h1>
              <p className="text-muted-foreground">
                We&apos;ve sent you a confirmation link. Please check your email
                and click the link to verify your account.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to login
                </Button>
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-4 inline-block text-2xl font-semibold text-foreground transition-colors hover:text-accent"
          >
            Ori
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Get started
          </h1>
          <p className="text-muted-foreground">
            Create your account to begin your career journey
          </p>
        </div>

        <form onSubmit={handleSignupClick} className="space-y-6">
          <div className="space-y-4 rounded-xl border border-border bg-card p-8">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-accent underline underline-offset-2 hover:text-accent/80"
            >
              Log in
            </Link>
          </p>

          <p className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to home
            </Link>
          </p>
        </form>
      </div>

      {/* Beta Warning Modal */}
      <BetaWarningModal
        isOpen={showBetaWarning}
        onClose={() => setShowBetaWarning(false)}
        onProceed={handleProceedWithSignup}
        defaultEmail={email}
      />
    </div>
  )
}
