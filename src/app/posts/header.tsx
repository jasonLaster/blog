"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import posts from "./posts.json"


// Define an interface for post data
interface PostData {
  title?: string;
  categories?: string[];
  publishedAt?: string;
  slug?: string;
}

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
  return 'just now';
} 

export default function Header() {
  const segments = useSelectedLayoutSegments();
  const post = posts.find((p: PostData) => p.slug === segments[segments.length - 1]) || null;

  return (
    <div className="flex flex-col gap-2 mb-8">

   
          <h1 className="h-6">{post?.title || <div className="shimmer h-6 w-48 bg-gray-50"></div>}</h1>
            {post?.categories && post.categories.length > 0 && (
            <div className="text-sm h-4 text-neutral-500 flex gap-2">
              {post?.categories?.join(', ') }

              {post?.publishedAt && (
               
                <span suppressHydrationWarning={true} className="text-sm text-neutral-500">
                  ({timeAgo(post?.publishedAt)})
                </span>
              )}
            </div>
          )}

    </div>
  );
}