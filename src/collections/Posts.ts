import type { CollectionConfig } from 'payload'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { authenticated, publishedOrAuthenticated } from '../access'
import { postBlocks } from '../blocks'
import { slugField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'
import { lexicalText, readingMinutes } from '../utilities/lexicalText'

/** Insights (the blog). Built for search: one H1 from the title, H2-H4 in the body, required excerpt and cover alt,
 *  authors and dates for article schema, FAQ for rich results, and an SEO tab added by the SEO plugin. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Insight', plural: 'Insights' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    group: 'Insights',
    preview: (doc) => `/next/preview?collection=posts&slug=${doc?.slug ?? ''}`,
    livePreview: { url: ({ data }) => `/next/preview?collection=posts&slug=${data?.slug ?? ''}` },
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  defaultPopulate: { title: true, slug: true, excerpt: true, heroImage: true, categories: true, publishedAt: true, readingTime: true, meta: true },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 110, admin: { description: 'The page heading (H1). Aim for 50 to 70 characters with the main keyword near the start.' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'heroImage', label: 'Cover image', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              minLength: 70,
              maxLength: 220,
              admin: { description: 'One or two sentences shown on cards and used as the search description when the SEO tab is empty.' },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter((f) => f.key !== 'heading'),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: postBlocks }),
                  HorizontalRuleFeature(),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, required: true, admin: { description: 'The first one is the main category (used in the URL breadcrumb).' } },
            { name: 'tags', type: 'text', hasMany: true, admin: { description: 'Short topics, for example "Next.js" or "Shopify".' } },
            { name: 'authors', type: 'relationship', relationTo: 'authors', hasMany: true, required: true },
            {
              name: 'faq',
              label: 'FAQ (shows as questions on the page and as FAQ schema for Google)',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              maxRows: 3,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
              admin: { description: 'Optional. Left empty, the page shows the newest insights from the same category.' },
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Filled in on first publish. Shown on the page and in article schema.' },
      hooks: {
        beforeChange: [({ siblingData, value }) => (siblingData._status === 'published' && !value ? new Date().toISOString() : value)],
      },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Pin to the top of the Insights page.' } },
    { name: 'readingTime', type: 'number', admin: { position: 'sidebar', readOnly: true, description: 'Minutes, counted automatically.' } },
    { name: 'plainText', type: 'textarea', admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.content) {
          data.readingTime = readingMinutes(data.content)
          data.plainText = lexicalText(data.content).slice(0, 20000)
        }
        return data
      },
    ],
    afterChange: [revalidateDoc('/insights', ['/'])],
    afterDelete: [revalidateDelete('/insights', ['/'])],
  },
  versions: { drafts: { autosave: { interval: 1500 }, schedulePublish: true }, maxPerDoc: 40 },
}
