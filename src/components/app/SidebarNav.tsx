'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/navConfig'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'

export interface SidebarNavProps {
  className?: string
}

/**
 * Desktop/Tablet sidebar navigation.
 * Visible on md+ screens only.
 * Full-height, fixed-width vertical navigation bar.
 */
export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const isActive = (href: string) => {
    if (href === '/app/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out. Please try again.')
      console.error('Logout error:', error)
    } else {
      toast.success('Signed out successfully')
      router.push('/login')
    }
  }

  return (
    <aside
      className={cn(
        'bg-surface flex h-screen w-64 flex-col border-r border-white/10',
        className,
      )}
      data-testid="sidebar-nav"
    >
      {/* Logo / Brand */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link
          href="/app/dashboard"
          className="focus-visible:ring-accent flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          <Image
            src="/ori-logo.svg"
            alt="Ori"
            width={32}
            height={32}
            className="text-primary"
          />
          <span className="text-foreground text-xl font-semibold tracking-tight">
            Ori
          </span>
        </Link>
      </div>

      {/* Primary Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    'focus-visible:ring-offset-surface focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    active
                      ? 'border-accent text-foreground border-l-2 bg-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                  )}
                  data-testid={`nav-item-${item.href.slice(1)}`}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      active ? 'text-accent' : '',
                    )}
                    strokeWidth={active ? 2.5 : 1.5}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Block (Bottom) */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="mb-2 flex items-center gap-3 px-3 py-2">
          {/* Avatar Placeholder */}
          <div className="bg-accent/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <span className="text-accent text-xs font-semibold">U</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">User</p>
            <p className="text-muted-foreground truncate text-xs">
              user@example.com
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  )
}
