import { JobApplication, ApplicationStatus } from '@/lib/types';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface ApplicationTableProps {
  applications: JobApplication[];
  labels: {
    jobTitle: string;
    company: string;
    applicationDate: string;
    status: string;
    lastUpdated: string;
    actions: string;
    updateStatus: string;
    viewDetails: string;
  };
  statusLabels: Record<ApplicationStatus, string>;
  onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
  onViewDetails?: (id: string) => void;
}

function MobileApplicationCard({
  application,
  labels,
  statusLabels,
  onUpdateStatus,
  onViewDetails,
}: {
  application: JobApplication;
  labels: ApplicationTableProps['labels'];
  statusLabels: Record<ApplicationStatus, string>;
  onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
  onViewDetails?: (id: string) => void;
}) {
  const dateText = formatDistanceToNow(new Date(application.applicationDate), {
    addSuffix: true,
  });
  const lastUpdatedText = formatDistanceToNow(new Date(application.lastUpdated), {
    addSuffix: true,
  });

  return (
    <article className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{application.jobTitle}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span className="font-medium">{application.company}</span>
            {application.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {application.location}
                </span>
              </>
            )}
          </div>
        </div>
        <ApplicationStatusBadge status={application.status} labelMap={statusLabels} />
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <span>Applied {dateText}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>Updated {lastUpdatedText}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        {onUpdateStatus && (
          <Select
            value={application.status}
            onValueChange={(value) => onUpdateStatus(application.id, value as ApplicationStatus)}
          >
            <SelectTrigger
              className="flex-1"
              aria-label={`Update status for ${application.jobTitle} at ${application.company}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {(application.detailsHref || onViewDetails) && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(application.id)}
            asChild={!!application.detailsHref}
          >
            {application.detailsHref ? (
              <a href={application.detailsHref}>{labels.viewDetails}</a>
            ) : (
              labels.viewDetails
            )}
          </Button>
        )}
      </div>
    </article>
  );
}

export function ApplicationTable({
  applications,
  labels,
  statusLabels,
  onUpdateStatus,
  onViewDetails,
}: ApplicationTableProps) {
  return (
    <>
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">
                {labels.jobTitle}
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">
                {labels.company}
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">
                {labels.applicationDate}
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">
                {labels.status}
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">
                {labels.lastUpdated}
              </th>
              <th scope="col" className="text-right py-3 px-4 font-semibold text-foreground">
                {labels.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const dateText = formatDistanceToNow(new Date(app.applicationDate), {
                addSuffix: true,
              });
              const lastUpdatedText = formatDistanceToNow(new Date(app.lastUpdated), {
                addSuffix: true,
              });

              return (
                <tr key={app.id} className="border-b border-border hover:bg-muted/5">
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">{app.jobTitle}</div>
                    {app.location && (
                      <div className="text-xs text-muted-foreground mt-0.5">{app.location}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{app.company}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <time dateTime={app.applicationDate}>{dateText}</time>
                  </td>
                  <td className="py-3 px-4">
                    <ApplicationStatusBadge status={app.status} labelMap={statusLabels} />
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <time dateTime={app.lastUpdated}>{lastUpdatedText}</time>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {onUpdateStatus && (
                        <Select
                          value={app.status}
                          onValueChange={(value) =>
                            onUpdateStatus(app.id, value as ApplicationStatus)
                          }
                        >
                          <SelectTrigger
                            className="w-[140px]"
                            aria-label={`Update status for ${app.jobTitle} at ${app.company}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border z-50">
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {(app.detailsHref || onViewDetails) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails?.(app.id)}
                          asChild={!!app.detailsHref}
                        >
                          {app.detailsHref ? (
                            <a href={app.detailsHref}>{labels.viewDetails}</a>
                          ) : (
                            labels.viewDetails
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {applications.map((app) => (
          <MobileApplicationCard
            key={app.id}
            application={app}
            labels={labels}
            statusLabels={statusLabels}
            onUpdateStatus={onUpdateStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </>
  );
}
