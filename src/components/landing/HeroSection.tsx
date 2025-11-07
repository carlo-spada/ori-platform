import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/Section';
import { Illustration } from './Illustration';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <Section
      data-testid="hero"
      className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Illustration />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <p className="text-sm sm:text-base font-medium text-accent mb-4 uppercase tracking-wide">
          {t('landing.hero.eyebrow')}
        </p>

        <h1
          data-testid="hero-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6"
        >
          {t('landing.hero.headline')}
        </h1>

        <p
          data-testid="hero-subtitle"
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto"
        >
          {t('landing.hero.subheadline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto"
            data-testid="hero-primary-cta"
          >
            <Link href="/signup">{t('landing.hero.primaryCta')}</Link>
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
        <p className="text-sm text-muted-foreground">{t('landing.hero.reassurance')}</p>
      </div>
    </Section>
  );
}
