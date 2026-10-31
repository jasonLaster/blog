import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  experimental: {},
  // Keep this custom visual post as a complete document while the MDX metadata
  // makes it discoverable in the normal post index and sitemap.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/posts/2026-10-31-thailand-day-by-day',
          destination: '/thailand/index.html',
        },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: '/article/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [],
  }
})

export default withMDX(nextConfig)