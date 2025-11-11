'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { HeroSection } from '@/components/landing/HeroSection'
import { ValuePropositionSection } from '@/components/landing/ValuePropositionSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { BottomCTASection } from '@/components/landing/BottomCTASection'
import { setDocumentMeta, setJSONLD } from '@/lib/seo'

const Index = () => {
  const { t } = useTranslation()

  // Set SEO meta tags and JSON-LD on mount
  useEffect(() => {
    setDocumentMeta({
      title: t('seo.landing.title'),
      description: t('seo.landing.description'),
      ogType: 'website',
      twitterCard: 'summary_large_image',
    })

    setJSONLD({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('seo.landing.jsonld.name'),
      description: t('seo.landing.jsonld.description'),
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    })
  }, [t])

  return (
    <PublicLayout>
      <HeroSection />
      <ValuePropositionSection />
      <HowItWorksSection />
      <SocialProofSection />
      <FAQSection />
      <BottomCTASection />
    </PublicLayout>
  )
}

export default Index
