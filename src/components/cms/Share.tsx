'use client'
import { useState } from 'react'

/** Share to LinkedIn, X, WhatsApp, or copy the link. */
export default function Share({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url), t = encodeURIComponent(title)
  return (
    <div className="ps-share">
      <span className="ps-side-l">Share</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">in</a>
      <a href={`https://x.com/intent/post?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">wa</a>
      <button type="button" onClick={() => navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })} aria-label="Copy link">
        {copied ? '✓' : '⧉'}
      </button>
    </div>
  )
}
