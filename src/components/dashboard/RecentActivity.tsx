import { FileText, Plus, Send, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export interface ActivityItem {
  id: string;
  type: 'application' | 'skill' | 'profile' | 'favorite';
  title: string;
  subtitle?: string;
  timestamp: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  emptyMessage?: string;
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'application':
      return <Send className="w-4 h-4" />;
    case 'skill':
      return <Plus className="w-4 h-4" />;
    case 'profile':
      return <FileText className="w-4 h-4" />;
    case 'favorite':
      return <Star className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

function getActivityColor(type: ActivityItem['type']) {
  switch (type) {
    case 'application':
      return 'bg-blue-500/10 text-blue-500';
    case 'skill':
      return 'bg-green-500/10 text-green-500';
    case 'profile':
      return 'bg-purple-500/10 text-purple-500';
    case 'favorite':
      return 'bg-yellow-500/10 text-yellow-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

/**
 * Recent activity feed showing user's recent actions.
 * Displays applications, skills added, profile updates, etc.
 */
export function RecentActivity({ activities, emptyMessage }: RecentActivityProps) {
  const { t } = useTranslation();
  const displayEmptyMessage = emptyMessage || t('dashboardPage.recentActivity.emptyMessage');

  if (activities.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="recent-activity-heading">
        <h2 id="recent-activity-heading" className="text-lg font-semibold text-foreground mb-4">
          {t('dashboardPage.recentActivity.title')}
        </h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          {displayEmptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="text-lg font-semibold text-foreground mb-4">
        {t('dashboardPage.recentActivity.title')}
      </h2>
      <ul className="space-y-4" role="list">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-start gap-3 group hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}
              aria-hidden="true"
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              {activity.subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.subtitle}
                </p>
              )}
              <time
                className="text-xs text-muted-foreground mt-1 block"
                dateTime={activity.timestamp}
              >
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
