import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateDoc, revalidateDelete } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'], group: 'Insights' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'Shown at the top of the category page. Write it for readers; Google reads it too.' },
    },
  ],
  hooks: { afterChange: [revalidateDoc('/insights/category', ['/insights'])], afterDelete: [revalidateDelete('/insights/category')] },
}
