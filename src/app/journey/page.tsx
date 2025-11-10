'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/Section'
import {
  Target,
  Lightbulb,
  Rocket,
  Users,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

const phaseIcons = {
  1: Target,
  2: Lightbulb,
  3: Rocket,
  4: Users,
  5: Sparkles,
}

const statusColors = {
  'In Progress': 'bg-accent/10 text-accent border-accent/20',
  Planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Vision: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export default function JourneyPage() {
  const { t } = useTranslation()
  const router = useRouter()

  // Get phases from translation with proper type safety
  const phasesRaw = t('journeyPage.timeline.phases', {
    returnObjects: true,
  })

  // Ensure we have an array
  const phases = (Array.isArray(phasesRaw) ? phasesRaw : []) as Array<{
    phase: string
    period: string
    status: keyof typeof statusColors
    title: string
    description: string
    milestones: string[]
  }>

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <Section className="pt-20 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            {t('journeyPage.hero.eyebrow')}
          </p>
          <h1 className="mb-6 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            {t('journeyPage.hero.headline')}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t('journeyPage.hero.subheadline')}
          </p>
        </div>
      </Section>

      {/* Why We Exist */}
      <Section className="bg-surface/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-semibold sm:text-4xl">
            {t('journeyPage.intro.title')}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('journeyPage.intro.body')}
          </p>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-semibold sm:text-4xl">
            {t('journeyPage.timeline.title')}
          </h2>

          <div className="relative space-y-12">
            {/* Vertical line for desktop */}
            <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-accent via-accent/50 to-transparent sm:left-[29px] sm:block" />

            {phases.map((phase, index) => {
              const Icon = phaseIcons[(index + 1) as keyof typeof phaseIcons]
              const isLast = index === phases.length - 1

              return (
                <div key={phase.phase} className="relative">
                  {/* Timeline node */}
                  <div className="absolute left-0 top-0 hidden sm:block">
                    <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-background bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="sm:ml-24">
                    <div
                      className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 sm:p-8 ${
                        isLast ? '' : ''
                      }`}
                    >
                      {/* Header */}
                      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {/* Mobile icon */}
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 sm:hidden">
                            <Icon className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {phase.phase} · {phase.period}
                            </p>
                            <h3 className="text-2xl font-semibold">
                              {phase.title}
                            </h3>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`w-fit ${statusColors[phase.status]}`}
                        >
                          {phase.status}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="mb-6 text-muted-foreground">
                        {phase.description}
                      </p>

                      {/* Milestones */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          Key milestones:
                        </p>
                        <ul className="space-y-2">
                          {phase.milestones.map((milestone, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                              <span className="leading-relaxed">
                                {milestone}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-surface/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">
            {t('journeyPage.cta.title')}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t('journeyPage.cta.description')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="min-w-[160px]"
            >
              {t('journeyPage.cta.primaryButton')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="min-w-[160px]"
            >
              {t('journeyPage.cta.secondaryButton')}
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
