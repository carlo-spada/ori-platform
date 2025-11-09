'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/navConfig'
import { cn } from '@/lib/utils'

export interface BottomNavProps {
  className?: string
}

/**
 * Mobile bottom navigation bar.
 * Visible on screens smaller than md only.
 * Fixed to bottom, icon-only navigation.
 */
export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/app/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed right-0 bottom-0 left-0 z-40',
        'bg-surface/95 border-t border-white/10 backdrop-blur-sm',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      data-testid="bottom-nav"
    >
      <ul className="flex items-center justify-around px-2 py-2" role="list">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all duration-200',
                  'focus-visible:ring-offset-surface focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  active
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                )}
                data-testid={`mobile-nav-${item.href.slice(1)}`}
              >
                <Icon
                  className="h-7 w-7"
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.5}
                />
                {/* Icon-only navigation for cleaner PWA experience */}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
