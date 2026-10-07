import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { pageMeta } from '@/lib/seo'
import '@/design/pages/about.css'

export const metadata = pageMeta(PAGE_SEO.about)

export default function Page() {
  return <DesignPage page="about" />
}
