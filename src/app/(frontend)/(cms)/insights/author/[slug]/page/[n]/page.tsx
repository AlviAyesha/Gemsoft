import { permanentRedirect } from 'next/navigation'
import { pageNum } from '@/lib/paging'
import { AuthorView, authorMeta } from '../../view'

export const revalidate = 3600
type P = { params: Promise<{ slug: string; n: string }> }

export const generateMetadata = async ({ params }: P) => {
  const { slug, n } = await params
  return authorMeta(slug, pageNum(n))
}
export default async function AuthorPaged({ params }: P) {
  const { slug, n } = await params
  if (pageNum(n) === 1) permanentRedirect(`/insights/author/${slug}`)
  return <AuthorView slug={slug} page={pageNum(n)} />
}
