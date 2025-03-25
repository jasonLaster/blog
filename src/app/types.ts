
// Define the metadata type
export type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  categories?: string[]
  draft?: boolean
  note?: boolean
}

export type Post = {
  metadata: Metadata
  slug: string
  content: string
}
