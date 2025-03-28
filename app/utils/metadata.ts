import { Metadata } from "../types";

export const postMetadata = (post: Metadata) => {
  return {
    ...post,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: `api/og/?title=${post.title}` }],
    },
  };
};
