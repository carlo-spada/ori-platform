'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Twitter, Linkedin } from 'lucide-react'

export function SharedFooter() {
  const { t } = useTranslation()

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'X/Twitter': Twitter,
    LinkedIn: Linkedin,
  }

  const footerColumns = [
    {
      title: t('footer.columns.product.title'),
      links: [
        {
          label: t('footer.columns.product.features'),
          href: '/features',
          external: false,
        },
        {
          label: t('footer.columns.product.pricing'),
          href: '/pricing',
          external: false,
        },
        {
          label: t('footer.columns.product.about'),
          href: '/about',
          external: false,
        },
        {
          label: t('footer.columns.product.blog'),
          href: '/blog',
          external: false,
        },
        {
          label: t('footer.columns.product.journey'),
          href: '/journey',
          external: false,
        },
      ],
    },
    {
      title: t('footer.columns.support.title'),
      links: [
        {
          label: t('footer.columns.support.contact'),
          href: '/contact',
          external: false,
        },
      ],
    },
  ]

  const legalLinks = [
    {
      label: t('footer.columns.legal.privacy'),
      href: '/legal/privacy-policy',
      external: false,
    },
    {
      label: t('footer.columns.legal.terms'),
      href: '/legal/terms-of-service',
      external: false,
    },
    {
      label: t('footer.columns.legal.cookies'),
      href: '/legal/cookie-policy',
      external: false,
    },
  ]

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

  return (
    <footer
      className="bg-surface w-full border-t border-white/10"
      data-testid="footer"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Column 1: Ori - Logo, Mission & Legal */}
          <div className="space-y-6">
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
                  Ori
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t('brand.mission')}
              </p>
            </div>

            {/* Legal links under Ori */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {t('footer.columns.legal.title')}
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 & 3: Product and Support columns */}
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              {/* Connect under Support column */}
              {column.title === t('footer.columns.support.title') && (
                <div className="space-y-4 pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    Connect
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Follow us on social media
                  </p>
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
              )}
            </div>
          ))}
        </div>

        {/* Sub-footer */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-muted-foreground lg:text-left">
            © {new Date().getFullYear()} {t('brand.name')}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
