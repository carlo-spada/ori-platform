import { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';

export interface AppShellProps {
  children: ReactNode;
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
    <div className="min-h-screen w-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Desktop/Tablet Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
        <main
          id="main"
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6"
          data-testid="app-main-content"
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation - Hidden on md+ */}
        <BottomNav className="md:hidden" />
      </div>
    </div>
  );
}
