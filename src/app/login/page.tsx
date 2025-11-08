'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/use-toast'

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export default function Login() {
  const router = useRouter()
  const { signInWithPassword, user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setDocumentMeta({
      title: 'Log In - Ori',
      description:
        'Log in to your Ori account to continue your career journey.',
    })
  }, [])

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.push('/app/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = String(formData.get('email') || '').trim()
      const password = String(formData.get('password') || '')

      // Validate input
      const validation = loginSchema.safeParse({ email, password })
      if (!validation.success) {
        const firstError = validation.error.issues[0]
        toast({
          variant: 'destructive',
          title: 'Invalid input',
          description: firstError.message,
        })
        return
      }

      const { error } = await signInWithPassword({ email, password })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message,
        })
        return
      }

      // Success - redirect handled by useEffect when user state updates
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description:
          'Something went wrong while logging you in. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
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
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Log in to continue your career journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-accent underline underline-offset-2 hover:text-accent/80"
            >
              Sign up
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
