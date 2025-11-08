---
Task ID: F
Feature: CI/CD and Deployment Setup
Title: Implement Backend CI/CD Workflow and Dockerfile
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Based on the plan from Task E, create the necessary files and configurations to containerize the `core-api` backend service and set up a GitHub Actions workflow to automatically build and deploy it to Google Cloud Run.

### Instructions for Claude
1.  **Create a Dockerfile:**
    *   In the `services/core-api/` directory, create a new file named `Dockerfile`.
    *   Implement a multi-stage build process:
        *   The `build` stage should use a Node.js base image (e.g., `node:18-alpine`), install dependencies using `pnpm`, and build the TypeScript source code into JavaScript.
        *   The `production` stage should use a minimal base image (e.g., `gcr.io/distroless/nodejs18-debian11` or `node:18-alpine`).
        *   Copy only the necessary production dependencies (`node_modules`) and the compiled JavaScript from the `build` stage.
    *   The final container should start the `core-api` server via the `CMD` instruction.
2.  **Create GitHub Actions Workflow:**
    *   In the `.github/workflows/` directory, create a new file named `deploy-backend.yml`.
    *   Define the workflow to be triggered on pushes to the `main` branch.
    *   **Authentication:** Use Google's `auth` action to authenticate with GCP using a service account key stored as a GitHub secret.
    *   **Build and Push:**
        *   Set up the Docker build environment.
        *   Build the Docker image using the `Dockerfile` you created.
        *   Tag the image appropriately (e.g., with the Git SHA).
        *   Push the image to Google Artifact Registry.
    *   **Deploy:**
        *   Use the `deploy-cloudrun` action to deploy the newly pushed image to the Cloud Run service.
        *   Ensure necessary environment variables (from GitHub Secrets) are passed to the Cloud Run service during deployment.

### Key Files to Create
-   `services/core-api/Dockerfile`
-   `.github/workflows/deploy-backend.yml`

### Acceptance Criteria
-   The `core-api` service can be successfully built into a Docker container using the new `Dockerfile`.
-   The `deploy-backend.yml` workflow is created and correctly configured.
-   When the workflow runs, it successfully authenticates with GCP, builds the Docker image, pushes it to Artifact Registry, and deploys it to Cloud Run.
-   The deployed backend service is running and accessible.
