import { Briefcase, Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface QuickStatsProps {
  activeApplications: number
  jobRecommendations: number
  skillsAdded: number
  profileCompletion: number
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <article
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            aria-label={`${trend.isPositive ? 'Increased' : 'Decreased'} by ${trend.value} percent`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
      </div>
    </article>
  )
}

/**
 * Quick stats showing key metrics at a glance.
 * Displays in a responsive grid on the dashboard.
 */
export function QuickStats({
  activeApplications,
  jobRecommendations,
  skillsAdded,
  profileCompletion,
}: QuickStatsProps) {
  const { t } = useTranslation()

  return (
    <section
      aria-label="Quick statistics"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      <StatCard
        icon={<Briefcase className="h-5 w-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.activeApplications')}
        value={activeApplications}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        icon={<Target className="h-5 w-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.jobMatches')}
        value={jobRecommendations}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.skillsAdded')}
        value={skillsAdded}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.profileCompletion')}
        value={`${profileCompletion}%`}
      />
    </section>
  )
}
