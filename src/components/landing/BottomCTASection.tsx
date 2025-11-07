import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/Section';
import { useTranslation } from 'react-i18next';

export interface BottomCTASectionProps {
  headline?: string;
  description?: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  strapline?: string;
}

export function BottomCTASection(props?: BottomCTASectionProps) {
  const { t } = useTranslation();
  
  const content = {
    headline: props?.headline ?? t('landing.bottomCta.headline'),
    description: props?.description ?? t('landing.bottomCta.description'),
    primaryCta: props?.primaryCta ?? t('landing.bottomCta.primaryCta'),
    primaryHref: props?.primaryHref ?? '/signup',
    secondaryCta: props?.secondaryCta ?? t('landing.bottomCta.secondaryCta'),
    secondaryHref: props?.secondaryHref ?? '/features',
    strapline: props?.strapline ?? t('landing.strapline'),
  };

  return (
    <Section data-testid="bottom-cta" className="bg-surface/50">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {content.headline}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">{content.description}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={content.primaryHref}>{content.primaryCta}</Link>
          </Button>

          <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
            <Link href={content.secondaryHref}>{content.secondaryCta}</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground italic">{content.strapline}</p>
      </div>
    </Section>
  );
}
