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
/**
 * Mock Stripe test data factory
 * In real tests, these would be created via Stripe MCP
 * For now, provides realistic mock data structure
 */
export interface StripeTestCustomer {
    id: string;
    email: string;
    name?: string;
    description?: string;
    metadata?: Record<string, string>;
}
export interface StripeTestPaymentMethod {
    id: string;
    type: 'card';
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}
export interface StripeTestSubscription {
    id: string;
    customer: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
    items: {
        data: Array<{
            id: string;
            price: {
                id: string;
                product: string;
                recurring: {
                    interval: 'month' | 'year';
                    interval_count: number;
                };
            };
        }>;
    };
    current_period_start: number;
    current_period_end: number;
    cancel_at?: number;
}
export interface StripeTestPaymentIntent {
    id: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
    amount: number;
    currency: string;
    customer?: string;
    metadata?: Record<string, string>;
}
export interface StripeTestCharge {
    id: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'failed' | 'pending';
    customer?: string;
    payment_method?: string;
    description?: string;
}
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
export declare function createTestCustomer(email: string, name?: string, metadata?: Record<string, string>): StripeTestCustomer;
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
export declare function createTestPaymentMethod(brand?: string, last4?: string, expiryMonth?: number, expiryYear?: number): StripeTestPaymentMethod;
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
export declare function createTestSubscription(customerId: string, priceId: string, status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'): StripeTestSubscription;
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
export declare function createTestPaymentIntent(customerId: string | undefined, amount?: number, status?: StripeTestPaymentIntent['status']): StripeTestPaymentIntent;
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
export declare function createTestCharge(customerId: string | undefined, amount?: number, status?: 'succeeded' | 'failed' | 'pending'): StripeTestCharge;
/**
 * Test data scenarios for different payment situations
 */
export declare const testScenarios: {
    /**
     * Successful payment scenario
     */
    successfulPayment: {
        customer: StripeTestCustomer;
        paymentMethod: StripeTestPaymentMethod;
        charge: StripeTestCharge;
        description: string;
    };
    /**
     * Failed payment scenario (card declined)
     */
    failedPayment: {
        customer: StripeTestCustomer;
        paymentMethod: StripeTestPaymentMethod;
        charge: StripeTestCharge;
        description: string;
    };
    /**
     * Insufficient funds scenario
     */
    insufficientFunds: {
        customer: StripeTestCustomer;
        paymentMethod: StripeTestPaymentMethod;
        charge: StripeTestCharge;
        description: string;
    };
    /**
     * Lost card scenario
     */
    lostCard: {
        customer: StripeTestCustomer;
        paymentMethod: StripeTestPaymentMethod;
        charge: StripeTestCharge;
        description: string;
    };
    /**
     * Subscription trial scenario
     */
    subscriptionTrial: {
        customer: StripeTestCustomer;
        subscription: StripeTestSubscription;
        description: string;
    };
    /**
     * Past due subscription scenario
     */
    pastDueSubscription: {
        customer: StripeTestCustomer;
        subscription: StripeTestSubscription;
        description: string;
    };
    /**
     * Canceled subscription scenario
     */
    canceledSubscription: {
        customer: StripeTestCustomer;
        subscription: StripeTestSubscription;
        description: string;
    };
};
/**
 * Stripe plan pricing configuration for tests
 */
export declare const testPlans: {
    plusMonthly: {
        priceId: string;
        productId: string;
        amount: number;
        interval: string;
        name: string;
    };
    plusYearly: {
        priceId: string;
        productId: string;
        amount: number;
        interval: string;
        name: string;
    };
    premiumMonthly: {
        priceId: string;
        productId: string;
        amount: number;
        interval: string;
        name: string;
    };
    premiumYearly: {
        priceId: string;
        productId: string;
        amount: number;
        interval: string;
        name: string;
    };
};
/**
 * Webhook event payloads for testing
 */
export declare const testWebhookEvents: {
    /**
     * Checkout session completed event
     */
    checkoutSessionCompleted: (customerId: string, subscriptionId: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                subscription: string;
                payment_status: string;
            };
        };
    };
    /**
     * Customer subscription created event
     */
    customerSubscriptionCreated: (customerId: string, subscriptionId: string) => {
        type: string;
        data: {
            object: {
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
        };
    };
    /**
     * Customer subscription updated event (plan change)
     */
    customerSubscriptionUpdated: (customerId: string, subscriptionId: string, status: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                status: string;
            };
        };
    };
    /**
     * Customer subscription deleted event
     */
    customerSubscriptionDeleted: (customerId: string, subscriptionId: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                status: string;
            };
        };
    };
    /**
     * Invoice payment succeeded event
     */
    invoicePaymentSucceeded: (customerId: string, invoiceId: string, subscriptionId: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                subscription: string;
                paid: boolean;
                status: string;
            };
        };
    };
    /**
     * Invoice payment failed event
     */
    invoicePaymentFailed: (customerId: string, invoiceId: string, subscriptionId: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                subscription: string;
                paid: boolean;
                status: string;
            };
        };
    };
    /**
     * Customer source expiring event (payment method expiring soon)
     */
    customerSourceExpiring: (customerId: string) => {
        type: string;
        data: {
            object: {
                id: string;
                customer: string;
                brand: string;
                last4: string;
                exp_month: number;
                exp_year: number;
            };
        };
    };
};
/**
 * Helper to generate realistic user IDs for testing
 */
export declare function generateTestUserId(): string;
/**
 * Helper to generate realistic email addresses for testing
 */
export declare function generateTestEmail(): string;
//# sourceMappingURL=stripe.fixtures.d.ts.map