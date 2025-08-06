### Detailed Plan: Grid Layout, Hierarchical Content, and Content Directory Migration

This plan outlines the steps to implement a grid layout for content panels, support a hierarchical content structure with `_index.md` files.

#### Phase 1: Implement Grid Layout and Hierarchical Content Display

1.  **Create a new Astro component for content panels (`src/components/ContentPanel.astro`).**
    *   This component will receive `title`, `summary`, `mainImage` (optional), `href` (link), and `excerpt` as props.
    *   It will render a borderless panel with the image, title, summary, and excerpt, linking to the `href`.
    *   **Styling Note:** The `ContentPanel` will have no border or outer padding. All outer spacing will be handled by the parent grid layout. Inner padding, that is padding _between_ `ContentPanel` content, will be applied by the panel's CSS.
    *   **Decision on Panel Types:** For now, we will continue to use a single `ContentPanel.astro` component for both article summaries and subfolder summaries. Customization for subfolder panels (e.g., displaying sub-content) will be handled by adding new props to `ContentPanel` or by conditional rendering within it.
    *   **New Props for Subfolder Panels:** Consider adding props like `displayContentCount` (number, optional) to control the number of sub-nodes displayed within a subfolder panel.
2.  **Modify `src/pages/index.astro` to use the new content collection and grid layout.**
    *   Import the new content collection using `getCollection`.
    *   Fetch the `_index.md` content from the root of the new `content/` collection and render its compiled content.
    *   Filter the collection to get top-level:
        *   Subfolders:
            *   For each top-level subfolder, render a `ContentPanel` linking to its `_index.md` page (or the subfolder's dynamic route). The panel data will come from the subfolder's `_index.md` frontmatter.
            *   The subfolder panel will also have the ability to display a `displayContentCount` number of sub-nodes.
        *   Files:
            *   For each top-level file (excluding `_index.md`), render a `ContentPanel` linking to its content page. The panel data will come from the file's frontmatter.
    *   Implement a responsive grid layout using Tailwind CSS to arrange these panels.
    *   **Excerpt Logic:** Implement a helper function to extract the first 50 words from `entry.body` for the `excerpt` prop.
3.  **Create a dynamic route for content pages (`src/pages/[...slug].astro`).**
    *   This route will dynamically fetch and render content from the new `content/` collection based on the `slug`.
    *   It will handle both individual Markdown files (e.g., `content/my-post.md`) and `_index.md` files within subfolders (e.g., `content/folder/subfolder/_index.md`).
    *   When an `_index.md` file is accessed, it should display its own content followed by panels for its immediate children (files and subfolders within that specific directory).
    *   **Hierarchical Display Fix:** The logic for identifying and displaying child content panels for subfolder `_index.md` pages needs to be fixed. This involves correctly identifying `_index.md` files by their `entry.id` and accurately filtering direct children.
    *   **URL Structure:** Ensure URLs are clean (e.g., `/article-slug` or `/folder-slug/`) without a `/content` prefix.

#### Phase 2: Refinements and Testing

4.  **Ensure `_index.md` files are correctly parsed for content and panel data.**
    *   Verify that the `mainImage` and `summary` YAML fields in `_index.md` files are correctly extracted and passed to the `ContentPanel` component.
5.  **Verify all links and image paths are correct after migration and new layout.**
    *   Test navigation to individual content pages and subfolder pages.
    *   Check that images (especially Amazon enrichment images) are displayed correctly.
6.  **Address Overall Layout Styling.**
    *   Fix the "squished far to the right" layout issue on both main and content pages. This will involve adjusting container widths, padding, and responsive classes in `src/layouts/Layout.astro` and potentially `src/styles/global.css`.
7.  **Automate Debugging and Verification.**
    *   Create `scripts/check-subfolder-content.ts` to programmatically verify if child content panels are loaded on a given URL.
    *   Create `scripts/capture-screenshot.ts` to automate capturing screenshots of pages.
    *   Implement timestamped logging for `npm run dev` output to a `temp/` directory for easier debugging.

8.  **Update `README.md` with content rendering scheme.**

### **Diagram for Content Flow**

```mermaid
graph TD
    A[User Request] --> B{Astro Site Main Page}

    subgraph Content Processing
        C[content/ Directory] --> D[Astro Content Collections]
        D -- getCollection --> E[src/pages/index.astro]
        D -- getEntry --> F[src/pages/[...slug].astro]
    end

    subgraph Main Page Rendering index.astro
        E --> E1{Fetch root _index.md}
        E1 --> E2[Render root _index.md Content]
        E --> E3{Fetch Top-Level Subfolders & Files}
        E3 --> E4[Loop through Subfolders]
        E4 --> E5[Render ContentPanel for Subfolder]
        E5 -- Link to --> F
        E3 --> E6[Loop through Top-Level Files]
        E6 --> E7[Render ContentPanel for File]
        E7 -- Link to --> F
        E2 & E5 & E7 --> G[Grid Layout]
        note for G "Overall layout needs to be fixed (not squished)"
    end

    subgraph Dynamic Content Page Rendering ...slug.astro
        F --> F1{Fetch Content Entry by Slug}
        F1 --> F2[Render Content Entry's Compiled Content]
        F1 -- If _index.md --> F3{Fetch Direct Child Files & Subfolders}
        F3 --> F4[Loop through Children]
        F4 --> F5[Render ContentPanel for Child]
        F5 -- Link to --> F
        F2 & F5 --> H[Content Page Display]
        note for F3 "Fix logic for identifying and filtering direct children"
    end

    subgraph Supporting Scripts & Workflows
        I[scripts/enrich-amazon-images.ts] -- Update Path --> C
        J[.github/workflows/deploy.yml] -- Update Path --> C
        K[scripts/check-subfolder-content.ts]
        L[scripts/capture-screenshot.ts]
        M[npm run dev:log]
        K & L & M --> N[Automated Debugging & Verification]
    end

    B --> G
    G --> H
    I & J --> O[Deployment Process]