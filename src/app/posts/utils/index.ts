import fs from 'fs'
import path from 'path'

// Define the metadata type
export type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  categories?: string[]
  draft?: boolean
}

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

async function getMDXData(dir: string) {
  const mdxDirs = getMDXFiles(dir);

  // Use Promise.all to handle all async imports in parallel
  const posts = await Promise.all(
    mdxDirs.map(async (dirName) => {
      try {
        // Get the absolute path to the MDX file
        const filePath = path.join(dir, dirName, 'page.mdx');

        // Dynamically import the MDX file - this imports the metadata
        // ESM import paths need to be relative to the project root
        const importPath = path.relative(
          path.join(process.cwd(), 'src',),
          filePath
        ).replace(/\\/g, '/');


        // Dynamically import the MDX file
        const { metadata: importedMetadata } = await import(`../../../${importPath}`);

        // Standardize the metadata to our format
        const metadata = standardizeMetadata(importedMetadata || {});

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
        console.error(`Error importing from ${dirName}:`, error);

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
    })
  );

  return posts.filter(post => post !== null);
}

export function formatDate(date: string, includeRelative = false) {

  const targetDate = new Date(date)

  const currentDate = new Date()
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  if (!includeRelative) {
    return targetDate.getFullYear()
  }

  return formattedDate
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'posts'));
}
