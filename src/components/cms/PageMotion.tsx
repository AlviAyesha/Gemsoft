'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { loadMotionLibs } from '@/lib/motionLibs'

type G = typeof import('gsap').gsap
type W = Window & { gsap?: G; ScrollTrigger?: typeof import('gsap/ScrollTrigger').ScrollTrigger; __introDone?: boolean }

/** Splits text into letters (words never break) for the blur-in reveal used across the design. */
const letters = (el: HTMLElement) => {
  if (el.dataset.split) return [...el.querySelectorAll<HTMLElement>('.ch')]
  el.dataset.split = '1'
  const out: HTMLElement[] = []
  const walk = (n: Node) =>
    [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment()
        ;(c.textContent || '').split(/(\s+)/).forEach((w) => {
          if (!w) return
          if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(' '))
          const wd = document.createElement('span')
          wd.className = 'wd'
          ;[...w].forEach((ch) => {
            const s = document.createElement('span')
            s.className = 'ch'
            s.textContent = ch
            wd.appendChild(s)
            out.push(s)
          })
          frag.appendChild(wd)
        })
        c.parentNode?.replaceChild(frag, c)
      } else if (c.nodeType === 1 && (c as Element).tagName !== 'BR') walk(c)
    })
  walk(el)
  return out
}

/**
 * Scroll and intro motion for the CMS pages, driven by data attributes so pages stay server-rendered:
 *  data-chars   letters blur in (in the hero they wait for the curtain)
 *  data-up      fades and rises in
 *  data-stagger children rise in one after another
 *  data-clip    image opens from the bottom
 *  data-parallax="-80"  drifts while scrolling
 *  data-line    a rule draws from the left
 *  data-draw    SVG strokes draw
 *  data-count   number counts up
 *  data-fill    words light up one by one as the block scrolls through
 *  data-drift="-30"  a row slides sideways (in %) while scrolling
 */
export default function PageMotion() {
  const path = usePathname()
  useEffect(() => {
    if (document.documentElement.classList.contains('rm')) return
    let ctx: { revert: () => void } | undefined
    let cancelled = false
    loadMotionLibs().then(() => {
      if (cancelled) return
      const w = window as W
      const gsap = w.gsap!
      const ST = w.ScrollTrigger!
      gsap.registerPlugin(ST)
      const root = document.querySelector('main.cms') as HTMLElement
      if (!root) return
      ctx = gsap.context(() => {
        const hero = root.querySelector('[data-hero]')
        const inHero = (el: Element) => !!hero && hero.contains(el)
        const heroTl = gsap.timeline({ paused: true })

        root.querySelectorAll<HTMLElement>('[data-chars]').forEach((el) => {
          const ch = letters(el)
          gsap.set(ch, { autoAlpha: 0, filter: 'blur(12px)' })
          const to = { autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out', stagger: Math.min(0.05, 1.2 / ch.length) }
          if (inHero(el)) heroTl.to(ch, to, 0)
          else gsap.to(ch, { ...to, scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-up]').forEach((el) => {
          const d = Number(el.dataset.up) || 0
          if (inHero(el)) heroTl.from(el, { autoAlpha: 0, y: 26, duration: 0.9, ease: 'power3.out' }, 0.35 + d)
          else gsap.from(el, { autoAlpha: 0, y: 40, duration: 0.9, delay: d, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
          const kids = [...el.children]
          if (!kids.length) return
          gsap.from(kids, { autoAlpha: 0, y: 50, duration: 0.9, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
          const from = { clipPath: 'inset(100% 0% 0% 0% round 18px)' }
          const to = { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'power4.inOut' }
          if (inHero(el)) heroTl.fromTo(el, from, to, 0.2)
          else gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(el, { y: 0 }, { y: Number(el.dataset.parallax) || -60, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
          gsap.from(el, { scaleX: 0, transformOrigin: el.dataset.line === 'center' ? 'center' : 'left', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        })
        root.querySelectorAll<SVGElement>('[data-draw]').forEach((svg) => {
          const paths = [...svg.querySelectorAll<SVGGeometryElement>('path,circle,rect,line,polyline')]
          paths.forEach((p) => {
            const len = p.getTotalLength?.() || 200
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
          })
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.08, scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count) || 0
          const o = { v: 0 }
          gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)) }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        })

        root.querySelectorAll<HTMLElement>('[data-fill]').forEach((el) => {
          if (!el.dataset.split) {
            el.dataset.split = '1'
            el.innerHTML = (el.textContent || '').trim().split(/\s+/).map((w) => `<span class="fw">${w}</span>`).join(' ')
          }
          gsap.fromTo(el.querySelectorAll('.fw'), { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } })
        })
        root.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
          gsap.fromTo(el, { xPercent: 0 }, { xPercent: Number(el.dataset.drift) || -25, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })

        // the hero's starting states are set now, so the CSS pre-hide can step aside
        root.classList.add('mo')
        const play = () => heroTl.play()
        if (w.__introDone) play()
        else window.addEventListener('gs:intro', play, { once: true })
        ST.refresh()
      }, root)
    })
    return () => {
      cancelled = true
      ctx?.revert()
      document.querySelector('main.cms')?.classList.remove('mo')
    }
  }, [path])
  return null
}
