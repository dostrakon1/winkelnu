import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/koopgidsen/categorie/cadeaus-feest',
        destination: '/collecties/cadeaus-feest',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
