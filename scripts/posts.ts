import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { standardizeMetadata } from "@/app/blog/utils/"

// Function to extract metadata without using the MDX compiler
function extractMetadataWithRegex(filePath: string, fileName: string) {
  const content = readFileSync(filePath, 'utf-8');
  const metadataMatch = content.match(/export const metadata = ({[\s\S]*?});/);

  if (metadataMatch && metadataMatch[1]) {
    try {
      // Handle JS object literals (with trailing commas and single quotes)
      // This is safer than direct eval
      const objectCode = metadataMatch[1]
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/'/g, '"');           // Replace single quotes with double quotes

      const metadata = new Function(`return ${objectCode}`)();
      const standardizedMetadata = standardizeMetadata(metadata);
      return {
        ...standardizedMetadata,
        slug: fileName.replace('.mdx', '').replace('/page', ''),
      };
    } catch (error) {
      throw new Error(`Failed to parse metadata from ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return {};
}

async function main() {
  // Get all MDX files in the directory structure
  const dirs = readdirSync('./src/app/blog/posts', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const files = dirs.flatMap(dir => readdirSync(path.join('./src/app/blog/posts', dir))
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(dir, file)));

  // Use the regex extraction instead of MDX evaluation
  const metadata = files.map(file => {
    const filePath = path.join('./src/app/blog/posts', file);
    return extractMetadataWithRegex(filePath, file);
  });


  writeFileSync(
    path.join(__dirname, '../src/app/blog/posts/posts.json'),
    JSON.stringify(metadata, null, 2));
}

main();