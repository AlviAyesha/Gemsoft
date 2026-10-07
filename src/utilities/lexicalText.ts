/** Plain text out of a Lexical rich-text value (for reading time, excerpts and search snippets). */
type Node = { type?: string; text?: string; children?: Node[]; fields?: Record<string, unknown> }

export const lexicalText = (value: unknown): string => {
  const root = (value as { root?: Node } | null)?.root
  if (!root) return ''
  const out: string[] = []
  const walk = (n: Node) => {
    if (typeof n.text === 'string') out.push(n.text)
    if (n.type === 'block' && n.fields) {
      Object.values(n.fields).forEach((v) => typeof v === 'string' && out.push(v))
    }
    n.children?.forEach(walk)
    if (['paragraph', 'heading', 'listitem', 'quote'].includes(n.type ?? '')) out.push('\n')
  }
  walk(root)
  return out.join(' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim()
}

export const readingMinutes = (value: unknown, wpm = 220): number => {
  const words = lexicalText(value).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wpm))
}
