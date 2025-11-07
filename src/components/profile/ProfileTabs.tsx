import { cn } from '@/lib/utils';

export type ProfileTabKey = 'profile' | 'qualifications' | 'goals';

export interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
  labels: {
    profile: string;
    qualifications: string;
    goals: string;
  };
}

/**
 * Accessible tab navigation for Profile page sections.
 * Supports keyboard navigation with arrow keys.
 */
export function ProfileTabs({ activeTab, onTabChange, labels }: ProfileTabsProps) {
  const tabs: ProfileTabKey[] = ['profile', 'qualifications', 'goals'];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      onTabChange(tabs[prevIndex]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      onTabChange(tabs[nextIndex]);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="inline-flex rounded-xl bg-muted/30 border border-border p-1 gap-1"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab}-panel`}
            id={`${tab}-tab`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isActive
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            {labels[tab]}
          </button>
        );
      })}
    </div>
  );
}
