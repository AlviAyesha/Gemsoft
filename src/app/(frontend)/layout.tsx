import type { Metadata, Viewport } from 'next'
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

// sets the "js" and reduced-motion classes before the first paint, as the design expects
const BOOT = "document.documentElement.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('rm');"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => null)
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        {children}
        <JsonLd data={[organization(settings), website()]} />
      </body>
    </html>
  )
}
