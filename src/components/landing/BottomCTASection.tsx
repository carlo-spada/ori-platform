import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/Section'
import { useTranslation } from 'react-i18next'
import { EarlyAccessModal } from '@/components/EarlyAccessModal'

export interface BottomCTASectionProps {
  headline?: string
  description?: string
  primaryCta?: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
  strapline?: string
}

export function BottomCTASection(props?: BottomCTASectionProps) {
  const { t } = useTranslation()
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false)

  const content = {
    headline: props?.headline ?? t('landing.bottomCta.headline'),
    description: props?.description ?? t('landing.bottomCta.description'),
    primaryCta: props?.primaryCta ?? t('landing.bottomCta.primaryCta'),
    primaryHref: props?.primaryHref ?? '/signup',
    secondaryCta: props?.secondaryCta ?? t('landing.bottomCta.secondaryCta'),
    secondaryHref: props?.secondaryHref ?? '/features',
    strapline: props?.strapline ?? t('landing.strapline'),
  }

  return (
    <Section data-testid="bottom-cta" className="bg-surface/50">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-foreground mb-4 text-3xl font-semibold sm:text-4xl">
          {content.headline}
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          {content.description}
        </p>

        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setShowEarlyAccessModal(true)}
          >
            {content.primaryCta}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href={content.secondaryHref}>{content.secondaryCta}</Link>
          </Button>
        </div>

        <p className="text-muted-foreground text-sm italic">
          {content.strapline}
        </p>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
        trigger="bottom-cta"
      />
    </Section>
  )
}
