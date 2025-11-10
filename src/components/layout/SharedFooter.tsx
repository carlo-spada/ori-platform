'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SharedFooter() {
  const { t } = useTranslation()

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'X/Twitter': Twitter,
    LinkedIn: Linkedin,
  }

  const socialLinks = [
    {
      platform: 'X/Twitter',
      href: 'https://x.com/ori-platform',
      ariaLabel: t('social.twitter'),
    },
    {
      platform: 'LinkedIn',
      href: 'https://linkedin.com/company/ori-platform',
      ariaLabel: t('social.linkedin'),
    },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-surface w-full border-t border-white/10"
      data-testid="footer"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Row 1: Brand + Navigation */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand / CTA */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src="/ori-logo.svg"
                alt="Ori"
                width={28}
                height={28}
                className="text-primary"
              />
              <span className="text-xl font-semibold tracking-tight text-foreground">
                Ori ✶
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('footer.brand.tagline')}
            </p>
            <Button
              asChild
              className="gradient-primary w-full rounded-xl shadow-sm transition-opacity hover:opacity-95 sm:w-auto"
            >
              <Link href="/signup">{t('footer.brand.cta')}</Link>
            </Button>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footer.columns.product.title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.product.features')}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.product.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footer.columns.company.title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/journey"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.company.journey')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.company.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footer.columns.helpLegal.title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.helpLegal.contact')}
                </Link>
              </li>
              <li>
                <span className="inline-block cursor-not-allowed rounded-md text-sm text-muted-foreground/50">
                  {t('footer.columns.helpLegal.helpCenter')}
                </span>
              </li>
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.helpLegal.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.helpLegal.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookie-policy"
                  className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('footer.columns.helpLegal.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 2: Meta strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          {/* Left: Copyright */}
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            {t('footer.meta.copyright', { year: currentYear })}
          </p>

          {/* Right: Social links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {t('footer.meta.followUs')}
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.platform]
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
