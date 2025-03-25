import fs from 'fs'
import path from 'path'
import { Metadata } from '../types'

// Helper to map imported metadata to our standard format
export function standardizeMetadata(importedMetadata: Record<string, unknown>): Metadata {
  const date = (importedMetadata.publishedAt as string) || (importedMetadata.date as string)
  if (!date) {
    throw new Error('No date found in metadata for ' + importedMetadata.title)
  }

  const publishedAt = new Date(date)
  const summary = (importedMetadata.description as string) || (importedMetadata.summary as string) || ''
  const image = importedMetadata.image as string | undefined
  const categories = importedMetadata.categories as string[] | undefined

  return {
    title: (importedMetadata.title as string) || 'Untitled',
    publishedAt: publishedAt.toISOString(),
    summary: summary,
    image: image,
    categories: categories,
    note: importedMetadata.note as boolean | undefined,
    draft: importedMetadata.draft as boolean | undefined
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => {
      const subdirPath = path.join(dir, dirent.name);
      const pageExists = fs.existsSync(path.join(subdirPath, 'page.mdx'));
      return pageExists;
    })
    .map(dirent => dirent.name);
}

/*
async function importMetadata(filePath: string): Promise<Metadata> {
  try {
    const importPath = filePath
      .replace(/\\/g, '/')
      .replace(/^.*?blog\/src\//, '@/')
      .replace(/\.mdx$/, '');

    const { metadata } = await import(importPath);
    return standardizeMetadata(metadata);
  } catch (error) {
    throw new Error(`Error importing metadata from ${filePath} ${error}`);
  }
}
*/

// Function to extract metadata without using dynamic imports
export function extractMetadata(filePath: string): Metadata {
  const content = fs.readFileSync(filePath, 'utf-8');
  const metadataMatch = content.match(/export const metadata = ({[\s\S]*?});/);

  if (metadataMatch && metadataMatch[1]) {
    try {
      // Use eval in a safer way by executing in a controlled scope
      const evalFn = new Function(`
        try {
          const metadata = ${metadataMatch[1]};
          return JSON.stringify(metadata);
        } catch (e) {
          return '{"error": "Failed to evaluate metadata: " + e.message}';
        }
      `);

      const jsonStr = evalFn();
      const metadata = JSON.parse(jsonStr);

      if (metadata.error) {
        console.error(metadata.error);
        return {
          title: 'Error',
          publishedAt: new Date().toISOString(),
          summary: '',
        };
      }

      return standardizeMetadata(metadata);
    } catch (error) {
      console.error(`Error processing metadata from ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`Original metadata: ${metadataMatch[1]}`);
      return {
        title: 'Error',
        publishedAt: new Date().toISOString(),
        summary: '',
      };
    }
  }
  return {
    title: 'No Metadata',
    publishedAt: new Date().toISOString(),
    summary: '',
  };
}

async function getMDXData(dir: string) {
  const mdxDirs = getMDXFiles(dir);

  const posts = await Promise.all(mdxDirs.map(async (dirName) => {
    try {
      // Get the absolute path to the MDX file
      const filePath = path.join(dir, dirName, 'page.mdx');

      // Use importMetadata instead of extractMetadata
      // const metadata = await importMetadata(filePath);
      const metadata = extractMetadata(filePath);
      if (metadata.draft) {
        return null;
      }

      // Read content separately if needed
      const rawContent = fs.readFileSync(filePath, 'utf-8');

      return {
        metadata,
        slug: dirName,
        content: rawContent,
      };
    } catch (error) {
      console.error(`Error processing ${dirName}:`, error);

      // Fallback for errors
      return {
        metadata: {
          title: dirName,
          publishedAt: new Date().toISOString(),
          summary: '',
        },
        slug: dirName,
        content: '',
      };
    }
  }));

  return posts.filter(post => post !== null);
}

export async function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'posts'));
}
