# Ori Platform - GEMINI.md

## Guide Maintenance

Always make sure this guide is kept updated with whatever new information might be in the AGENTS.md file and whenever you land a major feature, infrastructure change, or new workflow, not just update this .md file but also update the relevant sections in the AGENTS.md file and reference the PR so every agent stays in sync at all times. This is crucial for good collaboration.

### Documentation Maintenance Schedule

As Gemini, I am responsible for refactoring and updating `AGENTS.md` and my `GEMINI.md` on **Mondays** (or the next working day if Monday is not a working day). This ensures continuous alignment and quality across all documentation.

## GitHub Considerations

Always keep the repository synchronized across all platforms and servers. After completing a set of changes, follow GitHub’s standard workflow: add, commit, and push your updates using clear messages and consistent practices. This ensures version integrity and collaboration reliability across environments.

## Project Overview

This repository contains the source code for the Ori Platform, an AI-powered career companion designed to help users find fulfilling work. The platform provides personalized career guidance, continuous learning paths, and real-time market intelligence.

The project is a monorepo managed with pnpm workspaces, and it consists of the following main components:

*   **Frontend**: A Next.js application that serves as the main user interface.
*   **Backend**: A set of microservices built with Node.js and Express.js that provide the core functionality of the platform.
*   **Shared**: A collection of shared packages used across the monorepo.

The technology stack includes:

*   **Framework**: Next.js 13+ with App Router
*   **Language**: TypeScript
*   **UI Components**: shadcn-ui
*   **Styling**: Tailwind CSS
*   **Database**: Supabase
*   **Authentication**: Supabase Auth
*   **Payments**: Stripe
*   **Internationalization**: i18next
*   **State Management**: React Query (TanStack Query)

## Building and Running

### Prerequisites

*   Node.js 18+ and pnpm
*   A Supabase account and project
*   A Stripe account (for payment features)

### Setup

1.  Install dependencies:
    ```bash
    pnpm install
    ```

2.  Set up environment variables:
    Create a `.env.local` file in the root directory with the necessary Supabase and Stripe keys.

### Development

*   Run the frontend development server:
    ```bash
    pnpm dev
    ```

*   Run the backend API development server:
    ```bash
    pnpm dev:api
    ```

### Production

*   Build the application for production:
    ```bash
    pnpm build
    ```

*   Start the production server:
    ```bash
    pnpm start
    ```

## Development Conventions

*   **Linting**: The project uses ESLint for code linting. Run the linter with:
    ```bash
    pnpm lint
    ```

*   **Internationalization**: Translations are managed in the `public/locales` directory. The application supports multiple languages, and new languages can be added by creating a new directory with the corresponding language code.

*   **Monorepo Management**: The project uses Turborepo to manage the monorepo build process. The build pipeline is defined in the `turbo.json` file.

## Project Management Workflow

As the coordinator, I will adhere to and manage the "Task-as-File" system.

*   **System**: A file-based task board in the `.tasks/` directory, with subdirectories for `todo`, `in-progress`, and `done`. Large features will have their own subfolders within these stage directories.

*   **My Role (Planner & Researcher)**: I will create feature folders (e.g., `.tasks/todo/feature-name/`) and individual task files (e.g., `A.md`, `B.md`) within them, defining the objective, key files, and acceptance criteria for each task. I will also research novel ideas and solutions to design actionable implementation plans.

*   **My Role (UI/UX Guardian)**: I will claim Task 'D' (Final UI/UX Polish) by moving its file to `.tasks/in-progress/` only after all other related tasks are in the `.tasks/done/` directory.

*   **Process**:
    1.  **Define & Assign**: Create feature folders and task files in `.tasks/todo/`.
    2.  **Monitor**: Regularly check the status of tasks by listing the contents of the `.tasks/` subdirectories.
    3.  **Integrate & Polish**: Once implementation tasks are complete, I will perform the final UI/UX integration and move my own task file to `.tasks/done/`.

### Agent Roles

To leverage distinct strengths and optimize collaboration, we are experimenting with specialized roles for each AI agent:

*   **Gemini (Planner & Researcher)**:
    *   **Focus**: Condensing large amounts of information, researching novel ideas or solutions, and designing actionable implementation plans.
    *   **Role**: Outlines *what* to do and *why*. Creates the initial task files and feature folders.

*   **Claude (Implementer & Builder)**:
    *   **Focus**: Executing the plans generated by Gemini with precision and creativity.
    *   **Role**: Focuses on *how* to build or implement the feature in code or documentation, while maintaining coherence and consistency.

*   **Codex (Reviewer & Debugger)**:
    *   **Focus**: Auditing the code or artifacts produced by Claude.
    *   **Role**: Identifies bugs, potential conflicts with the existing `main` branch, or opportunities for improvement. Codex should attempt to fix simple issues autonomously; for more complex cases, it should report them back to Gemini (for strategy) or Claude (for implementation).

### Git Workflow Best Practices

To maintain a clean history and prevent merge conflicts, always adhere to these Git practices:

1.  **Pull Before Starting New Work**: Before beginning any new task or working in a new feature folder, always pull the latest changes from the `main` branch to your current branch:
    ```bash
    git pull origin main
    ```
    This ensures you are working on the most up-to-date codebase.

2.  **Sync After Major Changes / Before PR**: After completing a significant chunk of work or before creating a Pull Request, rebase your branch onto the latest `main` to resolve any potential conflicts locally:
    ```bash
    git fetch origin main
    git rebase origin/main
    ```
    This keeps your branch's history linear and makes merging into `main` smoother.
