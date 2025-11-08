import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, FileText, Activity } from 'lucide-react';

export function ValuePropositionSection() {
  const { t } = useTranslation();
  
  const values = [
    { 
      icon: 'Target',
      title: t('landing.values.0.title'),
      description: t('landing.values.0.description')
    },
    { 
      icon: 'TrendingUp',
      title: t('landing.values.1.title'),
      description: t('landing.values.1.description')
    },
    { 
      icon: 'FileText',
      title: t('landing.values.2.title'),
      description: t('landing.values.2.description')
    },
    { 
      icon: 'Activity',
      title: t('landing.values.3.title'),
      description: t('landing.values.3.description')
    },
  ];

  const iconComponents = {
    Target,
    TrendingUp,
    FileText,
    Activity,
  };

  return (
    <Section data-testid="values" className="bg-surface/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {t('landing.whyOri.title')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('landing.whyOri.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {values.map((value) => {
          const Icon = iconComponents[value.icon as keyof typeof iconComponents];
          return (
            <Card
              key={value.title}
              className="p-6 bg-card border-border hover:border-accent/50 transition-colors duration-200"
            >
              {Icon && (
                <div
                  className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10"
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 text-accent" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
