#!/usr/bin/env tsx

/**
 * Extract Translatable Content Script
 *
 * This script scans the entire codebase to find:
 * - Hardcoded strings that should be translated
 * - Missing translation keys
 * - Components not using i18n
 * - Inconsistent translation usage
 *
 * Usage:
 *   tsx scripts/extract-translatable.ts
 *   tsx scripts/extract-translatable.ts --fix    # Auto-add to translation files
 *   tsx scripts/extract-translatable.ts --report # Generate detailed report
 */

import fs from 'fs/promises'
import path from 'path'

const args = process.argv.slice(2)
const options = {
  fix: args.includes('--fix'),
  report: args.includes('--report'),
}

// Patterns that indicate hardcoded text
const _TEXT_PATTERNS = [
  // JSX text content
  />([^<>{}\n]+)</g,
  // String literals in props
  /(?:title|label|placeholder|alt|aria-label|message|description|heading|text)=["']([^"']+)["']/g,
  // Button/Link text
  /<(?:Button|Link|NavLink|a)[^>]*>([^<]+)</g,
  // Toast messages
  /toast\.(?:success|error|info|warning)\s*\(["']([^"']+)["']/g,
  // Error messages
  /(?:throw\s+new\s+Error|console\.error)\s*\(["']([^"']+)["']/g,
]

// Patterns to exclude (not translatable)
const EXCLUDE_PATTERNS = [
  /^[0-9\s\-+*/%=<>!&|()[\]{}.,;:]+$/, // Only symbols/numbers
  /^[A-Z_]+$/, // Constants
  /^\s*$/, // Empty/whitespace
  /^(true|false|null|undefined)$/, // Keywords
  /^https?:\/\//, // URLs
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, // Emails
  /^\$?\{.*\}$/, // Template literals
  /^(px|rem|em|vh|vw|%)$/, // CSS units
  /^#[0-9A-Fa-f]{3,8}$/, // Hex colors
  /^rgba?\(/, // RGB colors
]

// File patterns to scan
const _SCAN_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  'src/**/*.jsx',
  'src/**/*.js',
]

// Files/folders to ignore
const _IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/*.d.ts',
  '**/types/**',
  '**/hooks/**',
  '**/lib/**',
  '**/utils/**',
  '**/integrations/api/**',
  '**/integrations/supabase/**',
]

interface ExtractedText {
  text: string
  file: string
  line: number
  type: 'jsx' | 'prop' | 'toast' | 'error' | 'other'
  context?: string
}

interface TranslationKey {
  key: string
  value: string
  namespace?: string
}

/**
 * Check if text should be translated
 */
function shouldTranslate(text: string): boolean {
  // Too short or too long
  if (text.length < 2 || text.length > 200) return false

  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(text)) return false
  }

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(text)) return false

  return true
}

/**
 * Extract line number from position in file
 */
function getLineNumber(content: string, position: number): number {
  const lines = content.substring(0, position).split('\n')
  return lines.length
}

/**
 * Extract hardcoded text from a file
 */
