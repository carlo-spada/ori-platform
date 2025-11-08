'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { setDocumentMeta } from '@/lib/seo'
import {
  RecommendationType,
  JobRecommendation,
  CareerAdvice,
} from '@/lib/types'
import { JobRecommendationCard } from '@/components/recommendations/JobRecommendationCard'
import { CareerAdviceCard } from '@/components/recommendations/CareerAdviceCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { fetchJobRecommendations } from '@/integrations/api/jobs'
import Link from 'next/link'

// Mock career advice data (jobs are now fetched from API)
const MOCK_CAREER_ADVICE: CareerAdvice[] = [
  {
    id: '1',
    title: 'Building a Compelling Design Portfolio',
    summary:
      'Learn how to showcase your best work and tell compelling stories that resonate with hiring managers. Focus on impact, process, and outcomes.',
    category: 'Career Growth',
    detailHref: '#',
  },
  {
    id: '2',
    title: 'Transitioning from IC to Management',
    summary:
      'Key skills and mindset shifts for moving into a design leadership role. Understand delegation, mentorship, and strategic thinking.',
    category: 'Leadership',
    detailHref: '#',
  },
  {
    id: '3',
    title: 'Mastering Design System Thinking',
    summary:
      'Develop expertise in creating scalable design systems. Learn component architecture, documentation, and cross-team collaboration.',
    category: 'Upskilling',
    detailHref: '#',
  },
  {
    id: '4',
    title: 'Networking Strategies for Designers',
    summary:
      'Build meaningful professional relationships that accelerate your career. Learn to connect authentically without feeling salesy.',
    category: 'Networking',
    detailHref: '#',
  },
]

export default function Recommendations() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [recommendationType, setRecommendationType] =
    useState<RecommendationType>('jobs')
  const [careerAdvice] = useState<CareerAdvice[]>(MOCK_CAREER_ADVICE)

  // Fetch job recommendations from API
  const {
    data: jobMatchData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useQuery({
    queryKey: ['jobRecommendations', user?.id],
    queryFn: () => fetchJobRecommendations({ userId: user!.id, limit: 6 }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Transform API data to JobRecommendation format
  const jobRecommendations: JobRecommendation[] =
    jobMatchData?.matches.map((match) => ({
      id: match.id,
      title: match.title,
      company: match.company,
      location: match.location,
      matchScore: match.matchScore,
      summary: match.description || `Join ${match.company} as a ${match.title}`,
      datePosted: match.posted_date || match.created_at,
      detailHref: `/app/jobs/${match.id}`,
      skills_analysis: match.skills_analysis,
      skillsGap: match.skillsGap,
      // applyHref: match.apply_url, // Removed: field not present in API response
    })) || []

  useEffect(() => {
    setDocumentMeta({
      title: 'Recommendations - Ori',
      description: 'Personalized job recommendations and learning paths.',
    })
  }, [])

  const renderJobsView = () => {
    // Loading state
    if (isLoadingJobs) {
      return (
        <div className="border-border bg-card space-y-4 rounded-2xl border p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="bg-muted mx-auto h-8 w-1/4 rounded" />
            <div className="bg-muted mx-auto h-4 w-1/2 rounded" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Error state
    if (jobsError) {
      return (
        <div className="border-border bg-card space-y-4 rounded-2xl border p-8 text-center">
          <h2 className="text-foreground text-xl font-semibold">
            Failed to load recommendations
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {jobsError instanceof Error
              ? jobsError.message
              : 'An error occurred while fetching job recommendations'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )
    }

    // Empty state
    if (jobRecommendations.length === 0) {
      return (
        <div className="border-border bg-card space-y-4 rounded-2xl border p-8 text-center">
          <h2 className="text-foreground text-xl font-semibold">
            {t('recommendationsPage.jobs.emptyTitle')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {t('recommendationsPage.jobs.emptyBody')}
          </p>
          <Button asChild>
            <Link href="/app/profile">
              {t('recommendationsPage.jobs.improveProfileLabel')}
            </Link>
          </Button>
        </div>
      )
    }

    // Success state - display job recommendations
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">
            {t('recommendationsPage.jobs.heading')}
          </h2>
          {jobMatchData?.usage && (
            <p className="text-muted-foreground text-sm">
              {t('recommendationsPage.jobs.usageLabel', {
                used: jobMatchData.usage.used,
                limit: jobMatchData.usage.limit,
              })}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {jobRecommendations.map((job) => (
            <JobRecommendationCard
              key={job.id}
              job={job}
              labels={{
                matchLabel: t('recommendationsPage.jobs.matchLabel'),
                datePostedLabel: t('recommendationsPage.jobs.datePostedLabel'),
                viewDetails: t('recommendationsPage.jobs.viewDetailsLabel'),
                applyNow: t('recommendationsPage.jobs.applyNowLabel'),
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderAdviceView = () => {
    if (careerAdvice.length === 0) {
      return (
        <div className="border-border bg-card space-y-4 rounded-2xl border p-8 text-center">
          <h2 className="text-foreground text-xl font-semibold">
            {t('recommendationsPage.advice.emptyTitle')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {t('recommendationsPage.advice.emptyBody')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <h2 className="text-foreground text-xl font-semibold">
          {t('recommendationsPage.advice.heading')}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {careerAdvice.map((advice) => (
            <CareerAdviceCard
              key={advice.id}
              advice={advice}
              labels={{
                categoryPrefix: t('recommendationsPage.advice.categoryPrefix'),
                learnMore: t('recommendationsPage.advice.learnMoreLabel'),
              }}
            />
          ))}
        </div>
        <div className="border-border border-t pt-4 text-center">
          <p className="text-muted-foreground mb-2 text-sm">
            {t('recommendationsPage.advice.exploreMoreCopy')}
          </p>
          <Button variant="link" asChild>
            <a href="#">{t('recommendationsPage.advice.exploreMoreLabel')}</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          {t('recommendationsPage.header.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('recommendationsPage.header.subtitle')}
        </p>
      </header>

      <div className="mb-2 flex gap-2">
        <Button
          variant={recommendationType === 'jobs' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setRecommendationType('jobs')}
        >
          {t('recommendationsPage.jobs.heading')}
        </Button>
        <Button
          variant={recommendationType === 'advice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setRecommendationType('advice')}
        >
          {t('recommendationsPage.advice.heading')}
        </Button>
      </div>

      <section className="border-border bg-card flex-1 overflow-y-auto rounded-2xl border p-4 sm:p-6">
        {recommendationType === 'jobs' ? renderJobsView() : renderAdviceView()}
      </section>
    </div>
  )
}
