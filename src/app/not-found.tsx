'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFound = () => {
  const { t } = useTranslation()
  const pathname = usePathname()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      pathname,
    )
  }, [pathname])

  return (
    <PublicLayout
      title={t('notFound.seo.title')}
      description={t('notFound.seo.description')}
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-2 text-sm text-muted-foreground">404</p>
        <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">
          {t('notFound.heading')}
        </h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          {t('notFound.body')}
        </p>
        <Button asChild>
          <Link href="/">{t('notFound.primaryCtaLabel')}</Link>
        </Button>
      </div>
    </PublicLayout>
  )
}

export default NotFound
