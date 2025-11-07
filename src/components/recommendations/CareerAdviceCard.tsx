import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CareerAdvice } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CareerAdviceCardProps {
  advice: CareerAdvice;
  labels: {
    categoryPrefix: string;
    learnMore: string;
  };
}

export function CareerAdviceCard({ advice, labels }: CareerAdviceCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors">
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

      <p className="text-sm text-muted-foreground line-clamp-4">
        {advice.summary}
      </p>

      {advice.detailHref && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mt-2 self-start group"
        >
          <a
            href={advice.detailHref}
            aria-label={`Learn more about ${advice.title}`}
          >
            {labels.learnMore}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>
        </Button>
      )}
    </article>
  );
}
