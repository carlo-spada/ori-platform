#!/usr/bin/env tsx

/**
 * Unified Translation System
 *
 * This is the consolidated translation script that replaces all previous translation scripts.
 * It handles all translation needs: UI strings, legal documents, blog posts, and more.
 *
 * Usage:
 *   DEEPL_API_KEY=your_key tsx scripts/translate.ts [options]
 *
 * Options:
 *   --sync              Translate only missing keys (default)
 *   --force             Retranslate all keys, overwriting existing
 *   --check             Check for missing translations without changes
 *   --namespace=NAME    Target specific namespace(s), comma-separated
 *   --language=CODE     Target specific language(s), comma-separated
 *   --verbose           Show detailed progress
 *   --dry-run           Preview changes without writing files
 *
 * Examples:
 *   tsx scripts/translate.ts                                    # Sync all missing translations
 *   tsx scripts/translate.ts --force --namespace=legal-terms    # Force retranslate legal terms
 *   tsx scripts/translate.ts --check                            # Check translation status
 *   tsx scripts/translate.ts --language=de,es                   # Translate only German and Spanish
 */

import * as deepl from 'deepl-node'
import fs from 'fs/promises'
import path from 'path'
import { parseArgs } from 'util'

// Parse command line arguments
const { values: options } = parseArgs({
  args: process.argv.slice(2),
  options: {
    sync: { type: 'boolean', default: true },
    force: { type: 'boolean', default: false },
    check: { type: 'boolean', default: false },
    namespace: { type: 'string' },
    language: { type: 'string' },
    verbose: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
})

// Configuration
const LOCALES_DIR = 'public/locales'
const SOURCE_LANG = 'en'
const TARGET_LANGUAGES: Record<string, deepl.TargetLanguageCode> = {
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
}

// All available namespaces
const ALL_NAMESPACES = [
  'translation', // Main UI translations
  'legal-terms', // Terms of Service
  'legal-privacy', // Privacy Policy
  'legal-cookies', // Cookie Policy
]

// Failed translations log
const FAILED_LOG_DIR = '.tmp'
const FAILED_LOG_FILE = path.join(FAILED_LOG_DIR, 'failed-translations.log')

// Statistics tracking
const stats = {
  checked: 0,
  missing: 0,
  translated: 0,
  failed: 0,
  skipped: 0,
  charactersUsed: 0,
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

// Get DeepL API key
const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) {
  console.error(
    `${colors.red}❌ Error: DEEPL_API_KEY environment variable is required${colors.reset}`,
  )
  console.error('Get your API key from: https://www.deepl.com/pro-api')
  console.error('\nUsage: DEEPL_API_KEY=your_key tsx scripts/translate.ts')
  process.exit(1)
}

// Detect API key type and create translator
const isFreeKey = DEEPL_API_KEY.endsWith(':fx')
const translator = new deepl.Translator(DEEPL_API_KEY, {
  serverUrl: isFreeKey ? 'https://api-free.deepl.com' : undefined,
})

/**
 * Enhanced error notification system
 */
function notifyError(error: Error | unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error)

  console.error(`\n${colors.red}${'🚨'.repeat(20)}${colors.reset}`)
  console.error(
    `${colors.red}🚨 TRANSLATION ERROR - ACTION REQUIRED!${colors.reset}`,
  )
  console.error(`${colors.red}${'🚨'.repeat(20)}${colors.reset}`)

  if (
    errorMessage.includes('Authorization failure') ||
    errorMessage.includes('403')
  ) {
    console.error(`\n${colors.red}❌ API Key Issue Detected${colors.reset}`)
    console.error(
      `   • Key type: ${isFreeKey ? 'FREE (ends with :fx)' : 'PRO'}`,
    )
    console.error(`   • The API key may be expired or invalid`)
    console.error(`\n${colors.yellow}📝 To Fix:${colors.reset}`)
    console.error(
      '   1. Check your DeepL account: https://www.deepl.com/account',
    )
    console.error('   2. Verify the API key is active')
    console.error('   3. Update DEEPL_API_KEY environment variable')
    console.error('   4. For GitHub Actions: Update repository secret')
  } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
    console.error(`\n${colors.yellow}⚠️  Usage Limit Reached${colors.reset}`)
    console.error('   • Monthly character limit exceeded')
    console.error('   • Check usage: https://www.deepl.com/account/usage')
    console.error('   • Consider upgrading or waiting for reset')
  } else if (errorMessage.includes('rate')) {
    console.error(`\n${colors.yellow}🔄 Rate Limit Hit${colors.reset}`)
    console.error('   • Too many requests in short time')
    console.error('   • Script will retry with delays')
  } else {
    console.error(`\n${colors.red}❌ Unexpected Error${colors.reset}`)
    console.error(`   • Context: ${context}`)
    console.error(`   • Error: ${errorMessage}`)
  }

  console.error(`\n${colors.red}${'🚨'.repeat(20)}${colors.reset}\n`)
}

