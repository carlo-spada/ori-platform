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

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Show early access modal instead of attempting login
    setShowEarlyAccessModal(true)
  }

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-foreground hover:text-accent mb-4 inline-block text-2xl font-semibold transition-colors"
          >
            Ori
          </Link>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Log in to continue your career journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="border-border bg-card space-y-4 rounded-xl border p-8">
            <div>
              <label
                htmlFor="email"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border-border bg-background text-foreground focus:ring-accent w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="border-border bg-background text-foreground focus:ring-accent w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-accent hover:text-accent/80 underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>

          <p className="text-center">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Back to home
            </Link>
          </p>
        </form>
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
