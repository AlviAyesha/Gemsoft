import Link from 'next/link'
import GemSpin from './GemSpin'

type Crumb = { name: string; href?: string }

/** Dark hero for the Insights pages: turning gem on the right, letters blur in, search below. */
export default function InsightsHero({ kicker, title, text, crumbs, stats, search = true, q }: { kicker: string; title: React.ReactNode; text?: string; crumbs: Crumb[]; stats?: string[]; search?: boolean; q?: string }) {
  return (
    <section className="ix-hero" data-hero>
      <div className="ix-hero-gem" aria-hidden="true">
        <GemSpin />
        <span className="ix-hero-glow" />
      </div>
      <div className="ix-hero-in wrap">
        <ol className="cx-crumb" data-up>
          {crumbs.map((c, i) => (
            <li key={i}>{c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
          ))}
        </ol>
        <span className="cx-kick" data-up>{kicker}</span>
        <h1 className="ix-h1" data-chars>{title}</h1>
        {text && <p className="ix-hero-p" data-up="0.1">{text}</p>}
        {search && (
          <form className="ix-search" action="/insights/search" role="search" data-up="0.2">
            <label className="sr-only" htmlFor="ix-q">Search insights</label>
            <input id="ix-q" name="q" type="search" placeholder="Search guides, case studies, news..." defaultValue={q} autoComplete="off" />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
          </form>
        )}
        {stats && (
          <ul className="ix-stats" data-up="0.3">
            {stats.map((s) => <li key={s}>{s}</li>)}
          </ul>
        )}
      </div>
      <div className="ix-hero-scroll" aria-hidden="true"><i /></div>
    </section>
  )
}
