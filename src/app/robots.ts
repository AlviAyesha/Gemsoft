import type { MetadataRoute } from 'next'
import { abs } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // keep staging and preview deployments out of search results
  const live = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production'
  return {
    rules: live ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next/preview', '/next/exit-preview', '/insights/search'] }] : [{ userAgent: '*', disallow: '/' }],
    sitemap: abs('/sitemap.xml'),
  }
}
