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

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  createTestCustomer,
  createTestPaymentIntent,
  createTestCharge,
  testPlans,
  testScenarios,
} from './fixtures/stripe.fixtures';
import { generateTestEmail } from './fixtures/test-setup';

describe('Payment - Payment Intent Creation', () => {
  let customerId: string;

  beforeEach(() => {
    const customer = createTestCustomer(generateTestEmail());
    customerId = customer.id;
  });

  describe('Creating payment intents', () => {
    it('should create a payment intent successfully', () => {
      // Arrange
      const amount = testPlans.plusMonthly.amount;

      // Act
      const paymentIntent = createTestPaymentIntent(customerId, amount, 'succeeded');

      // Assert
      expect(paymentIntent).toBeDefined();
      expect(paymentIntent.id).toMatch(/^pi_test_/);
      expect(paymentIntent.amount).toBe(amount);
      expect(paymentIntent.currency).toBe('usd');
      expect(paymentIntent.customer).toBe(customerId);
    });

    it('should create payment intent without customer', () => {
      // Act
      const paymentIntent = createTestPaymentIntent(undefined, 9900);

      // Assert
      expect(paymentIntent.customer).toBeUndefined();
      expect(paymentIntent.amount).toBe(9900);
    });

    it('should support different payment amounts', () => {
      // Arrange
      const amounts = [
        testPlans.plusMonthly.amount,
        testPlans.plusYearly.amount,
        testPlans.premiumMonthly.amount,
        testPlans.premiumYearly.amount,
      ];

      // Act & Assert
      amounts.forEach(amount => {
        const pi = createTestPaymentIntent(customerId, amount);
        expect(pi.amount).toBe(amount);
      });
    });

    it('should generate unique payment intent IDs', () => {
      // Act
      const pi1 = createTestPaymentIntent(customerId, 5000);
      const pi2 = createTestPaymentIntent(customerId, 5000);

      // Assert
      expect(pi1.id).not.toBe(pi2.id);
    });
  });

  describe('Payment intent status transitions', () => {
    it('should create succeeded payment intent', () => {
      // Act
      const pi = createTestPaymentIntent(customerId, 9900, 'succeeded');

      // Assert
      expect(pi.status).toBe('succeeded');
    });

    it('should create failed payment intent', () => {
      // Act
      const pi = createTestPaymentIntent(customerId, 9900, 'requires_payment_method');

      // Assert
      expect(pi.status).toBe('requires_payment_method');
    });

    it('should create processing payment intent', () => {
      // Act
      const pi = createTestPaymentIntent(customerId, 9900, 'processing');

      // Assert
      expect(pi.status).toBe('processing');
    });

    it('should create canceled payment intent', () => {
      // Act
      const pi = createTestPaymentIntent(customerId, 9900, 'canceled');

      // Assert
      expect(pi.status).toBe('canceled');
    });
  });

  describe('Payment intent metadata', () => {
    it('should include metadata for tracking', () => {
      // Act
      const pi = createTestPaymentIntent(customerId, 9900, 'succeeded');

      // Assert
      expect(pi.metadata).toBeDefined();
      expect(pi.metadata?.test).toBe('true');
    });
  });
});

describe('Payment - Charge Processing', () => {
  beforeEach(() => {
    // Setup test context
  });

  describe('Successful charge creation', () => {
    it('should create a successful charge', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());
      const amount = testPlans.plusMonthly.amount;

      // Act
      const charge = createTestCharge(customer.id, amount, 'succeeded');

      // Assert
      expect(charge).toBeDefined();
      expect(charge.id).toMatch(/^ch_test_/);
      expect(charge.amount).toBe(amount);
      expect(charge.currency).toBe('usd');
      expect(charge.status).toBe('succeeded');
      expect(charge.customer).toBe(customer.id);
    });

    it('should support different charge amounts', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());
      const amounts = [500, 4800, 1000, 9600];

      // Act & Assert
      amounts.forEach(amount => {
        const charge = createTestCharge(customer.id, amount, 'succeeded');
        expect(charge.amount).toBe(amount);
      });
    });

    it('should generate unique charge IDs', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());

      // Act
      const charge1 = createTestCharge(customer.id, 5000);
      const charge2 = createTestCharge(customer.id, 5000);

      // Assert
      expect(charge1.id).not.toBe(charge2.id);
    });
  });

  describe('Failed charge scenarios', () => {
    it('should create a failed charge', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());

      // Act
      const charge = createTestCharge(customer.id, 9900, 'failed');

      // Assert
      expect(charge.status).toBe('failed');
    });

    it('should create a pending charge', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());

      // Act
      const charge = createTestCharge(customer.id, 9900, 'pending');

      // Assert
      expect(charge.status).toBe('pending');
    });

    it('should support charges without customer', () => {
      // Act
      const charge = createTestCharge(undefined, 9900, 'succeeded');

      // Assert
      expect(charge.customer).toBeUndefined();
      expect(charge.status).toBe('succeeded');
    });
  });

  describe('Charge metadata and description', () => {
    it('should include charge description', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());

      // Act
      const charge = createTestCharge(customer.id, 9900);

      // Assert
      expect(charge.description).toBe('Test charge');
    });

    it('should include payment method reference', () => {
      // Arrange
      const customer = createTestCustomer(generateTestEmail());

      // Act
      const charge = createTestCharge(customer.id, 9900);

      // Assert
      expect(charge.payment_method).toBeDefined();
      expect(charge.payment_method).toMatch(/^pm_test_/);
    });
  });
});

