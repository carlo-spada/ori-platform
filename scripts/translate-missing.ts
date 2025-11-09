#!/usr/bin/env tsx

/**
 * Complete missing legal document translations
 * This script fills in any missing translation files
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

// Helper to add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function translateText(
  text: string,
  targetLang: deepl.TargetLanguageCode,
  retries = 3
): Promise<string> {
  try {
    // Add 500ms delay before each API call to respect rate limits
    await delay(500)

    const result = await translator.translateText(text, null, targetLang, {
      tagHandling: 'html',
      preserveFormatting: true,
      formality: 'default',
    })

    return result.text
  } catch (error: any) {
    if (error.message?.includes('Too many requests') && retries > 0) {
      console.log(`⚠️  Rate limited, waiting 5 seconds... (${retries} retries left)`)
      await delay(5000)
      return translateText(text, targetLang, retries - 1)
    }
    throw error
  }
}

async function translateObject(
  obj: any,
  targetLang: deepl.TargetLanguageCode,
  depth = 0
): Promise<any> {
  const indent = '  '.repeat(depth)

  if (typeof obj === 'string') {
    console.log(`${indent}Translating text snippet...`)
    return await translateText(obj, targetLang)
  }

  if (Array.isArray(obj)) {
    const translated = []
    for (let i = 0; i < obj.length; i++) {
      console.log(`${indent}Array item ${i + 1}/${obj.length}`)
      translated.push(await translateObject(obj[i], targetLang, depth + 1))
    }
    return translated
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: any = {}
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      console.log(`${indent}Key: ${key} (${i + 1}/${keys.length})`)
      translated[key] = await translateObject(obj[key], targetLang, depth + 1)
    }
    return translated
  }

  return obj
}

async function main() {
  console.log('\n📋 Completing Missing Legal Translations\n')
  console.log('=' .repeat(50))

  try {
    // Check DeepL API connection
    console.log('\n🔌 Checking DeepL API...')
    const usage = await translator.getUsage()

    if (usage.character) {
      console.log(`✅ Connected`)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters`)
    }

    // Read English source
    const enPath = 'public/locales/en/legal-terms.json'
    const enContent = await fs.readFile(enPath, 'utf-8')
    const enJson = JSON.parse(enContent)

    // Missing languages
    const missingLangs: deepl.TargetLanguageCode[] = ['es', 'fr', 'it']

    for (const lang of missingLangs) {
      const outputPath = `public/locales/${lang}/legal-terms.json`

      console.log(`\n🌍 Translating to ${lang.toUpperCase()}...`)
      console.log('-'.repeat(50))

      const translated = await translateObject(enJson, lang)

      await fs.mkdir(path.dirname(outputPath), { recursive: true })
      await fs.writeFile(
        outputPath,
        JSON.stringify(translated, null, 2),
        'utf-8'
      )

      console.log(`✅ Saved: ${outputPath}`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Translation complete!')
    console.log('=' .repeat(50) + '\n')

  } catch (error) {
    console.error('\n❌ Translation failed:', error)
    process.exit(1)
  }
}

main()