/**
 * Log failed translation for manual review
 */
async function logFailedTranslation(
  namespace: string,
  language: string,
  key: string,
  error: string,
): Promise<void> {
  try {
    await fs.mkdir(FAILED_LOG_DIR, { recursive: true })
    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp} | ${namespace} | ${language} | ${key} | ${error}\n`
    await fs.appendFile(FAILED_LOG_FILE, logEntry)
  } catch (err) {
    // Silently fail if can't write log
  }
}

/**
 * Load JSON file safely
 */
async function loadJson(
  filePath: string,
): Promise<Record<string, unknown> | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

/**
 * Save JSON file with proper formatting
 */
async function saveJson(
  filePath: string,
  data: Record<string, unknown>,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

/**
 * Extract all keys from nested object with dot notation
 */
function extractKeys(
  obj: Record<string, unknown>,
  prefix = '',
): Map<string, unknown> {
  const keys = new Map<string, unknown>()

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively extract nested keys
      const nestedKeys = extractKeys(value as Record<string, unknown>, fullKey)
      for (const [k, v] of nestedKeys) {
        keys.set(k, v)
      }
    } else {
      keys.set(fullKey, value)
    }
  }

  return keys
}

/**
 * Set nested value using dot notation
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split('.')
  let current: Record<string, unknown> = obj

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {}
    }
    current = current[keys[i]] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
}

/**
 * Translate text with retry logic and rate limiting
 */
async function translateText(
  text: string,
  targetLang: deepl.TargetLanguageCode,
  retries = 3,
): Promise<string> {
  // Skip empty strings
  if (!text || !text.trim()) return text

  // Add delay to respect rate limits
  await new Promise((resolve) => setTimeout(resolve, 100))

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await translator.translateText(text, null, targetLang, {
        tagHandling: 'html',
        preserveFormatting: true,
      })

      stats.charactersUsed += text.length
      return result.text
    } catch (error) {
      if (attempt === retries) {
        throw error
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
      if (options.verbose) {
        console.log(
          `${colors.yellow}   ⏳ Retry ${attempt}/${retries} after ${delay}ms${colors.reset}`,
        )
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return text // Fallback to original
}

/**
 * Process a single namespace for a language
 */
async function processNamespace(
  namespace: string,
  targetLang: string,
  targetLangCode: deepl.TargetLanguageCode,
): Promise<void> {
  stats.checked++

  const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG, `${namespace}.json`)
  const targetPath = path.join(LOCALES_DIR, targetLang, `${namespace}.json`)

  // Load source content
  const sourceContent = await loadJson(sourcePath)
  if (!sourceContent) {
    console.log(
      `${colors.yellow}   ⚠️  Source not found: ${sourcePath}${colors.reset}`,
    )
    stats.skipped++
    return
  }

  // Extract all source keys
  const sourceKeys = extractKeys(sourceContent)

  // Load or initialize target content
  const targetContent = (await loadJson(targetPath)) || {}
  const targetKeys = extractKeys(targetContent)

  // Find missing keys
  const missingKeys: string[] = []
  for (const [key, value] of sourceKeys) {
    if (!targetKeys.has(key) || options.force) {
      if (typeof value === 'string') {
        missingKeys.push(key)
      }
    }
  }

  if (missingKeys.length === 0) {
    if (options.verbose) {
      console.log(`${colors.green}   ✅ All keys present${colors.reset}`)
    }
    return
  }

  stats.missing += missingKeys.length

  // Check-only mode
  if (options.check) {
    console.log(
      `${colors.yellow}   ⚠️  Missing ${missingKeys.length} keys${colors.reset}`,
    )
    if (options.verbose) {
      missingKeys.slice(0, 5).forEach((key) => {
        console.log(`${colors.dim}      - ${key}${colors.reset}`)
      })
      if (missingKeys.length > 5) {
        console.log(
          `${colors.dim}      ... and ${missingKeys.length - 5} more${colors.reset}`,
        )
      }
    }
    return
  }

  // Dry-run mode
  if (options['dry-run']) {
    console.log(
      `${colors.blue}   🔍 Would translate ${missingKeys.length} keys${colors.reset}`,
    )
    return
  }

  // Translate missing keys
  console.log(
    `${colors.cyan}   📝 Translating ${missingKeys.length} keys...${colors.reset}`,
  )

  let translated = 0
  let failed = 0

  for (let i = 0; i < missingKeys.length; i++) {
    const key = missingKeys[i]
    const sourceValue = sourceKeys.get(key)

    try {
      if (options.verbose && i % 10 === 0) {
        process.stdout.write(
          `\r   ${colors.dim}Progress: ${i}/${missingKeys.length}${colors.reset}`,
        )
      }

      const translatedValue = await translateText(
        sourceValue as string,
        targetLangCode,
      )
      setNestedValue(targetContent, key, translatedValue)
      translated++
      stats.translated++
    } catch (error) {
      failed++
      stats.failed++
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await logFailedTranslation(namespace, targetLang, key, errorMessage)

      // Keep original or source value on failure
      if (!targetKeys.has(key)) {
        setNestedValue(
          targetContent,
          key,
          `[TRANSLATION_FAILED] ${sourceValue as string}`,
        )
      }
    }
  }

  // Clear progress line
  if (options.verbose) {
    process.stdout.write('\r' + ' '.repeat(50) + '\r')
  }

  // Save updated content
  await saveJson(targetPath, targetContent)

  // Report results
  const status = failed > 0 ? colors.yellow : colors.green
  const icon = failed > 0 ? '⚠️' : '✅'
  console.log(
    `${status}   ${icon} Translated: ${translated}, Failed: ${failed}${colors.reset}`,
  )
}

/**
 * Main execution
 */
async function main() {
  console.log(
    `\n${colors.bright}${colors.cyan}🌐 Unified Translation System${colors.reset}`,
  )
  console.log('='.repeat(50))

  // Determine mode
  const mode = options.check ? 'CHECK' : options.force ? 'FORCE' : 'SYNC'
  console.log(`Mode: ${colors.bright}${mode}${colors.reset}`)

  if (options['dry-run']) {
    console.log(
      `${colors.yellow}DRY RUN - No files will be modified${colors.reset}`,
    )
  }

  try {
    // Check API connection
    console.log(`\n${colors.bright}🔌 Checking DeepL API...${colors.reset}`)
    console.log(`Key type: ${isFreeKey ? 'FREE' : 'PRO'}`)

    const usage = await translator.getUsage()
    if (usage.character) {
      const percent = Math.round(
        (usage.character.count / usage.character.limit) * 100,
      )
      const remaining = usage.character.limit - usage.character.count

      console.log(`${colors.green}✅ Connected to DeepL${colors.reset}`)
      console.log(
        `📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} (${percent}%)`,
      )

      if (percent >= 90) {
        console.warn(
          `${colors.red}⚠️  WARNING: Only ${remaining.toLocaleString()} characters remaining!${colors.reset}`,
        )
      } else if (percent >= 75) {
        console.warn(
          `${colors.yellow}📊 Note: ${percent}% of quota used${colors.reset}`,
        )
      }
    }

    // Determine namespaces to process
    const namespacesToProcess = options.namespace
      ? options.namespace.split(',').map((ns) => ns.trim())
      : ALL_NAMESPACES

    // Determine languages to process
    const languagesToProcess = options.language
      ? options.language.split(',').map((lang) => lang.trim())
      : Object.keys(TARGET_LANGUAGES)

    // Validate selections
    const invalidNamespaces = namespacesToProcess.filter(
      (ns) => !ALL_NAMESPACES.includes(ns),
    )
    if (invalidNamespaces.length > 0) {
      console.error(
        `${colors.red}❌ Invalid namespaces: ${invalidNamespaces.join(', ')}${colors.reset}`,
      )
      console.error(`Available: ${ALL_NAMESPACES.join(', ')}`)
      process.exit(1)
    }

    const invalidLanguages = languagesToProcess.filter(
      (lang) => !(lang in TARGET_LANGUAGES),
    )
    if (invalidLanguages.length > 0) {
      console.error(
        `${colors.red}❌ Invalid languages: ${invalidLanguages.join(', ')}${colors.reset}`,
      )
      console.error(`Available: ${Object.keys(TARGET_LANGUAGES).join(', ')}`)
      process.exit(1)
    }

    // Process translations
    console.log(`\n${colors.bright}📝 Processing Translations${colors.reset}`)
    console.log('-'.repeat(50))
    console.log(`Namespaces: ${namespacesToProcess.join(', ')}`)
    console.log(`Languages: ${languagesToProcess.join(', ')}`)
    console.log()

    for (const namespace of namespacesToProcess) {
      console.log(`${colors.bright}📦 ${namespace}${colors.reset}`)

      for (const lang of languagesToProcess) {
        const langCode = TARGET_LANGUAGES[lang]
        console.log(` ${colors.dim}[${lang}]${colors.reset}`)
        await processNamespace(namespace, lang, langCode)
      }

      console.log()
    }

    // Final statistics
    console.log('='.repeat(50))

    if (options.check) {
      console.log(`${colors.bright}📊 Check Complete${colors.reset}`)
      console.log(`Files checked: ${stats.checked}`)
      console.log(`Missing keys: ${stats.missing}`)

      if (stats.missing > 0) {
        console.log(
          `\n${colors.yellow}Run without --check to translate missing keys${colors.reset}`,
        )
      }
    } else {
      console.log(
        `${colors.bright}${colors.green}✅ Translation Complete${colors.reset}`,
      )
      console.log(`Files processed: ${stats.checked}`)
      console.log(`Keys translated: ${stats.translated}`)

      if (stats.failed > 0) {
        console.log(
          `${colors.yellow}Keys failed: ${stats.failed}${colors.reset}`,
        )
        console.log(
          `${colors.dim}See ${FAILED_LOG_FILE} for details${colors.reset}`,
        )
      }

      console.log(`Characters used: ${stats.charactersUsed.toLocaleString()}`)

      // Check final usage
      const finalUsage = await translator.getUsage()
      if (finalUsage.character && usage.character) {
        const sessionUsage = finalUsage.character.count - usage.character.count
        console.log(
          `Session usage: ${sessionUsage.toLocaleString()} characters`,
        )
      }
    }

    // Check for failed translations log
    try {
      await fs.access(FAILED_LOG_FILE)
      console.log(
        `\n${colors.yellow}⚠️  Failed translations logged to: ${FAILED_LOG_FILE}${colors.reset}`,
      )
    } catch {
      // No failed translations
    }
  } catch (error) {
    notifyError(error, 'Translation Process')
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { translateText, processNamespace }
