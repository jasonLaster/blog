"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { ago } from "time-ago";
import posts from "./posts.json"


// Define an interface for post data
interface PostData {
  title?: string;
  categories?: string[];
  publishedAt?: string;
  slug?: string;
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
                  ({ago(post?.publishedAt)})
                </span>
              )}
            </div>
          )}

    </div>
  );
}