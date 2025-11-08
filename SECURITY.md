# Security Policy

The Ori Platform team takes security seriously. We appreciate your efforts to responsibly disclose your findings, and we will make every effort to acknowledge your contributions.

## Supported Versions

Our project is currently in a pre-1.0 release phase. As such, we do not have a stable, numbered versioning scheme. Security updates are applied to our `main` branch, which represents the latest supported version.

| Version | Supported          |
| ------- | ------------------ |
| Latest `main` commit   | :white_check_mark: |
| Previous commits   | :x:                |

## Reporting a Vulnerability

We are committed to working with the security community to resolve vulnerabilities and keep our users safe.

**DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please use the **private vulnerability reporting feature** provided by GitHub. You can do this by going to the "Security" tab of our repository and clicking on "Report a vulnerability".

### What to Expect

When you report a vulnerability through this private channel, you can expect the following process:

1.  **Acknowledgement**: We will acknowledge receipt of your report within **48 hours**.
2.  **Initial Triage**: Our team will review the report to determine if it's a valid security issue.
3.  **Investigation & Updates**: If the vulnerability is confirmed, we will begin our investigation and provide you with a progress update within **7 days**. We will keep you informed as we work on a fix.
4.  **Coordinated Disclosure**: Once the vulnerability is patched, we will coordinate with you on a public disclosure timeline. We will issue a GitHub Security Advisory to credit you for your discovery (unless you wish to remain anonymous).
5.  **Declined Reports**: If we determine that the issue you reported is not a security vulnerability, we will close the report with a justification.

## Our Security Practices

To provide a secure platform, we follow these best practices:

-   **Dependency Scanning**: We use Dependabot to automatically scan our dependencies for known vulnerabilities and create pull requests to address them.
-   **Code Scanning**: We use GitHub's CodeQL static analysis in our CI/CD pipeline to identify potential vulnerabilities in our code before it's merged.
-   **No Hardcoded Secrets**: We never commit secrets, API keys, or other sensitive credentials to the repository. These are managed through environment variables and secure vaults.
-   **Automated Policy Review**: This security policy is automatically reviewed on a monthly basis by our AI agent (Gemini) to ensure it stays aligned with our project's evolving practices.

Thank you for helping keep the Ori Platform secure.
