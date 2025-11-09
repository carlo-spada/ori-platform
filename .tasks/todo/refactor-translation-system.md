Hello Claude,

This is Gemini. I have completed a deep audit of our translation automation architecture and have identified several key areas for improvement. Your task is to refactor and optimize the system based on my recommendations.

## High-Level Goal

Consolidate our translation scripts into a single, robust, and efficient workflow. The new system should be easier to maintain, more intuitive for developers, and have a more streamlined integration with our CI/CD pipeline.

## Current State Analysis

I have analyzed the following files:
- `docs/TRANSLATION_WORKFLOW.md`
- `scripts/sync-translations.ts`
- `scripts/extract-translatable.ts`
- `scripts/translate-all.ts`
- `scripts/translate-content.ts`
- `scripts/translate-missing.ts`

My findings are as follows:

1.  **Script Redundancy:** There is significant functional overlap between `sync-translations.ts`, `translate-all.ts`, and `translate-missing.ts`. This creates confusion and increases the maintenance burden.
2.  **Fragmented Content Handling:** The process for translating UI strings (via `extract-translatable.ts`) and legal documents (via `translate-content.ts`) is inconsistent and brittle. The legal document translation relies on a fragile component structure.
3.  **Inefficient GitHub Actions Workflow:** The current workflow commits directly to `dev`/`main`, which clutters the commit history and can lead to merge conflicts.
4.  **Inconsistent Error Handling:** The quality of error handling varies across scripts. The implementation in `sync-translations.ts` is superior and should be the standard.

## Detailed Requirements

### 1. Consolidate Translation Scripts

- **Create a new script:** `scripts/translate.ts`.
- **Deprecate the following scripts:**
    - `scripts/sync-translations.ts`
    - `scripts/translate-all.ts`
    - `scripts/translate-missing.ts`
    - `scripts/translate-content.ts`
- **Implement the following command-line flags in `scripts/translate.ts`:**
    - `--sync`: (Default behavior) Translates only missing keys.
    - `--force`: Retranslates all keys, overwriting existing translations.
    - `--check`: Checks for missing translations without performing any changes.
    - `--namespace=<ns>`: Targets a specific namespace.
    - `--language=<lang>`: Targets a specific language.
- **Standardize Error Handling:**
    - Use the robust error handling from `sync-translations.ts` as a baseline.
    - Implement a "failed translations" log (`.tmp/failed-translations.log`) for keys that repeatedly fail, allowing the script to continue and for manual review later.

### 2. Unify the Content Pipeline

- **Eliminate `scripts/translate-content.ts`:** The new `scripts/translate.ts` should handle all translation namespaces, including legal documents.
- **Refactor Legal Document Components:**
    - Modify the legal document components (e.g., `src/app/legal/terms-of-service/page.tsx`) to fetch their content from the JSON translation files instead of having the content hardcoded in the component.
    - The components should render the `title`, `lastUpdated`, and `content` from the corresponding `legal-*.json` files.
- **Update Documentation:**
    - Modify `docs/TRANSLATION_WORKFLOW.md` to reflect the new, consolidated workflow.
    - Remove all references to the deprecated scripts.
    - Clearly document the new `scripts/translate.ts` script and its flags.

### 3. Optimize the GitHub Actions Workflow

- **Modify `.github/workflows/translate.yml`:**
    - Instead of committing directly to the `dev` or `main` branch, the workflow should create a new branch (e.g., `chore/translation-updates-YYYY-MM-DD`).
    - The workflow should then create a pull request with the translation updates, assigning a designated reviewer.
    - This allows for a review step and keeps the main branches clean.

## Acceptance Criteria

- [ ] All deprecated translation scripts are removed.
- [ ] A new `scripts/translate.ts` script exists with all the specified flags and functionality.
- [ ] The `extract-translatable.ts` script is preserved for identifying hardcoded strings.
- [ ] Legal document components are refactored to consume translations from JSON files.
- [ ] The `docs/TRANSLATION_WORKFLOW.md` is updated to reflect the new, simplified workflow.
- [ ] The `.github/workflows/translate.yml` is updated to create pull requests instead of direct commits.
- [ ] The entire translation process can be executed with a single command: `DEEPL_API_KEY=your_key tsx scripts/translate.ts --sync`.
- [ ] All existing tests pass, and if necessary, new tests are added for the new script.

Please proceed with implementing these changes. Let me know if you have any questions.

Best,
Gemini
