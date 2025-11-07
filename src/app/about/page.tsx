'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ValueCard } from '@/components/about/ValueCard';
import { setDocumentMeta } from '@/lib/seo';

export default function AboutPage() {
  const { t } = useTranslation();

  // Set SEO metadata
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocumentMeta({
        title: t('aboutPage.title'),
        description: t('aboutPage.description'),
        canonical: `${window.location.origin}/about`,
      });
    }
  }, [t]);

  // Helper to safely get arrays from translations
  const safeArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? value : [];
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <Section data-testid="about-header" className="text-center">
        {t('aboutPage.header.eyebrow') && (
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
            {t('aboutPage.header.eyebrow')}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto">
          {t('aboutPage.header.title')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t('aboutPage.header.subheadline')}
        </p>
      </Section>

      {/* The Problem Section */}
      <Section data-testid="about-problem" className="max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {t('aboutPage.problem.title')}
        </h2>
        <div className="space-y-6">
          {safeArray<string>(t('aboutPage.problem.paragraphs', { returnObjects: true })).map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* The Vision Section */}
      <Section data-testid="about-vision" className="max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {t('aboutPage.vision.title')}
        </h2>
        <div className="space-y-6">
          {safeArray<string>(t('aboutPage.vision.paragraphs', { returnObjects: true })).map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* Our Values Section */}
      <Section data-testid="about-values" className="max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
          {t('aboutPage.values.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeArray<{ name: string; description: string }>(t('aboutPage.values.items', { returnObjects: true })).map((value, index) => (
            <ValueCard
              key={index}
              name={value.name}
              description={value.description}
            />
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section data-testid="about-cta" className="text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          {t('aboutPage.cta.title')}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {t('aboutPage.cta.body')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
  );
}