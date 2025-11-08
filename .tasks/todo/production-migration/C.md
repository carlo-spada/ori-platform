---
Task ID: C
Feature: Production Migration
Title: Containerize and Deploy `ai-engine`
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective
Containerize the Python `ai-engine` service using Docker and configure it for automated deployment to Google Cloud Run.

### Context
The `ai-engine` is a specialized, computationally-intensive service that is best deployed as a container. This task decouples it from the main application and prepares it for a scalable, serverless container environment.

### Key Files to Modify
- **New File**: `services/ai-engine/Dockerfile`
- **New File**: `.github/workflows/deploy-ai-engine.yml`

### Instructions for Claude
1.  **Create a `Dockerfile`**:
    *   In the `services/ai-engine/` directory, create a `Dockerfile`.
    *   Use a suitable Python base image (e.g., `python:3.11-slim`).
    *   Copy the `requirements.txt` file and install the dependencies using `pip`.
    *   Copy the rest of the `ai-engine` source code.
    *   Set the `CMD` to run the FastAPI application using `uvicorn` (e.g., `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`).
2.  **Set up Google Cloud Run**:
    *   In the Google Cloud Console, create a new Cloud Run service.
    *   Configure it to be continuously deployed from a source repository (this will be linked to the GitHub Action later).
    *   Set memory and CPU limits appropriate for the AI models.
    *   Ensure the service is private (requires authentication to invoke).
3.  **Create GitHub Action Workflow**:
    *   Create a new workflow file at `.github/workflows/deploy-ai-engine.yml`.
    *   This workflow should be designed to be triggered by the main production deployment pipeline after a PR is merged from `development` into `main`.
    *   **Steps**:
        1.  Check out the code.
        2.  Authenticate to Google Cloud (using a service account key stored as a GitHub Secret).
        3.  Configure Docker.
        4.  Build the Docker image from `services/ai-engine/Dockerfile`.
        5.  Push the image to Google Artifact Registry.
        6.  Deploy the new image to the Google Cloud Run service.
4.  **Configure `core-api`**:
    *   The `core-api` (now running as serverless functions) will need to know the URL of the new Cloud Run service. Add this URL as a new environment variable in Vercel (`AI_ENGINE_URL`).
    *   It will also need to authenticate. Set up a service-to-service authentication token and add it as a secret in Vercel.

### Acceptance Criteria
-   A `Dockerfile` exists in the `ai-engine` directory and can be used to build a functional container image.
-   A Google Cloud Run service is created and configured.
-   A GitHub Action workflow is created that automatically builds and deploys the `ai-engine` to Cloud Run on pushes to `main`.
-   The `core-api` is configured with the necessary environment variables to communicate with the deployed `ai-engine`.
