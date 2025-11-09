#!/usr/bin/env tsx

/**
 * Comprehensive DeepL Translation Automation Script
 *
 * This script automatically translates all content in the application:
 * - UI translations (buttons, labels, messages)
 * - Legal documents (Terms, Privacy, Cookies)
 * - Blog posts (if any)
 * - Modal and popup content
 * - Error messages and notifications
 * - All other translatable content
 *
 * Usage:
 *   DEEPL_API_KEY=your_key tsx scripts/translate-all.ts
 *   DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --namespace=translation
 *   DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --language=es
 *   DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --check-only
 *
 * Options:
 *   --namespace=NAME    Translate only a specific namespace
 *   --language=CODE     Translate only to a specific language
 *   --check-only        Check what needs translation without translating
 *   --force            Force retranslation even if files exist
 */

import * as deepl from 'deepl-node'
import fs from 'fs/promises'
import path from 'path'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  namespace: args.find(arg => arg.startsWith('--namespace='))?.split('=')[1] || null,
  language: args.find(arg => arg.startsWith('--language='))?.split('=')[1] || null,
  checkOnly: args.includes('--check-only'),
  force: args.includes('--force'),
}

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required')
  console.error('Get your API key from: https://www.deepl.com/pro-api')
  console.error('\nUsage: DEEPL_API_KEY=your_key tsx scripts/translate-all.ts')
  process.exit(1)
}

// Detect API key type (free keys end with :fx)
const isFreeKey = DEEPL_API_KEY.endsWith(':fx')
const translator = new deepl.Translator(DEEPL_API_KEY, {
  serverUrl: isFreeKey ? 'https://api-free.deepl.com' : undefined
})

// Target languages (DeepL language codes)
const TARGET_LANGUAGES: Record<string, deepl.TargetLanguageCode> = {
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
}

// If specific language requested, filter the list
const languagesToTranslate = options.language
  ? { [options.language]: TARGET_LANGUAGES[options.language] }
  : TARGET_LANGUAGES

// Translation namespaces
const NAMESPACES = [
  'translation',        // Main UI translations
  'legal-terms',       // Terms of Service
  'legal-privacy',     // Privacy Policy
  'legal-cookies',     // Cookie Policy
]

// Filter namespaces if specific one requested
const namespacesToProcess = options.namespace
  ? NAMESPACES.filter(ns => ns === options.namespace)
  : NAMESPACES

// Text patterns that should NOT be translated
const PRESERVE_PATTERNS = [
  'Ori Technologies S.A. de C.V.',
  'Ori Technologies',
  'Ori Platform',
  'support@carlospada.me',
  'Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia',
  'GDPR',
  'API',
  'OAuth',
  'JWT',
  'URL',
  'FAQ',
  'PDF',
  'CSV',
  'JSON',
  'AI',
  'ML',
]

// Keys that should never be translated
const SKIP_KEYS = [
  'id',
  'key',
  'code',
  'locale',
  'lang',
  'language',
  'href',
  'url',
  'path',
  'route',
  'email',
  'phone',
  'address',
]

// Helper to add delay between API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Preserve special patterns in text before translation
 */
function preservePatterns(text: string): { processed: string; placeholders: Map<string, string> } {
  let processed = text
  const placeholders = new Map<string, string>()

  PRESERVE_PATTERNS.forEach((pattern, index) => {
    const placeholder = `__PRESERVE_${index}__`
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    if (processed.includes(pattern)) {
      placeholders.set(placeholder, pattern)
      processed = processed.replace(regex, placeholder)
    }
  })

  return { processed, placeholders }
}

/**
 * Restore preserved patterns after translation
 */
function restorePatterns(text: string, placeholders: Map<string, string>): string {
  let restored = text
  placeholders.forEach((original, placeholder) => {
    restored = restored.replace(new RegExp(placeholder, 'g'), original)
  })
  return restored
}

/**
 * Translate text using DeepL API with retry logic
 */
async function translateText(
  text: string,
  targetLang: deepl.TargetLanguageCode,
  retries = 3
): Promise<string> {
  // Skip empty strings
  if (!text.trim()) return text

  // Preserve special patterns
  const { processed, placeholders } = preservePatterns(text)

  try {
    // Add delay to respect rate limits
    await delay(100)

    const result = await translator.translateText(processed, null, targetLang, {
      tagHandling: 'html',
      preserveFormatting: true,
      formality: 'default',
    })

    // Restore preserved patterns
    return restorePatterns(result.text, placeholders)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('Too many requests') && retries > 0) {
      console.log(`${colors.yellow}⚠️  Rate limited, waiting 2 seconds...${colors.reset}`)
      await delay(2000)
      return translateText(text, targetLang, retries - 1)
    }
    throw error
  }
}

