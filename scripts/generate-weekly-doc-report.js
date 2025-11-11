#!/usr/bin/env node
/**
 * Generate Weekly Documentation Health Report
 *
 * Creates comprehensive report on documentation health with category breakdown.
 */

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   NOTION_API_KEY and NOTION_DATABASE_ID must be set')
  process.exit(1)
}

async function generateWeeklyReport() {
  console.log('\n' + '='.repeat(70))
  console.log('📊 WEEKLY DOCUMENTATION HEALTH REPORT')
  console.log('='.repeat(70))
  console.log(`Generated: ${new Date().toISOString().split('T')[0]}\n`)

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    })

    const stats = {
      total: response.results.length,
      current: 0,
      needsReview: 0,
      stale: 0,
      byCategory: {},
      byAgent: {},
      recentlyUpdated: [],
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    for (const page of response.results) {
      const status = page.properties.Status?.select?.name
      const category = page.properties.Category?.select?.name
      const agent = page.properties['Responsible Agent']?.select?.name
      const lastUpdated = page.properties['Last Updated']?.date?.start
      const title = page.properties.Title?.title[0]?.plain_text

      // Count by status
      if (status === 'Current') stats.current++
      if (status === 'Needs Review') stats.needsReview++
      if (status === 'Stale') stats.stale++

      // Count by category
      if (category) {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
      }

      // Count by agent
      if (agent) {
        stats.byAgent[agent] = (stats.byAgent[agent] || 0) + 1
      }

      // Track recently updated
      if (lastUpdated && new Date(lastUpdated) >= sevenDaysAgo) {
        stats.recentlyUpdated.push({
          title,
          date: lastUpdated,
          category,
        })
      }
    }

    const healthScore = Math.round((stats.current / stats.total) * 100)

    // Print overview
    console.log('📈 OVERVIEW')
    console.log('-'.repeat(70))
    console.log(`Total Documents: ${stats.total}`)
    console.log(`✅ Current: ${stats.current} (${Math.round((stats.current / stats.total) * 100)}%)`)
    console.log(
      `⚠️  Needs Review: ${stats.needsReview} (${Math.round((stats.needsReview / stats.total) * 100)}%)`
    )
    console.log(`❌ Stale: ${stats.stale} (${Math.round((stats.stale / stats.total) * 100)}%)`)
    console.log(`\n🎯 Overall Health Score: ${healthScore}%`)

    // Print by category
    console.log('\n📁 BY CATEGORY')
    console.log('-'.repeat(70))
    Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        const percent = Math.round((count / stats.total) * 100)
        console.log(`  ${cat.padEnd(20)} ${count.toString().padStart(3)} docs (${percent}%)`)
      })

    // Print by agent
    console.log('\n👥 BY RESPONSIBLE AGENT')
    console.log('-'.repeat(70))
    Object.entries(stats.byAgent)
      .sort((a, b) => b[1] - a[1])
      .forEach(([agent, count]) => {
        const percent = Math.round((count / stats.total) * 100)
        console.log(`  ${agent.padEnd(20)} ${count.toString().padStart(3)} docs (${percent}%)`)
      })

    // Print recently updated
    if (stats.recentlyUpdated.length > 0) {
      console.log('\n🔄 RECENTLY UPDATED (Last 7 Days)')
      console.log('-'.repeat(70))
      stats.recentlyUpdated
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((doc) => {
          console.log(`  📄 ${doc.title}`)
          console.log(`     Updated: ${doc.date} | Category: ${doc.category || 'N/A'}`)
        })
    } else {
      console.log('\n⚠️  No documents updated in the last 7 days')
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('-'.repeat(70))

    if (healthScore < 70) {
      console.log('  ❗ URGENT: Health score below 70%. Review and update stale docs immediately.')
    } else if (healthScore < 85) {
      console.log('  ⚠️  Health score below 85%. Address stale documentation this week.')
    } else {
      console.log('  ✅ Health score looks good! Keep up the regular maintenance.')
    }

    if (stats.stale > 0) {
      console.log(`  • Review ${stats.stale} stale document(s) marked as 30+ days old`)
    }

    if (stats.needsReview > 0) {
      console.log(`  • Check ${stats.needsReview} document(s) approaching staleness (14-30 days)`)
    }

    if (stats.recentlyUpdated.length === 0) {
      console.log('  • No recent updates detected - schedule documentation review')
    }

    console.log('\n' + '='.repeat(70))
    console.log('End of Report')
    console.log('='.repeat(70) + '\n')

    return { stats, healthScore }
  } catch (error) {
    console.error('\n❌ Failed to generate report:', error.message)
    throw error
  }
}

generateWeeklyReport().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
