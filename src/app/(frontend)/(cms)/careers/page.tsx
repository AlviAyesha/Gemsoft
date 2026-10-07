import Link from 'next/link'
import Btn from '@/components/cms/Btn'
import CtaBand from '@/components/cms/CtaBand'
import Faq from '@/components/cms/Faq'
import RolesList from '@/components/cms/RolesList'
import JsonLd from '@/components/JsonLd'
import { DEPARTMENTS, EMPLOYMENT, FAQ, LIFE, PERKS, STATEMENT, STEPS, WORKPLACE } from '@/content/careers'
import { openJobs } from '@/lib/jobs'
import { getSettings } from '@/lib/payload'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { abs } from '@/lib/site'

export const revalidate = 3600

export const metadata = pageMeta({
  title: 'Careers at GEMSOFT | Jobs in Lahore and Remote',
  description: 'Join GEMSOFT Technologies. Open roles in engineering, design and marketing, how we hire, and what it is like to work with us.',
  path: '/careers',
  kicker: 'Careers',
})

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([openJobs().catch(() => []), getSettings().catch(() => null)])
  const email = settings?.contact?.careersEmail || settings?.contact?.email || 'careers@gemsoft.example'
  const roles = jobs.map((j) => ({
    slug: j.slug!,
    title: j.title,
    dept: j.department,
    deptLabel: DEPARTMENTS[j.department] ?? j.department,
    type: EMPLOYMENT[j.employmentType],
    place: WORKPLACE[j.workplace],
    location: j.location,
  }))
  const teams = new Set(jobs.map((j) => j.department)).size
  return (
    <>
      <section className="cr-hero" data-hero>
        <div className="cr-hero-pics" aria-hidden="true">
          {LIFE.slice(0, 3).map((p, i) => (
            <figure key={p.src} className={`cr-pic cr-pic--${i + 1}`} data-clip>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" width={640} height={427} fetchPriority={i === 0 ? 'high' : undefined} />
            </figure>
          ))}
        </div>
        <div className="wrap cr-hero-in">
          <ol className="cx-crumb" data-up>
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">Careers</span></li>
          </ol>
          <span className="cx-kick" data-up>Careers</span>
          <h1 className="ix-h1 cr-h1" data-chars>Do the best work<br />of your life.</h1>
          <p className="ix-hero-p" data-up="0.1">Build websites, apps and software that thousands of people use, with a team that helps you grow.</p>
          <div className="cr-hero-cta" data-up="0.2">
            <Btn href="#roles">See open roles</Btn>
            <Btn href={`mailto:${email}`} tone="ghost" ext>Send your CV</Btn>
          </div>
          <ul className="ix-stats" data-up="0.3">
            <li><b data-count={jobs.length}>{jobs.length}</b> open {jobs.length === 1 ? 'role' : 'roles'}</li>
            {teams > 0 && <li><b data-count={teams}>{teams}</b> {teams === 1 ? 'team' : 'teams'} hiring</li>}
            <li>Lahore and remote</li>
          </ul>
        </div>
        <div className="ix-hero-scroll" aria-hidden="true"><i /></div>
      </section>

      <section className="cr-state">
        <div className="wrap">
          <span className="cx-kick cx-kick--dark" data-up>Why join us</span>
          <p className="cr-statement" data-fill>{STATEMENT}</p>
        </div>
      </section>

      <section className="cr-perks">
        <div className="wrap">
          <div className="cr-sec-h">
            <h2 className="cx-h2" data-chars>What you get</h2>
            <p data-up>The basics done right, so you can focus on the work.</p>
          </div>
          <ul className="cr-perk-grid" data-stagger>
            {PERKS.map((p) => (
              <li key={p.title} className="cr-perk">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-draw>
                  <path d={p.icon} />
                </svg>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cr-life" aria-label="Life at GEMSOFT">
        <div className="cr-life-row" data-drift="-22">
          {LIFE.map((p, i) => (
            <figure key={p.src} className={`cr-life-pic${i % 2 ? ' cr-life-pic--lo' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" width={640} height={427} />
            </figure>
          ))}
        </div>
      </section>

      <section className="cr-open" id="roles">
        <div className="wrap">
          <div className="cr-sec-h">
            <h2 className="cx-h2" data-chars>Open roles</h2>
            <p data-up>{roles.length ? 'Pick a role to see the details and apply in two minutes.' : 'No roles are open right now. Send us your CV and we will reach out when one fits.'}</p>
          </div>
          {roles.length > 0 ? (
            <RolesList roles={roles} />
          ) : (
            <div className="cr-none" data-up>
              <p>We are not hiring for a specific role today, but good people are always welcome.</p>
              <Btn href={`mailto:${email}?subject=General%20application`} ext>Send a general application</Btn>
            </div>
          )}
        </div>
      </section>

      <section className="cr-steps">
        <div className="wrap">
          <div className="cr-sec-h">
            <h2 className="cx-h2" data-chars>How we hire</h2>
            <p data-up>Four steps, clear answers, and no ghosting.</p>
          </div>
          <ol className="cr-step-list">
            <span className="cr-step-line" data-line aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="cr-step" data-up={String(i * 0.1)}>
                <span className="cr-step-n">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cr-faq">
        <div className="wrap cr-faq-in">
          <div>
            <span className="cx-kick cx-kick--dark" data-up>FAQ</span>
            <h2 className="cx-h2" data-chars>Before you apply</h2>
            <p className="cr-faq-p" data-up>Anything else? Write to <a href={`mailto:${email}`}>{email}</a>.</p>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      <CtaBand words={['Engineers', 'Designers', 'Marketers', 'Project leads', 'Interns']} title="Don't see your role?" text="Send a general application and we will contact you when something fits." href={`mailto:${email}?subject=General%20application`} label="Send your CV" />

      <JsonLd
        data={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Open roles at GEMSOFT',
            itemListElement: roles.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/careers/${r.slug}`), name: r.title })),
          },
          { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
        ]}
      />
    </>
  )
}
