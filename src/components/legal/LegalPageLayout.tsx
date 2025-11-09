'use client'

import { useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { setDocumentMeta } from '@/lib/seo'

export interface LegalPageLayoutProps {
  title: string
  content: string // raw HTML string for the legal text
  lastUpdated?: string // e.g., "Last updated: March 1, 2025"
  tocItems?: { id: string; label: string }[] // optional in-page table of contents
  metaDescription?: string
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
      description: metaDescription || `${title} - Ori`,
    })
  }, [title, metaDescription])

  return (
    <PublicLayout>
      <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-muted-foreground text-sm">{lastUpdated}</p>
          )}
        </header>

        {/* Optional Table of Contents */}
        {tocItems && tocItems.length > 0 && (
          <nav
            aria-label="Legal document navigation"
            className="border-border bg-card/50 mb-12 rounded-xl border p-6 backdrop-blur-sm sm:p-8"
          >
            <h2 className="text-foreground mb-4 text-base font-semibold tracking-wide uppercase">
              Contents
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-background inline-block rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          className="prose prose-invert prose-headings:text-foreground prose-headings:font-semibold prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:first:mt-0 prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-[15px] prose-p:sm:text-base prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-a:decoration-accent/40 prose-a:transition-all hover:prose-a:text-accent/80 hover:prose-a:decoration-accent/60 prose-strong:font-semibold prose-strong:text-foreground prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:text-[15px] prose-ul:sm:text-base prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:text-[15px] prose-ol:sm:text-base prose-li:my-2 prose-li:leading-[1.75] prose-code:text-accent prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-hr:border-border prose-hr:my-12 [&_address]:text-muted-foreground [&_footer]:text-muted-foreground max-w-none [&_address]:text-[15px] [&_address]:leading-[1.75] [&_address]:not-italic [&_address]:sm:text-base [&_footer]:mt-16 [&_footer]:text-center [&_footer]:text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </PublicLayout>
  )
}
