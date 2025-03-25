import { cache } from 'react';
import { getBlogPosts } from '.';

// Get all blog posts with caching
export const getCachedBlogPosts = cache(async () => {
  return getBlogPosts();
});

// Get a specific blog post by slug with caching
export const getCachedPostBySlug = cache(async (slug: string) => {
  const posts = await getCachedBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}); 