#!/usr/bin/env tsx

/**
 * Add YAML frontmatter to all markdown files that lack it
 *
 * Intelligently determines:
 * - type (based on path and content)
 * - role (technical-reference, guide, process, etc.)
 * - scope (core, frontend, backend, all)
 * - audience (developers, agents, stakeholders)
 * - relevance (keywords extracted from content)
 * - priority (high for critical docs, medium otherwise)
 * - reading times (estimated from word count)
 *
 * Usage: pnpm add-frontmatter [--dry-run]
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, relative, dirname, basename } from 'path'

const ROOT_DIR = join(__dirname, '..')

// Directories to exclude
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.tasks',
  'services/ai-engine',
]

// Type inference rules based on path
const TYPE_RULES: { pattern: RegExp; type: string }[] = [
  { pattern: /^README\.md$/i, type: 'project-overview' },
  { pattern: /^docs\/CORE\//, type: 'technical-reference' },
  { pattern: /^docs\/OPERATIONS\//, type: 'operational-guide' },
  { pattern: /^docs\/DECISIONS\//, type: 'decision-record' },
  { pattern: /^docs\/REFERENCE\//, type: 'reference-doc' },
  { pattern: /^docs\/CURRENT_PHASE\//, type: 'status-doc' },
  { pattern: /QUICKREF\.md$/i, type: 'quick-reference' },
  { pattern: /^AGENTS\.md$/i, type: 'workflow-guide' },
  { pattern: /^CLAUDE\.md$/i, type: 'agent-guide' },
  { pattern: /^GEMINI\.md$/i, type: 'agent-guide' },
  { pattern: /^DOC_INDEX\.md$/i, type: 'navigation-index' },
  { pattern: /GOVERNANCE\.md$/i, type: 'governance-doc' },
  { pattern: /^branding\//, type: 'brand-guide' },
  { pattern: /ANALYSIS\.md$/i, type: 'analysis-doc' },
  { pattern: /ISSUES\.md$/i, type: 'issue-tracker' },
  { pattern: /ARCHITECTURE\.md$/i, type: 'architecture-doc' },
]

// Scope inference rules based on path
const SCOPE_RULES: { pattern: RegExp; scope: string }[] = [
  { pattern: /^docs\/CORE\/CORE_API/, scope: 'backend' },
  { pattern: /^docs\/CORE\/CORE_DATABASE/, scope: 'database' },
  { pattern: /^src\//, scope: 'frontend' },
  { pattern: /^services\/core-api\//, scope: 'backend' },
  { pattern: /^services\/ai-engine\//, scope: 'ai-engine' },
  { pattern: /^shared\//, scope: 'shared' },
  { pattern: /^\.tasks\//, scope: 'tasks' },
  { pattern: /AGENTS|CLAUDE|GEMINI|DOC_INDEX/, scope: 'all' },
]

// Audience inference
const AUDIENCE_RULES: { pattern: RegExp; audience: string }[] = [
  { pattern: /QUICKREF|AGENTS|CLAUDE|GEMINI/, audience: 'all-agents' },
  { pattern: /README|SETUP/, audience: 'developers' },
  { pattern: /OPERATIONS|DEPLOYMENT/, audience: 'devops' },
  { pattern: /BRAND|MANIFESTO/, audience: 'all' },
]

interface FrontmatterData {
  type: string
  role: string
  scope: string
  audience: string
  'last-updated': string
  relevance: string
  priority: string
  'quick-read-time': string
  'deep-dive-time': string
}

/**
 * Check if file has frontmatter
 */
function hasFrontmatter(content: string): boolean {
  return /^---\n[\s\S]+?\n---\n/.test(content)
}

/**
 * Estimate reading time from word count
 * Average reading speed: 200-250 words per minute
 */
function estimateReadingTime(content: string): {
  quickRead: string
  deepDive: string
} {
  const wordCount = content.trim().split(/\s+/).length
  const quickMinutes = Math.ceil(wordCount / 250)
  const deepMinutes = Math.ceil(wordCount / 150) // Slower for deep reading

  return {
    quickRead: quickMinutes <= 1 ? '1min' : `${quickMinutes}min`,
    deepDive: deepMinutes <= 1 ? '1min' : `${deepMinutes}min`,
  }
}

/**
 * Extract keywords from content (headings and common terms)
 */
