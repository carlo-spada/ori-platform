import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { JobRecommendation } from '@/lib/types'

export interface OriAnalysisCardProps {
  analysis?: JobRecommendation['analysis']
}

export function OriAnalysisCard({ analysis }: OriAnalysisCardProps) {
  const { t } = useTranslation()

  if (
    !analysis ||
    (!analysis.skillMatch &&
      !analysis.goalAlignment &&
      !analysis.companyInsight)
  ) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('jobDetailPage.analysis.heading')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.skillMatch && (
          <div className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-medium">
                {t('jobDetailPage.analysis.skillMatchLabel')}:{' '}
              </span>
              <span className="text-sm text-muted-foreground">
                {analysis.skillMatch}
              </span>
            </div>
          </div>
        )}
        {analysis.goalAlignment && (
          <div className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-medium">
                {t('jobDetailPage.analysis.goalAlignmentLabel')}:{' '}
              </span>
              <span className="text-sm text-muted-foreground">
                {analysis.goalAlignment}
              </span>
            </div>
          </div>
        )}
        {analysis.companyInsight && (
          <div className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-medium">
                {t('jobDetailPage.analysis.companyInsightLabel')}:{' '}
              </span>
              <span className="text-sm text-muted-foreground">
                {analysis.companyInsight}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
