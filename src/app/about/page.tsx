'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/button'
import { ValueCard } from '@/components/about/ValueCard'
import { setDocumentMeta } from '@/lib/seo'

export default function AboutPage() {
  const { t } = useTranslation()

  // Set SEO metadata
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocumentMeta({
        title: t('aboutPage.title'),
        description: t('aboutPage.description'),
        canonical: `${window.location.origin}/about`,
      })
    }
  }, [t])

  // Helper to safely get arrays from translations
  const safeArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? value : []
  }

  return (
    <PublicLayout>
      {/* Page Header */}
      <Section data-testid="about-header" className="text-center">
        {t('aboutPage.header.eyebrow') && (
          <p className="text-primary mb-3 text-sm font-medium tracking-wide uppercase">
            {t('aboutPage.header.eyebrow')}
          </p>
        )}
        <h1 className="text-foreground mx-auto mb-6 max-w-4xl text-4xl font-bold sm:text-5xl lg:text-6xl">
          {t('aboutPage.header.title')}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
          {t('aboutPage.header.subheadline')}
        </p>
      </Section>

      {/* The Problem Section */}
      <Section data-testid="about-problem" className="max-w-4xl">
        <h2 className="text-foreground mb-8 text-3xl font-bold sm:text-4xl">
          {t('aboutPage.problem.title')}
        </h2>
        <div className="space-y-6">
          {safeArray<string>(
            t('aboutPage.problem.paragraphs', { returnObjects: true }),
          ).map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* The Vision Section */}
      <Section data-testid="about-vision" className="max-w-4xl">
        <h2 className="text-foreground mb-8 text-3xl font-bold sm:text-4xl">
          {t('aboutPage.vision.title')}
        </h2>
        <div className="space-y-6">
          {safeArray<string>(
            t('aboutPage.vision.paragraphs', { returnObjects: true }),
          ).map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* Our Values Section */}
      <Section data-testid="about-values" className="max-w-6xl">
        <h2 className="text-foreground mb-12 text-center text-3xl font-bold sm:text-4xl">
          {t('aboutPage.values.title')}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {safeArray<{ name: string; description: string }>(
            t('aboutPage.values.items', { returnObjects: true }),
          ).map((value, index) => (
            <ValueCard
              key={index}
              name={value.name}
              description={value.description}
            />
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section data-testid="about-cta" className="max-w-3xl text-center">
        <h2 className="text-foreground mb-6 text-3xl font-bold sm:text-4xl">
          {t('aboutPage.cta.title')}
        </h2>
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
          {t('aboutPage.cta.body')}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[200px]">
            <a href="/pricing">{t('aboutPage.cta.primaryLabel')}</a>
          </Button>
          {t('aboutPage.cta.secondaryLabel') && (
            <Button asChild variant="ghost" size="lg">
              <a href="/features">{t('aboutPage.cta.secondaryLabel')}</a>
            </Button>
          )}
        </div>
      </Section>
    </PublicLayout>
  )
}
