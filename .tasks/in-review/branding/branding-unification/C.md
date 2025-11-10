---
Task ID: C
Feature: Branding Unification
Title: Comprehensive Codebase and Documentation Rename
Assignee: Codex (Reviewer & Debugger)
Status: To Do
Depends On: B
---

### Objective

Perform a comprehensive find-and-replace across the entire codebase and all documentation to replace every remaining instance of "AURA" or "Aura" with "Ori".

### Context

This is the final cleanup task to ensure brand consistency. It covers everything from code comments and variable names to legal documents and configuration files.

### Key Files to Modify

- A wide range of files, including but not limited to:
- `src/lib/types.ts`
- `src/app/globals.css`
- All legal pages in `src/app/legal/`
- `docker-compose.yml`
- `CLAUDE.md`, `ORI_MANIFESTO.md`

### Instructions for Claude

1.  **Perform a Global Find-and-Replace**:
    - Carefully search for all case-insensitive instances of "Aura" and replace them with "Ori".
    - **Important**: Be mindful of context. For example, `AuraAnalysisCard.tsx` should be renamed to `OriAnalysisCard.tsx` (both the file and the component name inside it).
    - Do not change `ORI_MANIFESTO.md` where it talks about the word "aura" in a conceptual sense.

2.  **Key Areas to Address**:
    - **Component Names**: Rename files and exported components (e.g., `AuraAnalysisCard.tsx` -> `OriAnalysisCard.tsx`).
    - **Metadata**: Update page titles and descriptions in `src/app/**/page.tsx` files.
    - **Legal Documents**: Change the company name in the legal pages (`terms-of-service`, `privacy-policy`, etc.) from "AURA Technologies" to "Ori Technologies".
    - **Configuration**: In `docker-compose.yml`, change the `POSTGRES_DB` from `aura` to `ori`.
    - **Code Comments & Types**: Update comments, variable names, and type definitions (e.g., in `src/lib/types.ts`).
    - **Documentation**: Update any remaining mentions in markdown files.

3.  **Verification**:
    - After the replacement, run the application and thoroughly click through every page to ensure no visual regressions or broken functionality was introduced.
    - Run `pnpm lint` to catch any syntax errors.

### Acceptance Criteria

- All instances of "Aura" (case-insensitive) are replaced with "Ori" across the entire project, except where contextually inappropriate.
- Component filenames and exported names are updated.
- Legal and marketing text is updated.
- Configuration files (`docker-compose.yml`) are updated.
- The application runs correctly without any errors introduced by the rename.
