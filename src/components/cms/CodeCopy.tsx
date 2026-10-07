'use client'
import { useState } from 'react'

export default function CodeCopy({ code }: { code: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="rt-copy"
      onClick={() => navigator.clipboard?.writeText(code).then(() => { setDone(true); setTimeout(() => setDone(false), 1600) })}
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  )
}
