import { Section } from '@/components/ui/Section';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subheadline?: string;
  reassurance?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subheadline,
  reassurance,
}: PageHeaderProps) {
  return (
    <Section data-testid="page-header">
      <div className="text-center max-w-4xl mx-auto">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wider text-accent mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
          {title}
        </h1>
        {subheadline && (
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-4">
            {subheadline}
          </p>
        )}
        {reassurance && (
          <p className="text-sm text-muted-foreground/80 italic">
            {reassurance}
          </p>
        )}
      </div>
    </Section>
  );
}
