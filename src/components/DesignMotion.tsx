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

/** Starts a design page's motion once: GSAP, ScrollTrigger and Lenis first (the design code expects them as globals),
 *  then the page's own code, then its three.js scene. Pages are linked with plain <a>, so each visit is a fresh document. */
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
      await THREE_D[page]?.()
    })().catch((err) => console.error('motion', page, err))
  }, [page])
  return null
}
