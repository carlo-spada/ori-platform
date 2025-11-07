import { useTranslation } from 'react-i18next';

export interface DashboardHeaderProps {
  userName: string;
}

/**
 * Dashboard header with personalized greeting.
 * Displays at the top of the "Your Journey" section.
 */
export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mb-6" data-testid="dashboard-header">
      <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
        {t('dashboardPage.header.eyebrow')}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {t('dashboardPage.header.title', { name: userName })}
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        {t('dashboardPage.header.subtitle')}
      </p>
    </header>
  );
}
