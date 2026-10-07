import type { Metadata } from 'next'
import CtaBand from '@/components/cms/CtaBand'
import InsightsHero from '@/components/cms/InsightsHero'
import PostCard from '@/components/cms/PostCard'
import Topics from '@/components/cms/Topics'
import type { Post } from '@/payload-types'
import { allCategories, listPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Search insights | GEMSOFT', robots: { index: false, follow: true } }

type P = { searchParams: Promise<{ q?: string | string[] }> }

/** Search across titles, summaries and article text. Kept out of search engines; results link to the real pages. */
export default async function SearchPage({ searchParams }: P) {
  const raw = (await searchParams).q
  const q = (Array.isArray(raw) ? raw[0] : raw ?? '').trim().slice(0, 80)
  const [res, cats] = await Promise.all([q ? listPosts({ q, limit: 24 }) : null, allCategories()])
  const posts = (res?.docs ?? []) as Post[]
  return (
    <>
      <InsightsHero
        kicker="Search"
        title={q ? <>Results for<br />“{q}”</> : <>Search<br />insights</>}
        text={q ? `${res?.totalDocs ?? 0} ${res?.totalDocs === 1 ? 'article matches' : 'articles match'} your search.` : 'Find guides, case studies and news by keyword.'}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Insights', href: '/insights' }, { name: 'Search' }]}
        q={q}
      />
      <Topics cats={cats} />
      <section className="ix-body">
        <div className="wrap">
          {posts.length > 0 ? (
            <div className="ix-grid" data-stagger>
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            q && <p className="ix-empty">No insights match “{q}”. Try a shorter word, or browse a topic above.</p>
          )}
        </div>
      </section>
      <CtaBand words={['Guides', 'Case studies', 'Company news']} title="Can't find it? Ask us." text="Send us your question and a person on our team will answer." />
    </>
  )
}
