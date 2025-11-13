/**
 * Email Test Fixtures
 *
 * Provides test data factories for email notifications, templates, and preferences
 * without relying on Resend API. Uses mock data matching Resend response format.
 */
import { Notification, NotificationPreferences, NotificationType, NotificationStatus } from '@ori/types';
/**
 * Test notification data factory
 * Generates unique notifications for testing email sending
 */
export declare function createTestNotification(overrides?: Partial<Notification>): Notification;
/**
 * Test notification preferences factory
 */
export declare function createTestNotificationPreferences(userId?: string, overrides?: Partial<NotificationPreferences>): NotificationPreferences;
/**
 * Notification types and their corresponding email details
 */
export declare const notificationEmailMap: Record<NotificationType, {
    subject: string;
    template: string;
}>;
/**
 * Mock Resend email response
 */
export interface MockResendEmailResponse {
    id: string;
    from: string;
    to: string;
    created_at: string;
    subject: string;
}
/**
 * Create mock Resend email response
 */
export declare function createMockResendResponse(overrides?: Partial<MockResendEmailResponse>): MockResendEmailResponse;
/**
 * Test scenarios for notification flows
 */
export declare const notificationScenarios: {
    /**
     * Welcome email flow
     */
    welcomeEmail: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        name: string;
        preferences: NotificationPreferences;
    };
    /**
     * Payment failure flow
     */
    paymentFailure: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        stripeCustomerId: string;
        amount: number;
        currency: string;
        reason: string;
        preferences: NotificationPreferences;
    };
    /**
     * Card expiring flow
     */
    cardExpiring: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        cardBrand: string;
        cardLastFour: string;
        expiryMonth: number;
        expiryYear: number;
        preferences: NotificationPreferences;
    };
    /**
     * Trial ending flow
     */
    trialEnding: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        daysRemaining: number;
        planName: string;
        price: number;
        preferences: NotificationPreferences;
    };
    /**
     * Subscription confirmation flow
     */
    subscriptionConfirmation: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        planName: string;
        price: number;
        billingCycle: string;
        nextBillingDate: string;
        preferences: NotificationPreferences;
    };
    /**
     * Recommendations email flow
     */
    recommendations: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        jobCount: number;
        topSkills: string[];
        preferences: NotificationPreferences;
    };
    /**
     * Application status update flow
     */
    applicationStatus: {
        notificationType: NotificationType;
        userId: string;
        email: string;
        jobTitle: string;
        company: string;
        status: string;
        preferences: NotificationPreferences;
    };
};
/**
 * Email template test data
 */
export declare const emailTemplates: {
    /**
     * Welcome email template variables
     */
    welcome: {
        name: string;
        actionUrl: string;
        actionText: string;
    };
    /**
     * Payment failure template variables
     */
    payment_failure: {
        email: string;
        amount: string;
        currency: string;
        reason: string;
        actionUrl: string;
        actionText: string;
    };
    /**
     * Card expiring template variables
     */
    card_expiring: {
        cardBrand: string;
        lastFour: string;
        expiryDate: string;
        actionUrl: string;
        actionText: string;
    };
    /**
     * Trial ending template variables
     */
    trial_ending: {
        name: string;
        daysRemaining: number;
        planName: string;
        price: string;
        actionUrl: string;
        actionText: string;
    };
    /**
     * Subscription confirmation template variables
     */
    subscription_confirmation: {
        name: string;
        planName: string;
        price: string;
        billingCycle: string;
        nextBillingDate: string;
        dashboardUrl: string;
    };
    /**
     * Recommendations template variables
     */
    recommendations: {
        name: string;
        recommendationCount: number;
        topSkills: string[];
        actionUrl: string;
        actionText: string;
    };
    /**
     * Application status template variables
     */
    application_status: {
        jobTitle: string;
        company: string;
        status: string;
        statusColor: string;
        actionUrl: string;
        actionText: string;
    };
};
/**
 * Helper function to generate email HTML (mock)
 */
export declare function generateEmailHTML(type: NotificationType, variables: Record<string, unknown>): string;
/**
 * Helper to generate unsubscribe link
 */
export declare function generateUnsubscribeLink(token: string): string;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Mock database fixtures for testing
 */
export declare const notificationDatabaseFixtures: {
    /**
     * Create test notification record
     */
    createNotificationRecord: (userId: string, type: NotificationType, status?: NotificationStatus) => Notification;
    /**
     * Create test preference record
     */
    createPreferenceRecord: (userId: string) => NotificationPreferences;
    /**
     * Simulate notification history
     */
    createNotificationHistory: (userId: string, count?: number) => Notification[];
};
//# sourceMappingURL=email.fixtures.d.ts.map