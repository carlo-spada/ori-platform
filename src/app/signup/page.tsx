'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2 } from 'lucide-react'

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export default function Signup() {
  const router = useRouter()
  const { signUp, user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

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
      router.push('/app/dashboard')
    }
  }, [user, router])

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = String(formData.get('email') || '').trim()
      const password = String(formData.get('password') || '')

      // Validate input
      const validation = signupSchema.safeParse({ email, password })
      if (!validation.success) {
        const firstError = validation.error.errors[0]
        toast({
          variant: 'destructive',
          title: 'Invalid input',
          description: firstError.message,
        })
        return
      }

      const { error } = await signUp({ email, password })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Signup failed',
          description: error.message,
        })
        return
      }

      // Show confirmation screen
      setShowConfirmation(true)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description:
          'Something went wrong while creating your account. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
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

        <form onSubmit={handleSignup} className="space-y-6">
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
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
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
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
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
    </div>
  )
}
