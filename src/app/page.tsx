'use client';

import { useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValuePropositionSection } from '@/components/landing/ValuePropositionSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { BottomCTASection } from '@/components/landing/BottomCTASection';
import { setDocumentMeta, setJSONLD } from '@/lib/seo';

const Index = () => {
  // Set SEO meta tags and JSON-LD on mount
  useEffect(() => {
    setDocumentMeta({
      title: 'AURA - Your AI Career Companion',
      description:
        'Unlock your potential with AURA, the AI-powered platform for discovering, pursuing, and evolving within roles that fit your skills, values, and ambitions.',
      ogType: 'website',
      twitterCard: 'summary_large_image',
    });

    // Note: JSON-LD would need to be converted to use t() as well, but for now keeping static
    setJSONLD({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AURA",
      "description": "AI-powered career companion for personalized job discovery and professional growth",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });
  }, []);

  return (
    <PublicLayout>
      <HeroSection />
      <ValuePropositionSection />
      <HowItWorksSection />
      <SocialProofSection />
      <FAQSection />
      <BottomCTASection />
    </PublicLayout>
  );
};

export default Index;