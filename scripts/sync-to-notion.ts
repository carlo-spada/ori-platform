#!/usr/bin/env tsx

/**
 * Notion Documentation Sync Script
 *
 * Syncs markdown documentation files from /docs to Notion workspace
 *
 * Requirements:
 * - NOTION_API_TOKEN: Integration token from Notion
 * - NOTION_DATABASE_ID: Target database ID to create pages in
 *
 * Usage:
 *   # Sync all docs
 *   tsx scripts/sync-to-notion.ts
 *
 *   # Sync specific file
 *   tsx scripts/sync-to-notion.ts docs/OAUTH_SETUP_GUIDE.md
 *
 *   # Dry run (preview without syncing)
 *   tsx scripts/sync-to-notion.ts --dry-run
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Configuration
const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
const NOTION_API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

interface NotionBlock {
  object: 'block'
  type: string
  [key: string]: any
}

interface SyncResult {
  file: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  pageId?: string
  error?: string
}

/**
 * Convert markdown content to Notion blocks
 */
function markdownToNotionBlocks(markdown: string): NotionBlock[] {
  const blocks: NotionBlock[] = []
  const lines = markdown.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }

    // Headers
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.slice(2) } }],
        },
      })
      i++
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.slice(3) } }],
        },
      })
      i++
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.slice(4) } }],
        },
      })
      i++
      continue
    }

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'plain text'
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }

      const codeContent = codeLines.join('\n')

      // Notion code blocks have 2000 char limit, split if needed
      if (codeContent.length <= 2000) {
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ type: 'text', text: { content: codeContent } }],
            language: language.toLowerCase(),
          },
        })
      } else {
        // Split into multiple code blocks
        const chunks = codeContent.match(/.{1,2000}/g) || []
        chunks.forEach((chunk, index) => {
          blocks.push({
            object: 'block',
            type: 'code',
            code: {
              rich_text: [{ type: 'text', text: { content: chunk } }],
              language: language.toLowerCase(),
              caption: index > 0 ? [{ type: 'text', text: { content: `(continued ${index + 1})` } }] : [],
            },
          })
        })
      }

      i++ // Skip closing ```
      continue
    }

    // Bulleted lists
    if (line.match(/^[*-]\s/)) {
      const content = line.slice(2).trim()
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content } }],
        },
      })
      i++
      continue
    }

    // Numbered lists
    if (line.match(/^\d+\.\s/)) {
      const content = line.replace(/^\d+\.\s/, '').trim()
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content } }],
        },
      })
      i++
      continue
    }

    // Checkboxes
    if (line.match(/^-\s\[\s?\]/)) {
      const content = line.replace(/^-\s\[\s?\]\s/, '').trim()
      const checked = line.includes('[x]') || line.includes('[X]')
      blocks.push({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content } }],
          checked,
        },
      })
      i++
      continue
    }

    // Quotes
    if (line.startsWith('>')) {
      const content = line.slice(1).trim()
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content } }],
        },
      })
      i++
      continue
    }

    // Dividers
    if (line.match(/^---+$/)) {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {},
      })
      i++
      continue
    }

    // Regular paragraph (with 2000 char limit)
    const content = line.trim()
    if (content.length <= 2000) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content } }],
        },
      })
    } else {
      // Split long paragraphs
      const chunks = content.match(/.{1,2000}/g) || []
      chunks.forEach((chunk) => {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: chunk } }],
          },
        })
      })
    }

    i++
  }

  return blocks
}

/**
 * Make a request to Notion API
 */
async function notionRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<any> {
  if (!NOTION_API_TOKEN) {
    throw new Error('NOTION_API_TOKEN environment variable is required')
  }

  const url = `${NOTION_API_BASE}${endpoint}`
  const headers = {
    Authorization: `Bearer ${NOTION_API_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Notion API error: ${response.status} ${errorText}`)
  }

  return response.json()
}

/**
 * Search for existing page by title
 */
async function findPageByTitle(title: string): Promise<string | null> {
  if (!NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID environment variable is required')
  }

  try {
    const response = await notionRequest('/search', 'POST', {
      query: title,
      filter: {
        property: 'object',
        value: 'page',
      },
    })

    const page = response.results.find((p: any) => {
      const titleProp = p.properties?.title?.title || p.properties?.Name?.title
      if (!titleProp || !titleProp[0]) return false
      return titleProp[0].plain_text === title
    })

    return page?.id || null
  } catch (error) {
    console.error('Error searching for page:', error)
    return null
  }
}

/**
 * Create a new page in Notion
 */
