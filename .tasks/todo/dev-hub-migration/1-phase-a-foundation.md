# Task: Dev-Hub Migration - Phase A: Foundation (IaC Edition)

**Assigned to:** Claude

## High-Level Goal

Create the foundational "Dev-Hub" by defining and deploying our core infrastructure as code using Pulumi. This phase will establish a persistent, repeatable, and AI-manageable server environment to host our development services, starting with the core MCP servers and a staging database.

## Detailed Requirements

### 1. Set Up the `dev-hub-infra` Repository and Pulumi Project

- **Create a New Private Repository:** Create a new, private GitHub repository named `dev-hub-infra`.
- **Initialize Pulumi Project:**
    - Inside this repository, initialize a new Pulumi project using the **TypeScript** template.
    - Configure the project to use the selected cloud provider (e.g., DigitalOcean, AWS).
    - Add the necessary provider packages (e.g., `@pulumi/digitalocean`).
- **Define the Core Infrastructure in Pulumi:**
    - Write TypeScript code to define the following resources:
        - **A VPS Instance:** (e.g., a DigitalOcean Droplet). The configuration (size, region) should be easily adjustable through Pulumi's config system. Start with at least 4GB RAM and 2 vCPUs.
        - **Firewall Rules:** Define firewall rules as code, allowing SSH, HTTP, HTTPS, and any ports needed for our services.
        - **SSH Key:** Programmatically add your public SSH key to the VPS for secure access.
- **Initial Deployment:**
    - Run `pulumi up` to deploy the initial infrastructure.
    - Verify that the VPS is created and accessible via SSH.

### 2. Create the "Pulumi MCP Server"

- **Create a Wrapper Script:**
    - Within the `dev-hub-infra` repository, create a simple Node.js/TypeScript script that will act as our "Pulumi MCP Server".
    - This script should be a simple command-line interface (CLI) that accepts commands like `provision`, `destroy`, `update`, and `status`.
    - When it receives a command, it should execute the corresponding Pulumi command (e.g., `pulumi up --yes`, `pulumi destroy --yes`, `pulumi preview`).
- **Containerize the Wrapper:**
    - Create a `Dockerfile` for this wrapper script. This container will have Pulumi, Node.js, and any necessary cloud provider CLIs installed.
    - This allows us to run our infrastructure commands from a controlled, containerized environment.

### 3. Define and Deploy Services with Docker Compose

- **Create `docker-compose.yml`:**
    - In the `dev-hub-infra` repository, create a `docker-compose.yml` file.
    - Define the following services:
        - **`pulumi-mcp`:** The service for our new Pulumi MCP wrapper, built from the Dockerfile created in the previous step.
        - **Stripe MCP Server:** Using the appropriate Docker image or command.
        - **Resend MCP Server:** Using the appropriate Docker image or command.
        - **PostgreSQL MCP Server:** Using the appropriate Docker image or command.
        - **Staging Database:** Using the official `postgres:latest` Docker image, configured with a persistent volume.
- **Automate Deployment:**
    - The Pulumi code should be updated to handle the deployment of these services.
    - Use Pulumi's `docker` provider or a remote provisioner to:
        1. Clone the `dev-hub-infra` repository onto the newly created VPS.
        2. Run `docker-compose up -d` on the VPS to launch all the services.

### 4. Update Local Development Configuration

- **Update `.env.example`:** In the main `ori-platform` repository, update the `.env.example` file. The hostnames for the MCP services should now point to the public IP address of the Dev-Hub (which can be exported from the Pulumi stack).
- **Document the New Workflow:** Update the project's `README.md` or `CONTRIBUTING.md` to explain the new IaC workflow, the Dev-Hub architecture, and how developers should configure their local environments.

## Acceptance Criteria

- [ ] A new private GitHub repository `dev-hub-infra` exists.
- [ ] The repository contains a Pulumi project (in TypeScript) that defines the VPS and its firewall rules.
- [ ] The repository contains a `docker-compose.yml` file defining all core services, including a new "Pulumi MCP Server".
- [ ] Running `pulumi up` successfully provisions the VPS and deploys the Docker Compose stack on it.
- [ ] All services (MCPs, staging DB, Pulumi MCP) are running correctly on the VPS.
- [ ] The local development environment in the `ori-platform` repo is updated to connect to the services on the Dev-Hub.
- [ ] Documentation is updated to reflect the new Infrastructure as Code workflow.
- [ ] Claude can use the new Pulumi MCP to get the status of the infrastructure.
