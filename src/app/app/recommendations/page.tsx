'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentMeta } from '@/lib/seo';
import { RecommendationType, CareerAdvice } from '@/lib/types';
import { JobRecommendationCard } from '@/components/recommendations/JobRecommendationCard';
import { CareerAdviceCard } from '@/components/recommendations/CareerAdviceCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useJobRecommendations } from '@/integrations/api/jobs';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for career advice (can be replaced with API call later)
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
];

export default function Recommendations() {
  const { t } = useTranslation();
  const [recommendationType, setRecommendationType] = useState<RecommendationType>('jobs');
  
  // TODO: Replace with actual user ID from authentication context
  const FAKE_USER_ID = 'user-123';
  
  const { 
    data: jobRecommendations, 
    isLoading: isLoadingJobs, 
    isError: isErrorJobs,
    error: jobsError 
  } = useJobRecommendations(FAKE_USER_ID);
  
  const [careerAdvice] = useState<CareerAdvice[]>(MOCK_CAREER_ADVICE);

  useEffect(() => {
    setDocumentMeta({
      title: 'Recommendations - AURA',
      description: 'Personalized job recommendations and learning paths.',
    });
  }, []);

  const renderJobsView = () => {
    if (isLoadingJobs) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t('recommendationsPage.jobs.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full mt-2" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isErrorJobs) {
      return (
        <div className="p-8 rounded-2xl border border-destructive/50 bg-destructive/10 text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive-foreground">
            {t('recommendationsPage.jobs.errorTitle')}
          </h2>
          <p className="text-destructive-foreground/80 max-w-2xl mx-auto">
            {t('recommendationsPage.jobs.errorBody')}
            {jobsError && <pre className="mt-2 text-xs bg-destructive/20 p-2 rounded-md">{jobsError.message}</pre>}
          </p>
        </div>
      );
    }

    if (!jobRecommendations || jobRecommendations.length === 0) {
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

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {t('recommendationsPage.jobs.heading')}
        </h2>
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