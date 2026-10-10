import type { Metadata, Viewport } from 'next'
import Consent from '@/components/Consent'
import JsonLd from '@/components/JsonLd'
import { getSettings } from '@/lib/payload'
import { organization, website } from '@/lib/schema'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import '@/design/shell.css'
import './site.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Websites, Apps and Custom Software`, template: '%s' },
  description: 'GEMSOFT Technologies builds fast websites, mobile apps, custom software and AI automation for growing businesses.',
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/brand/favicon.png', apple: '/brand/icon.png' },
  alternates: { types: { 'application/rss+xml': [{ url: '/insights/rss.xml', title: 'GEMSOFT Insights' }] } },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0B0B0B' }

// sets the "js" and reduced-motion classes before the first paint, as the design expects.
// "vt": the visitor came from another page of the site, so the loading curtain is skipped and the page fades in.
const BOOT =
  "var h=document.documentElement;h.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('rm');" +
  "try{var r=document.referrer,n=performance.getEntriesByType('navigation')[0];if(document.prerendering||(r&&new URL(r).origin===location.origin&&(!n||n.type!=='reload'))){h.classList.add('vt');window.__vt=true}}catch(e){}"

// Chrome and Edge prepare a page in the background when a link to it is hovered, so opening it is instant
const SPECULATION = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/admin*' } },
          { not: { href_matches: '/next/*' } },
          { not: { href_matches: '/*.*' } },
          { not: { selector_matches: '[target=_blank],[download]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => null)
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: SPECULATION }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        {children}
        <JsonLd data={[organization(settings), website()]} />
        <Consent gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
