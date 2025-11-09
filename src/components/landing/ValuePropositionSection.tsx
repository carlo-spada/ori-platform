import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { Target, TrendingUp, FileText, Activity } from 'lucide-react'

export function ValuePropositionSection() {
  const { t } = useTranslation()

  const values = [
    {
      icon: 'Target',
      title: t('landing.values.0.title'),
      description: t('landing.values.0.description'),
    },
    {
      icon: 'TrendingUp',
      title: t('landing.values.1.title'),
      description: t('landing.values.1.description'),
    },
    {
      icon: 'FileText',
      title: t('landing.values.2.title'),
      description: t('landing.values.2.description'),
    },
    {
      icon: 'Activity',
      title: t('landing.values.3.title'),
      description: t('landing.values.3.description'),
    },
  ]

  const iconComponents = {
    Target,
    TrendingUp,
    FileText,
    Activity,
  }

  return (
    <Section data-testid="values" className="bg-surface/50">
      <div className="mb-12 text-center">
        <h2 className="text-foreground mb-4 text-3xl font-semibold sm:text-4xl">
          {t('landing.whyOri.title')}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {t('landing.whyOri.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {values.map((value) => {
          const Icon = iconComponents[value.icon as keyof typeof iconComponents]
          return (
            <Card
              key={value.title}
              className="border-border bg-card hover:border-accent/50 p-6 transition-colors duration-200"
            >
              {Icon && (
                <div
                  className="bg-accent/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  aria-hidden="true"
                >
                  <Icon className="text-accent h-6 w-6" />
                </div>
              )}
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
