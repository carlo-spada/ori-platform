import { Section } from '@/components/ui/Section'
import { useTranslation } from 'react-i18next'
import { UserCircle, Lightbulb, Send } from 'lucide-react'

export function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: 'UserCircle',
      title: t('landing.howItWorks.0.title'),
      description: t('landing.howItWorks.0.description'),
    },
    {
      icon: 'Lightbulb',
      title: t('landing.howItWorks.1.title'),
      description: t('landing.howItWorks.1.description'),
    },
    {
      icon: 'Send',
      title: t('landing.howItWorks.2.title'),
      description: t('landing.howItWorks.2.description'),
    },
  ]

  const iconComponents = {
    UserCircle,
    Lightbulb,
    Send,
  }

  return (
    <Section data-testid="howitworks">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
          {t('landing.howItWorksTitle')}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('landing.howItWorksSubtitle')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = iconComponents[step.icon as keyof typeof iconComponents]
          return (
            <div key={step.title} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[60%] top-12 hidden h-px w-[80%] bg-border md:block"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 text-center">
                {/* Step number */}
                <div
                  className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/20 bg-accent/10"
                  aria-hidden="true"
                >
                  {Icon && <Icon className="h-10 w-10 text-accent" />}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {index + 1}. {step.title}
                </h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Manifesto alignment caption */}
      <p className="mx-auto mt-12 max-w-2xl text-center text-sm italic text-muted-foreground">
        {t('landing.manifesto')}
      </p>
    </Section>
  )
}
