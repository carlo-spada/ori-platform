#!/usr/bin/env node
/**
 * Automated Notion Database Setup
 *
 * Creates the "Ori Platform Documentation" database with all required properties.
 * This script automates steps 1-2 of the manual setup process.
 */

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })

if (!process.env.NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY environment variable is not set')
  console.log('\nUsage:')
  console.log('export NOTION_API_KEY="your-api-key-here"')
  console.log('node scripts/setup-notion-database.js')
  process.exit(1)
}

console.log('\n🚀 Setting up Notion Database for Ori Platform Documentation...\n')
console.log('='.repeat(70))

async function setupDatabase() {
  try {
    // Step 1: Create the database
    console.log('\n📊 Step 1: Creating "Documentation Hub" database...')

    const database = await notion.databases.create({
      parent: process.env.NOTION_PARENT_PAGE_ID
        ? {
            type: 'page_id',
            page_id: process.env.NOTION_PARENT_PAGE_ID,
          }
        : {
            type: 'workspace',
            workspace: true,
          },
      title: [
        {
          type: 'text',
          text: {
            content: 'Documentation Hub',
          },
        },
      ],
      properties: {
        // Title property (required, auto-created)
        Title: {
          title: {},
        },

        // Git Path - where the file lives in the repo
        'Git Path': {
          rich_text: {},
        },

        // Category - type of documentation
        Category: {
          select: {
            options: [
              { name: 'Core', color: 'blue' },
              { name: 'Operations', color: 'green' },
              { name: 'Reference', color: 'yellow' },
              { name: 'Agent Guide', color: 'purple' },
              { name: 'Task Management', color: 'pink' },
              { name: 'Branding', color: 'orange' },
              { name: 'Other', color: 'gray' },
            ],
          },
        },

        // Last Updated - date from git commit
        'Last Updated': {
          date: {},
        },

        // Status - freshness indicator
        Status: {
          select: {
            options: [
              { name: 'Current', color: 'green' },
              { name: 'Needs Review', color: 'yellow' },
              { name: 'Stale', color: 'red' },
            ],
          },
        },

        // Responsible Agent - who maintains this doc
        'Responsible Agent': {
          select: {
            options: [
              { name: 'Claude', color: 'blue' },
              { name: 'Gemini', color: 'purple' },
              { name: 'Carlo', color: 'orange' },
              { name: 'All Agents', color: 'gray' },
            ],
          },
        },

        // Git Commit Hash - track which commit last touched this
        'Git Commit Hash': {
          rich_text: {},
        },

        // Auto-sync Status - is this doc being auto-synced?
        'Auto-sync Status': {
          checkbox: {},
        },
      },
    })

    console.log('   ✅ Database created successfully!')
    console.log(`   Database ID: ${database.id}`)
    console.log(`   URL: ${database.url}`)
    console.log()

    // Step 2: Verify properties
    console.log('🔧 Step 2: Verifying properties...')
    const propertyNames = Object.keys(database.properties)
    propertyNames.forEach((name) => {
      console.log(`   ✅ ${name}`)
    })
    console.log()

    // Step 3: Create welcome page
    console.log('📄 Step 3: Creating welcome page...')
    const welcomePage = await notion.pages.create({
      parent: { database_id: database.id },
      properties: {
        Title: { title: [{ text: { content: '🏠 Welcome to Documentation Hub' } }] },
        'Git Path': { rich_text: [{ text: { content: 'N/A' } }] },
        Category: { select: { name: 'Other' } },
        'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } },
        Status: { select: { name: 'Current' } },
        'Responsible Agent': { select: { name: 'Carlo' } },
        'Git Commit Hash': { rich_text: [{ text: { content: 'manual' } }] },
        'Auto-sync Status': { checkbox: false },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [
              { type: 'text', text: { content: 'Ori Platform Documentation Hub' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'This database automatically syncs all documentation from the Git repository. Every time you commit a markdown file, it appears here within 60 seconds.',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'How It Works' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Git Push → GitHub Actions → Notion Sync (automatic)' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Daily staleness checks at 9 AM UTC (creates GitHub issue if docs > 30 days old)',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Status: Current (0-14d), Needs Review (14-30d), Stale (30d+)' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Useful Views' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Create these views to make navigation easier:\n• "Stale Docs" - Filter: Status = Stale\n• "By Category" - Board grouped by Category\n• "By Agent" - Board grouped by Responsible Agent',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Next Steps' } }],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Copy the Database ID (see setup script output above)',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Add to GitHub Secrets as NOTION_DATABASE_ID' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'Run: node scripts/test-notion-connection.js' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Sync first docs: node scripts/sync-docs-to-notion.js "README.md"' },
              },
            ],
          },
        },
      ],
    })

    console.log('   ✅ Welcome page created')
    console.log()

    // Final instructions
    console.log('='.repeat(70))
    console.log('✅ SETUP COMPLETE!')
    console.log('='.repeat(70))
    console.log('\n📋 IMPORTANT: Save this information!\n')
    console.log(`Database ID: ${database.id}`)
    console.log(`Database URL: ${database.url}`)
    console.log()
    console.log('🔑 Next Steps:\n')
    console.log('1. Copy the Database ID above')
    console.log(
      '2. Add to GitHub Secrets: https://github.com/carlo-spada/ori-platform/settings/secrets/actions'
    )
    console.log('   Name: NOTION_DATABASE_ID')
    console.log(`   Value: ${database.id}`)
    console.log()
    console.log('3. Test the connection:')
    console.log(`   export NOTION_DATABASE_ID="${database.id}"`)
    console.log('   node scripts/test-notion-connection.js')
    console.log()
    console.log('4. Sync your first doc:')
    console.log('   node scripts/sync-docs-to-notion.js "README.md"')
    console.log()
    console.log('5. Check your Notion database for the synced content!')
    console.log()
    console.log('📚 Full guide: NOTION_SYNC_SETUP_GUIDE.md')
    console.log()

    return database
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.log()

    if (error.code === 'unauthorized') {
      console.log('The API key is invalid or lacks permissions.')
      console.log('Please check:')
      console.log('1. The API key is correct')
      console.log('2. The integration has the required permissions')
      console.log('3. You created the integration in your Notion workspace')
    } else if (error.code === 'object_not_found') {
      console.log('Parent page not found.')
      console.log('Please check:')
      console.log('1. NOTION_PARENT_PAGE_ID is correct (if provided)')
      console.log('2. The integration has access to the parent page')
      console.log('\nTip: Remove NOTION_PARENT_PAGE_ID to create in workspace root')
    } else {
      console.log('Unexpected error. Full details:')
      console.log(error)
    }

    process.exit(1)
  }
}

setupDatabase()
