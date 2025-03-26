import { getBlogPosts } from "../utils/post";
import { PostsList } from "./postsList";
import { Suspense } from "react";

export async function BlogPosts() {
  const allPosts = await getBlogPosts();

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1;
  });

  return (
    <Suspense fallback={<div className="shimmer">Loading...</div>}>
      <PostsList posts={sortedPosts} />
    </Suspense>
  );
}
