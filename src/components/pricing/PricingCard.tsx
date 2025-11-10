import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PricingCardProps {
  id: string
  name: string
  description: string
  price: number
  billingPeriod: 'monthly' | 'annual'
  limitsSummary: string
  features: string[]
  cta: string
  ctaHref: string
  popular?: boolean
}

export function PricingCard({
  id,
  name,
  description,
  price,
  billingPeriod,
  limitsSummary,
  features,
  cta,
  ctaHref,
  popular = false,
}: PricingCardProps) {
  const priceDisplay = price === 0 ? 'Free' : `$${price}`
  const periodText =
    billingPeriod === 'annual' ? 'month (billed annually)' : 'month'

  return (
    <div
      className={cn(
        'relative flex h-full flex-col justify-between rounded-2xl border bg-card p-8 shadow-md transition-all duration-200',
        popular
          ? 'scale-[1.02] border-primary shadow-primary/20'
          : 'border-border hover:border-accent/50',
      )}
      data-testid={`pricing-card-${id}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex-1">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            {name}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="mb-6">
          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">
              {priceDisplay}
            </span>
            {price > 0 && (
              <span className="text-sm text-muted-foreground">
                / {periodText}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{limitsSummary}</p>
        </div>

        <ul className="mb-6 space-y-3" role="list">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        asChild
        variant={popular ? 'default' : 'outline'}
        size="lg"
        className="w-full"
      >
        <a href={ctaHref}>{cta}</a>
      </Button>
    </div>
  )
}
