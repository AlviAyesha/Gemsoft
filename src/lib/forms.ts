import 'server-only'

const hits = new Map<string, number[]>()

/** A light per-address limit for public forms (5 sends in 10 minutes). */
export const tooMany = (req: Request, max = 5, windowMs = 10 * 60 * 1000) => {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > max
}

export const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
export const isUrl = (v: string) => !v || /^https?:\/\/\S+\.\S+/.test(v)
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Simple HTML email with label/value rows. */
export const mailTable = (title: string, rows: [string, string][]) =>
  `<h2 style="font-family:Arial,sans-serif">${esc(title)}</h2><table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#5c5c5c;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table>`

export const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
