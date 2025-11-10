# Task: Dev-Hub Migration - Phase B: Automation & Intelligence

**Assigned to:** Claude

## High-Level Goal

Enhance the Dev-Hub by integrating powerful automation and AI-native context services. This phase involves adding n8n for workflow automation and Context7 to provide our AI agents with an up-to-date understanding of our codebase.

## Prerequisites

- Phase A of the Dev-Hub migration must be complete. The core MCP servers and staging database should be running on the VPS.

## Detailed Requirements

### 1. Integrate n8n for Workflow Automation

- **Add n8n to Docker Compose:**
    - In the `dev-hub-infra` repository, update the `docker-compose.yml` file to include a new service for n8n.
    - Use the official `n8nio/n8n` Docker image.
    - Configure a persistent volume for n8n's data to ensure workflows are not lost on restart.
    - Expose the n8n web interface port (e.g., 5678) through the firewall.
- **Deploy n8n:** Relaunch the Docker Compose stack on the VPS to start the n8n service.
- **Create Initial Workflows:**
    - **Goal:** To demonstrate the value of n8n and automate a few key processes.
    - **Workflow 1: GitHub to Slack Notifications:** Create an n8n workflow that listens for a "build failed" status on our GitHub Actions CI/CD pipeline and posts a detailed alert to a designated Slack channel.
    - **Workflow 2: Task Management Sync (Optional Bonus):** Create a workflow that watches for new task files being created in the `.tasks/todo/` directory in our GitHub repo and automatically creates a corresponding card on a Trello or Notion board.

### 2. Integrate the Context7 MCP Server

- **Add Context7 to Docker Compose:**
    - Following the plan from our previous discussion, add the Context7 service to the `docker-compose.yml` file in the `dev-hub-infra` repository.
    - This will likely involve cloning the `upstash/context7` repository and creating a `Dockerfile` for it if one doesn't exist, or using a pre-built image if available.
- **Configure Context7:**
    - Configure the Context7 service to continuously scan our main `ori-platform` GitHub repository.
    - This may involve setting up a webhook from GitHub to the Context7 service to trigger re-indexing on every push to the `dev` branch.
- **Deploy Context7:** Relaunch the Docker Compose stack on the VPS to start the Context7 service.
- **Update MCP Configuration:**
    - Update the central MCP configuration (`.claude/mcp.json` in the `ori-platform` repo) to include and point to the new Context7 instance running on the Dev-Hub.

## Acceptance Criteria

- [ ] The `docker-compose.yml` in the `dev-hub-infra` repo is updated to include services for n8n and Context7.
- [ ] n8n is running on the Dev-Hub and is accessible via its web interface.
- [ ] At least one automated workflow (e.g., GitHub to Slack notifications) is implemented and functional in n8n.
- [ ] The Context7 service is running on the Dev-Hub.
- [ ] Context7 is configured to automatically stay in sync with our `ori-platform` GitHub repository.
- [ ] The project's MCP configuration is updated to allow AI agents to query the new Context7 server.
