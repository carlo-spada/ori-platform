'use client'

import { useTranslation } from 'react-i18next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'

interface LegalDocumentProps {
  namespace: 'legal-terms' | 'legal-privacy' | 'legal-cookies'
  fallbackContent?: string
}

/**
 * Unified component for rendering legal documents from translation files
 * This replaces the hardcoded content in individual legal pages
 */
export function LegalDocument({ namespace, fallbackContent }: LegalDocumentProps) {
  const { t, i18n } = useTranslation(namespace)

  // Get the translated content
  const title = t('title', { defaultValue: 'Legal Document' })
  const lastUpdated = t('lastUpdated', { defaultValue: '' })
  const content = t('content', { defaultValue: fallbackContent || '' })

  // Get table of contents items if they exist
  const tocItemsRaw = t('tocItems', { returnObjects: true, defaultValue: [] }) as Array<{
    id: string
    title: string
  }>

  // Map title to label for LegalPageLayout compatibility
  const tocItems = tocItemsRaw.map(item => ({
    id: item.id,
    label: item.title
  }))

  return (
    <LegalPageLayout
      title={title}
      lastUpdated={lastUpdated}
      content={content}
      tocItems={tocItems}
    />
  )
}