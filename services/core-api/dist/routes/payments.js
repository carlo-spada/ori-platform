"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhookRoutes = exports.paymentRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const auth_js_1 = require("../middleware/auth.js");
const supabase_js_1 = require("../lib/supabase.js");
const stripe_js_1 = require("../lib/stripe.js");
const notifications_js_1 = require("../utils/notifications.js");
const paymentRoutes = (0, express_1.Router)();
exports.paymentRoutes = paymentRoutes;
const paymentWebhookRoutes = (0, express_1.Router)();
exports.paymentWebhookRoutes = paymentWebhookRoutes;
// Schema for checkout session
const createCheckoutSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    priceId: zod_1.z.string(),
    successUrl: zod_1.z.string().url(),
    cancelUrl: zod_1.z.string().url(),
});
// POST /api/payments/checkout - Create Stripe checkout session
paymentRoutes.post('/checkout', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(createCheckoutSchema), async (req, res, next) => {
    try {
        const { userId, priceId, successUrl, cancelUrl } = req.body;
        // Validate user can only create checkout for themselves
        if (req.user?.id !== userId) {
            return res
                .status(403)
                .json({ error: 'Forbidden - Can only create checkout for yourself' });
        }
        // Get user from database
        const { data: user, error: userError } = await supabase_js_1.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (userError)
            throw userError;
        // Create or get Stripe customer
        let customerId = user.stripe_customer_id;
        if (!customerId) {
            const customer = await stripe_js_1.stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });
            customerId = customer.id;
            // Save customer ID to database
            await supabase_js_1.supabase
                .from('users')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }
        // Create checkout session
        const session = await stripe_js_1.stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId,
            },
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        return next(error);
    }
});
// POST /api/payments/portal - Create customer portal session
paymentRoutes.post('/portal', auth_js_1.authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.body;
        // Validate user can only access their own portal
        if (req.user?.id !== userId) {
            return res
                .status(403)
                .json({ error: 'Forbidden - Can only access your own portal' });
        }
        // Get user's Stripe customer ID
        const { data: user, error: userError } = await supabase_js_1.supabase
            .from('users')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();
        if (userError)
            throw userError;
        if (!user.stripe_customer_id) {
            return res.status(400).json({ error: 'No subscription found' });
        }
        // Create portal session
        const session = await stripe_js_1.stripe.billingPortal.sessions.create({
            customer: user.stripe_customer_id,
            return_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        return next(error);
    }
});
/**
 * POST /api/payments/webhook - Handle Stripe webhooks
 *
 * IMPORTANT: No auth middleware - validates Stripe signature instead
 * Raw body middleware applied in index.ts (required for signature verification)
 *
 * Handles subscription lifecycle events from Stripe
 */
paymentWebhookRoutes.post('/', async (req, res, next) => {
    try {
        const sig = req.headers['stripe-signature'];
        if (!sig) {
            console.error('No Stripe signature found in request headers');
            return res.status(400).json({ error: 'Missing Stripe signature' });
        }
        // Verify webhook signature
        let event;
        try {
            event = stripe_js_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Webhook signature verification failed:', message);
            return res.status(400).json({ error: 'Invalid signature' });
        }
        console.log(`Received webhook event: ${event.type}`);
        // Handle the event
        switch (event.type) {
            // Checkout session completed (initial subscription creation)
            case 'checkout.session.completed': {
                const session = event.data.object;
                const customerId = session.customer;
                const subscriptionId = session.subscription;
                console.log(`Checkout completed for customer ${customerId}`);
                // Get subscription details to extract price ID
                const subscription = await stripe_js_1.stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price.id;
                const subscriptionStatus = (0, stripe_js_1.getStatusFromPriceId)(priceId);
                await supabase_js_1.supabase
                    .from('user_profiles')
                    .update({
                    stripe_subscription_id: subscriptionId,
                    subscription_status: subscriptionStatus,
                })
                    .eq('stripe_customer_id', customerId);
                console.log(`✅ Updated subscription for customer ${customerId}: ${subscriptionStatus}`);
                break;
            }
            // Subscription created
            case 'customer.subscription.created': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const subscriptionId = subscription.id;
                const priceId = subscription.items.data[0]?.price.id;
                const subscriptionStatus = (0, stripe_js_1.getStatusFromPriceId)(priceId);
                await supabase_js_1.supabase
                    .from('user_profiles')
                    .update({
                    stripe_subscription_id: subscriptionId,
                    subscription_status: subscriptionStatus,
                })
                    .eq('stripe_customer_id', customerId);
                console.log(`✅ Subscription created for customer ${customerId}: ${subscriptionStatus}`);
                break;
            }
            // Subscription updated (plan change, trial ending, etc.)
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const priceId = subscription.items.data[0]?.price.id;
                let subscriptionStatus = (0, stripe_js_1.getStatusFromPriceId)(priceId);
                // Handle subscription status changes
                if (subscription.status === 'past_due') {
                    subscriptionStatus = 'past_due';
                }
                else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
                    subscriptionStatus = 'cancelled';
                }
                await supabase_js_1.supabase
                    .from('user_profiles')
                    .update({
                    subscription_status: subscriptionStatus,
                })
                    .eq('stripe_customer_id', customerId);
                console.log(`✅ Subscription updated for customer ${customerId}: ${subscriptionStatus}`);
                break;
            }
            // Subscription deleted/cancelled
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                await supabase_js_1.supabase
                    .from('user_profiles')
                    .update({
                    stripe_subscription_id: null,
                    subscription_status: 'cancelled',
                })
                    .eq('stripe_customer_id', customerId);
                console.log(`✅ Subscription deleted for customer ${customerId}`);
                break;
            }
            // Successful recurring payment
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                console.log(`✅ Payment succeeded for customer ${customerId}`);
                // Subscription status should already be updated by subscription.updated event
                // But we can log this for analytics/monitoring
                break;
            }
            // Failed recurring payment
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                await supabase_js_1.supabase
                    .from('user_profiles')
                    .update({
                    subscription_status: 'past_due',
                })
                    .eq('stripe_customer_id', customerId);
                console.log(`⚠️  Payment failed for customer ${customerId} - marked as past_due`);
                // Send notification to user to update payment method
                await (0, notifications_js_1.sendPaymentFailureNotification)(supabase_js_1.supabase, customerId);
                break;
            }
            // Payment method expiring soon
            case 'customer.source.expiring': {
                const source = event.data.object;
                const customerId = source.customer;
                console.log(`⚠️  Payment method expiring soon for customer ${customerId}`);
                // Send notification to user to update payment method
                await (0, notifications_js_1.sendPaymentMethodExpiringNotification)(supabase_js_1.supabase, customerId);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        return res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook handling error:', error);
        return next(error);
    }
});
//# sourceMappingURL=payments.js.map