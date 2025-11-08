import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface WhatsNextCardProps {
  title: string
  message: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
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
      className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-card/50 p-6 backdrop-blur-sm"
      data-testid="whats-next-card"
    >
      {/* Subtle decorative element */}
      <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">{message}</p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
        <Button
          asChild
          size="lg"
          className="gradient-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <Link href={primaryCtaHref}>
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>

        {secondaryCtaLabel && secondaryCtaHref && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hover:bg-muted"
          >
            <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
