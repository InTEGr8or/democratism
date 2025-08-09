# Website Enhancements Plan

This document outlines the plan to improve the visual presentation of the Astro website, specifically regarding Markdown content formatting, article layout, and adding a dark mode theme.

### **Detailed Plan for Website Enhancements**

1.  **Markdown Paragraph Padding:**
    *   **Problem:** Markdown paragraphs lack vertical spacing, making them appear as a single block of text.
    *   **Solution:**
        *   **Option 1 (Preferred):** Integrate the `@tailwindcss/typography` plugin. This plugin provides a `prose` class that automatically styles Markdown content with sensible defaults, including paragraph spacing. This is generally the best approach for Markdown.
        *   **Option 2 (Alternative):** Manually add CSS to `src/styles/global.css` to apply `margin-bottom` to paragraph (`p`) elements within the content area.
    *   **Action:** I will first check if `@tailwindcss/typography` is already installed or if it needs to be added. Then, I will apply the `prose` class to the container rendering Markdown content.

2.  **Article Column Flow:**
    *   **Problem:** Articles are currently full-width, and you want them to flow into columns.
    *   **Solution:** Identify the main content area in your Astro layout (likely `src/layouts/Layout.astro` or a component it uses) and apply Tailwind CSS grid classes (e.g., `grid grid-cols-2 gap-8`) to create a multi-column layout. This will involve wrapping the Markdown content in a `div` with these classes.
    *   **Action:** I will locate the main content slot in `src/layouts/Layout.astro` and wrap it with appropriate Tailwind grid classes.

3.  **Dark Mode Theme:**
    *   **Problem:** No dark mode theme exists, and you want a `#000` background with `goldenrod` monospace `<h1>` elements.
    *   **Solution:**
        *   **Enable Dark Mode:** Configure Tailwind CSS to use `class` strategy for dark mode in `tailwind.config.mjs`.
        *   **Implement Styling:**
            *   Apply `dark:bg-black` to the `<body>` tag or a top-level container in `src/layouts/Layout.astro`.
            *   Apply `dark:text-goldenrod` and `dark:font-mono` to `<h1>` elements. This might require extending Tailwind's theme to include a custom font family if `font-mono` isn't sufficient or if a specific monospace font is desired.
        *   **Toggle Mechanism:** While not explicitly requested for implementation now, a toggle (e.g., a button) would be needed for users to switch modes. For this plan, I'll focus on the CSS implementation.
    *   **Action:** I will update `tailwind.config.mjs`, modify `src/layouts/Layout.astro` to apply dark mode classes, and adjust `src/styles/global.css` or add new classes for `<h1>` elements.

### **Mermaid Diagram: High-Level Component Interaction**

```mermaid
graph TD
    A[User Request] --> B{Architect Mode}
    B --> C[Analyze Existing Files]
    C --> D[Formulate Plan]
    D --> E[Modify tailwind.config.mjs]
    E --> F[Modify src/layouts/Layout.astro]
    F --> G[Modify src/styles/global.css]
    G --> H[Install @tailwindcss/typography (if needed)]
    H --> I[Apply Tailwind Classes for Columns & Dark Mode]
    I --> J[Apply CSS for Paragraph Padding & H1 Styling]
    J --> K[Review & Confirm]