import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'

export function SocialProofSection() {
  const { t } = useTranslation()

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
  ]

  return (
    <Section data-testid="socialproof" className="bg-surface/50">
      <div className="mb-12 text-center">
        <h2 className="text-foreground mb-4 text-3xl font-semibold sm:text-4xl">
          {t('landing.testimonialsTitle')}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {t('landing.testimonialsSubtitle')}
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="border-border bg-card hover:border-accent/50 p-6 transition-colors duration-200"
          >
            <Quote className="text-accent/30 mb-4 h-8 w-8" aria-hidden="true" />
            <blockquote className="text-foreground mb-4 text-base leading-relaxed">
              &quot;{testimonial.quote}&quot;
            </blockquote>
            <div className="border-border mt-4 border-t pt-4">
              <cite className="not-italic">
                <p className="text-foreground font-medium">
                  {testimonial.author}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonial.role}
                </p>
              </cite>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
