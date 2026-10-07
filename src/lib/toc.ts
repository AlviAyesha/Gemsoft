import { slugify } from '@/fields/slug'

type N = { type?: string; tag?: string; text?: string; children?: N[]; __id?: string }
export type TocItem = { id: string; text: string; level: 2 | 3 }

const textOf = (n: N): string => (n.text ?? '') + (n.children ?? []).map(textOf).join('')

/** Gives every H2/H3/H4 in an insight a stable id (for "jump to" links) and returns the H2/H3 outline. */
export const outline = (content: unknown): TocItem[] => {
  const root = (content as { root?: N } | null)?.root
  if (!root) return []
  const seen = new Map<string, number>()
  const items: TocItem[] = []
  const walk = (n: N) => {
    if (n.type === 'heading') {
      const text = textOf(n).trim()
      let id = slugify(text) || 'section'
      const k = seen.get(id) ?? 0
      seen.set(id, k + 1)
      if (k) id = `${id}-${k + 1}`
      n.__id = id
      if (n.tag === 'h2' || n.tag === 'h3') items.push({ id, text, level: n.tag === 'h2' ? 2 : 3 })
    }
    n.children?.forEach(walk)
  }
  walk(root)
  return items
}
