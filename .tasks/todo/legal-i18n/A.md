---
Task ID: A
Feature: Legal Documents Internationalization
Title: Translate Legal Documents to All Supported Languages
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: Medium
---

### Objective

Implement full i18n support for all legal documents (Terms of Service, Privacy Policy, Cookie Policy) across all supported languages (English, German, Spanish, French, Italian).

### Context

Currently, legal documents are hardcoded in English within React components. Users need to read legal documents in their native language for compliance with international regulations (GDPR requires translations for EU languages).

**Current structure:**
- Legal pages in `src/app/legal/*/page.tsx`
- Content stored as template strings in components
- No translation support

**Required languages:**
- English (en) - Already exists
- German (de) - Required for GDPR compliance
- Spanish (es)
- French (fr)
- Italian (it)

### Implementation Approach

**Option 1: Separate JSON Translation Files (Recommended)**

Create dedicated JSON files for legal content to keep main translation file manageable:

```
public/locales/
├── en/
│   ├── translation.json
│   ├── legal-terms.json
│   ├── legal-privacy.json
│   └── legal-cookies.json
├── de/
│   ├── translation.json
│   ├── legal-terms.json
│   ├── legal-privacy.json
│   └── legal-cookies.json
... (repeat for es, fr, it)
```

**Option 2: Use AI Translation Service**

Integrate with translation API for dynamic translation:
- DeepL API (best for legal/formal text)
- Google Cloud Translation
- Cache translations in JSON files after first generation

### Files to Create/Modify

**Legal Page Components:**
- `src/app/legal/terms-of-service/page.tsx` - Add i18n support
- `src/app/legal/privacy-policy/page.tsx` - Add i18n support
- `src/app/legal/cookie-policy/page.tsx` - Add i18n support
- `src/components/legal/LegalPageLayout.tsx` - Update to support translations

**Translation Files (Option 1):**
- `public/locales/en/legal-terms.json` - Extract existing terms content
- `public/locales/en/legal-privacy.json` - Extract existing privacy content
- `public/locales/en/legal-cookies.json` - Extract existing cookies content
- `public/locales/de/legal-*.json` - German translations (all 3 files)
- `public/locales/es/legal-*.json` - Spanish translations (all 3 files)
- `public/locales/fr/legal-*.json` - French translations (all 3 files)
- `public/locales/it/legal-*.json` - Italian translations (all 3 files)

**i18n Configuration:**
- `src/i18n.ts` - Add legal namespace configuration

### Implementation Steps

#### Phase 1: Structure Setup (2-3 hours)

1. **Extract English Content to JSON**:
   - Read current legal page components
   - Extract all HTML content sections
   - Create structured JSON format:
     ```json
     {
       "termsOfService": {
         "title": "Terms of Service",
         "lastUpdated": "Last updated: November 7, 2025",
         "sections": {
           "introduction": {
             "title": "1. Introduction",
             "content": "<p>Welcome to <strong>Ori</strong>...</p>"
           },
           "eligibility": {
             "title": "2. Eligibility",
             "content": "<p>You may use the Service...</p>"
           }
           // ... all sections
         }
       }
     }
     ```
   - Save to `public/locales/en/legal-*.json` files

2. **Update i18n Configuration**:
   ```typescript
   // src/i18n.ts
   i18n
     .use(Backend)
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       fallbackLng: 'en',
       ns: ['translation', 'legal-terms', 'legal-privacy', 'legal-cookies'],
       defaultNS: 'translation',
       backend: {
         loadPath: '/locales/{{lng}}/{{ns}}.json',
       },
       // ... other config
     })
   ```

3. **Update Legal Page Components**:
   ```tsx
   'use client'

   import { useTranslation } from 'react-i18next'
   import { LegalPageLayout } from '@/components/legal/LegalPageLayout'

   export default function TermsOfService() {
     const { t } = useTranslation('legal-terms')

     return (
       <LegalPageLayout
         title={t('termsOfService.title')}
         lastUpdated={t('termsOfService.lastUpdated')}
       >
         {Object.entries(t('termsOfService.sections', { returnObjects: true })).map(([key, section]) => (
           <section key={key}>
             <div dangerouslySetInnerHTML={{ __html: section.content }} />
           </section>
         ))}
       </LegalPageLayout>
     )
   }
   ```

#### Phase 2: Professional Translation (6-8 hours)

**Option A: Use DeepL API (Recommended)**

1. **Set up DeepL**:
   ```bash
   pnpm add deepl-node
   ```

