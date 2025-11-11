#!/usr/bin/env node
/**
 * Test Notion Connection
 *
 * Validates that Notion API key and database are properly configured.
 * Run this after creating your Notion database to verify everything works.
 */

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

console.log('\n🔍 Testing Notion Connection...\n')
console.log('='.repeat(70))

// Check environment variables
if (!process.env.NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY is not set')
  console.log('\nSet it with:')
  console.log('export NOTION_API_KEY="your-api-key-here"')
  process.exit(1)
}

if (!process.env.NOTION_DATABASE_ID) {
  console.error('❌ NOTION_DATABASE_ID is not set')
  console.log('\nSet it with:')
  console.log('export NOTION_DATABASE_ID="your-database-id-here"')
  process.exit(1)
}

console.log('✅ Environment variables found')
console.log(`   API Key: ${process.env.NOTION_API_KEY.slice(0, 10)}...`)
console.log(`   Database ID: ${databaseId}`)
console.log()

async function testConnection() {
  try {
    // Test 1: Retrieve database
    console.log('📊 Test 1: Retrieving database...')
    const database = await notion.databases.retrieve({ database_id: databaseId })
    console.log(`   ✅ Database found: "${database.title[0]?.plain_text || 'Untitled'}"`)
    console.log()

    // Test 2: Check properties
    console.log('🔧 Test 2: Checking required properties...')
    const requiredProperties = [
      'Title',
      'Git Path',
      'Category',
      'Last Updated',
      'Status',
      'Responsible Agent',
      'Git Commit Hash',
      'Auto-sync Status',
    ]

    const missingProperties = []
    for (const propName of requiredProperties) {
      if (database.properties[propName]) {
        console.log(`   ✅ ${propName}`)
      } else {
        console.log(`   ❌ ${propName} (missing!)`)
        missingProperties.push(propName)
      }
    }
    console.log()

    if (missingProperties.length > 0) {
      console.error('⚠️  Warning: Missing properties detected')
      console.log('\nPlease add these properties to your database:')
      missingProperties.forEach((prop) => console.log(`   - ${prop}`))
      console.log('\nSee NOTION_SYNC_SETUP_GUIDE.md for property types and options.')
      console.log()
    }

    // Test 3: Try to create a test page
    console.log('📄 Test 3: Creating test page...')
    const testPage = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: { title: [{ text: { content: 'Test Page - Can be deleted' } }] },
        'Git Path': { rich_text: [{ text: { content: 'test/path.md' } }] },
        Category: { select: { name: 'Other' } },
        'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } },
        Status: { select: { name: 'Current' } },
        'Responsible Agent': { select: { name: 'Claude' } },
        'Git Commit Hash': { rich_text: [{ text: { content: 'test123' } }] },
        'Auto-sync Status': { checkbox: true },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'This is a test page created by the Notion sync setup script. You can delete this page.',
                },
              },
            ],
          },
        },
      ],
    })

    console.log(`   ✅ Test page created successfully`)
    console.log(`   Page ID: ${testPage.id}`)
    console.log(`   URL: ${testPage.url}`)
    console.log()

    // Test 4: Query the database
    console.log('🔍 Test 4: Querying database...')
    const queryResponse = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    })

    console.log(`   ✅ Found ${queryResponse.results.length} page(s) in database`)
    if (queryResponse.results.length > 0) {
      console.log('\n   Recent pages:')
      queryResponse.results.slice(0, 3).forEach((page) => {
        const title = page.properties.Title?.title[0]?.plain_text || 'Untitled'
        console.log(`   - ${title}`)
      })
    }
    console.log()

    // Test 5: Update the test page
    console.log('✏️  Test 5: Updating test page...')
    await notion.pages.update({
      page_id: testPage.id,
      properties: {
        Status: { select: { name: 'Needs Review' } },
      },
    })
    console.log('   ✅ Test page updated successfully')
    console.log()

    // Final summary
    console.log('='.repeat(70))
    console.log('✅ ALL TESTS PASSED!')
    console.log('='.repeat(70))
    console.log('\n🎉 Your Notion integration is working correctly!\n')
    console.log('Next steps:')
    console.log('1. Delete the test page in Notion (optional)')
    console.log('2. Run: node scripts/sync-docs-to-notion.js "README.md"')
    console.log('3. Check your Notion database for the synced content')
    console.log('4. Set up GitHub secrets (see NOTION_SYNC_SETUP_GUIDE.md)')
    console.log()
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.log()

    if (error.code === 'object_not_found') {
      console.log('The database ID was not found. Please check:')
      console.log('1. The database ID is correct')
      console.log('2. The Notion integration has access to the database')
      console.log('3. You shared the database with your integration')
    } else if (error.code === 'unauthorized') {
      console.log('Authorization failed. Please check:')
      console.log('1. The API key is correct')
      console.log('2. The integration has the required permissions')
    } else if (error.code === 'validation_error') {
      console.log('Validation error. This usually means:')
      console.log('1. A required property is missing from the database')
      console.log('2. A property type is incorrect')
      console.log('\nCheck the error details above for specific issues.')
    }

    console.log('\nFor more help, see NOTION_SYNC_SETUP_GUIDE.md')
    process.exit(1)
  }
}

testConnection()
