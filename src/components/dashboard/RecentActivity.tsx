import { FileText, Plus, Send, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'

export interface ActivityItem {
  id: string
  type: 'application' | 'skill' | 'profile' | 'favorite'
  title: string
  subtitle?: string
  timestamp: string
}

export interface RecentActivityProps {
  activities: ActivityItem[]
  emptyMessage?: string
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'application':
      return <Send className="h-4 w-4" />
    case 'skill':
      return <Plus className="h-4 w-4" />
    case 'profile':
      return <FileText className="h-4 w-4" />
    case 'favorite':
      return <Star className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

function getActivityColor(type: ActivityItem['type']) {
  switch (type) {
    case 'application':
      return 'bg-blue-500/10 text-blue-500'
    case 'skill':
      return 'bg-green-500/10 text-green-500'
    case 'profile':
      return 'bg-purple-500/10 text-purple-500'
    case 'favorite':
      return 'bg-yellow-500/10 text-yellow-500'
    default:
      return 'bg-gray-500/10 text-gray-500'
  }
}

/**
 * Recent activity feed showing user's recent actions.
 * Displays applications, skills added, profile updates, etc.
 */
export function RecentActivity({
  activities,
  emptyMessage,
}: RecentActivityProps) {
  const { t } = useTranslation()
  const displayEmptyMessage =
    emptyMessage || t('dashboardPage.recentActivity.emptyMessage')

  if (activities.length === 0) {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-6"
        aria-labelledby="recent-activity-heading"
      >
        <h2
          id="recent-activity-heading"
          className="mb-4 text-lg font-semibold text-foreground"
        >
          {t('dashboardPage.recentActivity.title')}
        </h2>
        <p className="py-8 text-center text-sm text-muted-foreground">
          {displayEmptyMessage}
        </p>
      </section>
    )
  }

  return (
    <section
      className="rounded-2xl border border-border bg-card p-6"
      aria-labelledby="recent-activity-heading"
    >
      <h2
        id="recent-activity-heading"
        className="mb-4 text-lg font-semibold text-foreground"
      >
        {t('dashboardPage.recentActivity.title')}
      </h2>
      <ul className="space-y-4" role="list">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}
              aria-hidden="true"
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              {activity.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.subtitle}
                </p>
              )}
              <time
                className="mt-1 block text-xs text-muted-foreground"
                dateTime={activity.timestamp}
              >
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
