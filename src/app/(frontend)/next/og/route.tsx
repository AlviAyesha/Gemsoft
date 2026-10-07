import fs from 'fs/promises'
import { ImageResponse } from 'next/og'
import path from 'path'

export const runtime = 'nodejs'

let icon: string | null = null
const brand = async () => (icon ??= `data:image/png;base64,${(await fs.readFile(path.join(process.cwd(), 'public', 'brand', 'icon.png'))).toString('base64')}`)

/** Share image (1200x630) for pages without their own: /next/og?title=...&kicker=... */
export async function GET(req: Request) {
  const u = new URL(req.url).searchParams
  const title = (u.get('title') || 'GEMSOFT Technologies').slice(0, 120)
  const kicker = (u.get('kicker') || 'GEMSOFT').slice(0, 40)
  const src = await brand()
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0B0B0B', color: '#fff', padding: '64px 72px', fontFamily: 'sans-serif', position: 'relative' }}>
        <div style={{ position: 'absolute', right: -160, top: -160, width: 620, height: 620, borderRadius: 620, background: 'radial-gradient(circle, rgba(255,122,0,.45), rgba(255,122,0,0) 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={39} height={64} alt="" />
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>GEMSOFT</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span style={{ display: 'flex', alignSelf: 'flex-start', fontSize: 24, fontWeight: 700, color: '#0B0B0B', background: '#FF7A00', padding: '8px 20px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 2 }}>{kicker}</span>
          <span style={{ fontSize: title.length > 60 ? 58 : 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{title}</span>
        </div>
        <div style={{ display: 'flex', height: 8, width: 160, background: '#FF7A00', borderRadius: 8 }} />
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } },
  )
}
