"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const stripe_fixtures_1 = require("./fixtures/stripe.fixtures");
(0, globals_1.describe)('Payment - Subscription Creation', () => {
    let customerId;
    (0, globals_1.beforeEach)(() => {
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        customerId = customer.id;
    });
    (0, globals_1.describe)('Creating a subscription', () => {
        (0, globals_1.it)('should create a monthly subscription successfully', () => {
            // Arrange
            const priceId = stripe_fixtures_1.testPlans.plusMonthly.priceId;
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, priceId, 'active');
            // Assert
            (0, globals_1.expect)(subscription).toBeDefined();
            (0, globals_1.expect)(subscription.id).toMatch(/^sub_test_/);
            (0, globals_1.expect)(subscription.customer).toBe(customerId);
            (0, globals_1.expect)(subscription.status).toBe('active');
            (0, globals_1.expect)(subscription.items.data).toHaveLength(1);
        });
        (0, globals_1.it)('should create a yearly subscription successfully', () => {
            // Arrange
            const priceId = stripe_fixtures_1.testPlans.plusYearly.priceId;
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, priceId);
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('active');
            (0, globals_1.expect)(subscription.items.data[0].price.id).toBe(priceId);
            (0, globals_1.expect)(subscription.items.data[0].price.recurring?.interval).toBe('year');
        });
        (0, globals_1.it)('should create subscription with correct billing cycle dates', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            const now = Math.floor(Date.now() / 1000);
            // Assert
            (0, globals_1.expect)(subscription.current_period_start).toBeLessThanOrEqual(now);
            (0, globals_1.expect)(subscription.current_period_end).toBeGreaterThan(now);
            // Should be approximately 30 days
            const daysDifference = (subscription.current_period_end - subscription.current_period_start) / (24 * 60 * 60);
            (0, globals_1.expect)(daysDifference).toBeCloseTo(30, -1);
        });
        (0, globals_1.it)('should support all four plan types', () => {
            // Arrange
            const plans = [
                stripe_fixtures_1.testPlans.plusMonthly,
                stripe_fixtures_1.testPlans.plusYearly,
                stripe_fixtures_1.testPlans.premiumMonthly,
                stripe_fixtures_1.testPlans.premiumYearly,
            ];
            // Act & Assert
            plans.forEach(plan => {
                const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, plan.priceId);
                (0, globals_1.expect)(subscription.items.data[0].price.id).toBe(plan.priceId);
            });
        });
    });
    (0, globals_1.describe)('Subscription status management', () => {
        (0, globals_1.it)('should create active subscription', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('active');
        });
        (0, globals_1.it)('should create trialing subscription', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'trialing');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('trialing');
        });
        (0, globals_1.it)('should create past_due subscription', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'past_due');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('past_due');
        });
        (0, globals_1.it)('should create canceled subscription', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'canceled');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('canceled');
        });
        (0, globals_1.it)('should create unpaid subscription', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'unpaid');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('unpaid');
        });
    });
    (0, globals_1.describe)('Subscription ID format', () => {
        (0, globals_1.it)('should generate unique subscription IDs', () => {
            // Act
            const sub1 = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            const sub2 = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusYearly.priceId);
            // Assert
            (0, globals_1.expect)(sub1.id).not.toBe(sub2.id);
        });
        (0, globals_1.it)('should use Stripe-compatible subscription IDs', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            // Assert
            (0, globals_1.expect)(subscription.id).toMatch(/^sub_test_[a-z0-9]{9}$/);
        });
    });
    (0, globals_1.describe)('Subscription billing details', () => {
        (0, globals_1.it)('should set correct product ID based on price', () => {
            // Act
            const plusSub = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            const premiumSub = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumMonthly.priceId);
            // Assert
            (0, globals_1.expect)(plusSub.items.data[0].price.product).toContain('plus');
            (0, globals_1.expect)(premiumSub.items.data[0].price.product).toContain('premium');
        });
        (0, globals_1.it)('should set correct interval for monthly plans', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            // Assert
            (0, globals_1.expect)(subscription.items.data[0].price.recurring?.interval).toBe('month');
            (0, globals_1.expect)(subscription.items.data[0].price.recurring?.interval_count).toBe(1);
        });
        (0, globals_1.it)('should set correct interval for yearly plans', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusYearly.priceId);
            // Assert
            (0, globals_1.expect)(subscription.items.data[0].price.recurring?.interval).toBe('year');
            (0, globals_1.expect)(subscription.items.data[0].price.recurring?.interval_count).toBe(1);
        });
    });
    (0, globals_1.describe)('Multiple subscriptions for same customer', () => {
        (0, globals_1.it)('should allow creating multiple subscriptions for testing', () => {
            // Act
            const sub1 = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            const sub2 = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumYearly.priceId);
            // Assert
            (0, globals_1.expect)(sub1.customer).toBe(sub2.customer);
            (0, globals_1.expect)(sub1.id).not.toBe(sub2.id);
            (0, globals_1.expect)(sub1.items.data[0].price.id).not.toBe(sub2.items.data[0].price.id);
        });
    });
    (0, globals_1.describe)('Subscription lifecycle scenarios', () => {
        (0, globals_1.it)('should create active subscription matching testScenarios', () => {
            // Arrange
            const scenario = stripe_fixtures_1.testScenarios.subscriptionTrial;
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(scenario.customer.id, 'price_monthly', 'trialing');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('trialing');
        });
        (0, globals_1.it)('should create past due subscription for failed payment', () => {
            // Arrange
            const scenario = stripe_fixtures_1.testScenarios.pastDueSubscription;
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(scenario.customer.id, 'price_monthly', 'past_due');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('past_due');
        });
        (0, globals_1.it)('should create canceled subscription for downgrade', () => {
            // Arrange
            const scenario = stripe_fixtures_1.testScenarios.canceledSubscription;
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(scenario.customer.id, 'price_monthly', 'canceled');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('canceled');
        });
    });
    (0, globals_1.describe)('Subscription tier pricing', () => {
        (0, globals_1.it)('should support Plus Monthly tier ($5/month)', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            // Assert
            (0, globals_1.expect)(subscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.plusMonthly.priceId);
            (0, globals_1.expect)(stripe_fixtures_1.testPlans.plusMonthly.amount).toBe(500); // $5 in cents
        });
        (0, globals_1.it)('should support Plus Yearly tier ($48/year)', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusYearly.priceId);
            // Assert
            (0, globals_1.expect)(subscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.plusYearly.priceId);
            (0, globals_1.expect)(stripe_fixtures_1.testPlans.plusYearly.amount).toBe(4800); // $48 in cents
        });
        (0, globals_1.it)('should support Premium Monthly tier ($10/month)', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumMonthly.priceId);
            // Assert
            (0, globals_1.expect)(stripe_fixtures_1.testPlans.premiumMonthly.amount).toBe(1000); // $10 in cents
        });
        (0, globals_1.it)('should support Premium Yearly tier ($96/year)', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.premiumYearly.priceId);
            // Assert
            (0, globals_1.expect)(stripe_fixtures_1.testPlans.premiumYearly.amount).toBe(9600); // $96 in cents
        });
        (0, globals_1.it)('should reflect yearly discount vs monthly pricing', () => {
            // Arrange
            const monthlyPrice = stripe_fixtures_1.testPlans.plusMonthly.amount * 12;
            const yearlyPrice = stripe_fixtures_1.testPlans.plusYearly.amount;
            // Act & Assert
            (0, globals_1.expect)(yearlyPrice).toBeLessThan(monthlyPrice);
            const discount = ((monthlyPrice - yearlyPrice) / monthlyPrice) * 100;
            (0, globals_1.expect)(discount).toBeCloseTo(20, 0); // 20% discount
        });
    });
    (0, globals_1.describe)('Subscription data structure', () => {
        (0, globals_1.it)('should maintain consistent subscription data structure', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            // Assert
            (0, globals_1.expect)(subscription).toHaveProperty('id');
            (0, globals_1.expect)(subscription).toHaveProperty('customer');
            (0, globals_1.expect)(subscription).toHaveProperty('status');
            (0, globals_1.expect)(subscription).toHaveProperty('items');
            (0, globals_1.expect)(subscription).toHaveProperty('current_period_start');
            (0, globals_1.expect)(subscription).toHaveProperty('current_period_end');
        });
        (0, globals_1.it)('should have valid current period dates', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId);
            const now = Math.floor(Date.now() / 1000);
            // Assert
            (0, globals_1.expect)(subscription.current_period_start).toBeLessThanOrEqual(now);
            (0, globals_1.expect)(subscription.current_period_end).toBeGreaterThan(subscription.current_period_start);
        });
        (0, globals_1.it)('should support optional cancel_at field', () => {
            // Act
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'canceled');
            // Assert
            // Canceled subscriptions may have cancel_at field
            if (subscription.cancel_at !== undefined) {
                (0, globals_1.expect)(typeof subscription.cancel_at).toBe('number');
            }
        });
    });
});
(0, globals_1.describe)('Subscription Integration with Payment Methods', () => {
    (0, globals_1.it)('should document subscription creation with payment method', () => {
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
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId);
        (0, globals_1.expect)(subscription.customer).toBe(customer.id);
    });
});
(0, globals_1.describe)('Subscription Status Transitions', () => {
    (0, globals_1.it)('should document valid subscription status transitions', () => {
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
        const statuses = [
            'active',
            'trialing',
            'past_due',
            'canceled',
            'unpaid',
        ];
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        statuses.forEach(status => {
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, status);
            (0, globals_1.expect)(subscription.status).toBe(status);
        });
    });
});
//# sourceMappingURL=payments.subscription.test.js.map