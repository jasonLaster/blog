import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { standardizeMetadata } from "../src/app/posts/utils/"

// Function to extract metadata without using the MDX compiler
function extractMetadataWithRegex(filePath: string, fileName: string) {
  const content = readFileSync(filePath, 'utf-8');
  const metadataMatch = content.match(/export const metadata = ({[\s\S]*?});/);

  if (metadataMatch && metadataMatch[1]) {
    try {
      // Use eval in a safer way by executing in a controlled scope
      // This is more reliable than regex for handling complex JS object literals
      // with apostrophes, quotes, etc.
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
        return {};
      }

      const standardizedMetadata = standardizeMetadata(metadata);
      return {
        ...standardizedMetadata,
        slug: fileName.replace('.mdx', '').replace('/page', ''),
      };
    } catch (error) {
      console.error(`Error processing metadata from ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`Original metadata: ${metadataMatch[1]}`);
      return {};
    }
  }
  return {};
}

async function main() {
  // Get all MDX files in the directory structure
  const dirs = readdirSync('./src/app/posts', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const files = dirs.flatMap(dir => readdirSync(path.join('./src/app/posts', dir))
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(dir, file)));

  // Use the regex extraction instead of MDX evaluation
  const metadata = files.map(file => {
    const filePath = path.join('./src/app/posts', file);
    return extractMetadataWithRegex(filePath, file);
  });


  writeFileSync(
    path.join(__dirname, '../src/app/posts/posts.json'),
    JSON.stringify(metadata, null, 2));
}

main();