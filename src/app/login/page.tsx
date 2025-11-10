'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { SharedHeader } from '@/components/layout/SharedHeader'
import { SharedFooter } from '@/components/layout/SharedFooter'

export default function Login() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDocumentMeta({
      title: t('auth.login.title'),
      description: t('auth.login.description'),
    })
  }, [t])

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!email || !password) {
      toast.error(t('auth.login.errors.fillFields'))
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signInWithPassword({ email, password })

      if (error) throw error

      toast.success(t('auth.login.success'))
      // Auth provider will redirect to dashboard automatically
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || t('auth.login.errors.failed'))
    } finally {
      setIsLoading(false)
    }
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
              {t('auth.login.heading')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.login.subheading')}
            </p>
          </div>

          <form onSubmit={handleLoginClick} className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border bg-card p-8">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t('auth.login.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('auth.login.emailPlaceholder')}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t('auth.login.passwordLabel')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.login.submitting')}
                  </>
                ) : (
                  t('auth.login.submitButton')
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
              <Link
                href="/signup"
                className="text-accent underline underline-offset-2 hover:text-accent/80"
              >
                {t('auth.login.signupLink')}
              </Link>
            </p>

            <p className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t('auth.login.backToHome')}
              </Link>
            </p>
          </form>
        </div>
      </main>
      <SharedFooter />
    </>
  )
}
