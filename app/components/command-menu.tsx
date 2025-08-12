'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as Cmdk from 'cmdk'
import { Post } from '../types'

export default function CommandMenu({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = posts.filter((post) =>
    post.metadata.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <Cmdk.Command className="relative bg-white dark:bg-zinc-900 rounded-md shadow-lg w-96 max-w-full">
            <Cmdk.CommandInput
              autoFocus
              placeholder="Search posts..."
              value={query}
              onValueChange={setQuery}
              className="w-full border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 outline-none bg-transparent"
            />
            <Cmdk.CommandList className="max-h-60 overflow-y-auto">
              {filtered.map((post) => (
                <Cmdk.CommandItem
                  key={post.slug}
                  value={post.slug}
                  onSelect={() => {
                    router.push(`/posts/${post.slug}`)
                    setOpen(false)
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span>{post.metadata.title}</span>
                  {post.metadata.note && (
                    <span className="ml-2 text-xs text-zinc-500">note</span>
                  )}
                </Cmdk.CommandItem>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-zinc-500">No results</div>
              )}
            </Cmdk.CommandList>
          </Cmdk.Command>
        </div>
      )}
    </div>
  )
}
