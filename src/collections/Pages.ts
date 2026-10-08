import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

const refresh: CollectionAfterChangeHook = async ({ doc, previousDoc, req: { context } }) => {
  if (context?.disableRevalidate) return doc
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    ;[doc?.slug, previousDoc?.slug].filter(Boolean).forEach((s) => revalidatePath(`/${s}`))
    revalidatePath('/sitemap.xml')
    revalidateTag('pages', { expire: 0 })
  } catch {
    // outside a Next.js request
  }
  return doc
}

/** Simple text pages such as Privacy, Terms and Cookies, served at /{slug}. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Text page', plural: 'Text pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'], group: 'Settings', description: 'Privacy policy, terms and other plain text pages. Each one is served at /its-slug.' },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea', maxLength: 300, admin: { description: 'One or two lines under the title. Also used as the search description.' } },
    { name: 'content', type: 'richText', required: true },
    slugField(),
  ],
  hooks: { afterChange: [refresh] },
  versions: { drafts: true, maxPerDoc: 20 },
}
