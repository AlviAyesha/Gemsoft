import Btn from './Btn'

/** Closing band: a slow marquee of words and a big call to action. */
export default function CtaBand({ words, title, text, href = '/contact', label = 'Start a project' }: { words: string[]; title: string; text?: string; href?: string; label?: string }) {
  const row = [...words, ...words, ...words]
  return (
    <section className="cx-cta">
      <div className="cx-mq" aria-hidden="true">
        <div className="cx-mq-row">{row.concat(row).map((w, i) => <span key={i}>{w}<i>✦</i></span>)}</div>
      </div>
      <div className="wrap cx-cta-in">
        <h2 className="cx-h2" data-chars>{title}</h2>
        {text && <p data-up>{text}</p>}
        <div data-up="0.15"><Btn href={href}>{label}</Btn></div>
      </div>
    </section>
  )
}
