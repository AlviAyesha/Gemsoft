import { notFound } from 'next/navigation'
import { redirectIfMoved } from '@/lib/redirects'

type P = { params: Promise<{ missing: string[] }> }

/** Any unknown address: follow a redirect set in the CMS (old site URLs), otherwise show the 404 page. */
export default async function Missing({ params }: P) {
  await redirectIfMoved('/' + (await params).missing.join('/'))
  notFound()
}
