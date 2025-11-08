'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo } from 'react'
import { setDocumentMeta } from '@/lib/seo'
import { useTranslation } from 'react-i18next'
import { JobApplication, ApplicationStatus } from '@/lib/types'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { EmptyApplicationsState } from '@/components/applications/EmptyApplicationsState'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  useApplications,
  useUpdateApplicationStatus,
} from '@/hooks/useApplications'
import type { Application } from '@ori/types'

export default function Applications() {
  const { t } = useTranslation()

  // Fetch applications from backend
  const { data: applicationsData = [], isLoading } = useApplications()
  const updateStatusMutation = useUpdateApplicationStatus()

  useEffect(() => {
    setDocumentMeta({
      title: 'Applications - Ori',
      description: 'Track and manage your job applications.',
    })
  }, [])

  // Transform backend Application data to frontend JobApplication format
  const applications: JobApplication[] = useMemo(() => {
    return applicationsData.map((app: Application) => ({
      id: app.id,
      jobTitle: app.job_title,
      company: app.company,
      location: app.location || undefined,
      applicationDate: app.application_date,
      status: app.status,
      lastUpdated: app.last_updated,
      detailsHref: app.job_url || undefined,
    }))
  }, [applicationsData])

  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status })
      toast.success('Application status updated')
    } catch (error) {
      toast.error('Failed to update status')
      console.error(error)
    }
  }

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for application ${id}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
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
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('applicationsPage.addButtonLabel')}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('tooltips.comingSoon')}</TooltipContent>
        </Tooltip>
      </header>

      <section className="border-border bg-card flex-1 overflow-y-auto rounded-2xl border p-4 sm:p-6">
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
  )
}
