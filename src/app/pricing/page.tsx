'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Section } from '@/components/ui/Section'
import { PricingCard } from '@/components/pricing/PricingCard'
import { FeatureComparisonTable } from '@/components/pricing/FeatureComparisonTable'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { setDocumentMeta, setJSONLD } from '@/lib/seo'

type BillingPeriod = 'monthly' | 'annual'

export default function PricingPage() {
  const { t } = useTranslation()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  // Helper to safely get arrays from translations
  const safeArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? value : []
  }

  useEffect(() => {
    setDocumentMeta({
      title: t('pricingPage.header.title'),
      description: t('pricingPage.header.subheadline'),
      twitterCard: 'summary_large_image',
    })

    const paidPlans = [
      {
        name: t('pricingPage.plans.1.name'),
        price: 5,
        description: t('pricingPage.plans.1.description'),
      },
      {
        name: t('pricingPage.plans.2.name'),
        price: 10,
        description: t('pricingPage.plans.2.description'),
      },
    ]
    const jsonLdOffers = paidPlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.price,
      priceCurrency: 'USD',
      description: plan.description,
    }))

    setJSONLD({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Ori',
      description: t('pricingPage.header.subheadline'),
      offers: jsonLdOffers,
    })
  }, [t])

  const plans = safeArray<{
    id: string
    name: string
    description: string
    priceMonthly?: number
    priceAnnual?: number
    limitsSummary: string
    cta: string
    ctaHref: string
    features: string[]
    popular: boolean
  }>(t('pricingPage.plans', { returnObjects: true }))

  const comparisonFeatures = safeArray<{
    feature: string
    free: string | boolean
    plus: string | boolean
    premium: string | boolean
  }>(t('pricingPage.comparisonFeatures', { returnObjects: true }))

  const faqs = safeArray<{
    q: string
    a: string
  }>(t('pricingPage.faqs', { returnObjects: true }))

  return (
    <PublicLayout
      title="Ori Pricing | Simple, Transparent Plans"
      description="Choose the right Ori plan for your career journey. Start free and upgrade anytime with transparent pricing and no hidden fees."
    >
      {/* Page Header */}
      <Section data-testid="pricing-header" className="text-center">
        <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl">
          {t('pricingPage.header.title')}
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          {t('pricingPage.header.subheadline')}
        </p>

        {/* Billing Toggle */}
        <div className="border-border bg-card inline-flex items-center gap-3 rounded-full border px-2 py-2 shadow-sm">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`focus-visible:ring-ring rounded-full px-6 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
              billingPeriod === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-pressed={billingPeriod === 'monthly'}
          >
            {t('pricingPage.billingToggle.monthly')}
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`focus-visible:ring-ring rounded-full px-6 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
              billingPeriod === 'annual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-pressed={billingPeriod === 'annual'}
          >
            {t('pricingPage.billingToggle.annual')}
          </button>
          {billingPeriod === 'annual' && (
            <span className="bg-primary/10 text-primary ml-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
              {t('pricingPage.billingToggle.saveBadge')}
            </span>
          )}
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section data-testid="pricing-cards">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              description={plan.description}
              price={
                billingPeriod === 'monthly'
                  ? (plan.priceMonthly ?? 0)
                  : (plan.priceAnnual ?? 0)
              }
              billingPeriod={billingPeriod}
              limitsSummary={plan.limitsSummary}
              features={plan.features}
              cta={plan.cta}
              ctaHref={plan.ctaHref}
              popular={plan.popular}
            />
          ))}
        </div>
      </Section>

      {/* Feature Comparison Table */}
      <Section data-testid="feature-comparison">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-semibold sm:text-4xl">
            Compare Plans
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            A detailed breakdown of what&apos;s included in each plan.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureComparisonTable features={comparisonFeatures} />
        </div>
      </Section>

      {/* FAQ Section */}
      <Section data-testid="pricing-faq">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-semibold sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Everything you need to know about Ori pricing.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-foreground hover:text-accent text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </PublicLayout>
  )
}