2. **Create Translation Script**:
   ```typescript
   // scripts/translate-legal.ts
   import * as deepl from 'deepl-node'
   import fs from 'fs/promises'

   const translator = new deepl.Translator(process.env.DEEPL_API_KEY!)

   async function translateLegalDocs() {
     const languages = ['de', 'es', 'fr', 'it']
     const files = ['legal-terms', 'legal-privacy', 'legal-cookies']

     for (const file of files) {
       const enContent = await fs.readFile(
         `public/locales/en/${file}.json`,
         'utf-8'
       )
       const enJson = JSON.parse(enContent)

       for (const lang of languages) {
         const translated = await translateObject(enJson, lang)
         await fs.writeFile(
           `public/locales/${lang}/${file}.json`,
           JSON.stringify(translated, null, 2)
         )
         console.log(`✅ Translated ${file} to ${lang}`)
       }
     }
   }

   async function translateObject(obj: any, targetLang: string): Promise<any> {
     // Recursively translate all string values
     // Preserve HTML tags using DeepL's tag_handling: 'html'
     // ...
   }
   ```

3. **Run Translation**:
   ```bash
   DEEPL_API_KEY=your_key node scripts/translate-legal.ts
   ```

**Option B: Manual Translation with AI Assistance**

1. Use Claude/ChatGPT to translate each section
2. Have legal expert review translations
3. Manually create JSON files for each language

**Important for Legal Translations:**
- Preserve all HTML tags and formatting
- Maintain legal terminology accuracy
- Keep company names, email addresses unchanged
- Ensure dates are formatted per locale
- Have translations reviewed by native speakers or legal professionals

#### Phase 3: Testing & Validation (2-3 hours)

1. **Visual Testing**:
   - Test each legal page in all 5 languages
   - Verify HTML rendering is correct
   - Check for text overflow/layout issues
   - Ensure all links work

2. **Language Switching**:
   - Test language selector changes legal content
   - Verify browser language detection works
   - Check fallback to English if translation missing

3. **Accessibility**:
   - Verify `lang` attribute updates on HTML element
   - Check screen reader compatibility
   - Ensure proper heading hierarchy

4. **SEO**:
   - Add `hreflang` tags for each language version
   - Update sitemap with all language variants
   - Verify canonical URLs

### Technical Considerations

**HTML Content Handling:**
```tsx
// Safe HTML rendering with sanitization
import DOMPurify from 'isomorphic-dompurify'

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(t('section.content'))
  }}
/>
```

**Lazy Loading Translations:**
```typescript
// Load legal namespace only when needed
const { t } = useTranslation('legal-terms', {
  useSuspense: false
})
```

**Legal Compliance Notes:**
- GDPR requires legal docs in user's language
- Include language selector on legal pages
- Show "Official version: English" disclaimer for non-English
- Maintain version history for each language

### Acceptance Criteria

- ✅ All 3 legal documents available in 5 languages (15 files total)
- ✅ Legal pages automatically show in user's browser language
- ✅ Language switcher works on legal pages
- ✅ HTML formatting preserved in all translations
- ✅ Links and email addresses functional in all languages
- ✅ No layout breaking or text overflow
- ✅ Proper `lang` attributes set for SEO and accessibility
- ✅ Translations reviewed for legal accuracy
- ✅ "Official version: English" disclaimer shown for translations

### Cost Estimation

**DeepL API:**
- Free tier: 500,000 characters/month
- Legal docs ~50,000 characters total
- 4 languages = 200,000 characters
- **Cost: Free** (within free tier)

**Alternative: Professional Legal Translation:**
- ~$0.10-0.20 per word
- ~15,000 words total
- 4 languages
- **Cost: $6,000-12,000** (if using professional service)

### Estimated Effort

**Phase 1 (Structure):** 2-3 hours
**Phase 2 (Translation):**
- With DeepL API: 2-3 hours
- Manual with AI: 6-8 hours
- Professional review: +4-6 hours

**Phase 3 (Testing):** 2-3 hours

**Total: 6-14 hours** depending on translation approach

### Success Metrics

- All legal pages accessible in 5 languages
- 100% translation coverage (no missing content)
- Zero layout/rendering issues
- Language detection accuracy: >95%
- User satisfaction with translations

### Notes

- Legal translations should be reviewed by legal professional
- Consider adding "unofficial translation" disclaimer
- Keep English as the legally binding version
- Version all translations together (sync updates)
- Add translation date to each file for tracking

### Resources

- [DeepL API Documentation](https://www.deepl.com/docs-api)
- [i18next Namespaces Guide](https://www.i18next.com/principles/namespaces)
- [GDPR Translation Requirements](https://gdpr.eu/what-is-gdpr/)
- [React i18next Best Practices](https://react.i18next.com/latest/using-with-hooks)
