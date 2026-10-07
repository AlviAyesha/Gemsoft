import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

/** Open roles on the Careers page. Every field maps to Google's JobPosting schema so roles can show in Google for Jobs. */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job', plural: 'Jobs' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'department', 'location', 'open', '_status'], group: 'Careers' },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'The job title as people search for it, for example "Senior React Developer".' } },
    {
      type: 'row',
      fields: [
        {
          name: 'department',
          type: 'select',
          required: true,
          options: ['Engineering', 'Design', 'Marketing', 'Project management', 'Quality assurance', 'Operations'].map((v) => ({ label: v, value: v.toLowerCase().replace(/ /g, '-') })),
        },
        {
          name: 'employmentType',
          type: 'select',
          required: true,
          defaultValue: 'FULL_TIME',
          options: [
            { label: 'Full-time', value: 'FULL_TIME' },
            { label: 'Part-time', value: 'PART_TIME' },
            { label: 'Contract', value: 'CONTRACTOR' },
            { label: 'Internship', value: 'INTERN' },
          ],
        },
        {
          name: 'workplace',
          type: 'select',
          required: true,
          defaultValue: 'onsite',
          options: [
            { label: 'On-site', value: 'onsite' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Remote', value: 'remote' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', required: true, defaultValue: 'Lahore, Pakistan' },
        { name: 'experience', type: 'text', admin: { description: 'For example "3+ years".' } },
      ],
    },
    {
      name: 'salary',
      type: 'group',
      admin: { description: 'Optional, but roles with a salary range rank better in Google for Jobs.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'min', type: 'number' },
            { name: 'max', type: 'number' },
            { name: 'currency', type: 'select', defaultValue: 'PKR', options: ['PKR', 'USD', 'AED', 'GBP'].map((v) => ({ label: v, value: v })) },
            { name: 'period', type: 'select', defaultValue: 'MONTH', options: [{ label: 'Per month', value: 'MONTH' }, { label: 'Per year', value: 'YEAR' }, { label: 'Per hour', value: 'HOUR' }] },
          ],
        },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 240, admin: { description: 'Two lines shown in the roles list and used as the search description.' } },
    { name: 'about', label: 'About the role', type: 'richText', required: true },
    { name: 'responsibilities', type: 'array', required: true, minRows: 3, fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', required: true, minRows: 3, fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'niceToHave', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    slugField(),
    { name: 'open', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to close the role. Closed roles leave the list and stop taking applications.' } },
    {
      name: 'datePosted',
      type: 'date',
      admin: { position: 'sidebar' },
      hooks: { beforeChange: [({ siblingData, value }) => (siblingData._status === 'published' && !value ? new Date().toISOString() : value)] },
    },
    { name: 'validThrough', label: 'Apply by', type: 'date', admin: { position: 'sidebar', description: 'Optional closing date.' } },
  ],
  hooks: { afterChange: [revalidateDoc('/careers')], afterDelete: [revalidateDelete('/careers')] },
  versions: { drafts: true, maxPerDoc: 20 },
}
