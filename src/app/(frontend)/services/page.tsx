import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { designMeta } from '@/lib/designSeo'
import '@/design/pages/services.css'

export const revalidate = 3600

export const generateMetadata = () => designMeta('services', PAGE_SEO.services)

export default function Page() {
  return <DesignPage page="services" />
}
