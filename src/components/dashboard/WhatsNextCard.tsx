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
      className="border-border from-card via-card to-card/50 relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm"
      data-testid="whats-next-card"
    >
      {/* Subtle decorative element */}
      <div className="bg-primary/5 absolute top-0 right-0 -z-10 h-32 w-32 rounded-full blur-3xl" />

      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="text-primary h-4 w-4" />
            </div>
            <h2 className="text-foreground text-xl font-semibold sm:text-2xl">
              {title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="border-border flex flex-col items-stretch gap-3 border-t pt-4 sm:flex-row sm:items-center">
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
