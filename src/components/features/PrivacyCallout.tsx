import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface PrivacyCalloutProps {
  title: string
  description?: string
  bullets: string[]
  linkText: string
  linkHref: string
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
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-muted/5 p-8 sm:p-12">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Shield className="h-6 w-6 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">
                {title}
              </h2>
              {description && (
                <p className="leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          <ul className="mb-8 space-y-3" role="list">
            {bullets.map((bullet, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
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
  )
}
