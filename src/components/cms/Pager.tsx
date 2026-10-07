import Link from 'next/link'

/** Numbered pages with crawlable links (/base/page/2), not "load more". */
export default function Pager({ base, page, total }: { base: string; page: number; total: number }) {
  if (total <= 1) return null
  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`)
  return (
    <nav className="ix-pager" aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)} rel="prev">← Newer</Link> : <span />}
      <ol>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n}>{n === page ? <span aria-current="page">{n}</span> : <Link href={href(n)}>{n}</Link>}</li>
        ))}
      </ol>
      {page < total ? <Link href={href(page + 1)} rel="next">Older →</Link> : <span />}
    </nav>
  )
}
