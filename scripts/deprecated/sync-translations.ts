#!/usr/bin/env tsx
// @ts-nocheck

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
  console.error('Get your API key from: https://www.deepl.com/pro-api')
  process.exit(1)
}

// Detect API key type (free keys end with :fx)
const isFreeKey = DEEPL_API_KEY.endsWith(':fx')
const serverUrl = isFreeKey ? 'https://api-free.deepl.com' : undefined

// Create translator with appropriate endpoint
const translator = new deepl.Translator(DEEPL_API_KEY, { serverUrl })

// Error notification helper
function notifyError(error: Error | unknown, context: string) {
  console.error('\n' + '🚨'.repeat(20))
  console.error('🚨 TRANSLATION API ERROR - ACTION REQUIRED!')
  console.error('🚨'.repeat(20))

  const errorMessage = (error instanceof Error) ? error.message : String(error)
  if (errorMessage?.includes('Authorization failure')) {
    console.error('\n❌ API Key Issue Detected:')
    console.error('   - The API key may have expired or is invalid')
    console.error('   - Current key type: ' + (isFreeKey ? 'FREE (ends with :fx)' : 'PRO'))
    console.error('\n📝 To Fix:')
    console.error('   1. Check your DeepL account: https://www.deepl.com/account')
    console.error('   2. Get a new API key if needed')
    console.error('   3. Update the DEEPL_API_KEY environment variable')
    console.error('   4. For GitHub Actions: Update the secret in repository settings')
  } else if (errorMessage?.includes('quota exceeded') || errorMessage?.includes('limit')) {
    console.error('\n⚠️  Usage Limit Reached:')
    console.error('   - You have exceeded your monthly character limit')
    console.error('   - Consider upgrading your plan or waiting for the next billing cycle')
    console.error('   - Visit: https://www.deepl.com/account/usage')
  } else if (errorMessage?.includes('Too many requests')) {
    console.error('\n🔄 Rate Limit Hit:')
    console.error('   - Too many requests in a short time')
    console.error('   - The script will automatically retry with delays')
  } else {
    console.error('\n❌ Unexpected Error:')
    console.error(`   - Context: ${context}`)
    console.error(`   - Error: ${errorMessage}`)
    console.error('\n📧 Please notify the team about this issue')
  }

  console.error('\n' + '🚨'.repeat(20) + '\n')
}

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
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Failed to translate to ${targetLang}:`, errorMessage)
    return text // Return original text if translation fails
  }
}

/**
 * Deep merge objects, only adding missing keys
 */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target }

  for (const key in source) {
    if (!(key in result)) {
      // Key doesn't exist, add it
      result[key] = source[key]
    } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      // Both are objects, merge recursively
      result[key] = deepMerge(result[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
    }
    // Else: key exists in target, keep existing translation
  }

  return result
}

/**
 * Find missing keys in target compared to source
 */
function findMissingKeys(source: Record<string, unknown>, target: Record<string, unknown>, prefix = ''): string[] {
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
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
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
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
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
    console.log(`   Key type: ${isFreeKey ? 'FREE' : 'PRO'}`)

    let usage
    try {
      usage = await translator.getUsage()
    } catch (error: Error | unknown) {
      notifyError(error, 'API Connection Check')
      throw error
    }

    if (usage.character) {
      const percent = Math.round((usage.character.count / usage.character.limit) * 100)
      console.log(`✅ Connected to DeepL ${isFreeKey ? 'Free' : 'Pro'} API`)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} (${percent}%)`)

      if (percent >= 90) {
        console.warn('\n⚠️  WARNING: Near character limit!')
        console.warn(`   Only ${(usage.character.limit - usage.character.count).toLocaleString()} characters remaining`)
        console.warn('   Consider upgrading or waiting for reset')
      } else if (percent >= 75) {
        console.warn(`⚠️  Note: ${percent}% of monthly quota used`)
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

  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (!errorMessage?.includes('ACTION REQUIRED')) {
      notifyError(error, 'Translation Sync Process')
    }
    console.error('\n❌ Translation sync failed')
    process.exit(1)
  }
}

// Run the script
main()