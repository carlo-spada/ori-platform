import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Twitter, Linkedin } from 'lucide-react';

export function SharedFooter() {
  const { t } = useTranslation();
  
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'X/Twitter': Twitter,
    LinkedIn: Linkedin,
  };

  const footerColumns = [
    {
      title: t('footer.columns.product.title'),
      links: [
        { label: t('footer.columns.product.features'), href: '/features', external: false },
        { label: t('footer.columns.product.pricing'), href: '/pricing', external: false },
        { label: t('footer.columns.product.about'), href: '/about', external: false },
        { label: t('footer.columns.product.blog'), href: '/blog', external: false },
      ]
    },
    {
      title: t('footer.columns.legal.title'),
      links: [
        { label: t('footer.columns.legal.privacy'), href: '/legal/privacy-policy', external: false },
        { label: t('footer.columns.legal.terms'), href: '/legal/terms-of-service', external: false },
        { label: t('footer.columns.legal.cookies'), href: '/legal/cookie-policy', external: false },
      ]
    }
  ];

  const socialLinks = [
    { platform: 'X/Twitter', href: 'https://x.com/aura', ariaLabel: t('social.twitter') },
    { platform: 'LinkedIn', href: 'https://linkedin.com/company/aura', ariaLabel: t('social.linkedin') },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-surface" data-testid="footer">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block text-xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 -ml-1"
            >
              AURA
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('brand.mission')}
            </p>
          </div>

          {/* Column 2 & 3: Footer Links */}
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
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
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          {/* Column 3: Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Connect
            </h3>
            <p className="text-sm text-muted-foreground">Follow us on social media</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.platform];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground text-center lg:text-left">
            © {new Date().getFullYear()} {t('brand.name')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
