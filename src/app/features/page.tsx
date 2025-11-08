'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHeader } from '@/components/features/PageHeader';
import { FeatureToc } from '@/components/features/FeatureToc';
import { FeatureSection } from '@/components/features/FeatureSection';
import { PrivacyCallout } from '@/components/features/PrivacyCallout';
import { BottomCTASection } from '@/components/landing/BottomCTASection';
import { setDocumentMeta } from '@/lib/seo';

export default function FeaturesPage() {
  const { t } = useTranslation();

  // Set SEO meta tags
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocumentMeta({
        title: 'Features - Ori | Intelligent Career Co-pilot',
        description: t('featuresPage.header.subheadline'),
        ogType: 'website',
        canonical: window.location.href,
      });
    }
  }, [t]);

  // Helper to safely get arrays from translations
  const safeArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? value : [];
  };

  const features = safeArray<{
    id: string;
    eyebrow: string;
    name: string;
    description: string;
    points: string[];
  }>(t('featuresPage.features', { returnObjects: true }));

  const tocItems = safeArray<{
    id: string;
    label: string;
  }>(t('featuresPage.toc', { returnObjects: true }));

  const privacyBullets = safeArray<string>(t('featuresPage.privacy.bullets', { returnObjects: true }));

  return (
    <PublicLayout>
      <PageHeader
        eyebrow={t('featuresPage.header.eyebrow')}
        title={t('featuresPage.header.title')}
        subheadline={t('featuresPage.header.subheadline')}
        reassurance={t('featuresPage.header.reassurance')}
      />

      <FeatureToc items={tocItems} />

      {features.map((feature, index) => (
        <FeatureSection
          key={feature.id}
          id={feature.id}
          eyebrow={feature.eyebrow}
          name={feature.name}
          description={feature.description}
          points={feature.points}
          align={index % 2 === 0 ? 'left' : 'right'}
        />
      ))}

      <PrivacyCallout
        title={t('featuresPage.privacy.title')}
        bullets={privacyBullets}
        linkText={t('featuresPage.privacy.linkText')}
        linkHref={t('featuresPage.privacy.linkHref')}
      />

      <BottomCTASection
        headline={t('featuresPage.bottomCta.title')}
        description={t('featuresPage.bottomCta.description')}
        primaryCta={t('featuresPage.bottomCta.primaryCta')}
        primaryHref={t('featuresPage.bottomCta.primaryHref')}
        secondaryCta={t('featuresPage.bottomCta.secondaryCta')}
        secondaryHref={t('featuresPage.bottomCta.secondaryHref')}
        strapline={t('landing.strapline')}
      />
    </PublicLayout>
  );
}
