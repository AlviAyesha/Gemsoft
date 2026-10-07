import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CtaBand from '@/components/cms/CtaBand'
import Faq from '@/components/cms/Faq'
import PostCard from '@/components/cms/PostCard'
import Progress from '@/components/cms/Progress'
import RichText from '@/components/cms/RichText'
import Share from '@/components/cms/Share'
import Toc from '@/components/cms/Toc'
import JsonLd from '@/components/JsonLd'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { authorsOf, firstCategory, fmtDate, getPost, postSlugs, relatedPosts } from '@/lib/posts'
import { redirectIfMoved } from '@/lib/redirects'
import { breadcrumbs, ORG_ID } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { abs } from '@/lib/site'
import { outline } from '@/lib/toc'

export const revalidate = 3600

type P = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await postSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled } = await draftMode()
  const post = await getPost(slug, isEnabled)
  if (!post) return {}
  const m = post.meta ?? {}
  const base = pageMeta({
    title: m.title || `${post.title} | GEMSOFT Insights`,
    description: m.description || post.excerpt,
    path: `/insights/${slug}`,
    image: ((u) => (u ? abs(u) : undefined))(mediaUrl(m.image, 'og') || mediaUrl(post.heroImage, 'og')),
    kicker: firstCategory(post)?.title,
    type: 'article',
    noindex: !!m.noindex || isEnabled,
  })
  return {
    ...base,
    alternates: { canonical: m.canonical || abs(`/insights/${slug}`) },
    keywords: [m.focusKeyword, ...(post.tags ?? [])].filter((k): k is string => !!k),
    authors: authorsOf(post).map((a) => ({ name: a.name, url: a.slug ? abs(`/insights/author/${a.slug}`) : undefined })),
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      section: firstCategory(post)?.title,
      tags: post.tags ?? undefined,
    },
  }
}

export default async function InsightPage({ params }: P) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await getPost(slug, draft)
  if (!post) {
    await redirectIfMoved(`/insights/${slug}`)
    notFound()
  }
  const toc = outline(post.content)
  const cat = firstCategory(post)
  const authors = authorsOf(post)
  const related = await relatedPosts(post)
  const url = abs(`/insights/${slug}`)
  const cover = mediaUrl(post.heroImage, 'wide')
  const updated = post.publishedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 864e5
  const faq = (post.faq ?? []).filter((f) => f.question && f.answer)

  return (
    <>
      <Progress target="#ps-article" />
      {draft && (
        <div className="ps-draft">
          Preview of an unpublished version. <a href={`/next/exit-preview?path=/insights/${slug}`}>Leave preview</a>
        </div>
      )}
      <article className="ps" id="ps-article">
        <header className="ps-hero" data-hero>
          <div className="wrap ps-hero-in">
            <ol className="cx-crumb" data-up>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              {cat && <li><Link href={`/insights/category/${cat.slug}`}>{cat.title}</Link></li>}
            </ol>
            {cat && <Link className="cx-kick" href={`/insights/category/${cat.slug}`} data-up>{cat.title}</Link>}
            <h1 className="ps-h1" data-chars>{post.title}</h1>
            <p className="ps-lede" data-up="0.1">{post.excerpt}</p>
            <div className="ps-meta" data-up="0.2">
              {authors.length > 0 && (
                <span className="ps-by">
                  <span className="ps-avs">
                    {authors.map((a) => {
                      const av = mediaUrl(a.avatar, 'thumb')
                      return av ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={a.id} src={av} alt="" width={40} height={40} />
                      ) : (
                        <span key={a.id} className="ps-av-i">{a.name.slice(0, 1)}</span>
                      )
                    })}
                  </span>
                  <span>
                    By{' '}
                    {authors.map((a, i) => (
                      <span key={a.id}>
                        {i > 0 && (i === authors.length - 1 ? ' and ' : ', ')}
                        {a.slug ? <Link href={`/insights/author/${a.slug}`} rel="author">{a.name}</Link> : a.name}
                      </span>
                    ))}
                  </span>
                </span>
              )}
              {post.publishedAt && <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>}
              {updated && <span>Updated <time dateTime={post.updatedAt}>{fmtDate(post.updatedAt)}</time></span>}
              <span>{post.readingTime ?? 1} min read</span>
            </div>
          </div>
          {cover && (
            <div className="wrap">
              <figure className="ps-cover" data-clip>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={mediaAlt(post.heroImage)} width={1600} height={900} fetchPriority="high" data-parallax="-40" />
              </figure>
            </div>
          )}
        </header>

        <div className="wrap ps-body">
          <aside className="ps-side">
            <div className="ps-side-in">
              <Toc items={toc} />
              <Share url={url} title={post.title} />
            </div>
          </aside>
          <div className="ps-main">
            <RichText data={post.content} className="ps-rt" />
            {post.tags && post.tags.length > 0 && (
              <ul className="ps-tags" aria-label="Tags">
                {post.tags.map((t) => <li key={t}>#{t}</li>)}
              </ul>
            )}
            {faq.length > 0 && (
              <section className="ps-faq" aria-labelledby="ps-faq-h">
                <h2 id="ps-faq-h" className="ps-sub" data-up>Questions people ask</h2>
                <Faq items={faq} />
              </section>
            )}
            {authors.map((a) => {
              const av = mediaUrl(a.avatar, 'thumb')
              return (
                <section className="ps-author" key={a.id} data-up>
                  {av ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={av} alt={a.name} width={88} height={88} loading="lazy" />
                  ) : (
                    <span className="ps-av-i ps-av-i--lg">{a.name.slice(0, 1)}</span>
                  )}
                  <div>
                    <span className="ps-side-l">Written by</span>
                    <h2>{a.slug ? <Link href={`/insights/author/${a.slug}`}>{a.name}</Link> : a.name}</h2>
                    {a.role && <p className="ps-author-r">{a.role}</p>}
                    {a.bio && <p>{a.bio}</p>}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="ps-related">
          <div className="wrap">
            <div className="ps-related-h">
              <h2 className="cx-h2 cx-h2--sm" data-chars>Keep reading</h2>
              <Link href="/insights" className="ps-all">All insights</Link>
            </div>
            <div className="ix-grid" data-stagger>
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand words={['Websites', 'Mobile apps', 'Custom software', 'AI automation', 'Support']} title="Want this done for you?" text="Tell us about your project and we will show you how we would approach it." />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${url}#article`,
            mainEntityOfPage: url,
            headline: post.title,
            description: post.meta?.description || post.excerpt,
            image: cover ? [abs(cover)] : undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            wordCount: post.plainText ? post.plainText.split(/\s+/).length : undefined,
            timeRequired: `PT${post.readingTime ?? 1}M`,
            articleSection: cat?.title,
            keywords: post.tags?.join(', ') || undefined,
            inLanguage: 'en',
            author: authors.map((a) => ({ '@type': 'Person', name: a.name, jobTitle: a.role || undefined, url: a.slug ? abs(`/insights/author/${a.slug}`) : undefined })),
            publisher: { '@id': ORG_ID },
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            ...(cat ? [{ name: cat.title, path: `/insights/category/${cat.slug}` }] : []),
            { name: post.title, path: `/insights/${slug}` },
          ]),
          ...(faq.length
            ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }]
            : []),
        ]}
      />
    </>
  )
}
