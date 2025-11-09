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
            <p className="text-accent text-sm font-medium tracking-wider uppercase">
              {eyebrow}
            </p>
          )}
          <h2
            id={titleId}
            className="text-foreground text-3xl leading-tight font-semibold sm:text-4xl"
          >
            {name}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {description}
          </p>
          {points && points.length > 0 && (
            <ul className="space-y-3" role="list">
              {points.map((point, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-start gap-3"
                >
                  <CheckCircle2
                    className="text-accent mt-0.5 h-5 w-5 shrink-0"
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
            'border-border bg-muted/5 relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-md',
            align === 'right' && 'xl:order-1',
          )}
          aria-hidden="true"
        >
          {visual || (
            <div className="text-muted-foreground/30 absolute inset-0 flex items-center justify-center">
              <div className="space-y-2 text-center">
                <div className="bg-accent/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-accent h-8 w-8" />
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
