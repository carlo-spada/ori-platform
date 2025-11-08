---
Task ID: C
Feature: Skills Gap Analysis
Title: AI Engine Service Endpoint Verification
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective
Verify, and if necessary, expose a FastAPI endpoint in the AI Engine service that performs a skills gap analysis between a user's skills and a job's required skills.

### Context
The AI Engine is documented as having skill analysis capabilities. This task is to ensure that functionality is exposed via a network endpoint that the core backend API (Task A) can consume. This is the foundational step for the entire feature.

### Key Files to Modify
- `services/ai-engine/main.py`
- `services/ai-engine/services/skill_analysis.py`
- `services/ai-engine/models/schemas.py`
- `services/ai-engine/tests/test_skill_analysis.py` (or a new test file)

### Instructions for Claude
1.  **Define Pydantic Schemas**:
    *   In `services/ai-engine/models/schemas.py`, define Pydantic models for the request and response of the skill gap endpoint.
    *   **Request Schema**: Should accept two lists of strings: `user_skills` and `required_skills`.
    *   **Response Schema**: Should return three lists of strings: `user_skills`, `required_skills`, and `missing_skills`.
2.  **Implement Skill Analysis Logic**:
    *   In `services/ai-engine/services/skill_analysis.py`, ensure there is a function that takes the two lists of skills as input.
    *   The function should calculate the difference between `required_skills` and `user_skills` to find the `missing_skills`. A simple set difference is likely sufficient.
    *   Return an object or dictionary matching the defined response schema.
3.  **Expose FastAPI Endpoint**:
    *   In `services/ai-engine/main.py`, create a new FastAPI route (e.g., `/skill_gap`) using a `POST` method.
    *   This endpoint should use the Pydantic schemas for request and response validation.
    *   The endpoint handler will call the logic from `skill_analysis.py` and return the result.
4.  **Add Tests**:
    *   Create a new test file or add to an existing one to test the `/skill_gap` endpoint.
    *   Use `pytest` and `HTTPX` (or FastAPI's `TestClient`) to send requests to the endpoint with various inputs (e.g., no missing skills, some missing skills, all skills missing) and assert that the responses are correct.

### Acceptance Criteria
-   Pydantic schemas for the skill gap analysis request and response are defined.
-   The AI Engine provides a `POST /skill_gap` endpoint that accepts user and required skills.
-   The endpoint correctly calculates the missing skills and returns them in the specified response format.
-   The new endpoint is covered by unit/integration tests.
