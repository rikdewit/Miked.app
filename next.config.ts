import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  redirects: async () => [
    {
      source: '/:path*',
      destination: 'https://miked.live/:path*',
      permanent: true,
      has: [{ type: 'host', value: 'www.miked.live' }],
    },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    },
  ],
}

export default config
