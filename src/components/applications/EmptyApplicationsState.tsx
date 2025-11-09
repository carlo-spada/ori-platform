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
      <div className="bg-muted/20 mb-2 rounded-full p-4">
        <FileText
          className="text-muted-foreground h-8 w-8"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-foreground text-lg font-semibold">{headline}</h2>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
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
