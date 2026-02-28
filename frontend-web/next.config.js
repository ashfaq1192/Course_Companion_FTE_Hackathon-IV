/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL,
  },
  images: {
    domains: ['localhost', 'ashfaq1192-course-companion-fte-api.hf.space', 'course-companion-fte.vercel.app'],
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig