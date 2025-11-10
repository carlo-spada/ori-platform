# Task: Dev-Hub Migration - Phase A: Foundation

**Assigned to:** Claude

## High-Level Goal

Provision and configure the core "Dev-Hub" VPS. This server will host our persistent development services, starting with the core MCP servers and a staging database. The goal is to create a stable, always-on environment that our local machines can connect to.

## Detailed Requirements

### 1. Provision and Secure the VPS

- **Choose a Provider:** Select a cloud provider (e.g., DigitalOcean, AWS, Vultr).
- **Select Server Specs:** Provision a VPS with at least 4GB RAM and 2 vCPUs (e.g., DigitalOcean "General Purpose" Droplet or AWS EC2 `t3.medium`).
- **Initial Server Setup:**
    - Perform initial server setup and hardening.
    - Create a non-root user with `sudo` privileges.
    - Set up a firewall (e.g., `ufw`), allowing only essential ports (SSH, HTTP, HTTPS, and any ports needed for the MCP servers).
    - Set up SSH key-based authentication and disable password authentication.

### 2. Set Up Docker and Docker Compose

- **Install Docker:** Install the Docker Engine on the VPS.
- **Install Docker Compose:** Install the Docker Compose plugin.
- **Permissions:** Add your non-root user to the `docker` group to manage Docker without `sudo`.

### 3. Create the `dev-hub-infra` Repository

- **Create a New Private Repository:** Create a new, private GitHub repository named `dev-hub-infra`.
- **Initial Structure:** This repository will house the `docker-compose.yml` file and any other configuration files for the Dev-Hub.
- **`docker-compose.yml`:** Create the initial `docker-compose.yml` file with services for:
    - **Stripe MCP Server:** Using the appropriate Docker image or command.
    - **Resend MCP Server:** Using the appropriate Docker image or command.
    - **PostgreSQL MCP Server:** Using the appropriate Docker image or command.
    - **Staging Database:** Using the official `postgres:latest` Docker image. Configure it with a persistent volume for data.

### 4. Deploy and Verify the Dev-Hub

- **Clone the Repository:** Clone the `dev-hub-infra` repository onto the VPS.
- **Launch the Stack:** Use `docker-compose up -d` to launch all the services.
- **Verify Services:**
    - Check the logs for each container to ensure they started without errors.
    - Verify that the services are running and accessible from within the VPS.
    - Ensure the staging database is running and its data volume is correctly mounted.

### 5. Update Local Development Configuration

- **Update `.env.example`:** In the main `ori-platform` repository, update the `.env.example` file. Change the hostnames/IPs for the MCP services to point to the new Dev-Hub's public IP address.
- **Document the Change:** Add a section to the `README.md` or a new `CONTRIBUTING.md` file explaining the new Dev-Hub architecture and how developers should configure their local environments to connect to it.

## Acceptance Criteria

- [ ] A new VPS is provisioned, secured, and has Docker/Docker Compose installed.
- [ ] A new private GitHub repository `dev-hub-infra` exists and contains the `docker-compose.yml` file.
- [ ] The `docker-compose.yml` file correctly defines the Stripe, Resend, and PostgreSQL MCP servers, plus a staging Postgres database.
- [ ] All services are successfully deployed and running on the VPS via Docker Compose.
- [ ] The local development environment in the `ori-platform` repo is updated to connect to the services on the Dev-Hub.
- [ ] Documentation is updated to reflect the new development setup.
