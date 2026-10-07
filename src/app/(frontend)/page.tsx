import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { pageMeta } from '@/lib/seo'
import { homeInsights } from '@/lib/homeInsights'
import '@/design/pages/home.css'

export const metadata = pageMeta(PAGE_SEO.home)
export const revalidate = 3600

export default function Home() {
  return <DesignPage page="home" transform={homeInsights} />
}
