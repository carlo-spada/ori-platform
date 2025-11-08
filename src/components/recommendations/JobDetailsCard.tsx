import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { JobRecommendation } from '@/lib/types'

export interface JobDetailsCardProps {
  job: JobRecommendation
}

export function JobDetailsCard({ job }: JobDetailsCardProps) {
  const { t } = useTranslation()

  const hasAnyDetails = job.datePosted || job.employmentType || job.salaryRange

  if (!hasAnyDetails) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('jobDetailPage.details.heading')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {job.datePosted && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {t('jobDetailPage.details.datePosted')}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(job.datePosted), 'PPP')}
            </span>
          </div>
        )}
        {job.employmentType && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {t('jobDetailPage.details.employmentType')}
            </span>
            <span className="text-sm text-muted-foreground">
              {job.employmentType}
            </span>
          </div>
        )}
        {job.salaryRange && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {t('jobDetailPage.details.salaryRange')}
            </span>
            <span className="text-sm text-muted-foreground">
              {job.salaryRange}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
