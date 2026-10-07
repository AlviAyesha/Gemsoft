'use client'
/** GSAP, ScrollTrigger and Lenis as window globals, the way the design's motion code uses them. */
let ready: Promise<void> | null = null
export const loadMotionLibs = () =>
  (ready ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
    Object.assign(window, { gsap, ScrollTrigger, Lenis })
  })())

export const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
