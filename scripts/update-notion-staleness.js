#!/usr/bin/env node
/**
 * Update Notion Documentation Staleness
 *
 * Checks all docs in Notion database and updates their staleness status.
 * Outputs report of stale documentation.
 */

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   NOTION_API_KEY and NOTION_DATABASE_ID must be set')
  process.exit(1)
}

async function updateStaleness() {
  console.log('📊 Checking documentation staleness...\n')

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    })

    const now = new Date()
    const stalePages = []
    const needsReviewPages = []
    let currentPages = 0

    for (const page of response.results) {
      const lastUpdated = page.properties['Last Updated']?.date?.start
      if (!lastUpdated) continue

      const title = page.properties.Title?.title[0]?.plain_text || 'Untitled'
      const gitPath = page.properties['Git Path']?.rich_text[0]?.plain_text || 'Unknown'
      const currentStatus = page.properties.Status?.select?.name

      const lastUpdateDate = new Date(lastUpdated)
      const daysSinceUpdate = Math.floor((now - lastUpdateDate) / (1000 * 60 * 60 * 24))

      // Determine new status based on staleness
      let newStatus = 'Current'
      if (daysSinceUpdate > 30) {
        newStatus = 'Stale'
        stalePages.push({ title, gitPath, daysSinceUpdate })
      } else if (daysSinceUpdate > 14) {
        newStatus = 'Needs Review'
        needsReviewPages.push({ title, gitPath, daysSinceUpdate })
      } else {
        currentPages++
      }

      // Update if status changed
      if (currentStatus !== newStatus) {
        try {
          await notion.pages.update({
            page_id: page.id,
            properties: {
              Status: { select: { name: newStatus } },
            },
          })
          console.log(`  🔄 Updated ${title}: ${currentStatus || 'N/A'} → ${newStatus}`)
        } catch (error) {
          console.error(`  ⚠️  Failed to update ${title}: ${error.message}`)
        }
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(70))
    console.log('📈 DOCUMENTATION HEALTH SUMMARY')
    console.log('='.repeat(70))
    console.log(`\nTotal Documents: ${response.results.length}`)
    console.log(`✅ Current: ${currentPages} (${Math.round((currentPages / response.results.length) * 100)}%)`)
    console.log(
      `⚠️  Needs Review (14-30 days): ${needsReviewPages.length} (${Math.round((needsReviewPages.length / response.results.length) * 100)}%)`
    )
    console.log(
      `❌ Stale (30+ days): ${stalePages.length} (${Math.round((stalePages.length / response.results.length) * 100)}%)`
    )

    const healthScore = Math.round((currentPages / response.results.length) * 100)
    console.log(`\n📊 Health Score: ${healthScore}%`)

    // Log stale docs
    if (stalePages.length > 0) {
      console.log('\n' + '='.repeat(70))
      console.log('⚠️  STALE DOCUMENTATION DETECTED')
      console.log('='.repeat(70))
      console.log('\nThe following documents have not been updated in 30+ days:\n')
      stalePages
        .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
        .forEach((doc) => {
          console.log(`  ❌ ${doc.title}`)
          console.log(`     Path: ${doc.gitPath}`)
          console.log(`     Age: ${doc.daysSinceUpdate} days\n`)
        })
    }

    // Log needs review
    if (needsReviewPages.length > 0) {
      console.log('\n' + '='.repeat(70))
      console.log('⚠️  DOCUMENTATION NEEDS REVIEW')
      console.log('='.repeat(70))
      console.log('\nThe following documents are 14-30 days old:\n')
      needsReviewPages
        .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
        .forEach((doc) => {
          console.log(`  ⚠️  ${doc.title}`)
          console.log(`     Path: ${doc.gitPath}`)
          console.log(`     Age: ${doc.daysSinceUpdate} days\n`)
        })
    }

    if (stalePages.length === 0 && needsReviewPages.length === 0) {
      console.log('\n✅ All documentation is current! Great job! 🎉')
    }

    return { stalePages, needsReviewPages, healthScore }
  } catch (error) {
    console.error('\n❌ Failed to check staleness:', error.message)
    throw error
  }
}

updateStaleness().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
