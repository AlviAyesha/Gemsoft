'use client'
import { useEffect } from 'react'
import { MEGA_SERVICES } from '@/content/megaMenu'

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Turns the design's services dropdown into a two-part menu: the list of services on the left, and a preview of the
 *  hovered service (photo, headline, what we offer) on the right that changes while the pointer stays in the menu. */
export default function MegaMenu() {
  useEffect(() => {
    const mega = document.getElementById('mega')
    if (!mega || mega.dataset.preview) return
    mega.dataset.preview = '1'

    const links = [...mega.querySelectorAll<HTMLAnchorElement>(':scope > a')]
    const items = links.map((a) => ({ a, s: MEGA_SERVICES.find((x) => x.href === a.getAttribute('href')) })).filter((x) => x.s)
    if (!items.length) return

    const list = document.createElement('div')
    list.className = 'mm-list'
    links.forEach((a) => list.appendChild(a))

    const prev = document.createElement('a')
    prev.className = 'mm-prev'
    prev.innerHTML =
      '<span class="mm-pics">' +
      items.map(({ s }, i) => `<img src="${esc(s!.image)}" alt="" loading="lazy" decoding="async" data-i="${i}">`).join('') +
      '</span><span class="mm-shade"></span><span class="mm-txt"><span class="mm-kick"></span><span class="mm-h"></span>' +
      '<span class="mm-p"></span><span class="mm-tags"></span><span class="mm-go">Explore service<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></span>'
    prev.setAttribute('tabindex', '-1')

    mega.replaceChildren(list, prev)
    mega.classList.add('mm')

    const pics = [...prev.querySelectorAll<HTMLImageElement>('img')]
    const kick = prev.querySelector('.mm-kick')!
    const h = prev.querySelector('.mm-h')!
    const p = prev.querySelector('.mm-p')!
    const tags = prev.querySelector('.mm-tags')!
    const txt = prev.querySelector<HTMLElement>('.mm-txt')!
    let cur = -1

    const show = (i: number) => {
      if (i === cur) return
      cur = i
      const { s } = items[i]
      items.forEach((it, k) => it.a.classList.toggle('on', k === i))
      pics.forEach((img, k) => img.classList.toggle('on', k === i))
      prev.href = s!.href
      prev.setAttribute('aria-label', s!.title)
      kick.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}  ·  ${s!.title}`
      h.innerHTML = `${esc(s!.lead)} <em>${esc(s!.headline)}</em>`
      p.textContent = s!.text
      tags.innerHTML = s!.offers.map((o) => `<span>${esc(o)}</span>`).join('')
      txt.classList.remove('in')
      void txt.offsetWidth // restart the text animation
      txt.classList.add('in')
    }

    items.forEach(({ a }, i) => {
      a.addEventListener('pointerenter', () => show(i))
      a.addEventListener('focus', () => show(i))
    })
    // the panel lines up with the header: from the logo's left edge to the "Talk with us" button's right edge
    const fit = () => {
      const l = document.querySelector('#nav .logo')?.getBoundingClientRect()
      const r = document.querySelector('#nav .nav-cta')?.getBoundingClientRect()
      if (!l || !r || r.right <= l.left) return
      mega.style.setProperty('--mm-l', `${l.left}px`)
      mega.style.setProperty('--mm-w', `${r.right - l.left}px`)
    }
    fit()
    addEventListener('resize', fit)
    document.getElementById('megaBtn')?.addEventListener('pointerenter', fit)

    const here = items.findIndex(({ s }) => location.pathname === s!.href)
    show(here >= 0 ? here : 0)
  }, [])
  return null
}
