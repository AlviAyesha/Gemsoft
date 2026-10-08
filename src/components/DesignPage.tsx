import { designMarkup, type DesignKey } from '@/lib/designPages'
import { getSettings } from '@/lib/payload'
import { applySiteDetails } from '@/lib/siteDetails'
import DesignMotion from './DesignMotion'

/** Renders a page from the approved design exactly as designed, then starts its scroll and 3D motion in the browser.
 *  `transform` lets a route swap parts of the markup for live CMS content before it is sent. */
export default async function DesignPage({ page, transform }: { page: DesignKey; transform?: (html: string) => string | Promise<string> }) {
  let html = await designMarkup(page)
  if (transform) html = await transform(html)
  html = applySiteDetails(html, await getSettings().catch(() => null))
  return (
    <>
      <div className="design-root" dangerouslySetInnerHTML={{ __html: html }} />
      <DesignMotion page={page} />
    </>
  )
}
