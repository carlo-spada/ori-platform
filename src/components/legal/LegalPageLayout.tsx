import { useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { setDocumentMeta } from '@/lib/seo';

export interface LegalPageLayoutProps {
  title: string;
  content: string; // raw HTML string for the legal text
  lastUpdated?: string; // e.g., "Last updated: March 1, 2025"
  tocItems?: { id: string; label: string }[]; // optional in-page table of contents
  metaDescription?: string;
}

export function LegalPageLayout({
  title,
  content,
  lastUpdated,
  tocItems,
  metaDescription,
}: LegalPageLayoutProps) {
  useEffect(() => {
    setDocumentMeta({
      title,
      description: metaDescription || `${title} - AURA`,
    });
  }, [title, metaDescription]);

  return (
    <PublicLayout>
      <article className="w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">{lastUpdated}</p>
          )}
        </header>

        {/* Optional Table of Contents */}
        {tocItems && tocItems.length > 0 && (
          <nav
            aria-label="Legal document navigation"
            className="mb-12 p-6 sm:p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h2 className="text-base font-semibold text-foreground mb-4 uppercase tracking-wide">
              Contents
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Content Area */}
        {/* NOTE: The HTML content is assumed to be sanitized upstream. 
            Implement proper sanitization before rendering user-generated content. */}
        <div
          className="prose prose-invert max-w-none
            prose-headings:text-foreground prose-headings:font-semibold prose-headings:scroll-mt-24
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:first:mt-0
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3
            prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-[15px] prose-p:sm:text-base
            prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-a:decoration-accent/40 prose-a:transition-all
            hover:prose-a:text-accent/80 hover:prose-a:decoration-accent/60
            prose-strong:font-semibold prose-strong:text-foreground
            prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:text-[15px] prose-ul:sm:text-base
            prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:text-[15px] prose-ol:sm:text-base
            prose-li:my-2 prose-li:leading-[1.75]
            prose-code:text-accent prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-hr:border-border prose-hr:my-12
            [&_address]:not-italic [&_address]:text-muted-foreground [&_address]:leading-[1.75] [&_address]:text-[15px] [&_address]:sm:text-base
            [&_footer]:text-center [&_footer]:text-sm [&_footer]:text-muted-foreground [&_footer]:mt-16"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </PublicLayout>
  );
}
