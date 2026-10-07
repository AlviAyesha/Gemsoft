'use client'
import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc'

/** "On this page" list that follows the reader and jumps smoothly to a section. */
export default function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [items])
  if (!items.length) return null
  const go = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const l = (window as unknown as { __lenis?: { scrollTo: (t: Element, o: object) => void } }).__lenis
    if (l) l.scrollTo(el, { offset: -100 })
    else el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }
  return (
    <nav className="ps-toc" aria-label="On this page">
      <span className="ps-side-l">On this page</span>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={`l${i.level}${active === i.id ? ' on' : ''}`}>
            <a href={`#${i.id}`} onClick={(e) => go(e, i.id)} aria-current={active === i.id ? 'location' : undefined}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
