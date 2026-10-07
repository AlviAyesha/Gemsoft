import { notFound } from 'next/navigation'
import type { Post } from '@/payload-types'
import JsonLd from '@/components/JsonLd'
import { allCategories, listPosts } from '@/lib/posts'
import { breadcrumbs } from '@/lib/schema'
import { abs } from '@/lib/site'
import CtaBand from './CtaBand'
import InsightsHero from './InsightsHero'
import Pager from './Pager'
import PostCard from './PostCard'
import Topics from './Topics'

type Hero = { kicker: string; title: React.ReactNode; text?: string; name: string }

/**
 * The Insights index, a topic or an author, with numbered pages: hero, featured insight (index only),
 * topic bar, grid, pages and the closing band.
 */
export default async function InsightsList({
  page,
  base = '/insights',
  category,
  author,
  hero,
  crumbs = [],
}: {
  page: number
  base?: string
  category?: { id: number; slug: string }
  author?: number
  hero?: Hero
  crumbs?: { name: string; path: string }[]
}) {
  const [res, cats] = await Promise.all([listPosts({ page, category: category?.id, author }), allCategories()])
  if (page > 1 && page > res.totalPages) notFound()
  const posts = res.docs as Post[]
  const index = !category && !author
  const featured = index && page === 1 ? (posts.find((p) => p.featured) ?? posts[0]) : undefined
  const rest = posts.filter((p) => p !== featured)
  const path = page === 1 ? base : `${base}/page/${page}`
  const h: Hero = hero ?? { kicker: 'Insights', title: <>Ideas worth<br />shipping.</>, text: 'Guides, case studies and company news from the people who design, build and support GEMSOFT software.', name: 'Insights' }
  const trail = [{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }, ...crumbs]
  return (
    <>
      <InsightsHero
        kicker={h.kicker}
        title={h.title}
        text={h.text}
        crumbs={trail.map((c, i) => (i === trail.length - 1 ? { name: c.name } : { name: c.name, href: c.path }))}
        stats={[`${res.totalDocs} ${res.totalDocs === 1 ? 'article' : 'articles'}`, ...(index ? [`${cats.length} topics`, 'Updated weekly'] : [])]}
      />
      <Topics cats={cats} current={category?.slug} />
      <section className="ix-body">
        <div className="wrap">
          {featured && (
            <div className="ix-feat" data-up>
              <span className="cx-kick cx-kick--dark">Featured</span>
              <PostCard post={featured} size="wide" priority />
            </div>
          )}
          {page > 1 && <h2 className="ix-page-h">Page {page} of {res.totalPages}</h2>}
          {rest.length > 0 ? (
            <div className="ix-grid" data-stagger>
              {rest.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            !featured && <p className="ix-empty">Nothing here yet. New insights are on the way.</p>
          )}
          <Pager base={base} page={page} total={res.totalPages} />
        </div>
      </section>
      <CtaBand words={['Guides', 'Case studies', 'Company news', 'Engineering', 'Design']} title="Have a project in mind?" text="Tell us what you are planning. We reply within one business day." />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': index ? 'Blog' : 'CollectionPage',
            name: `GEMSOFT ${h.name}`,
            url: abs(path),
            ...(index
              ? { blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(`/insights/${p.slug}`), datePublished: p.publishedAt })) }
              : { mainEntity: { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/insights/${p.slug}`) })) } }),
          },
          breadcrumbs(trail),
        ]}
      />
    </>
  )
}
