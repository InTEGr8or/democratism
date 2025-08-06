# Democratism

Democratism is a false concept that's been smuggled into the popular cultural content, and which must be evicted in order to recover cultural health. It is a diseased thought-virus plague that's produced decamegadeth genocide and will produce gigadeath if it's not therapudically healed.

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── content/
│       └── docs/
│           └── _index.md
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

### Content Rendering Strategy

This project employs a hierarchical content rendering strategy, primarily driven by the `src/content/docs` collection and the use of `_index.md` (or `_index.mdx`) files within subdirectories.

-   **`src/pages/index.astro`**: This page serves as the main entry point. It fetches the root `_index.md` content and displays top-level articles and subfolders.
-   **`src/pages/[...slug].astro`**: This is a dynamic route that handles all other content pages.
    *   If a URL corresponds to a regular content file (e.g., `/my-article`), it renders that article's content.
    *   If a URL corresponds to a folder's `_index.md` file (e.g., `/my-folder/`), it renders the `_index.md` content and then dynamically displays panels for its immediate child articles and subfolders.

This structure allows for organized, nested content, where each folder can have its own introductory page (`_index.md`) that also serves as a directory for its contents.

#### Content Flow Diagram for Content Creators

```mermaid
graph TD
    A[User Navigates to URL] --> B{Is it root (/) or a dynamic slug?}

    B -- / --> C[src/pages/index.astro]
    C --> C1{Fetch root src/content/docs/_index.md}
    C1 --> C2[Render root _index.md Content]
    C --> C3{Fetch Top-Level Articles & Subfolders}
    C3 --> C4[Render ContentPanel for each Article]
    C3 --> C5[Render ContentPanel for each Subfolder (from its _index.md)]
    C2 & C4 & C5 --> C6[Display on Main Page (Grid Layout)]

    B -- /[...slug] --> D[src/pages/[...slug].astro]
    D --> D1{Fetch Content Entry by Slug}
    D1 --> D2{Is it a Folder Index (_index.md)?}

    D2 -- Yes --> E[Render Folder _index.md Content]
    E --> F{Fetch Direct Child Articles & Subfolders}
    F --> G[Render ContentPanel for each Child Article]
    F --> H[Render ContentPanel for each Child Subfolder (from its _index.md)]
    E & G & H --> I[Display on Dynamic Page (Hierarchical)]

    D2 -- No --> J[Render Single Article Content]
    J --> I

    C4 -- Link to --> D
    C5 -- Link to --> D
    G -- Link to --> D
    H -- Link to --> D
```

This diagram illustrates how content is processed and rendered based on the URL and the presence of `_index.md` files, providing a clear guide for structuring content.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
