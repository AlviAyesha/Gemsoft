/** Tiny builders for Lexical rich text, for content written in code (the legal pages). `**bold**` marks bold text. */
type N = Record<string, unknown>
const text = (t: string, format = 0): N => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const inline = (s: string): N[] => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) => (part.startsWith('**') ? text(part.slice(2, -2), 1) : text(part)))
const el = (type: string, children: N[], extra: N = {}): N => ({ type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra })
export const p = (s: string) => el('paragraph', inline(s), { textFormat: 0, textStyle: '' })
export const h = (tag: 'h2' | 'h3', s: string) => el('heading', [text(s)], { tag })
export const ul = (items: string[]) => el('list', items.map((s, i) => el('listitem', inline(s), { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })
export const doc = (...children: N[]) => ({ root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 } })
