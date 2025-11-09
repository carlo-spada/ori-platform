---
Task ID: A
Feature: Branding Unification
Title: Create and Integrate New Branding Assets
Assignee: Claude (Implementer & Builder)
Status: To Do
---

### Objective

Create a new SVG logo and favicon for "Ori" and replace all existing branding assets in the project.

### Context

This is the first visual step in unifying our brand. It removes the old "AURA" and "lovable" assets and establishes Ori's new visual identity.

### Key Files to Modify

- `public/favicon.ico` (to be replaced)
- `public/next.svg` (or any other file used as a logo)
- `src/components/app/SidebarNav.tsx` (and any other component displaying the logo)

### Instructions for Claude

1.  **Create the Ori Logo SVG**:
    - Create a new file named `ori-logo.svg` in the `public/` directory.
    - Use the following SVG code for the logo. It's a simple, modern design representing a spark or a guiding star.

    ```xml
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Ori Logo</title>
      <path d="M64 0L76.7025 51.2975L128 64L76.7025 76.7025L64 128L51.2975 76.7025L0 64L51.2975 51.2975L64 0Z" fill="currentColor"/>
    </svg>
    ```

2.  **Create the Favicon**:
    - Create a new file named `favicon.svg` in the `public/` directory.
    - Use the same SVG code as the logo. An SVG favicon is modern and scales well.
    - Delete the old `favicon.ico` file.

3.  **Update `app/layout.tsx` for Favicon**:
    - In the root layout file (`src/app/layout.tsx`), update the `metadata` object to point to the new SVG favicon.

    ```typescript
    // Example metadata in layout.tsx
    export const metadata = {
      // ... other metadata
      icons: {
        icon: '/favicon.svg',
      },
    }
    ```

4.  **Replace In-App Logos**:
    - Search the codebase for where the old logo (e.g., `next.svg` or text-based "AURA") is used.
    - A key location is likely `src/components/app/SidebarNav.tsx`.
    - Replace the old logo with an `<Image>` component from `next/image` that points to `/ori-logo.svg`. Ensure it is styled appropriately (e.g., setting a height and width).

### Acceptance Criteria

- The new `ori-logo.svg` and `favicon.svg` files are created in the `public/` directory.
- The old `favicon.ico` is deleted.
- The application's layout is updated to use the new SVG favicon.
- All instances of the old logo within the application UI are replaced with the new Ori logo.
- The new logo and favicon display correctly in the browser.
