import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  experimental: {},
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

const withMDX = createMDX({})
export default withMDX(nextConfig)