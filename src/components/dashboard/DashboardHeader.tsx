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
      <p className="text-muted-foreground mb-2 text-sm tracking-wide uppercase">
        {t('dashboardPage.header.eyebrow')}
      </p>
      <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
        {t('dashboardPage.header.title', { name: userName })}
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        {t('dashboardPage.header.subtitle')}
      </p>
    </header>
  )
}
