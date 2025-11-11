#!/usr/bin/env tsx

/**
 * Auto-update DOC_INDEX.md status section from git log and .tasks/
 *
 * Updates:
 * - Last Updated date
 * - Active Work (from .tasks/in-progress/)
 * - Recent Wins (from recent git commits)
 *
 * Usage: pnpm update-doc-index
 */

import { execSync } from 'child_process'
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'

const ROOT_DIR = join(__dirname, '..')
const DOC_INDEX_PATH = join(ROOT_DIR, 'DOC_INDEX.md')
const TASKS_IN_PROGRESS_DIR = join(ROOT_DIR, '.tasks/in-progress')

interface Commit {
  hash: string
  message: string
  type: string // feat, fix, docs, chore, etc.
  description: string
}

interface Task {
  filename: string
  title: string
  path: string
}

/**
 * Parse git log for recent commits
 */
function getRecentCommits(limit: number = 20): Commit[] {
  try {
    const output = execSync(`git log --oneline -${limit}`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    })

    return output
      .trim()
      .split('\n')
      .map((line) => {
        const match = line.match(/^([a-f0-9]+)\s+(.+)$/)
        if (!match) return null

        const [, hash, message] = match
        const typeMatch = message.match(/^(\w+)(?:\([^)]*\))?:\s*(.+)$/)

        if (typeMatch) {
          return {
            hash,
            message,
            type: typeMatch[1],
            description: typeMatch[2],
          }
        }

        return {
          hash,
          message,
          type: 'other',
          description: message,
        }
      })
      .filter((commit): commit is Commit => commit !== null)
  } catch (error) {
    console.error('Failed to get git log:', error)
    return []
  }
}

/**
 * Get tasks from .tasks/in-progress/
 */
function getInProgressTasks(): Task[] {
  try {
    const files = readdirSync(TASKS_IN_PROGRESS_DIR)

    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const filePath = join(TASKS_IN_PROGRESS_DIR, file)
        const content = readFileSync(filePath, 'utf-8')

        // Extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '')

        return {
          filename: file,
          title,
          path: `.tasks/in-progress/${file}`,
        }
      })
      .sort((a, b) => a.filename.localeCompare(b.filename)) // Numeric sort by filename
  } catch (error) {
    console.error('Failed to read in-progress tasks:', error)
    return []
  }
}

/**
 * Extract recent wins from commits (feat, docs, fix types, last 5)
 */
function getRecentWins(commits: Commit[], limit: number = 5): string[] {
  const relevantTypes = ['feat', 'docs', 'fix']

  return commits
    .filter((commit) => relevantTypes.includes(commit.type))
    .slice(0, limit)
    .map((commit) => {
      // Clean up description
      let desc = commit.description
      // Capitalize first letter
      desc = desc.charAt(0).toUpperCase() + desc.slice(1)
      return `- ✅ ${desc}`
    })
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Update DOC_INDEX.md with new status information
 */
function updateDocIndex(): void {
  console.log('📊 Gathering information...')

  // Gather data
  const currentDate = getCurrentDate()
  const commits = getRecentCommits(20)
  const tasks = getInProgressTasks()
  const recentWins = getRecentWins(commits, 5)

  console.log(`  ✓ Found ${commits.length} recent commits`)
  console.log(`  ✓ Found ${tasks.length} in-progress tasks`)
  console.log(`  ✓ Extracted ${recentWins.length} recent wins`)

  // Read current DOC_INDEX.md
  let content = readFileSync(DOC_INDEX_PATH, 'utf-8')

  // Update Last Updated in frontmatter
  content = content.replace(
    /^last-updated: \d{4}-\d{2}-\d{2}$/m,
    `last-updated: ${currentDate}`,
  )

  // Update Last Updated in header
  content = content.replace(
    /^\*\*Last Updated\*\*: \d{4}-\d{2}-\d{2}$/m,
    `**Last Updated**: ${currentDate}`,
  )

  // Build Active Work section
  const activeWorkSection = tasks
    .map((task, index) => {
      return `${index + 1}. **${task.title}** - \`${task.path}\``
    })
    .join('\n')

  // Replace Active Work section
  content = content.replace(
    /### 🚧 Active Work \(In Progress\)\n([\s\S]*?)(?=\n### )/,
    `### 🚧 Active Work (In Progress)\n${activeWorkSection || '_(No active tasks)_'}\n\n`,
  )

  // Build Recent Wins section
  const recentWinsSection = recentWins.join('\n')

  // Replace Recent Wins section
  content = content.replace(
    /### 🎉 Recent Wins \(Last 5\)\n([\s\S]*?)(?=\n### )/,
    `### 🎉 Recent Wins (Last 5)\n${recentWinsSection}\n\n`,
  )

  // Write updated content
  writeFileSync(DOC_INDEX_PATH, content, 'utf-8')

  console.log('\n✅ DOC_INDEX.md updated successfully!')
  console.log(`\n📝 Summary:`)
  console.log(`   - Date updated: ${currentDate}`)
  console.log(`   - Active tasks: ${tasks.length}`)
  console.log(`   - Recent wins: ${recentWins.length}`)
  console.log('')
  console.log('🔍 Changes:')
  console.log('')
  console.log('Active Work:')
  tasks.forEach((task, i) => {
    console.log(`  ${i + 1}. ${task.title}`)
  })
  console.log('')
  console.log('Recent Wins:')
  recentWins.forEach((win) => {
    console.log(`  ${win}`)
  })
}

// Run the update
try {
  updateDocIndex()
} catch (error) {
  console.error('❌ Failed to update DOC_INDEX.md:', error)
  process.exit(1)
}
