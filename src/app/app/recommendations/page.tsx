'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { setDocumentMeta } from '@/lib/seo';
import { RecommendationType, JobRecommendation, CareerAdvice } from '@/lib/types';
import { JobRecommendationCard } from '@/components/recommendations/JobRecommendationCard';
import { CareerAdviceCard } from '@/components/recommendations/CareerAdviceCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { fetchJobRecommendations } from '@/integrations/api/jobs';
import Link from 'next/link';

// Mock career advice data (jobs are now fetched from API)
const MOCK_CAREER_ADVICE: CareerAdvice[] = [
  {
    id: '1',
    title: 'Building a Compelling Design Portfolio',
    summary: 'Learn how to showcase your best work and tell compelling stories that resonate with hiring managers. Focus on impact, process, and outcomes.',
    category: 'Career Growth',
    detailHref: '#',
  },
  {
    id: '2',
    title: 'Transitioning from IC to Management',
    summary: 'Key skills and mindset shifts for moving into a design leadership role. Understand delegation, mentorship, and strategic thinking.',
    category: 'Leadership',
    detailHref: '#',
  },
  {
    id: '3',
    title: 'Mastering Design System Thinking',
    summary: 'Develop expertise in creating scalable design systems. Learn component architecture, documentation, and cross-team collaboration.',
    category: 'Upskilling',
    detailHref: '#',
  },
  {
    id: '4',
    title: 'Networking Strategies for Designers',
    summary: 'Build meaningful professional relationships that accelerate your career. Learn to connect authentically without feeling salesy.',
    category: 'Networking',
    detailHref: '#',
  },
];

export default function Recommendations() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recommendationType, setRecommendationType] = useState<RecommendationType>('jobs');
  const [careerAdvice] = useState<CareerAdvice[]>(MOCK_CAREER_ADVICE);

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
  });

  // Transform API data to JobRecommendation format
  const jobRecommendations: JobRecommendation[] = jobMatchData?.matches.map((match) => ({
    id: match.id,
    title: match.title,
    company: match.company,
    location: match.location,
    matchScore: match.matchScore,
    summary: match.description || `Join ${match.company} as a ${match.title}`,
    datePosted: match.posted_date || match.created_at,
    detailHref: `/app/jobs/${match.id}`,
    applyHref: match.highlights?.[0], // If available
    queryFn: () => {
      if (!user?.id) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return fetchJobRecommendations({ userId: user.id, limit: 6 });
    },
  })) || [];

  useEffect(() => {
    setDocumentMeta({
      title: 'Recommendations - AURA',
      description: 'Personalized job recommendations and learning paths.',
    });
  }, []);

  const renderJobsView = () => {
    // Loading state
    if (isLoadingJobs) {
      return (
        <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (jobsError) {
      return (
        <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Failed to load recommendations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {jobsError instanceof Error ? jobsError.message : 'An error occurred while fetching job recommendations'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      );
    }

    // Empty state
    if (jobRecommendations.length === 0) {
      return (
        <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t('recommendationsPage.jobs.emptyTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('recommendationsPage.jobs.emptyBody')}
          </p>
          <Button asChild>
            <Link href="/app/profile">{t('recommendationsPage.jobs.improveProfileLabel')}</Link>
          </Button>
        </div>
      );
    }

    // Success state - display job recommendations
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {t('recommendationsPage.jobs.heading')}
          </h2>
          {jobMatchData?.usage && (
            <p className="text-sm text-muted-foreground">
              {jobMatchData.usage.used} / {jobMatchData.usage.limit} matches used this month
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
    );
  };

  const renderAdviceView = () => {
    if (careerAdvice.length === 0) {
      return (
        <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t('recommendationsPage.advice.emptyTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('recommendationsPage.advice.emptyBody')}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          {t('recommendationsPage.advice.heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
        <div className="pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('recommendationsPage.advice.exploreMoreCopy')}
          </p>
          <Button variant="link" asChild>
            <a href="#">{t('recommendationsPage.advice.exploreMoreLabel')}</a>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {t('recommendationsPage.header.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('recommendationsPage.header.subtitle')}
        </p>
      </header>

      <div className="flex gap-2 mb-2">
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

      <section className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6">
        {recommendationType === 'jobs' ? renderJobsView() : renderAdviceView()}
      </section>
    </div>
  );
}