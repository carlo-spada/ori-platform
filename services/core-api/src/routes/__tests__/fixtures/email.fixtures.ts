/**
 * Email Test Fixtures
 *
 * Provides test data factories for email notifications, templates, and preferences
 * without relying on Resend API. Uses mock data matching Resend response format.
 */

import {
  Notification,
  NotificationPreferences,
  NotificationType,
  NotificationStatus,
} from '@ori/types'

/**
 * Test notification data factory
 * Generates unique notifications for testing email sending
 */
export function createTestNotification(
  overrides?: Partial<Notification>,
): Notification {
  const timestamp = new Date().toISOString()
  const randomId = Math.random().toString(36).substr(2, 9)

  return {
    id: `notif_test_${randomId}`,
    user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
    type: 'welcome' as NotificationType,
    subject: 'Welcome to Ori',
    recipient_email: `user_${randomId}@example.com`,
    status: 'pending' as NotificationStatus,
    resend_email_id: `email_test_${randomId}`,
    idempotency_key: `idem_${randomId}`,
    metadata: {},
    created_at: timestamp,
    updated_at: timestamp,
    ...overrides,
  }
}

/**
 * Test notification preferences factory
 */
export function createTestNotificationPreferences(
  userId?: string,
  overrides?: Partial<NotificationPreferences>,
): NotificationPreferences {
  const timestamp = new Date().toISOString()

  return {
    id: `pref_test_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId || `user_${Math.random().toString(36).substr(2, 9)}`,
    payment_failure_emails: true,
    card_expiring_emails: true,
    trial_ending_emails: true,
    subscription_emails: true,
    recommendation_emails: true,
    application_status_emails: true,
    security_emails: true,
    weekly_digest: false,
    unsubscribed: false,
    unsubscribe_token: `unsub_${Math.random().toString(36).substr(2, 9)}`,
    metadata: {},
    created_at: timestamp,
    updated_at: timestamp,
    ...overrides,
  }
}

/**
 * Notification types and their corresponding email details
 */
export const notificationEmailMap: Record<
  NotificationType,
  { subject: string; template: string }
> = {
  welcome: {
    subject: 'Welcome to Ori - Your AI Career Companion',
    template: 'welcome',
  },
  payment_failure: {
    subject: 'Payment Failed - Action Required',
    template: 'payment_failure',
  },
  card_expiring: {
    subject: 'Your Payment Method Expires Soon',
    template: 'card_expiring',
  },
  trial_ending: {
    subject: 'Your Free Trial Ends Soon',
    template: 'trial_ending',
  },
  subscription_confirmation: {
    subject: 'Subscription Confirmed',
    template: 'subscription_confirmation',
  },
  recommendations: {
    subject: 'Your Weekly Job Recommendations',
    template: 'recommendations',
  },
  application_status: {
    subject: 'Job Application Update',
    template: 'application_status',
  },
}

/**
 * Mock Resend email response
 */
export interface MockResendEmailResponse {
  id: string
  from: string
  to: string
  created_at: string
  subject: string
}

/**
 * Create mock Resend email response
 */
export function createMockResendResponse(
  overrides?: Partial<MockResendEmailResponse>,
): MockResendEmailResponse {
  const randomId = Math.random().toString(36).substr(2, 9)

  return {
    id: `email_test_${randomId}`,
    from: 'noreply@getori.app',
    to: `user_${randomId}@example.com`,
    created_at: new Date().toISOString(),
    subject: 'Test Email',
    ...overrides,
  }
}

/**
 * Test scenarios for notification flows
 */
export const notificationScenarios = {
  /**
   * Welcome email flow
   */
  welcomeEmail: {
    notificationType: 'welcome' as NotificationType,
    userId: 'user_welcome_test',
    email: 'welcome_user@example.com',
    name: 'Welcome User',
    preferences: createTestNotificationPreferences('user_welcome_test', {
      payment_failure_emails: true,
    }),
  },

  /**
   * Payment failure flow
   */
  paymentFailure: {
    notificationType: 'payment_failure' as NotificationType,
    userId: 'user_payment_failure',
    email: 'payment_failure@example.com',
    stripeCustomerId: 'cus_test_payment_fail',
    amount: 1000,
    currency: 'usd',
    reason: 'card_declined',
    preferences: createTestNotificationPreferences('user_payment_failure', {
      payment_failure_emails: true,
    }),
  },

  /**
   * Card expiring flow
   */
  cardExpiring: {
    notificationType: 'card_expiring' as NotificationType,
    userId: 'user_card_expiring',
    email: 'card_expiring@example.com',
    cardBrand: 'visa',
    cardLastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2024,
    preferences: createTestNotificationPreferences('user_card_expiring', {
      card_expiring_emails: true,
    }),
  },

  /**
   * Trial ending flow
   */
  trialEnding: {
    notificationType: 'trial_ending' as NotificationType,
    userId: 'user_trial_ending',
    email: 'trial_ending@example.com',
    daysRemaining: 3,
    planName: 'Premium Monthly',
    price: 1000,
    preferences: createTestNotificationPreferences('user_trial_ending', {
      trial_ending_emails: true,
    }),
  },

  /**
   * Subscription confirmation flow
   */
  subscriptionConfirmation: {
    notificationType: 'subscription_confirmation' as NotificationType,
    userId: 'user_sub_confirm',
    email: 'sub_confirm@example.com',
    planName: 'Premium Monthly',
    price: 1000,
    billingCycle: 'monthly',
    nextBillingDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    preferences: createTestNotificationPreferences('user_sub_confirm', {
      subscription_emails: true,
    }),
  },

  /**
   * Recommendations email flow
   */
  recommendations: {
    notificationType: 'recommendations' as NotificationType,
    userId: 'user_recommendations',
    email: 'recommendations@example.com',
    jobCount: 5,
    topSkills: ['React', 'TypeScript', 'Node.js'],
    preferences: createTestNotificationPreferences('user_recommendations', {
      recommendation_emails: true,
    }),
  },

  /**
   * Application status update flow
   */
  applicationStatus: {
    notificationType: 'application_status' as NotificationType,
    userId: 'user_app_status',
    email: 'app_status@example.com',
    jobTitle: 'Senior React Developer',
    company: 'Tech Company Inc',
    status: 'shortlisted',
    preferences: createTestNotificationPreferences('user_app_status', {
      application_status_emails: true,
    }),
  },
}

/**
 * Email template test data
 */
export const emailTemplates = {
  /**
   * Welcome email template variables
   */
  welcome: {
    name: 'John Doe',
    actionUrl: 'https://app.getori.app/dashboard',
    actionText: 'Get Started',
  },

  /**
   * Payment failure template variables
   */
  payment_failure: {
    email: 'user@example.com',
    amount: '$10.00',
    currency: 'USD',
    reason: 'Your card was declined',
    actionUrl: 'https://app.getori.app/settings/billing',
    actionText: 'Update Payment Method',
  },

  /**
   * Card expiring template variables
   */
  card_expiring: {
    cardBrand: 'Visa',
    lastFour: '4242',
    expiryDate: '12/2024',
    actionUrl: 'https://app.getori.app/settings/billing',
    actionText: 'Update Payment Method',
  },

  /**
   * Trial ending template variables
   */
  trial_ending: {
    name: 'John',
    daysRemaining: 3,
    planName: 'Premium',
    price: '$10',
    actionUrl: 'https://app.getori.app/select-plan',
    actionText: 'Choose Your Plan',
  },

  /**
   * Subscription confirmation template variables
   */
  subscription_confirmation: {
    name: 'John',
    planName: 'Premium Monthly',
    price: '$10.00',
    billingCycle: 'monthly',
    nextBillingDate: 'December 9, 2024',
    dashboardUrl: 'https://app.getori.app/dashboard',
  },

  /**
   * Recommendations template variables
   */
  recommendations: {
    name: 'John',
    recommendationCount: 5,
    topSkills: ['React', 'TypeScript', 'Node.js'],
    actionUrl: 'https://app.getori.app/recommendations',
    actionText: 'View All Recommendations',
  },

  /**
   * Application status template variables
   */
  application_status: {
    jobTitle: 'Senior React Developer',
    company: 'Tech Company Inc',
    status: 'shortlisted',
    statusColor: 'green',
    actionUrl: 'https://app.getori.app/applications',
    actionText: 'View Application',
  },
}

/**
 * Helper function to generate email HTML (mock)
 */
export function generateEmailHTML(
  type: NotificationType,
  variables: Record<string, unknown>,
): string {
  const baseHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #f3f4f6; padding: 20px; }
          .content { padding: 20px; }
          .button { background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { background-color: #f3f4f6; padding: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ori Career Companion</h1>
          </div>
          <div class="content">
            <p>Email Type: ${type}</p>
            <p>Variables: ${JSON.stringify(variables, null, 2)}</p>
            ${variables.actionUrl ? `<a href="${variables.actionUrl}" class="button">${variables.actionText || 'Click Here'}</a>` : ''}
          </div>
          <div class="footer">
            <p>© 2024 Ori. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return baseHTML
}

/**
 * Helper to generate unsubscribe link
 */
export function generateUnsubscribeLink(token: string): string {
  return `https://app.getori.app/unsubscribe?token=${token}`
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Mock database fixtures for testing
 */
export const notificationDatabaseFixtures = {
  /**
   * Create test notification record
   */
  createNotificationRecord: (
    userId: string,
    type: NotificationType,
    status: NotificationStatus = 'sent',
  ): Notification => {
    return createTestNotification({
      user_id: userId,
      type,
      status,
    })
  },

  /**
   * Create test preference record
   */
  createPreferenceRecord: (userId: string): NotificationPreferences => {
    return createTestNotificationPreferences(userId)
  },

  /**
   * Simulate notification history
   */
  createNotificationHistory: (
    userId: string,
    count: number = 5,
  ): Notification[] => {
    const types: NotificationType[] = [
      'welcome',
      'payment_failure',
      'card_expiring',
      'trial_ending',
      'subscription_confirmation',
    ]

    return Array.from({ length: count }, (_, index) =>
      createTestNotification({
        user_id: userId,
        type: types[index % types.length],
        status: 'sent',
        created_at: new Date(
          Date.now() - (count - index) * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }),
    )
  },
}
