'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentMeta } from '@/lib/seo';
import { RecommendationType, JobRecommendation, CareerAdvice } from '@/lib/types';
import { JobRecommendationCard } from '@/components/recommendations/JobRecommendationCard';
import { CareerAdviceCard } from '@/components/recommendations/CareerAdviceCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for demonstration
const MOCK_JOB_RECOMMENDATIONS: JobRecommendation[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Acme Corp',
    location: 'San Francisco, CA (Remote)',
    matchScore: 92,
    summary: 'Lead the design of our core product platform, working closely with engineering and product teams to create intuitive, beautiful experiences.',
    datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    detailHref: '#',
    applyHref: '#',
  },
  {
    id: '2',
    title: 'UX Researcher',
    company: 'Tech Innovations',
    location: 'New York, NY',
    matchScore: 88,
    summary: 'Drive user research initiatives to inform product strategy and design decisions. Conduct interviews, usability tests, and analyze behavioral data.',
    datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    detailHref: '#',
    applyHref: '#',
  },
  {
    id: '3',
    title: 'Product Design Lead',
    company: 'Future Labs',
    location: 'Austin, TX',
    matchScore: 85,
    summary: 'Build and mentor a team of designers while crafting the vision for our next-generation healthcare products.',
    datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    detailHref: '#',
  },
  {
    id: '4',
    title: 'Design Systems Architect',
    company: 'Scale Studio',
    location: 'Remote',
    matchScore: 90,
    summary: 'Create and maintain a comprehensive design system that empowers teams to build consistent, accessible products at scale.',
    datePosted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    detailHref: '#',
    applyHref: '#',
  },
];

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
  const [recommendationType, setRecommendationType] = useState<RecommendationType>('jobs');
  const [jobRecommendations] = useState<JobRecommendation[]>(MOCK_JOB_RECOMMENDATIONS);
  const [careerAdvice] = useState<CareerAdvice[]>(MOCK_CAREER_ADVICE);

  useEffect(() => {
    setDocumentMeta({
      title: 'Recommendations - AURA',
      description: 'Personalized job recommendations and learning paths.',
    });
  }, []);

  const renderJobsView = () => {
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