### Revised Detailed Plan: Amazon Book Image Enrichment via GitHub Action

The goal is to automatically fetch and store Amazon product images locally during the CI/CD pipeline, making them available for the `AmazonBook.astro` component.

#### **1. Create an Enrichment Script (`scripts/enrich-amazon-images.ts`)**
This script will be responsible for:
*   **Scanning Content:** Iterating through your Astro content files (e.g., `.md`, `.astro` files in `src/posts/`, `src/pages/`, `src/components/`) to find all unique Amazon product links.
*   **Extracting ASINs:** Parsing the ASIN (Amazon Standard Identification Number) from each identified Amazon link.
*   **Fetching Image ID and URL:** For each unique Amazon product link:
    *   **HTTP Request:** Make an HTTP GET request to the Amazon product page URL.
    *   **HTML Parsing:** Use a library like `cheerio` (Node.js equivalent of jQuery) to parse the HTML response.
    *   **Extracting Image URL/ID:** Locate the main product image element (e.g., `img#landingImage` or similar) and extract its `src` attribute. From this `src` URL, we will parse out the `imageId`. This is a more robust approach than relying on a fixed CDN pattern with ASIN, as the image ID is directly from the product page.
*   **Checking Existing Images:** For each `imageId`, checking if a corresponding image file already exists in `public/images/enrichment/`.
*   **Fetching Missing Images:** For `imageIds` that do not have a local image, the script will attempt to download the image using the extracted image URL.
*   **Saving Images:** Saving the fetched images to `public/images/enrichment/` with a consistent naming convention (e.g., `imageId.jpg`).
*   **Tracking Progress (Optional but Recommended):** Maintain a simple JSON file (e.g., `data/amazon-enrichment-status.json`) to store a list of processed ASINs (and their corresponding `imageId`s) and their image status. This helps avoid re-fetching images unnecessarily and tracks "incomplete" links.

#### **2. Update `AmazonBook.astro` Component**
Modify `src/components/AmazonBook.astro` to:
*   Prioritize using the locally stored image from `public/images/enrichment/<imageId>.jpg` if it exists.
*   Fall back to the Amazon CDN URL using the *extracted* `imageId` (e.g., `https://m.media-amazon.com/images/I/${imageId}._SY342_.jpg`) if the local image is not found. This means the `AmazonBook.astro` component will need to receive the `imageId` as a prop, or the enrichment script will need to generate a mapping from ASIN to ImageId that Astro can use. Given the current component structure, passing the `imageId` as a prop seems most straightforward.

#### **3. Integrate into GitHub Actions Workflow**
This remains largely the same as the previous plan. We will modify your existing `.github/workflows/deploy.yml` to include a new step that runs the enrichment script *before* the Astro build process.

```mermaid
graph TD
    A[Push to main/master or Pull Request] --> B{GitHub Action Triggered};
    B --> C[Checkout Repository];
    C --> D[Setup Node.js];
    D --> E[Install Dependencies (npm install)];
    E --> F[Run Enrichment Script];
    F --> G{New Images Fetched?};
    G -- Yes --> H[Commit New Images (Optional, but recommended for persistence)];
    G -- No --> I[Continue];
    H --> J[Build Astro Site (npm run build)];
    I --> J;
    J --> K[Upload Build Artifact];
    K --> L[Deploy to GitHub Pages];
```

**Key steps in the GitHub Action:**
*   **Add a step to run the enrichment script:** This step will execute `node scripts/enrich-amazon-images.ts` (or `ts-node` if we keep it as TypeScript and don't compile).
*   **Handle new files:** If the enrichment script fetches new images, the GitHub Action will need to commit these new files back to the repository. This ensures the images are part of the repository and available for subsequent builds and deployments. This step requires specific GitHub Action permissions and configuration for committing files.

#### **4. Considerations for Reusability**
*   **Modular Script:** The enrichment script will be designed to be modular, making it easier to copy and adapt to other Astro projects.
*   **GitHub Action Reusability:** The GitHub Action workflow can be templated or copied to other repositories.

#### **5. Error Handling and Logging**
The enrichment script will include robust error handling for network requests, HTML parsing, and file operations, along with clear logging to help debug issues during the GitHub Action run.

---

### Achievements:

*   **Implemented Amazon Image Enrichment Script:** Created `scripts/enrich-amazon-images.ts` to scan content for Amazon links, extract ASINs, fetch product pages, parse the correct `imageId` (using `#imgTagWrapperId`), download images, and save them to `public/images/enrichment/`.
*   **Generated ASIN-to-ImageId Map:** The script now generates `src/data/amazonImageMap.json` to store the mapping between ASINs and their corresponding image IDs.
*   **Updated `AmazonBook.astro` Component:** Modified `src/components/AmazonBook.astro` to accept an `imageId` prop and prioritize displaying locally stored images, falling back to the Amazon CDN if necessary.
*   **Integrated into GitHub Actions Workflow:** Updated `.github/workflows/deploy.yml` to include steps for compiling and running the enrichment script before the Astro build, and to automatically commit new images and the `amazonImageMap.json` file.
*   **Enabled Local Execution:** Added `compile-enrichment` and `enrich-amazon` scripts to `package.json` for easy local compilation and execution of the enrichment process.
*   **Improved TypeScript Configuration:** Created `tsconfig.script.json` and updated `tsconfig.json` and `src/data/amazonImageMap.d.ts` to ensure proper TypeScript compilation and JSON module resolution.
*   **Local Validation Confirmed:** Successfully ran `npm run enrich-amazon` locally, which correctly fetched an image and updated the map. Confirmed that the `AmazonBook.astro` component displays the locally stored image when running `npm run dev`.