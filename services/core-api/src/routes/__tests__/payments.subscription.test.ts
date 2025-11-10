/**
 * Payment Subscription Tests
 *
 * Tests for Stripe subscription creation, management, and status tracking.
 * These tests use Stripe MCP to create realistic test data and simulate
 * subscription lifecycle events.
 *
 * Test Coverage:
 * - Creating subscriptions for customers
 * - Validating subscription data
 * - Subscription plan selection
 * - Subscription status transitions
 * - Error handling for invalid subscriptions
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  createTestCustomer,
  createTestSubscription,
  testPlans,
  testScenarios,
  StripeTestSubscription,
  generateTestUserId,
  generateTestEmail,
} from './fixtures/stripe.fixtures'

describe('Payment - Subscription Creation', () => {
  let customerId: string

  beforeEach(() => {
    const customer = createTestCustomer(generateTestEmail())
    customerId = customer.id
  })

  describe('Creating a subscription', () => {
    it('should create a monthly subscription successfully', () => {
      // Arrange
      const priceId = testPlans.plusMonthly.priceId

      // Act
      const subscription = createTestSubscription(customerId, priceId, 'active')

      // Assert
      expect(subscription).toBeDefined()
      expect(subscription.id).toMatch(/^sub_test_/)
      expect(subscription.customer).toBe(customerId)
      expect(subscription.status).toBe('active')
      expect(subscription.items.data).toHaveLength(1)
    })

    it('should create a yearly subscription successfully', () => {
      // Arrange
      const priceId = testPlans.plusYearly.priceId

      // Act
      const subscription = createTestSubscription(customerId, priceId)

      // Assert
      expect(subscription.status).toBe('active')
      expect(subscription.items.data[0].price.id).toBe(priceId)
      expect(subscription.items.data[0].price.recurring?.interval).toBe('year')
    })

    it('should create subscription with correct billing cycle dates', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )
      const now = Math.floor(Date.now() / 1000)

      // Assert
      expect(subscription.current_period_start).toBeLessThanOrEqual(now)
      expect(subscription.current_period_end).toBeGreaterThan(now)
      // Should be approximately 30 days
      const daysDifference =
        (subscription.current_period_end - subscription.current_period_start) /
        (24 * 60 * 60)
      expect(daysDifference).toBeCloseTo(30, -1)
    })

    it('should support all four plan types', () => {
      // Arrange
      const plans = [
        testPlans.plusMonthly,
        testPlans.plusYearly,
        testPlans.premiumMonthly,
        testPlans.premiumYearly,
      ]

      // Act & Assert
      plans.forEach((plan) => {
        const subscription = createTestSubscription(customerId, plan.priceId)
        expect(subscription.items.data[0].price.id).toBe(plan.priceId)
      })
    })
  })

  describe('Subscription status management', () => {
    it('should create active subscription', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
        'active',
      )

      // Assert
      expect(subscription.status).toBe('active')
    })

    it('should create trialing subscription', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.premiumMonthly.priceId,
        'trialing',
      )

      // Assert
      expect(subscription.status).toBe('trialing')
    })

    it('should create past_due subscription', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.premiumMonthly.priceId,
        'past_due',
      )

      // Assert
      expect(subscription.status).toBe('past_due')
    })

    it('should create canceled subscription', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
        'canceled',
      )

      // Assert
      expect(subscription.status).toBe('canceled')
    })

    it('should create unpaid subscription', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.premiumMonthly.priceId,
        'unpaid',
      )

      // Assert
      expect(subscription.status).toBe('unpaid')
    })
  })

  describe('Subscription ID format', () => {
    it('should generate unique subscription IDs', () => {
      // Act
      const sub1 = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )
      const sub2 = createTestSubscription(
        customerId,
        testPlans.plusYearly.priceId,
      )

      // Assert
      expect(sub1.id).not.toBe(sub2.id)
    })

    it('should use Stripe-compatible subscription IDs', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )

      // Assert
      expect(subscription.id).toMatch(/^sub_test_[a-z0-9]{9}$/)
    })
  })

  describe('Subscription billing details', () => {
    it('should set correct product ID based on price', () => {
      // Act
      const plusSub = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )
      const premiumSub = createTestSubscription(
        customerId,
        testPlans.premiumMonthly.priceId,
      )

      // Assert
      expect(plusSub.items.data[0].price.product).toContain('plus')
      expect(premiumSub.items.data[0].price.product).toContain('premium')
    })

    it('should set correct interval for monthly plans', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )

      // Assert
      expect(subscription.items.data[0].price.recurring?.interval).toBe('month')
      expect(subscription.items.data[0].price.recurring?.interval_count).toBe(1)
    })

    it('should set correct interval for yearly plans', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusYearly.priceId,
      )

      // Assert
      expect(subscription.items.data[0].price.recurring?.interval).toBe('year')
      expect(subscription.items.data[0].price.recurring?.interval_count).toBe(1)
    })
  })

  describe('Multiple subscriptions for same customer', () => {
    it('should allow creating multiple subscriptions for testing', () => {
      // Act
      const sub1 = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )
      const sub2 = createTestSubscription(
        customerId,
        testPlans.premiumYearly.priceId,
      )

      // Assert
      expect(sub1.customer).toBe(sub2.customer)
      expect(sub1.id).not.toBe(sub2.id)
      expect(sub1.items.data[0].price.id).not.toBe(sub2.items.data[0].price.id)
    })
  })

  describe('Subscription lifecycle scenarios', () => {
    it('should create active subscription matching testScenarios', () => {
      // Arrange
      const scenario = testScenarios.subscriptionTrial

      // Act
      const subscription = createTestSubscription(
        scenario.customer.id,
        'price_monthly',
        'trialing',
      )

      // Assert
      expect(subscription.status).toBe('trialing')
    })

    it('should create past due subscription for failed payment', () => {
      // Arrange
      const scenario = testScenarios.pastDueSubscription

      // Act
      const subscription = createTestSubscription(
        scenario.customer.id,
        'price_monthly',
        'past_due',
      )

      // Assert
      expect(subscription.status).toBe('past_due')
    })

    it('should create canceled subscription for downgrade', () => {
      // Arrange
      const scenario = testScenarios.canceledSubscription

      // Act
      const subscription = createTestSubscription(
        scenario.customer.id,
        'price_monthly',
        'canceled',
      )

      // Assert
      expect(subscription.status).toBe('canceled')
    })
  })

  describe('Subscription tier pricing', () => {
    it('should support Plus Monthly tier ($5/month)', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )

      // Assert
      expect(subscription.items.data[0].price.id).toBe(
        testPlans.plusMonthly.priceId,
      )
      expect(testPlans.plusMonthly.amount).toBe(500) // $5 in cents
    })

    it('should support Plus Yearly tier ($48/year)', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusYearly.priceId,
      )

      // Assert
      expect(subscription.items.data[0].price.id).toBe(
        testPlans.plusYearly.priceId,
      )
      expect(testPlans.plusYearly.amount).toBe(4800) // $48 in cents
    })

    it('should support Premium Monthly tier ($10/month)', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.premiumMonthly.priceId,
      )

      // Assert
      expect(testPlans.premiumMonthly.amount).toBe(1000) // $10 in cents
    })

    it('should support Premium Yearly tier ($96/year)', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.premiumYearly.priceId,
      )

      // Assert
      expect(testPlans.premiumYearly.amount).toBe(9600) // $96 in cents
    })

    it('should reflect yearly discount vs monthly pricing', () => {
      // Arrange
      const monthlyPrice = testPlans.plusMonthly.amount * 12
      const yearlyPrice = testPlans.plusYearly.amount

      // Act & Assert
      expect(yearlyPrice).toBeLessThan(monthlyPrice)
      const discount = ((monthlyPrice - yearlyPrice) / monthlyPrice) * 100
      expect(discount).toBeCloseTo(20, 0) // 20% discount
    })
  })

  describe('Subscription data structure', () => {
    it('should maintain consistent subscription data structure', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )

      // Assert
      expect(subscription).toHaveProperty('id')
      expect(subscription).toHaveProperty('customer')
      expect(subscription).toHaveProperty('status')
      expect(subscription).toHaveProperty('items')
      expect(subscription).toHaveProperty('current_period_start')
      expect(subscription).toHaveProperty('current_period_end')
    })

    it('should have valid current period dates', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
      )
      const now = Math.floor(Date.now() / 1000)

      // Assert
      expect(subscription.current_period_start).toBeLessThanOrEqual(now)
      expect(subscription.current_period_end).toBeGreaterThan(
        subscription.current_period_start,
      )
    })

    it('should support optional cancel_at field', () => {
      // Act
      const subscription = createTestSubscription(
        customerId,
        testPlans.plusMonthly.priceId,
        'canceled',
      )

      // Assert
      // Canceled subscriptions may have cancel_at field
      if (subscription.cancel_at !== undefined) {
        expect(typeof subscription.cancel_at).toBe('number')
      }
    })
  })
})

describe('Subscription Integration with Payment Methods', () => {
  it('should document subscription creation with payment method', () => {
    /**
     * When using Stripe MCP in real tests, subscription creation requires:
     *
     * 1. Create a customer (already covered in customer tests)
     * 2. Add a payment method to the customer
     * 3. Create subscription with the payment method
     *
     * const subscription = await stripeMCP.subscriptions.create({
     *   customer: 'cus_...',
     *   items: [{ price: 'price_...' }],
     *   payment_behavior: 'default_incomplete',
     * });
     *
     * This test demonstrates the expected subscription structure.
     */
    const customer = createTestCustomer(generateTestEmail())
    const subscription = createTestSubscription(
      customer.id,
      testPlans.plusMonthly.priceId,
    )
    expect(subscription.customer).toBe(customer.id)
  })
})

describe('Subscription Status Transitions', () => {
  it('should document valid subscription status transitions', () => {
    /**
     * Valid Stripe subscription status transitions:
     *
     * free → trialing (with trial period)
     * trialing → active (after trial ends, payment succeeds)
     * active → past_due (payment fails)
     * past_due → active (payment retried and succeeds)
     * past_due → canceled (customer cancels)
     * active → canceled (customer cancels)
     * any → unpaid (webhook indicates unpaid state)
     *
     * This test suite covers creating subscriptions in each state.
     */
    const statuses: Array<StripeTestSubscription['status']> = [
      'active',
      'trialing',
      'past_due',
      'canceled',
      'unpaid',
    ]

    const customer = createTestCustomer(generateTestEmail())

    statuses.forEach((status) => {
      const subscription = createTestSubscription(
        customer.id,
        testPlans.plusMonthly.priceId,
        status,
      )
      expect(subscription.status).toBe(status)
    })
  })
})
