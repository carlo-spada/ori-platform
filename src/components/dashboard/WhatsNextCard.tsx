import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

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
      className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm p-6 flex flex-col gap-4 h-full overflow-hidden relative"
      data-testid="whats-next-card"
    >
      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
        <Button
          asChild
          size="lg"
          className="gradient-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Link href={primaryCtaHref}>
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>

        {secondaryCtaLabel && secondaryCtaHref && (
          <Button asChild variant="outline" size="lg" className="hover:bg-muted">
            <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
