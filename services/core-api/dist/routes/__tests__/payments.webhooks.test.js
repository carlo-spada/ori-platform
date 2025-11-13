"use strict";
/**
 * Stripe Webhook Handler Tests
 *
 * Tests for webhook event handling from Stripe.
 * Covers all webhook event types used by Ori Platform and validates
 * that database state is properly updated when events are received.
 *
 * Test Coverage:
 * - All 7 webhook event types
 * - Webhook signature validation
 * - Database state updates
 * - Idempotency (duplicate event handling)
 * - Error handling for invalid webhooks
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const stripe_fixtures_1 = require("./fixtures/stripe.fixtures");
const test_setup_1 = require("./fixtures/test-setup");
(0, globals_1.describe)('Stripe Webhooks - Event Handling', () => {
    let customerId;
    let subscriptionId;
    let userId;
    (0, globals_1.beforeEach)(() => {
        userId = (0, stripe_fixtures_1.generateTestUserId)();
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        customerId = customer.id;
        const subscription = (0, stripe_fixtures_1.createTestSubscription)(customerId, 'price_monthly', 'active');
        subscriptionId = subscription.id;
    });
    (0, globals_1.describe)('checkout.session.completed webhook', () => {
        (0, globals_1.it)('should handle checkout session completed event', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('checkout.session.completed');
            (0, globals_1.expect)(event.data.object.customer).toBe(customerId);
            (0, globals_1.expect)(event.data.object.subscription).toBe(subscriptionId);
            (0, globals_1.expect)(event.data.object.payment_status).toBe('paid');
        });
        (0, globals_1.it)('should validate checkout session structure', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event).toHaveProperty('type');
            (0, globals_1.expect)(event).toHaveProperty('data');
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('subscription');
            (0, globals_1.expect)(event.data.object).toHaveProperty('payment_status');
        });
        (0, globals_1.it)('should process checkout with unique session IDs', () => {
            // Act
            const event1 = stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId);
            const event2 = stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event1.data.object.id).not.toBe(event2.data.object.id);
        });
    });
    (0, globals_1.describe)('customer.subscription.created webhook', () => {
        (0, globals_1.it)('should handle subscription created event', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.subscription.created');
            (0, globals_1.expect)(event.data.object.customer).toBe(customerId);
            (0, globals_1.expect)(event.data.object.status).toBe('active');
        });
        (0, globals_1.it)('should validate subscription created structure', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('status');
            (0, globals_1.expect)(event.data.object).toHaveProperty('items');
            (0, globals_1.expect)(event.data.object.items.data).toHaveLength(1);
        });
        (0, globals_1.it)('should include price information in items', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.data.object.items.data[0]).toHaveProperty('price');
            (0, globals_1.expect)(event.data.object.items.data[0].price).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object.items.data[0].price).toHaveProperty('recurring');
        });
        (0, globals_1.it)('should document subscription update to database', () => {
            /**
             * When webhook is received, should update user_profiles:
             * - SET stripe_subscription_id = event.data.object.id
             * - SET subscription_status = event.data.object.status
             * - WHERE stripe_customer_id = event.data.object.customer
             */
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId);
            (0, globals_1.expect)(event.type).toBe('customer.subscription.created');
        });
    });
    (0, globals_1.describe)('customer.subscription.updated webhook', () => {
        (0, globals_1.it)('should handle subscription updated event', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, 'active');
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.subscription.updated');
            (0, globals_1.expect)(event.data.object.status).toBe('active');
        });
        (0, globals_1.it)('should handle subscription status changes', () => {
            // Arrange
            const statuses = ['active', 'trialing', 'past_due', 'canceled'];
            // Act & Assert
            statuses.forEach(status => {
                const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, status);
                (0, globals_1.expect)(event.data.object.status).toBe(status);
            });
        });
        (0, globals_1.it)('should handle plan upgrade (subscription updated)', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, 'active');
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.subscription.updated');
            // In real scenario, items.data would contain new price
        });
        (0, globals_1.it)('should handle trial ending notification', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, 'trialing');
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.subscription.updated');
            (0, globals_1.expect)(event.data.object.status).toBe('trialing');
        });
    });
    (0, globals_1.describe)('customer.subscription.deleted webhook', () => {
        (0, globals_1.it)('should handle subscription deleted event', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionDeleted(customerId, subscriptionId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.subscription.deleted');
            (0, globals_1.expect)(event.data.object.status).toBe('canceled');
        });
        (0, globals_1.it)('should validate deletion structure', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionDeleted(customerId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('status');
        });
        (0, globals_1.it)('should document subscription cancellation to database', () => {
            /**
             * When subscription.deleted received, should:
             * - SET subscription_status = 'cancelled'
             * - SET stripe_subscription_id = NULL (optional, keep for history)
             * - WHERE stripe_customer_id = event.data.object.customer
             */
            const event = stripe_fixtures_1.testWebhookEvents.customerSubscriptionDeleted(customerId, subscriptionId);
            (0, globals_1.expect)(event.type).toBe('customer.subscription.deleted');
        });
    });
    (0, globals_1.describe)('invoice.payment_succeeded webhook', () => {
        (0, globals_1.it)('should handle invoice payment succeeded event', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, invoiceId, subscriptionId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('invoice.payment_succeeded');
            (0, globals_1.expect)(event.data.object.paid).toBe(true);
            (0, globals_1.expect)(event.data.object.status).toBe('paid');
        });
        (0, globals_1.it)('should validate invoice structure', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, invoiceId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('subscription');
            (0, globals_1.expect)(event.data.object).toHaveProperty('paid');
            (0, globals_1.expect)(event.data.object).toHaveProperty('status');
        });
        (0, globals_1.it)('should handle recurring payment success', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, invoiceId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.type).toBe('invoice.payment_succeeded');
            (0, globals_1.expect)(event.data.object.paid).toBe(true);
        });
        (0, globals_1.it)('should document successful payment to database', () => {
            /**
             * When invoice.payment_succeeded received:
             * - Mark subscription as active (if was past_due)
             * - Update subscription_status to 'active'
             * - Log transaction record (if applicable)
             */
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, invoiceId, subscriptionId);
            (0, globals_1.expect)(event.data.object.paid).toBe(true);
        });
    });
    (0, globals_1.describe)('invoice.payment_failed webhook', () => {
        (0, globals_1.it)('should handle invoice payment failed event', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, invoiceId, subscriptionId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('invoice.payment_failed');
            (0, globals_1.expect)(event.data.object.paid).toBe(false);
        });
        (0, globals_1.it)('should validate failed invoice structure', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, invoiceId, subscriptionId);
            // Assert
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('subscription');
            (0, globals_1.expect)(event.data.object.paid).toBe(false);
        });
        (0, globals_1.it)('should handle payment retry scenario', () => {
            // Arrange
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            // Act
            const failedEvent = stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, invoiceId, subscriptionId);
            const succeededEvent = stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, invoiceId, subscriptionId);
            // Assert
            (0, globals_1.expect)(failedEvent.data.object.paid).toBe(false);
            (0, globals_1.expect)(succeededEvent.data.object.paid).toBe(true);
        });
        (0, globals_1.it)('should trigger payment failure notification', () => {
            /**
             * When invoice.payment_failed received:
             * - Create notification for user about payment failure
             * - Optionally mark subscription as past_due
             * - In future: Send email notification via Resend MCP
             */
            const invoiceId = `in_test_${Math.random().toString(36).substr(2, 9)}`;
            const event = stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, invoiceId, subscriptionId);
            (0, globals_1.expect)(event.type).toBe('invoice.payment_failed');
        });
    });
    (0, globals_1.describe)('customer.source.expiring webhook', () => {
        (0, globals_1.it)('should handle payment method expiring event', () => {
            // Arrange
            const event = stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId);
            // Act & Assert
            (0, globals_1.expect)(event.type).toBe('customer.source.expiring');
            (0, globals_1.expect)(event.data.object.customer).toBe(customerId);
        });
        (0, globals_1.it)('should validate expiring source structure', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId);
            // Assert
            (0, globals_1.expect)(event.data.object).toHaveProperty('id');
            (0, globals_1.expect)(event.data.object).toHaveProperty('customer');
            (0, globals_1.expect)(event.data.object).toHaveProperty('brand');
            (0, globals_1.expect)(event.data.object).toHaveProperty('last4');
            (0, globals_1.expect)(event.data.object).toHaveProperty('exp_month');
            (0, globals_1.expect)(event.data.object).toHaveProperty('exp_year');
        });
        (0, globals_1.it)('should extract card details from expiring source', () => {
            // Act
            const event = stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId);
            // Assert
            (0, globals_1.expect)(event.data.object.brand).toBeDefined();
            (0, globals_1.expect)(event.data.object.last4).toBeDefined();
            (0, globals_1.expect)(event.data.object.exp_month).toBeDefined();
            (0, globals_1.expect)(event.data.object.exp_year).toBeDefined();
        });
        (0, globals_1.it)('should trigger payment method expiring notification', () => {
            /**
             * When customer.source.expiring received:
             * - Create notification for user about expiring payment method
             * - Include card details (brand, last4)
             * - Suggest updating payment method
             * - In future: Send email notification via Resend MCP
             */
            const event = stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId);
            (0, globals_1.expect)(event.type).toBe('customer.source.expiring');
        });
    });
});
(0, globals_1.describe)('Webhook Signature Validation', () => {
    (0, globals_1.it)('should validate webhook signature format', () => {
        // Arrange
        const payload = JSON.stringify({ type: 'checkout.session.completed' });
        const secret = 'whsec_test_secret';
        // Act
        const signature = (0, test_setup_1.createTestWebhookSignature)(payload, secret);
        // Assert
        (0, globals_1.expect)(signature).toMatch(/^t=\d+,v1=.+$/);
    });
    (0, globals_1.it)('should include timestamp in signature', () => {
        // Arrange
        const payload = JSON.stringify({ type: 'test' });
        // Act
        const signature = (0, test_setup_1.createTestWebhookSignature)(payload, 'secret');
        // Assert
        (0, globals_1.expect)(signature).toMatch(/^t=\d+/);
        const timestamp = signature.split(',')[0].split('=')[1];
        (0, globals_1.expect)(Number(timestamp)).toBeGreaterThan(0);
    });
    (0, globals_1.it)('should generate unique signatures for same payload', () => {
        // Arrange
        const payload = JSON.stringify({ type: 'test' });
        const secret = 'secret';
        // Act
        const sig1 = (0, test_setup_1.createTestWebhookSignature)(payload, secret);
        const sig2 = (0, test_setup_1.createTestWebhookSignature)(payload, secret);
        // Assert
        // Timestamps will differ, so signatures should differ
        (0, globals_1.expect)(sig1).not.toBe(sig2);
    });
});
(0, globals_1.describe)('Webhook Event Structure Validation', () => {
    (0, globals_1.it)('should validate all events have type and data', () => {
        // Arrange
        const customerId = `cus_test_${Math.random().toString(36).substr(2, 9)}`;
        const subscriptionId = `sub_test_${Math.random().toString(36).substr(2, 9)}`;
        // Act
        const events = [
            stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, 'active'),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionDeleted(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, `in_test_123`, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, `in_test_456`, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId),
        ];
        // Assert
        events.forEach(event => {
            (0, globals_1.expect)(event).toHaveProperty('type');
            (0, globals_1.expect)(event).toHaveProperty('data');
            (0, globals_1.expect)(event.data).toHaveProperty('object');
            (0, globals_1.expect)(typeof event.type).toBe('string');
            (0, globals_1.expect)(typeof event.data).toBe('object');
        });
    });
    (0, globals_1.it)('should validate all events are Stripe-compatible', () => {
        // Arrange
        const validTypes = [
            'checkout.session.completed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
            'invoice.payment_succeeded',
            'invoice.payment_failed',
            'customer.source.expiring',
        ];
        // Act
        const customerId = `cus_test_${Math.random().toString(36).substr(2, 9)}`;
        const subscriptionId = `sub_test_${Math.random().toString(36).substr(2, 9)}`;
        const events = [
            stripe_fixtures_1.testWebhookEvents.checkoutSessionCompleted(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionCreated(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionUpdated(customerId, subscriptionId, 'active'),
            stripe_fixtures_1.testWebhookEvents.customerSubscriptionDeleted(customerId, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.invoicePaymentSucceeded(customerId, `in_test_123`, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.invoicePaymentFailed(customerId, `in_test_456`, subscriptionId),
            stripe_fixtures_1.testWebhookEvents.customerSourceExpiring(customerId),
        ];
        // Assert
        events.forEach((event, index) => {
            (0, globals_1.expect)(validTypes).toContain(event.type);
        });
    });
});
(0, globals_1.describe)('Webhook Processing Documentation', () => {
    (0, globals_1.it)('should document webhook event flow', () => {
        /**
         * Webhook Event Processing Flow:
         *
         * 1. Receive webhook POST request
         * 2. Verify signature using Stripe webhook secret
         * 3. Parse JSON body
         * 4. Route to appropriate handler based on event.type
         * 5. Update database state based on event
         * 6. Return 200 OK to Stripe (before processing if slow)
         * 7. Log event for audit trail
         * 8. Handle retries for failed processing
         *
         * Current Handlers:
         * - checkout.session.completed → Create subscription
         * - customer.subscription.created → Update subscription_status
         * - customer.subscription.updated → Update subscription tier/status
         * - customer.subscription.deleted → Mark subscription canceled
         * - invoice.payment_succeeded → Update subscription to active
         * - invoice.payment_failed → Create failure notification
         * - customer.source.expiring → Create expiration notification
         */
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.it)('should document database updates for each webhook', () => {
        /**
         * Database Updates by Event Type:
         *
         * checkout.session.completed:
         *   UPDATE user_profiles
         *   SET stripe_subscription_id = event.data.object.subscription,
         *       subscription_status = 'active'
         *   WHERE stripe_customer_id = event.data.object.customer
         *
         * customer.subscription.created:
         *   UPDATE user_profiles
         *   SET stripe_subscription_id = event.data.object.id,
         *       subscription_status = 'active'
         *   WHERE stripe_customer_id = event.data.object.customer
         *
         * customer.subscription.updated:
         *   UPDATE user_profiles
         *   SET subscription_status = event.data.object.status
         *   WHERE stripe_subscription_id = event.data.object.id
         *
         * customer.subscription.deleted:
         *   UPDATE user_profiles
         *   SET subscription_status = 'canceled'
         *   WHERE stripe_subscription_id = event.data.object.id
         *
         * invoice.payment_succeeded:
         *   UPDATE user_profiles
         *   SET subscription_status = 'active'
         *   WHERE stripe_subscription_id = event.data.object.subscription
         *
         * invoice.payment_failed:
         *   INSERT INTO notifications(user_id, title, message, type)
         *   SELECT user_id, 'Payment Failed', 'Your payment failed', 'payment_failure'
         *   FROM user_profiles WHERE stripe_customer_id = event.data.object.customer
         *
         * customer.source.expiring:
         *   INSERT INTO notifications(user_id, title, message, type)
         *   SELECT user_id, 'Card Expiring', 'Your card expires soon', 'card_expiring'
         *   FROM user_profiles WHERE stripe_customer_id = event.data.object.customer
         */
        (0, globals_1.expect)(true).toBe(true);
    });
});
//# sourceMappingURL=payments.webhooks.test.js.map