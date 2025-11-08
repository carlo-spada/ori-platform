import { Briefcase, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface QuickStatsProps {
  activeApplications: number;
  jobRecommendations: number;
  skillsAdded: number;
  profileCompletion: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <article
      className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
          aria-hidden="true"
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            aria-label={`${trend.isPositive ? 'Increased' : 'Decreased'} by ${trend.value} percent`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {label}
        </div>
      </div>
    </article>
  );
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
  const { t } = useTranslation();

  return (
    <section aria-label="Quick statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Briefcase className="w-5 h-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.activeApplications')}
        value={activeApplications}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        icon={<Target className="w-5 h-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.jobMatches')}
        value={jobRecommendations}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.skillsAdded')}
        value={skillsAdded}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5" aria-hidden="true" />}
        label={t('dashboardPage.quickStats.profileCompletion')}
        value={`${profileCompletion}%`}
      />
    </section>
  );
}
