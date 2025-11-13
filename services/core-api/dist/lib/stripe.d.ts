import Stripe from 'stripe';
export declare const stripe: Stripe;
export declare const STRIPE_PLANS: {
    plus_monthly: {
        name: string;
        price: number;
        interval: "month";
        productId: string;
        priceId: string;
    };
    plus_yearly: {
        name: string;
        price: number;
        interval: "year";
        productId: string;
        priceId: string;
    };
    premium_monthly: {
        name: string;
        price: number;
        interval: "month";
        productId: string;
        priceId: string;
    };
    premium_yearly: {
        name: string;
        price: number;
        interval: "year";
        productId: string;
        priceId: string;
    };
};
/**
 * Get plan key from subscription status
 */
export declare function getPlanKeyFromStatus(status: string): keyof typeof STRIPE_PLANS | null;
/**
 * Get subscription status from Stripe price ID
 */
export declare function getStatusFromPriceId(priceId: string): string;
//# sourceMappingURL=stripe.d.ts.map