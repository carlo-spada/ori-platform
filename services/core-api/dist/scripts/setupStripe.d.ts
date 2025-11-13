/**
 * Stripe Products and Prices Setup Script
 *
 * This script programmatically creates Stripe Products and Prices for the Ori Platform.
 * It is idempotent - running it multiple times will not create duplicates.
 *
 * Run with: npm run setup:stripe
 */
interface CreatedIds {
    STRIPE_PRODUCT_PLUS_ID: string;
    STRIPE_PRODUCT_PREMIUM_ID: string;
    STRIPE_PRICE_PLUS_MONTHLY_ID: string;
    STRIPE_PRICE_PLUS_YEARLY_ID: string;
    STRIPE_PRICE_PREMIUM_MONTHLY_ID: string;
    STRIPE_PRICE_PREMIUM_YEARLY_ID: string;
}
declare function setupStripeProductsAndPrices(): Promise<CreatedIds>;
export { setupStripeProductsAndPrices };
//# sourceMappingURL=setupStripe.d.ts.map