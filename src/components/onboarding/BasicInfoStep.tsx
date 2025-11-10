import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { OnboardingData } from '@/lib/types'

interface BasicInfoStepProps {
  value: OnboardingData['basicInfo']
  copy: {
    headline: string
    description: string
    headlineLabel: string
    headlinePlaceholder: string
    locationLabel: string
    locationPlaceholder: string
  }
  onChange: (value: OnboardingData['basicInfo']) => void
}

export function BasicInfoStep({ value, copy, onChange }: BasicInfoStepProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold sm:text-2xl">{copy.headline}</h2>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">{copy.headlineLabel}</Label>
          <Input
            id="headline"
            type="text"
            placeholder={copy.headlinePlaceholder}
            value={value.headline}
            onChange={(e) => onChange({ ...value, headline: e.target.value })}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{copy.locationLabel}</Label>
          <Input
            id="location"
            type="text"
            placeholder={copy.locationPlaceholder}
            value={value.location}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
