"use strict";
/**
 * Stripe Test Fixtures
 *
 * Provides realistic test data and helper functions for Stripe MCP integration tests.
 * Uses Stripe MCP to create test customers, subscriptions, and payment scenarios.
 *
 * These fixtures enable:
 * - Creating test customers without hardcoded IDs
 * - Simulating payment scenarios (success, failure, timeout)
 * - Building realistic test data for webhook testing
 * - Reusable test setup across all payment tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testWebhookEvents = exports.testPlans = exports.testScenarios = void 0;
exports.createTestCustomer = createTestCustomer;
exports.createTestPaymentMethod = createTestPaymentMethod;
exports.createTestSubscription = createTestSubscription;
exports.createTestPaymentIntent = createTestPaymentIntent;
exports.createTestCharge = createTestCharge;
exports.generateTestUserId = generateTestUserId;
exports.generateTestEmail = generateTestEmail;
/**
 * Create a realistic test customer
 *
 * @param email - Customer email address
 * @param name - Customer name
 * @param metadata - Additional metadata
 * @returns Mock Stripe customer
 *
 * @example
 * const customer = createTestCustomer('john@example.com', 'John Doe');
 * expect(customer.email).toBe('john@example.com');
 */
function createTestCustomer(email, name, metadata) {
    return {
        id: `cus_test_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        description: name ? `Test customer: ${name}` : undefined,
        metadata,
    };
}
/**
 * Create a realistic test payment method (card)
 *
 * @param brand - Card brand (visa, mastercard, amex)
 * @param last4 - Last 4 digits of card
 * @param expiryMonth - Expiration month (1-12)
 * @param expiryYear - Expiration year
 * @returns Mock Stripe payment method
 *
 * @example
 * const pm = createTestPaymentMethod('visa', '4242', 12, 2025);
 * expect(pm.card.brand).toBe('visa');
 */
function createTestPaymentMethod(brand = 'visa', last4 = '4242', expiryMonth = 12, expiryYear = 2025) {
    return {
        id: `pm_test_${Math.random().toString(36).substr(2, 9)}`,
        type: 'card',
        card: {
            brand,
            last4,
            exp_month: expiryMonth,
            exp_year: expiryYear,
        },
    };
}
/**
 * Create a realistic test subscription
 *
 * @param customerId - Stripe customer ID
 * @param priceId - Stripe price ID
 * @param status - Subscription status
 * @returns Mock Stripe subscription
 *
 * @example
 * const sub = createTestSubscription('cus_123', 'price_monthly');
 * expect(sub.customer).toBe('cus_123');
 * expect(sub.status).toBe('active');
 */
function createTestSubscription(customerId, priceId, status = 'active') {
    const now = Math.floor(Date.now() / 1000);
    return {
        id: `sub_test_${Math.random().toString(36).substr(2, 9)}`,
        customer: customerId,
        status,
        items: {
            data: [
                {
                    id: `si_test_${Math.random().toString(36).substr(2, 9)}`,
                    price: {
                        id: priceId,
                        product: `prod_${priceId.split('_')[1]}`, // Extract product from price ID
                        recurring: {
                            interval: priceId.includes('yearly') ? 'year' : 'month',
                            interval_count: 1,
                        },
                    },
                },
            ],
        },
        current_period_start: now,
        current_period_end: now + (30 * 24 * 60 * 60), // 30 days from now
    };
}
/**
 * Create a test payment intent (successful)
 *
 * @param customerId - Stripe customer ID (optional)
 * @param amount - Amount in cents
 * @param status - Payment intent status
 * @returns Mock Stripe payment intent
 *
 * @example
 * const pi = createTestPaymentIntent(undefined, 9900, 'succeeded');
 * expect(pi.status).toBe('succeeded');
 */
function createTestPaymentIntent(customerId, amount = 9900, status = 'succeeded') {
    return {
        id: `pi_test_${Math.random().toString(36).substr(2, 9)}`,
        status,
        amount,
        currency: 'usd',
        customer: customerId,
        metadata: {
            test: 'true',
        },
    };
}
/**
 * Create a test charge (for webhook testing)
 *
 * @param customerId - Stripe customer ID (optional)
 * @param amount - Amount in cents
 * @param status - Charge status
 * @returns Mock Stripe charge
 *
 * @example
 * const charge = createTestCharge('cus_123', 9900, 'succeeded');
 * expect(charge.status).toBe('succeeded');
 */
function createTestCharge(customerId, amount = 9900, status = 'succeeded') {
    return {
        id: `ch_test_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency: 'usd',
        status,
        customer: customerId,
        payment_method: `pm_test_${Math.random().toString(36).substr(2, 9)}`,
        description: 'Test charge',
    };
}
/**
 * Test data scenarios for different payment situations
 */
