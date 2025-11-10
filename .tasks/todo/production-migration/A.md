---
Task ID: A
Feature: Production Migration
Title: Foundational Infrastructure Setup
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective

Provision and configure the foundational, production-grade cloud infrastructure on Vercel and Supabase.

### Context

This is the first step in our migration to a Zero-Ops, Serverless-First architecture. It establishes the core services upon which our application will run. This task requires manual setup in the respective cloud provider consoles.

### Instructions for Claude

1.  **Create Vercel Project**:
    - Log in to the Vercel dashboard.
    - Create a new project and link it to the `ori-platform` GitHub repository.
    - **Do not deploy yet.** We will set up the full CI/CD pipeline later.
2.  **Provision Vercel Postgres**:
    - Within the Vercel dashboard for the new project, navigate to the "Storage" tab.
    - Create a new Vercel Postgres instance.
    - Securely note the provided connection string and other credentials.
3.  **Create Production Supabase Project**:
    - Log in to the Supabase dashboard.
    - Create a new project named "Ori Platform (Production)".
    - Navigate to `Database` -> `Extensions` and ensure `vector` is enabled.
    - Navigate to `Database` -> `Password` and set a strong, secure database password.
    - **Crucially**: Follow Supabase's documentation to connect this project to the external Vercel Postgres database you created in the previous step.
4.  **Configure Production Environment Variables**:
    - In the Vercel project settings, add the following production environment variables:
      - `NEXT_PUBLIC_SUPABASE_URL`: Your new production Supabase project URL.
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The `anon` key for your production Supabase project.
      - `SUPABASE_SERVICE_ROLE_KEY`: The `service_role` key for production (mark this as a Secret).
      - `DATABASE_URL`: The Vercel Postgres connection string.
    - These will be used by both the Next.js app and the `core-api` serverless functions.

### Acceptance Criteria

- A new Vercel project is created and linked to the GitHub repository.
- A production Vercel Postgres instance is provisioned.
- A new Supabase project is created and successfully connected to the Vercel Postgres instance.
- All necessary production environment variables are securely configured in the Vercel project settings.
