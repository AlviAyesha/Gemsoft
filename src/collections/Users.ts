import type { CollectionConfig } from 'payload'
import { adminsOnly, authenticated } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'], group: 'Team' },
  auth: true,
  access: { read: authenticated, create: adminsOnly, update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id, delete: adminsOnly, admin: authenticated },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin (everything, including users and settings)', value: 'admin' },
        { label: 'Editor (insights, careers, enquiries)', value: 'editor' },
      ],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
  ],
}
