---
Task ID: A
Feature: Core App UI/UX and PWA
Title: PWA Configuration
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective

Configure the Next.js application to function as a Progressive Web App (PWA), allowing users to "install" it on their devices for a native-like experience.

### Context

This is the first step in improving the core application experience. It makes the app more accessible and professional. This task is based on standard practices for Next.js 13+ with the App Router.

### Key Files to Modify

- `next.config.ts`
- `src/app/layout.tsx`
- **New File**: `app/manifest.ts`
- `public/icons/` (new directory for icons)

### Instructions for Claude

1.  **Install PWA Package**:
    - Add the recommended PWA package to the project.
    ```bash
    pnpm add @ducanh2912/next-pwa
    ```
2.  **Create App Manifest**:
    - Create a new file at `app/manifest.ts`.
    - Define the manifest using the `MetadataRoute.Manifest` type from Next.js.
    - Include the following properties:
      - `name`: "Ori Platform"
      - `short_name`: "Ori"
      - `description`: "Your AI-powered career companion."
      - `start_url`: "/"
      - `display`: "standalone"
      - `background_color`: "#000000"
      - `theme_color`: "#000000"
      - `icons`: Define at least a 192x192 and a 512x512 icon.
3.  **Add PWA Icons**:
    - Create a new directory `public/icons/`.
    - Add placeholder icons (e.g., simple colored squares or using a placeholder service) for the sizes defined in the manifest (e.g., `icon-192x192.png`, `icon-512x512.png`). Ensure they are referenced correctly in `manifest.ts`.
4.  **Configure `next.config.ts`**:
    - Import the PWA plugin (`withPWA`).
    - Wrap your `nextConfig` object with the `withPWA({...})` higher-order function.
    - Configure the plugin, setting `dest` to `public` and `register` to `true`.
5.  **Update `app/layout.tsx`**:
    - In the root layout, ensure the `manifest` is linked in the `metadata` object: `manifest: '/manifest.ts'`.
    - Update the `viewport` object to include properties for a better mobile/PWA experience:
      ```typescript
      export const viewport: Viewport = {
        themeColor: '#000000',
        viewportFit: 'cover',
        // ... any other viewport settings
      }
      ```

### Acceptance Criteria

- The `@ducanh2912/next-pwa` package is installed.
- A `manifest.ts` file is created and correctly configured.
- Placeholder icons for the PWA are added to the `public/icons` directory.
- `next.config.ts` is updated to enable PWA functionality.
- The application is installable on supported desktop and mobile browsers (verifiable via Lighthouse PWA audit in Chrome DevTools).
