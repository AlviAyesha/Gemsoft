import type { Access, FieldAccess } from 'payload'

/** Signed-in team members (admins and editors). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)

/** The public sees published documents only; the team sees drafts too. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true

export const adminsOnly: Access = ({ req: { user } }) => user?.role === 'admin'
