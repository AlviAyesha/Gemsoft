import type { MetadataRoute } from 'next'
import { LEGAL, LEGAL_UPDATED } from '@/content/legal'
import { SERVICES } from '@/lib/designPages'
import { pageSlugs } from '@/lib/pages'
import { payload } from '@/lib/payload'
import { abs } from '@/lib/site'

export const revalidate = 3600

/** Every public page: the designed pages, services, insights (with topics and authors) and open roles. */
// CMS text pages, plus the built-in privacy, terms and cookies pages the CMS does not have yet
async function textPages(): Promise<MetadataRoute.Sitemap> {
  const cms = await pageSlugs()
  const legal = Object.keys(LEGAL).filter((slug) => !cms.some((d) => d.slug === slug)).map((slug) => ({ slug, updatedAt: LEGAL_UPDATED }))
  return [...cms, ...legal].map((d) => ({ url: abs(`/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: 'yearly' as const, priority: 0.2 }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const fixed: MetadataRoute.Sitemap = [
    { url: abs('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...['/about', '/services', '/work', '/contact'].map((p) => ({ url: abs(p), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...Object.keys(SERVICES).map((s) => ({ url: abs(`/services/${s}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: abs('/insights'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: abs('/careers'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]
  try {
    const p = await payload()
    const [posts, cats, authors, jobs] = await Promise.all([
      p.find({ collection: 'posts', where: { and: [{ _status: { equals: 'published' } }, { 'meta.noindex': { not_equals: true } }] }, limit: 5000, depth: 1, pagination: false, select: { slug: true, updatedAt: true, heroImage: true, meta: true } }),
      p.find({ collection: 'categories', limit: 500, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
      p.find({ collection: 'authors', limit: 500, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
      p.find({ collection: 'jobs', where: { and: [{ _status: { equals: 'published' } }, { open: { equals: true } }] }, limit: 500, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
    ])
    return [
      ...fixed,
      ...posts.docs
        .filter((d) => !d.meta?.canonical)
        .map((d) => {
          const img = typeof d.heroImage === 'object' && d.heroImage?.url ? [abs(d.heroImage.url)] : undefined
          return { url: abs(`/insights/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: 'monthly' as const, priority: 0.7, images: img }
        }),
      ...cats.docs.map((d) => ({ url: abs(`/insights/category/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: 'weekly' as const, priority: 0.5 })),
      ...authors.docs.map((d) => ({ url: abs(`/insights/author/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: 'monthly' as const, priority: 0.3 })),
      ...jobs.docs.map((d) => ({ url: abs(`/careers/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: 'weekly' as const, priority: 0.6 })),
      ...(await textPages()),
    ]
  } catch {
    return [...fixed, ...Object.keys(LEGAL).map((slug) => ({ url: abs(`/${slug}`), lastModified: new Date(LEGAL_UPDATED), changeFrequency: 'yearly' as const, priority: 0.2 }))]
  }
}
