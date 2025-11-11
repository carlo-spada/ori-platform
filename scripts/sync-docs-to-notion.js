#!/usr/bin/env node
/**
 * Sync Documentation from Git to Notion
 *
 * Syncs markdown files to a Notion database, creating or updating pages as needed.
 * Tracks staleness and maintains git commit history.
 */

const { Client } = require('@notionhq/client')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { execSync } = require('child_process')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   NOTION_API_KEY and NOTION_DATABASE_ID must be set')
  process.exit(1)
}

// Category mapping based on file path
function getCategory(filePath) {
  if (filePath.includes('docs/CORE')) return 'Core'
  if (filePath.includes('docs/OPERATIONS')) return 'Operations'
  if (filePath.includes('docs/REFERENCE')) return 'Reference'
  if (['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'].includes(path.basename(filePath))) {
    return 'Agent Guide'
  }
  if (filePath.includes('.tasks/')) return 'Task Management'
  if (filePath.includes('branding/')) return 'Branding'
  return 'Other'
}

// Determine responsible agent based on document
function getResponsibleAgent(filePath) {
  const basename = path.basename(filePath)
  if (basename === 'CLAUDE.md') return 'Claude'
  if (basename === 'GEMINI.md') return 'Gemini'
  if (basename === 'AGENTS.md') return 'All Agents'
  if (filePath.includes('docs/CORE') || filePath.includes('docs/OPERATIONS')) return 'Claude'
  if (filePath.includes('.tasks/')) return 'Gemini'
  return 'Carlo'
}

// Get last commit info for a file
function getLastCommit(filePath) {
  try {
    const hash = execSync(`git log -1 --format=%H -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()
    const date = execSync(`git log -1 --format=%ai -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()
    const author = execSync(`git log -1 --format="%an" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()
    return { hash, date: date.split(' ')[0], author }
  } catch (error) {
    return { hash: 'unknown', date: new Date().toISOString().split('T')[0], author: 'Unknown' }
  }
}

// Convert markdown to Notion blocks (simplified version)
function markdownToNotionBlocks(markdown, maxBlocks = 95) {
  const blocks = []
  const lines = markdown.split('\n')
  let inCodeBlock = false
  let codeContent = []
  let codeLanguage = 'plain text'

  for (let i = 0; i < lines.length && blocks.length < maxBlocks; i++) {
    const line = lines[i]

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLanguage = line.slice(3).trim() || 'plain text'
        codeContent = []
      } else {
        // End of code block
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [
              {
                type: 'text',
                text: { content: codeContent.join('\n').slice(0, 2000) }, // Notion limit
              },
            ],
            language: codeLanguage,
          },
        })
        inCodeBlock = false
        codeContent = []
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.slice(2).slice(0, 2000) } }],
        },
      })
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.slice(3).slice(0, 2000) } }],
        },
      })
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.slice(4).slice(0, 2000) } }],
        },
      })
    }
    // Bullet lists
    else if (line.match(/^[\-\*\+]\s/)) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.slice(2).slice(0, 2000) } }],
        },
      })
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s/)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { type: 'text', text: { content: line.replace(/^\d+\.\s/, '').slice(0, 2000) } },
          ],
        },
      })
    }
    // Regular paragraphs (skip empty lines)
    else if (line.trim()) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line.slice(0, 2000) } }],
        },
      })
    }
  }

  return blocks
}

// Find existing page in Notion database by git path
async function findPageByGitPath(gitPath) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Git Path',
        rich_text: { equals: gitPath },
      },
    })
    return response.results[0]
  } catch (error) {
    console.error(`Error finding page for ${gitPath}:`, error.message)
    return null
  }
}

// Create or update Notion page
async function syncFileToNotion(filePath) {
  console.log(`\n📄 Processing: ${filePath}`)

  // Read file content
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found, skipping`)
    return
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content: markdown } = matter(content)

  const category = getCategory(filePath)
  const responsibleAgent = getResponsibleAgent(filePath)
  const { hash, date, author } = getLastCommit(filePath)
  const title = frontmatter.title || path.basename(filePath, '.md')

  // Calculate staleness
  const lastUpdate = new Date(date)
  const now = new Date()
  const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
  const status = daysSinceUpdate > 30 ? 'Stale' : daysSinceUpdate > 14 ? 'Needs Review' : 'Current'

  console.log(`  📊 Status: ${status} (${daysSinceUpdate} days old)`)
  console.log(`  📁 Category: ${category}`)
  console.log(`  👤 Responsible: ${responsibleAgent}`)

  const properties = {
    Title: { title: [{ text: { content: title } }] },
    'Git Path': { rich_text: [{ text: { content: filePath } }] },
    Category: { select: { name: category } },
    'Last Updated': { date: { start: date } },
    Status: { select: { name: status } },
    'Responsible Agent': { select: { name: responsibleAgent } },
    'Git Commit Hash': { rich_text: [{ text: { content: hash.slice(0, 7) } }] },
    'Auto-sync Status': { checkbox: true },
  }

  // Check if page exists
  const existingPage = await findPageByGitPath(filePath)

  if (existingPage) {
    try {
      // Update existing page properties
      await notion.pages.update({
        page_id: existingPage.id,
        properties,
      })

      // Delete old blocks (we'll replace with new content)
      const { results: existingBlocks } = await notion.blocks.children.list({
        block_id: existingPage.id,
      })

      for (const block of existingBlocks) {
        try {
          await notion.blocks.delete({ block_id: block.id })
        } catch (err) {
          // Some blocks can't be deleted, skip them
        }
      }

      // Add new content
      const blocks = markdownToNotionBlocks(markdown)
      if (blocks.length > 0) {
        await notion.blocks.children.append({
          block_id: existingPage.id,
          children: blocks,
        })
      }

      console.log(`  ✅ Updated in Notion`)
    } catch (error) {
      console.error(`  ❌ Failed to update: ${error.message}`)
    }
  } else {
    try {
      // Create new page
      const blocks = markdownToNotionBlocks(markdown)
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
        children: blocks,
      })

      console.log(`  ✅ Created in Notion`)
    } catch (error) {
      console.error(`  ❌ Failed to create: ${error.message}`)
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Notion Documentation Sync...\n')

  const changedFiles = process.argv[2]?.split(' ') || []

  if (changedFiles.length === 0) {
    console.log('ℹ️  No markdown files changed.')
    return
  }

  console.log(`📝 Found ${changedFiles.length} changed file(s):\n`)
  changedFiles.forEach((file) => console.log(`   - ${file}`))

  for (const file of changedFiles) {
    if (file.endsWith('.md')) {
      try {
        await syncFileToNotion(file)
      } catch (error) {
        console.error(`\n❌ Failed to sync ${file}:`, error.message)
      }
    }
  }

  console.log('\n✅ Notion sync complete!')
}

main().catch((error) => {
  console.error('\n❌ Sync failed:', error.message)
  process.exit(1)
})
