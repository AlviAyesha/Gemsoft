import type { Field, FieldHook } from 'payload'

export const slugify = (val: string): string =>
  val
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** Fills the slug from another field (usually the title) when it is left empty, and keeps it URL-safe. */
const formatSlug =
  (from: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[from] ?? originalDoc?.[from]
    return typeof source === 'string' ? slugify(source) : value
  }

export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  label: 'URL slug',
  admin: {
    position: 'sidebar',
    description: `Part of the page address. Leave empty to build it from the ${from}. Changing it on a live page breaks old links unless you add a redirect.`,
  },
  hooks: { beforeValidate: [formatSlug(from)] },
})
