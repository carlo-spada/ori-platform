import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PrivacyCalloutProps {
  title: string;
  description?: string;
  bullets: string[];
  linkText: string;
  linkHref: string;
}

export function PrivacyCallout({
  title,
  description,
  bullets,
  linkText,
  linkHref,
}: PrivacyCalloutProps) {
  return (
    <Section data-testid="privacy-callout">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-border bg-muted/5 p-8 sm:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-8" role="list">
            {bullets.map((bullet, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <CheckCircle2
                  className="w-5 h-5 text-accent shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>

          <Button variant="outline" asChild>
            <Link href={linkHref}>{linkText}</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
