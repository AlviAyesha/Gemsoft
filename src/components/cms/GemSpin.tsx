'use client'
import { useEffect, useRef } from 'react'

const SHEETS = 12, PER = 10, FW = 1280, FH = 720, N = SHEETS * PER

/** The turning 3D GEMSOFT gem (same renders as the home page), playing on its own and spinning faster while you scroll. */
export default function GemSpin({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const cx = cv.getContext('2d')!
    cv.width = FW
    cv.height = FH
    const sheets: HTMLImageElement[] = []
    const reduce = document.documentElement.classList.contains('rm')
    for (let k = 0; k < SHEETS; k++) {
      const im = new Image()
      im.decoding = 'async'
      im.src = `/media/gem-s/s${String(k).padStart(2, '0')}.webp`
      sheets.push(im)
      if (k === 0) im.onload = () => draw(0)
      if (reduce) break
    }
    let f = 0, shown = -1, vis = true, raf = 0, last = performance.now(), boost = 0, lastY = scrollY
    const ok = (i: number) => sheets[Math.floor(i / PER)]?.complete && sheets[Math.floor(i / PER)].naturalWidth
    function draw(i: number) {
      let k = Math.floor(i) % N
      if (!ok(k)) { for (let d = 1; d < N; d++) { if (ok((k - d + N) % N)) { k = (k - d + N) % N; break } } }
      if (!ok(k) || k === shown) return
      const n = k % PER
      cx.clearRect(0, 0, FW, FH)
      cx.drawImage(sheets[Math.floor(k / PER)], (n % 2) * FW, Math.floor(n / 2) * FH, FW, FH, 0, 0, FW, FH)
      shown = k
    }
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting))
    io.observe(cv)
    const onScroll = () => { boost = Math.min(60, boost + Math.abs(scrollY - lastY) * 0.25); lastY = scrollY }
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
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('scroll', onScroll) }
  }, [])
  return <canvas ref={ref} className={`gem-spin ${className}`} aria-hidden="true" />
}
