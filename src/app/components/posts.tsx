import Link from 'next/link'
import { formatDate, getBlogPosts } from '../posts/utils'

export async function BlogPosts() {
  const allBlogs = await getBlogPosts()

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
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
                {post.metadata.categories?.join(', ')}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