async function createNotionPage(
  title: string,
  blocks: NotionBlock[]
): Promise<string> {
  if (!NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID environment variable is required')
  }

  // Notion has a limit on children blocks per request (100)
  // We'll create page with first 100 blocks, then append rest
  const initialBlocks = blocks.slice(0, 100)
  const remainingBlocks = blocks.slice(100)

  const page = await notionRequest('/pages', 'POST', {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: title } }],
      },
    },
    children: initialBlocks,
  })

  // Append remaining blocks if any
  if (remainingBlocks.length > 0) {
    await appendBlocksToPage(page.id, remainingBlocks)
  }

  return page.id
}

/**
 * Append blocks to existing page (in chunks of 100)
 */
async function appendBlocksToPage(
  pageId: string,
  blocks: NotionBlock[]
): Promise<void> {
  const chunks = []
  for (let i = 0; i < blocks.length; i += 100) {
    chunks.push(blocks.slice(i, i + 100))
  }

  for (const chunk of chunks) {
    await notionRequest(`/blocks/${pageId}/children`, 'PATCH', {
      children: chunk,
    })
  }
}

/**
 * Update existing page content
 */
async function updateNotionPage(
  pageId: string,
  blocks: NotionBlock[]
): Promise<void> {
  // First, get all existing child blocks
  const existingBlocks = await notionRequest(`/blocks/${pageId}/children`)

  // Delete all existing blocks
  for (const block of existingBlocks.results) {
    await notionRequest(`/blocks/${block.id}`, 'DELETE')
  }

  // Add new blocks
  await appendBlocksToPage(pageId, blocks)
}

/**
 * Sync a single markdown file to Notion
 */
async function syncFile(
  filePath: string,
  dryRun: boolean = false
): Promise<SyncResult> {
  try {
    // Read file
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.basename(filePath, '.md')
    const title = fileName
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    console.log(`\n📄 Processing: ${filePath}`)
    console.log(`   Title: ${title}`)

    // Convert markdown to Notion blocks
    const blocks = markdownToNotionBlocks(content)
    console.log(`   Blocks: ${blocks.length}`)

    if (dryRun) {
      console.log('   ⏭️  Dry run - skipping sync')
      return { file: filePath, status: 'skipped' }
    }

    // Check if page exists
    const existingPageId = await findPageByTitle(title)

    if (existingPageId) {
      console.log(`   🔄 Updating existing page...`)
      await updateNotionPage(existingPageId, blocks)
      console.log(`   ✅ Updated: ${existingPageId}`)
      return { file: filePath, status: 'updated', pageId: existingPageId }
    } else {
      console.log(`   ➕ Creating new page...`)
      const pageId = await createNotionPage(title, blocks)
      console.log(`   ✅ Created: ${pageId}`)
      return { file: filePath, status: 'created', pageId }
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return { file: filePath, status: 'error', error: error.message }
  }
}

/**
 * Get all markdown files in docs directory
 */
function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = []

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const specificFile = args.find((arg) => !arg.startsWith('--'))

  console.log('🚀 Notion Documentation Sync')
  console.log('=' .repeat(50))

  // Validate configuration
  if (!dryRun) {
    if (!NOTION_API_TOKEN) {
      console.error('❌ Error: NOTION_API_TOKEN environment variable is required')
      console.error('   Get your token from: https://www.notion.so/my-integrations')
      process.exit(1)
    }

    if (!NOTION_DATABASE_ID) {
      console.error('❌ Error: NOTION_DATABASE_ID environment variable is required')
      console.error('   Create a database in Notion and copy its ID from the URL')
      process.exit(1)
    }
  }

  // Get files to sync
  let files: string[]
  if (specificFile) {
    const fullPath = path.resolve(PROJECT_ROOT, specificFile)
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Error: File not found: ${specificFile}`)
      process.exit(1)
    }
    files = [fullPath]
  } else {
    const docsDir = path.join(PROJECT_ROOT, 'docs')
    files = getAllMarkdownFiles(docsDir)
  }

  console.log(`\n📚 Found ${files.length} markdown file(s)`)

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  // Sync files
  const results: SyncResult[] = []
  for (const file of files) {
    const result = await syncFile(file, dryRun)
    results.push(result)
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`   Created: ${results.filter((r) => r.status === 'created').length}`)
  console.log(`   Updated: ${results.filter((r) => r.status === 'updated').length}`)
  console.log(`   Skipped: ${results.filter((r) => r.status === 'skipped').length}`)
  console.log(`   Errors:  ${results.filter((r) => r.status === 'error').length}`)

  if (results.some((r) => r.status === 'error')) {
    console.log('\n❌ Errors occurred:')
    results
      .filter((r) => r.status === 'error')
      .forEach((r) => {
        console.log(`   ${r.file}: ${r.error}`)
      })
    process.exit(1)
  }

  console.log('\n✅ Sync complete!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
