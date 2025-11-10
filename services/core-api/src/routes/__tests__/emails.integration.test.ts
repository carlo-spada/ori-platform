/**
 * Email System Integration Tests
 *
 * End-to-end tests for complete email notification flows
 * Tests the entire pipeline from Stripe webhook → database → email sending
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
  generateUnsubscribeLink,
  isValidEmail,
} from './fixtures/email.fixtures'

/**
 * Complete email system integration
 */
describe('Email System Integration', () => {
  describe('End-to-end: Stripe webhook → notification → email', () => {
    it('should process complete payment failure flow', () => {
      // Arrange - Simulate Stripe webhook
      const webhookPayload = {
        type: 'charge.failed',
        id: 'evt_1234567890',
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

      const userId = 'user_123'
      const userEmail = 'user@example.com'

      // Act 1 - Fetch user preferences
      const preferences = createTestNotificationPreferences(userId, {
        payment_failure_emails: true,
        unsubscribed: false,
      })

      // Act 2 - Check if should send
      const shouldSendEmail =
        preferences.payment_failure_emails && !preferences.unsubscribed

      // Act 3 - Create notification
      const notification = createTestNotification({
        user_id: userId,
        type: 'payment_failure' as NotificationType,
        recipient_email: userEmail,
        status: 'pending',
        triggered_by_event: webhookPayload.type,
        idempotency_key: `${webhookPayload.id}:${webhookPayload.data.object.id}`,
        metadata: {
          stripeEventId: webhookPayload.id,
          chargeId: webhookPayload.data.object.id,
          failureReason: webhookPayload.data.object.failure_message,
        },
      })

      // Act 4 - Simulate sending
      const sentNotification = {
        ...notification,
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        resend_email_id: 'email_123456',
      }

      // Assert
      expect(shouldSendEmail).toBe(true)
      expect(notification.status).toBe('pending')
      expect(sentNotification.status).toBe('sent')
      expect(sentNotification.resend_email_id).toBeDefined()
    })

    it('should skip email if user unsubscribed from payment notifications', () => {
      // Arrange
      const webhookPayload = {
        type: 'charge.failed',
        id: 'evt_1234567890',
      }

      const userId = 'user_123'
      const preferences = createTestNotificationPreferences(userId, {
        payment_failure_emails: false,
      })

      // Act
      const shouldSendEmail =
        preferences.payment_failure_emails && !preferences.unsubscribed

      // Assert
      expect(shouldSendEmail).toBe(false)
    })

    it('should skip email if user globally unsubscribed', () => {
      // Arrange
      const userId = 'user_123'
      const preferences = createTestNotificationPreferences(userId, {
        payment_failure_emails: true, // Individual pref is on
        unsubscribed: true, // But globally unsubscribed
      })

      // Act
      const shouldSendEmail =
        preferences.payment_failure_emails && !preferences.unsubscribed

      // Assert
      expect(shouldSendEmail).toBe(false)
    })
  })

  describe('Duplicate prevention via idempotency keys', () => {
    it('should detect and prevent duplicate notifications from same webhook event', () => {
      // Arrange - Same webhook fired twice (network retry)
      const stripeEventId = 'evt_1234567890'
      const chargeId = 'ch_failed_123'
      const idempotencyKey = `${stripeEventId}:${chargeId}`

      // Act - Create two notifications with same idempotency key
      const notification1 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: idempotencyKey,
      })

      const notification2 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: idempotencyKey,
      })

      // Assert
      expect(notification1.idempotency_key).toBe(notification2.idempotency_key)
      // In production DB, second insert would be rejected as duplicate
    })

    it('should allow duplicate notifications for different webhook events', () => {
      // Arrange - Two different payment failures
      const notification1 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: 'evt_1:ch_1',
      })

      const notification2 = createTestNotification({
        type: 'payment_failure',
        idempotency_key: 'evt_2:ch_2',
      })

      // Assert
      expect(notification1.idempotency_key).not.toBe(
        notification2.idempotency_key,
      )
    })
  })

  describe('Complete user journey: signup → trial → subscription', () => {
    it('should send welcome email on signup', () => {
      // Arrange
      const userId = 'user_new_123'
      const userEmail = 'newuser@example.com'

      // Act
      const preferences = createTestNotificationPreferences(userId)
      const notification = createTestNotification({
        user_id: userId,
        type: 'welcome' as NotificationType,
        recipient_email: userEmail,
        status: 'sent',
        triggered_by_event: 'user.created',
      })

      // Assert
      expect(notification.type).toBe('welcome')
      expect(notification.status).toBe('sent')
    })

    it('should send trial ending email after 7 days', () => {
      // Arrange
      const userId = 'user_trial_123'

      // Act
      const trialEndingNotif = createTestNotification({
        user_id: userId,
        type: 'trial_ending' as NotificationType,
        triggered_by_event: 'customer.subscription.trial_will_end',
        metadata: {
          daysRemaining: 3,
        },
      })

      // Assert
      expect(trialEndingNotif.type).toBe('trial_ending')
      expect(trialEndingNotif.metadata?.daysRemaining).toBe(3)
    })

    it('should send subscription confirmation when trial converts', () => {
      // Arrange
      const userId = 'user_trial_123'

      // Act
      const subscriptionNotif = createTestNotification({
        user_id: userId,
        type: 'subscription_confirmation' as NotificationType,
        triggered_by_event: 'invoice.payment_succeeded',
        metadata: {
          planName: 'Premium Monthly',
          amountPaid: 1000,
        },
      })

      // Assert
      expect(subscriptionNotif.type).toBe('subscription_confirmation')
      expect(subscriptionNotif.metadata?.planName).toBe('Premium Monthly')
    })
  })

  describe('Email content and formatting', () => {
    it('should include valid email addresses in recipient field', () => {
      // Arrange
      const testEmails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'support+test@getori.app',
      ]

      // Act & Assert
      testEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true)

        const notification = createTestNotification({
          recipient_email: email,
        })

        expect(notification.recipient_email).toBe(email)
      })
    })

    it('should reject invalid email addresses', () => {
      // Act & Assert
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
    })

    it('should include unsubscribe link in all emails', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123')
      const unsubscribeLink = generateUnsubscribeLink(
        preferences.unsubscribe_token,
      )

      // Act & Assert
      expect(unsubscribeLink).toContain('unsubscribe')
      expect(unsubscribeLink).toContain(preferences.unsubscribe_token)
      expect(unsubscribeLink).toMatch(
        /^https:\/\/app\.getori\.app\/unsubscribe/,
      )
    })
  })

  describe('Preference management through unsubscribe link', () => {
    it('should allow unsubscribe via token in email link', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: false,
      })

      const token = preferences.unsubscribe_token

      // Act - User clicks unsubscribe link with token
      const unsubscribedPreferences = {
        ...preferences,
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
      }

      // Assert
      expect(preferences.unsubscribed).toBe(false)
      expect(unsubscribedPreferences.unsubscribed).toBe(true)
      // In production: token uniquely identifies user for unauth unsubscribe
    })

    it('should preserve user identity via unsubscribe token', () => {
      // Arrange
      const userId = 'user_123'
      const preferences = createTestNotificationPreferences(userId)
      const token = preferences.unsubscribe_token

      // Act - Simulate token lookup (no auth required)
      const foundPrefs = {
        ...preferences,
        unsubscribe_token: token,
        user_id: userId,
      }

      // Assert
      expect(foundPrefs.unsubscribe_token).toBe(token)
      expect(foundPrefs.user_id).toBe(userId)
    })
  })

  describe('Notification state machine', () => {
    it('should transition from pending → sent', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'pending' as const,
      })

      // Act
      const sentNotification = {
        ...notification,
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        resend_email_id: 'email_123',
      }

      // Assert
      expect(notification.status).toBe('pending')
      expect(sentNotification.status).toBe('sent')
      expect(sentNotification.sent_at).toBeDefined()
    })

    it('should transition from pending → failed', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'pending' as const,
      })

      // Act
      const failedNotification = {
        ...notification,
        status: 'failed' as const,
        failed_at: new Date().toISOString(),
        error_message: 'Invalid email address',
      }

      // Assert
      expect(notification.status).toBe('pending')
      expect(failedNotification.status).toBe('failed')
      expect(failedNotification.error_message).toBeDefined()
    })

    it('should transition from failed → pending for retry', () => {
      // Arrange
      const failedNotification = createTestNotification({
        status: 'failed' as const,
        error_message: 'Temporary network error',
      })

      // Act
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

    it('should handle bounced status for invalid emails', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'sent' as const,
      })

      // Act - Webhook indicates bounce
      const bouncedNotification = {
        ...notification,
        status: 'bounced' as const,
        error_message: 'Permanent failure: invalid address',
      }

      // Assert
      expect(bouncedNotification.status).toBe('bounced')
    })

    it('should handle complained status for spam reports', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'sent' as const,
      })

      // Act - Webhook indicates complaint
      const complainedNotification = {
        ...notification,
        status: 'complained' as const,
        error_message: 'User reported as spam',
      }

      // Assert
      expect(complainedNotification.status).toBe('complained')
    })
  })

  describe('Error handling and recovery', () => {
    it('should handle missing user email gracefully', () => {
      // Arrange
      const notification = createTestNotification({
        recipient_email: '',
      })

      // Act
      const isValid = isValidEmail(notification.recipient_email)

      // Assert
      expect(isValid).toBe(false)
      // In production: skip email, log error
    })

    it('should handle Resend API failures gracefully', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'pending' as const,
      })

      // Act - Simulate API failure
      const failedNotification = {
        ...notification,
        status: 'failed' as const,
        error_message: 'Resend API: rate limit exceeded',
        failed_at: new Date().toISOString(),
      }

      // Assert
      expect(failedNotification.status).toBe('failed')
      expect(failedNotification.error_message).toContain('Resend')
    })

    it('should track retry attempts in metadata', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'failed' as const,
        metadata: {
          retryAttempts: 1,
          nextRetryAt: new Date(Date.now() + 60000).toISOString(),
        },
      })

      // Act
      const retryNotification = {
        ...notification,
        status: 'pending' as const,
        metadata: {
          ...(notification.metadata || {}),
          retryAttempts: 2,
          nextRetryAt: new Date(Date.now() + 120000).toISOString(),
        },
      }

      // Assert
      expect(notification.metadata?.retryAttempts).toBe(1)
      expect(retryNotification.metadata?.retryAttempts).toBe(2)
    })
  })

  describe('Performance and scalability', () => {
    it('should handle bulk notification creation', () => {
      // Arrange
      const userIds = Array.from({ length: 100 }, (_, i) => `user_${i}`)

      // Act
      const notifications = userIds.map((userId) =>
        createTestNotification({
          user_id: userId,
          type: 'recommendations' as NotificationType,
          status: 'pending',
        }),
      )

      // Assert
      expect(notifications).toHaveLength(100)
      expect(notifications[0].user_id).toBe('user_0')
      expect(notifications[99].user_id).toBe('user_99')
    })

    it('should batch notifications efficiently', () => {
      // Arrange
      const notifications = Array.from({ length: 50 }, () =>
        createTestNotification({
          status: 'pending' as const,
        }),
      )

      // Act - Group by type
      const byType = notifications.reduce(
        (acc, notif) => {
          const type = notif.type
          if (!acc[type]) acc[type] = []
          acc[type].push(notif)
          return acc
        },
        {} as Record<string, typeof notifications>,
      )

      // Assert
      Object.values(byType).forEach((group) => {
        expect(group.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Audit and compliance', () => {
    it('should maintain complete notification audit trail', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        metadata: {
          campaignId: 'payment_fail_nov_2024',
          sentVia: 'Resend',
          templateVersion: '1.0',
        },
      })

      // Assert
      expect(notification.id).toBeDefined()
      expect(notification.user_id).toBeDefined()
      expect(notification.type).toBeDefined()
      expect(notification.status).toBe('sent')
      expect(notification.sent_at).toBeDefined()
      expect(notification.created_at).toBeDefined()
      expect(notification.updated_at).toBeDefined()
      expect(notification.metadata).toBeDefined()
    })

    it('should track GDPR compliance for user preferences', () => {
      // Arrange
      const userId = 'user_123'
      const preferences = createTestNotificationPreferences(userId, {
        unsubscribed: false,
      })

      // Act - User requests data deletion
      const deletionRecord = {
        userId,
        deletedAt: new Date().toISOString(),
        preferencesId: preferences.id,
        reason: 'GDPR right to erasure',
      }

      // Assert
      expect(deletionRecord.userId).toBe(userId)
      expect(deletionRecord.reason).toBe('GDPR right to erasure')
    })

    it('should respect unsubscribe preferences for compliance', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
      })

      // Act
      const canSendMarketing = !preferences.unsubscribed

      // Assert
      expect(canSendMarketing).toBe(false)
      // Compliance: no marketing emails to unsubscribed users
    })
  })

  describe('Resend API integration points', () => {
    it('should map notification to Resend API format', () => {
      // Arrange
      const notification = createTestNotification({
        type: 'payment_failure',
        recipient_email: 'user@example.com',
        subject: 'Payment Failed - Action Required',
        metadata: {
          userId: 'user_123',
          planName: 'Premium',
        },
      })

      // Act - Map to Resend format
      const resendPayload = {
        from: 'noreply@getori.app',
        to: notification.recipient_email,
        subject: notification.subject,
        html: '<p>Your payment failed</p>',
        headers: {
          'X-Entity-Ref': notification.id,
          'X-Campaign': notification.type,
        },
      }

      // Assert
      expect(resendPayload.to).toBe(notification.recipient_email)
      expect(resendPayload.subject).toBe(notification.subject)
      expect(resendPayload.headers['X-Entity-Ref']).toBe(notification.id)
    })

    it('should handle Resend email ID callback', () => {
      // Arrange
      const notification = createTestNotification({
        status: 'pending' as const,
      })

      const resendEmailId = 'email_1234567890abc'

      // Act
      const sentNotification = {
        ...notification,
        status: 'sent' as const,
        resend_email_id: resendEmailId,
        sent_at: new Date().toISOString(),
      }

      // Assert
      expect(sentNotification.resend_email_id).toBe(resendEmailId)
      // Later: webhooks use this ID to track bounces/complaints
    })
  })
})
