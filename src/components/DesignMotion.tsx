'use client'
import { useEffect } from 'react'
import manifest from '@/design/manifest.json'
import { loadMotionLibs, loadScript } from '@/lib/motionLibs'

type Mod = { default?: () => void }
const MOTION: Record<string, () => Promise<Mod>> = {
  home: () => import('@/design/pages/home.js'),
  about: () => import('@/design/pages/about.js'),
  services: () => import('@/design/pages/services.js'),
  work: () => import('@/design/pages/work.js'),
  contact: () => import('@/design/pages/contact.js'),
  'service-web-development': () => import('@/design/pages/service-web-development.js'),
  'service-mobile-apps': () => import('@/design/pages/service-mobile-apps.js'),
  'service-ui-ux-design': () => import('@/design/pages/service-ui-ux-design.js'),
  'service-custom-software': () => import('@/design/pages/service-custom-software.js'),
  'service-e-commerce': () => import('@/design/pages/service-e-commerce.js'),
  'service-ai-automation': () => import('@/design/pages/service-ai-automation.js'),
  'service-seo-growth': () => import('@/design/pages/service-seo-growth.js'),
  'service-cloud-devops': () => import('@/design/pages/service-cloud-devops.js'),
  'service-digital-marketing': () => import('@/design/pages/service-digital-marketing.js'),
  'service-maintenance-support': () => import('@/design/pages/service-maintenance-support.js'),
}
const THREE_D: Record<string, () => Promise<unknown>> = {
  home: () => import('@/design/pages/home.3d.js'),
  work: () => import('@/design/pages/work.3d.js'),
  contact: () => import('@/design/pages/contact.3d.js'),
}
// three.js is the heaviest script on the site. Where its scene sits far down the page, it is fetched only when
// that section comes within two screens; a scene in the hero starts once the page has finished loading.
const THREE_D_SECTION: Record<string, string> = { home: '#hOrbit' }

const pageLoaded = () => new Promise<void>((resolve) => (document.readyState === 'complete' ? resolve() : addEventListener('load', () => resolve(), { once: true })))
const nearScreen = (sel: string) =>
  new Promise<void>((resolve) => {
    const el = document.querySelector(sel)
    if (!el) return resolve()
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); resolve() } }, { rootMargin: '200% 0px' })
    io.observe(el)
  })

/** Starts a design page's motion once: GSAP, ScrollTrigger and Lenis first (the design code expects them as globals),
 *  then the page's own code, then its three.js scene (see THREE_D_SECTION). Pages are linked with plain <a>, so each visit is a fresh document. */
export default function DesignMotion({ page }: { page: string }) {
  useEffect(() => {
    const w = window as unknown as { __designRan?: string }
    if (w.__designRan === page) return // React strict mode runs effects twice in development
    w.__designRan = page
    ;(async () => {
      await loadMotionLibs()
      if ((manifest as Record<string, { map?: boolean }>)[page]?.map) await loadScript('/media/map.js')
      const mod = await MOTION[page]?.()
      mod?.default?.()
      if (!THREE_D[page]) return
      const section = THREE_D_SECTION[page]
      await (section ? nearScreen(section) : pageLoaded())
      await THREE_D[page]()
    })().catch((err) => console.error('motion', page, err))
  }, [page])
  return null
}