function extractKeywords(content: string, filePath: string): string {
  const keywords = new Set<string>()

  // Add keywords from file path
  const pathParts = filePath.toLowerCase().split(/[\/\-_]/)
  pathParts.forEach((part) => {
    if (part.length > 3 && !['docs', 'tasks', 'scripts'].includes(part)) {
      keywords.add(part)
    }
  })

  // Extract from headings
  const headingMatches = content.matchAll(/^#{1,3}\s+(.+)$/gm)
  for (const match of headingMatches) {
    const heading = match[1].toLowerCase()
    const words = heading
      .split(/\s+/)
      .filter((w) => w.length > 3 && !/^\d+$/.test(w))
    words.slice(0, 3).forEach((w) => keywords.add(w))
  }

  // Common technical terms
  const commonTerms = [
    'api',
    'authentication',
    'database',
    'deployment',
    'testing',
    'frontend',
    'backend',
    'stripe',
    'supabase',
    'mcp',
    'workflow',
    'architecture',
    'migration',
  ]
  commonTerms.forEach((term) => {
    if (content.toLowerCase().includes(term)) {
      keywords.add(term)
    }
  })

  // Limit to top 5-7 keywords
  return Array.from(keywords).slice(0, 7).join(', ')
}

/**
 * Infer frontmatter from file path and content
 */
function inferFrontmatter(
  content: string,
  relativePath: string,
): FrontmatterData {
  // Type
  let type = 'documentation'
  for (const rule of TYPE_RULES) {
    if (rule.pattern.test(relativePath)) {
      type = rule.type
      break
    }
  }

  // Scope
  let scope = 'all'
  for (const rule of SCOPE_RULES) {
    if (rule.pattern.test(relativePath)) {
      scope = rule.scope
      break
    }
  }

  // Audience
  let audience = 'developers'
  for (const rule of AUDIENCE_RULES) {
    if (rule.pattern.test(relativePath)) {
      audience = rule.audience
      break
    }
  }

  // Role - simple heuristic based on type
  const roleMap: Record<string, string> = {
    'technical-reference': 'reference',
    'operational-guide': 'guide',
    'decision-record': 'record',
    'quick-reference': 'command-reference',
    'agent-guide': 'implementation',
    'workflow-guide': 'collaboration',
    'navigation-index': 'master-index',
    'governance-doc': 'governance',
    'brand-guide': 'branding',
    'analysis-doc': 'analysis',
    'architecture-doc': 'architecture',
  }
  const role = roleMap[type] || 'documentation'

  // Priority - high for critical docs
  const priority =
    relativePath.includes('CORE') ||
    relativePath.includes('AGENTS') ||
    relativePath.includes('DOC_INDEX') ||
    relativePath.includes('QUICKREF')
      ? 'high'
      : 'medium'

  // Reading time
  const { quickRead, deepDive } = estimateReadingTime(content)

  // Keywords
  const relevance = extractKeywords(content, relativePath)

  // Current date
  const now = new Date()
  const lastUpdated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  return {
    type,
    role,
    scope,
    audience,
    'last-updated': lastUpdated,
    relevance,
    priority,
    'quick-read-time': quickRead,
    'deep-dive-time': deepDive,
  }
}

/**
 * Generate YAML frontmatter string
 */
function generateFrontmatter(data: FrontmatterData): string {
  return `---
type: ${data.type}
role: ${data.role}
scope: ${data.scope}
audience: ${data.audience}
last-updated: ${data['last-updated']}
relevance: ${data.relevance}
priority: ${data.priority}
quick-read-time: ${data['quick-read-time']}
deep-dive-time: ${data['deep-dive-time']}
---

`
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Check if directory should be excluded
      const shouldExclude = EXCLUDED_DIRS.some(
        (excluded) =>
          entry === excluded ||
          fullPath.includes(`/${excluded}/`) ||
          fullPath.includes(`\\${excluded}\\`),
      )

      if (!shouldExclude) {
        findMarkdownFiles(fullPath, files)
      }
    } else if (entry.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Process a single file
 */
function processFile(
  filePath: string,
  dryRun: boolean = false,
): { status: string; file: string } {
  const content = readFileSync(filePath, 'utf-8')
  const relativePath = relative(ROOT_DIR, filePath)

  // Skip if already has frontmatter
  if (hasFrontmatter(content)) {
    return { status: 'skip', file: relativePath }
  }

  // Infer frontmatter
  const frontmatterData = inferFrontmatter(content, relativePath)
  const frontmatterStr = generateFrontmatter(frontmatterData)

  // Add frontmatter to content
  const newContent = frontmatterStr + content

  if (!dryRun) {
    writeFileSync(filePath, newContent, 'utf-8')
    return { status: 'added', file: relativePath }
  } else {
    return { status: 'would-add', file: relativePath }
  }
}

/**
 * Main function
 */
function main(): void {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('🔍 Scanning for markdown files...')
  const allFiles = findMarkdownFiles(ROOT_DIR)
  console.log(`   Found ${allFiles.length} markdown files`)

  console.log('')
  console.log(`${dryRun ? '🧪 DRY RUN MODE' : '✍️  ADDING FRONTMATTER'}`)
  console.log('')

  const results = allFiles.map((file) => processFile(file, dryRun))

  const skipped = results.filter((r) => r.status === 'skip')
  const added = results.filter((r) => r.status === 'added')
  const wouldAdd = results.filter((r) => r.status === 'would-add')

  console.log('📊 Results:')
  console.log(`   ✅ Already has frontmatter: ${skipped.length}`)
  console.log(
    `   ${dryRun ? '📝' : '✨'} ${dryRun ? 'Would add' : 'Added'} frontmatter: ${dryRun ? wouldAdd.length : added.length}`,
  )

  if (dryRun && wouldAdd.length > 0) {
    console.log('')
    console.log('Files that would be updated:')
    wouldAdd.slice(0, 10).forEach((r) => {
      console.log(`   - ${r.file}`)
    })
    if (wouldAdd.length > 10) {
      console.log(`   ... and ${wouldAdd.length - 10} more`)
    }
  } else if (!dryRun && added.length > 0) {
    console.log('')
    console.log('✅ Frontmatter added successfully!')
    console.log('')
    console.log('Sample of updated files:')
    added.slice(0, 10).forEach((r) => {
      console.log(`   - ${r.file}`)
    })
    if (added.length > 10) {
      console.log(`   ... and ${added.length - 10} more`)
    }
  }

  console.log('')
  if (dryRun) {
    console.log('💡 Run without --dry-run to apply changes')
  } else {
    console.log('✅ Done! All markdown files now have frontmatter.')
  }
}

// Run
try {
  main()
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}
