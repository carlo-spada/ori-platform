---
type: project-overview
role: onboarding
scope: all
audience: developers, contributors, stakeholders
last-updated: 2025-11-11
relevance: setup, installation, quick-start, architecture, contributing
priority: high
quick-read-time: 5min
deep-dive-time: 15min
---

# Ori Platform — Your AI-Powered Career Companion

**⚠️ For Agents & Developers**:
- **Start here**: [DOC_INDEX.md](./DOC_INDEX.md) for comprehensive navigation and current status
- **⭐ NEW**: [Brownfield Documentation](./docs/BROWNFIELD_DOCUMENTATION_INDEX.md) - 75k+ words of AI-ready codebase analysis

<div align="center">
  <img src="https://raw.githubusercontent.com/your-repo/assets/main/ori-logo.png" alt="Ori Logo" width="120px" />
  <p>
    <strong>Ori is an autonomous up-skilling and role-acquisition agent designed to guide every person toward the work that truly fits them.</strong>
  </p>
  <p>
    <a href="https://getori.app">Website</a> · <a href="https://app.getori.app">App</a> · <a href="https://github.com/carlo-spada/ori-platform/issues">Report Bug</a> · <a href="https://github.com/carlo-spada/ori-platform/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 Overview

Welcome to the Ori Platform monorepo. This project is an AI-powered career companion designed to help users find fulfilling work by providing personalized career guidance, continuous learning paths, and real-time market intelligence.

Our mission is to prove that **fulfillment should be scalable, and purpose should never be a privilege.** By merging real-time labor-market intelligence with personalized up-skilling and preference modeling, Ori creates an intelligent bridge between human potential and opportunity.

This repository is a **pnpm workspace monorepo** containing the following core components:

- **`src/`**: A **Next.js** application that serves as the main user interface.
- **`services/core-api/`**: A **Node.js/Express** backend API that handles user profiles, authentication, and business logic.
- **`services/ai-engine/`**: A **Python/FastAPI** service that provides all AI-powered features, including semantic job matching, skill gap analysis, and learning path generation.
- **`shared/`**: Shared packages (e.g., types, utils) used across the monorepo.

### 🌐 Subdomain Architecture

The platform uses subdomain-based routing for clean separation of concerns:

- **`getori.app`** - Marketing site (landing, pricing, about, blog, features)
- **`app.getori.app`** - Application (dashboard, profile, applications, login, signup)

This architecture provides:

- Clear mental model for users (marketing vs. app)
- Clean URLs on app subdomain (`/dashboard` instead of `/app/dashboard`)
- PWA that opens directly to the app subdomain
- Automatic routing via Next.js middleware

## 🛠️ Technology Stack

Our platform is built with a modern, scalable, and polyglot architecture:

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend (Core)**: Node.js 20, Express.js
- **Backend (AI)**: Python 3.11, FastAPI, Sentence-Transformers
- **Database**: Supabase PostgreSQL
- **UI**: shadcn-ui, Tailwind CSS, Radix UI
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel (Frontend) and Google Cloud Run (AI Engine)
- **Monorepo Management**: pnpm workspaces, Turborepo

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- Python 3.11+ and pip
- A Supabase account and project
- Docker (optional, for containerizing the AI Engine)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/carlo-spada/ori-platform.git
    cd ori-platform
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory. See `.env.example` for the required variables (Supabase keys, etc.).

### Running the Development Servers

You will need to run three separate services in different terminal windows.

1.  **Run the Frontend (Next.js):**

    ```bash
    pnpm dev
    ```

    - Access the web app at `http://localhost:3000`.

2.  **Run the Core API:**

    ```bash
    pnpm dev:api
    # or equivalently:
    pnpm --filter @ori/core-api dev
    ```

    - The API will be available at `http://localhost:3001`.

3.  **Run the AI Engine (Python):**

    ```bash
    cd services/ai-engine
    pip install -r requirements.txt
    python main.py
    ```

    - The AI service will be available at `http://localhost:3002`.

## 📖 Documentation

**Quick Reference**:

- **[`CLAUDE.md`](./CLAUDE.md)** - Implementation guide for Claude (MCP tools, patterns, standards)
- **[`GEMINI.md`](./GEMINI.md)** - Planning guide for Gemini
- **[`AGENTS.md`](./AGENTS.md)** - Agent roles, workflow, and collaboration
- **[`docs/MCP_REFERENCE.md`](./docs/MCP_REFERENCE.md)** - Complete MCP protocol reference
- **[`MCP-QUICK-SETUP.md`](./MCP-QUICK-SETUP.md)** - 5-minute MCP setup guide

**Technical Documentation**:

- **[`docs/CORE/CORE_DATABASE_SCHEMA.md`](./docs/CORE/CORE_DATABASE_SCHEMA.md)** - Database schema & RLS policies
- **[`docs/CORE/architecture/`](./docs/CORE/architecture/)** - Architecture overview

## 🏗️ Project Management

This project is managed using a **"Task-as-File"** system. All work is tracked in the `.tasks/` directory, which is organized by status (`todo`, `in-progress`, `done`, etc.). This system is the single source of truth for our development roadmap.

For a detailed explanation of our collaborative workflow, agent roles, and branching strategy, please see **[`AGENTS.md`](./AGENTS.md)**.

## 📚 Notion Integration (MCP)

We use Notion for documentation review and collaboration. Claude can directly interact with your Notion workspace through the official Notion MCP server.

**Capabilities:**
- Sync documentation from `/docs` to Notion
- Search Notion workspace
- Create and update pages
- Query databases
- Add comments

**Setup (5 minutes):**
1. Create Notion integration at [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Copy integration token (starts with `ntn_`)
3. Add token to Claude Desktop config
4. Restart Claude Desktop

**Resources:**
- **[Complete Setup Guide](./docs/NOTION_MCP_SETUP.md)** - Step-by-step configuration and usage

## 🚀 Deployment

Our production architecture is designed for simplicity and scalability:

- The **Next.js frontend** is deployed automatically to **Vercel** from the `main` branch.
- The **Core API** (Express.js) is currently deployed alongside the frontend on Vercel.
- The **AI Engine** is containerized with Docker and deployed automatically to **Google Cloud Run**.
- A unified CI/CD pipeline in GitHub Actions orchestrates testing, deployment, and database migrations on every merge to `main`.

This architecture ensures low latency, easy scalability, and a seamless development experience.

## 🤝 Contributing

We welcome contributions! Before you begin, please read our contributor handbook:

- **[`AGENTS.md`](./AGENTS.md)**: The complete guide to our branching strategy, Git workflow, agent roles, and development best practices.

All development happens on the `dev` branch. Pull Requests are made from `dev` into `main` for production deployment.

## 📄 License

This project is proprietary software. All rights reserved.
