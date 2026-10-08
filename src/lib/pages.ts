import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Page } from '@/payload-types'
import { payload } from './payload'

export const getPage = (slug: string) =>
  unstable_cache(
    async () => (await payload()).find({ collection: 'pages', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 }).then((r) => (r.docs[0] as Page | undefined) ?? null),
    ['page', slug],
    { tags: ['pages'], revalidate: 3600 },
  )()

export const pageSlugs = async () =>
  (await payload())
    .find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 100, depth: 0, select: { slug: true, updatedAt: true } })
    .then((r) => r.docs as Pick<Page, 'slug' | 'updatedAt'>[])
    .catch(() => [])
