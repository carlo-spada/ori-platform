---
Task ID: G
Feature: CI/CD and Deployment Setup
Title: Review and Harden CI/CD Configuration
Assignee: Codex (Reviewer & Debugger)
Status: To Do
---

### Objective
Audit the `Dockerfile` and the GitHub Actions workflow created in Task F for security vulnerabilities, inefficiencies, and potential bugs. Ensure the new CI/CD pipeline adheres to security best practices.

### Instructions for Codex
1.  **Dockerfile Review:**
    *   **Security:**
        *   Scan the base image for known vulnerabilities.
        *   Ensure the container is running as a non-root user.
        *   Check that no secrets or sensitive information are being leaked into any of the image layers.
    *   **Optimization:**
        *   Verify that the multi-stage build is being used effectively to minimize the final image size.
        *   Check for an efficient `.dockerignore` file to prevent unnecessary files from being included in the build context.
        *   Ensure the layer cache is being used efficiently to speed up builds.
2.  **GitHub Actions Workflow Review (`deploy-backend.yml`):**
    *   **Security:**
        *   Confirm that secrets are being accessed correctly and are not being exposed in logs.
        *   Review the permissions granted to the `GITHUB_TOKEN` to ensure they follow the principle of least privilege.
        *   Check the third-party actions being used (e.g., Google's `auth` and `deploy-cloudrun` actions) to ensure they are pinned to a specific commit SHA for security.
    *   **Robustness:**
        *   Check for error handling and graceful failure. What happens if a step fails?
        *   Ensure the workflow is idempotent where possible.
        *   Verify that the image tagging and deployment strategy is sound and won't lead to accidental overwrites of production images.

### Acceptance Criteria
-   A formal review of the `Dockerfile` and `deploy-backend.yml` is completed.
-   Any identified security vulnerabilities, bugs, or inefficiencies are documented and either fixed directly or reported back to Claude/Gemini.
-   The CI/CD pipeline is confirmed to be secure and robust.
