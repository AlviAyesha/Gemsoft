'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { loadMotionLibs } from '@/lib/motionLibs'

type W = Window & { __shellRan?: boolean; __shellRefresh?: () => void; __lenis?: { scrollTo: (y: number, o?: object) => void }; ScrollTrigger?: { refresh: () => void } }

/** Starts the shared nav / smooth scroll / footer motion once, and keeps it in step when the page changes. */
export default function ShellMotion() {
  const path = usePathname()

  useEffect(() => {
    const w = window as W
    if (w.__shellRan) return
    w.__shellRan = true
    loadMotionLibs()
      .then(() => import('@/design/shell.js'))
      .then((m: { default: () => void }) => m.default())
      .catch((e) => console.error('shell motion', e))
  }, [])

  useEffect(() => {
    // the current section is highlighted in the nav and menus
    document.querySelectorAll<HTMLAnchorElement>('.nav-links a, #mobileMenu a, .foot a').forEach((a) => {
      const href = a.getAttribute('href') || ''
      const on = href !== '/' && href.startsWith('/') && (path === href || path.startsWith(href + '/'))
      if (on) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })
    const w = window as W
    w.__lenis?.scrollTo(0, { immediate: true })
    const t = setTimeout(() => {
      w.__shellRefresh?.()
      w.ScrollTrigger?.refresh()
    }, 120)
    return () => clearTimeout(t)
  }, [path])

  return null
}
