import 'server-only'
import type { SiteSetting } from '@/payload-types'

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * The design carries placeholder contact details and empty social links.
 * Swap in what is saved under Settings > Site settings; social icons without a link are left out.
 */
export function applySiteDetails(html: string, s?: SiteSetting | null) {
  const c = s?.contact ?? {}
  if (c.email) html = html.replaceAll('hello@gemsoft.example', attr(c.email))
  if (c.careersEmail) html = html.replaceAll('careers@gemsoft.example', attr(c.careersEmail))
  if (c.phone) html = html.replaceAll('<li>+00 000 0000000</li>', `<li><a href="tel:${attr(c.phone.replace(/[^+\d]/g, ''))}">${attr(c.phone)}</a></li>`)
  if (c.street) html = html.replaceAll('Office address', attr(c.street))
  const social = (s?.social ?? {}) as Record<string, string | null | undefined>
  return html.replace(/<a href="#" data-social="([a-z]+)"([^>]*)>[\s\S]*?<\/a>/g, (whole, name: string, rest: string) => {
    const url = social[name]
    return url && /^https?:\/\//.test(url) ? whole.replace(`<a href="#" data-social="${name}"${rest}>`, `<a href="${attr(url)}" target="_blank" rel="noopener noreferrer"${rest}>`) : ''
  })
}
