### Task: Perform Full Clean and Reinstall to Resolve Content Collection Issues

**Objective:** Execute a comprehensive clean-up and reinstallation of project dependencies to resolve the persistent `Entry docs → _index was not found.` error and ensure Astro's content collection system functions correctly.

**Context:**
Despite verifying the file path and adding an explicit loader to `src/content.config.ts`, the `Entry docs → _index was not found.` error continues to appear in the terminal. This suggests a deeper issue, possibly related to corrupted `node_modules`, stale caches, or dependency conflicts. A full clean and reinstall is often effective in resolving such environmental problems.

**Requirements:**
1.  **Stop Development Server:** Ensure `npm run dev` is not running.
2.  **Clean npm cache:** Run `npm cache clean --force`.
3.  **Remove `node_modules`:** Delete the `node_modules` directory.
4.  **Remove `package-lock.json`:** Delete the `package-lock.json` file.
5.  **Reinstall dependencies:** Run `npm install`.
6.  **Restart Development Server:** Run `npm run dev`.

**Expected Outcome:**
The `Entry docs → _index was not found.` error will be resolved, and the content of `src/content/docs/_index.md` will be correctly displayed on the main page.

**Validation:**
Monitor the terminal output after `npm run dev` for the absence of the `_index` error. Verify the main page in the browser to confirm the content is rendered correctly and not as `[object Object]`.