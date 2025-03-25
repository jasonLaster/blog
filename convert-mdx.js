const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src/app/blog/posts');
const dirs = fs.readdirSync(postsDir).filter(file => 
  fs.statSync(path.join(postsDir, file)).isDirectory()
);

dirs.forEach(dir => {
  const mdxPath = path.join(postsDir, dir, 'page.mdx');
  
  if (!fs.existsSync(mdxPath)) return;
  
  const content = fs.readFileSync(mdxPath, 'utf8');
  
  // Skip if file doesn't have YAML frontmatter or is already converted
  if (!content.startsWith('---') || content.startsWith('export const metadata')) return;
  
  // Extract YAML frontmatter
  const endYaml = content.indexOf('---', 4);
  if (endYaml === -1) return;
  
  const yaml = content.substring(4, endYaml).trim();
  const mainContent = content.substring(endYaml + 3).trim();
  
  // Parse the YAML frontmatter
  const titleMatch = yaml.match(/title:\s*["']?([^"'\n]+)["']?/);
  const dateMatch = yaml.match(/date:\s*([^\n]+)/);
  const categoriesMatch = yaml.match(/categories:\s*([^\n]+)/);
  
  const title = titleMatch ? titleMatch[1].trim().replace(/"/g, "'") : '';
  const date = dateMatch ? dateMatch[1].trim() : '';
  
  // Handle categories that might be space-separated or a YAML array
  let categories = [];
  if (categoriesMatch) {
    const categoriesStr = categoriesMatch[1].trim();
    categories = categoriesStr.includes('[') ? 
      categoriesStr.replace(/[\[\]]/g, '').split(',').map(c => c.trim()) :
      categoriesStr.split(/\s+/).map(c => c.trim());
  }
  
  // Generate canonical URL from directory name
  const slug = dir.substring(dir.indexOf('-') + 1);
  
  // Create description based on title
  const description = `Blog post about ${title}`;
  
  // Build new metadata object
  const metadata = {
    title,
    description,
    date,
    categories,
    alternates: {
      canonical: `/blog/posts/${slug}`
    }
  };
  
  // Format metadata as JS
  const metadataJS = `export const metadata = ${JSON.stringify(metadata, null, 2)};\n\n`;
  
  // Write new content to file
  fs.writeFileSync(mdxPath, metadataJS + mainContent);
  console.log(`Converted ${dir}`);
}); 