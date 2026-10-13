import 'server-only'
import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { payload } from './payload'
import { pageMeta } from './seo'
import { abs } from './site'

type Defaults = Parameters<typeof pageMeta>[0]

const getSeo = () => payload().then((p) => p.findGlobal({ slug: 'seo', depth: 1 })).catch(() => null)

/** Metadata for a designed page: the built-in text, with whatever is filled in under Settings > SEO on top. */
export async function designMeta(key: string, defaults: Defaults): Promise<Metadata> {
  const row = (await getSeo())?.pages?.find((r) => r.page === key)
  const img = row?.image && typeof row.image === 'object' ? (row.image as Media) : null
  return pageMeta({
    ...defaults,
    title: row?.title?.trim() || defaults.title,
    description: row?.description?.trim() || defaults.description,
    image: img?.url ? abs(img.url) : defaults.image,
    noindex: row?.noindex || defaults.noindex,
  })
}

/** Verification codes and other meta tags from Settings > SEO, for the head of every page. */
export async function headTags(): Promise<Metadata> {
  const s = await getSeo()
  if (!s) return {}
  const other: Record<string, string> = {}
  if (s.facebook?.trim()) other['facebook-domain-verification'] = s.facebook.trim()
  if (s.bing?.trim()) other['msvalidate.01'] = s.bing.trim()
  for (const t of s.metaTags ?? []) if (t.name?.trim() && t.content?.trim()) other[t.name.trim()] = t.content.trim()
  return { verification: { ...(s.google?.trim() ? { google: s.google.trim() } : {}), ...(Object.keys(other).length ? { other } : {}) } }
}
