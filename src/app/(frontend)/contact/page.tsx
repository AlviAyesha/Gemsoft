import DesignPage from '@/components/DesignPage'
import { PAGE_SEO } from '@/lib/designPages'
import { designMeta } from '@/lib/designSeo'
import '@/design/pages/contact.css'

export const revalidate = 3600

export const generateMetadata = () => designMeta('contact', PAGE_SEO.contact)

export default function Page() {
  return <DesignPage page="contact" />
}
