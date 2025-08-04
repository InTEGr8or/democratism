### Detailed Plan: Grid Layout, Hierarchical Content, and Content Directory Migration

This plan outlines the steps to implement a grid layout for content panels, support a hierarchical content structure with `_index.md` files, and migrate the content directory from `src/posts/` to `content/`. This will also involve updating related scripts and workflow files.

#### **Phase 1: Content Migration and Astro Configuration**

*   **Step 1: Update `src/content.config.ts` for the new content collection.**
    *   Define a new content collection (e.g., `docs` or `content`) that points to the new `content/` directory.
    *   Add schema fields for `mainImage` (string, optional) and `summary` (string, optional) to the collection schema, as these will be used for the panels.
    *   Ensure the existing `blog` collection is either removed or updated if it's no longer needed or if its purpose changes.
*   **Step 2: Migrate `src/posts/` to `content/`.**
    *   Move the entire `src/posts/` directory and its contents (including `_index.md` and subfolders like `emails/`) to a new `content/` directory at the project root.
*   **Step 3: Update `scripts/enrich-amazon-images.ts` paths.**
    *   Modify the `CONTENT_DIRS` array to include the new `content/` path instead of `src/posts/`.
*   **Step 4: Update `.github/workflows/deploy.yml` paths.**
    *   Review and update any paths in the deployment workflow that might reference `src/posts/` to the new `content/` path, especially if the enrichment script is run before the build.

#### **Phase 2: Implement Grid Layout and Hierarchical Content Display**

*   **Step 5: Create a new Astro component for content panels (`src/components/ContentPanel.astro`).**
    *   This component will receive `title`, `summary`, `mainImage` (optional), and `href` (link) as props.
    *   It will render a borderless panel with the image, title, and summary, linking to the `href`. Tailwind CSS will be used for styling.
*   **Step 6: Modify `src/pages/index.astro` to use the new content collection and grid layout.**
    *   Import the new content collection using `getCollection`.
    *   Fetch the `_index.md` content from the root of the new `content/` collection and render its compiled content.
    *   Filter the collection to get top-level files and subfolders.
    *   For each top-level subfolder, render a `ContentPanel` linking to its `_index.md` page (or the subfolder's dynamic route). The panel data will come from the subfolder's `_index.md` frontmatter.
    *   For each top-level file (excluding `_index.md`), render a `ContentPanel` linking to its content page. The panel data will come from the file's frontmatter.
    *   Implement a responsive grid layout using Tailwind CSS to arrange these panels.
*   **Step 7: Create a dynamic route for content pages (`src/pages/content/[...slug].astro`).**
    *   This route will dynamically fetch and render content from the new `content/` collection based on the `slug`.
    *   It will handle both individual Markdown files (e.g., `content/my-post.md`) and `_index.md` files within subfolders (e.g., `content/folder/subfolder/_index.md`).
    *   When an `_index.md` file is accessed, it should display its own content followed by panels for its immediate children (files and subfolders within that specific directory).

#### **Phase 3: Refinements and Testing**

*   **Step 8: Ensure `_index.md` files are correctly parsed for content and panel data.**
    *   Verify that the `mainImage` and `summary` YAML fields in `_index.md` files are correctly extracted and passed to the `ContentPanel` component.
*   **Step 9: Verify all links and image paths are correct after migration and new layout.**
    *   Test navigation to individual content pages and subfolder pages.
    *   Check that images (especially Amazon enrichment images) are displayed correctly.

### **Mermaid Diagram for Content Flow**

```mermaid
graph TD
    A[User Request] --> B{Astro Site Main Page}

    subgraph Content Processing
        C[content/ Directory] --> D[Astro Content Collections]
        D -- getCollection --> E[src/pages/index.astro]
        D -- getEntryBySlug --> F["src/pages/content/[...slug].astro"]
    end

    subgraph Main Page Rendering index.astro
        E --> E1{Fetch content/_index.md}
        E1 --> E2[Render content/_index.md Content]
        E --> E3{Fetch Top-Level Subfolders & Files}
        E3 --> E4[Loop through Subfolders]
        E4 --> E5[Render ContentPanel for Subfolder]
        E5 -- Link to --> F
        E3 --> E6[Loop through Top-Level Files]
        E6 --> E7[Render ContentPanel for File]
        E7 -- Link to --> F
        E2 & E5 & E7 --> G[Grid Layout]
    end

    subgraph Dynamic Content Page Rendering ...slug.astro
        F --> F1{Fetch Content Entry by Slug}
        F1 --> F2[Render Content Entry's Compiled Content]
        F1 -- If _index.md --> F3{Fetch Child Files & Subfolders}
        F3 --> F4[Loop through Children]
        F4 --> F5[Render ContentPanel for Child]
        F5 -- Link to --> F
        F2 & F5 --> H[Content Page Display]
    end

    subgraph Supporting Scripts & Workflows
        I[scripts/enrich-amazon-images.ts] -- Update Path --> C
        J[.github/workflows/deploy.yml] -- Update Path --> C
    end

    B --> G
    G --> H
    I & J --> K[Deployment Process]