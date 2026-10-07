import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { payload } from '@/lib/payload'

const BASE: Record<string, string> = { posts: '/insights', jobs: '/careers' }

/** Live preview from the CMS: only signed-in editors can turn on draft mode. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const collection = url.searchParams.get('collection') ?? ''
  const slug = url.searchParams.get('slug') ?? ''
  const base = BASE[collection]
  if (!base || !/^[a-z0-9-]+$/.test(slug)) return new Response('Bad preview link', { status: 400 })
  const { user } = await (await payload()).auth({ headers: req.headers })
  if (!user) return new Response('Sign in to the CMS to preview drafts', { status: 403 })
  ;(await draftMode()).enable()
  redirect(`${base}/${slug}`)
}
