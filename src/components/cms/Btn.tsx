import Link from 'next/link'

export const Arrow = () => (
  <span className="arw" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  </span>
)
export const Diag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

/** The design's pill button: label rolls up on hover, arrow in a circle. Internal CMS links use client navigation. */
export default function Btn({ href, children, tone = 'red', ext }: { href: string; children: string; tone?: 'red' | 'ghost' | 'ghost-dark'; ext?: boolean }) {
  const cls = `btn ${tone === 'red' ? 'btn--red' : tone === 'ghost' ? 'btn--ghost' : 'btn--ghost cms-ghost-dark'}`
  const inner = (
    <>
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <Arrow />
    </>
  )
  const cms = href.startsWith('/insights') || href.startsWith('/careers')
  return cms && !ext ? (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  ) : (
    <a className={cls} href={href}>
      {inner}
    </a>
  )
}
