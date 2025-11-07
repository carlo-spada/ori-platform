'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/navConfig';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SidebarNavProps {
  className?: string;
}

/**
 * Desktop/Tablet sidebar navigation.
 * Visible on md+ screens only.
 * Full-height, fixed-width vertical navigation bar.
 */
export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'w-64 h-screen border-r border-white/10 bg-surface flex flex-col',
        className
      )}
      data-testid="sidebar-nav"
    >
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link
          href="/app/dashboard"
          className="text-xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        >
          AURA
        </Link>
      </div>

      {/* Primary Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                    active
                      ? 'bg-white/10 text-foreground border-l-2 border-accent'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  )}
                  data-testid={`nav-item-${item.href.slice(1)}`}
                >
                  <Icon
                    className={cn('h-5 w-5 shrink-0', active ? 'text-accent' : '')}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Block (Bottom) */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {/* Avatar Placeholder */}
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-accent">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">
              user@example.com
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
          onClick={() => {
            // TODO: Implement logout logic
            console.log('Logout clicked');
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
}
