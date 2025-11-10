'use client'

import { LegalDocument } from '@/components/legal/LegalDocument'

// Cookie Policy will be loaded from legal-cookies.json translations
export default function CookiePolicyPage() {
  return <LegalDocument namespace="legal-cookies" fallbackContent="" />
}
