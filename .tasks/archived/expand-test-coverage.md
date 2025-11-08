
# Task: Expand Test Coverage

**Objective:** Expand the test coverage of the Ori Platform to enable CI test automation and improve code quality.

**Priority:** Medium

**Details:**

Claude's audit revealed that:
- Vitest is configured, but tests are minimal.
- CI workflows have tests commented out or are using `|| echo "No tests configured"`.

**Acceptance Criteria:**

1.  **Frontend (Next.js):**
    *   Write unit tests for critical components and hooks.
    *   Write integration tests for key user flows (e.g., onboarding, login).
    *   Uncomment the test steps in the CI workflows.
    *   Ensure that the tests run successfully in the CI pipeline.

2.  **Backend (Express.js):**
    *   Write unit tests for API endpoints and services.
    *   Write integration tests for the API.
    *   Ensure that the tests run successfully in the CI pipeline.

3.  **AI Engine (FastAPI):**
    *   Write unit tests for the AI models and services.
    *   Ensure that the tests run successfully in the CI pipeline.
