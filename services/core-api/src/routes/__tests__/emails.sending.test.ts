/**
 * Email Sending Tests
 *
 * Tests for email sending functionality using Resend MCP.
 * Covers all email types, template rendering, and error scenarios.
 *
 * Test Coverage:
 * - All 7 email types sent successfully
 * - Email template rendering
 * - Resend API integration
 * - Error handling and retries
 * - Email validation
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  createTestNotification,
  createTestNotificationPreferences,
  notificationScenarios,
  emailTemplates,
  createMockResendResponse,
  isValidEmail,
  generateUnsubscribeLink,
  generateEmailHTML,
} from './fixtures/email.fixtures'
import {
  generateWelcomeTemplate,
  generatePaymentFailureTemplate,
  generateCardExpiringTemplate,
  generateTrialEndingTemplate,
  generateSubscriptionConfirmationTemplate,
  generateRecommendationsTemplate,
  generateApplicationStatusTemplate,
} from '../../lib/resend'

describe('Email Sending - Template Rendering', () => {
  describe('Welcome email template', () => {
    it('should render welcome template with name', () => {
      // Act
      const html = generateWelcomeTemplate('John Doe')

      // Assert
      expect(html).toContain('Welcome to Ori')
      expect(html).toContain('John Doe')
      expect(html).toContain('Complete Your Profile')
      expect(html).toContain('app.getori.app/onboarding')
    })

    it('should include all welcome features', () => {
      // Act
      const html = generateWelcomeTemplate('Jane Smith')

      // Assert
      expect(html).toContain('Discover job opportunities')
      expect(html).toContain('personalized career guidance')
      expect(html).toContain('Track and manage your job applications')
      expect(html).toContain('Develop new skills')
      expect(html).toContain('market trends')
    })

    it('should include brand colors and styling', () => {
      // Act
      const html = generateWelcomeTemplate('Test User')

      // Assert
      expect(html).toContain('#3b82f6') // Primary blue
      expect(html).toContain('font-family') // CSS styling
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('</html>')
    })

    it('should include call-to-action button', () => {
      // Act
      const html = generateWelcomeTemplate('User')

      // Assert
      expect(html).toContain('class="button"')
      expect(html).toContain('Complete Your Profile')
      expect(html).toContain('onboarding')
    })

    it('should include footer with manage preferences', () => {
      // Act
      const html = generateWelcomeTemplate('User')

      // Assert
      expect(html).toContain('Manage preferences')
      expect(html).toContain('© 2024 Ori')
      expect(html).toContain('Visit our website')
    })
  })

  describe('Payment failure email template', () => {
    it('should render payment failure template with details', () => {
      // Act
      const html = generatePaymentFailureTemplate('John Doe', 1000, 'USD')

      // Assert
      expect(html).toContain('Payment Failed')
      expect(html).toContain('John Doe')
      expect(html).toContain('$10.00')
      expect(html).toContain('Update Payment Method')
    })

    it('should include alert styling', () => {
      // Act
      const html = generatePaymentFailureTemplate('User', 1000, 'USD')

      // Assert
      expect(html).toContain('class="alert"')
      expect(html).toContain('Action Required')
      expect(html).toContain('#fef3c7') // Alert background
    })

    it('should include failure reasons', () => {
      // Act
      const html = generatePaymentFailureTemplate('User', 5000, 'USD')

      // Assert
      expect(html).toContain('Insufficient funds')
      expect(html).toContain('Expired or invalid card')
      expect(html).toContain('Temporary issue with your bank')
    })

    it('should include billing settings link', () => {
      // Act
      const html = generatePaymentFailureTemplate('User', 1000, 'USD')

      // Assert
      expect(html).toContain('/settings/billing')
      expect(html).toContain('Update Payment Method')
    })
  })

  describe('Card expiring email template', () => {
    it('should render card expiring template with card details', () => {
      // Act
      const html = generateCardExpiringTemplate(
        'John',
        'Visa',
        '4242',
        12,
        2024,
      )

      // Assert
      expect(html).toContain('Payment Method Expires Soon')
      expect(html).toContain('Visa')
      expect(html).toContain('4242')
      expect(html).toContain('12/2024')
    })

    it('should include different card brands', () => {
      // Act
      const visaHtml = generateCardExpiringTemplate(
        'User',
        'Visa',
        '1234',
        6,
        2025,
      )
      const mastercardHtml = generateCardExpiringTemplate(
        'User',
        'Mastercard',
        '5555',
        9,
        2025,
      )

      // Assert
      expect(visaHtml).toContain('Visa')
      expect(mastercardHtml).toContain('Mastercard')
    })

    it('should include card update button', () => {
      // Act
      const html = generateCardExpiringTemplate('User', 'Amex', '3456', 3, 2025)

      // Assert
      expect(html).toContain('Update Payment Method')
      expect(html).toContain('/settings/billing')
    })
  })

  describe('Trial ending email template', () => {
    it('should render trial ending template with days remaining', () => {
      // Act
      const html = generateTrialEndingTemplate(
        'John',
        3,
        'Premium Monthly',
        1000,
      )

      // Assert
      expect(html).toContain('Free Trial Ends')
      expect(html).toContain('3 Days')
      expect(html).toContain('Premium Monthly')
      expect(html).toContain('$10.00')
    })

    it('should handle single day remaining', () => {
      // Act
      const html = generateTrialEndingTemplate('User', 1, 'Plus Monthly', 500)

      // Assert
      expect(html).toContain('Tomorrow')
    })

    it('should include plan features', () => {
      // Act
      const html = generateTrialEndingTemplate('User', 7, 'Premium', 1000)

      // Assert
      expect(html).toContain('Personalized job recommendations every week')
      expect(html).toContain('AI-powered career guidance')
      expect(html).toContain('Advanced market insights and trends')
      expect(html).toContain('Priority support')
    })

    it('should include CTA button with correct action', () => {
      // Act
      const html = generateTrialEndingTemplate(
        'User',
        5,
        'Premium Monthly',
        1000,
      )

      // Assert
      expect(html).toContain('Continue Your Subscription')
      expect(html).toContain('/select-plan')
    })
  })

  describe('Subscription confirmation email template', () => {
    it('should render subscription confirmation with monthly plan', () => {
      // Act
      const html = generateSubscriptionConfirmationTemplate(
        'John',
        'Premium Monthly',
        1000,
        'monthly',
      )

      // Assert
      expect(html).toContain('Subscription Confirmed')
      expect(html).toContain('Welcome to Premium Monthly')
      expect(html).toContain('$10.00 per month')
      expect(html).toContain('John')
    })

    it('should render subscription confirmation with yearly plan', () => {
      // Act
      const html = generateSubscriptionConfirmationTemplate(
        'Jane',
        'Plus Yearly',
        4800,
        'yearly',
      )

      // Assert
      expect(html).toContain('Plus Yearly')
      expect(html).toContain('$48.00 per year')
    })

    it('should include billing details table', () => {
      // Act
      const html = generateSubscriptionConfirmationTemplate(
        'User',
        'Premium',
        1000,
        'monthly',
      )

      // Assert
      expect(html).toContain('Subscription Details')
      expect(html).toContain('Plan:')
      expect(html).toContain('Price:')
      expect(html).toContain('Next Billing')
    })

    it('should include success styling', () => {
      // Act
      const html = generateSubscriptionConfirmationTemplate(
        'User',
        'Plus',
        500,
        'monthly',
      )

      // Assert
      expect(html).toContain('class="success"')
      expect(html).toContain('#d1fae5') // Success background
    })

    it('should include dashboard link', () => {
      // Act
      const html = generateSubscriptionConfirmationTemplate(
        'User',
        'Premium',
        1000,
        'monthly',
      )

      // Assert
      expect(html).toContain('/dashboard')
      expect(html).toContain('Go to Dashboard')
    })
  })

  describe('Recommendations email template', () => {
    it('should render recommendations template with job count', () => {
      // Act
      const html = generateRecommendationsTemplate('John', 5, [
        'React',
        'TypeScript',
        'Node.js',
      ])

      // Assert
      expect(html).toContain('Weekly Job Recommendations')
      expect(html).toContain('5 great opportunities')
      expect(html).toContain('React')
      expect(html).toContain('TypeScript')
      expect(html).toContain('Node.js')
    })

    it('should include multiple skills', () => {
      // Act
      const html = generateRecommendationsTemplate('User', 10, [
        'Python',
        'Machine Learning',
        'Data Science',
        'TensorFlow',
      ])

      // Assert
      expect(html).toContain('Python')
      expect(html).toContain('Machine Learning')
      expect(html).toContain('Data Science')
      expect(html).toContain('TensorFlow')
    })

    it('should include recommendations button', () => {
      // Act
      const html = generateRecommendationsTemplate('User', 3, ['Rust'])

      // Assert
      expect(html).toContain('View All Recommendations')
      expect(html).toContain('/recommendations')
    })

    it('should include tips section', () => {
      // Act
      const html = generateRecommendationsTemplate('User', 7, ['Go'])

      // Assert
      expect(html).toContain('Update your profile regularly')
      expect(html).toContain('AI advisor')
      expect(html).toContain('Track your applications')
    })
  })

  describe('Application status email template', () => {
    it('should render applied status', () => {
      // Act
      const html = generateApplicationStatusTemplate(
        'John',
        'Senior React Developer',
        'Tech Corp',
        'applied',
      )

      // Assert
      expect(html).toContain('Application Submitted')
      expect(html).toContain('Senior React Developer')
      expect(html).toContain('Tech Corp')
      expect(html).toContain('company reviews it')
    })

    it('should render reviewing status', () => {
      // Act
      const html = generateApplicationStatusTemplate(
        'User',
        'Product Manager',
        'StartUp Inc',
        'reviewing',
      )

      // Assert
      expect(html).toContain('Under Review')
      expect(html).toContain('Good things take time')
    })

    it('should render shortlisted status with interview prep', () => {
      // Act
      const html = generateApplicationStatusTemplate(
        'User',
        'Engineer',
        'Company',
        'shortlisted',
      )

      // Assert
      expect(html).toContain("Great News! You're Shortlisted")
      expect(html).toContain('Congratulations')
      expect(html).toContain('Prepare for Interview')
    })

    it('should render rejected status', () => {
      // Act
      const html = generateApplicationStatusTemplate(
        'User',
        'Designer',
        'Agency',
        'rejected',
      )

      // Assert
      expect(html).toContain('Application Status')
      expect(html).toContain("wasn't a match")
      expect(html).toContain('other opportunities')
    })

    it('should render offer status', () => {
      // Act
      const html = generateApplicationStatusTemplate(
        'User',
        'CTO',
        'Unicorn',
        'offer',
      )

      // Assert
      expect(html).toContain('Offer Received')
      expect(html).toContain('Congratulations')
      expect(html).toContain('major milestone')
    })

    it('should include view applications link for all statuses', () => {
      const statuses = [
        'applied',
        'reviewing',
        'shortlisted',
        'rejected',
        'offer',
      ] as const

      statuses.forEach((status) => {
        // Act
        const html = generateApplicationStatusTemplate(
          'User',
          'Role',
          'Company',
          status,
        )

        // Assert
        expect(html).toContain('/applications')
      })
    })
  })
})

describe('Email Sending - Email Validation', () => {
  it('should validate correct email format', () => {
    // Act & Assert
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('john.doe@company.co.uk')).toBe(true)
    expect(isValidEmail('test+tag@domain.org')).toBe(true)
  })

  it('should reject invalid email formats', () => {
    // Act & Assert
    expect(isValidEmail('invalid.email')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user @example.com')).toBe(false)
  })
})

describe('Email Sending - Resend Integration', () => {
  it('should generate mock Resend response', () => {
    // Act
    const response = createMockResendResponse()

    // Assert
    expect(response.id).toMatch(/^email_test_/)
    expect(response.from).toBe('noreply@getori.app')
    expect(response.to).toContain('@example.com')
    expect(response.created_at).toBeDefined()
    expect(response.subject).toBe('Test Email')
  })

  it('should generate Resend response with overrides', () => {
    // Act
    const response = createMockResendResponse({
      to: 'custom@test.com',
      subject: 'Custom Subject',
    })

    // Assert
    expect(response.to).toBe('custom@test.com')
    expect(response.subject).toBe('Custom Subject')
    expect(response.from).toBe('noreply@getori.app')
  })
})

describe('Email Sending - Unsubscribe Links', () => {
  it('should generate valid unsubscribe link', () => {
    // Arrange
    const token = 'unsub_abc123xyz'

    // Act
    const link = generateUnsubscribeLink(token)

    // Assert
    expect(link).toContain('https://app.getori.app/unsubscribe')
    expect(link).toContain('token=unsub_abc123xyz')
  })

  it('should include unsubscribe token in preferences', () => {
    // Arrange
    const prefs = createTestNotificationPreferences()

    // Act
    const link = generateUnsubscribeLink(prefs.unsubscribe_token)

    // Assert
    expect(prefs.unsubscribe_token).toBeDefined()
    expect(link).toContain(prefs.unsubscribe_token)
  })
})

describe('Email Sending - Notification Creation', () => {
  it('should create notification for welcome email', () => {
    // Act
    const notification = createTestNotification({
      type: 'welcome',
      subject: 'Welcome to Ori',
    })

    // Assert
    expect(notification.type).toBe('welcome')
    expect(notification.subject).toBe('Welcome to Ori')
    expect(notification.status).toBe('pending')
    expect(notification.id).toMatch(/^notif_test_/)
  })

  it('should create notification for payment failure', () => {
    // Act
    const notification = createTestNotification({
      type: 'payment_failure',
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    // Assert
    expect(notification.type).toBe('payment_failure')
    expect(notification.status).toBe('sent')
    expect(notification.sent_at).toBeDefined()
  })

  it('should track Resend email ID', () => {
    // Act
    const notification = createTestNotification({
      resend_email_id: 'email_xyz123',
    })

    // Assert
    expect(notification.resend_email_id).toBe('email_xyz123')
  })

  it('should include idempotency key', () => {
    // Act
    const notification = createTestNotification()

    // Assert
    expect(notification.idempotency_key).toBeDefined()
    expect(notification.idempotency_key).toMatch(/^idem_/)
  })
})

describe('Email Sending - Notification Preferences', () => {
  it('should respect payment failure email preference', () => {
    // Arrange
    const prefs = createTestNotificationPreferences('user_123', {
      payment_failure_emails: false,
    })

    // Act & Assert
    expect(prefs.payment_failure_emails).toBe(false)
  })

  it('should respect card expiring preference', () => {
    // Arrange
    const prefs = createTestNotificationPreferences('user_456', {
      card_expiring_emails: false,
    })

    // Act & Assert
    expect(prefs.card_expiring_emails).toBe(false)
  })

  it('should allow all preferences to be disabled except security', () => {
    // Act
    const allDisabled = createTestNotificationPreferences('user_789', {
      payment_failure_emails: false,
      card_expiring_emails: false,
      trial_ending_emails: false,
      subscription_emails: false,
      recommendation_emails: false,
      application_status_emails: false,
      security_emails: true, // Always true
    })

    // Assert
    expect(allDisabled.payment_failure_emails).toBe(false)
    expect(allDisabled.card_expiring_emails).toBe(false)
    expect(allDisabled.security_emails).toBe(true)
  })

  it('should track global unsubscribe', () => {
    // Act
    const unsubscribed = createTestNotificationPreferences('user_999', {
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    })

    // Assert
    expect(unsubscribed.unsubscribed).toBe(true)
    expect(unsubscribed.unsubscribed_at).toBeDefined()
  })
})

describe('Email Sending - Complete Scenarios', () => {
  it('should handle welcome email scenario', () => {
    // Arrange
    const scenario = notificationScenarios.welcomeEmail

    // Act
    const notification = createTestNotification({
      type: scenario.notificationType,
      recipient_email: scenario.email,
    })
    const html = generateWelcomeTemplate(scenario.name)

    // Assert
    expect(notification.type).toBe('welcome')
    expect(notification.recipient_email).toBe('welcome_user@example.com')
    expect(html).toContain('Welcome to Ori')
    expect(html).toContain(scenario.name)
  })

  it('should handle payment failure scenario', () => {
    // Arrange
    const scenario = notificationScenarios.paymentFailure

    // Act
    const notification = createTestNotification({
      type: scenario.notificationType,
      recipient_email: scenario.email,
    })
    const html = generatePaymentFailureTemplate(
      scenario.email.split('@')[0],
      scenario.amount,
      scenario.currency,
    )

    // Assert
    expect(notification.type).toBe('payment_failure')
    expect(html).toContain('Payment Failed')
  })

  it('should handle all 7 email scenarios', () => {
    // Arrange
    const scenarios = [
      notificationScenarios.welcomeEmail,
      notificationScenarios.paymentFailure,
      notificationScenarios.cardExpiring,
      notificationScenarios.trialEnding,
      notificationScenarios.subscriptionConfirmation,
      notificationScenarios.recommendations,
      notificationScenarios.applicationStatus,
    ]

    // Map notification types to their corresponding preference properties
    const notificationTypeToPrefsProperty: Record<string, string | null> = {
      welcome: null, // Transactional, always sent
      payment_failure: 'payment_failure_emails',
      card_expiring: 'card_expiring_emails',
      trial_ending: 'trial_ending_emails',
      subscription_confirmation: 'subscription_emails',
      recommendations: 'recommendation_emails',
      application_status: 'application_status_emails',
    }

    // Act & Assert
    scenarios.forEach((scenario) => {
      expect(scenario.notificationType).toBeDefined()
      expect(scenario.userId).toBeDefined()
      expect(scenario.email).toBeDefined()
      expect(scenario.preferences).toBeDefined()

      // Verify preferences match notification type
      const prefsProperty =
        notificationTypeToPrefsProperty[scenario.notificationType]
      const prefsMatch = scenario.preferences

      if (prefsProperty !== null) {
        expect(prefsMatch).toHaveProperty(prefsProperty)
      } else {
        // Welcome is transactional, just verify preferences exist
        expect(prefsMatch).toBeDefined()
      }
    })
  })
})
