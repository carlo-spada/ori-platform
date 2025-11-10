import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

export interface FeatureSectionProps {
  id: string
  eyebrow?: string
  name: string
  description: string
  points?: string[]
  visual?: React.ReactNode
  align?: 'left' | 'right'
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
  const titleId = `${id}-title`

  return (
    <Section
      id={id}
      data-testid={`feature-section-${id}`}
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          'grid items-center gap-12 lg:gap-16',
          'grid-cols-1 xl:grid-cols-2',
        )}
      >
        {/* Content */}
        <div className={cn('space-y-6', align === 'right' && 'xl:order-2')}>
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h2
            id={titleId}
            className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {name}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
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
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
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
            'relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted/5 shadow-md',
            align === 'right' && 'xl:order-1',
          )}
          aria-hidden="true"
        >
          {visual || (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <p className="text-sm font-medium">{name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
