/** The public address of the site, used for canonical URLs, sitemap, schema and Open Graph. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
export const SITE_NAME = 'GEMSOFT Technologies'
export const abs = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
