import { ReactNode } from 'react'
import { SidebarNav } from './SidebarNav'
import { BottomNav } from './BottomNav'

export interface AppShellProps {
  children: ReactNode
}

/**
 * Main application shell for private, logged-in area.
 * Provides responsive navigation:
 * - Sidebar on md+ screens
 * - Bottom nav on mobile
 * - Main content area that scrolls independently
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-background text-foreground md:flex-row">
      {/* Desktop/Tablet Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col md:min-h-0">
        <main
          id="main"
          className="flex-1 overflow-y-auto px-4 py-4 pb-20 sm:px-6 sm:py-6 md:pb-6 lg:px-8"
          data-testid="app-main-content"
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation - Hidden on md+ */}
        <BottomNav className="md:hidden" />
      </div>
    </div>
  )
}
