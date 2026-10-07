'use client'
import { useEffect, useRef } from 'react'

/** Thin orange bar at the top that fills as you read. */
export default function Progress({ target }: { target: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = document.querySelector(target) as HTMLElement | null
    let raf = 0
    const tick = () => {
      raf = 0
      if (!el || !ref.current) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)))
      ref.current.style.transform = `scaleX(${p})`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    addEventListener('scroll', on, { passive: true })
    tick()
    return () => removeEventListener('scroll', on)
  }, [target])
  return <div className="ps-progress" ref={ref} aria-hidden="true" />
}
