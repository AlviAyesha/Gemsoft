import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { pageMeta } from '@/lib/seo'
import '@/design/pages/services.css'

export const metadata = pageMeta(PAGE_SEO.services)

export default function Page() {
  return <DesignPage page="services" />
}