/**
 * Translate an object recursively
 */
async function translateObject(
  obj: unknown,
  targetLang: deepl.TargetLanguageCode,
  parentKey = '',
  depth = 0
): Promise<unknown> {
  if (typeof obj === 'string') {
    // Skip if parent key is in skip list
    if (SKIP_KEYS.some(skip => parentKey.toLowerCase().includes(skip))) {
      return obj
    }

    // Skip URLs and emails
    if (obj.match(/^(https?:\/\/|mailto:|tel:)/)) {
      return obj
    }

    // Translate the string
    return await translateText(obj, targetLang)
  }

  if (Array.isArray(obj)) {
    const translated = []
    for (const item of obj) {
      translated.push(await translateObject(item, targetLang, parentKey, depth + 1))
    }
    return translated
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      // Build the key path for context
      const keyPath = parentKey ? `${parentKey}.${key}` : key
      translated[key] = await translateObject(value, targetLang, keyPath, depth + 1)
    }
    return translated
  }

  return obj
}

/**
 * Simple glob replacement for finding files
 */
async function findFiles(pattern: string): Promise<string[]> {
  const files: string[] = []
  const extensions = ['.ts', '.tsx', '.js', '.jsx']

  async function walkDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          // Skip node_modules, dist, etc
          if (!['node_modules', 'dist', '.next', '.git'].includes(entry.name)) {
            await walkDir(fullPath)
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name)
          if (extensions.includes(ext) && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
            files.push(fullPath)
          }
        }
      }
    } catch (err) {
      // Ignore permission errors
    }
  }

  await walkDir('src')
  return files
}

/**
 * Extract translation keys from React components
 */
async function extractTranslationKeys(): Promise<Set<string>> {
  const keys = new Set<string>()

  // Find all TypeScript/JavaScript files
  const files = await findFiles('src/**/*.{ts,tsx,js,jsx}')

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')

    // Match t('key') or t("key") patterns
    const matches = content.matchAll(/(?:t|i18n\.t|translation)\s*\(\s*['"]([^'"]+)['"]/g)
    for (const match of matches) {
      keys.add(match[1])
    }

    // Match useTranslation('namespace') patterns
    const nsMatches = content.matchAll(/useTranslation\s*\(\s*['"]([^'"]+)['"]/g)
    for (const match of nsMatches) {
      if (!NAMESPACES.includes(match[1])) {
        NAMESPACES.push(match[1])
      }
    }
  }

  return keys
}

/**
 * Merge translations, keeping existing ones and adding missing ones
 */
function mergeTranslations(existing: Record<string, unknown>, newTranslations: Record<string, unknown>): Record<string, unknown> {
  if (!existing) return newTranslations

  const merged = { ...existing }

  for (const [key, value] of Object.entries(newTranslations)) {
    if (!(key in merged)) {
      merged[key] = value
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      merged[key] = mergeTranslations(merged[key] as Record<string, unknown>, value as Record<string, unknown>)
    }
  }

  return merged
}

/**
 * Translate a single namespace
 */
async function translateNamespace(
  namespace: string,
  targetLang: string,
  langCode: deepl.TargetLanguageCode
): Promise<void> {
  const sourcePath = `public/locales/en/${namespace}.json`
  const targetPath = `public/locales/${targetLang}/${namespace}.json`

  // Check if source file exists
  if (!(await fileExists(sourcePath))) {
    console.log(`${colors.yellow}⚠️  Source file not found: ${sourcePath}${colors.reset}`)
    return
  }

  // Read source content
  const sourceContent = await fs.readFile(sourcePath, 'utf-8')
  const sourceJson = JSON.parse(sourceContent)

  // Check if target exists and if we should skip
  if (!options.force && await fileExists(targetPath)) {
    const targetContent = await fs.readFile(targetPath, 'utf-8')
    const targetJson = JSON.parse(targetContent)

    // Check if all keys are present
    const sourceKeys = JSON.stringify(Object.keys(sourceJson).sort())
    const targetKeys = JSON.stringify(Object.keys(targetJson).sort())

    if (sourceKeys === targetKeys) {
      console.log(`${colors.green}✓${colors.reset} Already translated: ${targetPath}`)
      return
    }
  }

  console.log(`${colors.blue}→${colors.reset} Translating ${namespace} to ${targetLang}...`)

  // Translate the content
  const translated = await translateObject(sourceJson, langCode)

  // If file exists and not forcing, merge translations
  let finalContent = translated
  if (!options.force && await fileExists(targetPath)) {
    const existingContent = await fs.readFile(targetPath, 'utf-8')
    const existingJson = JSON.parse(existingContent) as Record<string, unknown>
    finalContent = mergeTranslations(existingJson, translated as Record<string, unknown>)
  }

  // Save the translated content
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, JSON.stringify(finalContent, null, 2), 'utf-8')

  console.log(`${colors.green}✓${colors.reset} Saved: ${targetPath}`)
}

