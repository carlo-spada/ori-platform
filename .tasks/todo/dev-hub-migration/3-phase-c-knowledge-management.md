# Task: Dev-Hub Migration - Phase C: Knowledge Management

**Assigned to:** Claude

## High-Level Goal

Establish a centralized, persistent, and collaborative knowledge base for the Ori Platform by offloading our high-level documentation from the GitHub repository to a dedicated Notion workspace, integrated via a Notion MCP.

## Prerequisites

- Phase A of the Dev-Hub migration must be complete.

## Detailed Requirements

### 1. Set Up the Notion Workspace and MCP

- **Create Notion Workspace:**
    - Create a new, dedicated Notion workspace for the Ori Platform.
    - Structure the workspace with top-level pages for key areas like "Engineering," "Product," "Architecture," and "Onboarding."
- **Add Notion MCP to Docker Compose:**
    - In the `dev-hub-infra` repository, update the `docker-compose.yml` file to include a new service for the Notion MCP.
    - Use the appropriate Docker image or command for the Notion MCP.
    - Configure the MCP with the necessary API tokens to connect to the new Notion workspace.
- **Deploy and Verify:**
    - Relaunch the Docker Compose stack on the VPS to start the Notion MCP service.
    - Verify that the MCP can connect to the Notion workspace by performing a test query (e.g., listing the top-level pages).

### 2. Migrate Existing Documentation

- **Identify Documents for Migration:**
    - Identify the high-level, "living" documentation in our `ori-platform` repository that is suitable for migration. This includes, but is not limited to:
        - `README.md`
        - `AGENTS.md`
        - `GEMINI.md`
        - `CLAUDE.md`
        - High-level architectural diagrams and manifestos.
- **Perform the Migration:**
    - Copy the content from these Markdown files into new, corresponding pages in the Notion workspace.
    - Take advantage of Notion's features (databases, callouts, etc.) to improve the formatting and structure of the documents where appropriate.
- **Create "Stubs" in the GitHub Repository:**
    - Once a document is migrated, replace the content of the original Markdown file in the GitHub repo with a "stub."
    - The stub should clearly state that the document has been moved and provide a direct link to the new canonical source in Notion.
    - **Example Stub for `AGENTS.md`:**
      ```markdown
      # Agent Roles & Workflow

      **This document has been migrated to our official Notion workspace.**

      For the most up-to-date information on agent roles, responsibilities, and our collaborative workflow, please refer to the canonical document here:

      [**View Agent Workflow in Notion**](https://www.notion.so/your-workspace/link-to-page)

      *This file is retained as a pointer to the new source of truth.*
      ```

### 3. Define the New Documentation Workflow

- **Update `CONTRIBUTING.md` (or similar guide):**
    - Add a new section that clearly defines the new documentation workflow.
    - **Guideline:** All future high-level, conceptual, or project management documentation should be created and maintained directly in Notion.
    - **Guideline:** The GitHub repository should be reserved for documentation that is tightly coupled to the code itself (e.g., code comments, technical API documentation in source files, and detailed audit files that are point-in-time snapshots).
- **Communicate the Change:** Ensure the new workflow is communicated to all team members (including AI agents).

## Acceptance Criteria

- [ ] A new Notion workspace for the Ori Platform is created and structured.
- [ ] The Notion MCP is successfully deployed and running on the Dev-Hub, connected to the new workspace.
- [ ] Key high-level documents (`README.md`, `AGENTS.md`, etc.) have been migrated from the GitHub repository to Notion.
- [ ] The original Markdown files in the GitHub repo have been replaced with stubs pointing to their new location in Notion.
- [ ] A clear guideline for the new documentation workflow is documented and committed to the `ori-platform` repository.
