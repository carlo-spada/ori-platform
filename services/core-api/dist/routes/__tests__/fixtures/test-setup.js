"use strict";
/**
 * Test Setup Utilities
 *
 * Provides utilities for setting up test environments, mocking dependencies,
 * and managing test database state.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTestHelpers = exports.testConfig = exports.testDatabaseFixtures = void 0;
exports.createMockSupabaseClient = createMockSupabaseClient;
exports.createMockAuthToken = createMockAuthToken;
exports.setupTestUser = setupTestUser;
exports.setupSubscribedTestUser = setupSubscribedTestUser;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.createTestWebhookSignature = createTestWebhookSignature;
const supabase_js_1 = require("@supabase/supabase-js");
/**
 * Mock Supabase client for testing
 * In real tests, this would connect to a test database or use mocked responses
 */
function createMockSupabaseClient() {
    // For now, create a mock client with test credentials
    // In a real scenario, you'd use a test database or mock all responses
    const mockUrl = process.env.SUPABASE_URL || 'https://test.supabase.co';
    const mockKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key';
    return (0, supabase_js_1.createClient)(mockUrl, mockKey);
}
/**
 * Test database fixtures for payment-related tables
 */
exports.testDatabaseFixtures = {
    /**
     * Create test user profile data
     */
    createUserProfile: (userId, overrides) => ({
        user_id: userId,
        full_name: 'Test User',
        email: 'test@example.com',
        headline: 'Test Headline',
        location: 'San Francisco',
        about: 'Test user for payment testing',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        subscription_status: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...overrides,
    }),
    /**
     * Create test user with Stripe subscription
     */
    createSubscribedUserProfile: (userId, stripeCustomerId, subscriptionId, tier) => ({
        user_id: userId,
        full_name: 'Subscribed User',
        email: 'subscriber@example.com',
        headline: 'Premium Member',
        location: 'San Francisco',
        about: 'Subscribed test user',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: tier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }),
    /**
     * Create notification record for testing
     */
    createNotification: (userId, overrides) => ({
        id: `notif_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...overrides,
    }),
};
/**
 * Mock Auth token for testing
 */
function createMockAuthToken(userId) {
    // In a real scenario, you'd create a proper JWT token
    // For now, return a mock token that the test can use
    return `Bearer mock_token_${userId}`;
}
/**
 * Test environment configuration
 */
exports.testConfig = {
    stripe: {
        apiKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_mock',
    },
    supabase: {
        url: process.env.SUPABASE_URL || 'https://test.supabase.co',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key',
    },
};
/**
 * Helper to setup test user with database state
 * Useful for integration tests that need actual database records
 */
async function setupTestUser(supabase, userId) {
    const userProfile = exports.testDatabaseFixtures.createUserProfile(userId);
    // In a real test, you'd insert this into the database
    // For now, return the fixture for use in mocked tests
    return {
        userId,
        profile: userProfile,
        async cleanup() {
            // In a real test, delete the user profile and related records
            // This is a placeholder for the actual cleanup logic
        },
    };
}
/**
 * Helper to setup test user with subscription
 */
async function setupSubscribedTestUser(supabase, userId, stripeCustomerId, subscriptionId, tier) {
    const userProfile = exports.testDatabaseFixtures.createSubscribedUserProfile(userId, stripeCustomerId, subscriptionId, tier);
    // In a real test, you'd insert this into the database
    return {
        userId,
        stripeCustomerId,
        subscriptionId,
        profile: userProfile,
        async cleanup() {
            // In a real test, delete the records
        },
    };
}
/**
 * Verify webhook signature (for testing webhook handlers)
 * This is a simplified version - use Stripe's library in production
 */
function verifyWebhookSignature(payload, signature, secret) {
    // In a real test, verify using Stripe's algorithm
    // For now, accept the signature if it's properly formatted
    return signature.startsWith('t=') && signature.includes(',v1=');
}
/**
 * Create valid webhook signature for testing
 * Note: This is for testing purposes only
 */
function createTestWebhookSignature(payload, secret) {
    // In a real scenario, use crypto to generate valid signature
    // For now, return a test signature format
    return `t=${Math.floor(Date.now() / 1000)},v1=test_signature_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Test helpers for payment-specific scenarios
 */
exports.paymentTestHelpers = {
    /**
     * Create a complete test scenario with customer, payment method, and subscription
     */
    createCompletePaymentScenario: async (supabase, userId) => {
        const customer = {
            id: `cus_test_${Math.random().toString(36).substr(2, 9)}`,
            email: `test_${userId}@example.com`,
            name: 'Test User',
        };
        const paymentMethod = {
            id: `pm_test_${Math.random().toString(36).substr(2, 9)}`,
            card: {
                brand: 'visa',
                last4: '4242',
                exp_month: 12,
                exp_year: 2025,
            },
        };
        const subscription = {
            id: `sub_test_${Math.random().toString(36).substr(2, 9)}`,
            customer: customer.id,
            status: 'active',
            items: {
                data: [
                    {
                        price: {
                            id: 'price_plus_monthly',
                            recurring: {
                                interval: 'month',
                                interval_count: 1,
                            },
                        },
                    },
                ],
            },
        };
        return {
            userId,
            customer,
            paymentMethod,
            subscription,
        };
    },
    /**
     * Simulate a payment processing flow
     */
    simulatePaymentFlow: async (supabase, customerId, amount, status = 'succeeded') => {
        // Simulate payment processing
        const paymentIntent = {
            id: `pi_test_${Math.random().toString(36).substr(2, 9)}`,
            status,
            amount,
            currency: 'usd',
            customer: customerId,
        };
        const charge = {
            id: `ch_test_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            status,
            customer: customerId,
        };
        return {
            paymentIntent,
            charge,
            success: status === 'succeeded',
        };
    },
};
//# sourceMappingURL=test-setup.js.map