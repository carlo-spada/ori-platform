'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { setDocumentMeta } from '@/lib/seo'
import { ChevronRight } from 'lucide-react'

interface LegalDocumentProps {
  namespace: 'legal-terms' | 'legal-privacy' | 'legal-cookies'
  fallbackContent?: string
}

/**
 * Enhanced legal document component with improved table of contents
 * - Smooth scrolling to sections
 * - Active section highlighting
 * - Mobile-friendly navigation
 * - Proper i18n support
 */
export function EnhancedLegalDocument({
  namespace,
  fallbackContent,
}: LegalDocumentProps) {
  const { t, i18n } = useTranslation(namespace)
  const [activeSection, setActiveSection] = useState<string>('')

  // Get translated content
  const title = t('title', { defaultValue: 'Legal Document' })
  const lastUpdated = t('lastUpdated', { defaultValue: '' })
  const content = t('content', { defaultValue: fallbackContent || '' })
  const metaDescription = t('metaDescription', { defaultValue: `${title} - Ori` })

  // Get table of contents items
  const tocItems = t('tocItems', {
    returnObjects: true,
    defaultValue: [],
  }) as Array<{
    id: string
    label: string
  }>

  // Set document meta
  useEffect(() => {
    setDocumentMeta({
      title,
      description: metaDescription,
    })
  }, [title, metaDescription])

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100 // Account for sticky header
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth',
      })
      setActiveSection(sectionId)
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id)).filter(Boolean)

      let current = ''
      sections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 150) {
            current = section.id
          }
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  return (
    <PublicLayout>
      <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">{lastUpdated}</p>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Table of Contents - Sticky Sidebar */}
          {tocItems && tocItems.length > 0 && (
            <aside className="hidden lg:block lg:w-72">
              <nav
                aria-label="Table of contents"
                className="sticky top-24 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
              >
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                  {i18n.language === 'en' ? 'Contents' :
                   i18n.language === 'es' ? 'Contenido' :
                   i18n.language === 'fr' ? 'Sommaire' :
                   i18n.language === 'de' ? 'Inhalt' :
                   i18n.language === 'it' ? 'Indice' : 'Contents'}
                </h2>
                <ul className="space-y-2">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-all hover:bg-muted/50 ${
                          activeSection === item.id
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <ChevronRight
                          className={`mt-0.5 h-3 w-3 flex-shrink-0 transition-transform ${
                            activeSection === item.id ? 'rotate-90' : ''
                          }`}
                        />
                        <span className="line-clamp-2">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Mobile Table of Contents */}
          {tocItems && tocItems.length > 0 && (
            <nav
              aria-label="Table of contents"
              className="mb-8 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm lg:hidden"
            >
              <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
                {i18n.language === 'en' ? 'Contents' :
                 i18n.language === 'es' ? 'Contenido' :
                 i18n.language === 'fr' ? 'Sommaire' :
                 i18n.language === 'de' ? 'Inhalt' :
                 i18n.language === 'it' ? 'Indice' : 'Contents'}
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div
              className="prose prose-invert prose-headings:text-foreground prose-headings:font-semibold prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:first:mt-0 prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-[15px] prose-p:sm:text-base prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-a:decoration-accent/40 prose-a:transition-all hover:prose-a:text-accent/80 hover:prose-a:decoration-accent/60 prose-strong:font-semibold prose-strong:text-foreground prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:text-[15px] prose-ul:sm:text-base prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:text-[15px] prose-ol:sm:text-base prose-li:my-2 prose-li:leading-[1.75] prose-code:text-accent prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-hr:border-border prose-hr:my-12 max-w-none [&_address]:text-[15px] [&_address]:not-italic [&_address]:leading-[1.75] [&_address]:text-muted-foreground [&_address]:sm:text-base [&_footer]:mt-16 [&_footer]:text-center [&_footer]:text-sm [&_footer]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Back to top button for mobile */}
            <div className="mt-12 text-center lg:hidden">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                ↑ Back to top
              </button>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  )
}