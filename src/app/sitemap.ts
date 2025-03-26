/*
import { promises as fs } from 'fs';
import path from 'path';

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const notesDirectory = path.join(process.cwd(), 'app', 'n');
  const slugs = await getNoteSlugs(notesDirectory);

  const notes = slugs.map((slug) => ({
    url: `https://leerob.com/n/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = ['', '/work'].map((route) => ({
    url: `https://leerob.com${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...notes];
}
*/

import { getBlogPosts } from './posts/utils';

const otherUrls = [
  {
    url: 'https://jasonlaster.com',
    lastModified: new Date().toISOString(),
  },
  {
    url: 'https://jasonlaster.com/about',
    lastModified: new Date().toISOString(),
  },
];
export default async function sitemap() {
  const posts = await getBlogPosts();
  const postUrls = posts.map((post) => ({
    url: `https://jasonlaster.com/posts/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt).toISOString(),
  }));

  return [...postUrls, ...otherUrls];
}
