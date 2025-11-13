"use strict";
/**
 * Resend Email Service
 *
 * Wrapper around Resend API for sending transactional and marketing emails.
 * Handles email template rendering, error handling, and notification tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
exports.getResendClient = getResendClient;
exports.generateWelcomeTemplate = generateWelcomeTemplate;
exports.generatePaymentFailureTemplate = generatePaymentFailureTemplate;
exports.generateCardExpiringTemplate = generateCardExpiringTemplate;
exports.generateTrialEndingTemplate = generateTrialEndingTemplate;
exports.generateSubscriptionConfirmationTemplate = generateSubscriptionConfirmationTemplate;
exports.generateRecommendationsTemplate = generateRecommendationsTemplate;
exports.generateApplicationStatusTemplate = generateApplicationStatusTemplate;
/**
 * Resend API client configuration
 * Uses environment variable RESEND_API_KEY
 */
class ResendClient {
    apiKey;
    baseUrl = 'https://api.resend.com';
    fromEmail = 'noreply@getori.app';
    fromName = 'Ori';
    constructor() {
        this.apiKey = process.env.RESEND_API_KEY || '';
        if (!this.apiKey && process.env.NODE_ENV === 'production') {
            throw new Error('RESEND_API_KEY environment variable is required');
        }
    }
    /**
     * Send email via Resend API
     */
    async send(params) {
        if (!this.apiKey) {
            return this.mockSend(params);
        }
        try {
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `${this.fromName} <${this.fromEmail}>`,
                    to: params.to,
                    subject: params.subject,
                    html: params.html,
                    text: params.text,
                    reply_to: params.replyTo,
                }),
            });
            if (!response.ok) {
                throw new Error(`Resend API error: ${response.statusText}`);
            }
            return response.json();
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Mock send for testing/development
     */
    mockSend(params) {
        const id = `email_${Math.random().toString(36).substr(2, 9)}`;
        return {
            id,
            from: `${this.fromName} <${this.fromEmail}>`,
            to: params.to,
            created_at: new Date().toISOString(),
        };
    }
}
// Singleton instance
let resendClient = null;
function getResendClient() {
    if (!resendClient) {
        resendClient = new ResendClient();
    }
    return resendClient;
}
/**
 * Email sending service
 * Higher-level API for sending specific email types
 */
