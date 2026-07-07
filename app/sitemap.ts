import { getBlogPosts } from './utils/post';
import { isProjectsPageEnabled } from './lib/feature-flags';

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
  const projectUrls = isProjectsPageEnabled()
    ? [
        {
          url: 'https://jasonlaster.com/projects',
          lastModified: new Date().toISOString(),
        },
      ]
    : [];

  return [...postUrls, ...otherUrls, ...projectUrls];
}
