import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/** Rebuilds the cached pages that show a document as soon as it is published, changed or removed. */
const refresh = async (paths: string[], tags: string[]) => {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    paths.forEach((p) => revalidatePath(p))
    tags.forEach((t) => revalidateTag(t))
  } catch {
    // outside a Next.js request (seed script, CLI): nothing is cached yet
  }
}

export const revalidateDoc =
  (base: string, extra: string[] = []): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    const paths = [base, ...extra, '/sitemap.xml']
    if (doc?.slug) paths.push(`${base}/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) paths.push(`${base}/${previousDoc.slug}`)
    await refresh(paths, [base.replace(/^\//, ''), 'sitemap'])
    return doc
  }

export const revalidateDelete =
  (base: string, extra: string[] = []): CollectionAfterDeleteHook =>
  async ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    await refresh([base, ...extra, `${base}/${doc?.slug ?? ''}`, '/sitemap.xml'], [base.replace(/^\//, ''), 'sitemap'])
    return doc
  }
