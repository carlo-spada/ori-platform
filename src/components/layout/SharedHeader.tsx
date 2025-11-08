'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import FocusTrap from 'focus-trap-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function SharedHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null)

  const NAV_ITEMS = [
    { slug: 'features', href: '/features', label: t('nav.items.features') },
    { slug: 'pricing', href: '/pricing', label: t('nav.items.pricing') },
    { slug: 'about', href: '/about', label: t('nav.items.about') },
    { slug: 'blog', href: '/blog', label: t('nav.items.blog') },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Handle click outside to close mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Handle Escape key, body scroll, and aria-hidden for mobile menu
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
        hamburgerButtonRef.current?.focus()
      }
    }

    const mainContent = document.getElementById('main')
    const footer = document.querySelector('footer')

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      // Hide background content from screen readers
      if (mainContent) mainContent.setAttribute('aria-hidden', 'true')
      if (footer) footer.setAttribute('aria-hidden', 'true')
    } else {
      document.body.style.overflow = ''

      // Restore background content for screen readers
      if (mainContent) mainContent.removeAttribute('aria-hidden')
      if (footer) footer.removeAttribute('aria-hidden')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''

      // Cleanup aria-hidden on unmount
      if (mainContent) mainContent.removeAttribute('aria-hidden')
      if (footer) footer.removeAttribute('aria-hidden')
    }
  }, [mobileMenuOpen])

  const isActive = (path: string) => pathname === path

  return (
    <header
      className="backdrop-blur-header sticky top-0 z-50 w-full border-b border-white/10"
      data-testid="header"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            data-testid="logo"
          >
            <Image
              src="/ori-logo.svg"
              alt="Ori"
              width={28}
              height={28}
              className="text-primary"
            />
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Ori
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation"
            data-testid="nav"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                data-testid={`nav-link-${item.slug}`}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                  'hover:bg-white/5 hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive(item.href)
                    ? 'font-semibold text-foreground underline decoration-accent/80 underline-offset-4'
                    : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              asChild
              className="rounded-xl text-foreground/80 hover:bg-white/5 hover:text-foreground"
              data-testid="cta-login"
            >
              <Link href="/login">{t('cta.login')}</Link>
            </Button>
            <Button
              asChild
              className="gradient-primary rounded-xl shadow-sm transition-opacity hover:opacity-95"
              data-testid="cta-signup"
            >
              <Link href="/signup">{t('cta.signup')}</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-xl text-foreground/80 hover:bg-white/5 hover:text-foreground"
              data-testid="cta-login-mobile"
            >
              <Link href="/login">{t('cta.login')}</Link>
            </Button>
            <button
              ref={hamburgerButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen ? t('cta.closeMenu') : t('cta.openMenu')
              }
              className="inline-flex items-center justify-center rounded-xl p-2 text-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <FocusTrap
          active={mobileMenuOpen}
          focusTrapOptions={{
            onDeactivate: () => {
              setMobileMenuOpen(false)
              hamburgerButtonRef.current?.focus()
            },
            clickOutsideDeactivates: true,
          }}
        >
          <div
            ref={mobileMenuRef}
            className="bg-surface fixed bottom-0 right-0 top-16 z-[60] w-full max-w-sm border-l border-white/10 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            data-testid="mobile-menu"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    hamburgerButtonRef.current?.focus()
                  }}
                  aria-label={t('cta.closeMenu')}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <nav
                className="flex-1 overflow-y-auto px-4 py-6"
                aria-label="Mobile navigation"
              >
                <ul className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        data-testid={`mobile-nav-link-${item.slug}`}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                          'hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          isActive(item.href)
                            ? 'bg-white/5 font-semibold text-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-white/10 px-4 py-6">
                <Button
                  asChild
                  className="gradient-primary w-full rounded-xl shadow-sm transition-opacity hover:opacity-95"
                  data-testid="cta-signup-mobile"
                >
                  <Link href="/signup">{t('cta.signup')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </FocusTrap>
      )}

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
