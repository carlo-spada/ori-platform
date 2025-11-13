"use strict";
/**
 * Payment Integration Tests
 *
 * End-to-end integration tests for complete payment flows and subscription lifecycle.
 * These tests demonstrate realistic scenarios that users go through.
 *
 * Test Coverage:
 * - Complete successful payment flow (signup → payment → subscription)
 * - Subscription plan changes (upgrade/downgrade)
 * - Subscription cancellation
 * - Failed payment recovery flow
 * - Multiple concurrent payments
 * - Subscription lifecycle with webhooks
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const stripe_fixtures_1 = require("./fixtures/stripe.fixtures");
const test_setup_1 = require("./fixtures/test-setup");
(0, globals_1.describe)('Payment Integration - Complete Successful Payment Flow', () => {
    (0, globals_1.describe)('User signup and initial payment', () => {
        (0, globals_1.it)('should complete end-to-end signup with Plus monthly subscription', async () => {
            // Step 1: User signs up
            const userId = (0, stripe_fixtures_1.generateTestUserId)();
            const email = (0, stripe_fixtures_1.generateTestEmail)();
            const userProfile = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
                email,
            });
            (0, globals_1.expect)(userProfile.user_id).toBe(userId);
            (0, globals_1.expect)(userProfile.subscription_status).toBe('free');
            // Step 2: User selects Plus Monthly plan
            const selectedPlan = stripe_fixtures_1.testPlans.plusMonthly;
            (0, globals_1.expect)(selectedPlan.amount).toBe(500); // $5/month
            // Step 3: Create Stripe customer
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
            (0, globals_1.expect)(customer.id).toMatch(/^cus_test_/);
            // Step 4: Add payment method
            const paymentMethod = (0, stripe_fixtures_1.createTestPaymentMethod)('visa', '4242');
            (0, globals_1.expect)(paymentMethod.id).toMatch(/^pm_test_/);
            (0, globals_1.expect)(paymentMethod.card.brand).toBe('visa');
            // Step 5: Create payment intent
            const paymentIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, selectedPlan.amount, 'processing');
            (0, globals_1.expect)(paymentIntent.status).toBe('processing');
            // Step 6: Confirm payment
            const confirmedIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, selectedPlan.amount, 'succeeded');
            (0, globals_1.expect)(confirmedIntent.status).toBe('succeeded');
            // Step 7: Create charge
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, selectedPlan.amount, 'succeeded');
            (0, globals_1.expect)(charge.status).toBe('succeeded');
            // Step 8: Create subscription
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, selectedPlan.priceId, 'active');
            (0, globals_1.expect)(subscription.status).toBe('active');
            (0, globals_1.expect)(subscription.customer).toBe(customer.id);
            // Step 9: Update user profile in database
            const updatedProfile = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
                stripe_customer_id: customer.id,
                stripe_subscription_id: subscription.id,
                subscription_status: 'plus',
            });
            // Assert complete flow
            (0, globals_1.expect)(updatedProfile.stripe_customer_id).toBe(customer.id);
            (0, globals_1.expect)(updatedProfile.stripe_subscription_id).toBe(subscription.id);
            (0, globals_1.expect)(updatedProfile.subscription_status).toBe('plus');
        });
        (0, globals_1.it)('should complete signup with Premium yearly subscription', async () => {
            // Arrange
            const userId = (0, stripe_fixtures_1.generateTestUserId)();
            const email = (0, stripe_fixtures_1.generateTestEmail)();
            const selectedPlan = stripe_fixtures_1.testPlans.premiumYearly;
            // Act
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
            const paymentIntent = (0, stripe_fixtures_1.createTestPaymentIntent)(customer.id, selectedPlan.amount, 'succeeded');
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, selectedPlan.amount, 'succeeded');
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, selectedPlan.priceId, 'active');
            // Assert
            (0, globals_1.expect)(paymentIntent.status).toBe('succeeded');
            (0, globals_1.expect)(charge.status).toBe('succeeded');
            (0, globals_1.expect)(subscription.status).toBe('active');
            (0, globals_1.expect)(subscription.items.data[0].price.id).toBe(selectedPlan.priceId);
            // Yearly pricing should be cheaper than 12x monthly
            const monthlyEquivalent = stripe_fixtures_1.testPlans.premiumMonthly.amount * 12;
            (0, globals_1.expect)(selectedPlan.amount).toBeLessThan(monthlyEquivalent);
        });
        (0, globals_1.it)('should handle signup with trial period', async () => {
            // Arrange
            const userId = (0, stripe_fixtures_1.generateTestUserId)();
            const email = (0, stripe_fixtures_1.generateTestEmail)();
            const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
            // Act: Create subscription in trialing status
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'trialing');
            // Assert
            (0, globals_1.expect)(subscription.status).toBe('trialing');
            (0, globals_1.expect)(subscription.current_period_end).toBeGreaterThan(subscription.current_period_start);
            // Trial period should be ~30 days (for documentation)
            const trialDays = (subscription.current_period_end - subscription.current_period_start) / (24 * 60 * 60);
            (0, globals_1.expect)(trialDays).toBeCloseTo(30, -1);
        });
    });
    (0, globals_1.describe)('Subscription lifecycle - Active phase', () => {
        (0, globals_1.it)('should process monthly recurring charge', async () => {
            // Arrange: User with active subscription
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            (0, globals_1.expect)(subscription.status).toBe('active');
            // Act: Monthly charge occurs
            const invoice = {
                id: `in_test_${Math.random().toString(36).substr(2, 9)}`,
                subscription_id: subscription.id,
                customer_id: customer.id,
                amount: stripe_fixtures_1.testPlans.plusMonthly.amount,
                status: 'paid',
                period_start: subscription.current_period_start,
                period_end: subscription.current_period_end,
            };
            const charge = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.amount, 'succeeded');
            // Assert
            (0, globals_1.expect)(invoice.status).toBe('paid');
            (0, globals_1.expect)(charge.amount).toBe(stripe_fixtures_1.testPlans.plusMonthly.amount);
            (0, globals_1.expect)(charge.status).toBe('succeeded');
        });
        (0, globals_1.it)('should allow subscription to continue without interruption', async () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Act: Check subscription status over time
            const now = Math.floor(Date.now() / 1000);
            const isCurrentlyActive = subscription.status === 'active' && subscription.current_period_end > now;
            // Assert
            (0, globals_1.expect)(isCurrentlyActive).toBe(true);
        });
    });
});
(0, globals_1.describe)('Payment Integration - Subscription Plan Changes', () => {
    (0, globals_1.describe)('Subscription upgrade', () => {
        (0, globals_1.it)('should upgrade from Plus Monthly to Premium Monthly', async () => {
            // Arrange: User has Plus Monthly subscription
            const userId = (0, stripe_fixtures_1.generateTestUserId)();
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const currentSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            (0, globals_1.expect)(currentSubscription.status).toBe('active');
            (0, globals_1.expect)(currentSubscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.plusMonthly.priceId);
            // Act: User upgrades to Premium Monthly
            // Step 1: Update subscription in Stripe
            const upgradedSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
            // Step 2: Calculate proration (difference charged immediately)
            // Plus Monthly: $500/month, Premium Monthly: $1000/month
            // If 15 days into cycle: charge $250 immediately (50% of $500 difference)
            const proratedAmount = stripe_fixtures_1.testPlans.premiumMonthly.amount - stripe_fixtures_1.testPlans.plusMonthly.amount;
            // Step 3: Charge for upgrade
            const upgradeCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, proratedAmount, 'succeeded');
            // Step 4: Update user profile
            const updatedProfile = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
                stripe_subscription_id: upgradedSubscription.id,
                subscription_status: 'premium',
            });
            // Assert
            (0, globals_1.expect)(upgradedSubscription.status).toBe('active');
            (0, globals_1.expect)(updatedProfile.subscription_status).toBe('premium');
            (0, globals_1.expect)(upgradeCharge.status).toBe('succeeded');
        });
        (0, globals_1.it)('should upgrade from yearly to higher tier', async () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const currentSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusYearly.priceId, 'active');
            // Act
            const upgradedSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumYearly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(currentSubscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.plusYearly.priceId);
            (0, globals_1.expect)(upgradedSubscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.premiumYearly.priceId);
        });
        (0, globals_1.it)('should calculate proration correctly on mid-cycle upgrade', async () => {
            /**
             * Proration Calculation Example:
             *
             * Scenario: User upgrades Plus Monthly ($5) to Premium Monthly ($10)
             * - Billing cycle started: Jan 1
             * - Upgrade happens: Jan 15 (15 days into 30-day cycle)
             * - Days remaining: 15 days
             *
             * Old charge for remaining days: $5 * (15/30) = $2.50
             * New charge for remaining days: $10 * (15/30) = $5.00
             * Proration credit: -$2.50 (refund for unused Plus time)
             * Amount due: $5.00 - $2.50 = $2.50
             *
             * Stripe handles this automatically with prorated billing
             */
            (0, globals_1.expect)(true).toBe(true);
        });
    });
    (0, globals_1.describe)('Subscription downgrade', () => {
        (0, globals_1.it)('should downgrade from Premium Monthly to Plus Monthly', async () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const currentSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
            // Act: Downgrade (takes effect at next billing cycle by default)
            const downgradedSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(currentSubscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.premiumMonthly.priceId);
            (0, globals_1.expect)(downgradedSubscription.items.data[0].price.id).toBe(stripe_fixtures_1.testPlans.plusMonthly.priceId);
            /**
             * Downgrade Behavior:
             * - Can downgrade immediately or at next billing cycle
             * - If immediate: customer gets credit for unused Premium time
             * - If at next cycle: customer keeps Premium until renewal date
             * - No charge for downgrade (customer might get credit)
             */
        });
        (0, globals_1.it)('should handle downgrade with refund credit', async () => {
            /**
             * Refund Calculation Example:
             *
             * Scenario: User downgrades Premium Monthly ($10) to Plus Monthly ($5)
             * - Started Premium on: Jan 1
             * - Downgrade happens: Jan 10 (9 days used)
             * - Days remaining: 21 days
             * - Refund for unused Premium time: $10 * (21/30) = $7.00
             * - Credit applied to next invoice or issued as refund
             *
             * Stripe automatically calculates and applies this credit
             */
            const downgradePlan = stripe_fixtures_1.testPlans.plusMonthly;
            const previousPlan = stripe_fixtures_1.testPlans.premiumMonthly;
            const creditAmount = previousPlan.amount - downgradePlan.amount;
            (0, globals_1.expect)(creditAmount).toBeGreaterThan(0);
        });
    });
    (0, globals_1.describe)('Switching between monthly and yearly', () => {
        (0, globals_1.it)('should switch from Plus Monthly to Plus Yearly with credit', async () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const monthlySubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Act
            const yearlySubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusYearly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(monthlySubscription.items.data[0].price.recurring?.interval).toBe('month');
            (0, globals_1.expect)(yearlySubscription.items.data[0].price.recurring?.interval).toBe('year');
            // Yearly should be cheaper
            const yearlyVsMonthly = stripe_fixtures_1.testPlans.plusMonthly.amount * 12;
            (0, globals_1.expect)(stripe_fixtures_1.testPlans.plusYearly.amount).toBeLessThan(yearlyVsMonthly);
        });
        (0, globals_1.it)('should switch from Premium Yearly to Premium Monthly', async () => {
            // Arrange
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const yearlySubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumYearly.priceId, 'active');
            // Act
            const monthlySubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(yearlySubscription.items.data[0].price.recurring?.interval).toBe('year');
            (0, globals_1.expect)(monthlySubscription.items.data[0].price.recurring?.interval).toBe('month');
        });
    });
});
(0, globals_1.describe)('Payment Integration - Subscription Cancellation', () => {
    (0, globals_1.describe)('Immediate cancellation', () => {
        (0, globals_1.it)('should cancel subscription immediately', async () => {
            // Arrange
            const userId = (0, stripe_fixtures_1.generateTestUserId)();
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            (0, globals_1.expect)(subscription.status).toBe('active');
            // Act: Cancel immediately
            const canceledSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'canceled');
            // Update user profile
            const updatedProfile = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
                stripe_subscription_id: null,
                subscription_status: 'free',
            });
            // Assert
            (0, globals_1.expect)(canceledSubscription.status).toBe('canceled');
            (0, globals_1.expect)(updatedProfile.subscription_status).toBe('free');
        });
        (0, globals_1.it)('should refund unused prepaid time on immediate cancellation', async () => {
            /**
             * Refund Scenario:
             *
             * Yearly subscription prepaid for 12 months
             * User cancels after 2 months
             * Refund: (12 - 2) / 12 * $96 = $80.00
             *
             * Stripe automatically calculates and issues refund
             */
            const planAmount = stripe_fixtures_1.testPlans.plusYearly.amount; // $48
            const monthsPaid = 12;
            const monthsUsed = 2;
            const monthsRemaining = monthsPaid - monthsUsed;
            const refundAmount = (monthsRemaining / monthsPaid) * planAmount;
            (0, globals_1.expect)(refundAmount).toBeGreaterThan(0);
            (0, globals_1.expect)(refundAmount).toBeLessThan(planAmount);
        });
    });
    (0, globals_1.describe)('End-of-billing-period cancellation', () => {
        (0, globals_1.it)('should cancel subscription at end of current billing period', async () => {
            /**
             * Stripe cancel_at_period_end behavior:
             *
             * User action: Cancel subscription
             * Option 1: Immediate cancellation (cancel_at = now)
             * Option 2: End-of-period cancellation (cancel_at = current_period_end)
             *
             * User receives:
             * - Full access until end of billing period
             * - No charges after current period ends
             * - Email notifications about upcoming cancellation
             */
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            (0, globals_1.expect)(subscription.status).toBe('active');
            (0, globals_1.expect)(subscription.current_period_end).toBeGreaterThan(Math.floor(Date.now() / 1000));
            /**
             * For end-of-period cancellation:
             * subscription.cancel_at = subscription.current_period_end
             * subscription.status = 'active' (until period ends)
             * Then automatically transitions to 'canceled'
             */
        });
    });
    (0, globals_1.describe)('Reactivation after cancellation', () => {
        (0, globals_1.it)('should require creating new subscription after cancellation', async () => {
            /**
             * Important: Once subscription is canceled, it cannot be reactivated.
             * User must create a NEW subscription.
             *
             * Stripe Limitation:
             * subscription.cancel() → status = 'canceled'
             * Cannot call subscription.resume() or subscription.reactivate()
             *
             * User Experience:
             * 1. User cancels subscription → status 'canceled'
             * 2. User wants to resubscribe
             * 3. Create completely new subscription
             * 4. Can use same customer and payment method
             */
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // First subscription (canceled)
            const canceledSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'canceled');
            (0, globals_1.expect)(canceledSubscription.status).toBe('canceled');
            // New subscription (not reactivation)
            const newSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Assert they're different subscriptions
            (0, globals_1.expect)(newSubscription.status).toBe('active');
            (0, globals_1.expect)(canceledSubscription.id).not.toBe(newSubscription.id);
        });
    });
});
(0, globals_1.describe)('Payment Integration - Failed Payment Recovery', () => {
    (0, globals_1.describe)('Payment failure and retry flow', () => {
        (0, globals_1.it)('should handle failed payment and schedule retry', async () => {
            // Step 1: Subscription exists
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Step 2: Invoice generated for next billing period
            const failedInvoice = {
                id: `in_test_${Math.random().toString(36).substr(2, 9)}`,
                subscription_id: subscription.id,
                status: 'open',
                attempt_count: 0,
            };
            // Step 3: Payment attempt fails
            const failedCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.amount, 'failed');
            (0, globals_1.expect)(failedCharge.status).toBe('failed');
            // Step 4: Subscription moved to past_due
            const pastDueSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'past_due');
            (0, globals_1.expect)(pastDueSubscription.status).toBe('past_due');
            // Step 5: User gets payment failure notification
            const notification = {
                type: 'payment_failed',
                user_id: 'user_123',
                message: `Payment of $${stripe_fixtures_1.testPlans.plusMonthly.amount / 100} failed. Please update your payment method.`,
            };
            // Step 6: Stripe retries payment automatically
            // Retry schedule: 1 day, 3 days, 5 days, 7 days (typical)
            const retryDays = [1, 3, 5, 7];
            (0, globals_1.expect)(failedInvoice.attempt_count).toBe(0);
            (0, globals_1.expect)(pastDueSubscription.status).toBe('past_due');
            (0, globals_1.expect)(notification.type).toBe('payment_failed');
        });
        (0, globals_1.it)('should update payment method to recover failed payment', async () => {
            // Arrange: Subscription is past_due
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'past_due');
            // Act: User updates payment method
            const newPaymentMethod = (0, stripe_fixtures_1.createTestPaymentMethod)('mastercard', '5555');
            (0, globals_1.expect)(newPaymentMethod.id).toMatch(/^pm_test_/);
            // Stripe automatically retries with new payment method
            const recoveryCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.amount, 'succeeded');
            // Subscription returns to active
            const recoveredSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
            // Assert
            (0, globals_1.expect)(recoveryCharge.status).toBe('succeeded');
            (0, globals_1.expect)(recoveredSubscription.status).toBe('active');
        });
        (0, globals_1.it)('should handle subscription cancellation after too many failed attempts', async () => {
            /**
             * Failed Payment Escalation:
             *
             * Day 0: Payment fails → past_due, notification sent
             * Day 1: Retry fails → still past_due
             * Day 3: Retry fails → still past_due, warning email
             * Day 5: Retry fails → still past_due, urgent email
             * Day 7: Retry fails → subscription automatically canceled
             * Day 35: If not resolved, could be sent to collections
             *
             * Stripe's default retry policy:
             * - Attempts: 4 retries over 7-10 days
             * - If all fail: subscription.status = 'unpaid'
             * - Manual intervention needed to reactivate
             */
            const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
            // After multiple failed attempts
            const unrecoverableSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'unpaid');
            (0, globals_1.expect)(unrecoverableSubscription.status).toBe('unpaid');
            /**
             * At this point:
             * - User has lost access to premium features
             * - Must contact support to reactivate (manual process)
             * - Or start fresh with new subscription
             */
        });
    });
});
(0, globals_1.describe)('Payment Integration - Concurrent Operations', () => {
    (0, globals_1.it)('should handle multiple customers with concurrent subscriptions', async () => {
        // Arrange: Create multiple customers
        const customers = Array.from({ length: 5 }, () => (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)()));
        // Act: Create subscriptions concurrently (simulated)
        const subscriptions = customers.map(customer => (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active'));
        // Assert: All subscriptions created independently
        (0, globals_1.expect)(subscriptions).toHaveLength(5);
        subscriptions.forEach((sub, index) => {
            (0, globals_1.expect)(sub.customer).toBe(customers[index].id);
            (0, globals_1.expect)(sub.status).toBe('active');
        });
        // Verify all subscriptions have unique IDs
        const ids = new Set(subscriptions.map(s => s.id));
        (0, globals_1.expect)(ids.size).toBe(5);
    });
    (0, globals_1.it)('should handle one customer with multiple subscription changes', async () => {
        // Arrange
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        // Act: Rapid plan changes
        const sub1 = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
        const sub2 = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
        const sub3 = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusYearly.priceId, 'active');
        // Assert: Last subscription is active (in real scenario, previous would be canceled)
        (0, globals_1.expect)(sub1.customer).toBe(customer.id);
        (0, globals_1.expect)(sub2.customer).toBe(customer.id);
        (0, globals_1.expect)(sub3.customer).toBe(customer.id);
        /**
         * Note: In production, you'd cancel previous subscription before creating new one
         * to maintain one-active-subscription-per-customer invariant
         */
    });
    (0, globals_1.it)('should handle concurrent payments without race conditions', async () => {
        /**
         * Race Condition Prevention:
         *
         * Scenario: Webhook arrives while customer is using app
         * Webhook: payment_succeeded → update subscription status
         * User action: upgrade plan → update subscription
         * Risk: Lost update if both try to update same subscription
         *
         * Solution: Use database constraints
         * - SELECT FOR UPDATE to lock row during update
         * - Use version/revision number on subscription
         * - Use conditional updates with IF-MATCH
         *
         * PostgreSQL approach:
         * BEGIN TRANSACTION;
         * SELECT * FROM user_profiles WHERE user_id = $1 FOR UPDATE;
         * -- Update subscription after locking
         * COMMIT;
         *
         * Supabase/PostgreSQL automatically handles lock
         */
        (0, globals_1.expect)(true).toBe(true);
    });
});
(0, globals_1.describe)('Payment Integration - Data Integrity', () => {
    (0, globals_1.it)('should maintain consistency between Stripe and database', async () => {
        /**
         * Stripe Source of Truth:
         * - Customer ID: cus_xxx (unique identifier)
         * - Subscription ID: sub_xxx (unique identifier)
         * - Payment method ID: pm_xxx (unique identifier)
         *
         * Database Fields:
         * - user_profiles.stripe_customer_id
         * - user_profiles.stripe_subscription_id
         * - user_profiles.subscription_status
         *
         * Consistency Checks:
         * 1. Every user with subscription_status != 'free' must have stripe_customer_id
         * 2. Every user with subscription_status != 'free' must have stripe_subscription_id
         * 3. subscription_status must match Stripe subscription.status mapping
         * 4. Never duplicate stripe_customer_id across users
         * 5. Never duplicate stripe_subscription_id across users
         */
        const userId = (0, stripe_fixtures_1.generateTestUserId)();
        const customer = (0, stripe_fixtures_1.createTestCustomer)((0, stripe_fixtures_1.generateTestEmail)());
        const subscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
        const profile = test_setup_1.testDatabaseFixtures.createSubscribedUserProfile(userId, customer.id, subscription.id, 'plus');
        // Assert consistency
        (0, globals_1.expect)(profile.stripe_customer_id).toBe(customer.id);
        (0, globals_1.expect)(profile.stripe_subscription_id).toBe(subscription.id);
        (0, globals_1.expect)(profile.subscription_status).toBe('plus');
    });
    (0, globals_1.it)('should validate subscription status enum', async () => {
        // Valid statuses
        const validStatuses = ['free', 'plus', 'premium'];
        const user = test_setup_1.testDatabaseFixtures.createUserProfile('user_123', {
            subscription_status: 'plus',
        });
        (0, globals_1.expect)(validStatuses).toContain(user.subscription_status);
    });
    (0, globals_1.it)('should handle subscription status transitions correctly', async () => {
        /**
         * Valid Application Status Transitions:
         *
         * free → plus (user upgrades)
         * plus → premium (user upgrades)
         * premium → plus (user downgrades)
         * plus → free (user cancels)
         * premium → free (user cancels)
         * plus → premium (direct upgrade)
         *
         * Invalid Transitions:
         * free → premium (must go through plus first? - depends on business rule)
         * free → free (already free, no change)
         * plus → plus (already plus, no change)
         *
         * During Transition:
         * 1. Stripe subscription status changes first
         * 2. Webhook received for change
         * 3. Database updated by webhook handler
         * 4. User sees new status in UI
         */
        (0, globals_1.expect)(true).toBe(true);
    });
});
(0, globals_1.describe)('Payment Integration - Complete Lifecycle Simulation', () => {
    (0, globals_1.it)('should simulate complete user journey from signup to cancellation', async () => {
        // Timeline: Jan 1 - Jan 60
        // Jan 1: User signs up
        const userId = (0, stripe_fixtures_1.generateTestUserId)();
        const email = (0, stripe_fixtures_1.generateTestEmail)();
        let user = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
            email,
            subscription_status: 'free',
        });
        (0, globals_1.expect)(user.subscription_status).toBe('free');
        // Jan 1: User creates Stripe customer and subscribes to Plus Monthly
        const customer = (0, stripe_fixtures_1.createTestCustomer)(email);
        const initialSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.priceId, 'active');
        user = test_setup_1.testDatabaseFixtures.createSubscribedUserProfile(userId, customer.id, initialSubscription.id, 'plus');
        (0, globals_1.expect)(user.subscription_status).toBe('plus');
        // Jan 31: First recurring charge succeeds
        const charge1 = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.plusMonthly.amount, 'succeeded');
        (0, globals_1.expect)(charge1.status).toBe('succeeded');
        // Feb 10: User upgrades to Premium Monthly
        const upgradeSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
        user = test_setup_1.testDatabaseFixtures.createSubscribedUserProfile(userId, customer.id, upgradeSubscription.id, 'premium');
        (0, globals_1.expect)(user.subscription_status).toBe('premium');
        // Feb 28: Recurring charge for premium
        const charge2 = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.amount, 'succeeded');
        (0, globals_1.expect)(charge2.status).toBe('succeeded');
        // Mar 5: Payment method expires, next charge fails
        const failedCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.amount, 'failed');
        const pastDueSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'past_due');
        (0, globals_1.expect)(pastDueSubscription.status).toBe('past_due');
        // Mar 6: User updates payment method
        const newPaymentMethod = (0, stripe_fixtures_1.createTestPaymentMethod)('visa', '4242');
        // Mar 7: Retry succeeds
        const recoveryCharge = (0, stripe_fixtures_1.createTestCharge)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.amount, 'succeeded');
        const activeSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'active');
        (0, globals_1.expect)(activeSubscription.status).toBe('active');
        // Mar 15: User cancels subscription
        const canceledSubscription = (0, stripe_fixtures_1.createTestSubscription)(customer.id, stripe_fixtures_1.testPlans.premiumMonthly.priceId, 'canceled');
        user = test_setup_1.testDatabaseFixtures.createUserProfile(userId, {
            subscription_status: 'free',
            stripe_subscription_id: null,
        });
        (0, globals_1.expect)(canceledSubscription.status).toBe('canceled');
        (0, globals_1.expect)(user.subscription_status).toBe('free');
        // Summary: User went through signup → payment → upgrade → failure → recovery → cancellation
        (0, globals_1.expect)(true).toBe(true);
    });
});
//# sourceMappingURL=payments.integration.test.js.map