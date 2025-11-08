import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobRecommendation } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SkillsGapDisplay } from './SkillsGapDisplay';

interface JobRecommendationCardProps {
  job: JobRecommendation;
  labels: {
    matchLabel: string;
    datePostedLabel: string;
    viewDetails: string;
    applyNow: string;
  };
}

export function JobRecommendationCard({ job, labels }: JobRecommendationCardProps) {
  const datePostedText = labels.datePostedLabel.replace(
    '{date}',
    formatDistanceToNow(new Date(job.datePosted), { addSuffix: true })
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{job.company}</span>
            {job.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.h-3.5" aria-hidden="true" />
                  {job.location}
                </span>
              </>
            )}
          </div>
        </div>
        {job.matchScore !== undefined && (
          <Badge variant="secondary" className="shrink-0">
            {labels.matchLabel.replace('{score}', job.matchScore.toString())}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3">
        {job.summary}
      </p>

      <SkillsGapDisplay skills={job.skills_analysis || []} />

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="w-3.h-3.5" aria-hidden="true" />
        <time dateTime={job.datePosted}>{datePostedText}</time>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {job.applyHref && (
          <Button
            asChild
            size="sm"
            className="flex-1"
          >
            <a
              href={job.applyHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Apply for ${job.title} at ${job.company}`}
            >
              {labels.applyNow}
            </a>
          </Button>
        )}
        {job.detailHref && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <a
              href={job.detailHref}
              aria-label={`View details for ${job.title}`}
            >
              {labels.viewDetails}
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
