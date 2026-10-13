import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { designMeta } from '@/lib/designSeo'
import '@/design/pages/about.css'

export const revalidate = 3600

export const generateMetadata = () => designMeta('about', PAGE_SEO.about)

export default function Page() {
  return <DesignPage page="about" />
}
