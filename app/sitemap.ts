import { getBlogPosts } from './utils/post';

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
