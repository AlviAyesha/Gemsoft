import type { Metadata } from 'next'
import { abs } from './site'

export const ogImage = (title: string, kicker?: string) => abs(`/next/og?title=${encodeURIComponent(title)}${kicker ? `&kicker=${encodeURIComponent(kicker)}` : ''}`)

/** Page metadata with a canonical URL and matching Open Graph / Twitter tags. Without an image, a branded one is drawn from the title. */
export const pageMeta = ({ title, description, path, image, type = 'website', noindex, kicker }: { title: string; description: string; path: string; image?: string; type?: 'website' | 'article'; noindex?: boolean; kicker?: string }): Metadata => {
  image ??= ogImage(title.split(' | ')[0], kicker)
  return {
  title,
  description,
  alternates: { canonical: abs(path) },
  openGraph: { title, description, url: abs(path), type, ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}) },
  twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  robots: noindex ? { index: false, follow: true } : undefined,
  }
}
