import type { Post } from '@/payload-types'
import { firstCategory, listPosts } from '@/lib/posts'
import { abs, SITE_NAME } from '@/lib/site'

export const revalidate = 3600

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const res = await listPosts({ limit: 50 })
  const posts = res.docs as Post[]
  const items = posts
    .map((p) => {
      const url = abs(`/insights/${p.slug}`)
      const cat = firstCategory(p)
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${esc(p.excerpt)}</description>${cat ? `<category>${esc(cat.title)}</category>` : ''}<pubDate>${new Date(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate></item>`
    })
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME} Insights</title><link>${abs('/insights')}</link><description>Guides, case studies and news from ${SITE_NAME}.</description><language>en</language><atom:link href="${abs('/insights/rss.xml')}" rel="self" type="application/rss+xml"/>${posts[0] ? `<lastBuildDate>${new Date(posts[0].updatedAt).toUTCString()}</lastBuildDate>` : ''}${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' } })
}
