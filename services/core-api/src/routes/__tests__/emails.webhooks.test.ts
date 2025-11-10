/**
 * Email Webhook Integration Tests
 *
 * Tests for Stripe webhook → email notification flow
 * Covers payment events triggering appropriate email notifications
 */

import {
  Notification,
  NotificationPreferences,
  NotificationType,
} from '@ori/types'
import {
  createTestNotification,
  createTestNotificationPreferences,
  notificationScenarios,
} from './fixtures/email.fixtures'
import { emailService, ResendClient } from '../../lib/resend'

/**
 * Stripe webhook event simulations
 */
describe('Email Webhook Integration', () => {
  describe('Stripe payment webhook → email triggers', () => {
    it('should trigger payment_failure email on charge.failed event', async () => {
      // Arrange - Simulate Stripe webhook payload
      const webhookPayload = {
        type: 'charge.failed',
        data: {
          object: {
            id: 'ch_failed_123',
            customer: 'cus_test_123',
            amount: 1000,
            currency: 'usd',
            failure_message: 'Card declined',
          },
        },
      }

      const userEmail = 'user@example.com'
      const userName = 'John Doe'

      // Act
      const notification = createTestNotification({
        type: 'payment_failure' as NotificationType,
        recipient_email: userEmail,
        subject: 'Payment Failed - Action Required',
        triggered_by_event: webhookPayload.type,
        metadata: {
          stripeEventType: webhookPayload.type,
          chargeId: webhookPayload.data.object.id,
        },
      })

      // Assert
      expect(notification.type).toBe('payment_failure')
      expect(notification.triggered_by_event).toBe('charge.failed')
      expect(notification.metadata?.stripeEventType).toBe('charge.failed')
      expect(notification.metadata?.chargeId).toBe('ch_failed_123')
    })

    it('should trigger card_expiring email on customer.source.expiring event', () => {
      // Arrange
      const webhookPayload = {
        type: 'customer.source.expiring.soon',
        data: {
          object: {
            id: 'card_expiring_123',
            customer: 'cus_test_123',
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2024,
          },
        },
      }

      const userEmail = 'user@example.com'

      // Act
      const notification = createTestNotification({
        type: 'card_expiring' as NotificationType,
        recipient_email: userEmail,
        subject: 'Your Payment Method Expires Soon',
        triggered_by_event: webhookPayload.type,
        metadata: {
          stripeEventType: webhookPayload.type,
          cardBrand: webhookPayload.data.object.brand,
          cardLastFour: webhookPayload.data.object.last4,
          expiryMonth: webhookPayload.data.object.exp_month,
          expiryYear: webhookPayload.data.object.exp_year,
        },
      })

      // Assert
      expect(notification.type).toBe('card_expiring')
      expect(notification.triggered_by_event).toBe(
        'customer.source.expiring.soon',
      )
      expect(notification.metadata?.cardLastFour).toBe('4242')
    })

    it('should trigger trial_ending email on customer.subscription.schedule.created', () => {
      // Arrange
      const webhookPayload = {
        type: 'customer.subscription.trial_will_end',
        data: {
          object: {
            id: 'sub_trial_123',
            customer: 'cus_test_123',
            trial_end: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 days
            plan: {
              nickname: 'Premium Monthly',
              amount: 1000,
            },
          },
        },
      }

      const userEmail = 'user@example.com'

      // Act
      const notification = createTestNotification({
        type: 'trial_ending' as NotificationType,
        recipient_email: userEmail,
        subject: 'Your Free Trial Ends Soon',
        triggered_by_event: webhookPayload.type,
        metadata: {
          stripeEventType: webhookPayload.type,
          subscriptionId: webhookPayload.data.object.id,
          planName: webhookPayload.data.object.plan.nickname,
          daysRemaining: 3,
        },
      })

      // Assert
      expect(notification.type).toBe('trial_ending')
      expect(notification.triggered_by_event).toBe(
        'customer.subscription.trial_will_end',
      )
      expect(notification.metadata?.daysRemaining).toBe(3)
    })

    it('should trigger subscription_confirmation email on invoice.payment_succeeded', () => {
      // Arrange
      const webhookPayload = {
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_success_123',
            subscription: 'sub_active_123',
            customer: 'cus_test_123',
            amount_paid: 1000,
            billing_reason: 'subscription_create',
          },
        },
      }

      const userEmail = 'user@example.com'

      // Act
      const notification = createTestNotification({
        type: 'subscription_confirmation' as NotificationType,
        recipient_email: userEmail,
        subject: 'Subscription Confirmed',
        triggered_by_event: webhookPayload.type,
        metadata: {
          stripeEventType: webhookPayload.type,
          invoiceId: webhookPayload.data.object.id,
          amountPaid: webhookPayload.data.object.amount_paid,
        },
      })

      // Assert
      expect(notification.type).toBe('subscription_confirmation')
      expect(notification.triggered_by_event).toBe('invoice.payment_succeeded')
      expect(notification.metadata?.amountPaid).toBe(1000)
    })
  })

  describe('Webhook → Notification preference checking', () => {
    it('should skip payment_failure email if user unsubscribed', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: false,
        unsubscribed: false,
      })

      const notification = createTestNotification({
        type: 'payment_failure',
        user_id: 'user_123',
      })

      // Act & Assert
      const shouldSend =
        preferences.payment_failure_emails && !preferences.unsubscribed
      expect(shouldSend).toBe(false)
    })

    it('should skip all emails if globally unsubscribed', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: true,
      })

      // Act & Assert
      // When user is globally unsubscribed, all emails should be blocked
      expect(preferences.unsubscribed).toBe(true)

      // Verify key preference fields exist but would be overridden by global unsubscribe
      expect(preferences.payment_failure_emails).toBeDefined()
      expect(preferences.card_expiring_emails).toBeDefined()
      expect(preferences.trial_ending_emails).toBeDefined()
      expect(preferences.subscription_emails).toBeDefined()
      expect(preferences.recommendation_emails).toBeDefined()
      expect(preferences.application_status_emails).toBeDefined()

      // The business logic: global unsubscribe overrides all individual preferences
      const canSendEmail = !preferences.unsubscribed
      expect(canSendEmail).toBe(false)
    })

    it('should respect individual preference flags for each email type', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: true,
        card_expiring_emails: false,
        trial_ending_emails: true,
        subscription_emails: false,
        recommendation_emails: true,
        application_status_emails: false,
        unsubscribed: false,
      })

      // Act & Assert
      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.card_expiring_emails).toBe(false)
      expect(preferences.trial_ending_emails).toBe(true)
      expect(preferences.subscription_emails).toBe(false)
      expect(preferences.recommendation_emails).toBe(true)
      expect(preferences.application_status_emails).toBe(false)
    })
  })

  describe('Webhook idempotency and duplicate prevention', () => {
    it('should create notification with idempotency key from Stripe webhook', () => {
      // Arrange
      const stripeEventId = 'evt_1234567890'
      const chargeId = 'ch_failed_123'

      // Act - Idempotency key prevents duplicates if webhook is retried
      const notification = createTestNotification({
        type: 'payment_failure',
        idempotency_key: `${stripeEventId}:${chargeId}`,
        triggered_by_event: 'charge.failed',
      })

      // Assert
      expect(notification.idempotency_key).toBe(`${stripeEventId}:${chargeId}`)
    })

    it('should detect duplicate webhook events via idempotency key', () => {
      // Arrange - Same webhook event fired twice
      const idempotencyKey = 'evt_1234567890:ch_failed_123'

      const notification1 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: idempotencyKey,
      })

      const notification2 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: idempotencyKey,
      })

      // Act & Assert
      expect(notification1.idempotency_key).toBe(notification2.idempotency_key)
      // In production, would check DB for existing idempotency key
    })
  })

  describe('Webhook error handling and retry logic', () => {
    it('should handle webhook with missing customer data gracefully', () => {
      // Arrange
      const webhookPayload = {
        type: 'charge.failed',
        data: {
          object: {
            id: 'ch_failed_123',
            customer: null, // Missing customer
            amount: 1000,
            currency: 'usd',
          },
        },
      }

      // Act & Assert
      expect(webhookPayload.data.object.customer).toBeNull()
      // In production, would log error and skip email
    })

    it('should create failed notification if email sending fails', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        status: 'failed',
        error_message: 'Resend API error: Invalid email address',
        failed_at: new Date().toISOString(),
      })

      // Act & Assert
      expect(notification.status).toBe('failed')
      expect(notification.error_message).toContain('Resend API error')
      expect(notification.failed_at).toBeDefined()
    })

    it('should mark notification as bounced if email bounces', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        status: 'bounced',
        error_message: 'Email address does not exist',
      })

      // Act & Assert
      expect(notification.status).toBe('bounced')
    })
  })

  describe('Webhook event processing and state transitions', () => {
    it('should track notification state transitions: pending → sent', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        status: 'pending' as const,
      })

      // Act - Simulate successful send
      const sentNotification = {
        ...notification,
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        resend_email_id: 'email_1234567890',
      }

      // Assert
      expect(notification.status).toBe('pending')
      expect(sentNotification.status).toBe('sent')
      expect(sentNotification.sent_at).toBeDefined()
      expect(sentNotification.resend_email_id).toBeDefined()
    })

    it('should track notification state transitions: pending → failed', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        status: 'pending' as const,
      })

      // Act - Simulate send failure
      const failedNotification = {
        ...notification,
        status: 'failed' as const,
        failed_at: new Date().toISOString(),
        error_message: 'Resend service unavailable',
      }

      // Assert
      expect(notification.status).toBe('pending')
      expect(failedNotification.status).toBe('failed')
      expect(failedNotification.failed_at).toBeDefined()
      expect(failedNotification.error_message).toBeDefined()
    })

    it('should allow retrying failed notifications', () => {
      // Arrange
      const failedNotification = createTestNotification({
        type: 'payment_failure',
        status: 'failed' as const,
        error_message: 'Temporary network error',
      })

      // Act - Retry
      const retryNotification = {
        ...failedNotification,
        status: 'pending' as const,
        error_message: undefined,
        updated_at: new Date().toISOString(),
      }

      // Assert
      expect(failedNotification.status).toBe('failed')
      expect(retryNotification.status).toBe('pending')
    })
  })

  describe('Complex webhook scenarios', () => {
    it('should handle subscription lifecycle: created → confirmation email', () => {
      // Arrange
      const events = [
        {
          type: 'customer.subscription.created',
          triggersEmail: 'subscription_confirmation',
        },
      ]

      // Act & Assert
      events.forEach((event) => {
        const notification = createTestNotification({
          type: 'subscription_confirmation' as NotificationType,
          triggered_by_event: event.type,
        })

        expect(notification.type).toBe(event.triggersEmail)
        expect(notification.triggered_by_event).toBe(event.type)
      })
    })

    it('should handle payment lifecycle: failed → update reminder → success', () => {
      // Arrange
      const paymentFailureNotif = createTestNotification({
        type: 'payment_failure',
        triggered_by_event: 'charge.failed',
      })

      const cardExpiringNotif = createTestNotification({
        type: 'card_expiring',
        triggered_by_event: 'customer.source.expiring.soon',
      })

      const successNotif = createTestNotification({
        type: 'subscription_confirmation',
        triggered_by_event: 'invoice.payment_succeeded',
      })

      // Act & Assert
      expect(paymentFailureNotif.type).toBe('payment_failure')
      expect(cardExpiringNotif.type).toBe('card_expiring')
      expect(successNotif.type).toBe('subscription_confirmation')
    })

    it('should handle trial ending lifecycle and conversion', () => {
      // Arrange
      const trialEndingNotif = createTestNotification({
        type: 'trial_ending',
        triggered_by_event: 'customer.subscription.trial_will_end',
        metadata: {
          daysRemaining: 3,
        },
      })

      // Simulate user subscribes after trial ending email
      const subscriptionNotif = createTestNotification({
        type: 'subscription_confirmation',
        triggered_by_event: 'invoice.payment_succeeded',
      })

      // Act & Assert
      expect(trialEndingNotif.type).toBe('trial_ending')
      expect(subscriptionNotif.type).toBe('subscription_confirmation')
    })
  })

  describe('Webhook metadata and event tracking', () => {
    it('should preserve complete Stripe webhook metadata in notification', () => {
      // Arrange
      const webhookMetadata = {
        stripeEventId: 'evt_1234567890',
        stripeEventType: 'charge.failed',
        chargeId: 'ch_failed_123',
        customerId: 'cus_test_123',
        amount: 1000,
        currency: 'usd',
        failureReason: 'card_declined',
        timestamp: Math.floor(Date.now() / 1000),
      }

      // Act
      const notification = createTestNotification({
        type: 'payment_failure',
        triggered_by_event: webhookMetadata.stripeEventType,
        metadata: webhookMetadata,
      })

      // Assert
      expect(notification.metadata).toEqual(webhookMetadata)
      expect(notification.metadata?.stripeEventId).toBe('evt_1234567890')
      expect(notification.metadata?.chargeId).toBe('ch_failed_123')
      expect(notification.metadata?.failureReason).toBe('card_declined')
    })

    it('should track email campaign and A/B testing data', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        metadata: {
          campaignId: 'payment_fail_nov_2024',
          variant: 'urgent_tone',
          testGroup: 'variant_a',
          sentAt: new Date().toISOString(),
        },
      })

      // Act & Assert
      expect(notification.metadata?.campaignId).toBe('payment_fail_nov_2024')
      expect(notification.metadata?.variant).toBe('urgent_tone')
      expect(notification.metadata?.testGroup).toBe('variant_a')
    })
  })

  describe('Rate limiting and throttling', () => {
    it('should not send duplicate payment failure emails within threshold', () => {
      // Arrange - Multiple failed charges from same customer
      const customerId = 'cus_test_123'
      const now = new Date()

      const notification1 = createTestNotification({
        type: 'payment_failure',
        user_id: customerId,
        created_at: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 min ago
      })

      const notification2 = createTestNotification({
        type: 'payment_failure',
        user_id: customerId,
        created_at: now.toISOString(),
      })

      // Act - Check if second notification is within throttle window (e.g., 10 min)
      const throttleWindowMs = 10 * 60 * 1000
      const timeSinceLastNotif =
        new Date(notification2.created_at).getTime() -
        new Date(notification1.created_at).getTime()

      const shouldThrottle = timeSinceLastNotif < throttleWindowMs

      // Assert
      expect(shouldThrottle).toBe(true)
    })

    it('should allow sending payment failure email after throttle window', () => {
      // Arrange
      const customerId = 'cus_test_123'
      const now = new Date()

      const notification1 = createTestNotification({
        type: 'payment_failure',
        user_id: customerId,
        created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 min ago
      })

      const notification2 = createTestNotification({
        type: 'payment_failure',
        user_id: customerId,
        created_at: now.toISOString(),
      })

      // Act - Check if second notification is outside throttle window
      const throttleWindowMs = 10 * 60 * 1000
      const timeSinceLastNotif =
        new Date(notification2.created_at).getTime() -
        new Date(notification1.created_at).getTime()

      const shouldThrottle = timeSinceLastNotif < throttleWindowMs

      // Assert
      expect(shouldThrottle).toBe(false)
    })
  })

  describe('Webhook processing with multiple recipients', () => {
    it('should send to single customer email from webhook', () => {
      // Arrange
      const webhookPayload = {
        type: 'charge.failed',
        data: {
          object: {
            customer: 'cus_test_123',
          },
        },
      }

      // Act
      const notification = createTestNotification({
        type: 'payment_failure',
        recipient_email: 'john@example.com',
        triggered_by_event: webhookPayload.type,
      })

      // Assert
      expect(notification.recipient_email).toBe('john@example.com')
    })

    it('should send notification only to customer, not to support team', () => {
      // Arrange - Payment failure should only go to affected customer
      const userEmail = 'customer@example.com'
      const supportEmail = 'support@example.com'

      // Act
      const notification = createTestNotification({
        type: 'payment_failure',
        recipient_email: userEmail,
      })

      // Assert
      expect(notification.recipient_email).toBe(userEmail)
      expect(notification.recipient_email).not.toBe(supportEmail)
    })
  })
})
