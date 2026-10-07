import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import type { Author, Category, Post } from '@/payload-types'
import { payload } from './payload'

export const PER_PAGE = 9
const published = { _status: { equals: 'published' as const } }

export const listPosts = (opts: { page?: number; category?: number; author?: number; q?: string; limit?: number } = {}) =>
  unstable_cache(
    async () => {
      const p = await payload()
      const and: Where[] = [published]
      if (opts.category) and.push({ categories: { in: [opts.category] } })
      if (opts.author) and.push({ authors: { in: [opts.author] } })
      if (opts.q) and.push({ or: [{ title: { like: opts.q } }, { excerpt: { like: opts.q } }, { plainText: { like: opts.q } }] })
      return p.find({ collection: 'posts', where: { and }, sort: '-publishedAt', page: opts.page ?? 1, limit: opts.limit ?? PER_PAGE, depth: 2 })
    },
    ['posts', JSON.stringify(opts)],
    { tags: ['insights'], revalidate: 3600 },
  )()

export const getPost = (slug: string, draft = false) =>
  (draft
    ? async () => (await payload()).find({ collection: 'posts', where: { slug: { equals: slug } }, draft: true, depth: 2, limit: 1, overrideAccess: true })
    : unstable_cache(async () => (await payload()).find({ collection: 'posts', where: { and: [{ slug: { equals: slug } }, published] }, depth: 2, limit: 1 }), ['post', slug], { tags: ['insights'], revalidate: 3600 }))().then((r) => (r.docs[0] as Post | undefined) ?? null)

export const allCategories = unstable_cache(async () => (await payload()).find({ collection: 'categories', limit: 100, sort: 'title', depth: 0 }).then((r) => r.docs as Category[]), ['categories'], { tags: ['insights'], revalidate: 3600 })

export const relatedPosts = async (post: Post) => {
  const picked = (post.relatedPosts ?? []).filter((r): r is Post => typeof r === 'object' && !!r?.slug)
  if (picked.length >= 3) return picked.slice(0, 3)
  const cat = post.categories?.[0]
  const catId = typeof cat === 'object' ? cat?.id : cat
  const res = await listPosts({ category: catId ?? undefined, limit: 6 })
  const more = (res.docs as Post[]).filter((d) => d.id !== post.id && !picked.some((x) => x.id === d.id))
  if (picked.length + more.length < 3) {
    const latest = await listPosts({ limit: 6 })
    more.push(...(latest.docs as Post[]).filter((d) => d.id !== post.id && ![...picked, ...more].some((x) => x.id === d.id)))
  }
  return [...picked, ...more].slice(0, 3)
}

export const firstCategory = (p: Post) => {
  const c = p.categories?.[0]
  return typeof c === 'object' ? c : null
}

export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

export const getCategory = (slug: string) =>
  unstable_cache(async () => (await payload()).find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 1 }).then((r) => (r.docs[0] as Category | undefined) ?? null), ['category', slug], { tags: ['insights'], revalidate: 3600 })()

export const getAuthor = (slug: string) =>
  unstable_cache(async () => (await payload()).find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1, depth: 1 }).then((r) => (r.docs[0] as Author | undefined) ?? null), ['author', slug], { tags: ['insights'], revalidate: 3600 })()

/** Slugs to pre-render at build time (the newest insights; the rest render on first visit). */
export const postSlugs = async (limit = 100) =>
  (await payload())
    .find({ collection: 'posts', where: published, sort: '-publishedAt', limit, depth: 0, select: { slug: true } })
    .then((r) => r.docs.map((d) => d.slug).filter((s): s is string => !!s))
    .catch(() => [])

export const authorsOf = (p: Post) => (p.authors ?? []).filter((a): a is Author => typeof a === 'object' && !!a)
