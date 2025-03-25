"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import posts from "./posts.json";
import type { Post } from "../types";

function timeAgo(date: string | Date): string {
  // Simple fallback implementation
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();

  // Convert to appropriate time unit
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear}y ago`;
  if (diffMonth > 0) return `${diffMonth}mo ago`;
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "just now";
}

export default function Header() {
  const segments = useSelectedLayoutSegments();
  const post =
    (posts as Post[]).find((p) => p.slug === segments[segments.length - 1]) ||
    null;

  const isIndex = !segments[segments.length - 1];

  if (isIndex) {
    return <div className="flex flex-col gap-2 mb-8"></div>;
  }

  if (!post) {
    return (
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="h-6">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-8">
      <h1 className="h-6">{post.metadata.title}</h1>
      {post.metadata.categories && post.metadata.categories.length > 0 && (
        <div className="text-sm h-4 text-neutral-500 flex gap-2">
          {post.metadata.categories.join(", ")}

          {post.metadata.publishedAt && (
            <span
              suppressHydrationWarning={true}
              className="text-sm text-neutral-500"
            >
              ({timeAgo(post.metadata.publishedAt)})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
