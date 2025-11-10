interface FinalizingStepProps {
  copy: {
    headline: string
    body: string
  }
  isLoading: boolean
}

export function FinalizingStep({ copy, isLoading }: FinalizingStepProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold sm:text-3xl">{copy.headline}</h2>
        <p className="max-w-md text-base text-muted-foreground">{copy.body}</p>
      </div>

      {isLoading && (
        <div
          className="flex items-center justify-center gap-2"
          aria-label="Loading"
        >
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0ms]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
      )}
    </div>
  )
}
