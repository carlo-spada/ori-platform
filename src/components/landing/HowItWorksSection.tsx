import { Section } from '@/components/ui/Section';
import { useTranslation } from 'react-i18next';
import { UserCircle, Lightbulb, Send } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Profile: UserCircle,
  'Match & Learn': Lightbulb,
  'Apply Confidently': Send,
};

export function HowItWorksSection() {
  const { t } = useTranslation();
  
  const steps = [
    { icon: 'UserCircle', title: t('landing.howItWorks.0.title'), description: t('landing.howItWorks.0.description') },
    { icon: 'Lightbulb', title: t('landing.howItWorks.1.title'), description: t('landing.howItWorks.1.description') },
    { icon: 'Send', title: t('landing.howItWorks.2.title'), description: t('landing.howItWorks.2.description') },
  ];

  const iconComponents = {
    UserCircle,
    Lightbulb,
    Send,
  };

  return (
    <Section data-testid="howitworks">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {t('landing.howItWorksTitle')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('landing.howItWorksSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => {
          const Icon = iconComponents[step.icon as keyof typeof iconComponents];
          return (
            <div key={step.title} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 text-center">
                {/* Step number */}
                <div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 mb-6"
                  aria-hidden="true"
                >
                  {Icon && <Icon className="w-10 h-10 text-accent" />}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manifesto alignment caption */}
      <p className="text-center text-sm text-muted-foreground mt-12 italic max-w-2xl mx-auto">
        {t('landing.manifesto')}
      </p>
    </Section>
  );
}