async function extractFromFile(filePath: string): Promise<ExtractedText[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const extracted: ExtractedText[] = []

  // Skip if file already uses i18n heavily
  const _hasI18n = content.includes('useTranslation') || content.includes('i18next')

  // Extract JSX text content
  const jsxMatches = content.matchAll(/>([^<>{}\n]+)</g)
  for (const match of jsxMatches) {
    const text = match[1].trim()
    if (shouldTranslate(text) && !text.includes('{')) {
      extracted.push({
        text,
        file: filePath,
        line: getLineNumber(content, match.index || 0),
        type: 'jsx',
        context: match[0],
      })
    }
  }

  // Extract string props
  const propMatches = content.matchAll(
    /(?:title|label|placeholder|alt|aria-label|message|description|heading|text|helperText|errorText|successText)=["']([^"']+)["']/g
  )
  for (const match of propMatches) {
    const text = match[1].trim()
    if (shouldTranslate(text)) {
      extracted.push({
        text,
        file: filePath,
        line: getLineNumber(content, match.index || 0),
        type: 'prop',
        context: match[0],
      })
    }
  }

  // Extract toast messages
  const toastMatches = content.matchAll(
    /toast\.(?:success|error|info|warning|message)\s*\(["']([^"']+)["']/g
  )
  for (const match of toastMatches) {
    const text = match[1].trim()
    if (shouldTranslate(text)) {
      extracted.push({
        text,
        file: filePath,
        line: getLineNumber(content, match.index || 0),
        type: 'toast',
        context: match[0],
      })
    }
  }

  // Extract error messages
  const errorMatches = content.matchAll(
    /(?:throw\s+new\s+Error|console\.error|console\.warn)\s*\(["']([^"']+)["']/g
  )
  for (const match of errorMatches) {
    const text = match[1].trim()
    if (shouldTranslate(text)) {
      extracted.push({
        text,
        file: filePath,
        line: getLineNumber(content, match.index || 0),
        type: 'error',
        context: match[0],
      })
    }
  }

  // Filter out duplicates within the same file
  const unique = new Map<string, ExtractedText>()
  for (const item of extracted) {
    const key = `${item.text}:${item.type}`
    if (!unique.has(key)) {
      unique.set(key, item)
    }
  }

  return Array.from(unique.values())
}

/**
 * Generate translation key from text
 */
function generateTranslationKey(text: string, type: string): string {
  // Convert to camelCase
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join('')

  // Add prefix based on type
  const prefixes: Record<string, string> = {
    toast: 'toast',
    error: 'error',
    prop: 'label',
    jsx: 'text',
    other: 'text',
  }

  const prefix = prefixes[type] || 'text'
  return `${prefix}.${key}`
}

/**
 * Load existing translation file
 */
async function loadTranslations(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

/**
 * Save translation file
 */
async function saveTranslations(filePath: string, translations: Record<string, unknown>): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf-8')
}

/**
 * Add nested key to object
 */
function addNestedKey(obj: Record<string, unknown>, keyPath: string, value: string): void {
  const keys = keyPath.split('.')
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
 * Simple glob replacement for finding files
 */
async function findSourceFiles(): Promise<string[]> {
  const files: string[] = []
  const extensions = ['.ts', '.tsx', '.js', '.jsx']

  async function walkDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          // Skip ignored directories
          if (!['node_modules', 'dist', '.next', '.git', 'types', 'lib', 'utils'].includes(entry.name)) {
            await walkDir(fullPath)
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name)
          if (extensions.includes(ext) &&
              !entry.name.includes('.test.') &&
              !entry.name.includes('.spec.') &&
              !entry.name.endsWith('.d.ts')) {
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
 * Main execution
 */
async function main() {
  console.log('\n🔍 Extracting Translatable Content\n')
  console.log('=' .repeat(50))

  try {
    // Find all source files
    const files = await findSourceFiles()

    console.log(`Found ${files.length} files to scan\n`)

    // Extract text from all files
    const allExtracted: ExtractedText[] = []
    const fileCount = files.length
    let processed = 0

    for (const file of files) {
      const extracted = await extractFromFile(file)
      allExtracted.push(...extracted)

      processed++
      if (processed % 10 === 0 || processed === fileCount) {
        process.stdout.write(`\rProcessed: ${processed}/${fileCount} files`)
      }
    }

    console.log('\n')

    // Group by text to find duplicates across files
    const textGroups = new Map<string, ExtractedText[]>()
    for (const item of allExtracted) {
      if (!textGroups.has(item.text)) {
        textGroups.set(item.text, [])
      }
      textGroups.get(item.text)!.push(item)
    }

    // Sort by frequency (most common first)
    const sorted = Array.from(textGroups.entries()).sort((a, b) => b[1].length - a[1].length)

    // Generate report
    console.log('\n📊 Summary\n')
    console.log('-'.repeat(50))
    console.log(`Total unique strings: ${sorted.length}`)
    console.log(`Total occurrences: ${allExtracted.length}`)

    // Show top hardcoded strings
    console.log('\n🔝 Top Hardcoded Strings:\n')
    const top10 = sorted.slice(0, 10)
    for (const [text, occurrences] of top10) {
      console.log(`  "${text}" (${occurrences.length} occurrences)`)
      if (options.report) {
        for (const occ of occurrences.slice(0, 3)) {
          console.log(`    - ${occ.file}:${occ.line}`)
        }
        if (occurrences.length > 3) {
          console.log(`    ... and ${occurrences.length - 3} more`)
        }
      }
    }

    // Generate translation keys
    const newTranslations: TranslationKey[] = []
    for (const [text, occurrences] of sorted) {
      const key = generateTranslationKey(text, occurrences[0].type)
      newTranslations.push({
        key,
        value: text,
      })
    }

    if (options.fix) {
      console.log('\n✨ Adding to translation files...\n')

      // Load existing translations
      const enPath = 'public/locales/en/translation.json'
      const existing = await loadTranslations(enPath)

      // Add new keys
      let added = 0
      for (const { key, value } of newTranslations) {
        // Check if key already exists
        const keys = key.split('.')
        let current = existing
        let exists = true

        for (const k of keys) {
          if (!(k in current)) {
            exists = false
            break
          }
          current = current[k]
        }

        if (!exists) {
          addNestedKey(existing, key, value)
          added++
        }
      }

      // Save updated translations
      await saveTranslations(enPath, existing)
      console.log(`✅ Added ${added} new translation keys to ${enPath}`)

      // Create migration guide
      const migrationPath = 'scripts/translation-migration.md'
      const migrationGuide = generateMigrationGuide(sorted)
      await fs.writeFile(migrationPath, migrationGuide, 'utf-8')
      console.log(`📝 Migration guide saved to ${migrationPath}`)
    }

    if (options.report) {
      // Generate detailed report
      const reportPath = 'scripts/translation-report.json'
      const report = {
        summary: {
          totalFiles: files.length,
          uniqueStrings: sorted.length,
          totalOccurrences: allExtracted.length,
        },
        strings: sorted.map(([text, occurrences]) => ({
          text,
          count: occurrences.length,
          suggestedKey: generateTranslationKey(text, occurrences[0].type),
          locations: occurrences.map(o => ({
            file: o.file,
            line: o.line,
            type: o.type,
          })),
        })),
      }

      await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8')
      console.log(`\n📊 Detailed report saved to ${reportPath}`)
    }

  } catch (error) {
    console.error('\n❌ Extraction failed:', error)
    process.exit(1)
  }
}

/**
 * Generate migration guide for developers
 */
function generateMigrationGuide(sorted: [string, ExtractedText[]][]): string {
  let guide = `# Translation Migration Guide

This guide shows how to migrate hardcoded strings to use i18n.

## Setup

\`\`\`tsx
import { useTranslation } from 'react-i18next'

function Component() {
  const { t } = useTranslation()
  // ...
}
\`\`\`

## Common Replacements

`

  // Show examples for top strings
  const examples = sorted.slice(0, 20)
  for (const [text, occurrences] of examples) {
    const key = generateTranslationKey(text, occurrences[0].type)
    const occ = occurrences[0]

    guide += `### "${text}"

**Translation key:** \`${key}\`
**Found in:** ${occurrences.length} location(s)

Before:
\`\`\`tsx
${occ.context}
\`\`\`

After:
\`\`\`tsx
`

    if (occ.type === 'jsx') {
      guide += `{t('${key}')}`
    } else if (occ.type === 'prop') {
      const propName = occ.context?.match(/(\w+)=/)?.[1] || 'prop'
      guide += `${propName}={t('${key}')}`
    } else if (occ.type === 'toast') {
      guide += `toast.${occ.context?.match(/toast\.(\w+)/)?.[1] || 'message'}(t('${key}'))`
    } else if (occ.type === 'error') {
      guide += `throw new Error(t('${key}'))`
    }

    guide += `
\`\`\`

---

`
  }

  return guide
}

// Run the script
if (require.main === module) {
  main()
}

export { extractFromFile, generateTranslationKey }