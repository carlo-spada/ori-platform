import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  copy: {
    headline: string;
    body: string;
    primaryButton: string;
  };
  onNext: () => void;
}

export function WelcomeStep({ copy, onNext }: WelcomeStepProps) {
  // Note: headline interpolation is handled by parent component passing pre-formatted copy
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {copy.headline}
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          {copy.body}
        </p>
      </div>
      <div className="flex justify-center pt-4">
        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          {copy.primaryButton}
        </Button>
      </div>
    </div>
  );
}
