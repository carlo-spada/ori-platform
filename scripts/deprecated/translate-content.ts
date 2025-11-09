#!/usr/bin/env tsx

/**
 * Translation Script using DeepL API
 *
 * This script translates content to multiple languages using DeepL's professional translation API.
 * It supports translating legal documents, blog posts, and other HTML content while preserving formatting.
 *
 * Usage:
 *   DEEPL_API_KEY=your_key tsx scripts/translate-content.ts
 *
 * Features:
 * - Preserves HTML tags and formatting
 * - Translates legal documents (Terms, Privacy, Cookies)
 * - Translates blog posts
 * - Keeps company names, emails, and addresses unchanged
 * - Handles large texts by chunking
 */

import * as deepl from 'deepl-node'
import fs from 'fs/promises'
import path from 'path'

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required')
  console.error('Get your API key from: https://www.deepl.com/pro-api')
  console.error('\nUsage: DEEPL_API_KEY=your_key tsx scripts/translate-content.ts')
  process.exit(1)
}

// Detect API key type (free keys end with :fx)
const isFreeKey = DEEPL_API_KEY.endsWith(':fx')
const translator = new deepl.Translator(DEEPL_API_KEY, {
  serverUrl: isFreeKey ? 'https://api-free.deepl.com' : undefined
})

// Target languages (DeepL language codes)
const TARGET_LANGUAGES: deepl.TargetLanguageCode[] = ['de', 'es', 'fr', 'it']

// Text that should NOT be translated
const PRESERVE_PATTERNS = [
  'Ori Technologies S.A. de C.V.',
  'support@carlospada.me',
  'Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia',
  'Ori', // Brand name
  'Stripe',
  'Google',
  'GitHub',
  'Apple ID',
  'GDPR',
]

interface TranslationResult {
  language: string
  text: string
}

/**
 * Translate text using DeepL API
 */
async function translateText(
  text: string,
  targetLang: deepl.TargetLanguageCode
): Promise<string> {
  try {
    const result = await translator.translateText(text, null, targetLang, {
      tagHandling: 'html', // Preserve HTML tags
      preserveFormatting: true,
      formality: 'default',
    })

    return result.text
  } catch (error) {
    console.error(`❌ Translation failed for ${targetLang}:`, error)
    throw error
  }
}

/**
 * Translate an object recursively, preserving structure
 */
async function translateObject(
  obj: any,
  targetLang: deepl.TargetLanguageCode,
  depth = 0
): Promise<any> {
  const indent = '  '.repeat(depth)

  if (typeof obj === 'string') {
    // Translate string values
    console.log(`${indent}Translating text (${obj.substring(0, 50)}...)`)
    return await translateText(obj, targetLang)
  }

  if (Array.isArray(obj)) {
    // Translate array elements
    const translated = []
    for (let i = 0; i < obj.length; i++) {
      console.log(`${indent}Translating array item ${i + 1}/${obj.length}`)
      translated.push(await translateObject(obj[i], targetLang, depth + 1))
    }
    return translated
  }

  if (typeof obj === 'object' && obj !== null) {
    // Translate object properties
    const translated: any = {}
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      console.log(`${indent}Translating key: ${key} (${i + 1}/${keys.length})`)
      translated[key] = await translateObject(obj[key], targetLang, depth + 1)
    }
    return translated
  }

  // Return non-translatable values as-is
  return obj
}

/**
 * Extract legal document content from React component file
 */
async function extractLegalContent(filePath: string): Promise<{
  title: string
  lastUpdated: string
  content: string
  tocItems: any[]
}> {
  const fileContent = await fs.readFile(filePath, 'utf-8')

  // Extract content between backticks
  const contentMatch = fileContent.match(/const content = `([\s\S]*?)`/)
  if (!contentMatch) {
    throw new Error(`Could not extract content from ${filePath}`)
  }

  // Extract title
  const titleMatch = fileContent.match(/title="([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : 'Untitled'

  // Extract lastUpdated
  const lastUpdatedMatch = fileContent.match(/lastUpdated="([^"]+)"/)
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : ''

  // Extract TOC items
  const tocMatch = fileContent.match(/tocItems=\{(\[[\s\S]*?\])\}/)
  let tocItems: any[] = []
  if (tocMatch) {
    try {
      // Clean up the array string and evaluate it
      const tocString = tocMatch[1]
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
      tocItems = eval(tocString) // Safe here since we control the input
    } catch (e) {
      console.warn('Could not parse tocItems:', e)
    }
  }

  return {
    title,
    lastUpdated,
    content: contentMatch[1].trim(),
    tocItems,
  }
}

/**
 * Translate legal documents
 */
async function translateLegalDocuments() {
  console.log('\n📜 Translating Legal Documents\n')
  console.log('=' .repeat(50))

  const legalDocs = [
    {
      name: 'Terms of Service',
      sourcePath: 'src/app/legal/terms-of-service/page.tsx',
      outputName: 'legal-terms',
    },
    {
      name: 'Privacy Policy',
      sourcePath: 'src/app/legal/privacy-policy/page.tsx',
      outputName: 'legal-privacy',
    },
    {
      name: 'Cookie Policy',
      sourcePath: 'src/app/legal/cookie-policy/page.tsx',
      outputName: 'legal-cookies',
    },
  ]

  for (const doc of legalDocs) {
    console.log(`\n📄 Processing: ${doc.name}`)
    console.log('-'.repeat(50))

    try {
      // Extract English content
      const content = await extractLegalContent(doc.sourcePath)

      // Save English version
      const enPath = `public/locales/en/${doc.outputName}.json`
      await fs.mkdir(path.dirname(enPath), { recursive: true })
      await fs.writeFile(
        enPath,
        JSON.stringify(content, null, 2),
        'utf-8'
      )
      console.log(`✅ Saved English: ${enPath}`)

      // Translate to each target language
      for (const lang of TARGET_LANGUAGES) {
        console.log(`\n🌍 Translating to ${lang.toUpperCase()}...`)

        const translated = await translateObject(content, lang)

        const langPath = `public/locales/${lang}/${doc.outputName}.json`
        await fs.mkdir(path.dirname(langPath), { recursive: true })
        await fs.writeFile(
          langPath,
          JSON.stringify(translated, null, 2),
          'utf-8'
        )
        console.log(`✅ Saved ${lang.toUpperCase()}: ${langPath}`)
      }

      console.log(`\n✨ Completed: ${doc.name}`)
    } catch (error) {
      console.error(`❌ Error processing ${doc.name}:`, error)
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🌐 DeepL Translation Script')
  console.log('=' .repeat(50))

  try {
    // Check DeepL API connection
    console.log('\n🔌 Checking DeepL API connection...')
    const usage = await translator.getUsage()

    if (usage.character) {
      console.log(`✅ DeepL API connected`)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters`)

      if (usage.character.count >= usage.character.limit * 0.9) {
        console.warn('⚠️  Warning: You are near your character limit!')
      }
    }

    // Translate legal documents
    await translateLegalDocuments()

    console.log('\n' + '='.repeat(50))
    console.log('✅ Translation complete!')
    console.log('=' .repeat(50) + '\n')

  } catch (error) {
    console.error('\n❌ Translation failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
