/**
 * Stripe Products and Prices Setup Script
 *
 * This script programmatically creates Stripe Products and Prices for the Ori Platform.
 * It is idempotent - running it multiple times will not create duplicates.
 *
 * Run with: npm run setup:stripe
 */

import dotenv from 'dotenv'
import { stripe, STRIPE_PLANS } from '../lib/stripe.js'

// Load environment variables
dotenv.config()

interface CreatedIds {
  STRIPE_PRODUCT_PLUS_ID: string
  STRIPE_PRODUCT_PREMIUM_ID: string
  STRIPE_PRICE_PLUS_MONTHLY_ID: string
  STRIPE_PRICE_PLUS_YEARLY_ID: string
  STRIPE_PRICE_PREMIUM_MONTHLY_ID: string
  STRIPE_PRICE_PREMIUM_YEARLY_ID: string
}

async function setupStripeProductsAndPrices(): Promise<CreatedIds> {
  console.log('🚀 Setting up Stripe Products and Prices...\n')

  const createdIds: CreatedIds = {
    STRIPE_PRODUCT_PLUS_ID: '',
    STRIPE_PRODUCT_PREMIUM_ID: '',
    STRIPE_PRICE_PLUS_MONTHLY_ID: '',
    STRIPE_PRICE_PLUS_YEARLY_ID: '',
    STRIPE_PRICE_PREMIUM_MONTHLY_ID: '',
    STRIPE_PRICE_PREMIUM_YEARLY_ID: '',
  }

  try {
    // ============================================================================
    // Create or Get Plus Product
    // ============================================================================
    console.log('📦 Creating "Ori Plus" product...')
    const existingPlusProducts = await stripe.products.search({
      query: 'name:"Ori Plus"',
      limit: 1,
    })

    let plusProduct: any
    if (existingPlusProducts.data.length > 0) {
      plusProduct = existingPlusProducts.data[0]
      console.log(`✅ Product "Ori Plus" already exists (${plusProduct.id})`)
    } else {
      plusProduct = await stripe.products.create({
        name: 'Ori Plus',
        description:
          'Advanced features for career growth: Unlimited job matches, AI-powered resume builder, and priority support',
        metadata: {
          plan_tier: 'plus',
        },
      })
      console.log(`✅ Created product "Ori Plus" (${plusProduct.id})`)
    }
    createdIds.STRIPE_PRODUCT_PLUS_ID = plusProduct.id

    // ============================================================================
    // Create or Get Premium Product
    // ============================================================================
    console.log('\n📦 Creating "Ori Premium" product...')
    const existingPremiumProducts = await stripe.products.search({
      query: 'name:"Ori Premium"',
      limit: 1,
    })

    let premiumProduct: any
    if (existingPremiumProducts.data.length > 0) {
      premiumProduct = existingPremiumProducts.data[0]
      console.log(
        `✅ Product "Ori Premium" already exists (${premiumProduct.id})`,
      )
    } else {
      premiumProduct = await stripe.products.create({
        name: 'Ori Premium',
        description:
          'Complete career companion: Everything in Plus, plus personalized coaching, exclusive workshops, and career analytics',
        metadata: {
          plan_tier: 'premium',
        },
      })
      console.log(`✅ Created product "Ori Premium" (${premiumProduct.id})`)
    }
    createdIds.STRIPE_PRODUCT_PREMIUM_ID = premiumProduct.id

    // ============================================================================
    // Create Prices for Plus Product
    // ============================================================================
    console.log('\n💰 Creating prices for "Ori Plus"...')

    // Plus Monthly Price
    const existingPlusMonthly = await stripe.prices.search({
      query: `product:"${plusProduct.id}" AND active:true AND recurring.interval:month`,
      limit: 1,
    })

    if (existingPlusMonthly.data.length > 0) {
      const price = existingPlusMonthly.data[0]
      console.log(
        `✅ Plus Monthly price already exists (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/mo`,
      )
      createdIds.STRIPE_PRICE_PLUS_MONTHLY_ID = price.id
    } else {
      const price = await stripe.prices.create({
        product: plusProduct.id,
        unit_amount: STRIPE_PLANS.plus_monthly.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_key: 'plus_monthly',
        },
      })
      console.log(
        `✅ Created Plus Monthly price (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/mo`,
      )
      createdIds.STRIPE_PRICE_PLUS_MONTHLY_ID = price.id
    }

    // Plus Yearly Price
    const existingPlusYearly = await stripe.prices.search({
      query: `product:"${plusProduct.id}" AND active:true AND recurring.interval:year`,
      limit: 1,
    })

    if (existingPlusYearly.data.length > 0) {
      const price = existingPlusYearly.data[0]
      console.log(
        `✅ Plus Yearly price already exists (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/yr`,
      )
      createdIds.STRIPE_PRICE_PLUS_YEARLY_ID = price.id
    } else {
      const price = await stripe.prices.create({
        product: plusProduct.id,
        unit_amount: STRIPE_PLANS.plus_yearly.price,
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        metadata: {
          plan_key: 'plus_yearly',
        },
      })
      console.log(
        `✅ Created Plus Yearly price (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/yr`,
      )
      createdIds.STRIPE_PRICE_PLUS_YEARLY_ID = price.id
    }

    // ============================================================================
    // Create Prices for Premium Product
    // ============================================================================
    console.log('\n💰 Creating prices for "Ori Premium"...')

    // Premium Monthly Price
    const existingPremiumMonthly = await stripe.prices.search({
      query: `product:"${premiumProduct.id}" AND active:true AND recurring.interval:month`,
      limit: 1,
    })

    if (existingPremiumMonthly.data.length > 0) {
      const price = existingPremiumMonthly.data[0]
      console.log(
        `✅ Premium Monthly price already exists (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/mo`,
      )
      createdIds.STRIPE_PRICE_PREMIUM_MONTHLY_ID = price.id
    } else {
      const price = await stripe.prices.create({
        product: premiumProduct.id,
        unit_amount: STRIPE_PLANS.premium_monthly.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_key: 'premium_monthly',
        },
      })
      console.log(
        `✅ Created Premium Monthly price (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/mo`,
      )
      createdIds.STRIPE_PRICE_PREMIUM_MONTHLY_ID = price.id
    }

    // Premium Yearly Price
    const existingPremiumYearly = await stripe.prices.search({
      query: `product:"${premiumProduct.id}" AND active:true AND recurring.interval:year`,
      limit: 1,
    })

    if (existingPremiumYearly.data.length > 0) {
      const price = existingPremiumYearly.data[0]
      console.log(
        `✅ Premium Yearly price already exists (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/yr`,
      )
      createdIds.STRIPE_PRICE_PREMIUM_YEARLY_ID = price.id
    } else {
      const price = await stripe.prices.create({
        product: premiumProduct.id,
        unit_amount: STRIPE_PLANS.premium_yearly.price,
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        metadata: {
          plan_key: 'premium_yearly',
        },
      })
      console.log(
        `✅ Created Premium Yearly price (${price.id}) - $${(price.unit_amount! / 100).toFixed(2)}/yr`,
      )
      createdIds.STRIPE_PRICE_PREMIUM_YEARLY_ID = price.id
    }

    console.log('\n✅ Stripe setup complete!\n')
    console.log('📝 Add these to your .env file:\n')
    console.log(`STRIPE_PRODUCT_PLUS_ID=${createdIds.STRIPE_PRODUCT_PLUS_ID}`)
    console.log(
      `STRIPE_PRODUCT_PREMIUM_ID=${createdIds.STRIPE_PRODUCT_PREMIUM_ID}`,
    )
    console.log(
      `STRIPE_PRICE_PLUS_MONTHLY_ID=${createdIds.STRIPE_PRICE_PLUS_MONTHLY_ID}`,
    )
    console.log(
      `STRIPE_PRICE_PLUS_YEARLY_ID=${createdIds.STRIPE_PRICE_PLUS_YEARLY_ID}`,
    )
    console.log(
      `STRIPE_PRICE_PREMIUM_MONTHLY_ID=${createdIds.STRIPE_PRICE_PREMIUM_MONTHLY_ID}`,
    )
    console.log(
      `STRIPE_PRICE_PREMIUM_YEARLY_ID=${createdIds.STRIPE_PRICE_PREMIUM_YEARLY_ID}`,
    )

    return createdIds
  } catch (error) {
    console.error('❌ Error setting up Stripe:', error)
    throw error
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupStripeProductsAndPrices()
    .then(() => {
      console.log('\n🎉 Stripe setup completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Stripe setup failed:', error)
      process.exit(1)
    })
}

export { setupStripeProductsAndPrices }
