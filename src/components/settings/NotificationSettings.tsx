import { NotificationPreferences } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface NotificationSettingsProps {
  value: NotificationPreferences
  labels: {
    heading: string
    description: string
    newJobRecommendations: string
    applicationStatusUpdates: string
    insightsAndTips: string
    saveButton: string
  }
  onChange?: (value: NotificationPreferences) => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

export function NotificationSettings({
  value,
  labels,
  onChange,
  onSubmit,
  isSubmitting = false,
}: NotificationSettingsProps) {
  const handleToggle = (key: keyof NotificationPreferences) => {
    onChange?.({
      ...value,
      [key]: !value[key],
    })
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <div>
        <h2 className="text-foreground mb-1 text-xl font-semibold">
          {labels.heading}
        </h2>
        <p className="text-muted-foreground text-sm">{labels.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label
              htmlFor="new-job-recommendations"
              className="cursor-pointer text-sm font-medium"
            >
              {labels.newJobRecommendations}
            </Label>
          </div>
          <Switch
            id="new-job-recommendations"
            checked={value.newJobRecommendations}
            onCheckedChange={() => handleToggle('newJobRecommendations')}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label
              htmlFor="application-status-updates"
              className="cursor-pointer text-sm font-medium"
            >
              {labels.applicationStatusUpdates}
            </Label>
          </div>
          <Switch
            id="application-status-updates"
            checked={value.applicationStatusUpdates}
            onCheckedChange={() => handleToggle('applicationStatusUpdates')}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label
              htmlFor="insights-and-tips"
              className="cursor-pointer text-sm font-medium"
            >
              {labels.insightsAndTips}
            </Label>
          </div>
          <Switch
            id="insights-and-tips"
            checked={value.insightsAndTips}
            onCheckedChange={() => handleToggle('insightsAndTips')}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {labels.saveButton}
        </Button>
      </div>
    </section>
  )
}