exports.emailService = {
    /**
     * Send welcome email
     */
    sendWelcome: async (email, name) => {
        const client = getResendClient();
        const html = generateWelcomeTemplate(name);
        const response = await client.send({
            to: email,
            subject: 'Welcome to Ori - Your AI Career Companion',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send payment failure email
     */
    sendPaymentFailure: async (email, name, amount, currency = 'USD') => {
        const client = getResendClient();
        const html = generatePaymentFailureTemplate(name, amount, currency);
        const response = await client.send({
            to: email,
            subject: 'Payment Failed - Action Required',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send card expiring email
     */
    sendCardExpiring: async (email, name, brand, lastFour, expiryMonth, expiryYear) => {
        const client = getResendClient();
        const html = generateCardExpiringTemplate(name, brand, lastFour, expiryMonth, expiryYear);
        const response = await client.send({
            to: email,
            subject: 'Your Payment Method Expires Soon',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send trial ending email
     */
    sendTrialEnding: async (email, name, daysRemaining, planName, price) => {
        const client = getResendClient();
        const html = generateTrialEndingTemplate(name, daysRemaining, planName, price);
        const response = await client.send({
            to: email,
            subject: 'Your Free Trial Ends Soon',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send subscription confirmation email
     */
    sendSubscriptionConfirmation: async (email, name, planName, price, billingCycle) => {
        const client = getResendClient();
        const html = generateSubscriptionConfirmationTemplate(name, planName, price, billingCycle);
        const response = await client.send({
            to: email,
            subject: 'Subscription Confirmed',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send recommendations email
     */
    sendRecommendations: async (email, name, jobCount, topSkills) => {
        const client = getResendClient();
        const html = generateRecommendationsTemplate(name, jobCount, topSkills);
        const response = await client.send({
            to: email,
            subject: 'Your Weekly Job Recommendations',
            html,
        });
        return { id: response.id };
    },
    /**
     * Send application status email
     */
    sendApplicationStatus: async (email, name, jobTitle, company, status) => {
        const client = getResendClient();
        const html = generateApplicationStatusTemplate(name, jobTitle, company, status);
        const response = await client.send({
            to: email,
            subject: 'Job Application Update',
            html,
        });
        return { id: response.id };
    },
};
// ============================================================================
// EMAIL TEMPLATE GENERATORS (Brand-aligned HTML)
// ============================================================================
/**
 * Brand color palette
 */
const brandColors = {
    primary: '#3b82f6', // Blue
    secondary: '#1f2937', // Dark gray
    accent: '#10b981', // Green (for success)
    warning: '#f59e0b', // Amber (for alerts)
    danger: '#ef4444', // Red (for errors)
    background: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    textLight: '#6b7280',
};
/**
 * Base email template wrapper
 */
function baseTemplate(content, unsubscribeToken) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: ${brandColors.text};
            background-color: #f5f5f5;
            padding: 20px;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }

          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
          }

          .header p {
            font-size: 14px;
            opacity: 0.9;
          }

          .content {
            padding: 40px;
          }

          .content h2 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: ${brandColors.text};
          }

          .content p {
            font-size: 14px;
            line-height: 1.6;
            color: ${brandColors.textLight};
            margin-bottom: 15px;
          }

          .button {
            display: inline-block;
            background-color: ${brandColors.primary};
            color: white;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin: 20px 0;
            transition: background-color 0.2s;
          }

          .button:hover {
            background-color: #2563eb;
          }

          .button-secondary {
            background-color: ${brandColors.accent};
          }

          .button-secondary:hover {
            background-color: #059669;
          }

          .alert {
            background-color: #fef3c7;
            border-left: 4px solid ${brandColors.warning};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #92400e;
            font-size: 13px;
          }

          .success {
            background-color: #d1fae5;
            border-left: 4px solid ${brandColors.accent};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #065f46;
            font-size: 13px;
          }

          .footer {
            background-color: ${brandColors.background};
            border-top: 1px solid ${brandColors.border};
            padding: 30px 40px;
            font-size: 12px;
            color: ${brandColors.textLight};
            text-align: center;
          }

          .footer p {
            margin-bottom: 10px;
          }

          .footer a {
            color: ${brandColors.primary};
            text-decoration: none;
          }

          .divider {
            height: 1px;
            background-color: ${brandColors.border};
            margin: 20px 0;
          }

          .feature-list {
            list-style: none;
          }

          .feature-list li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
            font-size: 14px;
            color: ${brandColors.textLight};
          }

          .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: ${brandColors.accent};
            font-weight: bold;
          }

          .highlight {
            color: ${brandColors.primary};
            font-weight: 600;
          }

          @media (max-width: 600px) {
            .content {
              padding: 20px;
            }

            .header {
              padding: 30px 20px;
            }

            .header h1 {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ori</h1>
            <p>Your AI Career Companion</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© 2024 Ori. All rights reserved.</p>
            ${unsubscribeToken ? `<p><a href="https://app.getori.app/unsubscribe?token=${unsubscribeToken}">Unsubscribe from emails</a></p>` : ''}
            <p><a href="https://getori.app">Visit our website</a> | <a href="https://app.getori.app/settings/notifications">Manage preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
/**
 * Welcome template
 */
function generateWelcomeTemplate(name) {
    const content = `
    <h2>Welcome to Ori, ${name}! 🎉</h2>
    <p>We're thrilled to have you on board. Ori is your personal AI career companion, designed to help you discover and pursue fulfilling professional roles through personalized guidance.</p>

    <div class="success">
      <strong>Your journey starts here.</strong> Get ready to discover career opportunities tailored just for you.
    </div>

    <h3 style="font-size: 16px; font-weight: 600; margin-top: 30px; margin-bottom: 15px;">What you can do with Ori:</h3>
    <ul class="feature-list">
      <li>Discover job opportunities perfectly matched to your skills and goals</li>
      <li>Get personalized career guidance from our AI advisor</li>
      <li>Track and manage your job applications</li>
      <li>Develop new skills with our upskilling recommendations</li>
      <li>Get insights into market trends and emerging opportunities</li>
    </ul>

    <p style="margin-top: 30px;">To get started, let's help you complete your profile with your career information and goals.</p>

    <center>
      <a href="https://app.getori.app/onboarding" class="button">Complete Your Profile</a>
    </center>

    <p style="margin-top: 20px; font-size: 13px;">Have questions? <a href="mailto:support@getori.app" style="color: ${brandColors.primary};">Reach out to our support team</a></p>
  `;
    return baseTemplate(content);
}
/**
 * Payment failure template
 */
function generatePaymentFailureTemplate(name, amount, currency) {
    const content = `
    <h2>Payment Failed ⚠️</h2>
    <p>Hi ${name},</p>

    <div class="alert">
      <strong>Action Required:</strong> We couldn't process a payment of ${currency === 'USD' ? '$' : ''}${(amount / 100).toFixed(2)} ${currency} for your Ori subscription.
    </div>

    <p>This could be due to:</p>
    <ul style="margin: 15px 0; margin-left: 20px; color: ${brandColors.textLight}; font-size: 14px;">
      <li>Insufficient funds</li>
      <li>Expired or invalid card</li>
      <li>Temporary issue with your bank</li>
    </ul>

    <p><strong>Don't worry!</strong> Your access is still active. Please update your payment method to continue uninterrupted access to Ori.</p>

    <center>
      <a href="https://app.getori.app/settings/billing" class="button">Update Payment Method</a>
    </center>

    <p style="margin-top: 20px; font-size: 13px;">We'll retry the payment in a few days. If the issue persists, please contact our support team at <a href="mailto:support@getori.app" style="color: ${brandColors.primary};">support@getori.app</a></p>
  `;
    return baseTemplate(content);
}
/**
 * Card expiring template
 */
function generateCardExpiringTemplate(name, brand, lastFour, expiryMonth, expiryYear) {
    const content = `
    <h2>Your Payment Method Expires Soon 📅</h2>
    <p>Hi ${name},</p>

    <div class="alert">
      Your <strong>${brand}</strong> card ending in <strong>${lastFour}</strong> expires on <strong>${expiryMonth}/${expiryYear}</strong>.
    </div>

    <p>To avoid any interruption to your Ori subscription, please update your payment method now.</p>

    <center>
      <a href="https://app.getori.app/settings/billing" class="button">Update Payment Method</a>
    </center>

    <p style="margin-top: 20px; font-size: 13px;">If you have any questions, reach out to us at <a href="mailto:support@getori.app" style="color: ${brandColors.primary};">support@getori.app</a></p>
  `;
    return baseTemplate(content);
}
/**
 * Trial ending template
 */
function generateTrialEndingTemplate(name, daysRemaining, planName, price) {
    const content = `
    <h2>Your Free Trial Ends ${daysRemaining === 1 ? 'Tomorrow' : `in ${daysRemaining} Days`} ⏰</h2>
    <p>Hi ${name},</p>

    <p>We hope you've been enjoying Ori! Your free trial of our <span class="highlight">${planName}</span> plan ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.</p>

    <p>Continue your career journey with Ori for just <span class="highlight">$${(price / 100).toFixed(2)}/month</span>.</p>

    <h3 style="font-size: 16px; font-weight: 600; margin-top: 25px; margin-bottom: 15px;">Your ${planName} Plan includes:</h3>
    <ul class="feature-list">
      <li>Personalized job recommendations every week</li>
      <li>AI-powered career guidance</li>
      <li>Advanced market insights and trends</li>
      <li>Priority support</li>
    </ul>

    <center>
      <a href="https://app.getori.app/select-plan" class="button button-secondary" style="background-color: ${brandColors.accent};">Continue Your Subscription</a>
    </center>

    <p style="margin-top: 20px; font-size: 13px;">Need help deciding? <a href="mailto:support@getori.app" style="color: ${brandColors.primary};">Contact our team</a> for a personalized recommendation.</p>
  `;
    return baseTemplate(content);
}
/**
 * Subscription confirmation template
 */
function generateSubscriptionConfirmationTemplate(name, planName, price, billingCycle) {
    const cycleText = billingCycle === 'monthly' ? 'per month' : 'per year';
    const nextBillingDate = billingCycle === 'monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const content = `
    <h2>Subscription Confirmed ✓</h2>
    <p>Hi ${name},</p>

    <div class="success">
      <strong>Welcome to ${planName}!</strong> Your subscription is now active.
    </div>

    <h3 style="font-size: 14px; font-weight: 600; margin-top: 25px; margin-bottom: 15px;">Subscription Details:</h3>
    <table style="width: 100%; font-size: 14px; color: ${brandColors.textLight};">
      <tr style="border-bottom: 1px solid ${brandColors.border};">
        <td style="padding: 10px 0;">Plan:</td>
        <td style="padding: 10px 0; text-align: right; color: ${brandColors.text}; font-weight: 600;">${planName}</td>
      </tr>
      <tr style="border-bottom: 1px solid ${brandColors.border};">
        <td style="padding: 10px 0;">Price:</td>
        <td style="padding: 10px 0; text-align: right; color: ${brandColors.text}; font-weight: 600;">$${(price / 100).toFixed(2)} ${cycleText}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">Next Billing:</td>
        <td style="padding: 10px 0; text-align: right; color: ${brandColors.text}; font-weight: 600;">${nextBillingDate}</td>
      </tr>
    </table>

    <p style="margin-top: 25px;">You can now access all premium features. Head to your dashboard to start discovering personalized opportunities.</p>

    <center>
      <a href="https://app.getori.app/dashboard" class="button">Go to Dashboard</a>
    </center>

    <p style="margin-top: 20px; font-size: 13px;">You can manage your subscription at any time in your <a href="https://app.getori.app/settings/billing" style="color: ${brandColors.primary};">billing settings</a>.</p>
  `;
    return baseTemplate(content);
}
/**
 * Recommendations template
 */
function generateRecommendationsTemplate(name, jobCount, topSkills) {
    const skillsList = topSkills.slice(0, 5).join(', ');
    const content = `
    <h2>Your Weekly Job Recommendations 📋</h2>
    <p>Hi ${name},</p>

    <p>We found <span class="highlight">${jobCount} great opportunities</span> this week that match your profile and career goals.</p>

    <p>Based on your top skills in ${skillsList}, here are roles that align with your expertise:</p>

    <div class="success">
      <strong>Check out your personalized recommendations</strong> and start applying to roles that excite you!
    </div>

    <center>
      <a href="https://app.getori.app/recommendations" class="button">View All Recommendations</a>
    </center>

    <h3 style="font-size: 14px; font-weight: 600; margin-top: 25px; margin-bottom: 10px;">Quick Tips:</h3>
    <ul class="feature-list">
      <li>Update your profile regularly to get better matches</li>
      <li>Use our AI advisor to help prepare for interviews</li>
      <li>Track your applications to stay organized</li>
    </ul>

    <p style="margin-top: 20px; font-size: 13px;">Not interested in weekly emails? <a href="https://app.getori.app/settings/notifications" style="color: ${brandColors.primary};">Manage your preferences</a></p>
  `;
    return baseTemplate(content);
}
/**
 * Application status template
 */
function generateApplicationStatusTemplate(name, jobTitle, company, status) {
    const statusMessages = {
        applied: {
            title: 'Application Submitted',
            message: "Your application has been sent! We'll notify you when the company reviews it.",
            color: '#3b82f6',
        },
        reviewing: {
            title: 'Under Review',
            message: 'The company is reviewing your application. Good things take time!',
            color: '#f59e0b',
        },
        shortlisted: {
            title: 'Great News! You\'re Shortlisted',
            message: 'Congratulations! The company would like to move forward with your application.',
            color: '#10b981',
        },
        rejected: {
            title: 'Application Status',
            message: 'While this role wasn\'t a match, don\'t worry! We have many other opportunities for you.',
            color: '#ef4444',
        },
        offer: {
            title: '🎉 Offer Received!',
            message: 'Congratulations! You\'ve received an offer. This is a major milestone!',
            color: '#10b981',
        },
    };
    const statusInfo = statusMessages[status] || statusMessages.applied;
    const content = `
    <h2>${statusInfo.title}</h2>
    <p>Hi ${name},</p>

    <div style="border-left: 4px solid ${statusInfo.color}; background-color: ${statusInfo.color}15; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="color: ${brandColors.text}; margin: 0;"><strong>${jobTitle}</strong> at <strong>${company}</strong></p>
      <p style="color: ${brandColors.textLight}; margin-top: 8px; margin-bottom: 0;">${statusInfo.message}</p>
    </div>

    ${status === 'shortlisted' ? `
      <p><strong>Next Steps:</strong></p>
      <ul style="margin: 15px 0; margin-left: 20px; color: ${brandColors.textLight}; font-size: 14px;">
        <li>Prepare for interviews with our AI advisor</li>
        <li>Review the company's recent news and products</li>
        <li>Practice common interview questions</li>
      </ul>

      <center>
        <a href="https://app.getori.app/applications" class="button">Prepare for Interview</a>
      </center>
    ` : `
      <center>
        <a href="https://app.getori.app/applications" class="button">View Your Applications</a>
      </center>
    `}

    <p style="margin-top: 20px; font-size: 13px;">Keep applying! Every application brings you closer to your dream role. <a href="https://app.getori.app/recommendations" style="color: ${brandColors.primary};">View more opportunities</a></p>
  `;
    return baseTemplate(content);
}
//# sourceMappingURL=resend.js.map