"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = sendNotification;
exports.sendPaymentFailureNotification = sendPaymentFailureNotification;
exports.sendPaymentMethodExpiringNotification = sendPaymentMethodExpiringNotification;
/**
 * Send notification to user
 * This is a placeholder implementation that creates in-app notifications
 * For production, integrate with an email service like SendGrid, AWS SES, or Resend
 */
async function sendNotification(supabase, userId, options) {
    try {
        // Create in-app notification
        const { error } = await supabase.from('notifications').insert({
            user_id: userId,
            title: options.subject,
            message: options.message,
            type: 'payment_alert',
            read: false,
            created_at: new Date().toISOString(),
        });
        if (error) {
            console.error('Failed to create notification:', error);
        }
        // For production, add email sending here
        // Example with SendGrid:
        // await sendgrid.send({
        //   to: options.to,
        //   from: process.env.SENDGRID_FROM_EMAIL,
        //   subject: options.subject,
        //   text: options.message,
        //   html: `<p>${options.message}</p>`,
        // })
        console.log(`📧 Notification sent to ${options.to}: ${options.subject}`);
    }
    catch (error) {
        console.error('Error sending notification:', error);
    }
}
/**
 * Send payment failure notification
 */
async function sendPaymentFailureNotification(supabase, customerId) {
    // Get user details
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .eq('stripe_customer_id', customerId)
        .single();
    if (!profile) {
        console.error(`User profile not found for customer ${customerId}`);
        return;
    }
    // Get user email from auth
    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email) {
        console.error(`User email not found for user ${profile.user_id}`);
        return;
    }
    await sendNotification(supabase, profile.user_id, {
        to: user.email,
        subject: 'Payment Failed - Action Required',
        message: `Hello ${profile.full_name || 'there'},\n\nWe were unable to process your recent payment. Please update your payment method to continue enjoying our services.\n\nYou can update your payment information in your account settings.\n\nThank you,\nThe Ori Team`,
        type: 'both',
    });
}
/**
 * Send payment method expiring notification
 */
async function sendPaymentMethodExpiringNotification(supabase, customerId) {
    // Get user details
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .eq('stripe_customer_id', customerId)
        .single();
    if (!profile) {
        console.error(`User profile not found for customer ${customerId}`);
        return;
    }
    // Get user email from auth
    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email) {
        console.error(`User email not found for user ${profile.user_id}`);
        return;
    }
    await sendNotification(supabase, profile.user_id, {
        to: user.email,
        subject: 'Payment Method Expiring Soon',
        message: `Hello ${profile.full_name || 'there'},\n\nYour payment method on file is expiring soon. To avoid any interruption in service, please update your payment information.\n\nYou can update your payment details in your account settings.\n\nThank you,\nThe Ori Team`,
        type: 'both',
    });
}
//# sourceMappingURL=notifications.js.map