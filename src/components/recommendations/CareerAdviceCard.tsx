import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CareerAdvice } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

interface CareerAdviceCardProps {
  advice: CareerAdvice
  labels: {
    categoryPrefix: string
    learnMore: string
  }
}

export function CareerAdviceCard({ advice, labels }: CareerAdviceCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-card/80">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          {advice.title}
        </h3>
        {advice.category && (
          <Badge variant="outline" className="shrink-0">
            {advice.category}
          </Badge>
        )}
      </div>

      <p className="line-clamp-4 text-sm text-muted-foreground">
        {advice.summary}
      </p>

      {advice.detailHref && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group mt-2 self-start"
        >
          <a
            href={advice.detailHref}
            aria-label={`Learn more about ${advice.title}`}
          >
            {labels.learnMore}
            <ArrowRight
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Button>
      )}
    </article>
  )
}
