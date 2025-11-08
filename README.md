# Ori Platform — Your AI-Powered Career Companion

<div align="center">
  <img src="https://raw.githubusercontent.com/your-repo/assets/main/ori-logo.png" alt="Ori Logo" width="120px" />
  <p>
    <strong>Ori is an autonomous up-skilling and role-acquisition agent designed to guide every person toward the work that truly fits them.</strong>
  </p>
  <p>
    <a href="#">View Demo</a> · <a href="#">Report Bug</a> · <a href="#">Request Feature</a>
  </p>
</div>

---

## 🌟 Overview

Welcome to the Ori Platform monorepo. This project is an AI-powered career companion designed to help users find fulfilling work by providing personalized career guidance, continuous learning paths, and real-time market intelligence.

Our mission is to prove that **fulfillment should be scalable, and purpose should never be a privilege.** By merging real-time labor-market intelligence with personalized up-skilling and preference modeling, Ori creates an intelligent bridge between human potential and opportunity.

This repository is a **pnpm workspace monorepo** containing the following core components:

- **`src/`**: A **Next.js** application that serves as the main user interface.
- **`services/core-api/`**: A **Node.js/Express** backend (refactoring to Serverless Functions) that handles user profiles, authentication, and business logic.
- **`services/ai-engine/`**: A **Python/FastAPI** service that provides all AI-powered features, including semantic job matching, skill gap analysis, and learning path generation.
- **`shared/`**: Shared packages (e.g., types, utils) used across the monorepo.

## 🛠️ Technology Stack

Our platform is built with a modern, scalable, and polyglot architecture:

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend (Core)**: Node.js, Express.js (migrating to Vercel Serverless Functions)
- **Backend (AI)**: Python, FastAPI, Sentence-Transformers
- **Database**: Supabase with Vercel Postgres
- **UI**: shadcn-ui, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel (Frontend & Core API) and Google Cloud Run (AI Engine)
- **Monorepo Management**: pnpm workspaces, Turborepo

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.10+ and pip
- A Supabase account and project
- Docker (for containerizing the AI Engine)

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

2.  **Run the Core API (Node.js):**

    ```bash
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

## 🏗️ Project Management

This project is managed using a **"Task-as-File"** system. All work is tracked in the `.tasks/` directory, which is organized by status (`todo`, `in-progress`, `done`, etc.). This system is the single source of truth for our development roadmap.

For a detailed explanation of our collaborative workflow, agent roles, and branching strategy, please see **[`AGENTS.md`](./AGENTS.md)**.

## 🚀 Deployment: A Zero-Ops Vision

Our production architecture is designed to be **Serverless-First**, requiring zero manual operations to deploy or scale.

- The **Next.js frontend** and **Core API** (as Serverless Functions) are deployed automatically to **Vercel** from the `main` branch.
- The **AI Engine** is containerized with Docker and deployed automatically to **Google Cloud Run**.
- A unified CI/CD pipeline in GitHub Actions orchestrates testing, deployment, and database migrations on every merge to `main`.

This architecture ensures ultra-low latency, infinite scalability, and a seamless development experience.

## 🤝 Contributing

We welcome contributions! Before you begin, please read our contributor handbook:

- **[`AGENTS.md`](./AGENTS.md)**: The complete guide to our branching strategy, Git workflow, agent roles, and development best practices.

All development happens on the `dev` branch. Pull Requests are made from `dev` into `main` for production deployment.

## 📄 License

This project is proprietary software. All rights reserved.
