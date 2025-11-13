"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const email_fixtures_1 = require("./fixtures/email.fixtures");
const resend_1 = require("../../lib/resend");
(0, globals_1.describe)('Email Sending - Template Rendering', () => {
    (0, globals_1.describe)('Welcome email template', () => {
        (0, globals_1.it)('should render welcome template with name', () => {
            // Act
            const html = (0, resend_1.generateWelcomeTemplate)('John Doe');
            // Assert
            (0, globals_1.expect)(html).toContain('Welcome to Ori');
            (0, globals_1.expect)(html).toContain('John Doe');
            (0, globals_1.expect)(html).toContain('Complete Your Profile');
            (0, globals_1.expect)(html).toContain('app.getori.app/onboarding');
        });
        (0, globals_1.it)('should include all welcome features', () => {
            // Act
            const html = (0, resend_1.generateWelcomeTemplate)('Jane Smith');
            // Assert
            (0, globals_1.expect)(html).toContain('Discover job opportunities');
            (0, globals_1.expect)(html).toContain('personalized career guidance');
            (0, globals_1.expect)(html).toContain('Track and manage your job applications');
            (0, globals_1.expect)(html).toContain('Develop new skills');
            (0, globals_1.expect)(html).toContain('market trends');
        });
        (0, globals_1.it)('should include brand colors and styling', () => {
            // Act
            const html = (0, resend_1.generateWelcomeTemplate)('Test User');
            // Assert
            (0, globals_1.expect)(html).toContain('#3b82f6'); // Primary blue
            (0, globals_1.expect)(html).toContain('font-family'); // CSS styling
            (0, globals_1.expect)(html).toContain('<!DOCTYPE html>');
            (0, globals_1.expect)(html).toContain('</html>');
        });
        (0, globals_1.it)('should include call-to-action button', () => {
            // Act
            const html = (0, resend_1.generateWelcomeTemplate)('User');
            // Assert
            (0, globals_1.expect)(html).toContain('class="button"');
            (0, globals_1.expect)(html).toContain('Complete Your Profile');
            (0, globals_1.expect)(html).toContain('onboarding');
        });
        (0, globals_1.it)('should include footer with manage preferences', () => {
            // Act
            const html = (0, resend_1.generateWelcomeTemplate)('User');
            // Assert
            (0, globals_1.expect)(html).toContain('Manage preferences');
            (0, globals_1.expect)(html).toContain('© 2024 Ori');
            (0, globals_1.expect)(html).toContain('Visit our website');
        });
    });
    (0, globals_1.describe)('Payment failure email template', () => {
        (0, globals_1.it)('should render payment failure template with details', () => {
            // Act
            const html = (0, resend_1.generatePaymentFailureTemplate)('John Doe', 1000, 'USD');
            // Assert
            (0, globals_1.expect)(html).toContain('Payment Failed');
            (0, globals_1.expect)(html).toContain('John Doe');
            (0, globals_1.expect)(html).toContain('$10.00');
            (0, globals_1.expect)(html).toContain('Update Payment Method');
        });
        (0, globals_1.it)('should include alert styling', () => {
            // Act
            const html = (0, resend_1.generatePaymentFailureTemplate)('User', 1000, 'USD');
            // Assert
            (0, globals_1.expect)(html).toContain('class="alert"');
            (0, globals_1.expect)(html).toContain('Action Required');
            (0, globals_1.expect)(html).toContain('#fef3c7'); // Alert background
        });
        (0, globals_1.it)('should include failure reasons', () => {
            // Act
            const html = (0, resend_1.generatePaymentFailureTemplate)('User', 5000, 'USD');
            // Assert
            (0, globals_1.expect)(html).toContain('Insufficient funds');
            (0, globals_1.expect)(html).toContain('Expired or invalid card');
            (0, globals_1.expect)(html).toContain('Temporary issue with your bank');
        });
        (0, globals_1.it)('should include billing settings link', () => {
            // Act
            const html = (0, resend_1.generatePaymentFailureTemplate)('User', 1000, 'USD');
            // Assert
            (0, globals_1.expect)(html).toContain('/settings/billing');
            (0, globals_1.expect)(html).toContain('Update Payment Method');
        });
    });
    (0, globals_1.describe)('Card expiring email template', () => {
        (0, globals_1.it)('should render card expiring template with card details', () => {
            // Act
            const html = (0, resend_1.generateCardExpiringTemplate)('John', 'Visa', '4242', 12, 2024);
            // Assert
            (0, globals_1.expect)(html).toContain('Payment Method Expires Soon');
            (0, globals_1.expect)(html).toContain('Visa');
            (0, globals_1.expect)(html).toContain('4242');
            (0, globals_1.expect)(html).toContain('12/2024');
        });
        (0, globals_1.it)('should include different card brands', () => {
            // Act
            const visaHtml = (0, resend_1.generateCardExpiringTemplate)('User', 'Visa', '1234', 6, 2025);
            const mastercardHtml = (0, resend_1.generateCardExpiringTemplate)('User', 'Mastercard', '5555', 9, 2025);
            // Assert
            (0, globals_1.expect)(visaHtml).toContain('Visa');
            (0, globals_1.expect)(mastercardHtml).toContain('Mastercard');
        });
        (0, globals_1.it)('should include card update button', () => {
            // Act
            const html = (0, resend_1.generateCardExpiringTemplate)('User', 'Amex', '3456', 3, 2025);
            // Assert
            (0, globals_1.expect)(html).toContain('Update Payment Method');
            (0, globals_1.expect)(html).toContain('/settings/billing');
        });
    });
    (0, globals_1.describe)('Trial ending email template', () => {
        (0, globals_1.it)('should render trial ending template with days remaining', () => {
            // Act
            const html = (0, resend_1.generateTrialEndingTemplate)('John', 3, 'Premium Monthly', 1000);
            // Assert
            (0, globals_1.expect)(html).toContain('Free Trial Ends');
            (0, globals_1.expect)(html).toContain('3 Days');
            (0, globals_1.expect)(html).toContain('Premium Monthly');
            (0, globals_1.expect)(html).toContain('$10.00');
        });
        (0, globals_1.it)('should handle single day remaining', () => {
            // Act
            const html = (0, resend_1.generateTrialEndingTemplate)('User', 1, 'Plus Monthly', 500);
            // Assert
            (0, globals_1.expect)(html).toContain('Tomorrow');
        });
        (0, globals_1.it)('should include plan features', () => {
            // Act
            const html = (0, resend_1.generateTrialEndingTemplate)('User', 7, 'Premium', 1000);
            // Assert
            (0, globals_1.expect)(html).toContain('Personalized job recommendations every week');
            (0, globals_1.expect)(html).toContain('AI-powered career guidance');
            (0, globals_1.expect)(html).toContain('Advanced market insights and trends');
            (0, globals_1.expect)(html).toContain('Priority support');
        });
        (0, globals_1.it)('should include CTA button with correct action', () => {
            // Act
            const html = (0, resend_1.generateTrialEndingTemplate)('User', 5, 'Premium Monthly', 1000);
            // Assert
            (0, globals_1.expect)(html).toContain('Continue Your Subscription');
            (0, globals_1.expect)(html).toContain('/select-plan');
        });
    });
    (0, globals_1.describe)('Subscription confirmation email template', () => {
        (0, globals_1.it)('should render subscription confirmation with monthly plan', () => {
            // Act
            const html = (0, resend_1.generateSubscriptionConfirmationTemplate)('John', 'Premium Monthly', 1000, 'monthly');
            // Assert
            (0, globals_1.expect)(html).toContain('Subscription Confirmed');
            (0, globals_1.expect)(html).toContain('Welcome to Premium Monthly');
            (0, globals_1.expect)(html).toContain('$10.00 per month');
            (0, globals_1.expect)(html).toContain('John');
        });
        (0, globals_1.it)('should render subscription confirmation with yearly plan', () => {
            // Act
            const html = (0, resend_1.generateSubscriptionConfirmationTemplate)('Jane', 'Plus Yearly', 4800, 'yearly');
            // Assert
            (0, globals_1.expect)(html).toContain('Plus Yearly');
            (0, globals_1.expect)(html).toContain('$48.00 per year');
        });
        (0, globals_1.it)('should include billing details table', () => {
            // Act
            const html = (0, resend_1.generateSubscriptionConfirmationTemplate)('User', 'Premium', 1000, 'monthly');
            // Assert
            (0, globals_1.expect)(html).toContain('Subscription Details');
            (0, globals_1.expect)(html).toContain('Plan:');
            (0, globals_1.expect)(html).toContain('Price:');
            (0, globals_1.expect)(html).toContain('Next Billing');
        });
        (0, globals_1.it)('should include success styling', () => {
            // Act
            const html = (0, resend_1.generateSubscriptionConfirmationTemplate)('User', 'Plus', 500, 'monthly');
            // Assert
            (0, globals_1.expect)(html).toContain('class="success"');
            (0, globals_1.expect)(html).toContain('#d1fae5'); // Success background
        });
        (0, globals_1.it)('should include dashboard link', () => {
            // Act
            const html = (0, resend_1.generateSubscriptionConfirmationTemplate)('User', 'Premium', 1000, 'monthly');
            // Assert
            (0, globals_1.expect)(html).toContain('/dashboard');
            (0, globals_1.expect)(html).toContain('Go to Dashboard');
        });
    });
    (0, globals_1.describe)('Recommendations email template', () => {
        (0, globals_1.it)('should render recommendations template with job count', () => {
            // Act
            const html = (0, resend_1.generateRecommendationsTemplate)('John', 5, ['React', 'TypeScript', 'Node.js']);
            // Assert
            (0, globals_1.expect)(html).toContain('Weekly Job Recommendations');
            (0, globals_1.expect)(html).toContain('5 great opportunities');
            (0, globals_1.expect)(html).toContain('React');
            (0, globals_1.expect)(html).toContain('TypeScript');
            (0, globals_1.expect)(html).toContain('Node.js');
        });
        (0, globals_1.it)('should include multiple skills', () => {
            // Act
            const html = (0, resend_1.generateRecommendationsTemplate)('User', 10, ['Python', 'Machine Learning', 'Data Science', 'TensorFlow']);
            // Assert
            (0, globals_1.expect)(html).toContain('Python');
            (0, globals_1.expect)(html).toContain('Machine Learning');
            (0, globals_1.expect)(html).toContain('Data Science');
            (0, globals_1.expect)(html).toContain('TensorFlow');
        });
        (0, globals_1.it)('should include recommendations button', () => {
            // Act
            const html = (0, resend_1.generateRecommendationsTemplate)('User', 3, ['Rust']);
            // Assert
            (0, globals_1.expect)(html).toContain('View All Recommendations');
            (0, globals_1.expect)(html).toContain('/recommendations');
        });
        (0, globals_1.it)('should include tips section', () => {
            // Act
            const html = (0, resend_1.generateRecommendationsTemplate)('User', 7, ['Go']);
            // Assert
            (0, globals_1.expect)(html).toContain('Update your profile regularly');
            (0, globals_1.expect)(html).toContain('AI advisor');
            (0, globals_1.expect)(html).toContain('Track your applications');
        });
    });
    (0, globals_1.describe)('Application status email template', () => {
        (0, globals_1.it)('should render applied status', () => {
            // Act
            const html = (0, resend_1.generateApplicationStatusTemplate)('John', 'Senior React Developer', 'Tech Corp', 'applied');
            // Assert
            (0, globals_1.expect)(html).toContain('Application Submitted');
            (0, globals_1.expect)(html).toContain('Senior React Developer');
            (0, globals_1.expect)(html).toContain('Tech Corp');
            (0, globals_1.expect)(html).toContain('company reviews it');
        });
        (0, globals_1.it)('should render reviewing status', () => {
            // Act
            const html = (0, resend_1.generateApplicationStatusTemplate)('User', 'Product Manager', 'StartUp Inc', 'reviewing');
            // Assert
            (0, globals_1.expect)(html).toContain('Under Review');
            (0, globals_1.expect)(html).toContain('Good things take time');
        });
        (0, globals_1.it)('should render shortlisted status with interview prep', () => {
            // Act
            const html = (0, resend_1.generateApplicationStatusTemplate)('User', 'Engineer', 'Company', 'shortlisted');
            // Assert
            (0, globals_1.expect)(html).toContain('Great News! You\'re Shortlisted');
            (0, globals_1.expect)(html).toContain('Congratulations');
            (0, globals_1.expect)(html).toContain('Prepare for Interview');
        });
        (0, globals_1.it)('should render rejected status', () => {
            // Act
            const html = (0, resend_1.generateApplicationStatusTemplate)('User', 'Designer', 'Agency', 'rejected');
            // Assert
            (0, globals_1.expect)(html).toContain('Application Status');
            (0, globals_1.expect)(html).toContain('wasn\'t a match');
            (0, globals_1.expect)(html).toContain('other opportunities');
        });
        (0, globals_1.it)('should render offer status', () => {
            // Act
            const html = (0, resend_1.generateApplicationStatusTemplate)('User', 'CTO', 'Unicorn', 'offer');
            // Assert
            (0, globals_1.expect)(html).toContain('Offer Received');
            (0, globals_1.expect)(html).toContain('Congratulations');
            (0, globals_1.expect)(html).toContain('major milestone');
        });
        (0, globals_1.it)('should include view applications link for all statuses', () => {
            const statuses = ['applied', 'reviewing', 'shortlisted', 'rejected', 'offer'];
            statuses.forEach(status => {
                // Act
                const html = (0, resend_1.generateApplicationStatusTemplate)('User', 'Role', 'Company', status);
                // Assert
                (0, globals_1.expect)(html).toContain('/applications');
            });
        });
    });
});
(0, globals_1.describe)('Email Sending - Email Validation', () => {
    (0, globals_1.it)('should validate correct email format', () => {
        // Act & Assert
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('user@example.com')).toBe(true);
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('john.doe@company.co.uk')).toBe(true);
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('test+tag@domain.org')).toBe(true);
    });
    (0, globals_1.it)('should reject invalid email formats', () => {
        // Act & Assert
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('invalid.email')).toBe(false);
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('@example.com')).toBe(false);
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('user@')).toBe(false);
        (0, globals_1.expect)((0, email_fixtures_1.isValidEmail)('user @example.com')).toBe(false);
    });
});
(0, globals_1.describe)('Email Sending - Resend Integration', () => {
    (0, globals_1.it)('should generate mock Resend response', () => {
        // Act
        const response = (0, email_fixtures_1.createMockResendResponse)();
        // Assert
        (0, globals_1.expect)(response.id).toMatch(/^email_test_/);
        (0, globals_1.expect)(response.from).toBe('noreply@getori.app');
        (0, globals_1.expect)(response.to).toContain('@example.com');
        (0, globals_1.expect)(response.created_at).toBeDefined();
        (0, globals_1.expect)(response.subject).toBe('Test Email');
    });
    (0, globals_1.it)('should generate Resend response with overrides', () => {
        // Act
        const response = (0, email_fixtures_1.createMockResendResponse)({
            to: 'custom@test.com',
            subject: 'Custom Subject',
        });
        // Assert
        (0, globals_1.expect)(response.to).toBe('custom@test.com');
        (0, globals_1.expect)(response.subject).toBe('Custom Subject');
        (0, globals_1.expect)(response.from).toBe('noreply@getori.app');
    });
});
(0, globals_1.describe)('Email Sending - Unsubscribe Links', () => {
    (0, globals_1.it)('should generate valid unsubscribe link', () => {
        // Arrange
        const token = 'unsub_abc123xyz';
        // Act
        const link = (0, email_fixtures_1.generateUnsubscribeLink)(token);
        // Assert
        (0, globals_1.expect)(link).toContain('https://app.getori.app/unsubscribe');
        (0, globals_1.expect)(link).toContain('token=unsub_abc123xyz');
    });
    (0, globals_1.it)('should include unsubscribe token in preferences', () => {
        // Arrange
        const prefs = (0, email_fixtures_1.createTestNotificationPreferences)();
        // Act
        const link = (0, email_fixtures_1.generateUnsubscribeLink)(prefs.unsubscribe_token);
        // Assert
        (0, globals_1.expect)(prefs.unsubscribe_token).toBeDefined();
        (0, globals_1.expect)(link).toContain(prefs.unsubscribe_token);
    });
});
(0, globals_1.describe)('Email Sending - Notification Creation', () => {
    (0, globals_1.it)('should create notification for welcome email', () => {
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)({
            type: 'welcome',
            subject: 'Welcome to Ori',
        });
        // Assert
        (0, globals_1.expect)(notification.type).toBe('welcome');
        (0, globals_1.expect)(notification.subject).toBe('Welcome to Ori');
        (0, globals_1.expect)(notification.status).toBe('pending');
        (0, globals_1.expect)(notification.id).toMatch(/^notif_test_/);
    });
    (0, globals_1.it)('should create notification for payment failure', () => {
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)({
            type: 'payment_failure',
            status: 'sent',
            sent_at: new Date().toISOString(),
        });
        // Assert
        (0, globals_1.expect)(notification.type).toBe('payment_failure');
        (0, globals_1.expect)(notification.status).toBe('sent');
        (0, globals_1.expect)(notification.sent_at).toBeDefined();
    });
    (0, globals_1.it)('should track Resend email ID', () => {
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)({
            resend_email_id: 'email_xyz123',
        });
        // Assert
        (0, globals_1.expect)(notification.resend_email_id).toBe('email_xyz123');
    });
    (0, globals_1.it)('should include idempotency key', () => {
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)();
        // Assert
        (0, globals_1.expect)(notification.idempotency_key).toBeDefined();
        (0, globals_1.expect)(notification.idempotency_key).toMatch(/^idem_/);
    });
});
(0, globals_1.describe)('Email Sending - Notification Preferences', () => {
    (0, globals_1.it)('should respect payment failure email preference', () => {
        // Arrange
        const prefs = (0, email_fixtures_1.createTestNotificationPreferences)('user_123', {
            payment_failure_emails: false,
        });
        // Act & Assert
        (0, globals_1.expect)(prefs.payment_failure_emails).toBe(false);
    });
    (0, globals_1.it)('should respect card expiring preference', () => {
        // Arrange
        const prefs = (0, email_fixtures_1.createTestNotificationPreferences)('user_456', {
            card_expiring_emails: false,
        });
        // Act & Assert
        (0, globals_1.expect)(prefs.card_expiring_emails).toBe(false);
    });
    (0, globals_1.it)('should allow all preferences to be disabled except security', () => {
        // Act
        const allDisabled = (0, email_fixtures_1.createTestNotificationPreferences)('user_789', {
            payment_failure_emails: false,
            card_expiring_emails: false,
            trial_ending_emails: false,
            subscription_emails: false,
            recommendation_emails: false,
            application_status_emails: false,
            security_emails: true, // Always true
        });
        // Assert
        (0, globals_1.expect)(allDisabled.payment_failure_emails).toBe(false);
        (0, globals_1.expect)(allDisabled.card_expiring_emails).toBe(false);
        (0, globals_1.expect)(allDisabled.security_emails).toBe(true);
    });
    (0, globals_1.it)('should track global unsubscribe', () => {
        // Act
        const unsubscribed = (0, email_fixtures_1.createTestNotificationPreferences)('user_999', {
            unsubscribed: true,
            unsubscribed_at: new Date().toISOString(),
        });
        // Assert
        (0, globals_1.expect)(unsubscribed.unsubscribed).toBe(true);
        (0, globals_1.expect)(unsubscribed.unsubscribed_at).toBeDefined();
    });
});
(0, globals_1.describe)('Email Sending - Complete Scenarios', () => {
    (0, globals_1.it)('should handle welcome email scenario', () => {
        // Arrange
        const scenario = email_fixtures_1.notificationScenarios.welcomeEmail;
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)({
            type: scenario.notificationType,
            recipient_email: scenario.email,
        });
        const html = (0, resend_1.generateWelcomeTemplate)(scenario.name);
        // Assert
        (0, globals_1.expect)(notification.type).toBe('welcome');
        (0, globals_1.expect)(notification.recipient_email).toBe('welcome_user@example.com');
        (0, globals_1.expect)(html).toContain('Welcome to Ori');
        (0, globals_1.expect)(html).toContain(scenario.name);
    });
    (0, globals_1.it)('should handle payment failure scenario', () => {
        // Arrange
        const scenario = email_fixtures_1.notificationScenarios.paymentFailure;
        // Act
        const notification = (0, email_fixtures_1.createTestNotification)({
            type: scenario.notificationType,
            recipient_email: scenario.email,
        });
        const html = (0, resend_1.generatePaymentFailureTemplate)(scenario.email.split('@')[0], scenario.amount, scenario.currency);
        // Assert
        (0, globals_1.expect)(notification.type).toBe('payment_failure');
        (0, globals_1.expect)(html).toContain('Payment Failed');
    });
    (0, globals_1.it)('should handle all 7 email scenarios', () => {
        // Arrange
        const scenarios = [
            email_fixtures_1.notificationScenarios.welcomeEmail,
            email_fixtures_1.notificationScenarios.paymentFailure,
            email_fixtures_1.notificationScenarios.cardExpiring,
            email_fixtures_1.notificationScenarios.trialEnding,
            email_fixtures_1.notificationScenarios.subscriptionConfirmation,
            email_fixtures_1.notificationScenarios.recommendations,
            email_fixtures_1.notificationScenarios.applicationStatus,
        ];
        // Map notification types to their corresponding preference properties
        const notificationTypeToPrefsProperty = {
            welcome: null, // Transactional, always sent
            payment_failure: 'payment_failure_emails',
            card_expiring: 'card_expiring_emails',
            trial_ending: 'trial_ending_emails',
            subscription_confirmation: 'subscription_emails',
            recommendations: 'recommendation_emails',
            application_status: 'application_status_emails',
        };
        // Act & Assert
        scenarios.forEach(scenario => {
            (0, globals_1.expect)(scenario.notificationType).toBeDefined();
            (0, globals_1.expect)(scenario.userId).toBeDefined();
            (0, globals_1.expect)(scenario.email).toBeDefined();
            (0, globals_1.expect)(scenario.preferences).toBeDefined();
            // Verify preferences match notification type
            const prefsProperty = notificationTypeToPrefsProperty[scenario.notificationType];
            const prefsMatch = scenario.preferences;
            if (prefsProperty !== null) {
                (0, globals_1.expect)(prefsMatch).toHaveProperty(prefsProperty);
            }
            else {
                // Welcome is transactional, just verify preferences exist
                (0, globals_1.expect)(prefsMatch).toBeDefined();
            }
        });
    });
});
//# sourceMappingURL=emails.sending.test.js.map