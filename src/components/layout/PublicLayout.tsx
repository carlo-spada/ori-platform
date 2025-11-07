import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SharedHeader } from './SharedHeader';
import { SharedFooter } from './SharedFooter';

export interface PublicLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  breadcrumbsSlot?: ReactNode;
}

export function PublicLayout({
  title,
  description,
  children,
  breadcrumbsSlot,
}: PublicLayoutProps) {
  const { t } = useTranslation();
  
  // Set document title and meta description
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] inline-flex items-center rounded-xl px-4 py-2 bg-accent text-accent-foreground font-medium shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {t('cta.skipToContent')}
      </a>

      <SharedHeader />

      <main id="main" className="flex-1 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {breadcrumbsSlot && (
            <div className="mb-6" role="navigation" aria-label="Breadcrumb">
              {breadcrumbsSlot}
            </div>
          )}
          {children}
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
