import { CategoryView, categoryMeta } from './view'

export const revalidate = 3600
type P = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: P) => categoryMeta((await params).slug)
export default async function CategoryPage({ params }: P) {
  return <CategoryView slug={(await params).slug} />
}
