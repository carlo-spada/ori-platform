import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Quote } from 'lucide-react';

export function SocialProofSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t('landing.testimonials.0.quote'),
      author: t('landing.testimonials.0.author'),
      role: t('landing.testimonials.0.role'),
    },
    {
      quote: t('landing.testimonials.1.quote'),
      author: t('landing.testimonials.1.author'),
      role: t('landing.testimonials.1.role'),
    },
    {
      quote: t('landing.testimonials.2.quote'),
      author: t('landing.testimonials.2.author'),
      role: t('landing.testimonials.2.role'),
    },
  ];

  return (
    <Section data-testid="socialproof" className="bg-surface/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {t('landing.testimonialsTitle')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('landing.testimonialsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="p-6 bg-card border-border hover:border-accent/50 transition-colors duration-200"
          >
            <Quote className="w-8 h-8 text-accent/30 mb-4" aria-hidden="true" />
            <blockquote className="text-base text-foreground leading-relaxed mb-4">
              &quot;{testimonial.quote}&quot;
            </blockquote>
            <div className="mt-4 pt-4 border-t border-border">
              <cite className="not-italic">
                <p className="font-medium text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </cite>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
