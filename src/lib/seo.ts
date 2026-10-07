import type { Metadata } from 'next'
import { abs } from './site'

/** Page metadata with a canonical URL and matching Open Graph / Twitter tags. */
export const pageMeta = ({ title, description, path, image, type = 'website', noindex }: { title: string; description: string; path: string; image?: string; type?: 'website' | 'article'; noindex?: boolean }): Metadata => ({
  title,
  description,
  alternates: { canonical: abs(path) },
  openGraph: { title, description, url: abs(path), type, ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}) },
  twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  robots: noindex ? { index: false, follow: true } : undefined,
})
