import { Button } from '@/components/ui/button'

interface WelcomeStepProps {
  copy: {
    headline: string
    body: string
    primaryButton: string
  }
  onNext: () => void
}

export function WelcomeStep({ copy, onNext }: WelcomeStepProps) {
  // Note: headline interpolation is handled by parent component passing pre-formatted copy
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">{copy.headline}</h1>
        <p className="mx-auto max-w-md text-base text-muted-foreground">
          {copy.body}
        </p>
      </div>
      <div className="flex justify-center pt-4">
        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          {copy.primaryButton}
        </Button>
      </div>
    </div>
  )
}
