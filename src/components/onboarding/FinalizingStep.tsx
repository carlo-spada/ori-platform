interface FinalizingStepProps {
  copy: {
    headline: string;
    body: string;
  };
  isLoading: boolean;
}

export function FinalizingStep({ copy, isLoading }: FinalizingStepProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          {copy.headline}
        </h2>
        <p className="text-base text-muted-foreground max-w-md">
          {copy.body}
        </p>
      </div>
      
      {isLoading && (
        <div className="flex gap-2 items-center justify-center" aria-label="Loading">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0ms]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
        </div>
      )}
    </div>
  );
}
