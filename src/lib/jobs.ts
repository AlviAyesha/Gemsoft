import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import type { Job } from '@/payload-types'
import { payload } from './payload'

const live: Where = { and: [{ _status: { equals: 'published' } }, { open: { equals: true } }] }

export const openJobs = unstable_cache(
  async () => (await payload()).find({ collection: 'jobs', where: live, sort: '-datePosted', limit: 100, depth: 0 }).then((r) => r.docs as Job[]),
  ['jobs-open'],
  { tags: ['careers'], revalidate: 3600 },
)

/** A published job, open or closed (closed roles still answer so old links explain themselves). */
export const getJob = (slug: string, draft = false) =>
  (draft
    ? async () => (await payload()).find({ collection: 'jobs', where: { slug: { equals: slug } }, draft: true, overrideAccess: true, limit: 1, depth: 1 })
    : unstable_cache(async () => (await payload()).find({ collection: 'jobs', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 }), ['job', slug], { tags: ['careers'], revalidate: 3600 }))().then((r) => (r.docs[0] as Job | undefined) ?? null)

const money = (n: number, c: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n)
export const salaryText = (j: Job) => {
  const s = j.salary
  if (!s?.min && !s?.max) return null
  const c = s.currency || 'PKR'
  const per = { MONTH: 'month', YEAR: 'year', HOUR: 'hour' }[s.period || 'MONTH']
  const range = s.min && s.max ? `${money(s.min, c)} to ${money(s.max, c)}` : money((s.min || s.max)!, c)
  return `${range} a ${per}`
}
