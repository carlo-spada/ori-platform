import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PricingCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  limitsSummary: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
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
  const priceDisplay = price === 0 ? 'Free' : `$${price}`;
  const periodText = billingPeriod === 'annual' ? 'month (billed annually)' : 'month';

  return (
    <div
      className={cn(
        'relative flex h-full flex-col justify-between rounded-2xl border bg-card p-8 shadow-md transition-all duration-200',
        popular
          ? 'border-primary shadow-primary/20 scale-[1.02]'
          : 'border-border hover:border-accent/50'
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
          <h2 className="text-2xl font-semibold text-foreground mb-2">{name}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold text-foreground">{priceDisplay}</span>
            {price > 0 && (
              <span className="text-sm text-muted-foreground">/ {periodText}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{limitsSummary}</p>
        </div>

        <ul className="space-y-3 mb-6" role="list">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                className="h-5 w-5 text-primary shrink-0 mt-0.5"
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
  );
}
