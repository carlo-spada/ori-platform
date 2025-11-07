import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface FeatureSectionProps {
  id: string;
  eyebrow?: string;
  name: string;
  description: string;
  points?: string[];
  visual?: React.ReactNode;
  align?: 'left' | 'right';
}

export function FeatureSection({
  id,
  eyebrow,
  name,
  description,
  points,
  visual,
  align = 'left',
}: FeatureSectionProps) {
  const titleId = `${id}-title`;

  return (
    <Section
      id={id}
      data-testid={`feature-section-${id}`}
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          'grid gap-12 lg:gap-16 items-center',
          'grid-cols-1 xl:grid-cols-2'
        )}
      >
        {/* Content */}
        <div
          className={cn(
            'space-y-6',
            align === 'right' && 'xl:order-2'
          )}
        >
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h2
            id={titleId}
            className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
          >
            {name}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
          {points && points.length > 0 && (
            <ul className="space-y-3" role="list">
              {points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual */}
        <div
          className={cn(
            'relative aspect-[16/10] rounded-2xl border border-border bg-muted/5 shadow-md overflow-hidden',
            align === 'right' && 'xl:order-1'
          )}
          aria-hidden="true"
        >
          {visual || (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm font-medium">{name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
