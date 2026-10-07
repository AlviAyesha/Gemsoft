import { permanentRedirect } from 'next/navigation'
import { pageNum } from '@/lib/paging'
import { CategoryView, categoryMeta } from '../../view'

export const revalidate = 3600
type P = { params: Promise<{ slug: string; n: string }> }

export const generateMetadata = async ({ params }: P) => {
  const { slug, n } = await params
  return categoryMeta(slug, pageNum(n))
}
export default async function CategoryPaged({ params }: P) {
  const { slug, n } = await params
  if (pageNum(n) === 1) permanentRedirect(`/insights/category/${slug}`)
  return <CategoryView slug={slug} page={pageNum(n)} />
}
