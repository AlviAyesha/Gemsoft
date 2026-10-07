import PageMotion from '@/components/cms/PageMotion'
import Shell from '@/components/shell/Shell'
import './cms.css'

/** Insights and Careers: the design's nav and footer around CMS content, with the shared scroll motion. */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      {children}
      <PageMotion />
    </Shell>
  )
}
