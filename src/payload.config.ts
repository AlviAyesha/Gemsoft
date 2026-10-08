import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import type { GenerateDescription, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Jobs } from './collections/Jobs'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Applications, Inquiries, Resumes } from './collections/Submissions'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { SITE_URL } from './lib/site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const BASE: Record<string, string> = { posts: '/insights', categories: '/insights/category', authors: '/insights/author', jobs: '/careers' }
type Doc = { title?: string; name?: string; slug?: string; excerpt?: string; summary?: string; description?: string; bio?: string }
const generateTitle: GenerateTitle<Doc> = ({ doc, collectionSlug }) => {
  const t = doc?.title || doc?.name || ''
  if (collectionSlug === 'posts') return `${t} | GEMSOFT Insights`
  if (collectionSlug === 'jobs') return `${t} | Careers at GEMSOFT`
  return `${t} | GEMSOFT Technologies`
}
const generateDescription: GenerateDescription<Doc> = ({ doc }) => (doc?.excerpt || doc?.summary || doc?.description || doc?.bio || '').slice(0, 160)
const generateURL: GenerateURL<Doc> = ({ doc, collectionSlug }) => `${SITE_URL}${BASE[collectionSlug ?? ''] ?? ''}/${doc?.slug ?? ''}`

// SMTP is optional: without it, emails are printed to the server log instead of sent
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@gemsoft.example',
      defaultFromName: 'GEMSOFT Website',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | GEMSOFT CMS' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Posts, Categories, Authors, Media, Jobs, Applications, Resumes, Inquiries, Pages, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // dev pushes schema changes automatically; deploys run the files in src/migrations first (npm run build:deploy)
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' }, migrationDir: path.resolve(dirname, 'migrations') }),
  email,
  sharp,
  plugins: [
    seoPlugin({
      collections: ['posts', 'categories', 'jobs', 'pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
      generateURL,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'focusKeyword',
          type: 'text',
          admin: { description: 'The main phrase this page should rank for. Use it in the title, the first paragraph and one H2.' },
        },
        {
          name: 'canonical',
          type: 'text',
          admin: { description: 'Only if this content first appeared elsewhere. Full URL. Leave empty normally.' },
        },
        { name: 'noindex', type: 'checkbox', label: 'Hide from search engines (noindex)' },
      ],
    }),
    redirectsPlugin({
      collections: ['pages', 'posts', 'jobs'],
      overrides: { admin: { group: 'Settings' } },
    }),
    // Uploads go to S3-compatible storage (Cloudflare R2, AWS S3, Supabase) when it is configured,
    // otherwise to the local disk. CVs stay private: they are only served through the CMS to signed-in users.
    s3Storage({
      enabled: !!process.env.S3_BUCKET,
      collections: { media: { prefix: 'media' }, resumes: { prefix: 'resumes' } },
      bucket: process.env.S3_BUCKET || '',
      clientUploads: true,
      config: {
        endpoint: process.env.S3_ENDPOINT || undefined,
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: !!process.env.S3_ENDPOINT,
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' },
      },
    }),
  ],
})