exports.testScenarios = {
    /**
     * Successful payment scenario
     */
    successfulPayment: {
        customer: createTestCustomer('success@example.com', 'Success User'),
        paymentMethod: createTestPaymentMethod('visa', '4242'),
        charge: createTestCharge(undefined, 9900, 'succeeded'),
        description: 'Card succeeds',
    },
    /**
     * Failed payment scenario (card declined)
     */
    failedPayment: {
        customer: createTestCustomer('decline@example.com', 'Decline User'),
        paymentMethod: createTestPaymentMethod('visa', '0002'),
        charge: createTestCharge(undefined, 9900, 'failed'),
        description: 'Card is declined',
    },
    /**
     * Insufficient funds scenario
     */
    insufficientFunds: {
        customer: createTestCustomer('insufficient@example.com', 'Insufficient User'),
        paymentMethod: createTestPaymentMethod('visa', '0069'),
        charge: createTestCharge(undefined, 9900, 'failed'),
        description: 'Card has insufficient funds',
    },
    /**
     * Lost card scenario
     */
    lostCard: {
        customer: createTestCustomer('lost@example.com', 'Lost Card User'),
        paymentMethod: createTestPaymentMethod('visa', '0119'),
        charge: createTestCharge(undefined, 9900, 'failed'),
        description: 'Card reported lost',
    },
    /**
     * Subscription trial scenario
     */
    subscriptionTrial: {
        customer: createTestCustomer('trial@example.com', 'Trial User'),
        subscription: createTestSubscription('cus_test_trial', 'price_monthly', 'trialing'),
        description: 'Active subscription with trial period',
    },
    /**
     * Past due subscription scenario
     */
    pastDueSubscription: {
        customer: createTestCustomer('pastdue@example.com', 'Past Due User'),
        subscription: createTestSubscription('cus_test_pastdue', 'price_monthly', 'past_due'),
        description: 'Subscription with past due payment',
    },
    /**
     * Canceled subscription scenario
     */
    canceledSubscription: {
        customer: createTestCustomer('canceled@example.com', 'Canceled User'),
        subscription: createTestSubscription('cus_test_canceled', 'price_monthly', 'canceled'),
        description: 'Canceled subscription',
    },
};
/**
 * Stripe plan pricing configuration for tests
 */
exports.testPlans = {
    plusMonthly: {
        priceId: 'price_plus_monthly',
        productId: 'prod_plus',
        amount: 500, // $5.00
        interval: 'month',
        name: 'Ori Plus - Monthly',
    },
    plusYearly: {
        priceId: 'price_plus_yearly',
        productId: 'prod_plus',
        amount: 4800, // $48.00
        interval: 'year',
        name: 'Ori Plus - Yearly',
    },
    premiumMonthly: {
        priceId: 'price_premium_monthly',
        productId: 'prod_premium',
        amount: 1000, // $10.00
        interval: 'month',
        name: 'Ori Premium - Monthly',
    },
    premiumYearly: {
        priceId: 'price_premium_yearly',
        productId: 'prod_premium',
        amount: 9600, // $96.00
        interval: 'year',
        name: 'Ori Premium - Yearly',
    },
};
/**
 * Webhook event payloads for testing
 */
exports.testWebhookEvents = {
    /**
     * Checkout session completed event
     */
    checkoutSessionCompleted: (customerId, subscriptionId) => ({
        type: 'checkout.session.completed',
        data: {
            object: {
                id: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
                customer: customerId,
                subscription: subscriptionId,
                payment_status: 'paid',
            },
        },
    }),
    /**
     * Customer subscription created event
     */
    customerSubscriptionCreated: (customerId, subscriptionId) => ({
        type: 'customer.subscription.created',
        data: {
            object: {
                id: subscriptionId,
                customer: customerId,
                status: 'active',
                items: {
                    data: [
                        {
                            price: {
                                id: 'price_monthly',
                                recurring: {
                                    interval: 'month',
                                    interval_count: 1,
                                },
                            },
                        },
                    ],
                },
            },
        },
    }),
    /**
     * Customer subscription updated event (plan change)
     */
    customerSubscriptionUpdated: (customerId, subscriptionId, status) => ({
        type: 'customer.subscription.updated',
        data: {
            object: {
                id: subscriptionId,
                customer: customerId,
                status,
            },
        },
    }),
    /**
     * Customer subscription deleted event
     */
    customerSubscriptionDeleted: (customerId, subscriptionId) => ({
        type: 'customer.subscription.deleted',
        data: {
            object: {
                id: subscriptionId,
                customer: customerId,
                status: 'canceled',
            },
        },
    }),
    /**
     * Invoice payment succeeded event
     */
    invoicePaymentSucceeded: (customerId, invoiceId, subscriptionId) => ({
        type: 'invoice.payment_succeeded',
        data: {
            object: {
                id: invoiceId,
                customer: customerId,
                subscription: subscriptionId,
                paid: true,
                status: 'paid',
            },
        },
    }),
    /**
     * Invoice payment failed event
     */
    invoicePaymentFailed: (customerId, invoiceId, subscriptionId) => ({
        type: 'invoice.payment_failed',
        data: {
            object: {
                id: invoiceId,
                customer: customerId,
                subscription: subscriptionId,
                paid: false,
                status: 'open',
            },
        },
    }),
    /**
     * Customer source expiring event (payment method expiring soon)
     */
    customerSourceExpiring: (customerId) => ({
        type: 'customer.source.expiring',
        data: {
            object: {
                id: `card_test_${Math.random().toString(36).substr(2, 9)}`,
                customer: customerId,
                brand: 'Visa',
                last4: '4242',
                exp_month: 12,
                exp_year: new Date().getFullYear(),
            },
        },
    }),
};
/**
 * Helper to generate realistic user IDs for testing
 */
function generateTestUserId() {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Helper to generate realistic email addresses for testing
 */
function generateTestEmail() {
    const random = Math.random().toString(36).substr(2, 9);
    return `test_${random}@example.com`;
}
//# sourceMappingURL=stripe.fixtures.js.map