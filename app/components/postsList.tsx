"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "../utils/date";
import { useSearchParams } from "next/navigation";
import { Post } from "../types";

// A standalone HTML essay needs a document navigation so its own scripts and
// stylesheet load; ordinary MDX posts retain Next.js client navigation.
function PostLink({ post, className, children }: {
  post: Post;
  className: string;
  children: ReactNode;
}) {
  const href = `/posts/${post.slug}`;
  return post.metadata.standalone
    ? <a className={className} href={href}>{children}</a>
    : <Link className={className} href={href}>{children}</Link>;
}

export function PostsList({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const showNotes = Boolean(searchParams.get("notes"));
  const filteredPosts = posts.filter(
    (post) => Boolean(post.metadata.note) == showNotes
  );

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800">
      {/* Desktop version */}
      <div className="hidden md:block">
        {filteredPosts.map((post) => (
          <PostLink
            post={post}
            key={post.slug}
            className="flex flex-col"
          >
            <div className="w-full flex flex-row space-x-2 border-b border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <p className="text-neutral-400 dark:text-neutral-400 w-[65px] tabular-nums text-sm self-center pl-1">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight grow">
                {post.metadata.title}
              </p>
              <p className="text-neutral-400 dark:text-neutral-400 w-[90px] tabular-nums shrink-0 text-sm self-center pl-1">
                {post.metadata.categories?.join(", ")}
              </p>
            </div>
          </PostLink>
        ))}
      </div>

      {/* Mobile version */}
      <div className="block md:hidden">
        {filteredPosts.map((post) => (
          <PostLink
            post={post}
            key={post.slug}
            className="block border-b border-zinc-200 dark:border-zinc-800 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">
              {post.metadata.title}
            </p>
            <div className="flex gap-3 text-sm text-neutral-400 dark:text-neutral-400">
              <span className="tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </span>
              {post.metadata.categories && (
                <span>{post.metadata.categories.join(", ")}</span>
              )}
            </div>
          </PostLink>
        ))}
      </div>
    </div>
  );
}
