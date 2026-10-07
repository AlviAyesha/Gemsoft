import { notFound, permanentRedirect } from 'next/navigation'
import InsightsList from '@/components/cms/InsightsList'
import { pageNum } from '@/lib/paging'
import { pageMeta } from '@/lib/seo'

export const revalidate = 3600

type P = { params: Promise<{ n: string }> }

const num = pageNum

export async function generateMetadata({ params }: P) {
  const n = num((await params).n)
  return pageMeta({
    title: `Insights, page ${n} | GEMSOFT`,
    description: `Page ${n} of guides, case studies and news from the GEMSOFT team.`,
    path: `/insights/page/${n}`,
  })
}

export default async function InsightsPaged({ params }: P) {
  const n = num((await params).n)
  if (!Number.isInteger(n) || n < 1) notFound()
  if (n === 1) permanentRedirect('/insights')
  return <InsightsList page={n} />
}
