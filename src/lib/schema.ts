import type { SiteSetting } from '@/payload-types'
import { abs, SITE_NAME, SITE_URL } from './site'

export const ORG_ID = `${SITE_URL}/#organization`

export const organization = (s?: SiteSetting | null) => {
  const c = s?.contact
  const same = Object.values(s?.social ?? {}).filter((v): v is string => typeof v === 'string' && v.startsWith('http'))
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: s?.siteName || SITE_NAME,
    url: SITE_URL,
    logo: abs('/brand/icon.png'),
    slogan: s?.tagline || undefined,
    email: c?.email || undefined,
    telephone: c?.phone || undefined,
    address: c?.city
      ? { '@type': 'PostalAddress', streetAddress: c.street || undefined, addressLocality: c.city, addressRegion: c.region || undefined, postalCode: c.postalCode || undefined, addressCountry: c.country || undefined }
      : undefined,
    sameAs: same.length ? same : undefined,
  }
}

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/insights?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
})

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
})
