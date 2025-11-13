"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const auth_js_1 = require("../middleware/auth.js");
const stripe_js_1 = require("../lib/stripe.js");
const supabase_js_1 = require("../lib/supabase.js");
const stripeHelpers_js_1 = require("../lib/stripeHelpers.js");
const router = (0, express_1.Router)();
// Schema for creating subscription
const createSubscriptionSchema = zod_1.z.object({
    planId: zod_1.z.enum([
        'plus_monthly',
        'plus_yearly',
        'premium_monthly',
        'premium_yearly',
    ]),
    paymentMethodId: zod_1.z.string(),
});
/**
 * POST /api/v1/subscriptions
 * Create a new Stripe subscription with the provided payment method
 */
router.post('/', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(createSubscriptionSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { planId, paymentMethodId } = req.body;
        const userId = req.user.id;
        // Get plan configuration
        const planKey = (0, stripe_js_1.getPlanKeyFromStatus)(planId);
        if (!planKey) {
            return res.status(400).json({ error: 'Invalid plan ID' });
        }
        const plan = stripe_js_1.STRIPE_PLANS[planKey];
        if (!plan.priceId) {
            return res.status(500).json({
                error: 'Plan price ID not configured. Run setup:stripe script.',
            });
        }
        // Ensure Stripe customer exists
        const userEmail = await (0, stripeHelpers_js_1.getUserEmail)(userId);
        const customerId = await (0, stripeHelpers_js_1.ensureStripeCustomer)(userId, userEmail);
        // Attach payment method to customer
        await stripe_js_1.stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
        // Set as default payment method
        await stripe_js_1.stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        // Create subscription
        const subscription = await stripe_js_1.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: plan.priceId }],
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        });
        // Update user profile with subscription info
        await supabase_js_1.supabase
            .from('user_profiles')
            .update({
            stripe_subscription_id: subscription.id,
            subscription_status: planId,
        })
            .eq('user_id', userId);
        return res.status(200).json({
            subscriptionId: subscription.id,
            status: subscription.status,
        });
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(500).json({ error: 'Failed to create subscription' });
    }
});
exports.default = router;
//# sourceMappingURL=subscriptions.js.map