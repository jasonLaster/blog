import fs from "fs";
import path from "path";

// Slugify function from mdx-components.tsx
function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function getToday() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function log(msg: string) {
  console.log(`[draft] ${msg}`);
}

async function main() {
  const [, , ...args] = process.argv;
  if (args.length === 0) {
    log("Please provide a post name. Usage: pnpm draft 'My Post Title'");
    process.exit(1);
  }
  const name = args.join(" ");
  const slug = `${getToday()}-${slugify(name)}`;
  const postDir = path.join(__dirname, "../app/posts", slug);
  const mdxPath = path.join(postDir, "page.mdx");

  log(`Creating draft post: '${name}'`);
  log(`Slug: ${slug}`);
  log(`Directory: ${postDir}`);

  if (fs.existsSync(postDir)) {
    log(`Error: Directory already exists: ${postDir}`);
    process.exit(1);
  }

  fs.mkdirSync(postDir, { recursive: true });
  log(`Created directory: ${postDir}`);

  const mdxTemplate = `import { postMetadata } from "../../utils/metadata";

export const metadata = postMetadata({
  title: "${name}",
  description: "",
  date: "${getToday()}",
  draft: true,
  categories: [],
});

// Write your post here
`;

  fs.writeFileSync(mdxPath, mdxTemplate);
  log(`Created file: ${mdxPath}`);
  log("Draft post created successfully!");
}

main().catch((err) => {
  log(`Error: ${err.message}`);
  process.exit(1);
});
