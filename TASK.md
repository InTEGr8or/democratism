### Task: Remove Conflicting `.eslintrc.cjs` File

**Objective:** Delete the `.eslintrc.cjs` file to eliminate conflicts with `eslint.config.js` and resolve the "Parsing error: Expression expected." in `.astro` files.

**Context:**
The presence of both `.eslintrc.cjs` and `eslint.config.js` is causing conflicts in ESLint's configuration, leading to parsing errors in `.astro` files. `eslint.config.js` (flat config) is the newer and preferred method for ESLint configuration. Removing the older `.eslintrc.cjs` will simplify the setup and should resolve the parsing issue.

**Requirements:**
1.  **Delete `.eslintrc.cjs`:** Remove the file `/home/mstouffer/repos/democratism/.eslintrc.cjs`.
2.  **Commit Changes:** After deleting the file, commit the changes with the commit message "fix: Remove conflicting .eslintrc.cjs file".

**Expected Outcome:**
The `.eslintrc.cjs` file will be removed from the project, and the "Parsing error: Expression expected." in `src/pages/index.astro` should be resolved.

**Validation:**
After the subchat completes this task, I will ask the user to restart `npm run dev` and provide the terminal output. We should no longer see the ESLint parsing error.
### Achievements since last commit:

*   **`src/content.config.ts`:** Successfully updated and committed with the `docs` content collection definition, including its schema and explicit `glob` loader.
*   **`src/pages/index.astro`:** Modified to correctly use the `docs` content collection, display `_index.md` content, and render top-level content panels.
*   **`src/pages/[...slug].astro`:** Created and configured as a dynamic route for content pages, handling both individual files and hierarchical `_index.md` displays.
*   **Routing Refactor:** Successfully removed the `/content` prefix from content URLs, updating `href`s in `src/pages/index.astro` and `src/pages/[...slug].astro` to reflect the new root-level routing.
*   **ESLint Fix:** The "Parsing error: Expression expected." in `.astro` files was resolved (by manually removing `.eslintrc.cjs`).
### Achievements since last commit:

*   **`src/components/ContentPanel.astro`:** Styling adjusted to remove outer padding/border and ensure correct excerpt expansion.
*   **`src/pages/index.astro`:** Updated to use a helper function for extracting the first 50 words as `excerpt` for content panels.
*   **`src/pages/[...slug].astro`:** Modified to display the content title as an `<h1>` and pass the title to the `Layout` component for the browser tab title.
*   **`src/layouts/Layout.astro`:** Updated to correctly pass `title` and `description` props to the `Head` component.
*   **`src/components/Head.astro`:** Modified to dynamically set the `<title>` tag and `<meta name="description">` based on received props.