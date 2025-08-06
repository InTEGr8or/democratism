import type { CollectionEntry } from 'astro:content';
import type { Props as ContentPanelProps } from '../components/ContentPanel.astro';

/**
 * Helper function to get the first N words from a string.
 * @param text The input string.
 * @param n The number of words to return.
 * @returns The first N words of the string.
 */
export function getFirstNWords(text: string | null | undefined, n: number): string {
  if (!text) {
    return '';
  }
  const words = text.split(/\s+/); // Split by any whitespace
  return words.slice(0, n).join(' ');
}

/**
 * Determines if a CollectionEntry represents a folder's index page (_index.md or _index.mdx).
 * @param entry The content collection entry.
 * @returns True if the entry is a folder index, false otherwise.
 */
export function isFolderIndexEntry(entry: CollectionEntry<'docs'>): boolean {
  // Checks if the filePath contains '/_index.' followed by any common markdown extension
  return entry.filePath?.includes('/_index.') ?? false;
}

/**
 * Retrieves direct child content panels for a given parent folder index entry.
 * @param parentEntry The parent content collection entry (expected to be a folder index).
 * @param allDocs All content collection entries.
 * @returns An array of ContentPanelProps for direct children.
 */
export function getDirectChildren(parentEntry: CollectionEntry<'docs'>, allDocs: CollectionEntry<'docs'>[]): ContentPanelProps[] {
  // Ensure parentEntry.filePath is defined before proceeding
  if (!parentEntry.filePath) {
    return [];
  }

  const parentFolderPath = parentEntry.filePath.substring(0, parentEntry.filePath.lastIndexOf('/_index.'));

  return allDocs.filter((childEntry: CollectionEntry<'docs'>) => {
    // Ensure childEntry.filePath is defined
    if (!childEntry.filePath) {
      return false;
    }

    // Exclude the current entry itself
    if (childEntry.id === parentEntry.id) {
      return false;
    }

    // Ensure the childEntry.filePath starts with the parentFolderPath followed by a slash
    if (!childEntry.filePath.startsWith(parentFolderPath + '/')) {
      return false;
    }

    // Calculate the relative path from the parentFolderPath
    const relativePath = childEntry.filePath.substring(parentFolderPath.length + 1);

    // A direct child file should not contain any further slashes
    const isDirectChildFile = !relativePath.includes('/');

    // A direct child folder's _index.md/_index.mdx file should have exactly one slash and contain /_index.
    const isDirectChildFolderIndex = relativePath.includes('/_index.') && relativePath.split('/').length === 2;

    return isDirectChildFile || isDirectChildFolderIndex;
  }).map((childEntry: CollectionEntry<'docs'>): ContentPanelProps => {
    const isChildFolder = isFolderIndexEntry(childEntry);
    const childHref = isChildFolder
      ? `/${(childEntry.data as any).slug.replace('/_index', '')}/`
      : `/${(childEntry.data as any).slug}`;

    return {
      title: childEntry.data.title as string,
      summary: (childEntry.data.summary ?? '') as string,
      mainImage: childEntry.data.mainImage as string | undefined,
      href: childHref,
      excerpt: getFirstNWords(childEntry.body, 50),
    };
  });
}