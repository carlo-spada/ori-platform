'use client'

import { LegalDocument } from '@/components/legal/LegalDocument'

// Privacy Policy will be loaded from legal-privacy.json translations
export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      namespace="legal-privacy"
      fallbackContent=""
    />
  )
}