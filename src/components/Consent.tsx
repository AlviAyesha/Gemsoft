'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const KEY = 'gs-consent'
type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }

const loadGa = (id: string) => {
  const w = window as W
  if (w.gtag) return
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // gtag expects the arguments object itself
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('js', new Date())
  w.gtag('config', id, { anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

/** Analytics only start after the visitor agrees. Without a GA id nothing is shown or loaded. */
export default function Consent({ gaId }: { gaId?: string }) {
  const [ask, setAsk] = useState(false)
  useEffect(() => {
    if (!gaId) return
    let v: string | null = null
    try {
      v = localStorage.getItem(KEY)
    } catch {}
    if (v === 'yes') loadGa(gaId)
    // the notice slides in once the page has settled, not over the opening animation
    const t = v === 'yes' || v === 'no' ? 0 : window.setTimeout(() => setAsk(true), 1500)
    const reopen = () => setAsk(true)
    addEventListener('gs:consent', reopen)
    return () => {
      clearTimeout(t)
      removeEventListener('gs:consent', reopen)
    }
  }, [gaId])
  if (!gaId || !ask) return null
  const choose = (yes: boolean) => {
    try {
      localStorage.setItem(KEY, yes ? 'yes' : 'no')
    } catch {}
    if (yes) loadGa(gaId)
    setAsk(false)
  }
  return (
    <div className="gs-consent" role="dialog" aria-live="polite" aria-label="Cookie choice">
      <p>
        We use analytics cookies to see which pages help people most. <Link href="/cookies">Cookie policy</Link>
      </p>
      <div>
        <button type="button" className="gs-c-no" onClick={() => choose(false)}>Decline</button>
        <button type="button" className="gs-c-yes" onClick={() => choose(true)}>Accept</button>
      </div>
    </div>
  )
}
