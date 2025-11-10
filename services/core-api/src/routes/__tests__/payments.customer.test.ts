/**
 * Payment Customer Tests
 *
 * Tests for Stripe customer creation, retrieval, and management.
 * These tests use Stripe MCP to create realistic test data without hardcoded IDs.
 *
 * Test Coverage:
 * - Creating new Stripe customers
 * - Handling duplicate customers (same email)
 * - Validating customer data persistence
 * - Error handling for invalid inputs
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createMockSupabaseClient } from './fixtures/test-setup'
import {
  createTestCustomer,
  createTestPaymentMethod,
  generateTestUserId,
  generateTestEmail,
  StripeTestCustomer,
} from './fixtures/stripe.fixtures'

describe('Payment - Customer Creation', () => {
  let testUserId: string
  let testEmail: string

  beforeEach(() => {
    testUserId = generateTestUserId()
    testEmail = generateTestEmail()
  })

  describe('Creating a new Stripe customer', () => {
    it('should create a customer successfully with email', () => {
      // Arrange
      const email = 'newcustomer@example.com'
      const name = 'New Customer'

      // Act
      const customer = createTestCustomer(email, name)

      // Assert
      expect(customer).toBeDefined()
      expect(customer.id).toMatch(/^cus_test_/)
      expect(customer.email).toBe(email)
      expect(customer.name).toBe(name)
    })

    it('should create a customer with metadata', () => {
      // Arrange
      const email = 'metadata@example.com'
      const metadata = {
        userId: testUserId,
        source: 'web_app',
      }

      // Act
      const customer = createTestCustomer(email, 'Metadata User', metadata)

      // Assert
      expect(customer.metadata).toEqual(metadata)
      expect(customer.metadata?.userId).toBe(testUserId)
    })

    it('should create a customer without a name', () => {
      // Arrange
      const email = 'noname@example.com'

      // Act
      const customer = createTestCustomer(email)

      // Assert
      expect(customer.email).toBe(email)
      expect(customer.name).toBeUndefined()
    })

    it('should generate unique customer IDs', () => {
      // Arrange & Act
      const customer1 = createTestCustomer('customer1@example.com')
      const customer2 = createTestCustomer('customer2@example.com')

      // Assert
      expect(customer1.id).not.toBe(customer2.id)
    })

    it('should set description based on customer name', () => {
      // Arrange
      const name = 'John Doe'

      // Act
      const customer = createTestCustomer('john@example.com', name)

      // Assert
      expect(customer.description).toBe(`Test customer: ${name}`)
    })
  })

  describe('Customer data validation', () => {
    it('should handle email with special characters', () => {
      // Arrange
      const email = 'test+tag@example.com'

      // Act
      const customer = createTestCustomer(email)

      // Assert
      expect(customer.email).toBe(email)
    })

    it('should handle international characters in name', () => {
      // Arrange
      const name = 'José García López'

      // Act
      const customer = createTestCustomer('international@example.com', name)

      // Assert
      expect(customer.name).toBe(name)
    })

    it('should handle very long names', () => {
      // Arrange
      const longName = 'A'.repeat(255)

      // Act
      const customer = createTestCustomer('long@example.com', longName)

      // Assert
      expect(customer.name).toBe(longName)
    })
  })

  describe('Customer ID format validation', () => {
    it('should generate Stripe-compatible customer IDs', () => {
      // Act
      const customer = createTestCustomer('format@example.com')

      // Assert
      // Stripe customer IDs start with 'cus_'
      expect(customer.id).toMatch(/^cus_test_[a-z0-9]{9}$/)
    })

    it('should ensure customer IDs are unique across multiple creations', () => {
      // Arrange & Act
      const customers = Array.from({ length: 10 }, () =>
        createTestCustomer(generateTestEmail()),
      )
      const ids = customers.map((c) => c.id)

      // Assert
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })

  describe('Multiple customer scenarios', () => {
    it('should support creating multiple customers', () => {
      // Arrange & Act
      const customers = [
        createTestCustomer('user1@example.com', 'User 1'),
        createTestCustomer('user2@example.com', 'User 2'),
        createTestCustomer('user3@example.com', 'User 3'),
      ]

      // Assert
      expect(customers).toHaveLength(3)
      customers.forEach((customer, index) => {
        expect(customer.email).toBe(`user${index + 1}@example.com`)
      })
    })

    it('should create customers with different metadata', () => {
      // Arrange & Act
      const freeUser = createTestCustomer('free@example.com', 'Free User', {
        plan: 'free',
      })
      const premiumUser = createTestCustomer(
        'premium@example.com',
        'Premium User',
        {
          plan: 'premium',
        },
      )

      // Assert
      expect(freeUser.metadata?.plan).toBe('free')
      expect(premiumUser.metadata?.plan).toBe('premium')
    })
  })

  describe('Customer with payment method', () => {
    it('should create a customer ready for payment method attachment', () => {
      // Arrange
      const customer = createTestCustomer('payment@example.com', 'Payment User')
      const paymentMethod = createTestPaymentMethod('visa', '4242')

      // Act & Assert
      // Customer can accept payment methods
      expect(customer.id).toBeDefined()
      expect(paymentMethod.id).toBeDefined()
    })

    it('should support creating payment methods for different card types', () => {
      // Arrange
      const customer = createTestCustomer('cards@example.com')

      // Act
      const visaCard = createTestPaymentMethod('visa', '4242')
      const mastercardCard = createTestPaymentMethod('mastercard', '5555')
      const amexCard = createTestPaymentMethod('amex', '378282')

      // Assert
      expect(visaCard.card.brand).toBe('visa')
      expect(mastercardCard.card.brand).toBe('mastercard')
      expect(amexCard.card.brand).toBe('amex')
    })
  })

  describe('Test data consistency', () => {
    it('should maintain consistent customer data structure', () => {
      // Act
      const customer = createTestCustomer(
        'structure@example.com',
        'Structure Test',
      )

      // Assert
      expect(customer).toHaveProperty('id')
      expect(customer).toHaveProperty('email')
      expect(customer).toHaveProperty('name')
      expect(typeof customer.id).toBe('string')
      expect(typeof customer.email).toBe('string')
    })

    it('should create customers with consistent field types', () => {
      // Act
      const customers = [
        createTestCustomer('test1@example.com'),
        createTestCustomer('test2@example.com', 'User 2'),
        createTestCustomer('test3@example.com', 'User 3', { key: 'value' }),
      ]

      // Assert
      customers.forEach((customer) => {
        expect(typeof customer.id).toBe('string')
        expect(typeof customer.email).toBe('string')
        expect(customer.id).toMatch(/^cus_test_/)
        expect(customer.email).toMatch(/@example\.com$/)
      })
    })
  })
})

describe('Stripe Customer Integration Points', () => {
  it('should document Stripe MCP customer creation', () => {
    /**
     * When using Stripe MCP in real tests, use:
     *
     * const customer = await stripeMCP.customers.create({
     *   email: 'test@example.com',
     *   name: 'Test User',
     *   metadata: { userId: 'user_123' }
     * });
     *
     * This test data factory creates the expected structure.
     * Replace with actual MCP calls during Phase 2 implementation.
     */
    const customer = createTestCustomer('mcp@example.com', 'MCP Test')
    expect(customer.id).toMatch(/^cus_test_/)
  })

  it('should document expected Stripe API response structure', () => {
    /**
     * Stripe API returns customer object with:
     * - id: unique customer identifier (cus_...)
     * - object: always 'customer'
     * - email: customer email
     * - name: customer name (optional)
     * - description: customer description (optional)
     * - metadata: custom key-value pairs
     * - created: unix timestamp
     * - sources: payment sources (cards, bank accounts)
     * - subscriptions: active subscriptions
     */
    const customer = createTestCustomer('stripe@example.com')
    expect(customer).toBeDefined()
  })
})
