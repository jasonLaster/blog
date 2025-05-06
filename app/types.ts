// Define the metadata type
export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  categories?: string[];
  draft?: boolean;
  note?: boolean;
  description?: string;
  ogImage?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: { url: string }[];
  };
};

export type Post = {
  metadata: Metadata;
  slug: string;
  content: string;
};
