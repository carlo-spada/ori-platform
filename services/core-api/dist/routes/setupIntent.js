"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_js_1 = require("../middleware/validation.js");
const auth_js_1 = require("../middleware/auth.js");
const stripe_js_1 = require("../lib/stripe.js");
const stripeHelpers_js_1 = require("../lib/stripeHelpers.js");
const router = (0, express_1.Router)();
// Schema for creating setup intent
const createSetupIntentSchema = zod_1.z.object({
    planId: zod_1.z.enum([
        'plus_monthly',
        'plus_yearly',
        'premium_monthly',
        'premium_yearly',
    ]),
});
/**
 * POST /api/v1/setup-intent
 * Create a Stripe Setup Intent for collecting payment method details
 *
 * This endpoint is used for embedded payment flows with Stripe Elements.
 * It creates a Setup Intent that can be confirmed on the frontend with payment details.
 */
router.post('/', auth_js_1.authMiddleware, (0, validation_js_1.validateRequest)(createSetupIntentSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { planId } = req.body;
        const userId = req.user.id;
        // Get user email and ensure Stripe customer exists
        const userEmail = await (0, stripeHelpers_js_1.getUserEmail)(userId);
        const customerId = await (0, stripeHelpers_js_1.ensureStripeCustomer)(userId, userEmail);
        // Create Setup Intent
        const setupIntent = await stripe_js_1.stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
            metadata: {
                user_id: userId,
                plan_id: planId,
            },
        });
        return res.status(200).json({
            clientSecret: setupIntent.client_secret,
            setupIntentId: setupIntent.id,
        });
    }
    catch (error) {
        console.error('Error creating setup intent:', error);
        return res.status(500).json({ error: 'Failed to create setup intent' });
    }
});
exports.default = router;
//# sourceMappingURL=setupIntent.js.map