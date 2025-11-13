"use strict";
/**
 * Payment Processing Tests
 *
 * Tests for payment intent creation, confirmation, and charge processing.
 * Tests validate successful payments, failures, and error scenarios.
 *
 * Test Coverage:
 * - Creating payment intents
 * - Confirming payments
 * - Handling successful charges
 * - Handling failed charges
 * - Validating charge amounts and currency
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const stripe_fixtures_1 = require("./fixtures/stripe.fixtures");
(0, globals_1.describe)('Payment - Payment Intent Creation', () => {
    let customerId;
    (0, globals_1.beforeEach)(() => {
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        customerId = customer.id;
    });
    (0, globals_1.describe)('Creating payment intents', () => {
        (0, globals_1.it)('should create a payment intent successfully', () => {
            // Arrange
            const amount = stripe_fixtures_1.testPlans.plusMonthly.amount;
            // Act
            const paymentIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, amount, 'succeeded');
            // Assert
            (0, globals_1.expect)(paymentIntent).toBeDefined();
            (0, globals_1.expect)(paymentIntent.id).toMatch(/^pi_test_/);
            (0, globals_1.expect)(paymentIntent.amount).toBe(amount);
            (0, globals_1.expect)(paymentIntent.currency).toBe('usd');
            (0, globals_1.expect)(paymentIntent.customer).toBe(customerId);
        });
        (0, globals_1.it)('should create payment intent without customer', () => {
            // Act
            const paymentIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(undefined, 9900);
            // Assert
            (0, globals_1.expect)(paymentIntent.customer).toBeUndefined();
            (0, globals_1.expect)(paymentIntent.amount).toBe(9900);
        });
        (0, globals_1.it)('should support different payment amounts', () => {
            // Arrange
            const amounts = [
                stripe_fixtures_1.testPlans.plusMonthly.amount,
                stripe_fixtures_1.testPlans.plusYearly.amount,
                stripe_fixtures_1.testPlans.premiumMonthly.amount,
                stripe_fixtures_1.testPlans.premiumYearly.amount,
            ];
            // Act & Assert
            amounts.forEach(amount => {
                const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, amount);
                (0, globals_1.expect)(pi.amount).toBe(amount);
            });
        });
        (0, globals_1.it)('should generate unique payment intent IDs', () => {
            // Act
            const pi1 = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 5000);
            const pi2 = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 5000);
            // Assert
            (0, globals_1.expect)(pi1.id).not.toBe(pi2.id);
        });
    });
    (0, globals_1.describe)('Payment intent status transitions', () => {
        (0, globals_1.it)('should create succeeded payment intent', () => {
            // Act
            const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 9900, 'succeeded');
            // Assert
            (0, globals_1.expect)(pi.status).toBe('succeeded');
        });
        (0, globals_1.it)('should create failed payment intent', () => {
            // Act
            const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 9900, 'requires_payment_method');
            // Assert
            (0, globals_1.expect)(pi.status).toBe('requires_payment_method');
        });
        (0, globals_1.it)('should create processing payment intent', () => {
            // Act
            const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 9900, 'processing');
            // Assert
            (0, globals_1.expect)(pi.status).toBe('processing');
        });
        (0, globals_1.it)('should create canceled payment intent', () => {
            // Act
            const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 9900, 'canceled');
            // Assert
            (0, globals_1.expect)(pi.status).toBe('canceled');
        });
    });
    (0, globals_1.describe)('Payment intent metadata', () => {
        (0, globals_1.it)('should include metadata for tracking', () => {
            // Act
            const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customerId, 9900, 'succeeded');
            // Assert
            (0, globals_1.expect)(pi.metadata).toBeDefined();
            (0, globals_1.expect)(pi.metadata?.test).toBe('true');
        });
    });
});
(0, globals_1.describe)('Payment - Charge Processing', () => {
    (0, globals_1.beforeEach)(() => {
        // Setup test context
    });
    (0, globals_1.describe)('Successful charge creation', () => {
        (0, globals_1.it)('should create a successful charge', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const amount = stripe_fixtures_1.testPlans.plusMonthly.amount;
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, amount, 'succeeded');
            // Assert
            (0, globals_1.expect)(charge).toBeDefined();
            (0, globals_1.expect)(charge.id).toMatch(/^ch_test_/);
            (0, globals_1.expect)(charge.amount).toBe(amount);
            (0, globals_1.expect)(charge.currency).toBe('usd');
            (0, globals_1.expect)(charge.status).toBe('succeeded');
            (0, globals_1.expect)(charge.customer).toBe(customer.id);
        });
        (0, globals_1.it)('should support different charge amounts', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const amounts = [500, 4800, 1000, 9600];
            // Act & Assert
            amounts.forEach(amount => {
                const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, amount, 'succeeded');
                (0, globals_1.expect)(charge.amount).toBe(amount);
            });
        });
        (0, globals_1.it)('should generate unique charge IDs', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // Act
            const charge1 = (0, stripe_fixtures_1.createTestCharge)(customer.id, 5000);
            const charge2 = (0, stripe_fixtures_1.createTestCharge)(customer.id, 5000);
            // Assert
            (0, globals_1.expect)(charge1.id).not.toBe(charge2.id);
        });
    });
    (0, globals_1.describe)('Failed charge scenarios', () => {
        (0, globals_1.it)('should create a failed charge', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 9900, 'failed');
            // Assert
            (0, globals_1.expect)(charge.status).toBe('failed');
        });
        (0, globals_1.it)('should create a pending charge', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 9900, 'pending');
            // Assert
            (0, globals_1.expect)(charge.status).toBe('pending');
        });
        (0, globals_1.it)('should support charges without customer', () => {
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(undefined, 9900, 'succeeded');
            // Assert
            (0, globals_1.expect)(charge.customer).toBeUndefined();
            (0, globals_1.expect)(charge.status).toBe('succeeded');
        });
    });
    (0, globals_1.describe)('Charge metadata and description', () => {
        (0, globals_1.it)('should include charge description', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 9900);
            // Assert
            (0, globals_1.expect)(charge.description).toBe('Test charge');
        });
        (0, globals_1.it)('should include payment method reference', () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // Act
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 9900);
            // Assert
            (0, globals_1.expect)(charge.payment_method).toBeDefined();
            (0, globals_1.expect)(charge.payment_method).toMatch(/^pm_test_/);
        });
    });
});
(0, globals_1.describe)('Payment Flow - Complete Scenario', () => {
    (0, globals_1.it)('should simulate complete successful payment flow', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)('payment@example.com', 'Payment Test User');
        const amount = stripe_fixtures_1.testPlans.plusMonthly.amount;
        // Act - Step 1: Create payment intent
        const paymentIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, amount, 'processing');
        (0, globals_1.expect)(paymentIntent.status).toBe('processing');
        // Act - Step 2: Confirm payment (simulate success)
        const confirmedIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, amount, 'succeeded');
        (0, globals_1.expect)(confirmedIntent.status).toBe('succeeded');
        // Act - Step 3: Create charge
        const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, amount, 'succeeded');
        (0, globals_1.expect)(charge.status).toBe('succeeded');
        // Assert - Validate complete flow
        (0, globals_1.expect)(confirmedIntent.amount).toBe(charge.amount);
        (0, globals_1.expect)(confirmedIntent.customer).toBe(charge.customer);
    });
    (0, globals_1.it)('should simulate failed payment recovery flow', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)('recovery@example.com');
        const amount = stripe_fixtures_1.testPlans.plusMonthly.amount;
        // Act - Step 1: First attempt fails
        const failedIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, amount, 'requires_payment_method');
        const failedCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, amount, 'failed');
        (0, globals_1.expect)(failedCharge.status).toBe('failed');
        // Act - Step 2: Retry succeeds
        const retriedIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, amount, 'processing');
        const retriedCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, amount, 'succeeded');
        (0, globals_1.expect)(retriedCharge.status).toBe('succeeded');
        // Assert
        (0, globals_1.expect)(failedCharge.id).not.toBe(retriedCharge.id);
        (0, globals_1.expect)(retriedCharge.amount).toBe(amount);
    });
    (0, globals_1.it)('should handle payment scenarios from testScenarios', () => {
        // Arrange
        const successScenario = stripe_fixtures_1.testScenarios.successfulPayment;
        const failureScenario = stripe_fixtures_1.testScenarios.failedPayment;
        // Act
        const successCharge = (0, stripe_fixtures_1.createTestCharge)(successScenario.customer.id, 9900, 'succeeded');
        const failureCharge = (0, stripe_fixtures_1.createTestCharge)(failureScenario.customer.id, 9900, 'failed');
        // Assert
        (0, globals_1.expect)(successCharge.status).toBe('succeeded');
        (0, globals_1.expect)(failureCharge.status).toBe('failed');
    });
});
(0, globals_1.describe)('Payment Amount Validation', () => {
    (0, globals_1.it)('should validate payment amounts match plan prices', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act & Assert
        const plusMonthly = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.amount);
        (0, globals_1.expect)(plusMonthly.amount).toBe(500);
        const plusYearly = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusYearly.amount);
        (0, globals_1.expect)(plusYearly.amount).toBe(4800);
        const premiumMonthly = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.amount);
        (0, globals_1.expect)(premiumMonthly.amount).toBe(1000);
        const premiumYearly = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.premiumYearly.amount);
        (0, globals_1.expect)(premiumYearly.amount).toBe(9600);
    });
    (0, globals_1.it)('should support micro-transaction amounts', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act
        const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 1, 'succeeded'); // 1 cent
        // Assert
        (0, globals_1.expect)(charge.amount).toBe(1);
    });
    (0, globals_1.it)('should support large payment amounts', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act
        const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 999999, 'succeeded'); // $9,999.99
        // Assert
        (0, globals_1.expect)(charge.amount).toBe(999999);
    });
});
(0, globals_1.describe)('Payment Currency Handling', () => {
    (0, globals_1.it)('should process charges in USD', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act
        const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, 9900);
        // Assert
        (0, globals_1.expect)(charge.currency).toBe('usd');
    });
    (0, globals_1.it)('should process payment intents in USD', () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act
        const pi = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, 9900);
        // Assert
        (0, globals_1.expect)(pi.currency).toBe('usd');
    });
});
(0, globals_1.describe)('Payment Data Structure Consistency', () => {
    (0, globals_1.it)('should maintain consistent payment intent structure', () => {
        // Act
        const pi = (0, stripe_fixtures_1.createTestPaymentIntent)('cus_test', 5000, 'succeeded');
        // Assert
        (0, globals_1.expect)(pi).toHaveProperty('id');
        (0, globals_1.expect)(pi).toHaveProperty('status');
        (0, globals_1.expect)(pi).toHaveProperty('amount');
        (0, globals_1.expect)(pi).toHaveProperty('currency');
        (0, globals_1.expect)(pi).toHaveProperty('customer');
        (0, globals_1.expect)(pi).toHaveProperty('metadata');
    });
    (0, globals_1.it)('should maintain consistent charge structure', () => {
        // Act
        const charge = (0, stripe_fixtures_1.createTestCharge)('cus_test', 5000, 'succeeded');
        // Assert
        (0, globals_1.expect)(charge).toHaveProperty('id');
        (0, globals_1.expect)(charge).toHaveProperty('amount');
        (0, globals_1.expect)(charge).toHaveProperty('currency');
        (0, globals_1.expect)(charge).toHaveProperty('status');
        (0, globals_1.expect)(charge).toHaveProperty('customer');
        (0, globals_1.expect)(charge).toHaveProperty('payment_method');
        (0, globals_1.expect)(charge).toHaveProperty('description');
    });
});
(0, globals_1.describe)('Payment Processing Edge Cases', () => {
    (0, globals_1.it)('should handle zero-amount testing charges', () => {
        // Act
        const charge = (0, stripe_fixtures_1.createTestCharge)('cus_test', 0, 'succeeded');
        // Assert
        (0, globals_1.expect)(charge.amount).toBe(0);
    });
    (0, globals_1.it)('should support charges for multiple customers', () => {
        // Arrange
        const customer1 = (0, stripe_fixtures_1.createTestCustomer)('customer1@example.com');
        const customer2 = (0, stripe_fixtures_1.createTestCustomer)('customer2@example.com');
        // Act
        const charge1 = (0, stripe_fixtures_1.createTestCharge)(customer1.id, 5000);
        const charge2 = (0, stripe_fixtures_1.createTestCharge)(customer2.id, 5000);
        // Assert
        (0, globals_1.expect)(charge1.customer).not.toBe(charge2.customer);
    });
});
//# sourceMappingURL=payments.processing.test.js.map