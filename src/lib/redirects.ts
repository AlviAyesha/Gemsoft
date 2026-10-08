import 'server-only'
import { unstable_cache } from 'next/cache'
import { permanentRedirect } from 'next/navigation'
import type { Redirect } from '@/payload-types'
import { payload } from './payload'

const all = unstable_cache(
  async () => (await payload()).find({ collection: 'redirects', limit: 1000, depth: 1, pagination: false }).then((r) => r.docs as Redirect[]),
  ['redirects'],
  { tags: ['redirects'], revalidate: 600 },
)

const target = (r: Redirect) => {
  const to = r.to
  if (to?.type === 'custom') return to.url || null
  const ref = to?.reference
  if (!ref || typeof ref.value !== 'object' || !ref.value?.slug) return null
  return { posts: '/insights/', jobs: '/careers/', pages: '/' }[ref.relationTo] + ref.value.slug
}

/** Before a 404, sends old addresses (set in Settings > Redirects) to their new page with a 308. */
export async function redirectIfMoved(path: string) {
  const list = await all().catch(() => [])
  const hit = list.find((r) => r.from.replace(/\/$/, '') === path.replace(/\/$/, ''))
  const to = hit && target(hit)
  if (to && to !== path) permanentRedirect(to)
}
