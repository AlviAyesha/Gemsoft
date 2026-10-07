import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InsightsList from '@/components/cms/InsightsList'
import JsonLd from '@/components/JsonLd'
import { getAuthor } from '@/lib/posts'
import { ORG_ID } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { abs } from '@/lib/site'
import { mediaUrl } from '@/lib/media'

export async function authorMeta(slug: string, page = 1): Promise<Metadata> {
  const a = await getAuthor(slug)
  if (!a) return {}
  const base = `/insights/author/${slug}`
  return pageMeta({
    title: `${a.name}${a.role ? `, ${a.role}` : ''} | GEMSOFT Insights` + (page > 1 ? `, page ${page}` : ''),
    description: a.bio || `Articles by ${a.name} on the GEMSOFT Insights blog.`,
    path: page > 1 ? `${base}/page/${page}` : base,
    type: 'website',
  })
}

export async function AuthorView({ slug, page = 1 }: { slug: string; page?: number }) {
  if (!Number.isInteger(page) || page < 1) notFound()
  const a = await getAuthor(slug)
  if (!a) notFound()
  const base = `/insights/author/${slug}`
  const same = Object.values(a.links ?? {}).filter((v): v is string => typeof v === 'string' && v.startsWith('http'))
  const av = mediaUrl(a.avatar, 'thumb')
  return (
    <>
      <InsightsList
        page={page}
        base={base}
        author={a.id}
        crumbs={[{ name: a.name, path: base }]}
        hero={{ kicker: a.role || 'Author', title: a.name, text: a.bio || undefined, name: `articles by ${a.name}` }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: abs(base),
          mainEntity: { '@type': 'Person', name: a.name, jobTitle: a.role || undefined, description: a.bio || undefined, image: av ? abs(av) : undefined, sameAs: same.length ? same : undefined, worksFor: { '@id': ORG_ID } },
        }}
      />
    </>
  )
}
