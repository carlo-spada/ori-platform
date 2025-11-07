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
    setDocumentMeta({
      title: 'Features - AURA | Intelligent Career Co-pilot',
      description: t('featuresPage.header.subheadline'),
      ogType: 'website',
      canonical: window.location.href,
    });
  }, [t]);

  const features = t('featuresPage.features', { returnObjects: true }) as Array<{
    id: string;
    eyebrow: string;
    name: string;
    description: string;
    points: string[];
  }>;

  const tocItems = t('featuresPage.toc', { returnObjects: true }) as Array<{
    id: string;
    label: string;
  }>;

  const privacyBullets = t('featuresPage.privacy.bullets', { returnObjects: true }) as string[];

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