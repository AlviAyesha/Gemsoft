import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { designMeta } from '@/lib/designSeo'
import { homeInsights } from '@/lib/homeInsights'
import '@/design/pages/home.css'

export const generateMetadata = () => designMeta('home', PAGE_SEO.home)
export const revalidate = 3600

export default function Home() {
  return <DesignPage page="home" transform={homeInsights} />
}
