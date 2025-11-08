import { useTranslation } from 'react-i18next'

export interface DashboardHeaderProps {
  userName: string
}

/**
 * Dashboard header with personalized greeting.
 * Displays at the top of the "Your Journey" section.
 */
export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="mb-6" data-testid="dashboard-header">
      <p className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">
        {t('dashboardPage.header.eyebrow')}
      </p>
      <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
        {t('dashboardPage.header.title', { name: userName })}
      </h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        {t('dashboardPage.header.subtitle')}
      </p>
    </header>
  )
}
