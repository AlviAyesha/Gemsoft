import type { GlobalConfig } from 'payload'
import { adminsOnly, anyone } from '../access'

/** Company details used across the site and in Organization schema, plus where form notifications go. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: adminsOnly },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'GEMSOFT Technologies' },
    { name: 'tagline', type: 'text', defaultValue: 'Brilliance in every facet' },
    { name: 'defaultDescription', type: 'textarea', required: true, defaultValue: 'GEMSOFT Technologies builds websites, mobile apps, custom software and AI automation for growing businesses.' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'hello@gemsoft.example' },
        { name: 'careersEmail', type: 'email', defaultValue: 'careers@gemsoft.example' },
        { name: 'phone', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text', defaultValue: 'Lahore' },
        { name: 'region', type: 'text', defaultValue: 'Punjab' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'PK', admin: { description: 'Two-letter country code.' } },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'x', type: 'text', label: 'X (Twitter)' },
        { name: 'github', type: 'text' },
      ],
    },
    {
      name: 'notify',
      label: 'Send form notifications to',
      type: 'group',
      fields: [
        { name: 'inquiries', type: 'email', defaultValue: 'hello@gemsoft.example' },
        { name: 'applications', type: 'email', defaultValue: 'careers@gemsoft.example' },
      ],
    },
  ],
}
