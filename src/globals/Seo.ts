import type { GlobalConfig } from 'payload'
import { adminsOnly, anyone } from '../access'
import { revalidateSite } from '../hooks/revalidate'
import { SERVICES } from '../content/services'

/** The designed pages (home, about, services, work, contact and each service) have no CMS document of their own. */
export const DESIGN_PAGES: { label: string; value: string }[] = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Services', value: 'services' },
  { label: 'Work', value: 'work' },
  { label: 'Contact', value: 'contact' },
  ...Object.entries(SERVICES).map(([slug, s]) => ({ label: `Service: ${s.name}`, value: `service-${slug}` })),
]

/** Search titles, descriptions and share images for the designed pages, plus tags added to the head of every page. */
export const Seo: GlobalConfig = {
  slug: 'seo',
  label: 'SEO',
  admin: {
    group: 'Settings',
    description: 'Insights, careers, categories and text pages have their own SEO tab when you edit them. This screen covers the designed pages and tags for every page.',
  },
  access: { read: anyone, update: adminsOnly },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Designed pages',
          fields: [
            {
              name: 'pages',
              type: 'array',
              labels: { singular: 'Page', plural: 'Pages' },
              admin: { description: 'Add a row only for pages whose search text you want to change. Empty fields keep the built-in text.', initCollapsed: true },
              fields: [
                { name: 'page', type: 'select', required: true, options: DESIGN_PAGES },
                { name: 'title', type: 'text', admin: { description: 'Shown in Google and the browser tab. Aim for 50 to 60 characters.' } },
                { name: 'description', type: 'textarea', admin: { description: 'Shown under the title in Google. Aim for 120 to 160 characters.' } },
                { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Picture shown when the page is shared (1200 x 630). Without one, a branded image is made from the title.' } },
                { name: 'noindex', type: 'checkbox', label: 'Hide this page from search engines' },
              ],
            },
          ],
        },
        {
          label: 'Head tags (every page)',
          fields: [
            { name: 'google', type: 'text', label: 'Google Search Console verification code', admin: { description: 'Only the code from content="...", not the whole tag.' } },
            { name: 'bing', type: 'text', label: 'Bing Webmaster verification code' },
            { name: 'facebook', type: 'text', label: 'Facebook / Meta domain verification code' },
            {
              name: 'metaTags',
              type: 'array',
              label: 'Other meta tags',
              admin: { description: 'Any other meta tag, for example name "p:domain_verify" or "yandex-verification", with its content.' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'content', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
