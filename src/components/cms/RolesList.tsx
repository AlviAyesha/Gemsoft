'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Diag } from './Btn'

export type Role = { slug: string; title: string; dept: string; deptLabel: string; type: string; place: string; location: string }

/** Open roles with a department filter. Every role is a real link, so the list stays crawlable. */
export default function RolesList({ roles }: { roles: Role[] }) {
  const [dept, setDept] = useState('all')
  const depts = useMemo(() => [...new Map(roles.map((r) => [r.dept, r.deptLabel])).entries()], [roles])
  const shown = dept === 'all' ? roles : roles.filter((r) => r.dept === dept)
  return (
    <div className="cr-roles">
      {depts.length > 1 && (
        <div className="cr-filter" role="group" aria-label="Filter by team">
          <button type="button" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
            All <sup>{roles.length}</sup>
          </button>
          {depts.map(([k, l]) => (
            <button type="button" key={k} aria-pressed={dept === k} onClick={() => setDept(k)}>
              {l} <sup>{roles.filter((r) => r.dept === k).length}</sup>
            </button>
          ))}
        </div>
      )}
      <ul className="cr-list">
        {shown.map((r) => (
          <li key={r.slug} className="cr-role">
            <Link href={`/careers/${r.slug}`}>
              <span className="cr-role-t">{r.title}</span>
              <span className="cr-role-m">
                <span>{r.deptLabel}</span>
                <span>{r.type}</span>
                <span>{r.place} · {r.location}</span>
              </span>
              <span className="cr-role-go" aria-hidden="true"><Diag /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
