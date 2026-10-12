'use client'
import { useEffect, useRef } from 'react'

const SHEETS = 12, PER = 10, FW = 1280, FH = 720, N = SHEETS * PER

/** The turning 3D GEMSOFT gem (same renders as the home page), playing on its own and spinning faster while you scroll.
 *  Each sprite sheet is decoded in the background (createImageBitmap) and only the sheets around the current frame are
 *  kept, so the page never stops to decode a 2560x3600 image while it plays. */
export default function GemSpin({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const cx = cv.getContext('2d')!
    cv.width = FW
    cv.height = FH
    const reduce = document.documentElement.classList.contains('rm')
    const blobs: (Blob | undefined)[] = []
    const bmps = new Map<number, ImageBitmap>()
    const pending = new Set<number>()
    let gone = false
    const want = (s: number) => [(s + SHEETS - 1) % SHEETS, s, (s + 1) % SHEETS]
    const decode = (s: number) => {
      if (bmps.has(s) || pending.has(s) || !blobs[s]) return
      pending.add(s)
      createImageBitmap(blobs[s]!)
        .then((b) => {
          pending.delete(s)
          if (gone) return b.close()
          bmps.set(s, b)
          shown = -1
          draw(f)
        })
        .catch(() => pending.delete(s))
    }
    const fetchSheet = (s: number) =>
      fetch(`/media/gem-s/s${String(s).padStart(2, '0')}.webp`)
        .then((r) => (r.ok ? r.blob() : Promise.reject()))
        .then((b) => { blobs[s] = b; if (want(Math.floor(f / PER)).includes(s)) decode(s) })
        .catch(() => {})
    // the first sheet at once; the other eleven once the hero text has played in (or on the first scroll),
    // so 1.8 MB of sheets does not compete with the headline for the connection
    fetchSheet(0)
    let started = false, timer = 0
    const rest = () => { if (started) return; started = true; for (let s = 1; s < SHEETS; s++) fetchSheet(s) }
    const soon = () => { clearTimeout(timer); timer = window.setTimeout(rest, 1400) }
    if (!reduce) {
      if ((window as { __introDone?: boolean }).__introDone) soon()
      else { addEventListener('gs:intro', soon, { once: true }); timer = window.setTimeout(rest, 6000) }
    }

    let f = 0, shown = -1, vis = true, raf = 0, last = performance.now(), boost = 0, lastY = scrollY, sheet = -1
    function draw(i: number) {
      let k = Math.floor(i) % N
      const s = Math.floor(k / PER)
      if (s !== sheet) {   // keep the previous, current and next sheet decoded; free the rest
        sheet = s
        const keep = want(s)
        for (const [n, b] of bmps) if (!keep.includes(n)) { b.close(); bmps.delete(n) }
        keep.forEach(decode)
      }
      if (!bmps.has(Math.floor(k / PER))) { for (let d = 1; d < N; d++) { const j = (k - d + N) % N; if (bmps.has(Math.floor(j / PER))) { k = j; break } } }
      const bmp = bmps.get(Math.floor(k / PER))
      if (!bmp || k === shown) return
      const n = k % PER
      cx.clearRect(0, 0, FW, FH)
      cx.drawImage(bmp, (n % 2) * FW, Math.floor(n / 2) * FH, FW, FH, 0, 0, FW, FH)
      shown = k
    }
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting))
    io.observe(cv)
    const onScroll = () => { if (!reduce) rest(); boost = Math.min(60, boost + Math.abs(scrollY - lastY) * 0.25); lastY = scrollY }
    addEventListener('scroll', onScroll, { passive: true })
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!vis || reduce) return
      boost *= 0.92
      f = (f + dt * (14 + boost)) % N
      draw(f)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      gone = true
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('gs:intro', soon)
      clearTimeout(timer)
      bmps.forEach((b) => b.close())
    }
  }, [])
  return <canvas ref={ref} className={`gem-spin ${className}`} aria-hidden="true" />
}
