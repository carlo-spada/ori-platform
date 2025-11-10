'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Home, MessageCircle } from 'lucide-react'

const NotFound = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      pathname,
    )
  }, [pathname])

  const handleGoBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home if no history
      router.push('/')
    }
  }

  return (
    <PublicLayout
      title={t('notFound.title')}
      description={t('notFound.description')}
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        {/* 404 Badge */}
        <p className="mb-2 text-sm text-muted-foreground">404</p>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">
          {t('notFound.heading')}
        </h1>

        {/* Body Text */}
        <p className="mb-8 max-w-md text-muted-foreground">
          {t('notFound.body')}
        </p>

        {/* Three CTA Options */}
        <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Primary: Take me home */}
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {t('notFound.ctas.home.label')}
                </span>
                <span className="text-xs opacity-80">
                  {t('notFound.ctas.home.description')}
                </span>
              </div>
            </Link>
          </Button>

          {/* Secondary: Guide me back */}
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {t('notFound.ctas.back.label')}
              </span>
              <span className="text-xs opacity-80">
                {t('notFound.ctas.back.description')}
              </span>
            </div>
          </Button>

          {/* Tertiary: Let me tell you */}
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/about">
              <MessageCircle className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {t('notFound.ctas.contact.label')}
                </span>
                <span className="text-xs opacity-80">
                  {t('notFound.ctas.contact.description')}
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}

export default NotFound
