import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RichText from '@/components/cms/RichText'
import JsonLd from '@/components/JsonLd'
import { getPage, pageSlugs } from '@/lib/pages'
import { fmtDate } from '@/lib/posts'
import { redirectIfMoved } from '@/lib/redirects'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'

export const revalidate = 3600

type P = { params: Promise<{ page: string }> }

export async function generateStaticParams() {
  return (await pageSlugs()).filter((p) => p.slug).map((p) => ({ page: p.slug! }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = (await params).page
  const page = await getPage(slug)
  if (!page) return {}
  const m = page.meta ?? {}
  return pageMeta({ title: m.title || `${page.title} | GEMSOFT Technologies`, description: m.description || page.intro || page.title, path: `/${slug}`, noindex: !!m.noindex })
}

/** Privacy, Terms, Cookies and any other text page made in the CMS. */
export default async function TextPage({ params }: P) {
  const slug = (await params).page
  const page = await getPage(slug)
  if (!page) {
    await redirectIfMoved(`/${slug}`)
    notFound()
  }
  return (
    <>
      <section className="lg-hero" data-hero>
        <div className="wrap">
          <ol className="cx-crumb" data-up>
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">{page.title}</span></li>
          </ol>
          <h1 className="ix-h1 lg-h1" data-chars>{page.title}</h1>
          {page.intro && <p className="ix-hero-p" data-up="0.1">{page.intro}</p>}
          <p className="lg-date" data-up="0.2">Last updated <time dateTime={page.updatedAt}>{fmtDate(page.updatedAt)}</time></p>
        </div>
      </section>
      <div className="wrap lg-body">
        <RichText data={page.content} />
      </div>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: page.title, path: `/${slug}` }])} />
    </>
  )
}
