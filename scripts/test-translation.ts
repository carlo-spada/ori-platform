#!/usr/bin/env tsx

/**
 * Test Translation Script
 *
 * Simple test to verify DeepL API is working correctly
 */

import * as deepl from 'deepl-node'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY

if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required')
  process.exit(1)
}

async function main() {
  console.log('\n🧪 Testing DeepL Translation\n')
  console.log('=' .repeat(50))

  try {
    // Handle both free and Pro keys
    const isFreeKey = DEEPL_API_KEY.endsWith(':fx')
    const translator = new deepl.Translator(DEEPL_API_KEY, {
      serverUrl: isFreeKey ? 'https://api-free.deepl.com' : undefined
    })
    console.log(`API Key Type: ${isFreeKey ? 'FREE' : 'PRO'}`)

    // Check API connection
    const usage = await translator.getUsage()
    if (usage.character) {
      console.log(`✅ Connected to DeepL API`)
      console.log(`📊 Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()}`)
    }

    // Test translations
    const testPhrases = [
      'Welcome to Ori Platform',
      'Your AI-powered career companion',
      'Sign up for free',
      'Dashboard',
      'Settings',
      'Profile',
    ]

    console.log('\n📝 Testing Translations:\n')

    for (const phrase of testPhrases) {
      console.log(`\nOriginal: "${phrase}"`)
      console.log('-'.repeat(40))

      // Translate to each language
      const languages: deepl.TargetLanguageCode[] = ['de', 'es', 'fr', 'it']

      for (const lang of languages) {
        const result = await translator.translateText(phrase, null, lang, {
          preserveFormatting: true,
        })

        const langName = {
          'de': '🇩🇪 German',
          'es': '🇪🇸 Spanish',
          'fr': '🇫🇷 French',
          'it': '🇮🇹 Italian',
        }[lang]

        console.log(`${langName}: "${result.text}"`)
      }
    }

    // Final usage
    const finalUsage = await translator.getUsage()
    if (finalUsage.character && usage.character) {
      const used = finalUsage.character.count - usage.character.count
      console.log(`\n📊 Characters used in test: ${used}`)
    }

    console.log('\n✅ Translation test complete!\n')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

main()