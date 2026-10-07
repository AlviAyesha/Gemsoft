import Link from 'next/link'
import type { Category } from '@/payload-types'

/** Topic bar under the hero; sticks below the nav while browsing. */
export default function Topics({ cats, current }: { cats: Category[]; current?: string }) {
  if (!cats.length) return null
  return (
    <nav className="ix-topics" aria-label="Insight topics">
      <div className="wrap ix-topics-in">
        <Link href="/insights" className="ix-topic" aria-current={!current ? 'page' : undefined}>All</Link>
        {cats.map((c) => (
          <Link key={c.id} href={`/insights/category/${c.slug}`} className="ix-topic" aria-current={current === c.slug ? 'page' : undefined}>
            {c.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
