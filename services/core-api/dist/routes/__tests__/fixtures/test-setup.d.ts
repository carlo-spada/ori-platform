/**
 * Test Setup Utilities
 *
 * Provides utilities for setting up test environments, mocking dependencies,
 * and managing test database state.
 */
import { SupabaseClient } from '@supabase/supabase-js';
/**
 * Mock Supabase client for testing
 * In real tests, this would connect to a test database or use mocked responses
 */
export declare function createMockSupabaseClient(): SupabaseClient;
/**
 * Test database fixtures for payment-related tables
 */
export declare const testDatabaseFixtures: {
    /**
     * Create test user profile data
     */
    createUserProfile: (userId: string, overrides?: Record<string, unknown>) => {
        user_id: string;
        full_name: string;
        email: string;
        headline: string;
        location: string;
        about: string;
        stripe_customer_id: null;
        stripe_subscription_id: null;
        subscription_status: string;
        created_at: string;
        updated_at: string;
    };
    /**
     * Create test user with Stripe subscription
     */
    createSubscribedUserProfile: (userId: string, stripeCustomerId: string, subscriptionId: string, tier: string) => {
        user_id: string;
        full_name: string;
        email: string;
        headline: string;
        location: string;
        about: string;
        stripe_customer_id: string;
        stripe_subscription_id: string;
        subscription_status: string;
        created_at: string;
        updated_at: string;
    };
    /**
     * Create notification record for testing
     */
    createNotification: (userId: string, overrides?: Record<string, unknown>) => {
        id: string;
        user_id: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        created_at: string;
        updated_at: string;
    };
};
/**
 * Mock Auth token for testing
 */
export declare function createMockAuthToken(userId: string): string;
/**
 * Test environment configuration
 */
export declare const testConfig: {
    stripe: {
        apiKey: string;
        webhookSecret: string;
    };
    supabase: {
        url: string;
        serviceRoleKey: string;
    };
};
/**
 * Helper to setup test user with database state
 * Useful for integration tests that need actual database records
 */
export declare function setupTestUser(supabase: SupabaseClient, userId: string): Promise<{
    userId: string;
    profile: {
        user_id: string;
        full_name: string;
        email: string;
        headline: string;
        location: string;
        about: string;
        stripe_customer_id: null;
        stripe_subscription_id: null;
        subscription_status: string;
        created_at: string;
        updated_at: string;
    };
    cleanup(): Promise<void>;
}>;
/**
 * Helper to setup test user with subscription
 */
export declare function setupSubscribedTestUser(supabase: SupabaseClient, userId: string, stripeCustomerId: string, subscriptionId: string, tier: string): Promise<{
    userId: string;
    stripeCustomerId: string;
    subscriptionId: string;
    profile: {
        user_id: string;
        full_name: string;
        email: string;
        headline: string;
        location: string;
        about: string;
        stripe_customer_id: string;
        stripe_subscription_id: string;
        subscription_status: string;
        created_at: string;
        updated_at: string;
    };
    cleanup(): Promise<void>;
}>;
/**
 * Verify webhook signature (for testing webhook handlers)
 * This is a simplified version - use Stripe's library in production
 */
export declare function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
/**
 * Create valid webhook signature for testing
 * Note: This is for testing purposes only
 */
export declare function createTestWebhookSignature(payload: string, secret: string): string;
/**
 * Test helpers for payment-specific scenarios
 */
export declare const paymentTestHelpers: {
    /**
     * Create a complete test scenario with customer, payment method, and subscription
     */
    createCompletePaymentScenario: (supabase: SupabaseClient, userId: string) => Promise<{
        userId: string;
        customer: {
            id: string;
            email: string;
            name: string;
        };
        paymentMethod: {
            id: string;
            card: {
                brand: string;
                last4: string;
                exp_month: number;
                exp_year: number;
            };
        };
        subscription: {
            id: string;
            customer: string;
            status: string;
            items: {
                data: {
                    price: {
                        id: string;
                        recurring: {
                            interval: string;
                            interval_count: number;
                        };
                    };
                }[];
            };
        };
    }>;
    /**
     * Simulate a payment processing flow
     */
    simulatePaymentFlow: (supabase: SupabaseClient, customerId: string, amount: number, status?: "succeeded" | "failed") => Promise<{
        paymentIntent: {
            id: string;
            status: "failed" | "succeeded";
            amount: number;
            currency: string;
            customer: string;
        };
        charge: {
            id: string;
            amount: number;
            status: "failed" | "succeeded";
            customer: string;
        };
        success: boolean;
    }>;
};
//# sourceMappingURL=test-setup.d.ts.map