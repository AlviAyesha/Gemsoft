import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { designMeta } from '@/lib/designSeo'
import '@/design/pages/work.css'

export const revalidate = 3600

export const generateMetadata = () => designMeta('work', PAGE_SEO.work)

export default function Page() {
  return <DesignPage page="work" />
}
