'use client'
import { useRef, useState } from 'react'
import { Arrow } from './Btn'

// hosts such as Vercel cap request bodies at 4.5 MB
const MAX = 4 * 1024 * 1024
const OK = /\.(pdf|docx?)$/i

/** Application form: details, links and a CV (drag and drop). Sends to /next/apply and shows a thank-you state. */
export default function ApplyForm({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [err, setErr] = useState<Record<string, string>>({})
  const [file, setFile] = useState<File | null>(null)
  const [drag, setDrag] = useState(false)
  const [fail, setFail] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const pick = (f?: File | null) => {
    if (!f) return
    if (!OK.test(f.name)) return setErr((e) => ({ ...e, resume: 'Please upload a PDF or Word file.' }))
    if (f.size > MAX) return setErr((e) => ({ ...e, resume: 'The file is larger than 4 MB.' }))
    setErr((e) => {
      const next = { ...e }
      delete next.resume
      return next
    })
    setFile(f)
  }

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const fd = new FormData(ev.currentTarget)
    const e: Record<string, string> = {}
    if (String(fd.get('name') || '').trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get('email') || ''))) e.email = 'Please enter a valid email.'
    if (!file) e.resume = 'Please attach your CV.'
    setErr(e)
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    fd.set('resume', file!)
    fd.set('job', String(jobId))
    setState('sending')
    setFail('')
    try {
      const r = await fetch('/next/apply', { method: 'POST', body: fd })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || 'Something went wrong.')
      setState('done')
    } catch (x) {
      setFail((x as Error).message)
      setState('idle')
    }
  }

  if (state === 'done')
    return (
      <div className="ap-done" role="status">
        <span className="ap-done-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        </span>
        <h3>Thank you, your application is in.</h3>
        <p>We read every application for {jobTitle} and reply within five working days.</p>
      </div>
    )

  const field = (name: string, label: string, type = 'text', opts: { req?: boolean; auto?: string; ph?: string } = {}) => (
    <label className={`ap-f${err[name] ? ' bad' : ''}`}>
      <span>{label}{opts.req && <i aria-hidden="true">*</i>}</span>
      <input name={name} type={type} required={opts.req} autoComplete={opts.auto} placeholder={opts.ph} aria-invalid={!!err[name]} aria-describedby={err[name] ? `${name}-e` : undefined} />
      {err[name] && <em id={`${name}-e`}>{err[name]}</em>}
    </label>
  )

  return (
    <form className="ap" onSubmit={submit} noValidate>
      <div className="ap-grid">
        {field('name', 'Full name', 'text', { req: true, auto: 'name' })}
        {field('email', 'Email', 'email', { req: true, auto: 'email' })}
        {field('phone', 'Phone', 'tel', { auto: 'tel', ph: '+92 300 0000000' })}
        {field('linkedin', 'LinkedIn', 'url', { ph: 'https://linkedin.com/in/...' })}
        {field('portfolio', 'Portfolio or GitHub', 'url', { ph: 'https://' })}
      </div>
      <div
        className={`ap-drop${drag ? ' over' : ''}${file ? ' has' : ''}${err.resume ? ' bad' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
      >
        <input ref={input} id="ap-cv" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} aria-describedby="ap-cv-h" />
        <label htmlFor="ap-cv">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
          {file ? <b>{file.name}</b> : <b>Drop your CV here or <u>browse</u></b>}
          <span id="ap-cv-h">PDF or Word, up to 4 MB{file ? ' · click to change' : ''}</span>
        </label>
        {err.resume && <em>{err.resume}</em>}
      </div>
      <label className="ap-f ap-f--wide">
        <span>Why this role? <small>(optional)</small></span>
        <textarea name="message" rows={4} maxLength={3000} placeholder="A few lines about you and what you want to work on." />
      </label>
      <label className="ap-hp" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {fail && <p className="ap-fail" role="alert">{fail}</p>}
      <div className="ap-foot">
        <button type="submit" className="btn btn--red" disabled={state === 'sending'}>
          <span className="roll"><span>{state === 'sending' ? 'Sending...' : 'Send application'}</span><span aria-hidden="true">{state === 'sending' ? 'Sending...' : 'Send application'}</span></span>
          <Arrow />
        </button>
        <p>We use your details only for this application.</p>
      </div>
    </form>
  )
}
