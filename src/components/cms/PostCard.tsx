import Link from 'next/link'
import type { Post } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { firstCategory, fmtDate } from '@/lib/posts'
import { Diag } from './Btn'

/** Insight card: cover zooms and the arrow turns on hover, category and reading time above the title. */
export default function PostCard({ post, size = 'card', priority }: { post: Post; size?: 'card' | 'wide'; priority?: boolean }) {
  const cat = firstCategory(post)
  return (
    <article className={`ix-card${size === 'wide' ? ' ix-card--wide' : ''}`}>
      <Link href={`/insights/${post.slug}`} className="ix-card-img" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(post.heroImage, size === 'wide' ? 'wide' : 'card')} alt={mediaAlt(post.heroImage)} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} width={960} height={640} />
        <span className="ix-go"><Diag /></span>
      </Link>
      <div className="ix-card-body">
        <div className="ix-meta">
          {cat && <Link href={`/insights/category/${cat.slug}`} className="ix-tag">{cat.title}</Link>}
          <span>{fmtDate(post.publishedAt)}</span>
          <span>{post.readingTime ?? 1} min read</span>
        </div>
        <h3 className="ix-card-t">
          <Link href={`/insights/${post.slug}`}>{post.title}</Link>
        </h3>
        {size === 'wide' && <p className="ix-card-x">{post.excerpt}</p>}
      </div>
    </article>
  )
}
