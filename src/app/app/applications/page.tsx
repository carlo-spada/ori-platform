'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { setDocumentMeta } from '@/lib/seo';
import { useTranslation } from 'react-i18next';
import { JobApplication, ApplicationStatus } from '@/lib/types';
import { ApplicationTable } from '@/components/applications/ApplicationTable';
import { EmptyApplicationsState } from '@/components/applications/EmptyApplicationsState';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration
const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Product Designer',
    company: 'Acme Corp',
    location: 'San Francisco, CA',
    applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'interviewing',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    detailsHref: '#',
  },
  {
    id: '2',
    jobTitle: 'UX Researcher',
    company: 'Tech Innovations',
    location: 'New York, NY',
    applicationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'applied',
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    detailsHref: '#',
  },
  {
    id: '3',
    jobTitle: 'Product Design Lead',
    company: 'Future Labs',
    location: 'Austin, TX',
    applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'offer',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    detailsHref: '#',
  },
  {
    id: '4',
    jobTitle: 'Design Systems Architect',
    company: 'Scale Studio',
    location: 'Remote',
    applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'rejected',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    detailsHref: '#',
  },
  {
    id: '5',
    jobTitle: 'Staff Product Designer',
    company: 'Growth Co',
    location: 'Seattle, WA',
    applicationDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paused',
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    detailsHref: '#',
  },
];

export default function Applications() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);

  useEffect(() => {
    setDocumentMeta({
      title: 'Applications - AURA',
      description: 'Track and manage your job applications.',
    });
  }, []);

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status, lastUpdated: new Date().toISOString() }
          : app
      )
    );
    toast.success('Application status updated');
  };

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for application ${id}`);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('applicationsPage.header.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('applicationsPage.header.subtitle')}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button disabled className="shrink-0">
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                {t('applicationsPage.addButtonLabel')}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {t('tooltips.comingSoon')}
          </TooltipContent>
        </Tooltip>
      </header>

      <section className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6">
        {applications.length > 0 ? (
          <ApplicationTable
            applications={applications}
            labels={{
              jobTitle: t('applicationsPage.table.jobTitle'),
              company: t('applicationsPage.table.company'),
              applicationDate: t('applicationsPage.table.applicationDate'),
              status: t('applicationsPage.table.status'),
              lastUpdated: t('applicationsPage.table.lastUpdated'),
              actions: t('applicationsPage.table.actions'),
              updateStatus: t('applicationsPage.table.updateStatus'),
              viewDetails: t('applicationsPage.table.viewDetails'),
            }}
            statusLabels={{
              applied: t('applicationsPage.statusLabels.applied'),
              interviewing: t('applicationsPage.statusLabels.interviewing'),
              offer: t('applicationsPage.statusLabels.offer'),
              rejected: t('applicationsPage.statusLabels.rejected'),
              paused: t('applicationsPage.statusLabels.paused'),
            }}
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <EmptyApplicationsState
            headline={t('applicationsPage.emptyState.headline')}
            message={t('applicationsPage.emptyState.message')}
            ctaLabel={t('applicationsPage.emptyState.ctaLabel')}
          />
        )}
      </section>
    </div>
  );
}