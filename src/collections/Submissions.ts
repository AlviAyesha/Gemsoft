import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

const status = {
  name: 'status',
  type: 'select' as const,
  defaultValue: 'new',
  admin: { position: 'sidebar' as const },
  options: [
    { label: 'New', value: 'new' },
    { label: 'In progress', value: 'progress' },
    { label: 'Done', value: 'done' },
    { label: 'Spam', value: 'spam' },
  ],
}

/** Contact form enquiries. Created only by the site's own API route, read only by the team. */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'service', 'budget', 'status', 'createdAt'], group: 'Leads' },
  access: { read: authenticated, create: () => false, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'service', type: 'text', required: true },
    { name: 'budget', type: 'text', required: true },
    { name: 'details', type: 'textarea', required: true },
    { name: 'page', type: 'text', admin: { readOnly: true, description: 'Where the form was sent from.' } },
    status,
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes.' } },
  ],
  timestamps: true,
}

/** CVs uploaded with job applications. Private: never served to the public. */
export const Resumes: CollectionConfig = {
  slug: 'resumes',
  admin: { group: 'Careers', hidden: ({ user }) => !user },
  access: { read: authenticated, create: () => false, update: authenticated, delete: authenticated },
  upload: { mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  fields: [],
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'job', 'email', 'status', 'createdAt'], group: 'Careers' },
  access: { read: authenticated, create: () => false, update: authenticated, delete: authenticated },
  fields: [
    { name: 'job', type: 'relationship', relationTo: 'jobs', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'portfolio', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'resume', type: 'upload', relationTo: 'resumes', required: true },
    status,
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}
