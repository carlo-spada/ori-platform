/**
 * Resend Email Service
 *
 * Wrapper around Resend API for sending transactional and marketing emails.
 * Handles email template rendering, error handling, and notification tracking.
 */
/**
 * Resend API client configuration
 * Uses environment variable RESEND_API_KEY
 */
declare class ResendClient {
    private apiKey;
    private baseUrl;
    private fromEmail;
    private fromName;
    constructor();
    /**
     * Send email via Resend API
     */
    send(params: {
        to: string;
        subject: string;
        html: string;
        text?: string;
        replyTo?: string;
    }): Promise<{
        id: string;
        from: string;
        to: string;
        created_at: string;
    }>;
    /**
     * Mock send for testing/development
     */
    private mockSend;
}
export declare function getResendClient(): ResendClient;
/**
 * Email sending service
 * Higher-level API for sending specific email types
 */
export declare const emailService: {
    /**
     * Send welcome email
     */
    sendWelcome: (email: string, name: string) => Promise<{
        id: string;
    }>;
    /**
     * Send payment failure email
     */
    sendPaymentFailure: (email: string, name: string, amount: number, currency?: string) => Promise<{
        id: string;
    }>;
    /**
     * Send card expiring email
     */
    sendCardExpiring: (email: string, name: string, brand: string, lastFour: string, expiryMonth: number, expiryYear: number) => Promise<{
        id: string;
    }>;
    /**
     * Send trial ending email
     */
    sendTrialEnding: (email: string, name: string, daysRemaining: number, planName: string, price: number) => Promise<{
        id: string;
    }>;
    /**
     * Send subscription confirmation email
     */
    sendSubscriptionConfirmation: (email: string, name: string, planName: string, price: number, billingCycle: "monthly" | "yearly") => Promise<{
        id: string;
    }>;
    /**
     * Send recommendations email
     */
    sendRecommendations: (email: string, name: string, jobCount: number, topSkills: string[]) => Promise<{
        id: string;
    }>;
    /**
     * Send application status email
     */
    sendApplicationStatus: (email: string, name: string, jobTitle: string, company: string, status: "applied" | "reviewing" | "shortlisted" | "rejected" | "offer") => Promise<{
        id: string;
    }>;
};
/**
 * Welcome template
 */
export declare function generateWelcomeTemplate(name: string): string;
/**
 * Payment failure template
 */
export declare function generatePaymentFailureTemplate(name: string, amount: number, currency: string): string;
/**
 * Card expiring template
 */
export declare function generateCardExpiringTemplate(name: string, brand: string, lastFour: string, expiryMonth: number, expiryYear: number): string;
/**
 * Trial ending template
 */
export declare function generateTrialEndingTemplate(name: string, daysRemaining: number, planName: string, price: number): string;
/**
 * Subscription confirmation template
 */
export declare function generateSubscriptionConfirmationTemplate(name: string, planName: string, price: number, billingCycle: 'monthly' | 'yearly'): string;
/**
 * Recommendations template
 */
export declare function generateRecommendationsTemplate(name: string, jobCount: number, topSkills: string[]): string;
/**
 * Application status template
 */
export declare function generateApplicationStatusTemplate(name: string, jobTitle: string, company: string, status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'offer'): string;
export {};
//# sourceMappingURL=resend.d.ts.map