import type { User, SubscriptionTier } from '@ori/types';
export declare const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier>;
export declare function hasReachedMatchLimit(user: User): boolean;
export declare function getRemainingMatches(user: User): number;
export declare function formatSalary(min?: number, max?: number): string;
export declare function calculateMatchScore(userSkills: string[], jobRequirements: string[]): number;
export declare function isValidEmail(email: string): boolean;
export declare function getInitials(name?: string): string;
export declare function formatRelativeDate(date: string | Date): string;
export declare function truncate(text: string, length: number): string;
export declare function generateId(): string;
//# sourceMappingURL=index.d.ts.map