import { AuthorView, authorMeta } from './view'

export const revalidate = 3600
type P = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: P) => authorMeta((await params).slug)
export default async function AuthorPage({ params }: P) {
  return <AuthorView slug={(await params).slug} />
}
