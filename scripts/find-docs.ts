#!/usr/bin/env tsx

/**
 * Documentation Search Tool
 *
 * Searches across all markdown documentation using YAML frontmatter metadata.
 * Ranks results by relevance and displays formatted output with snippets.
 *
 * Usage:
 *   pnpm find-docs "authentication"
 *   pnpm find-docs "mcp setup"
 *   pnpm find-docs "stripe integration" --limit 5
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// Types
interface FrontmatterData {
  type?: string
  role?: string
  scope?: string
  audience?: string
  relevance?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  'quick-read-time'?: string
  'deep-dive-time'?: string
  'last-updated'?: string
}

interface SearchResult {
  filePath: string
  title: string
  frontmatter: FrontmatterData | null
  score: number
  snippet: string
  matchedIn: string[]
}

// Configuration
const PROJECT_ROOT = join(__dirname, '..')
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '.vercel', 'coverage']
const MAX_SNIPPET_LENGTH = 150

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

// Parse YAML frontmatter
function parseFrontmatter(content: string): { frontmatter: FrontmatterData | null; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: null, body: content }
  }

  const frontmatterText = match[1]
  const body = match[2]

  const frontmatter: FrontmatterData = {}

  // Parse YAML manually (simple key: value pairs)
  const lines = frontmatterText.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim()

    if (key && value) {
      frontmatter[key as keyof FrontmatterData] = value as any
    }
  }

  return { frontmatter, body }
}

// Find all markdown files recursively
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry)) {
        findMarkdownFiles(fullPath, files)
      }
    } else if (entry.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

// Extract title from markdown content
function extractTitle(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim()
    }
  }
  return 'Untitled'
}

// Extract all headings from markdown
function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm
  const headings: string[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1].trim())
  }

  return headings
}

// Calculate relevance score
function calculateScore(
  query: string,
  title: string,
  frontmatter: FrontmatterData | null,
  body: string,
  filePath: string,
): { score: number; matchedIn: string[] } {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  let score = 0
  const matchedIn: string[] = []

  // Title match (highest weight: 50 points)
  if (title.toLowerCase().includes(queryLower)) {
    score += 50
    matchedIn.push('title')
  } else {
    // Partial word matches in title
    for (const word of queryWords) {
      if (title.toLowerCase().includes(word)) {
        score += 10
      }
    }
  }

  // File path match (30 points)
  if (filePath.toLowerCase().includes(queryLower)) {
    score += 30
    matchedIn.push('file path')
  }

  if (frontmatter) {
    // Relevance keywords (40 points)
    if (frontmatter.relevance) {
      const relevanceKeywords = frontmatter.relevance.toLowerCase()
      if (relevanceKeywords.includes(queryLower)) {
        score += 40
        matchedIn.push('relevance keywords')
      } else {
        for (const word of queryWords) {
          if (relevanceKeywords.includes(word)) {
            score += 8
          }
        }
      }
    }

    // Priority boost
    if (frontmatter.priority === 'critical') score += 15
    else if (frontmatter.priority === 'high') score += 10
    else if (frontmatter.priority === 'medium') score += 5

    // Type and role match (20 points each)
    if (frontmatter.type?.toLowerCase().includes(queryLower)) {
      score += 20
      matchedIn.push('document type')
    }
    if (frontmatter.role?.toLowerCase().includes(queryLower)) {
      score += 20
      matchedIn.push('role')
    }

    // Scope match (15 points)
    if (frontmatter.scope?.toLowerCase().includes(queryLower)) {
      score += 15
      matchedIn.push('scope')
    }

    // Audience match (10 points)
    if (frontmatter.audience?.toLowerCase().includes(queryLower)) {
      score += 10
      matchedIn.push('audience')
    }
  }

  // Extract headings for context
  const headings = extractHeadings(body)
  for (const heading of headings) {
    if (heading.toLowerCase().includes(queryLower)) {
      score += 15
      if (!matchedIn.includes('headings')) {
        matchedIn.push('headings')
      }
    }
  }

  // Body content match (5 points per occurrence, max 25)
  const bodyLower = body.toLowerCase()
  const occurrences = (bodyLower.match(new RegExp(queryLower, 'g')) || []).length
  score += Math.min(occurrences * 5, 25)
  if (occurrences > 0 && !matchedIn.includes('content')) {
    matchedIn.push('content')
  }

  return { score, matchedIn }
}

// Generate context snippet
function generateSnippet(content: string, query: string): string {
  const queryLower = query.toLowerCase()
  const contentLower = content.toLowerCase()

  // Find first occurrence
  const index = contentLower.indexOf(queryLower)

  if (index === -1) {
    // No exact match, return first meaningful line
    const lines = content.split('\n').filter(line => line.trim().length > 20)
    if (lines.length > 0) {
      const snippet = lines[0].trim()
      return snippet.length > MAX_SNIPPET_LENGTH
        ? snippet.substring(0, MAX_SNIPPET_LENGTH) + '...'
        : snippet
    }
    return ''
  }

  // Extract context around match
  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + queryLower.length + 100)
  let snippet = content.substring(start, end)

  // Clean up snippet
  snippet = snippet.replace(/\n+/g, ' ').trim()

  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'

  return snippet
}

// Format priority badge
function formatPriority(priority?: string): string {
  if (!priority) return ''

  switch (priority) {
    case 'critical':
      return `${colors.red}[CRITICAL]${colors.reset}`
    case 'high':
      return `${colors.yellow}[HIGH]${colors.reset}`
    case 'medium':
      return `${colors.blue}[MEDIUM]${colors.reset}`
    case 'low':
      return `${colors.dim}[LOW]${colors.reset}`
    default:
      return ''
  }
}

// Search all documents
function searchDocuments(query: string, limit: number = 10): SearchResult[] {
  const markdownFiles = findMarkdownFiles(PROJECT_ROOT)
  const results: SearchResult[] = []

  for (const filePath of markdownFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const { frontmatter, body } = parseFrontmatter(content)
      const title = extractTitle(body)

      const { score, matchedIn } = calculateScore(query, title, frontmatter, body, filePath)

      if (score > 0) {
        const relativePath = relative(PROJECT_ROOT, filePath)
        const snippet = generateSnippet(body, query)

        results.push({
          filePath: relativePath,
          title,
          frontmatter,
          score,
          snippet,
          matchedIn,
        })
      }
    } catch (error) {
      // Skip files that can't be read
      continue
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}

// Display results
function displayResults(results: SearchResult[], query: string) {
  if (results.length === 0) {
    console.log(`\n${colors.yellow}No documents found matching "${query}"${colors.reset}\n`)
    console.log(`${colors.dim}Try:`)
    console.log(`  - Using different keywords`)
    console.log(`  - Checking spelling`)
    console.log(`  - Using more general terms${colors.reset}\n`)
    return
  }

  console.log(`\n${colors.bright}${colors.green}Found ${results.length} document(s) matching "${query}"${colors.reset}\n`)

  results.forEach((result, index) => {
    const rank = `${colors.dim}${index + 1}.${colors.reset}`
    const priority = formatPriority(result.frontmatter?.priority)
    const title = `${colors.bright}${colors.cyan}${result.title}${colors.reset}`
    const path = `${colors.dim}${result.filePath}${colors.reset}`
    const score = `${colors.magenta}[Score: ${result.score}]${colors.reset}`

    console.log(`${rank} ${title} ${priority}`)
    console.log(`   ${path}`)
    console.log(`   ${score} ${colors.dim}Matched in: ${result.matchedIn.join(', ')}${colors.reset}`)

    if (result.frontmatter) {
      const meta: string[] = []

      if (result.frontmatter.type) meta.push(`Type: ${result.frontmatter.type}`)
      if (result.frontmatter.role) meta.push(`Role: ${result.frontmatter.role}`)
      if (result.frontmatter['quick-read-time']) meta.push(`Quick read: ${result.frontmatter['quick-read-time']}`)

      if (meta.length > 0) {
        console.log(`   ${colors.dim}${meta.join(' | ')}${colors.reset}`)
      }
    }

    if (result.snippet) {
      console.log(`   ${colors.dim}"${result.snippet}"${colors.reset}`)
    }

    console.log()
  })

  console.log(`${colors.dim}Use "cat ${colors.reset}${colors.cyan}<file-path>${colors.reset}${colors.dim}" or Read tool to view full document${colors.reset}\n`)
}

// Main execution
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}${colors.cyan}Documentation Search Tool${colors.reset}

${colors.bright}Usage:${colors.reset}
  pnpm find-docs <query> [options]

${colors.bright}Options:${colors.reset}
  --limit <n>     Maximum number of results (default: 10)
  --help, -h      Show this help message

${colors.bright}Examples:${colors.reset}
  pnpm find-docs "authentication"
  pnpm find-docs "mcp setup"
  pnpm find-docs "stripe integration" --limit 5
  pnpm find-docs "database schema"

${colors.bright}Search Coverage:${colors.reset}
  - Document titles
  - YAML frontmatter (type, role, scope, relevance keywords)
  - Section headings
  - File paths
  - Document content

${colors.bright}Ranking Factors:${colors.reset}
  - Title match (highest priority)
  - Relevance keywords from frontmatter
  - Document priority (critical > high > medium > low)
  - Heading matches
  - Content occurrences
`)
    process.exit(0)
  }

  // Parse arguments
  let query = ''
  let limit = 10

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[i + 1], 10)
      i++
    } else if (!args[i].startsWith('--')) {
      query = args[i]
    }
  }

  if (!query) {
    console.error(`${colors.red}Error: Please provide a search query${colors.reset}`)
    process.exit(1)
  }

  // Execute search
  const results = searchDocuments(query, limit)
  displayResults(results, query)
}

main()
