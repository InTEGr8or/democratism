### Task: Re-apply and Strictly Verify `docs` Content Collection to `src/content.config.ts`

**Objective:** Re-apply the `docs` content collection definition to `src/content.config.ts`, including its schema and explicit `glob` loader, and *strictly verify* that the changes are correctly written to the file system before committing.

**Context:**
`src/content.config.ts` is currently not updated with the `docs` content collection, despite previous attempts. This is a critical blocker. We need to ensure these changes are correctly applied and persisted this time.

**Current `src/content.config.ts` content (as per previous `read_file`):**
```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

**Requirements:**
1.  **Ensure `import { glob } from "astro/loaders";` is present.**
2.  **Add `docs` collection:** Define the `docs` collection with the following structure:
    ```typescript
    const docs = defineCollection({
      loader: glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/docs",
      }),
      schema: z.object({
        title: z.string(),
        mainImage: z.string().optional(),
        summary: z.string().optional(),
      }),
    });
    ```
3.  **Export `docs` collection:** Add `docs` to the `export const collections = { blog, docs };` statement.
4.  **STRICT VERIFICATION:** After writing the file, the subchat MUST immediately use `read_file` on `src/content.config.ts` to confirm that the content matches the intended changes. If it does not, the subchat MUST report this failure and NOT proceed.
5.  **Commit Changes:** ONLY if the file content is strictly verified to be correct, commit the changes to `src/content.config.ts` with the commit message "feat: Re-applied and verified docs content collection configuration".

**Expected Outcome:**
The `src/content.config.ts` file will correctly define the `docs` content collection, and this change will be committed to the repository.

**Validation:**
After the subchat completes this task, I will ask the user to restart `npm run dev` and provide the terminal output. We should no longer see errors related to the `docs` collection not existing.