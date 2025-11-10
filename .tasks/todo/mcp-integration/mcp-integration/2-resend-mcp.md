# Task: Set up Resend MCP Server

**Assigned to:** Claude

## High-Level Goal

Integrate the Resend MCP Server to simplify our email marketing and user communications infrastructure. This will enable us to send and test transactional emails directly from our development environment.

## Detailed Requirements

1.  **Configure the Resend MCP Server:**
    *   Set up the Resend MCP server in our Claude Code environment.
    *   Ensure it is configured with the necessary API keys (from GitHub secrets).

2.  **Create an `EmailService`:**
    *   Create a new service in `services/core-api/src/services/email.ts`.
    *   This service should encapsulate all email-related logic and use the Resend MCP server for sending emails.
    *   It should provide a simple, high-level API for our application to use (e.g., `sendWelcomeEmail`, `sendJobRecommendationEmail`).

3.  **Create and Test Email Templates:**
    *   Create a new set of email templates for our transactional emails (e.g., welcome email, job recommendations, alerts).
    *   Use the Resend MCP server to send test emails and verify that the templates are rendered correctly.

## Acceptance Criteria

- [ ] The Resend MCP server is configured and running in our Claude Code environment.
- [ ] A new `EmailService` is created and encapsulates all email-related logic.
- [ ] A new set of email templates is created for our transactional emails.
- [ ] The email templates are tested using the Resend MCP server.
- [ ] All manual email testing is replaced by programmatic tests.
