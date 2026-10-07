'use client'
import { useState } from 'react'

/** Questions that open one at a time; answers stay in the HTML for search engines. */
export default function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="cx-faq">
      {items.map((it, i) => (
        <div className={`cx-faq-item${open === i ? ' open' : ''}`} key={i}>
          <h3>
            <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} id={`faqb-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              {it.question}
              <span className="cx-faq-ic" aria-hidden="true" />
            </button>
          </h3>
          <div className="cx-faq-body" id={`faq-${i}`} role="region" aria-labelledby={`faqb-${i}`}>
            <div>
              <p>{it.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
