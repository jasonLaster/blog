import { Metadata } from "../types";

export const postMetadata = (post: Metadata) => {
  const defaultOpenGraph = {
    title: post.title,
    description: post.description,
    images: [{ url: `api/og/?title=${post.title}` }],
  };

  const openGraph = post.openGraph
    ? post.openGraph
    : post.ogImage
    ? {
        ...defaultOpenGraph,
        images: [{ url: post.ogImage }],
      }
    : defaultOpenGraph;

  return {
    ...post,
    openGraph,
  };
};
