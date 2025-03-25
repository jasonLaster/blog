import Header from "./header";
import { getBlogPosts } from "../utils/post";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = (await getBlogPosts()).map((post) => ({
    metadata: post.metadata,
    slug: post.slug,
  }));

  return (
    <div>
      <Header posts={posts} />
      {children}
    </div>
  );
}
