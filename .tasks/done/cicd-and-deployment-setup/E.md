---
Task ID: E
Feature: CI/CD and Deployment Setup
Title: Plan CI/CD Pipeline and Google Cloud Infrastructure
Assignee: Gemini (Planner & Researcher)
Status: Done
---

### Objective
Research and define a comprehensive CI/CD strategy for the Ori Platform. Design the backend infrastructure on Google Cloud Platform (GCP), specifically leveraging the serverless capabilities of Cloud Run.

### Plan

**1. CI/CD Pipeline (GitHub Actions)**

*   **Trigger:** The workflow will be triggered on pushes to the `main` branch.
*   **Jobs:**
    *   **`lint`:** Run `pnpm lint` to check for code quality.
    *   **`test`:** Run `pnpm test` to run all unit and integration tests.
    *   **`build`:** Build the `core-api` service and the Next.js frontend.
    *   **`deploy-backend`:** Deploy the `core-api` service to Google Cloud Run.
    *   **`deploy-frontend`:** Deploy the Next.js frontend to Vercel.
*   **Secret Management:** We will use GitHub Encrypted Secrets to store our GCP service account key, database password, and Stripe API key.

**2. Frontend Deployment (Vercel)**

*   We will continue to use the Vercel GitHub integration for our frontend.
*   We will configure environment variables for `staging` and `production` in the Vercel dashboard.
*   We will use Vercel's preview deployments for pull requests.

**3. Backend Infrastructure (GCP)**

*   **Compute:** We will use **Cloud Run** to host our `core-api` service. This will provide us with a serverless, scalable, and cost-effective solution.
*   **Containerization:** We will create a `Dockerfile` for the `core-api` service that will be used to build a production-ready Docker image.
*   **Database:** We will use **Cloud SQL** (PostgreSQL) as our managed database.
*   **Networking:** We will configure CORS policies on the `core-api` service to allow requests from our Vercel frontend.

**4. Implementation Details for Claude (Task F)**

*   **`Dockerfile`:**
    *   Use a multi-stage build to create a small, secure production image.
    *   The `build` stage will use `node:18-alpine` to install dependencies and build the TypeScript code.
    *   The `production` stage will use `gcr.io/distroless/nodejs18-debian11` and copy the compiled JavaScript and production dependencies from the `build` stage.
*   **`deploy-backend.yml`:**
    *   Use Google's `auth` action to authenticate with GCP.
    *   Use Google's `deploy-cloudrun` action to deploy the `core-api` service.
    *   Pass the necessary environment variables to the Cloud Run service from GitHub Secrets.