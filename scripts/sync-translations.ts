#!/usr/bin/env tsx

/**
 * Simplified Translation Sync Script
 *
 * This script syncs translations across all languages by:
 * 1. Reading the English source files
 * 2. Translating missing keys in other languages
 * 3. Preserving existing translations
 *
 * Usage:
 *   DEEPL_API_KEY=your_key tsx scripts/sync-translations.ts
 */

import * as deepl from 'deepl-node'
import fs from 'fs/promises'
import path from 'path'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required')
  process.exit(1)
}

const translator = new deepl.Translator(DEEPL_API_KEY)

// Target languages
const TARGET_LANGUAGES: deepl.TargetLanguageCode[] = ['de', 'es', 'fr', 'it']

// Translation namespaces
const NAMESPACES = [
  'translation',
  'legal-terms',
  'legal-privacy',
  'legal-cookies',
]

// Add delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Translate a single text string
 */
async function translateText(
  text: string,
  targetLang: deepl.TargetLanguageCode
): Promise<string> {
  try {
    await delay(200) // 200ms delay between API calls
    const result = await translator.translateText(text, null, targetLang, {
      tagHandling: 'html',
      preserveFormatting: true,
    })
    return result.text
  } catch (error: any) {
    console.error(`Failed to translate to ${targetLang}:`, error.message)
    return text // Return original text if translation fails
  }
}

/**
 * Deep merge objects, only adding missing keys
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key in source) {
    if (!(key in result)) {
      // Key doesn't exist, add it
      result[key] = source[key]
    } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      // Both are objects, merge recursively
      result[key] = deepMerge(result[key], source[key])
    }
    // Else: key exists in target, keep existing translation
  }

  return result
}

/**
 * Find missing keys in target compared to source
 */
function findMissingKeys(source: any, target: any, prefix = ''): string[] {
  const missing: string[] = []

  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (!(key in target)) {
      missing.push(fullKey)
    } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      // Recursively check nested objects
      const nestedMissing = findMissingKeys(source[key], target[key], fullKey)
      missing.push(...nestedMissing)
    }
  }

  return missing
}

/**
 * Get value from nested object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Set value in nested object using dot notation
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value
}

/**
 * Translate missing keys for a single namespace and language
 */
async function translateMissingKeys(
  namespace: string,
  targetLang: deepl.TargetLanguageCode
): Promise<number> {
  const sourcePath = `public/locales/en/${namespace}.json`
  const targetPath = `public/locales/${targetLang}/${namespace}.json`

  try {
    // Read source (English) file
    const sourceContent = await fs.readFile(sourcePath, 'utf-8')
    const sourceJson = JSON.parse(sourceContent)

    // Read target file (or create empty object if doesn't exist)
    let targetJson = {}
    try {
      const targetContent = await fs.readFile(targetPath, 'utf-8')
      targetJson = JSON.parse(targetContent)
    } catch {
      // File doesn't exist, will create it
    }

    // Find missing keys
    const missingKeys = findMissingKeys(sourceJson, targetJson)

    if (missingKeys.length === 0) {
      console.log(`  ✅ ${namespace} (${targetLang}): All keys present`)
      return 0
    }

    console.log(`  📝 ${namespace} (${targetLang}): Translating ${missingKeys.length} missing keys...`)

    // Translate each missing key
    let translated = 0
    for (const key of missingKeys) {
      const sourceValue = getNestedValue(sourceJson, key)

      if (typeof sourceValue === 'string') {
        const translatedValue = await translateText(sourceValue, targetLang)
        setNestedValue(targetJson, key, translatedValue)
        translated++

        // Show progress
        if (translated % 5 === 0 || translated === missingKeys.length) {
          process.stdout.write(`\r    → Progress: ${translated}/${missingKeys.length} keys translated`)
        }
      } else if (typeof sourceValue === 'object') {
        // For objects, copy the structure (will be handled recursively)
        setNestedValue(targetJson, key, sourceValue)
      }
    }

    if (translated > 0) {
      console.log('') // New line after progress
    }

    // Save the updated translation file
    await fs.mkdir(path.dirname(targetPath), { recursive: true })
    await fs.writeFile(targetPath, JSON.stringify(targetJson, null, 2), 'utf-8')

    console.log(`  ✅ ${namespace} (${targetLang}): ${translated} keys translated and saved`)
    return translated

  } catch (error) {
    console.error(`  ❌ Error processing ${namespace} (${targetLang}):`, error)
    return 0
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🌐 Translation Sync Script')
  console.log('=' .repeat(50))

  try {
    // Check DeepL API
    console.log('\n🔌 Checking DeepL API...')
    const usage = await translator.getUsage()

    if (usage.character) {
      const percent = Math.round((usage.character.count / usage.character.limit) * 100)
      console.log(`✅ Connected to DeepL`)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} (${percent}%)`)

      if (percent >= 90) {
        console.warn('⚠️  Warning: Near character limit!')
      }
    }

    // Process each namespace
    console.log('\n📝 Processing Translations')
    console.log('-'.repeat(50))

    let totalTranslated = 0

    for (const namespace of NAMESPACES) {
      console.log(`\n📦 Namespace: ${namespace}`)

      for (const lang of TARGET_LANGUAGES) {
        const count = await translateMissingKeys(namespace, lang)
        totalTranslated += count
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ Translation Sync Complete!')
    console.log(`📊 Total keys translated: ${totalTranslated}`)

    // Check final usage
    const finalUsage = await translator.getUsage()
    if (finalUsage.character && usage.character) {
      const used = finalUsage.character.count - usage.character.count
      console.log(`📝 Characters used in this session: ${used.toLocaleString()}`)
    }

  } catch (error) {
    console.error('\n❌ Translation sync failed:', error)
    process.exit(1)
  }
}

// Run the script
main()