/**
 * Ensure user has a Stripe customer ID
 * Creates a new customer if one doesn't exist
 *
 * @param userId - Supabase user ID
 * @param email - User's email address
 * @param fullName - Optional user's full name
 * @returns Stripe customer ID
 */
export declare function ensureStripeCustomer(userId: string, email: string, fullName?: string): Promise<string>;
/**
 * Get user's email from Supabase Auth
 *
 * @param userId - Supabase user ID
 * @returns User's email address
 */
export declare function getUserEmail(userId: string): Promise<string>;
//# sourceMappingURL=stripeHelpers.d.ts.map