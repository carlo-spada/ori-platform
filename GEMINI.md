# Ori Platform - GEMINI.md

## Guide Maintenance

Always make sure this guide is kept updated with whatever new information might be in the AGENTS.md file and whenever you land a major feature, infrastructure change, or new workflow, not just update this .md file but also update the relevant sections in the AGENTS.md file and reference the PR so every agent stays in sync at all times. This is crucial for good collaboration.

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
