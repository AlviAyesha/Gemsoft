import 'server-only'
import type { Post } from '@/payload-types'
import { allCategories, firstCategory, listPosts } from './posts'
import { mediaAlt, mediaUrl } from './media'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const GO = '<span class="go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>'

/** The home page's Insights block shows the newest published insights instead of the design's sample posts. */
export async function homeInsights(html: string): Promise<string> {
  const start = html.indexOf('<section class="section ins" id="insights"')
  const end = html.indexOf('</section>', start)
  if (start < 0 || end < 0) return html
  let sec = html.slice(start, end)
  sec = sec.replace('href="#blog"', 'href="/insights"').replace(/<p class="lead">.*?<\/p>/s, '<p class="lead">Guides, case studies and company news from the GEMSOFT team.</p>')
  const [res, cats] = await Promise.all([listPosts({ limit: 5 }).catch(() => null), allCategories().catch(() => [])])
  const posts = (res?.docs ?? []) as Post[]
  if (cats.length) {
    const chips = [`<a class="chip" href="/insights" aria-current="page">All insights</a>`, ...cats.slice(0, 5).map((c) => `<a class="chip" href="/insights/category/${c.slug}">${esc(c.title)}</a>`)]
    sec = sec.replace(/<div class="chips"[^>]*>.*?<\/div>/s, `<nav class="chips" aria-label="Insight topics">${chips.join('')}</nav>`)
  }
  if (posts.length) {
    const cards = posts.map((p, i) => {
      const cat = firstCategory(p)?.title ?? 'Insight'
      const meta = `<span class="tag">${esc(cat)}</span>${p.readingTime ?? 1} min read`
      const img = `<img src="${mediaUrl(p.heroImage, i === 0 ? 'wide' : 'card')}" alt="${esc(mediaAlt(p.heroImage))}" loading="lazy">`
      return i === 0
        ? `<a class="post big" href="/insights/${p.slug}"><div class="thumb">${img}${GO}</div><div class="ov"><div class="meta">${meta}</div><h3>${esc(p.title)}</h3><span class="read">Read the insight</span></div></a>`
        : `<a class="post" href="/insights/${p.slug}"><div class="thumb">${img}${GO}</div><div class="meta">${meta}</div><h3>${esc(p.title)}</h3></a>`
    })
    sec = sec.replace(/<div class="ins-grid">.*$/s, `<div class="ins-grid">\n${cards.join('\n')}\n</div>\n  </div>\n`)
  } else {
    sec = sec.replace(/href="#post"/g, 'href="/insights"')
  }
  return html.slice(0, start) + sec + html.slice(end)
}
