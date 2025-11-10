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
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subheadline && (
          <p className="mb-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {subheadline}
          </p>
        )}
        {reassurance && (
          <p className="text-sm italic text-muted-foreground/80">
            {reassurance}
          </p>
        )}
      </div>
    </Section>
  )
}
