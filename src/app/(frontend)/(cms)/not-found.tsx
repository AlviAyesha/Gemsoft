import Btn from '@/components/cms/Btn'

export default function NotFound() {
  return (
    <section className="nf" data-hero>
      <div className="wrap nf-in">
        <span className="cx-kick">Error 404</span>
        <h1 className="ix-h1" data-chars>This page took<br />a wrong turn.</h1>
        <p className="ix-hero-p" data-up="0.1">The link may be old, or the page has moved. Try one of these instead.</p>
        <div className="cr-hero-cta" data-up="0.2">
          <Btn href="/">Back to home</Btn>
          <Btn href="/insights" tone="ghost">Read insights</Btn>
        </div>
      </div>
    </section>
  )
}
