import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter'; // Import gray-matter

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'docs');

/**
 * Generates a URL-safe slug from a given string.
 * @param text The input string.
 * @returns A URL-safe slug.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

/**
 * Recursively finds and processes Markdown files to ensure they have slugs.
 * @param dir The directory to scan.
 */
async function processMarkdownFiles(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await processMarkdownFiles(fullPath); // Recurse into subdirectories
    } else if (file.isFile() && (file.name.endsWith('.md') || file.name.endsWith('.mdx'))) {
      console.log(`Processing file: ${fullPath}`);
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      const { data, content } = matter(fileContent);

      if (!data.slug) {
        // Generate slug based on the relative path within CONTENT_DIR
        const relativePath = path.relative(CONTENT_DIR, fullPath);
        let slug = relativePath.replace(/\.(md|mdx)$/, ''); // Remove extension

        // Handle _index.md files: slug should be the parent directory name
        if (file.name.startsWith('_index.')) {
          const parentDir = path.basename(path.dirname(fullPath));
          slug = parentDir === 'docs' ? '' : parentDir; // If parent is 'docs', slug is empty for root _index.md
        }

        // Ensure slug is URL-safe
        data.slug = generateSlug(slug);
        if (file.name.startsWith('_index.')) {
          data.slug = data.slug === '' ? '' : `${data.slug}/_index`;
        }

        const newContent = matter.stringify(content, data);
        await fs.writeFile(fullPath, newContent, 'utf-8');
        console.log(`Added slug '${data.slug}' to ${fullPath}`);
      } else {
        console.log(`Slug already exists for ${fullPath}: '${data.slug}'`);
      }
    }
  }
}

async function enrichSlugs() {
  console.log('Starting slug enrichment process...');
  await processMarkdownFiles(CONTENT_DIR);
  console.log('Slug enrichment process completed.');
}

enrichSlugs().catch(console.error);