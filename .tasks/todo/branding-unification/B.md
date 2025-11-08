---
Task ID: B
Feature: Branding Unification
Title: Refactor Translation Keys and Content
Assignee: Claude (Implementer & Builder)
Status: To Do
Depends On: A
---

### Objective
Rename all translation keys and content that reference "AURA" to "Ori" to fix display bugs and align with the new brand.

### Context
This is a critical step to fix bugs where translation keys like `landing.whyAura.title` are displayed to the user. It ensures all user-facing text is correctly branded.

### Key Files to Modify
- All files in `public/locales/`
- `src/components/landing/ValuePropositionSection.tsx`
- Any other component using an "Aura" related translation key.

### Instructions for Claude

1.  **Rename Translation Keys**:
    *   Go through all `translation.json` files in `public/locales/`.
    *   Search for any keys that contain "Aura" (e.g., `whyAura`, `auraPricing`).
    *   Rename these keys to use "Ori" instead (e.g., `whyOri`, `oriPricing`).
    *   **Example (`en/translation.json`)**:
        ```diff
        - "whyAura": {
        -   "title": "Why Aura?",
        -   "subtitle": "Aura is designed to be your lifelong career companion..."
        - },
        + "whyOri": {
        +   "title": "Why Ori?",
        +   "subtitle": "Ori is designed to be your lifelong career companion..."
        + },
        ```

2.  **Update Translation Content**:
    *   While editing the translation files, perform a find-and-replace within the *values* to change any mention of "AURA" or "Aura" to "Ori".
    *   Pay special attention to all languages to ensure the brand name is consistent.

3.  **Update Code to Use New Keys**:
    *   Search the codebase (primarily in `src/`) for where the old translation keys are used.
    *   For example, in `src/components/landing/ValuePropositionSection.tsx`, change `t('landing.whyAura.title')` to `t('landing.whyOri.title')`.
    *   Update all instances to use the new, correct keys.

### Acceptance Criteria
-   All translation keys containing "Aura" are renamed to use "Ori".
-   All user-facing content in the translation files is updated from "Aura" to "Ori".
-   All `t(...)` function calls in the codebase are updated to use the new translation keys.
-   The bug causing raw translation keys to be displayed is fixed.
