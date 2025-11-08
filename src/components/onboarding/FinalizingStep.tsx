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
        <p className="text-muted-foreground max-w-md text-base">{copy.body}</p>
      </div>

      {isLoading && (
        <div
          className="flex items-center justify-center gap-2"
          aria-label="Loading"
        >
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full [animation-delay:0ms]" />
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full [animation-delay:150ms]" />
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full [animation-delay:300ms]" />
        </div>
      )}
    </div>
  )
}
