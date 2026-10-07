import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InsightsList from '@/components/cms/InsightsList'
import { getCategory } from '@/lib/posts'
import { pageMeta } from '@/lib/seo'

export async function categoryMeta(slug: string, page = 1): Promise<Metadata> {
  const c = await getCategory(slug)
  if (!c) return {}
  const base = `/insights/category/${slug}`
  const m = pageMeta({
    title: (c.meta?.title || `${c.title} insights | GEMSOFT`) + (page > 1 ? `, page ${page}` : ''),
    description: c.meta?.description || c.description || `Guides and articles about ${c.title.toLowerCase()} from the GEMSOFT team.`,
    path: page > 1 ? `${base}/page/${page}` : base,
    noindex: !!c.meta?.noindex,
  })
  return c.meta?.canonical && page === 1 ? { ...m, alternates: { canonical: c.meta.canonical } } : m
}

export async function CategoryView({ slug, page = 1 }: { slug: string; page?: number }) {
  if (!Number.isInteger(page) || page < 1) notFound()
  const c = await getCategory(slug)
  if (!c) notFound()
  const base = `/insights/category/${slug}`
  return (
    <InsightsList
      page={page}
      base={base}
      category={{ id: c.id, slug }}
      crumbs={[{ name: c.title, path: base }]}
      hero={{ kicker: 'Topic', title: c.title, text: c.description || `Everything we have written about ${c.title.toLowerCase()}.`, name: `${c.title} insights` }}
    />
  )
}
