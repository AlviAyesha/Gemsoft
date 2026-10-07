import InsightsList from '@/components/cms/InsightsList'
import { pageMeta } from '@/lib/seo'

export const revalidate = 3600

export const metadata = pageMeta({
  title: 'Insights | Guides, Case Studies and News | GEMSOFT',
  description: 'Practical guides on websites, apps, custom software and AI automation, plus case studies and news from the GEMSOFT team.',
  path: '/insights',
  kicker: 'Insights',
})

export default function InsightsPage() {
  return <InsightsList page={1} />
}
