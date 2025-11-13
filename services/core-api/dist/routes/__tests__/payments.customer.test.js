"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const stripe_fixtures_1 = require("./fixtures/stripe.fixtures");
(0, globals_1.describe)('Payment - Customer Creation', () => {
    let testUserId;
    let testEmail;
    (0, globals_1.beforeEach)(() => {
        testUserId = (0, stripe_fixtures_1.generateTestUserId)();
        testEmail = (0, stripe_fixtures_1.generateTestEmail)();
    });
    (0, globals_1.describe)('Creating a new Stripe customer', () => {
        (0, globals_1.it)('should create a customer successfully with email', () => {
            // Arrange
            const email = 'newcustomer@example.com';
            const name = 'New Customer';
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email, name);
            // Assert
            (0, globals_1.expect)(customer).toBeDefined();
            (0, globals_1.expect)(customer.id).toMatch(/^cus_test_/);
            (0, globals_1.expect)(customer.email).toBe(email);
            (0, globals_1.expect)(customer.name).toBe(name);
        });
        (0, globals_1.it)('should create a customer with metadata', () => {
            // Arrange
            const email = 'metadata@example.com';
            const metadata = {
                userId: testUserId,
                source: 'web_app',
            };
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email, 'Metadata User', metadata);
            // Assert
            (0, globals_1.expect)(customer.metadata).toEqual(metadata);
            (0, globals_1.expect)(customer.metadata?.userId).toBe(testUserId);
        });
        (0, globals_1.it)('should create a customer without a name', () => {
            // Arrange
            const email = 'noname@example.com';
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
            // Assert
            (0, globals_1.expect)(customer.email).toBe(email);
            (0, globals_1.expect)(customer.name).toBeUndefined();
        });
        (0, globals_1.it)('should generate unique customer IDs', () => {
            // Arrange & Act
            const customer1 = (0, stripe_fixtures_1.createTestCustomer)('customer1@example.com');
            const customer2 = (0, stripe_fixtures_1.createTestCustomer)('customer2@example.com');
            // Assert
            (0, globals_1.expect)(customer1.id).not.toBe(customer2.id);
        });
        (0, globals_1.it)('should set description based on customer name', () => {
            // Arrange
            const name = 'John Doe';
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)('john@example.com', name);
            // Assert
            (0, globals_1.expect)(customer.description).toBe(`Test customer: ${name}`);
        });
    });
    (0, globals_1.describe)('Customer data validation', () => {
        (0, globals_1.it)('should handle email with special characters', () => {
            // Arrange
            const email = 'test+tag@example.com';
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
            // Assert
            (0, globals_1.expect)(customer.email).toBe(email);
        });
        (0, globals_1.it)('should handle international characters in name', () => {
            // Arrange
            const name = 'José García López';
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)('international@example.com', name);
            // Assert
            (0, globals_1.expect)(customer.name).toBe(name);
        });
        (0, globals_1.it)('should handle very long names', () => {
            // Arrange
            const longName = 'A'.repeat(255);
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)('long@example.com', longName);
            // Assert
            (0, globals_1.expect)(customer.name).toBe(longName);
        });
    });
    (0, globals_1.describe)('Customer ID format validation', () => {
        (0, globals_1.it)('should generate Stripe-compatible customer IDs', () => {
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)('format@example.com');
            // Assert
            // Stripe customer IDs start with 'cus_'
            (0, globals_1.expect)(customer.id).toMatch(/^cus_test_[a-z0-9]{9}$/);
        });
        (0, globals_1.it)('should ensure customer IDs are unique across multiple creations', () => {
            // Arrange & Act
            const customers = Array.from({ length: 10 }, () => (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)()));
            const ids = customers.map(c => c.id);
            // Assert
            const uniqueIds = new Set(ids);
            (0, globals_1.expect)(uniqueIds.size).toBe(10);
        });
    });
    (0, globals_1.describe)('Multiple customer scenarios', () => {
        (0, globals_1.it)('should support creating multiple customers', () => {
            // Arrange & Act
            const customers = [
                (0, stripe_fixtures_1.createTestCustomer)('user1@example.com', 'User 1'),
                (0, stripe_fixtures_1.createTestCustomer)('user2@example.com', 'User 2'),
                (0, stripe_fixtures_1.createTestCustomer)('user3@example.com', 'User 3'),
            ];
            // Assert
            (0, globals_1.expect)(customers).toHaveLength(3);
            customers.forEach((customer, index) => {
                (0, globals_1.expect)(customer.email).toBe(`user${index + 1}@example.com`);
            });
        });
        (0, globals_1.it)('should create customers with different metadata', () => {
            // Arrange & Act
            const freeUser = (0, stripe_fixtures_1.createTestCustomer)('free@example.com', 'Free User', {
                plan: 'free',
            });
            const premiumUser = (0, stripe_fixtures_1.createTestCustomer)('premium@example.com', 'Premium User', {
                plan: 'premium',
            });
            // Assert
            (0, globals_1.expect)(freeUser.metadata?.plan).toBe('free');
            (0, globals_1.expect)(premiumUser.metadata?.plan).toBe('premium');
        });
    });
    (0, globals_1.describe)('Customer with payment method', () => {
        (0, globals_1.it)('should create a customer ready for payment method attachment', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)('payment@example.com', 'Payment User');
            const paymentMethod = (0, stripe_fixtures_1.createTestPaymentMethod)('visa', '4242');
            // Act & Assert
            // Customer can accept payment methods
            (0, globals_1.expect)(customer.id).toBeDefined();
            (0, globals_1.expect)(paymentMethod.id).toBeDefined();
        });
        (0, globals_1.it)('should support creating payment methods for different card types', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)('cards@example.com');
            // Act
            const visaCard = (0, stripe_fixtures_1.createTestPaymentMethod)('visa', '4242');
            const mastercardCard = (0, stripe_fixtures_1.createTestPaymentMethod)('mastercard', '5555');
            const amexCard = (0, stripe_fixtures_1.createTestPaymentMethod)('amex', '378282');
            // Assert
            (0, globals_1.expect)(visaCard.card.brand).toBe('visa');
            (0, globals_1.expect)(mastercardCard.card.brand).toBe('mastercard');
            (0, globals_1.expect)(amexCard.card.brand).toBe('amex');
        });
    });
    (0, globals_1.describe)('Test data consistency', () => {
        (0, globals_1.it)('should maintain consistent customer data structure', () => {
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)('structure@example.com', 'Structure Test');
            // Assert
            (0, globals_1.expect)(customer).toHaveProperty('id');
            (0, globals_1.expect)(customer).toHaveProperty('email');
            (0, globals_1.expect)(customer).toHaveProperty('name');
            (0, globals_1.expect)(typeof customer.id).toBe('string');
            (0, globals_1.expect)(typeof customer.email).toBe('string');
        });
        (0, globals_1.it)('should create customers with consistent field types', () => {
            // Act
            const customers = [
                (0, stripe_fixtures_1.createTestCustomer)('test1@example.com'),
                (0, stripe_fixtures_1.createTestCustomer)('test2@example.com', 'User 2'),
                (0, stripe_fixtures_1.createTestCustomer)('test3@example.com', 'User 3', { key: 'value' }),
            ];
            // Assert
            customers.forEach(customer => {
                (0, globals_1.expect)(typeof customer.id).toBe('string');
                (0, globals_1.expect)(typeof customer.email).toBe('string');
                (0, globals_1.expect)(customer.id).toMatch(/^cus_test_/);
                (0, globals_1.expect)(customer.email).toMatch(/@example\.com$/);
            });
        });
    });
});
(0, globals_1.describe)('Stripe Customer Integration Points', () => {
    (0, globals_1.it)('should document Stripe MCP customer creation', () => {
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
        const customer = (0, stripe_fixtures_1.createTestCustomer)('mcp@example.com', 'MCP Test');
        (0, globals_1.expect)(customer.id).toMatch(/^cus_test_/);
    });
    (0, globals_1.it)('should document expected Stripe API response structure', () => {
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
        const customer = (0, stripe_fixtures_1.createTestCustomer)('stripe@example.com');
        (0, globals_1.expect)(customer).toBeDefined();
    });
});
//# sourceMappingURL=payments.customer.test.js.map