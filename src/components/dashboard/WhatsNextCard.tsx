import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface WhatsNextCardProps {
  title: string;
  message: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * "What's Next" card showing the user's current focus and recommended action.
 * Appears in the left column of the dashboard.
 */
export function WhatsNextCard({
  title,
  message,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: WhatsNextCardProps) {
  return (
    <div
      className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 flex flex-col gap-4 h-full overflow-hidden"
      data-testid="whats-next-card"
    >
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
        <Button
          asChild
          size="lg"
          className="gradient-primary shadow-sm hover:opacity-95 transition-opacity"
        >
          <Link href={primaryCtaHref}>
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>

        {secondaryCtaLabel && secondaryCtaHref && (
          <Button asChild variant="ghost" size="lg">
            <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