describe('Payment Flow - Complete Scenario', () => {
  it('should simulate complete successful payment flow', () => {
    // Arrange
    const customer = createTestCustomer('payment@example.com', 'Payment Test User');
    const amount = testPlans.plusMonthly.amount;

    // Act - Step 1: Create payment intent
    const paymentIntent = createTestPaymentIntent(customer.id, amount, 'processing');
    expect(paymentIntent.status).toBe('processing');

    // Act - Step 2: Confirm payment (simulate success)
    const confirmedIntent = createTestPaymentIntent(customer.id, amount, 'succeeded');
    expect(confirmedIntent.status).toBe('succeeded');

    // Act - Step 3: Create charge
    const charge = createTestCharge(customer.id, amount, 'succeeded');
    expect(charge.status).toBe('succeeded');

    // Assert - Validate complete flow
    expect(confirmedIntent.amount).toBe(charge.amount);
    expect(confirmedIntent.customer).toBe(charge.customer);
  });

  it('should simulate failed payment recovery flow', () => {
    // Arrange
    const customer = createTestCustomer('recovery@example.com');
    const amount = testPlans.plusMonthly.amount;

    // Act - Step 1: First attempt fails
    const failedIntent = createTestPaymentIntent(customer.id, amount, 'requires_payment_method');
    const failedCharge = createTestCharge(customer.id, amount, 'failed');
    expect(failedCharge.status).toBe('failed');

    // Act - Step 2: Retry succeeds
    const retriedIntent = createTestPaymentIntent(customer.id, amount, 'processing');
    const retriedCharge = createTestCharge(customer.id, amount, 'succeeded');
    expect(retriedCharge.status).toBe('succeeded');

    // Assert
    expect(failedCharge.id).not.toBe(retriedCharge.id);
    expect(retriedCharge.amount).toBe(amount);
  });

  it('should handle payment scenarios from testScenarios', () => {
    // Arrange
    const successScenario = testScenarios.successfulPayment;
    const failureScenario = testScenarios.failedPayment;

    // Act
    const successCharge = createTestCharge(
      successScenario.customer.id,
      9900,
      'succeeded'
    );
    const failureCharge = createTestCharge(
      failureScenario.customer.id,
      9900,
      'failed'
    );

    // Assert
    expect(successCharge.status).toBe('succeeded');
    expect(failureCharge.status).toBe('failed');
  });
});

describe('Payment Amount Validation', () => {
  it('should validate payment amounts match plan prices', () => {
    // Arrange
    const customer = createTestCustomer(generateTestEmail());

    // Act & Assert
    const plusMonthly = createTestCharge(customer.id, testPlans.plusMonthly.amount);
    expect(plusMonthly.amount).toBe(500);

    const plusYearly = createTestCharge(customer.id, testPlans.plusYearly.amount);
    expect(plusYearly.amount).toBe(4800);

    const premiumMonthly = createTestCharge(customer.id, testPlans.premiumMonthly.amount);
    expect(premiumMonthly.amount).toBe(1000);

    const premiumYearly = createTestCharge(customer.id, testPlans.premiumYearly.amount);
    expect(premiumYearly.amount).toBe(9600);
  });

  it('should support micro-transaction amounts', () => {
    // Arrange
    const customer = createTestCustomer(generateTestEmail());

    // Act
    const charge = createTestCharge(customer.id, 1, 'succeeded'); // 1 cent

    // Assert
    expect(charge.amount).toBe(1);
  });

  it('should support large payment amounts', () => {
    // Arrange
    const customer = createTestCustomer(generateTestEmail());

    // Act
    const charge = createTestCharge(customer.id, 999999, 'succeeded'); // $9,999.99

    // Assert
    expect(charge.amount).toBe(999999);
  });
});

describe('Payment Currency Handling', () => {
  it('should process charges in USD', () => {
    // Arrange
    const customer = createTestCustomer(generateTestEmail());

    // Act
    const charge = createTestCharge(customer.id, 9900);

    // Assert
    expect(charge.currency).toBe('usd');
  });

  it('should process payment intents in USD', () => {
    // Arrange
    const customer = createTestCustomer(generateTestEmail());

    // Act
    const pi = createTestPaymentIntent(customer.id, 9900);

    // Assert
    expect(pi.currency).toBe('usd');
  });
});

describe('Payment Data Structure Consistency', () => {
  it('should maintain consistent payment intent structure', () => {
    // Act
    const pi = createTestPaymentIntent('cus_test', 5000, 'succeeded');

    // Assert
    expect(pi).toHaveProperty('id');
    expect(pi).toHaveProperty('status');
    expect(pi).toHaveProperty('amount');
    expect(pi).toHaveProperty('currency');
    expect(pi).toHaveProperty('customer');
    expect(pi).toHaveProperty('metadata');
  });

  it('should maintain consistent charge structure', () => {
    // Act
    const charge = createTestCharge('cus_test', 5000, 'succeeded');

    // Assert
    expect(charge).toHaveProperty('id');
    expect(charge).toHaveProperty('amount');
    expect(charge).toHaveProperty('currency');
    expect(charge).toHaveProperty('status');
    expect(charge).toHaveProperty('customer');
    expect(charge).toHaveProperty('payment_method');
    expect(charge).toHaveProperty('description');
  });
});

describe('Payment Processing Edge Cases', () => {
  it('should handle zero-amount testing charges', () => {
    // Act
    const charge = createTestCharge('cus_test', 0, 'succeeded');

    // Assert
    expect(charge.amount).toBe(0);
  });

  it('should support charges for multiple customers', () => {
    // Arrange
    const customer1 = createTestCustomer('customer1@example.com');
    const customer2 = createTestCustomer('customer2@example.com');

    // Act
    const charge1 = createTestCharge(customer1.id, 5000);
    const charge2 = createTestCharge(customer2.id, 5000);

    // Assert
    expect(charge1.customer).not.toBe(charge2.customer);
  });
});
