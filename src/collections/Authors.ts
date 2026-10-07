import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateDoc, revalidateDelete } from '../hooks/revalidate'

/** Public author profiles. Real names, roles and bios help Google trust the writing (E-E-A-T). */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'slug'], group: 'Insights' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'role', type: 'text', admin: { description: 'For example "Lead Engineer".' } },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', maxLength: 400 },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'x', type: 'text', label: 'X (Twitter)' },
        { name: 'github', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
  ],
  hooks: { afterChange: [revalidateDoc('/insights/author', ['/insights'])], afterDelete: [revalidateDelete('/insights/author')] },
}
