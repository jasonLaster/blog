import { readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { extractMetadata } from "../src/app/utils/post"

async function main() {
  // Get all MDX files in the directory structure
  const dirs = readdirSync('./src/app/posts', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const files = dirs.flatMap(dir => readdirSync(path.join('./src/app/posts', dir))
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(dir, file)));

  const metadata = files.map(file => {
    const filePath = path.join('./src/app/posts', file);
    return {
      metadata: extractMetadata(filePath),
      slug: file.replace('.mdx', '').replace('/page', ''),
    };
  });

  writeFileSync(
    path.join(__dirname, '../src/app/posts/posts.json'),
    JSON.stringify(metadata, null, 2));
}

main();