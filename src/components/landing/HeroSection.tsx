import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/Section'
import { Illustration } from './Illustration'
import { EarlyAccessModal } from '@/components/EarlyAccessModal'

export function HeroSection() {
  const { t } = useTranslation()
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false)

  return (
    <Section
      data-testid="hero"
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden"
    >
      {/* Background illustration */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Illustration />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-accent sm:text-base">
          {t('landing.hero.eyebrow')}
        </p>

        <h1
          data-testid="hero-title"
          className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {t('landing.hero.headline')}
        </h1>

        <p
          data-testid="hero-subtitle"
          className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {t('landing.hero.subheadline')}
        </p>

        {/* CTAs */}
        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            data-testid="hero-primary-cta"
            onClick={() => setShowEarlyAccessModal(true)}
          >
            {t('landing.hero.primaryCta')}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            data-testid="hero-secondary-cta"
          >
            <Link href="/features">{t('landing.hero.secondaryCta')}</Link>
          </Button>
        </div>

        {/* Reassurance */}
        <p className="text-sm text-muted-foreground">
          {t('landing.hero.reassurance')}
        </p>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
        trigger="hero"
      />
    </Section>
  )
}
