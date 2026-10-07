import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const payload = () => getPayload({ config })

/** Company details from the CMS (Settings > Site settings). */
export const getSettings = cache(async () => (await payload()).findGlobal({ slug: 'site-settings', depth: 1 }))
