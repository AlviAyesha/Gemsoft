import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ApplyForm from '@/components/cms/ApplyForm'
import Btn, { Diag } from '@/components/cms/Btn'
import CtaBand from '@/components/cms/CtaBand'
import RichText from '@/components/cms/RichText'
import Share from '@/components/cms/Share'
import JsonLd from '@/components/JsonLd'
import { DEPARTMENTS, EMPLOYMENT, WORKPLACE } from '@/content/careers'
import { getJob, openJobs, salaryText } from '@/lib/jobs'
import { fmtDate } from '@/lib/posts'
import { redirectIfMoved } from '@/lib/redirects'
import { breadcrumbs, ORG_ID } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { abs, SITE_NAME } from '@/lib/site'
import { lexicalText } from '@/utilities/lexicalText'

export const revalidate = 3600

type P = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await openJobs().catch(() => [])).map((j) => ({ slug: j.slug! }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled } = await draftMode()
  const job = await getJob(slug, isEnabled)
  if (!job) return {}
  const m = job.meta ?? {}
  const meta = pageMeta({
    title: m.title || `${job.title} | Jobs at GEMSOFT, ${job.location}`,
    description: m.description || job.summary,
    path: `/careers/${slug}`,
    noindex: !!m.noindex || !job.open || isEnabled,
    kicker: 'We are hiring',
  })
  return m.canonical ? { ...meta, alternates: { canonical: m.canonical } } : meta
}

const List = ({ title, items }: { title: string; items?: { item: string; id?: string | null }[] | null }) =>
  items?.length ? (
    <section className="jb-sec">
      <h2 data-up>{title}</h2>
      <ul className="jb-list" data-stagger>
        {items.map((it, i) => <li key={it.id ?? i}>{it.item}</li>)}
      </ul>
    </section>
  ) : null

export default async function JobPage({ params }: P) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const job = await getJob(slug, draft)
  if (!job) {
    await redirectIfMoved(`/careers/${slug}`)
    notFound()
  }
  const closed = !job.open || (job.validThrough && new Date(job.validThrough) < new Date())
  const others = (await openJobs().catch(() => [])).filter((j) => j.id !== job.id).slice(0, 4)
  const salary = salaryText(job)
  const dept = DEPARTMENTS[job.department] ?? job.department
  const url = abs(`/careers/${slug}`)
  const [city, country] = job.location.split(',').map((s) => s.trim())
  const facts: [string, string][] = [
    ['Team', dept],
    ['Type', EMPLOYMENT[job.employmentType]],
    ['Workplace', WORKPLACE[job.workplace]],
    ['Location', job.location],
    ...(job.experience ? ([['Experience', job.experience]] as [string, string][]) : []),
    ...(salary ? ([['Salary', salary]] as [string, string][]) : []),
    ...(job.validThrough ? ([['Apply by', fmtDate(job.validThrough)]] as [string, string][]) : []),
  ]

  return (
    <>
      {draft && (
        <div className="ps-draft">
          Preview of an unpublished version. <a href={`/next/exit-preview?path=/careers/${slug}`}>Leave preview</a>
        </div>
      )}
      <section className="jb-hero" data-hero>
        <div className="wrap">
          <ol className="cx-crumb" data-up>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><span aria-current="page">{job.title}</span></li>
          </ol>
          <span className="cx-kick" data-up>{dept}</span>
          <h1 className="ix-h1 jb-h1" data-chars>{job.title}</h1>
          <ul className="jb-chips" data-up="0.15">
            <li>{EMPLOYMENT[job.employmentType]}</li>
            <li>{WORKPLACE[job.workplace]}</li>
            <li>{job.location}</li>
            {job.experience && <li>{job.experience}</li>}
          </ul>
          <div className="jb-hero-cta" data-up="0.25">
            {closed ? <p className="jb-closed">This role is closed. See the <Link href="/careers#roles">open roles</Link>.</p> : <Btn href="#apply">Apply now</Btn>}
          </div>
        </div>
      </section>

      <div className="wrap jb-body">
        <div className="jb-main">
          <p className="jb-lede" data-up>{job.summary}</p>
          <section className="jb-sec">
            <h2 data-up>About the role</h2>
            <RichText data={job.about} className="jb-rt" />
          </section>
          <List title="What you will do" items={job.responsibilities} />
          <List title="What you bring" items={job.requirements} />
          <List title="Nice to have" items={job.niceToHave} />
        </div>
        <aside className="jb-side">
          <div className="jb-card" data-up>
            <dl>
              {facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            {!closed && <Btn href="#apply">Apply for this role</Btn>}
            <Share url={url} title={`${job.title} at ${SITE_NAME}`} />
          </div>
        </aside>
      </div>

      {!closed && (
        <section className="jb-apply" id="apply">
          <div className="wrap jb-apply-in">
            <div className="jb-apply-h">
              <span className="cx-kick">Apply</span>
              <h2 className="cx-h2" data-chars>Sounds like you?</h2>
              <p data-up>Two minutes, one form. A person on our team reads every application.</p>
            </div>
            <div data-up="0.1">
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="jb-more">
          <div className="wrap">
            <h2 className="cx-h2 cx-h2--sm" data-chars>Other open roles</h2>
            <ul className="cr-list" data-stagger>
              {others.map((o) => (
                <li key={o.id} className="cr-role">
                  <Link href={`/careers/${o.slug}`}>
                    <span className="cr-role-t">{o.title}</span>
                    <span className="cr-role-m">
                      <span>{DEPARTMENTS[o.department]}</span>
                      <span>{EMPLOYMENT[o.employmentType]}</span>
                      <span>{WORKPLACE[o.workplace]} · {o.location}</span>
                    </span>
                    <span className="cr-role-go" aria-hidden="true"><Diag /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand words={['Engineers', 'Designers', 'Marketers', 'Project leads']} title="Questions about the role?" text="Ask us before you apply. We are happy to talk." href="/contact" label="Talk with us" />

      <JsonLd
        data={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: job.title, path: `/careers/${slug}` }]),
          ...(!closed
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'JobPosting',
                  title: job.title,
                  description: [job.summary, lexicalText(job.about), 'Responsibilities: ' + job.responsibilities.map((r) => r.item).join('; '), 'Requirements: ' + job.requirements.map((r) => r.item).join('; ')]
                    .filter(Boolean)
                    .map((t) => `<p>${t.replace(/</g, '&lt;')}</p>`)
                    .join(''),
                  identifier: { '@type': 'PropertyValue', name: SITE_NAME, value: String(job.id) },
                  datePosted: job.datePosted || job.createdAt,
                  validThrough: job.validThrough || undefined,
                  employmentType: job.employmentType,
                  hiringOrganization: { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, sameAs: abs('/'), logo: abs('/brand/icon.png') },
                  jobLocation: job.workplace === 'remote' ? undefined : { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: country === 'Pakistan' ? 'PK' : country } },
                  jobLocationType: job.workplace === 'remote' ? 'TELECOMMUTE' : undefined,
                  applicantLocationRequirements: job.workplace === 'remote' ? { '@type': 'Country', name: country || 'Pakistan' } : undefined,
                  experienceRequirements: job.experience || undefined,
                  baseSalary:
                    job.salary?.min || job.salary?.max
                      ? { '@type': 'MonetaryAmount', currency: job.salary.currency || 'PKR', value: { '@type': 'QuantitativeValue', minValue: job.salary.min || undefined, maxValue: job.salary.max || undefined, unitText: job.salary.period || 'MONTH' } }
                      : undefined,
                  directApply: true,
                  url,
                },
              ]
            : []),
        ]}
      />
    </>
  )
}
