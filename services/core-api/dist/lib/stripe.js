"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_PLANS = exports.stripe = void 0;
exports.getPlanKeyFromStatus = getPlanKeyFromStatus;
exports.getStatusFromPriceId = getStatusFromPriceId;
const stripe_1 = __importDefault(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});
// Stripe Product and Price IDs (will be set programmatically)
exports.STRIPE_PLANS = {
    plus_monthly: {
        name: 'Ori Plus',
        price: 500, // $5.00 in cents
        interval: 'month',
        productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
        priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY_ID || '',
    },
    plus_yearly: {
        name: 'Ori Plus',
        price: 4800, // $48.00 in cents (20% discount)
        interval: 'year',
        productId: process.env.STRIPE_PRODUCT_PLUS_ID || '',
        priceId: process.env.STRIPE_PRICE_PLUS_YEARLY_ID || '',
    },
    premium_monthly: {
        name: 'Ori Premium',
        price: 1000, // $10.00 in cents
        interval: 'month',
        productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
        priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID || '',
    },
    premium_yearly: {
        name: 'Ori Premium',
        price: 9600, // $96.00 in cents (20% discount)
        interval: 'year',
        productId: process.env.STRIPE_PRODUCT_PREMIUM_ID || '',
        priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID || '',
    },
};
/**
 * Get plan key from subscription status
 */
function getPlanKeyFromStatus(status) {
    if (status === 'plus_monthly' ||
        status === 'plus_yearly' ||
        status === 'premium_monthly' ||
        status === 'premium_yearly') {
        return status;
    }
    return null;
}
/**
 * Get subscription status from Stripe price ID
 */
function getStatusFromPriceId(priceId) {
    for (const [key, plan] of Object.entries(exports.STRIPE_PLANS)) {
        if (plan.priceId === priceId) {
            return key;
        }
    }
    return 'free';
}
//# sourceMappingURL=stripe.js.map