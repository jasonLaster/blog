"use client";

import Link from "next/link";
import { formatDate } from "../utils/date";
import { useSearchParams } from "next/navigation";
import { Post } from "../types";

export function PostsList({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const showNotes = Boolean(searchParams.get("notes"));
  const filteredPosts = posts.filter(
    (post) => Boolean(post.metadata.note) == showNotes
  );

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {filteredPosts.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col"
          href={`/posts/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 border-b border-gray-200 dark:border-gray-700 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        </Link>
      ))}
    </div>
  );
}
