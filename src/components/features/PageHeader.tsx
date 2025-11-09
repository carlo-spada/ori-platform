import { Section } from '@/components/ui/Section'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  subheadline?: string
  reassurance?: string
}

export function PageHeader({
  eyebrow,
  title,
  subheadline,
  reassurance,
}: PageHeaderProps) {
  return (
    <Section data-testid="page-header">
      <div className="mx-auto max-w-4xl text-center">
        {eyebrow && (
          <p className="text-accent mb-4 text-sm font-medium tracking-wider uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-foreground mb-6 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subheadline && (
          <p className="text-muted-foreground mb-4 text-lg leading-relaxed sm:text-xl">
            {subheadline}
          </p>
        )}
        {reassurance && (
          <p className="text-muted-foreground/80 text-sm italic">
            {reassurance}
          </p>
        )}
      </div>
    </Section>
  )
}
