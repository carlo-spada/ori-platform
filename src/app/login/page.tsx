'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { EarlyAccessModal } from '@/components/EarlyAccessModal'

export default function Login() {
  const router = useRouter()
  const { user } = useAuth()
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false)

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
      router.push('/dashboard')
    }
  }, [user, router])

  // Auto-show early access modal on page load
  useEffect(() => {
    const hasJoinedEarlyAccess = localStorage.getItem('ori-early-access')
    if (!hasJoinedEarlyAccess) {
      // Small delay to ensure smooth page render
      const timer = setTimeout(() => {
        setShowEarlyAccessModal(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleLoginClick = () => {
    // Show early access modal immediately on button click
    setShowEarlyAccessModal(true)
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

        <div className="space-y-6">
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
              />
            </div>

            <Button type="button" onClick={handleLoginClick} className="w-full">
              Log in
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
        </div>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
        trigger="login"
      />
    </div>
  )
}
