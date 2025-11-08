import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

interface EmptyApplicationsStateProps {
  headline: string
  message: string
  ctaLabel: string
}

export function EmptyApplicationsState({
  headline,
  message,
  ctaLabel,
}: EmptyApplicationsStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="mb-2 rounded-full bg-muted/20 p-4">
        <FileText
          className="h-8 w-8 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{headline}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button disabled className="mt-2">
              {ctaLabel}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{t('tooltips.comingSoon')}</TooltipContent>
      </Tooltip>
    </div>
  )
}
