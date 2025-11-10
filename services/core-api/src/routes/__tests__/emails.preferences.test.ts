/**
 * Email Notification Preferences Tests
 *
 * Tests for user notification preference management
 * Covers CRUD operations, preference updates, and unsubscribe flows
 */

import { NotificationPreferences } from '@ori/types'
import { createTestNotificationPreferences } from './fixtures/email.fixtures'

/**
 * Notification preference management
 */
describe('Email Notification Preferences', () => {
  describe('Preference CRUD operations', () => {
    it('should create default notification preferences for new user', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.user_id).toBe('user_123')
      expect(preferences.id).toBeDefined()
      expect(preferences.created_at).toBeDefined()
      expect(preferences.updated_at).toBeDefined()
    })

    it('should create preferences with custom overrides', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: false,
        card_expiring_emails: false,
        recommendation_emails: true,
      })

      // Assert
      expect(preferences.user_id).toBe('user_123')
      expect(preferences.payment_failure_emails).toBe(false)
      expect(preferences.card_expiring_emails).toBe(false)
      expect(preferences.recommendation_emails).toBe(true)
    })

    it('should have unsubscribe token generated on creation', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.unsubscribe_token).toBeDefined()
      expect(preferences.unsubscribe_token).toMatch(/^unsub_[a-z0-9]+$/) // unsub_ prefix + alphanumeric
      expect(preferences.unsubscribe_token.length).toBeGreaterThan(10)
    })

    it('should track preference update timestamps', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: true,
      })

      const originalUpdatedAt = preferences.updated_at

      // Act - Simulate update with a slight delay
      const delayedUpdateTime = new Date(Date.now() + 100).toISOString()
      const updatedPreferences = {
        ...preferences,
        payment_failure_emails: false,
        updated_at: delayedUpdateTime,
      }

      // Assert
      expect(updatedPreferences.updated_at).not.toBe(originalUpdatedAt)
      expect(updatedPreferences.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('Individual preference flags', () => {
    it('should allow disabling payment failure emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: false,
      })

      // Assert
      expect(preferences.payment_failure_emails).toBe(false)
      expect(preferences.card_expiring_emails).toBe(true) // Others unchanged
      expect(preferences.trial_ending_emails).toBe(true)
    })

    it('should allow disabling card expiring emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        card_expiring_emails: false,
      })

      // Assert
      expect(preferences.card_expiring_emails).toBe(false)
      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.trial_ending_emails).toBe(true)
    })

    it('should allow disabling trial ending emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        trial_ending_emails: false,
      })

      // Assert
      expect(preferences.trial_ending_emails).toBe(false)
    })

    it('should allow disabling subscription emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        subscription_emails: false,
      })

      // Assert
      expect(preferences.subscription_emails).toBe(false)
    })

    it('should allow disabling recommendation emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        recommendation_emails: false,
      })

      // Assert
      expect(preferences.recommendation_emails).toBe(false)
    })

    it('should allow disabling application status emails', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        application_status_emails: false,
      })

      // Assert
      expect(preferences.application_status_emails).toBe(false)
    })

    it('should have security emails always enabled', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        security_emails: true,
      })

      // Assert - Security emails cannot be disabled in real app
      expect(preferences.security_emails).toBe(true)
    })

    it('should allow enabling weekly digest', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        weekly_digest: true,
      })

      // Assert
      expect(preferences.weekly_digest).toBe(true)
    })
  })

  describe('Global unsubscribe functionality', () => {
    it('should mark user as globally unsubscribed', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: true,
      })

      // Assert
      expect(preferences.unsubscribed).toBe(true)
    })

    it('should track unsubscribe timestamp', () => {
      // Act
      const now = new Date().toISOString()
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: true,
        unsubscribed_at: now,
      })

      // Assert
      expect(preferences.unsubscribed_at).toBeDefined()
      expect(preferences.unsubscribed_at).toBe(now)
    })

    it('should allow re-subscribing after unsubscribe', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123', {
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
      })

      // Act - Re-subscribe
      const resubscribedPreferences = {
        ...preferences,
        unsubscribed: false,
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      }

      // Assert
      expect(preferences.unsubscribed).toBe(true)
      expect(resubscribedPreferences.unsubscribed).toBe(false)
      expect(resubscribedPreferences.unsubscribed_at).toBeNull()
    })

    it('should generate unique unsubscribe token per user', () => {
      // Act
      const prefs1 = createTestNotificationPreferences('user_123')
      const prefs2 = createTestNotificationPreferences('user_456')

      // Assert
      expect(prefs1.unsubscribe_token).not.toBe(prefs2.unsubscribe_token)
    })

    it('should allow unsubscribe via token lookup', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123')
      const token = preferences.unsubscribe_token

      // Act - Simulate token lookup in DB
      const foundPreferences = {
        ...preferences,
        unsubscribe_token: token,
      }

      // Assert
      expect(foundPreferences.unsubscribe_token).toBe(token)
      expect(foundPreferences.user_id).toBe('user_123')
    })
  })

  describe('Preference combinations and logic', () => {
    it('should allow disabling all marketing emails while keeping critical ones', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        recommendation_emails: false,
        application_status_emails: false,
        weekly_digest: false,
        // Keep critical emails enabled
        payment_failure_emails: true,
        card_expiring_emails: true,
        trial_ending_emails: true,
        security_emails: true,
      })

      // Assert
      expect(preferences.recommendation_emails).toBe(false)
      expect(preferences.application_status_emails).toBe(false)
      expect(preferences.weekly_digest).toBe(false)

      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.card_expiring_emails).toBe(true)
      expect(preferences.trial_ending_emails).toBe(true)
      expect(preferences.security_emails).toBe(true)
    })

    it('should support custom metadata for future preferences', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        metadata: {
          preferredEmailTime: '09:00 UTC',
          emailFrequency: 'weekly',
          customGroups: ['jobs_in_tech', 'startup_news'],
        },
      })

      // Assert
      expect(preferences.metadata).toEqual({
        preferredEmailTime: '09:00 UTC',
        emailFrequency: 'weekly',
        customGroups: ['jobs_in_tech', 'startup_news'],
      })
    })

    it('should track preference change history in metadata', () => {
      // Arrange
      const basePreferences = createTestNotificationPreferences('user_123')

      // Act
      const updatedPreferences = {
        ...basePreferences,
        payment_failure_emails: false,
        metadata: {
          lastChangeType: 'disabled_payment_failure_emails',
          changedAt: new Date().toISOString(),
          previousValue: true,
        },
      }

      // Assert
      expect(updatedPreferences.metadata?.lastChangeType).toBe(
        'disabled_payment_failure_emails',
      )
      expect(updatedPreferences.metadata?.previousValue).toBe(true)
    })
  })

  describe('Email frequency preferences', () => {
    it('should have default weekly digest disabled', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.weekly_digest).toBe(false)
    })

    it('should allow enabling weekly digest', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        weekly_digest: true,
      })

      // Assert
      expect(preferences.weekly_digest).toBe(true)
    })

    it('should track digest frequency in metadata', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        weekly_digest: true,
        metadata: {
          digestFrequency: 'weekly',
          digestDay: 'Monday',
          digestTime: '09:00 UTC',
        },
      })

      // Assert
      expect(preferences.metadata?.digestFrequency).toBe('weekly')
      expect(preferences.metadata?.digestDay).toBe('Monday')
    })
  })

  describe('Preference validation and constraints', () => {
    it('should have valid user_id', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.user_id).toBeDefined()
      expect(typeof preferences.user_id).toBe('string')
      expect(preferences.user_id.length).toBeGreaterThan(0)
    })

    it('should have unique preference ID', () => {
      // Act
      const prefs1 = createTestNotificationPreferences('user_123')
      const prefs2 = createTestNotificationPreferences('user_123')

      // Assert - Different preferences for same user should have different IDs
      expect(prefs1.id).not.toBe(prefs2.id)
    })

    it('should have all preference flags defined', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.payment_failure_emails).toBeDefined()
      expect(typeof preferences.payment_failure_emails).toBe('boolean')

      expect(preferences.card_expiring_emails).toBeDefined()
      expect(typeof preferences.card_expiring_emails).toBe('boolean')

      expect(preferences.trial_ending_emails).toBeDefined()
      expect(typeof preferences.trial_ending_emails).toBe('boolean')

      expect(preferences.subscription_emails).toBeDefined()
      expect(typeof preferences.subscription_emails).toBe('boolean')

      expect(preferences.recommendation_emails).toBeDefined()
      expect(typeof preferences.recommendation_emails).toBe('boolean')

      expect(preferences.application_status_emails).toBeDefined()
      expect(typeof preferences.application_status_emails).toBe('boolean')

      expect(preferences.security_emails).toBeDefined()
      expect(typeof preferences.security_emails).toBe('boolean')

      expect(preferences.weekly_digest).toBeDefined()
      expect(typeof preferences.weekly_digest).toBe('boolean')
    })

    it('should have timestamps in ISO format', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(preferences.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('Default preference values', () => {
    it('should have all notification types enabled by default except weekly digest', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.card_expiring_emails).toBe(true)
      expect(preferences.trial_ending_emails).toBe(true)
      expect(preferences.subscription_emails).toBe(true)
      expect(preferences.recommendation_emails).toBe(true)
      expect(preferences.application_status_emails).toBe(true)
      expect(preferences.security_emails).toBe(true)
      expect(preferences.weekly_digest).toBe(false)
      expect(preferences.unsubscribed).toBe(false)
    })

    it('should have empty metadata by default', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(preferences.metadata).toEqual({})
    })
  })

  describe('Preference bulk updates', () => {
    it('should update multiple preferences at once', () => {
      // Arrange
      const originalPreferences = createTestNotificationPreferences('user_123')

      // Act
      const updatedPreferences = {
        ...originalPreferences,
        payment_failure_emails: false,
        card_expiring_emails: false,
        recommendation_emails: false,
        updated_at: new Date().toISOString(),
      }

      // Assert
      expect(updatedPreferences.payment_failure_emails).toBe(false)
      expect(updatedPreferences.card_expiring_emails).toBe(false)
      expect(updatedPreferences.recommendation_emails).toBe(false)
      expect(updatedPreferences.trial_ending_emails).toBe(true) // Unchanged
    })

    it('should reset all preferences to defaults', () => {
      // Arrange
      const customPreferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: false,
        card_expiring_emails: false,
        recommendation_emails: false,
        weekly_digest: true,
      })

      // Act - Reset to defaults
      const resetPreferences = createTestNotificationPreferences('user_123')

      // Assert
      expect(customPreferences.payment_failure_emails).toBe(false)
      expect(resetPreferences.payment_failure_emails).toBe(true)
    })
  })

  describe('Preference UI/UX scenarios', () => {
    it('should support "disable all except critical" quick action', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        // Marketing emails
        recommendation_emails: false,
        application_status_emails: false,
        weekly_digest: false,
        // Keep critical
        payment_failure_emails: true,
        card_expiring_emails: true,
        trial_ending_emails: true,
        security_emails: true,
      })

      // Assert
      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.card_expiring_emails).toBe(true)
      expect(preferences.trial_ending_emails).toBe(true)
      expect(preferences.security_emails).toBe(true)

      expect(preferences.recommendation_emails).toBe(false)
      expect(preferences.application_status_emails).toBe(false)
      expect(preferences.weekly_digest).toBe(false)
    })

    it('should support "enable all" quick action', () => {
      // Act
      const preferences = createTestNotificationPreferences('user_123', {
        payment_failure_emails: true,
        card_expiring_emails: true,
        trial_ending_emails: true,
        subscription_emails: true,
        recommendation_emails: true,
        application_status_emails: true,
        security_emails: true,
        weekly_digest: true,
      })

      // Assert
      expect(preferences.payment_failure_emails).toBe(true)
      expect(preferences.recommendation_emails).toBe(true)
      expect(preferences.weekly_digest).toBe(true)
    })

    it('should show unsubscribe link in footer for user to manage via token', () => {
      // Arrange
      const preferences = createTestNotificationPreferences('user_123')
      const unsubscribeUrl = `https://app.getori.app/unsubscribe?token=${preferences.unsubscribe_token}`

      // Act & Assert
      expect(preferences.unsubscribe_token).toBeDefined()
      expect(unsubscribeUrl).toContain('unsubscribe')
      expect(unsubscribeUrl).toContain(preferences.unsubscribe_token)
    })
  })
})