/**
 * Validate all translation files
 */
async function validateTranslations(): Promise<void> {
  console.log(`\n${colors.bright}🔍 Validating Translation Files${colors.reset}`)
  console.log('=' .repeat(50))

  const issues: string[] = []

  for (const namespace of NAMESPACES) {
    const enPath = `public/locales/en/${namespace}.json`

    if (!(await fileExists(enPath))) {
      issues.push(`Missing English source: ${enPath}`)
      continue
    }

    const enContent = await fs.readFile(enPath, 'utf-8')
    const enJson = JSON.parse(enContent)
    const enKeys = new Set(Object.keys(enJson))

    for (const lang of Object.keys(TARGET_LANGUAGES)) {
      const langPath = `public/locales/${lang}/${namespace}.json`

      if (!(await fileExists(langPath))) {
        issues.push(`Missing translation: ${langPath}`)
        continue
      }

      const langContent = await fs.readFile(langPath, 'utf-8')
      const langJson = JSON.parse(langContent)
      const langKeys = new Set(Object.keys(langJson))

      // Check for missing keys
      for (const key of enKeys) {
        if (!langKeys.has(key)) {
          issues.push(`Missing key in ${langPath}: ${key}`)
        }
      }

      // Check for extra keys
      for (const key of langKeys) {
        if (!enKeys.has(key)) {
          issues.push(`Extra key in ${langPath}: ${key}`)
        }
      }
    }
  }

  if (issues.length > 0) {
    console.log(`${colors.yellow}Issues found:${colors.reset}`)
    issues.forEach(issue => console.log(`  - ${issue}`))
  } else {
    console.log(`${colors.green}✓ All translations are valid${colors.reset}`)
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}🌐 Comprehensive DeepL Translation Automation${colors.reset}`)
  console.log('=' .repeat(50))

  try {
    // Check DeepL API connection
    console.log(`\n${colors.bright}🔌 Checking DeepL API...${colors.reset}`)
    const usage = await translator.getUsage()

    if (usage.character) {
      console.log(`${colors.green}✓${colors.reset} Connected to DeepL API`)
      const usagePercent = Math.round((usage.character.count / usage.character.limit) * 100)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters (${usagePercent}%)`)

      if (usagePercent >= 90) {
        console.warn(`${colors.red}⚠️  Warning: You are near your character limit!${colors.reset}`)
      }
    }

    if (options.checkOnly) {
      // Just validate existing translations
      await validateTranslations()
      return
    }

    // Extract translation keys from codebase
    console.log(`\n${colors.bright}🔍 Scanning Codebase${colors.reset}`)
    console.log('-'.repeat(50))
    const usedKeys = await extractTranslationKeys()
    console.log(`Found ${usedKeys.size} translation keys in code`)
    console.log(`Found ${NAMESPACES.length} translation namespaces`)

    // Process each namespace
    console.log(`\n${colors.bright}📝 Processing Translations${colors.reset}`)
    console.log('-'.repeat(50))

    let totalTranslated = 0

    for (const namespace of namespacesToProcess) {
      console.log(`\n${colors.bright}📦 Namespace: ${namespace}${colors.reset}`)

      for (const [lang, langCode] of Object.entries(languagesToTranslate)) {
        await translateNamespace(namespace, lang, langCode)
        totalTranslated++
      }
    }

    // Final validation
    await validateTranslations()

    // Summary
    console.log(`\n${colors.bright}${colors.green}✅ Translation Complete!${colors.reset}`)
    console.log('=' .repeat(50))
    console.log(`Processed ${namespacesToProcess.length} namespaces`)
    console.log(`Translated to ${Object.keys(languagesToTranslate).length} languages`)
    console.log(`Total operations: ${totalTranslated}`)

    // Usage report
    const finalUsage = await translator.getUsage()
    if (finalUsage.character && usage.character) {
      const charactersUsed = finalUsage.character.count - usage.character.count
      console.log(`\n📊 Characters used in this session: ${charactersUsed.toLocaleString()}`)
    }

  } catch (error) {
    console.error(`\n${colors.red}❌ Translation failed:${colors.reset}`, error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { translateText, translateObject, extractTranslationKeys }