# Task: Set up Context7 MCP Server

**Assigned to:** Claude

## High-Level Goal

Integrate the Context7 MCP Server to provide up-to-date code documentation for our LLMs and AI code editors. This will enhance the capabilities of our AI agents and improve the accuracy and relevance of AI-generated code and suggestions.

## Detailed Requirements

1.  **Integrate Context7 into our Monorepo:**
    - Clone the `upstash/context7` repository into our `services/` directory (e.g., `services/context7`).
    - Follow its setup instructions to get it running as a local service.
    - Ensure it can scan our monorepo's code.

2.  **Configure Context7 for Continuous Updates:**
    - Set up Context7 to automatically update its code documentation whenever changes are pushed to the `dev` or `main` branches.
    - Integrate Context7 into our CI/CD pipeline (e.g., add a step in `pull-request-ci.yml` or a new workflow).
    - This step should trigger Context7 to re-index or update its knowledge base based on the latest code changes.

3.  **Integrate AI Agents with Context7:**
    - Modify the MCP Router to be aware of the Context7 service.
    - When an AI agent needs code context, the MCP Router should route the request to Context7.
    - This will likely involve defining a new "task type" or "metadata" in the MCP Router for "code context query."

## Acceptance Criteria

- [ ] The Context7 MCP server is integrated into our monorepo and running as a local service.
- [ ] Context7 is configured to automatically update its code documentation on every push to `dev` and `main`.
- [ ] The MCP Router is able to route code context queries to the Context7 service.
- [ ] AI agents are able to query Context7 for up-to-date code documentation.
- [ ] The need for manual context provision for AI agents is significantly reduced.
