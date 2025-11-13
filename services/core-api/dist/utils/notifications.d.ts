import { SupabaseClient } from '@supabase/supabase-js';
export interface NotificationOptions {
    to: string;
    subject: string;
    message: string;
    type?: 'email' | 'in_app' | 'both';
}
/**
 * Send notification to user
 * This is a placeholder implementation that creates in-app notifications
 * For production, integrate with an email service like SendGrid, AWS SES, or Resend
 */
export declare function sendNotification(supabase: SupabaseClient, userId: string, options: NotificationOptions): Promise<void>;
/**
 * Send payment failure notification
 */
export declare function sendPaymentFailureNotification(supabase: SupabaseClient, customerId: string): Promise<void>;
/**
 * Send payment method expiring notification
 */
export declare function sendPaymentMethodExpiringNotification(supabase: SupabaseClient, customerId: string): Promise<void>;
//# sourceMappingURL=notifications.d.ts.map