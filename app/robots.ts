import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/band',
        '/details',
        '/stage',
        '/rider-preview',
        '/unsubscribe',
        '/api/',
        '/auth/',
        '/riders',
      ],
    },
    sitemap: 'https://miked.live/sitemap.xml',
  }
}
